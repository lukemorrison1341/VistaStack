import { useContext } from "react";
import { ConnectionContext } from "../components/ConnectionContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:4010"; // Update as needed

export function useDeviceAPI() {
  const { frontendConnect, backendConnect, deviceConnected, setFrontendConnect, setBackendConnect, setDeviceConnected } =
    useContext(ConnectionContext);

  const getDeviceData = async (username) => {
    try {
      console.log("Getting Device Data");

      if (frontendConnect) {
        const esp32IP = localStorage.getItem("userIP");
        const response = await axios.get(`${esp32IP}/api/component/data`);
        return { pir: response.data.pir, temp: response.data.temp, humid: response.data.humid, vent: response.data.vent };
      } else if (backendConnect) {
        console.log("Fetching device data from backend...");
        const response = await axios.get(`${API_BASE_URL}/api/device-data/${username}`);
        return response.data;
      } else {
        console.log("Device not connected!!!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
      return null;
    }
  };

  const checkDeviceStatus = async (username) => {
    try {
      console.log("Checking Device Status");
      const response = await axios.get(`${API_BASE_URL}/api/device-status/${username}`);
      setBackendConnect(response.data.status === "online");
      return response.data.status;
    } catch (error) {
      console.error("Error checking device status:", error);
      return "offline";
    }
  };

  const checkFrontendStatus = async () => {
    try {
      const esp32IP = localStorage.getItem("userIP");
      if (!esp32IP) {
        console.warn("No ESP32 IP found in localStorage.");
        return { status: "fail", message: "No stored IP address" };
      }

      const response = await axios.get(`http://${esp32IP}/api/test`);

      if (response.data.status === "success") {
        setFrontendConnect(true);
        return { status: "success", message: "ESP32 is reachable" };
      } else {
        return { status: "fail", message: "Unexpected response from ESP32" };
      }
    } catch (error) {
      setFrontendConnect(false);
      console.error("ESP32 connection test failed:", error);
      return { status: "fail", message: "ESP32 is unreachable" };
    }
  };

  const updateDeviceSettings = async (key, value) => {
    switch (key) {
      case "vent":
        return await updateVent(value);
      default:
        console.log("Invalid Device Update");
        return null;
    }
  };

  const updateVent = async (value) => {
    if (!deviceConnected) {
      console.log("Device not connected...cannot send request to servo to open");
      return;
    }

    if (!frontendConnect) {
      console.log("Cannot open/close vent, implement backend relay");
      return;
    }

    console.log("Frontend servo update");
  };

  return {
    getDeviceData,
    checkDeviceStatus,
    checkFrontendStatus,
    updateDeviceSettings,
    updateVent,
  };
}
