// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { toast} from 'react-toastify'; 

// Create the context
export const AuthContext = createContext();

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

  const [error, setError] = useState(null);

  // Update localStorage whenever auth changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
  
      const data = await response.json();
   
      const { token } = data; 
      const decodedToken = jwtDecode(token); 
      
  
      const { role } = decodedToken; 
  
      
      setAuth({
        isAuthenticated: true,
        role: role === 'staff' ? 'guest' : 'admin', 
        username: username, 
      });
  
      setError(null);
      toast.success('Login successful!'); 
      navigate('/Contact'); 
    } catch (error) {
      console.error('Error during login:', error); 
      setError(error.message);
      toast.error(error.message);
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
    <>
    
    
    <AuthContext.Provider value={{ auth, login, logout, error }}>
      {children}
    </AuthContext.Provider>
    </>
  );
};
