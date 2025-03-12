// The code in this file was given to us by our instructor, and we did not write it ourselves.
// The only code we wrote here was the api routes for the backend CRUD operations.

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require('./database/db-connector');

const app = express();
const PORT = process.env.PORT || 8500; 

// Middleware:

// If on FLIP, use cors() middleware to allow cross-origin requests from the frontend with your port number:
// EX (local): http://localhost:5173 
// EX (FLIP/classwork) http://flip3.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

// Database connection
require('./database/db-connector');

// Diagnostic Route
app.get('/api/diagnostic', async (req, res) => {
  try {
    // First test the connection
    const [testConnection] = await db.query('SELECT 1');
    
    // If we get here, connection is successful
    // Now try to create and test the diagnostic table
    await db.query('DROP TABLE IF EXISTS diagnostic;');
    await db.query('CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);');
    await db.query('INSERT INTO diagnostic (text) VALUES (?)', ['MySQL connection is working!']);
    const [results] = await db.query('SELECT * FROM diagnostic;');

    // Return both connection status and results
    res.json({
      connection: 'success',
      database: process.env.DB_DATABASE,
      results: results
    });

  } catch (error) {
    console.error('Database operation failed:', error);
    res.status(500).json({ 
      connection: 'failed',
      database: process.env.DB_DATABASE,
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  }
});

// API Routes for backend CRUD:
app.use("/api/venues", require("./routes/venuesRoutes"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/attendees", require("./routes/attendeesRoutes"));
app.use("/api/speakers", require("./routes/speakersRoutes"));
app.use("/api/event_attendees", require("./routes/eventAttendeesRoutes"));


// Add your Connect DB Activitiy Code Below:
// ...


// ...
// End Connect DB Activity Code.


const os = require("os");
const hostname = os.hostname();

app.listen(PORT, () => {
  // flip server should automatically match whatever server you're on 
  console.log(`Server running:  http://${hostname}:${PORT}...`);
});
