import React, { createContext, useState, useEffect, useContext } from "react";
import { getDeviceData } from "../services/api";
import { ConnectionContext } from "./ConnectionContext"; // ✅ Import connection context

export const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const { frontendConnect, backendConnect, deviceConnected } = useContext(ConnectionContext); // ✅ Get connection status
  /*
    Initial Values
  */
  const [temperature, setTemperature] = useState(72); 
  const [maxTemperature, setMaxTemperature] = useState(80);
  const [minTemperature, setMinTemperature] = useState(60);
  const [maxHumidity, setMaxHumidity] = useState(60);
  const [minHumidity, setMinHumidity] = useState(40);
  const [humidity, setHumidity] = useState(50);
  const [deviceMode, setDeviceMode] = useState("eco");
  const [ventStatus, setVentStatus] = useState("closed");
  const [motionDetection, setMotionDetection] = useState("no motion");

  useEffect(() => {
    const fetchDeviceData = async () => {
      console.log("🔄 Running fetchDeviceData...");

      if (frontendConnect) {
        console.log("📡 Frontend Connected, Fetching Data...");
        
        const data = await getDeviceData(localStorage.getItem("username"), frontendConnect, backendConnect);
        
        if (data) {
          setTemperature(data.temp);
          setHumidity(data.humid);
          setMotionDetection(data.pir === 0 ? "no motion" : "motion");

          console.log("🌡 Temp (Updated):", data.temp);
          console.log("💧 Humidity (Updated):", data.humid);
          console.log("🚶 Motion Detected (Updated):", data.pir === 0 ? "no motion" : "motion");
        } else {
          console.warn("⚠️ Data NULL returned from getDeviceData");
        }
      } else if (backendConnect) {
        console.log("⚙️ Backend Connection Active - Implement Backend Data Fetch");
      } else {
        console.warn("❌ No Connection Available - Cannot Fetch Data");
      }
    };

    fetchDeviceData(); // ✅ Runs on mount
    const interval = setInterval(fetchDeviceData, 30000); // ✅ Runs every 30 sec

    return () => clearInterval(interval); // ✅ Cleanup interval on unmount
}, [frontendConnect, backendConnect]); // ✅ Runs when connection status changes

  /*


  */

  return (
    <DeviceContext.Provider value={{
      temperature, maxHumidity, minHumidity, humidity, setHumidity, deviceMode,
      setTemperature, setMaxHumidity, setMinHumidity, setDeviceMode, ventStatus, setVentStatus
    }}>
      {children}
    </DeviceContext.Provider>
  );
}
