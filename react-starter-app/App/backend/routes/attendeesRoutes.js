const express = require('express');
const router = express.Router();
const {
    getAttendees,
    getAttendee,
    createAttendee,
    updateAttendee,
    deleteAttendee,
    registerForEvent,
    unregisterFromEvent
} = require('../controllers/attendeesController');

// Get all attendees
router.get('/', getAttendees);

// Get single attendee
router.get('/:id', getAttendee);

// Create new attendee
router.post('/', createAttendee);

// Update attendee
router.put('/:id', updateAttendee);

// Delete attendee
router.delete('/:id', deleteAttendee);

// Register for event
router.post('/:id/register', registerForEvent);

// Unregister from event
router.delete('/:id/unregister', unregisterFromEvent);

module.exports = router; 