import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function EventAttendeesPage() {
  const [eventAttendees, setEventAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [newEventAttendee, setNewEventAttendee] = useState({
    eventID: '',
    attendeeID: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [originalEventAttendee, setOriginalEventAttendee] = useState(null);

  // Fetch event attendees with event and attendee details
  const fetchEventAttendees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}event_attendees`);
      const eventAttendeesList = response.data.map(ea => ({
        eventID: ea.eventID,
        eventName: ea.eventName,
        attendeeID: ea.attendeeID,
        attendeeName: `${ea.firstName} ${ea.lastName}`,
        attendeeEmail: ea.email
      }));
      setEventAttendees(eventAttendeesList);
    } catch (err) {
      showToast('Failed to fetch event attendees', 'error');
      console.error('Error fetching event attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  // Hide toast message
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'error' });
  };

  // Fetch events for dropdown
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}events`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Fetch attendees for dropdown
  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}attendees`);
      setAttendees(response.data);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  // Set up form for editing
  const setupEdit = (eventAttendee) => {
    setNewEventAttendee({
      eventID: eventAttendee.eventID.toString(),
      attendeeID: eventAttendee.attendeeID.toString()
    });
    setOriginalEventAttendee({
      eventID: eventAttendee.eventID,
      attendeeID: eventAttendee.attendeeID
    });
    setEditMode(true);
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setNewEventAttendee({
      eventID: '',
      attendeeID: ''
    });
    setEditMode(false);
    setOriginalEventAttendee(null);
  };

  // Register attendee for event or update registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventAttendeeData = {
        eventID: parseInt(newEventAttendee.eventID),
        attendeeID: parseInt(newEventAttendee.attendeeID)
      };
      
      if (editMode) {
        // For edit, we need to delete the old record and create a new one
        // First, delete the original event-attendee relationship
        await axios.delete(
          `${import.meta.env.VITE_API_URL}event_attendees`,
          { 
            data: { 
              eventID: originalEventAttendee.eventID, 
              attendeeID: originalEventAttendee.attendeeID 
            } 
          }
        );
        
        // Then create the new relationship
        await axios.post(
          `${import.meta.env.VITE_API_URL}event_attendees`,
          eventAttendeeData
        );
        
        showToast('Successfully updated registration', 'success');
        resetForm();
      } else {
        // Create new registration
        await axios.post(
          `${import.meta.env.VITE_API_URL}event_attendees`,
          eventAttendeeData
        );
        
        showToast('Successfully registered attendee for event', 'success');
        resetForm();
      }
      
      fetchEventAttendees();
    } catch (err) {
      console.error('Error with event attendee operation:', err);
      
      // Handle specific error cases
      if (err.response) {
        switch (err.response.data.error) {
          case 'INVALID_EVENT':
            showToast('The selected event does not exist. Please refresh the page and try again.');
            break;
          case 'INVALID_ATTENDEE':
            showToast('The selected attendee does not exist. Please refresh the page and try again.');
            break;
          case 'DUPLICATE_REGISTRATION':
            showToast('This attendee is already registered for this event.');
            break;
          default:
            showToast(err.response.data.message || 'Failed to complete operation');
        }
      } else {
        showToast('Failed to complete operation. Please try again.');
      }
    }
  };

  // Unregister attendee from event
  const handleDelete = async (eventID, attendeeID) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}event_attendees`,
        { 
          data: { 
            eventID: parseInt(eventID), 
            attendeeID: parseInt(attendeeID) 
          } 
        }
      );
      showToast('Successfully unregistered attendee from event', 'success');
      fetchEventAttendees();
    } catch (err) {
      showToast('Failed to unregister attendee from event');
      console.error('Error unregistering attendee:', err);
    }
  };

  useEffect(() => {
    fetchEventAttendees();
    fetchEvents();
    fetchAttendees();
  }, []);

  if (loading) return <div className="loading">Loading event attendees...</div>;

  return (
    <div className="page-container">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      
      <h1>Event Attendees</h1>

      {/* Add/Edit Event Attendee Form */}
      <div className="form-section">
        <h2>{editMode ? 'Update Registration' : 'Register Attendee for Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Event:</label>
            <select
              value={newEventAttendee.eventID}
              onChange={(e) => setNewEventAttendee({ ...newEventAttendee, eventID: e.target.value })}
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.eventID} value={event.eventID}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Attendee:</label>
            <select
              value={newEventAttendee.attendeeID}
              onChange={(e) => setNewEventAttendee({ ...newEventAttendee, attendeeID: e.target.value })}
              required
            >
              <option value="">Select an attendee</option>
              {attendees.map((attendee) => (
                <option key={attendee.attendeeID} value={attendee.attendeeID}>
                  {`${attendee.fName} ${attendee.lName}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Registration' : 'Register'}</button>
            {editMode && (
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Event Attendees List */}
      <div className="list-section">
        <h2>Current Event Registrations</h2>
        <table>
          <thead>
            <tr>
              <th>Composite ID</th>
              <th>Event</th>
              <th>Attendee</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventAttendees.map((ea) => (
              <tr key={`${ea.eventID}-${ea.attendeeID}`}>
                <td>{`${ea.eventID}-${ea.attendeeID}`}</td>
                <td>{ea.eventName}</td>
                <td>{ea.attendeeName}</td>
                <td>{ea.attendeeEmail}</td>
                <td>
                  <button className="edit-button" onClick={() => setupEdit(ea)}>Edit</button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(ea.eventID, ea.attendeeID)}
                  >
                    Unregister
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventAttendeesPage;