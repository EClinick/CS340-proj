const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventsController');

// Get all events
router.get('/', getEvents);

// Get single event
router.get('/:id', getEvent);

// Create new event
router.post('/', createEvent);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

module.exports = router; 