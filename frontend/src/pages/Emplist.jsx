import React, { useState, useEffect } from 'react';
import '../css/Emplist.css';
import TopNav from './TopNav'; // Import the TopNav component

const Emplist = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filter, setFilter] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editFormData, setEditFormData] = useState(null); // State to hold the data of the item being edited

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        // Fetch data from server
        fetch('http://localhost:5000/emplist')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const filteredData = data.filter(item => {
        return Object.values(item).some(value =>
            value.toString().toLowerCase().includes(filter.toLowerCase())
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const changePage = (pageNumber) => setCurrentPage(pageNumber);
    const changeItemsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    const openModal = (id) => {
        console.log('Fetching asset details for ID:', id); // Debug log
        fetch(`http://localhost:5000/get_asset/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Asset details fetched:', data); // Debug log
                setSelectedAsset(data);
            })
            .catch(error => console.error('Error fetching asset details:', error));
    };

    const closeModal = () => setSelectedAsset(null);

    const openEditForm = (item) => {
        setEditFormData(item);
        document.getElementById("editDataForm").style.display = "block";
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
            if (value) updatedItem[key] = value; // Only update fields with a non-empty value
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
                closeEditForm();
                fetchData(); // Refresh data to show the updated item
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (id) => {
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

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="app">
            <TopNav /> {/* Add the TopNav component here */}
            <div className="content gen-report-content">
                <div className="table-container">
                    <div className="items-per-page">
                        <label htmlFor="itemsPerPage">Items per page:</label>
                        <select id="itemsPerPage" value={itemsPerPage} onChange={changeItemsPerPage}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="filter-container">
                        <label htmlFor="filterInput">Filter:</label>
                        <input
                            type="text"
                            id="filterInput"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Search"
                        />
                    </div>
                    <table id="employeeTable">
                        <thead>
                            <tr>
                                {data.length > 0 &&
                                    Object.keys(data[0]).map(key => (
                                        key !== '_id' && <th key={key}>{key}</th>
                                    ))
                                }
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item._id}>
                                    {Object.keys(item).map(key => (
                                        key !== '_id' && <td key={key}>{item[key]}</td>
                                    ))}
                                    <td>
                                        <button className="edit-link" onClick={() => openEditForm(item)}>Edit</button>
                                        <button
                                            className="delete-link"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="view-link"
                                            onClick={() => openModal(item._id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button id="prevPageBtn" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous Page</button>
                        <span> Page {currentPage} of {totalPages} </span>
                        <button id="nextPageBtn" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Next Page</button>
                    </div>
                </div>
            </div>

            {selectedAsset && (
                <div id="viewModal" className="modal" style={{ display: 'block' }} onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <h2>Asset Details</h2>
                        <div id="assetDetails" className="asset-details">
                            {Object.keys(selectedAsset).map(key => (
                                key !== '_id' && <p key={key}><strong>{key}:</strong> {selectedAsset[key]}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div id="editDataForm" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeEditForm}>&times;</span>
                    <h2>Edit Data</h2>
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
                                        />
                                    </div>
                                )
                            ))}
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Emplist;
