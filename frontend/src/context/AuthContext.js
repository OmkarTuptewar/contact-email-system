// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const AuthContext = createContext();

// Hardcoded credentials (for demonstration purposes)
const adminCredentials = {
  password: 'admin123',
};

const guestCredentials = {
  password: 'guest123',
};

// Create a provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth
      ? JSON.parse(storedAuth)
      : { isAuthenticated: false, role: null, username: null };
  });

  // Error state
  const [error, setError] = useState(null);

  // Update localStorage whenever auth changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Admin login function
  const loginAdmin = (password) => {
    if (password === adminCredentials.password) {
      setAuth({
        isAuthenticated: true,
        role: 'admin',
        username: 'admin', // Optional: Set a default username for admin
      });
      setError(null);
      navigate('/Contact'); // Redirect after successful login
    } else {
      setError('Invalid password for Admin');
    }
  };

  // Guest login function
  const loginGuest = (username, password) => {
    if (password === guestCredentials.password) {
      setAuth({
        isAuthenticated: true,
        role: 'guest',
        username: username,
      });
      setError(null);
      navigate('/Contact'); // Redirect after successful login
    } else {
      setError('Invalid password for Guest');
    }
  };

  // Logout function
  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      username: null,
    });
    navigate('/'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ auth, loginAdmin, loginGuest, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
