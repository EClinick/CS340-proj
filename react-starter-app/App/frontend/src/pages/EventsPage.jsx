import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

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

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
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
      setError('Failed to fetch venues');
    }
  };

  // Create event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}events`, newEvent);
      setNewEvent({
        eventName: '',
        eventDate: '',
        venueID: '',
        eventDescription: ''
      });
      fetchEvents();
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  // Update event
  const handleUpdate = async (eventID) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}events/${eventID}`, newEvent);
      fetchEvents();
    } catch (err) {
      setError('Failed to update event');
      console.error('Error updating event:', err);
    }
  }

  // Delete event
  const handleDelete = async (eventID) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}events/${eventID}`);
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
     
      <h1>Events</h1>
      
      {/* Add Event Form */}
      <div className="form-section">
        <h2>Add New Event</h2>
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
              required
            />
          </div>
          <button type="submit">Add Event</button>
        </form>
      </div>

      {/* Events List */}
      <div className="list-section">
        <h2>Existing Events</h2>
        <table>
          <thead>
            <tr>
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
                <td>{event.eventName}</td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.venueName}</td>
                <td>{event.eventDescription}</td>
                <td>
                  <button className='edit-button' onClick={() => handleUpdate(event.eventID)}>Edit</button>
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
