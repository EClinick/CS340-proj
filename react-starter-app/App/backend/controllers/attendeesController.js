const db = require('../database/db-connector');

// Get all attendees
const getAttendees = async (req, res) => {
    try {
        const [attendees] = await db.query('SELECT a.fName, a.lName, email FROM Attendees ORDER BY a.lName');
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single attendee with their events
const getAttendee = async (req, res) => {
    try {
        const [attendee] = await db.query(`
            SELECT a.fName, a.lName, email 
            FROM Attendees 
            WHERE attendeeID = ?
            ORDER BY a.lName`
            , [req.params.attendeeID]);
        if (attendee.length === 0) {
            return res.status(404).json({ message: 'Attendee not found' });
        }

        // Get events this attendee is registered for
        const [events] = await db.query(`
            SELECT e.* 
            FROM Events e
            JOIN EventAttendees ea ON e.eventID = ea.eventID
            WHERE ea.attendeeID = ?
        `, [req.params.id]);

        res.json({
            ...attendee[0],
            events
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create an attendee
const createAttendee = async (req, res) => {
    const { fName, lName, email } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Attendees (fName, lName, email) VALUES (?, ?, ?)',
            [fName, lName, email]
        );
        res.status(201).json({ 
            id: result.insertId, 
            fName, 
            lName, 
            email 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an attendee
const updateAttendee = async (req, res) => {
    const { fName, lName, email } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Attendees SET fName = ?, lName = ?, email = ? WHERE attendeeID = ?',
            [fName, lName, email, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendee not found' });
        }
        res.json({ 
            id: req.params.id, 
            fName, 
            lName, 
            email 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an attendee
const deleteAttendee = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Attendees WHERE attendeeID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendee not found' });
        }
        res.json({ message: 'Attendee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register attendee for an event
const registerForEvent = async (req, res) => {
    const { eventID } = req.body;
    const attendeeID = req.params.id;
    try {
        const [result] = await db.query(
            'INSERT INTO EventAttendees (eventID, attendeeID) VALUES (?, ?)',
            [eventID, attendeeID]
        );
        res.status(201).json({ 
            message: 'Successfully registered for event',
            eventID,
            attendeeID
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unregister attendee from an event
const unregisterFromEvent = async (req, res) => {
    const { eventID } = req.body;
    const attendeeID = req.params.id;
    try {
        const [result] = await db.query(
            'DELETE FROM EventAttendees WHERE eventID = ? AND attendeeID = ?',
            [eventID, attendeeID]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.json({ message: 'Successfully unregistered from event' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAttendees,
    getAttendee,
    createAttendee,
    updateAttendee,
    deleteAttendee,
    registerForEvent,
    unregisterFromEvent
}; 