import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function AttendeesPage() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [newAttendee, setNewAttendee] = useState({
    fName: '',
    lName: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [editMode, setEditMode] = useState(false);
  const [currentAttendeeId, setCurrentAttendeeId] = useState(null);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Hide toast message
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Fetch attendees
  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}attendees`);
      setAttendees(response.data);
      setError(null);
    } catch (err) {
      showToast('Failed to fetch attendees', 'error');
      console.error('Error fetching attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for registration
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`);
      setEvents(response.data);
    } catch (err) {
      showToast('Failed to fetch events', 'error');
      console.error('Error fetching events:', err);
    }
  };

  // Create or update attendee
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editMode) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}attendees/${currentAttendeeId}`, newAttendee);
        fetchAttendees();
        showToast('Attendee updated successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to update attendee', 'error');
        console.error('Error updating attendee:', err);
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}attendees`, newAttendee);
        fetchAttendees();
        showToast('Attendee added successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to create attendee', 'error');
        console.error('Error creating attendee:', err);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setNewAttendee({
      fName: '',
      lName: '',
      email: ''
    });
    setEditMode(false);
    setCurrentAttendeeId(null);
  };

  // Set up form for editing
  const setupEdit = (attendee) => {
    setNewAttendee({
      fName: attendee.fName,
      lName: attendee.lName,
      email: attendee.email
    });
    setEditMode(true);
    setCurrentAttendeeId(attendee.attendeeID);
  };

  // Delete attendee
  const handleDelete = async (attendeeID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}attendees/${attendeeID}`);
      fetchAttendees();
      showToast('Attendee deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete attendee', 'error');
      console.error('Error deleting attendee:', err);
    }
  };

  // Register attendee for event
  const handleRegister = async (attendeeID, eventID) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}attendees/${attendeeID}/register`, { eventID });
      fetchAttendees();
      showToast('Attendee registered successfully!', 'success');
    } catch (err) {
      showToast('Failed to register attendee for event', 'error');
      console.error('Error registering attendee:', err);
    }
  };

  useEffect(() => {
    fetchAttendees();
    fetchEvents();
  }, []);

  if (loading) return <div>Loading attendees...</div>;
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

      <h1>Attendees</h1>
      
      {/* Add/Edit Attendee Form */}
      <div className="form-section">
        <h2>{editMode ? 'Edit Attendee' : 'Add New Attendee'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={newAttendee.fName}
              onChange={(e) => setNewAttendee({ ...newAttendee, fName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={newAttendee.lName}
              onChange={(e) => setNewAttendee({ ...newAttendee, lName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={newAttendee.email}
              onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Attendee' : 'Add Attendee'}</button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Attendees List */}
      <div className="list-section">
        <h2>Existing Attendees</h2>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.attendeeID}>
                <td>{attendee.attendeeID}</td>
                <td>{`${attendee.fName} ${attendee.lName}`}</td>
                <td>{attendee.email}</td>
                <td>
                  <button className="edit-button action-button" onClick={() => setupEdit(attendee)}>Edit</button>
                  <button className="delete-button action-button" onClick={() => handleDelete(attendee.attendeeID)}>Delete</button>
                  <select
                    className="register-select"
                    onChange={(e) => handleRegister(attendee.attendeeID, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Register for event...</option>
                    {events.map((event) => (
                      <option key={event.eventID} value={event.eventID}>
                        {event.eventName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendeesPage;