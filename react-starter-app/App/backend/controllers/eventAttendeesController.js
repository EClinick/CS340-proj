const db = require('../database/db-connector');

// Get all event attendees with event and attendee details
const getEventAttendees = async (req, res) => {
    try {
        const [eventAttendees] = await db.query(`
            SELECT ea.eventID, e.eventName, ea.attendeeID, 
                   a.fName as firstName, a.lName as lastName, a.email
            FROM EventAttendees ea
            JOIN Events e ON ea.eventID = e.eventID
            JOIN Attendees a ON ea.attendeeID = a.attendeeID
            ORDER BY a.lName
        `);
        res.json(eventAttendees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new event-attendee relationship
const createEventAttendee = async (req, res) => {
    const { eventID, attendeeID } = req.body;
    try {
        // Validate that both IDs exist
        const [eventExists] = await db.query(
            'SELECT eventID FROM Events WHERE eventID = ?',
            [eventID]
        );

        if (eventExists.length === 0) {
            return res.status(400).json({ 
                message: 'Invalid event ID: Event does not exist',
                error: 'INVALID_EVENT'
            });
        }

        const [attendeeExists] = await db.query(
            'SELECT attendeeID FROM Attendees WHERE attendeeID = ?',
            [attendeeID]
        );

        if (attendeeExists.length === 0) {
            return res.status(400).json({ 
                message: 'Invalid attendee ID: Attendee does not exist',
                error: 'INVALID_ATTENDEE'
            });
        }

        // Check if the relationship already exists
        const [existing] = await db.query(
            'SELECT * FROM EventAttendees WHERE eventID = ? AND attendeeID = ?',
            [eventID, attendeeID]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                message: 'Attendee is already registered for this event',
                error: 'DUPLICATE_REGISTRATION'
            });
        }

        // Create the relationship
        await db.query(
            'INSERT INTO EventAttendees (eventID, attendeeID) VALUES (?, ?)',
            [eventID, attendeeID]
        );
        
        // Fetch the created relationship with details
        const [newRegistration] = await db.query(`
            SELECT ea.eventID, e.eventName, ea.attendeeID, 
                   a.fName as firstName, a.lName as lastName, a.email
            FROM EventAttendees ea
            JOIN Events e ON ea.eventID = e.eventID
            JOIN Attendees a ON ea.attendeeID = a.attendeeID
            WHERE ea.eventID = ? AND ea.attendeeID = ?
            ORDER BY a.lName
        `, [eventID, attendeeID]);

        res.status(201).json({
            message: 'Successfully registered attendee for event',
            registration: newRegistration[0]
        });
    } catch (error) {
        console.error('Error in createEventAttendee:', error);
        res.status(500).json({ 
            message: 'Failed to register attendee for event',
            error: error.message,
            sqlMessage: error.sqlMessage
        });
    }
};

// Delete an event-attendee relationship
const deleteEventAttendee = async (req, res) => {
    const { eventID, attendeeID } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM EventAttendees WHERE eventID = ? AND attendeeID = ?',
            [eventID, attendeeID]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event-Attendee relationship not found' });
        }
        res.json({ message: 'Successfully unregistered attendee from event' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEventAttendees,
    createEventAttendee,
    deleteEventAttendee
}; 