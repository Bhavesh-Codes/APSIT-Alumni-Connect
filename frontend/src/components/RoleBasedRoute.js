import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function RoleBasedRoute({ children, roleRequired }) {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== roleRequired) {
    // --- THIS IS THE CHANGE ---
    return <Navigate to="/home" replace />; // Was "/dashboard"
  }

  return children;
}

export default RoleBasedRoute;
