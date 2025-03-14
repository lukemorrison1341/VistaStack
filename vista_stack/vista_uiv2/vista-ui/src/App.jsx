import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { ConnectionProvider } from './components/ConnectionContext';
import { useDeviceAPI } from './services/api';
function App() {

  const connectionCheck = () => {
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

  }
  
  return (
    <ConnectionProvider>
      <connectionCheck/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />   
        </Routes>
      </BrowserRouter>
    </ConnectionProvider>
  );
}

export default App;
