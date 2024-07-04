import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/Profile.css';
import TopNav from './TopNav';

const Profile = () => {
  const location = useLocation();
  const employeeData = location.state || {};
  const defaultProfileImage = "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"; // Default placeholder image

  console.log('Profile location:', location);
  console.log('Profile employeeData:', employeeData);

  return (
    <div>
      <TopNav employeeData={employeeData} />
      <div className="profile">
        <img 
          src={employeeData?.user?.profileImage || defaultProfileImage} 
          alt={`${employeeData?.user?.employeeName}'s profile`} 
        />
        <p><strong>Location Name:</strong> {employeeData?.user?.locationName}</p>
        <p><strong>Plant:</strong> {employeeData?.user?.plant}</p>
        <p><strong>Department:</strong> {employeeData?.user?.department}</p>
        <p><strong>Domain ID:</strong> {employeeData?.user?.domainID}</p>
        <p><strong>Phone Number:</strong> {employeeData?.user?.phNo}</p>
        <p><strong>Role:</strong> {employeeData?.user?.role}</p>
      </div>
    </div>
  );
};

export default Profile;
