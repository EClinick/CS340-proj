const db = require('../database/db-connector');

// Get all events with venue details
const getEvents = async (req, res) => {
    try {
        const [events] = await db.query(`
            SELECT e.eventName, e.eventDate, e.eventDescription, v.venueName, v.location, v.capacity 
            FROM Events e 
            JOIN Venues v ON e.venueID = v.venueID
            ORDER BY e.eventDate DESC
        `);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single event with venue details and speakers
const getEvent = async (req, res) => {
    try {
        const [event] = await db.query(`
            SELECT e.eventName, e.eventDate, e.eventDescription, v.venueName, v.location, v.capacity 
            FROM Events e 
            JOIN Venues v ON e.venueID = v.venueID 
            WHERE e.eventID = ?
            ORDER BY e.eventDate DESC
        `, [req.params.id]);
        
        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get speakers for this event
        const [speakers] = await db.query(
            'SELECT s.fName, s.lName, specialization FROM Speakers WHERE eventID = ?',
            [req.params.id]
        );

        // Get attendees for this event
        const [attendees] = await db.query(`
            SELECT a.attendeeID, a.fName, a.lName, a.email 
            FROM Attendees a
            JOIN EventAttendees ea ON a.attendeeID = ea.attendeeID
            WHERE ea.eventID = ?
        `, [req.params.id]);

        res.json({
            ...event[0],
            speakers,
            attendees
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create an event
const createEvent = async (req, res) => {
    const { eventName, eventDate, venueID, eventDescription } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Events (eventName, eventDate, venueID, eventDescription) VALUES (?, ?, ?, ?)',
            [eventName, eventDate, venueID, eventDescription]
        );
        res.status(201).json({ 
            id: result.insertId, 
            eventName, 
            eventDate, 
            venueID, 
            eventDescription 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an event
const updateEvent = async (req, res) => {
    const { eventName, eventDate, venueID, eventDescription } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Events SET eventName = ?, eventDate = ?, venueID = ?, eventDescription = ? WHERE eventID = ?',
            [eventName, eventDate, venueID, eventDescription, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ 
            id: req.params.id, 
            eventName, 
            eventDate, 
            venueID, 
            eventDescription 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Events WHERE eventID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}; 