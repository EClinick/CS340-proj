const express = require('express');
const router = express.Router();
const {
    getVenues,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue
} = require('../controllers/venuesController');

// Get all venues
router.get('/', getVenues);

// Get single venue
router.get('/:id', getVenue);

// Create new venue
router.post('/', createVenue);

// Update venue
router.put('/:id', updateVenue);

// Delete venue
router.delete('/:id', deleteVenue);

module.exports = router; 