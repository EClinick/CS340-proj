import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({ venueName: '', location: '', capacity: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [editMode, setEditMode] = useState(false);
  const [currentVenueId, setCurrentVenueId] = useState(null);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Hide toast message
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Fetch venues
  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}venues`);
      setVenues(response.data);
      setError(null);
    } catch (err) {
      showToast('Failed to fetch venues', 'error');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create venue
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editMode) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}venues/${currentVenueId}`, newVenue);
        fetchVenues();
        showToast('Venue updated successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to update venue', 'error');
        console.error('Error updating venue:', err);
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}venues`, newVenue);
        fetchVenues();
        showToast('Venue created successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to create venue', 'error');
        console.error('Error creating venue:', err);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setNewVenue({ venueName: '', location: '', capacity: '' });
    setEditMode(false);
    setCurrentVenueId(null);
  };

  // Set up form for editing
  const setupEdit = (venue) => {
    setNewVenue({
      venueName: venue.venueName,
      location: venue.location,
      capacity: venue.capacity
    });
    setEditMode(true);
    setCurrentVenueId(venue.venueID);
  };

  // Delete venue
  const handleDelete = async (venueID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}venues/${venueID}`);
      fetchVenues();
      showToast('Venue deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete venue', 'error');
      console.error('Error deleting venue:', err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <h1>Venues</h1>

      {/* Add/Edit Venue Form */}
      <div className="form-section">
        <h2>{editMode ? 'Edit Venue' : 'Add New Venue'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Venue Name:</label>
            <input
              type="text"
              value={newVenue.venueName}
              onChange={(e) => setNewVenue({ ...newVenue, venueName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={newVenue.location}
              onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Capacity:</label>
            <input
              type="number"
              value={newVenue.capacity}
              onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Venue' : 'Add Venue'}</button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Venues List */}
      <div className="list-section">
        <h2>Existing Venues</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Venue Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.venueID}>
                <td>{venue.venueID}</td>
                <td>{venue.venueName}</td>
                <td>{venue.location}</td>
                <td>{venue.capacity}</td>
                <td>
                  <button className="edit-button" onClick={() => setupEdit(venue)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(venue.venueID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenuesPage;

