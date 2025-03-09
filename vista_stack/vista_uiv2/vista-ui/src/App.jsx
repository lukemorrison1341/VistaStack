import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
//import UserSettings from './pages/UserSettings';
//import DeviceControls from './pages/DeviceControls';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
function App() {
  return (
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
  );
}

export default App;
