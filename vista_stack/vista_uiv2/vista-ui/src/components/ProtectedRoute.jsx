import React from 'react';
import { Navigate } from 'react-router-dom';

// A function that checks if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Returns true if a token exists
};

export default function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}
