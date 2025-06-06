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

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        pir INTEGER CHECK (pir IN (0,1)) DEFAULT NULL, -- NULL until updated
        vent INTEGER CHECK (vent IN (0,1)) DEFAULT NULL, -- NULL until updated
        humidity REAL DEFAULT NULL, -- NULL until updated
        temp REAL DEFAULT NULL, -- NULL until updated
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error("Error creating data table:", err.message);
        } else {
            console.log("Table 'data' created or already exists.");
        }
    });
});



db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS device_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        min_temp INTEGER NOT NULL,
        max_temp INTEGER NOT NULL,
        min_humidity INTEGER NOT NULL,
        max_humidity INTEGER NOT NULL,
        motion_detection_enabled INTEGER CHECK(motion_detection_enabled IN (0, 1)) DEFAULT 1,
        eco_mode_enabled INTEGER CHECK(eco_mode_enabled IN (0, 1)) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.use(express.json());
app.use(cors());


//FRONTEND ENDPOINTS:

// Test API Route
app.get("/", (req, res) => {
    res.json({ message: "Enter username and password." });
});


app.post("/api/send-config", (req, res) => {
    console.log("Updating config /api/send-config");
    const {
        username,
        min_temp,
        max_temp,
        min_humidity,
        max_humidity,
        motion_detection_enabled,
        eco_mode_enabled
    } = req.body;

    if (
        !username ||
        min_temp === undefined ||
        max_temp === undefined ||
        min_humidity === undefined ||
        max_humidity === undefined ||
        motion_detection_enabled === undefined ||
        eco_mode_enabled === undefined
    ) {
        return res.status(400).json({ error: "Missing one or more required fields." });
    }

    // Check if a config already exists for this username
    db.get("SELECT id FROM device_config WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.error("DB read error:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (row) {
            // Update existing config
            db.run(
                `UPDATE device_config SET 
                    min_temp = ?, 
                    max_temp = ?, 
                    min_humidity = ?, 
                    max_humidity = ?, 
                    motion_detection_enabled = ?, 
                    eco_mode_enabled = ?, 
                    updated_at = CURRENT_TIMESTAMP 
                 WHERE username = ?`,
                [min_temp, max_temp, min_humidity, max_humidity, motion_detection_enabled, eco_mode_enabled, username],
                function (err) {
                    if (err) {
                        console.error("Update Config DB Error:", err.message);
                        return res.status(500).json({ error: "Failed to update config" });
                    }
                    res.status(200).json({ message: "Configuration updated successfully" });
                }
            );
        } else {
            // Insert new config
            db.run(
                `INSERT INTO device_config 
                    (username, min_temp, max_temp, min_humidity, max_humidity, motion_detection_enabled, eco_mode_enabled, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [username, min_temp, max_temp, min_humidity, max_humidity, motion_detection_enabled, eco_mode_enabled],
                function (err) {
                    if (err) {
                        console.error("Insert Config DB Error:", err.message);
                        return res.status(500).json({ error: "Failed to insert config" });
                    }
                    res.status(200).json({ message: "Configuration saved successfully", config_id: this.lastID });
                }
            );
        }
    });
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
            return res.status(200).json({pir: row.pir, temp: row.temp, humid: row.humidity});
            
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

        const online = timeDiff <= 180; //If last check-in was within 3 minutes, it's online

        res.json({ username, status: online ? "online" : "offline", last_seen: row.last_seen });
    });
});



//ESP32 ENDPOINTS

//Simple API endpoint test to check that the backend is alive (on ESP32 startup)
app.get("/api/test", (req, res) => {
    console.log("Backened checked to see if it is online.(/api/test)");
    return res.status(200).json({status: "online"});

});


//ESP32 retrieves config if web app updated it.
app.get("/api/get_config", (req, res) => {
    console.log("Got ESP32 device config GET request");
    const {username} = req.body;

    if (!username) {
        return res.status(400).json({ error: "Missing username in query parameters." });
    }

    db.get(
        "SELECT min_temp, max_temp, min_humidity, max_humidity, motion_detection_enabled, eco_mode_enabled, updated_at FROM device_config WHERE username = ? ORDER BY updated_at DESC LIMIT 1",
        [username],
        (err, row) => {
            if (err) {
                console.error("Database error in /api/get_config:", err.message);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!row) {
                return res.status(404).json({ error: "No config found for this user." });
            }

            res.json({ username, ...row });
        }
    );

});


app.post("/api/data", (req, res) => { //ESP32 sends data here 
    const { username, temperature, pir, humidity, vent } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Missing required field (username). (/api/data)" });
    }

    // Check if user already exists in the data table
    db.get("SELECT * FROM data WHERE username = ? ORDER BY registered_at DESC LIMIT 1", [username], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (row) {
            // User exists – update their most recent data row
            db.run(
                `UPDATE data SET 
                    temp = ?, 
                    pir = ?, 
                    humidity = ?, 
                    vent = ?, 
                    registered_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [temperature, pir, humidity, vent, row.id],
                function (err) {
                    if (err) {
                        console.error("Update error:", err);
                        return res.status(500).json({ error: "Failed to update data" });
                    }
                    return res.status(200).json({ message: "Data updated successfully" });
                }
            );
        } else {
            // No entry exists for this user – insert new row
            db.run(
                `INSERT INTO data (username, temp, pir, humidity, vent) VALUES (?, ?, ?, ?, ?)`,
                [username, temperature, pir, humidity, vent],
                function (err) {
                    if (err) {
                        console.error("Insert error:", err);
                        return res.status(500).json({ error: "Failed to insert data" });
                    }
                    return res.status(200).json({ message: "Data inserted successfully" });
                }
            );
        }
    });
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