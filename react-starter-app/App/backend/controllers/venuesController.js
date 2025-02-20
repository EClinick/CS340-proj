const db = require('../database/db-connector');

// Get all venues
const getVenues = async (req, res) => {
    try {
        const [venues] = await db.query('SELECT venueName, location, capacity FROM Venues ORDER BY venueName');
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single venue
const getVenue = async (req, res) => {
    try {
        const [venue] = await db.query(`
            SELECT venueName, location, capacity
            FROM Venues 
            WHERE venueID = ?
            ORDER BY venueName
            `, [req.params.id]);
        if (venue.length === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.json(venue[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a venue
const createVenue = async (req, res) => {
    const { venueName, location, capacity } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Venues (venueName, location, capacity) VALUES (?, ?, ?)',
            [venueName, location, capacity]
        );
        res.status(201).json({ id: result.insertId, venueName, location, capacity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a venue
const updateVenue = async (req, res) => {
    const { venueName, location, capacity } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Venues SET venueName = ?, location = ?, capacity = ? WHERE venueID = ?',
            [venueName, location, capacity, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.json({ id: req.params.id, venueName, location, capacity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a venue
const deleteVenue = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Venues WHERE venueID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVenues,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue
}; 