import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/Profile.css';
import TopNav from './AdmTopNav';
// const TopNav = ({ employeeData }) => {
//   return (
//     <nav className="topnav">
//       <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_UshaMartin.png" alt="Logo" className="logo" />
//       <ul>
//         <li><Link to="/user/dashboard/*" state={employeeData}>Dashboard</Link></li>
//         <li><Link to="/user/emplist" state={employeeData}>Assets List</Link></li>
//         <li><Link to="/user/dashboard/profile" state={employeeData}>Profile</Link></li>
//       </ul>
//     </nav>
//   );
// };
const Profile = () => {
  const location = useLocation();
  const employeeData  = location.state || {};
  console.log(location)
  console.log('Profile employeeData:', employeeData);

  return (
    <div>
      <TopNav employeeData={employeeData}/>
      <div className="profile">
        <h1>Profile of {employeeData?.user?.employeeName}</h1>
        <p><strong>Location Name:</strong> {employeeData?.user?.locationName}</p>
        <p><strong>Plant:</strong> {employeeData?.user?.plant}</p>
        <p><strong>Department:</strong> {employeeData?.user?.department}</p>
        <p><strong>Domain ID:</strong> {employeeData?.user?.domainID}</p>
        <p><strong>Phone Number:</strong> {employeeData?.user?.phNo}</p>
      </div>
    </div>
  );
};

export default Profile;
