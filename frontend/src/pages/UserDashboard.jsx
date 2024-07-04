import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/AdminDashboard.css';
import TopNav from '../pages/TopNav'; // Assuming TopNav.jsx is in the same directory

const UserDashboard = () => {
  const location = useLocation();
  const employeeData = location.state || { user: { employeeName: 'Unknown' } };
  
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    totalAssignedAssets: 0,
    totalUnassignedAssets: 0,
    totalEmployees: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-data');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchDashboardData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div className="user-dashboard">
      <TopNav employeeData={employeeData} />
      <h1 style={{ padding: '60px' }}>Welcome {employeeData.user.employeeName}</h1>

      <div className="dashboard-section">
        <div className="dashboard-item">
          <h3>Total Assets</h3>
          <p id="total-assets">{dashboardData.totalAssets}</p>
        </div>
        <div className="dashboard-item">
          <h3>Total Assigned Assets</h3>
          <p id="total-assigned-assets">{dashboardData.totalAssignedAssets}</p>
        </div>
        <div className="dashboard-item">
          <h3>Total Unassigned Assets</h3>
          <p id="total-unassigned-assets">{dashboardData.totalUnassignedAssets}</p>
        </div>
        <div className="dashboard-item">
          <h3>Total Employees</h3>
          <p id="total-employees">{dashboardData.totalEmployees}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
