import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    venueID: '',
    eventDescription: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Hide toast message
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      showToast('Failed to fetch events', 'error');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues for dropdown
  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}venues`);
      setVenues(response.data);
    } catch (err) {
      console.error('Error fetching venues:', err);
      showToast('Failed to fetch venues', 'error');
    }
  };

  // Create or update event
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editMode) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}events/${currentEventId}`, newEvent);
        fetchEvents();
        showToast('Event updated successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to update event', 'error');
        console.error('Error updating event:', err);
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}events`, newEvent);
        fetchEvents();
        showToast('Event created successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to create event', 'error');
        console.error('Error creating event:', err);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setNewEvent({
      eventName: '',
      eventDate: '',
      venueID: '',
      eventDescription: ''
    });
    setEditMode(false);
    setCurrentEventId(null);
  };

  // Set up form for editing
  const setupEdit = (event) => {
    setNewEvent({
      eventName: event.eventName,
      eventDate: event.eventDate.split('T')[0], // Format date for the input field
      venueID: event.venueID,
      eventDescription: event.eventDescription || ''
    });
    setEditMode(true);
    setCurrentEventId(event.eventID);
  };

  // Delete event
  const handleDelete = async (eventID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}events/${eventID}`);
      fetchEvents();
      showToast('Event deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete event', 'error');
      console.error('Error deleting event:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="page-container">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
     
      <h1>Events</h1>
      
      {/* Add/Edit Event Form */}
      <div className="form-section">
        <h2>{editMode ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Event Name:</label>
            <input
              type="text"
              value={newEvent.eventName}
              onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Event Date:</label>
            <input
              type="date"
              value={newEvent.eventDate}
              onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Venue:</label>
            <select
              value={newEvent.venueID}
              onChange={(e) => setNewEvent({ ...newEvent, venueID: e.target.value })}
              required
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.venueID} value={venue.venueID}>
                  {venue.venueName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={newEvent.eventDescription}
              onChange={(e) => setNewEvent({ ...newEvent, eventDescription: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Event' : 'Add Event'}</button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="list-section">
        <h2>Existing Events</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventID}>
                <td>{event.eventID}</td>
                <td>{event.eventName}</td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.venueName}</td>
                <td>{event.eventDescription}</td>
                <td>
                  <button className='edit-button' onClick={() => setupEdit(event)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(event.eventID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventsPage;