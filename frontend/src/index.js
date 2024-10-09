// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './dashboard/Dashboard';
import { DarkModeProvider } from './dashboard/DarkModeContext';
import Main from './AddingEmails/Main';
import Login from './auth/Login';
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from './context/AuthContext';
import Unauthorized from './auth/Unauthorized'; // Ensure this component exists

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            {/* Dashboard: Only Admin */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={['admin']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Contact: Admin and Guest */}
            <Route
              path="/Contact"
              element={
                <PrivateRoute roles={['admin', 'guest']}>
                  <App />
                </PrivateRoute>
              }
            />

            {/* Email: Admin and Guest */}
            <Route
              path="/Email"
              element={
                <PrivateRoute roles={['admin', 'guest']}>
                  <Main />
                </PrivateRoute>
              }
            />

            {/* Unauthorized Access Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </DarkModeProvider>
  </React.StrictMode>
);
