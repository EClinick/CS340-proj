const express = require('express');
const router = express.Router();
const {
    getEventAttendees,
    createEventAttendee,
    updateEventAttendee,
    deleteEventAttendee
} = require('../controllers/eventAttendeesController');

// Get all event attendees
router.get('/', getEventAttendees);

// Create new event-attendee relationship
router.post('/', createEventAttendee);

// Update event-attendee relationship
router.put('/', updateEventAttendee);

// Delete event-attendee relationship
router.delete('/', deleteEventAttendee);

module.exports = router; 