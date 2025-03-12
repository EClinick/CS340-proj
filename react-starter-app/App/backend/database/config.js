// The code in this file was given to us by our instructor, and we did not write it ourselves.

// Get an instance of mysql we can use in the app
const mysql = require("mysql2");
require("dotenv").config();

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_default_password",
  database: process.env.DB_DATABASE || "your_default_database",
}).promise();

// Export it for use in our application
module.exports = pool;
