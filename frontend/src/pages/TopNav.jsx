// TopNav.jsx

import React from 'react';
import '../css/TopNav.css';

const TopNav = () => {
  return (
    <div className="topnav">
      <div className="logo-container">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_UshaMartin.png" 
          alt="Logo" 
          className="topnav-logo" 
        />
      </div>
      <ul>
        <li><a href="/admin/dashboard">Dashboard</a></li>
        <li><a href="/emplist">Employee</a></li>
        <li><a href="/admin/genReport">Assets</a></li>
        <li><a href="/admin/addAsset">Add Asset</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </div>
  );
};

export default TopNav;
