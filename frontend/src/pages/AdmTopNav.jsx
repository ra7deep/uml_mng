import React from 'react'
import { Link } from 'react-router-dom';
import '../css/TopNav.css'
const TopNav = ({ employeeData }) => {
    console.log('TopNav employeeData:', employeeData);
    return (
      <nav className="topnav bg-color-#f67126">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_UshaMartin.png" alt="Logo" className="logo" />
        <ul>
          <li><Link to="/admin/dashboard" state={employeeData}>Dashboard</Link></li>
          <li><Link to="/employee" state={employeeData}>Employee</Link></li>
          <li><Link to="/admin/genReport">Assets</Link></li>
         <li><Link to="/aboutus">About us</Link></li>
        </ul>
      </nav>
    );
  };

export default TopNav
