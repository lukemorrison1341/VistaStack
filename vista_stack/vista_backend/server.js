require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to SQLite database
const db = new sqlite3.Database("./vista.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});


// Create `devices` table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        device_name TEXT NOT NULL,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});
// Create table for tracking device status (device should send heartbeat every 1-2 minutes)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS device_status (
        username TEXT PRIMARY KEY,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            pir INTEGER CHECK (pir IN (0,1)) DEFAULT NULL, -- NULL until updated
            mode INTEGER CHECK (pir IN (0,1)) DEFAULT NULL, -- NULL until updated
            temp REAL DEFAULT NULL, -- NULL until updated
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        )`)


});


app.use(express.json());
app.use(cors());


//FRONTEND ENDPOINTS:

// Test API Route
app.get("/", (req, res) => {
    res.json({ message: "Enter username and password." });
});


app.post("/api/user-login", (req, res) => {
    const { username, password } = req.body;
    console.log("Backend Username: " + username + "password: " + password);
    // Validate request
    if (!username || !password) {
        console.log("Fail: Missing required fields.");
        return res.status(400).json({ status: "fail", error: "Missing required fields." });
    }

    // Check if user exists in the database
    db.get("SELECT * FROM devices WHERE TRIM(username) = TRIM(?) AND TRIM(password) = TRIM(?) COLLATE NOCASE", [username, password], (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }

        if (row) {
            // User found, return success with IP
            console.log("User found. /api/user-login");
            return res.status(200).json({ status: "success", ip: row.ip, device_name: row.device_name });
            
        } else {
            // User not found
            console.log("Fail: User not found. /api/user-login");
            return res.status(404).json({ status: "fail", error: "User not found." });
        }
    });
});







app.post("/api/relay", (req, res) => { //POST to this endpoint from frontend when direct connection to ESP32 fails (Send all data)
    const { username} = req.body;
    if (!username) {
        return res.status(400).json({ error: "Missing required fields (username)." });
    }
    
    db.get("SELECT * FROM data WHERE TRIM(username) = TRIM(?) COLLATE NOCASE", [username], (err,row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }
        if (row) {
            // User found, return success with IP
            console.log("User found.(/api/relay)");
            return res.status(200).json({pir: row.pir, temp: row.temp});
            
        }
    });

});

//Get heartbeat status from user
app.get("/api/device-status/:username", (req, res) => {
    const { username } = req.params;
    console.log(`Checking status for username: "${username}"`); // Debugging

    db.get("SELECT last_seen FROM device_status WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.log("Error in /api/device-status/:username:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        if (!row) {
            console.log(`User "${username}" not found in /api/device-status/:username`);
            return res.status(404).json({ status: "offline" });
        }

        console.log(`User "${username}" found. Last Seen: ${row.last_seen}`);

        const lastSeenTime = new Date(row.last_seen);
        const currentTime = new Date();
        const timeDiff = (currentTime - lastSeenTime) / 1000; // Difference in seconds

        const online = timeDiff <= 60; //If last check-in was within 2 minutes, it's online

        res.json({ username, status: online ? "online" : "offline", last_seen: row.last_seen });
    });
});



//ESP32 ENDPOINTS

//Simple API endpoint test to check that the backend is alive (on ESP32 startup)
app.get("/api/test", (req, res) => {
    console.log("Backened checked to see if it is online.(/api/test)");
    return res.status(200).json({status: "online"});

});


// **POST: Receive IP, Username, Password, Device Name from ESP32 to register itself, save user information in database.  
app.post("/api/device-config", (req, res) => {
    const { ip, username, password, device_name } = req.body;
    console.log(`Username: ${username}, Password: ${password}, IP: ${ip}, Device Name: ${device_name}`);
    // Validate input
    if (!ip || !username || !password || !device_name) {
        return res.status(400).json({ error: "Missing required fields(no ip, username, password or device name for device-config endpoint.)" });
    }

    db.get("SELECT * FROM devices WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            // If the username and password exist, update the IP
            db.run("UPDATE devices SET ip = ? WHERE username = ? AND password = ?", [ip, username, password], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "Updated IP for existing user." });
            });
        } else {
            // If the username and password do not exist, insert a new entry
            db.run("INSERT INTO devices (ip, username, password, device_name) VALUES (?, ?, ?, ?)", [ip, username, password, device_name], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });

            db.run("INSERT INTO data (username) VALUES (?)", [username], function (err){
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "Inserted new device", device_id: this.lastID });
            });
        }
    });
    
});



app.post("/api/data/pir", (req, res) => {
    const {username,pir} = req.body;
    if(pir == undefined){
        console.log("Fail: Missing required fields.");
        return res.status(400).json({ status: "fail", error: "Missing required fields." });
    }

    db.get("SELECT * FROM data WHERE TRIM(username) = TRIM(?) COLLATE NOCASE", [username], (err,row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }
        if (row) {
            // User found, return success with IP
            //console.log("User found. (/api/data/pir)");
            row.pir = pir;
            return res.status(200).json({status: "success"});
            
        }

        

    })

});


app.post("/api/ip" ,(req, res) => {
    console.log("Updating IP for frontend");
    const username = req.body;
        if(!username){
            return res.status(400).json({ error: "Missing required fields (username)." });
        }
        db.get("SELECT * FROM devices WHERE TRIM(username) = TRIM(?) COLLATE NOCASE", [username], (err,row) => {
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).json({ status: "fail", error: err.message });
            }
            if (row) {
                // User found, return success with IP
                console.log("User found (/api/ip).");
                return res.status(200).json({ip: row.ip});
                
            }
        });

})

app.post("/api/status" ,(req, res) => { //Heartbeat endpoint
    console.log("/api/status request body:",req.body);
    let { username } = req.body;

    if(!username){
        console.log("Missing required fields (username) /api/status")
        return res.status(400).json({status: "fail"});
    }
    // Ensure `username` is a string
    if (typeof username !== "string") {
        console.error("Invalid username format:", username);
        return res.status(400).json({ error: "Invalid username format" });
    }


   

    const now = new Date().toISOString()    ;
    console.log("Device " + "registering itself at " + now);


    db.run(
        "INSERT INTO device_status (username, last_seen) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET last_seen = ?",
        [username, now, now],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({last_seen: now });
        }
    );

})





// **Start Server** (listen to any connection from outside devices)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});