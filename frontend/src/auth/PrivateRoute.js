// src/auth/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Unauthorized from './Unauthorized';

const PrivateRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(auth.role)) {
    // Role not authorized, show Unauthorized component
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
