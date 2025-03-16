import React, { createContext, useState, useEffect, useContext } from "react";
import { updateDeviceConfig, getDeviceData } from "../services/api";
import { ConnectionContext } from "./ConnectionContext";

export const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const { frontendConnect, backendConnect, deviceConnected } = useContext(ConnectionContext);

  // ✅ Real-time Sensor Data (Fetched from ESP32)
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  // ✅ Configuration Settings (To Be Sent in Batch Updates)
  const [minHumidity, setMinHumidity] = useState(40);
  const [maxHumidity, setMaxHumidity] = useState(70);
  const [minTemperature, setMinTemperature] = useState(65);
  const [maxTemperature, setMaxTemperature] = useState(80);
  const [ventStatus, setVentStatus] = useState("closed");
  const [deviceMode, setDeviceMode] = useState("vacant");

  // ✅ Track if there are pending updates
  const [hasPendingUpdate, setHasPendingUpdate] = useState(false);

  // ✅ Fetch Real-time Sensor Data
  useEffect(() => {
    const fetchDeviceData = async () => {
      console.log("🔄 Running fetchDeviceData...");

      if (frontendConnect) {
        console.log("📡 Frontend Connected, Fetching Data...");
        
        const data = await getDeviceData(localStorage.getItem("username"), frontendConnect, backendConnect);
        
        if (data) {
          setTemperature(data.temp);
          setHumidity(data.humid);
          setVentStatus(data.ventStatus || "closed");

          console.log("🌡 Temperature (Updated):", data.temp);
          console.log("💧 Humidity (Updated):", data.humid);
        } else {
          console.warn("⚠️ Data NULL returned from getDeviceData");
        }
      } else if (backendConnect) {
        console.log("⚙️ Backend Connection Active - Implement Backend Data Fetch");
      } else {
        console.warn("❌ No Connection Available - Cannot Fetch Data");
      }
    };
    
    fetchDeviceData(); // ✅ Runs immediately
    const interval = setInterval(fetchDeviceData, 30000); // ✅ Runs every 30 sec

    return () => clearInterval(interval); // ✅ Cleanup interval on unmount
  }, [frontendConnect, backendConnect]); // ✅ Runs when connection changes

  useEffect(() => { //ISSUE: Will send "as soon" as a change happens(but on an interval), meaning it usually doesn't send the new value.
    console.log("⏳ useEffect triggered at", new Date().toLocaleTimeString());
  
    const fetchAndUpdate = async () => {
      console.log("⏰ Checking if update is needed at", new Date().toLocaleTimeString());
  
      if (hasPendingUpdate) {
       
        await updateDeviceConfig({
          mode: deviceMode,
          min_temp: minTemperature,
          max_temp: maxTemperature,
          min_humid: minHumidity,
          max_humid: maxHumidity,
          vent_status: ventStatus,
        });
  
        setHasPendingUpdate(false); // ✅ Reset update flag
      } else {
        console.log("❌ No pending update at", new Date().toLocaleTimeString());
      }
    };
  
    // ✅ Run Immediately Before Starting Interval
    fetchAndUpdate();
  
    // ✅ Set Up Interval to Run Every 5 Seconds
    const interval = setInterval(fetchAndUpdate, 5000);
  
    return () => {
      console.log("🛑 Cleaning up interval at", new Date().toLocaleTimeString());
      clearInterval(interval);
    };
  }, [frontendConnect, backendConnect, hasPendingUpdate]); // ✅ Runs only when needed
  // ✅ Track Changes & Queue Update
  const updateState = (setter) => (value) => {
    setter(value);
    setHasPendingUpdate(true); // ✅ Marks update as pending
  };

  return (
    <DeviceContext.Provider value={{ 
      temperature, humidity, // ✅ Real-time values
      minHumidity, maxHumidity, minTemperature, maxTemperature, ventStatus, deviceMode,
      setTemperature, setHumidity, // ✅ Real-time setters
      setMinHumidity: updateState(setMinHumidity),
      setMaxHumidity: updateState(setMaxHumidity),
      setMinTemperature: updateState(setMinTemperature),
      setMaxTemperature: updateState(setMaxTemperature),
      setVentStatus: updateState(setVentStatus),
      setDeviceMode: updateState(setDeviceMode),
    }}>
      {children}
    </DeviceContext.Provider>
  );
}
