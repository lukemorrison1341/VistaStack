import React, { createContext, useState, useEffect } from "react";
import { useDeviceAPI } from "../services/api";

export const ConnectionContext = createContext();


export function ConnectionProvider({ children }) {
    const [frontendConnect, setFrontendConnect] = useState(false);
    const [backendConnect, setBackendConnect] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);

    const [ getDeviceData,
      checkDeviceStatus,
      checkFrontendStatus,
      updateDeviceSettings,
      updateVent] = useDeviceAPI();
  
    useEffect(() => {
      const fetchStatuses = async () => {
        console.log("Checking device and frontend status...");
        const backendStatus = await checkDeviceStatus(localStorage.getItem("username"));
        const frontendStatus = await checkFrontendStatus();

        setBackendConnect(backendStatus === "online");
        setFrontendConnect(frontendStatus.status === "success");
      };
  
      fetchStatuses(); // Run immediately
      const interval = setInterval(fetchStatuses, 30000); // Run every 30 sec
      return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        setDeviceConnected(frontendConnect || backendConnect);
    },[frontendConnect,backendConnect])

    return (
      <ConnectionContext.Provider value={{ frontendConnect, backendConnect, deviceConnected, setDeviceConnected, setBackendConnect, setFrontendConnect }}>
        {children}
      </ConnectionContext.Provider>
    );
}