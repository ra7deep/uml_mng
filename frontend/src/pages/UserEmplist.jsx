import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/UserEmplist.css'; // Import the CSS file
import { useLocation, Link } from 'react-router-dom';
import TopNav from './TopNav';
// Define the TopNav component
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

const UserEmpList = () => {
  const location = useLocation();
  const employeeData = location.state || { user: { employeeName: 'Unknown' } };
  console.log(location);
  console.log("UserEmpList EmployeeData:", employeeData);
  const [employees, setEmployees] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/emplist')
      .then(response => {
        const data = response.data.data;
        console.log(data);
        setEmployees(data);

        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
      })
      .catch(error => {
        console.error("There was an error fetching the employee list!", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredEmployees = employees.filter(employee =>
    headers.some(header => {
      const value = employee[header];
      return value && value.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    })
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => (prevPage === 1 ? 1 : prevPage - 1));
  };

  const convertToCSV = (array) => {
    const filteredHeaders = headers.filter(header => header !== '_id');
    const header = filteredHeaders.join(',');
    const rows = array.map(row => 
      filteredHeaders.map(header => `"${row[header] || ''}"`).join(',')
    );
    return [header, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(employees);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="user-emp-list">
      <TopNav employeeData={employeeData} />
      <div className="container">
        <h2 className="text-4xl font-bold mb-6" style={{ fontSize: '2em' }}>Total Assets</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="table-container">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header === '_id' ? "Sl. No" : header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex}>
                        {header === '_id' ? (indexOfFirstItem + rowIndex + 1) : employee[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pagination-controls-container">
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev Page</button>
            <button onClick={handleNextPage} disabled={indexOfLastItem >= filteredEmployees.length}>Next Page</button>
          </div>
          <button onClick={downloadCSV} className="download-button">Download CSV</button>
        </div>
      </div>
    </div>
  );
};

export default UserEmpList;
