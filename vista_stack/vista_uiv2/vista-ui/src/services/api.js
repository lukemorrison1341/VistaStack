import axios from "axios";

const API_BASE_URL = "http://localhost:4010"; // Update as needed

export const getDeviceData = async (username, frontendConnect, backendConnect) => {
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

export const checkDeviceStatus = async (username) => {
  try {
    console.log("Checking Device Status");
    const response = await axios.get(`${API_BASE_URL}/api/device-status/${username}`);
    return response.data.status; // ✅ Returns "online" or "offline"
  } catch (error) {
    console.error("Error checking device status:", error);
    return "offline"; // ✅ Assume offline if request fails
  }
};

export const checkFrontendStatus = async () => {
  try {
    const esp32IP = localStorage.getItem("userIP");
    if (!esp32IP) {
      console.warn("No ESP32 IP found in localStorage.");
      return { status: "fail", message: "No stored IP address" };
    }

    const response = await axios.get(`http://${esp32IP}/api/test`);
    return { status: response.data.status === "success" ? "success" : "fail", message: "ESP32 is reachable" };
  } catch (error) {
    console.error("ESP32 connection test failed:", error);
    return { status: "fail", message: "ESP32 is unreachable" };
  }
};

export const updateDeviceSettings = async (key, value) => {
  switch (key) {
    case "vent":
      return await updateVent(value);
    default:
      console.log("Invalid Device Update");
      return null;
  }
};

export const updateVent = async (value, deviceConnected, frontendConnect) => {
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

export const loginUser = async (username, password) => {
  try {
    console.log("Attempting login for:", username);
    const response = await axios.post(`${API_BASE_URL}/api/user-login`, { username, password });
    return response.data; // ✅ Returns either { status: "success", ip, device_name } or { status: "fail" }
  } catch (error) {
    console.error("API Error (loginUser):", error);
    return { status: "fail", error: "Login failed. Please check your credentials." };
  }
};
