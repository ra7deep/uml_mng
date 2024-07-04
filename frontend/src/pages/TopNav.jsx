import React from 'react'
import { Link } from 'react-router-dom';
import '../css/TopNav.css'
const TopNav = ({ employeeData }) => {
    console.log('TopNav employeeData:', employeeData);
    return (
      <nav className="topnav bg-color-#f67126">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_UshaMartin.png" alt="Logo" className="logo" />
        <ul>
          <li><Link to="/user/dashboard/" state={employeeData}>Dashboard</Link></li>
          <li><Link to="/user/emplist" state={employeeData}>Assets</Link></li>
          <li>
            <Link 
              to="/user/dashboard/profile" state={employeeData}
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    );
  };

export default TopNav
