const db = require('../database/db-connector');

// Get all speakers
const getSpeakers = async (req, res) => {
    try {
        const [speakers] = await db.query(`
            SELECT s.fName, s.lName, specialization, e.eventName 
            FROM Speakers s
            JOIN Events e ON s.eventID = e.eventID
            ORDER BY s.lName
        `);
        res.json(speakers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single speaker
const getSpeaker = async (req, res) => {
    try {
        const [speaker] = await db.query(`
            SELECT s.fName, s.lName, specialization, e.eventName, e.eventDate 
            FROM Speakers s
            JOIN Events e ON s.eventID = e.eventID
            WHERE s.speakerID = ?
            ORDER BY s.lName
        `, [req.params.id]);
        
        if (speaker.length === 0) {
            return res.status(404).json({ message: 'Speaker not found' });
        }
        res.json(speaker[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a speaker
const createSpeaker = async (req, res) => {
    const { eventID, fName, lName, specialization } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Speakers (eventID, fName, lName, specialization) VALUES (?, ?, ?, ?)',
            [eventID, fName, lName, specialization]
        );
        res.status(201).json({ 
            id: result.insertId, 
            eventID, 
            fName, 
            lName, 
            specialization 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a speaker
const updateSpeaker = async (req, res) => {
    const { eventID, fName, lName, specialization } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Speakers SET eventID = ?, fName = ?, lName = ?, specialization = ? WHERE speakerID = ?',
            [eventID, fName, lName, specialization, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Speaker not found' });
        }
        res.json({ 
            id: req.params.id, 
            eventID, 
            fName, 
            lName, 
            specialization 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a speaker
const deleteSpeaker = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Speakers WHERE speakerID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Speaker not found' });
        }
        res.json({ message: 'Speaker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSpeakers,
    getSpeaker,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker
}; 