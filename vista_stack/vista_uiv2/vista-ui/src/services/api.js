import axios from 'axios';

const API_BASE_URL = 'http://vista-ucf.com/:5000';

// Function to send login request
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user-login`, { username, password });
    return response.data; // Returns either { status: "success", ip, device_name } or { status: "fail" }
  } catch (error) {
    console.error('API Error (loginUser):', error);
    throw error; // Throw error for handling in SignIn.jsx
  }
};
