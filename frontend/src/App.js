import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserEmpList from './pages/UserEmplist'
import Profile from './pages/Profile';
import Assets from './pages/Assets';
import Emplist from './pages/Emplist';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import AboutUs from './pages/AboutUs';
import './css/styles.css'; // Import your CSS file here

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user/dashboard" element={<UserDashboard/>}/>
          <Route path="/user/emplist" element={<UserEmpList/>}/>
          <Route path='/user/dashboard/profile' element={<Profile />}/>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/genReport" element={<Assets />} />
          <Route path="/employee" element={<Emplist />} />
          <Route path="/aboutus" element={<AboutUs />} />
          
          
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
