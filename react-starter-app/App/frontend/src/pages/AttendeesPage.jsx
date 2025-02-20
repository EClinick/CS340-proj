import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

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

  // Fetch attendees
  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}attendees`);
      setAttendees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendees');
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
      console.error('Error fetching events:', err);
    }
  };

  // Create attendee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}attendees`, newAttendee);
      setNewAttendee({
        fName: '',
        lName: '',
        email: ''
      });
      fetchAttendees();
    } catch (err) {
      setError('Failed to create attendee');
      console.error('Error creating attendee:', err);
    }
  };

  // Update attendee
  const handleUpdate = async (attendeeID) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}attendees/${attendeeID}`, newAttendee);
      fetchAttendees();
    } catch (err) {
      setError('Failed to update attendee');
      console.error('Error updating attendee:', err);
    }
  }

  // Delete attendee
  const handleDelete = async (attendeeID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}attendees/${attendeeID}`);
      fetchAttendees();
    } catch (err) {
      setError('Failed to delete attendee');
      console.error('Error deleting attendee:', err);
    }
  };

  // Register attendee for event
  const handleRegister = async (attendeeID, eventID) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}attendees/${attendeeID}/register`, { eventID });
      fetchAttendees();
    } catch (err) {
      setError('Failed to register attendee for event');
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
      <h1>Attendees</h1>
      
      {/* Add Attendee Form */}
      <div className="form-section">
        <h2>Add New Attendee</h2>
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
          <button type="submit">Add Attendee</button>
        </form>
      </div>

      {/* Attendees List */}
      <div className="list-section">
        <h2>Existing Attendees</h2>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.attendeeID}>
                <td>{`${attendee.fName} ${attendee.lName}`}</td>
                <td>{attendee.email}</td>
                <td>
                  <button className="edit-button action-button" onClick={() => handleUpdate(attendee.attendeeID)}>Edit</button>
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
