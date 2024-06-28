import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const EditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/items/${id}`)
            .then(response => {
                setItem(response.data);
            })
            .catch(error => {
                setError('Asset not found.');
                console.error(error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/api/update_asset/${id}`, item)
            .then(response => {
                navigate('/'); // Redirect to the main page or another page after successful update
            })
            .catch(error => {
                console.error('Error updating asset:', error);
                setError('Failed to update asset.');
            });
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!item) {
        return <p>Loading...</p>;
    }

    return (
        <div className="edit-form-container">
            <form onSubmit={handleSubmit}>
                {Object.keys(item).map(key => (
                    key !== '_id' && (
                        <div key={key}>
                            <label htmlFor={key}>{key}:</label>
                            <input
                                type="text"
                                id={key}
                                name={key}
                                value={item[key]}
                                onChange={handleChange}
                            />
                        </div>
                    )
                ))}
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditForm;
