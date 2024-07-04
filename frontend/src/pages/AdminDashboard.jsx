import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/AdminDashboard.css';
import TopNav from '../pages/AdmTopNav'; // Assuming TopNav.jsx is in the same directory

const AdminDashboard = () => {
  const location = useLocation();
  const employeeData = location.state || { user: { employeeName: 'Unknown' } };
  
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    totalAssignedAssets: 0,
    totalUnassignedAssets: 0,
    totalEmployees: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <TopNav employeeData={employeeData} />
      <h1 style={{ padding: '60px' }}>Welcome {employeeData.user.employeeName}</h1>
      
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default AdminDashboard;
