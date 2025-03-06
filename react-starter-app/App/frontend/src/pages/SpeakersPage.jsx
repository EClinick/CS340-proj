import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newSpeaker, setNewSpeaker] = useState({
    eventID: '',
    fName: '',
    lName: '',
    specialization: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [editMode, setEditMode] = useState(false);
  const [currentSpeakerId, setCurrentSpeakerId] = useState(null);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Hide toast message
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Fetch speakers
  const fetchSpeakers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}speakers`);
      setSpeakers(response.data);
      setError(null);
    } catch (err) {
      showToast('Failed to fetch speakers', 'error');
      console.error('Error fetching speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for speaker assignment
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`);
      setEvents(response.data);
    } catch (err) {
      showToast('Failed to fetch events', 'error');
      console.error('Error fetching events:', err);
    }
  };

  // Create or update speaker
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If 'No Event' is selected, set eventID to null
    const speakerData = { ...newSpeaker };
    if (speakerData.eventID === 'null') {
      speakerData.eventID = null;
    }
    
    if (editMode) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}speakers/${currentSpeakerId}`, speakerData);
        fetchSpeakers();
        showToast('Speaker updated successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to update speaker', 'error');
        console.error('Error updating speaker:', err);
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}speakers`, speakerData);
        fetchSpeakers();
        showToast('Speaker added successfully!', 'success');
        resetForm();
      } catch (err) {
        showToast('Failed to create speaker', 'error');
        console.error('Error creating speaker:', err);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setNewSpeaker({
      eventID: '',
      fName: '',
      lName: '',
      specialization: ''
    });
    setEditMode(false);
    setCurrentSpeakerId(null);
  };

  // Set up form for editing
  const setupEdit = (speaker) => {
    setNewSpeaker({
      eventID: speaker.eventID || 'null',
      fName: speaker.fName,
      lName: speaker.lName,
      specialization: speaker.specialization
    });
    setEditMode(true);
    setCurrentSpeakerId(speaker.speakerID);
  };

  // Delete speaker
  const handleDelete = async (speakerID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}speakers/${speakerID}`);
      fetchSpeakers();
      showToast('Speaker deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete speaker', 'error');
      console.error('Error deleting speaker:', err);
    }
  };

  useEffect(() => {
    fetchSpeakers();
    fetchEvents();
  }, []);

  if (loading) return <div>Loading speakers...</div>;
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
      
      <h1>Speakers</h1>
      
      {/* Add/Edit Speaker Form */}
      <div className="form-section">
        <h2>{editMode ? 'Edit Speaker' : 'Add New Speaker'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={newSpeaker.fName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, fName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={newSpeaker.lName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, lName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Specialization:</label>
            <input
              type="text"
              value={newSpeaker.specialization}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, specialization: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Event:</label>
            <select
              value={newSpeaker.eventID}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, eventID: e.target.value })}
              required
            >
              <option value="">Select an event</option>
              <option value="null">No Event (NULL)</option>
              {events.map((event) => (
                <option key={event.eventID} value={event.eventID}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Speaker' : 'Add Speaker'}</button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Speakers List */}
      <div className="list-section">
        <h2>Existing Speakers</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((speaker) => (
              <tr key={speaker.speakerID}>
                <td>{speaker.speakerID}</td>
                <td>{`${speaker.fName} ${speaker.lName}`}</td>
                <td>{speaker.specialization}</td>
                <td>{speaker.eventName}</td>
                <td>
                  <button className='edit-button' onClick={() => setupEdit(speaker)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(speaker.speakerID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpeakersPage;