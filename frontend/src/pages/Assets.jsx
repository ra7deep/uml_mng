import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../css/Assets.css';
import TopNav from '../pages/AdmTopNav';

function Assets() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFullTable, setShowFullTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [editFormData, setEditFormData] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    showCurrentPage(); // Update table display on pagination or item per page change
  }, [currentPage, itemsPerPage, data]); // Run whenever currentPage, itemsPerPage, or data changes

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/genReport');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const changeItemsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const nextPage = () => {
    if (currentPage * itemsPerPage < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const showCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tableRows = document.getElementById("employeeTable").querySelectorAll("tbody tr");

    tableRows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    // Update pagination buttons
    document.getElementById("prevPageBtn").disabled = (currentPage === 1);
    document.getElementById("nextPageBtn").disabled = (endIndex >= data.length);
  };

  const openForm = () => {
    document.getElementById("addDataForm").style.display = "block";
  };

  const closeForm = () => {
    document.getElementById("addDataForm").style.display = "none";
  };

  const openFieldForm = () => {
    document.getElementById("addFieldForm").style.display = "block";
  };

  const closeFieldForm = () => {
    document.getElementById("addFieldForm").style.display = "none";
  };

  const toggleColumns = () => {
    setShowFullTable(!showFullTable);
    const extraColumns = document.querySelectorAll(".extra-column");

    extraColumns.forEach(column => {
      column.style.display = showFullTable ? "table-cell" : "none";
    });
  };

  const searchTable = useCallback(() => {
    const filter = searchInput.toUpperCase();
    const table = document.getElementById("employeeTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) { // Start from 1 to skip table headers
      let display = "none";
      const td = tr[i].getElementsByTagName("td");
      for (let j = 0; j < td.length; j++) {
        const txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          display = "";
          break;
        }
      }
      tr[i].style.display = display;
    }
  }, [searchInput]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/delete_asset/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedData = data.filter(item => item._id !== id);
        setData(updatedData);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addField = async (e) => {
    e.preventDefault();
  
    const fieldName = document.getElementById('fieldName').value;
    const fieldType = document.getElementById('fieldType').value;
  
    try {
      const response = await fetch('http://localhost:5000/addField', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fieldName, fieldType }),
      });
  
      if (response.ok) {
        closeFieldForm();
        fetchData(); // Refresh data to show the new field
      } else {
        console.error('Failed to add field');
      }
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };

  const openEditForm = (item) => {
    if (window.confirm('Are you sure you want to edit this item?')) {
      setEditFormData(item);
      document.getElementById("editDataForm").style.display = "block";
    }
  };

  const closeEditForm = () => {
    setEditFormData(null);
    document.getElementById("editDataForm").style.display = "none";
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedItem = {};
    formData.forEach((value, key) => {
      updatedItem[key] = value; // Include all fields, even empty ones
    });

    try {
      const response = await fetch(`http://localhost:5000/edit_asset/${editFormData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setSuccessMessage('Edited successfully');
        console.log('Edit successful'); // Debugging log
        closeEditForm();
        fetchData(); // Refresh data to show the updated item
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000); // Clear the success message after 3 seconds
    }
  };

  const filteredData = useMemo(() => {
    const filter = searchInput.toUpperCase();
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toUpperCase().includes(filter)
      )
    );
  }, [data, searchInput]);

  useEffect(() => {
    showCurrentPage();
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="report-page">
      <TopNav /> {/* Include TopNav component */}
      <div className="content gen-report-content">
        <div className="table-container">
          <div className="items-per-page">
            <label htmlFor="itemsPerPage">Items per page:</label>
            <select id="itemsPerPage" onChange={changeItemsPerPage} value={itemsPerPage}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <input
            type="text"
            id="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for names.."
          />

          <button id="addDataBtn" onClick={openForm}>Add Data</button>
          <button id="addFieldBtn" onClick={openFieldForm}>Add Field</button>
          <button id="toggleColumnsBtn" onClick={toggleColumns}>
            {showFullTable ? "Show Full Table" : "Show Limited Table"}
          </button>

          <div id="addDataForm" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeForm}>&times;</span>
              <h2>Add New Data</h2>
              <form id="dataForm">
                {/* Add your form fields here */}
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>

          <div id="addFieldForm" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeFieldForm}>&times;</span>
              <h2>Add New Field</h2>
              <form id="fieldForm" onSubmit={addField}>
                <label htmlFor="fieldName">Field name:</label>
                <input type="text" id="fieldName" name="fieldName" required /><br />
                <label htmlFor="fieldType">Field type:</label>
                <select id="fieldType" name="fieldType" required>
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                </select><br />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>

          <div id="editDataForm" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeEditForm}>&times;</span>
              <h2>Edit Data</h2>
              {editMessage && <p>{editMessage}</p>}
              <form id="editForm" onSubmit={handleEditSubmit}>
                {editFormData &&
                  Object.keys(editFormData).map((key) => (
                    key !== '_id' && (
                      <div key={key}>
                        <label htmlFor={key}>{key}:</label>
                        <input
                          type="text"
                          id={key}
                          name={key}
                          defaultValue={editFormData[key]}
                        /><br />
                      </div>
                    )
                  ))}
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>

          {successMessage && <p className="success-message">{successMessage}</p>}

          <table id="employeeTable">
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key, index) => (
                    key !== '_id' && (
                      <th key={key} className={index > 8 ? 'extra-column' : ''}>{key}</th>
                    )
                  ))}
                <th className="extra-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, rowIndex) => (
                <tr key={item._id}>
                  {Object.keys(item).map((key, colIndex) => (
                    key !== '_id' && (
                      <td key={`${item._id}-${key}`} className={colIndex > 8 ? 'extra-column' : ''}>{item[key]}</td>
                    )
                  ))}
                  <td className="extra-column">
                    <button className="edit-link" onClick={() => openEditForm(item)}>Edit</button>
                    <button className="delete-link" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button id="prevPageBtn" onClick={prevPage}>Previous Page</button>
            <button id="nextPageBtn" onClick={nextPage}>Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assets;
