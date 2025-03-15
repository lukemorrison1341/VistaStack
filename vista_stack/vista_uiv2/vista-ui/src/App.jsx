import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { ConnectionProvider } from './components/ConnectionContext';
import { DeviceProvider } from './components/DataContext';
function App() {

  
  return (
    
    <ConnectionProvider>
      <DeviceProvider>
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
      </DeviceProvider>
    </ConnectionProvider>
    
  );
}

export default App;
