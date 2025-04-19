import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Only need to check the token from Redux state now
  const token = useSelector((state) => state.auth.token);
  // Optionally, you could also check for state.user if needed
  // const { user } = useSelector((state) => state.user);

  if (token) { // Check if token exists in Redux state
    // If token exists, render the child component (the protected route)
    return children;
  } else {
    // If no token in state, redirect to the login page
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute; 