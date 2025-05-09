import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;