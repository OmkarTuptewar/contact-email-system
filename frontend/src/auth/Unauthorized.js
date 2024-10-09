// src/auth/Unauthorized.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Unauthorized = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Link
          to={auth.role === 'admin' ? '/dashboard' : '/Contact'}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        >
          Go to {auth.role === 'admin' ? 'Dashboard' : 'Contact'}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
