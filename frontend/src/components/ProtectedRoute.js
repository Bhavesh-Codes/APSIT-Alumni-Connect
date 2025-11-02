import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // --- THIS IS THE NEW LOGIC ---
  const { isLoggedIn, loading } = useAuth();

  // 1. If we are still loading, render nothing (a "loading"
  //    spinner could go here, but "null" works perfectly)
  if (loading) {
    return null;
  }

  // 2. If we are NOT loading, and NOT logged in, redirect
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. If we are NOT loading and ARE logged in, show the page
  return children;
  // --- END OF NEW LOGIC ---
}

export default ProtectedRoute;