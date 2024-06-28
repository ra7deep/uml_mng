// App.jsx

import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Assets from './pages/Assets';
import Emplist from './pages/Emplist';
import './css/styles.css'; // Import your CSS file here


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/genReport" element={<Assets />} />
          <Route path="/emplist" element={<Emplist />} />
          
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
