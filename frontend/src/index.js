import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Dashboard from './dashboard/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Routes>
      {/* Define routes */}

      <Route path="/" element={ <App />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
   
    </Routes>
     
    </Router>
  </React.StrictMode>
);
