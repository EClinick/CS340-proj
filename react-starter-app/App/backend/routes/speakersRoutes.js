const express = require('express');
const router = express.Router();
const {
    getSpeakers,
    getSpeaker,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker
} = require('../controllers/speakersController');

// Get all speakers
router.get('/', getSpeakers);

// Get single speaker
router.get('/:id', getSpeaker);

// Create new speaker
router.post('/', createSpeaker);

// Update speaker
router.put('/:id', updateSpeaker);

// Delete speaker
router.delete('/:id', deleteSpeaker);

module.exports = router; 