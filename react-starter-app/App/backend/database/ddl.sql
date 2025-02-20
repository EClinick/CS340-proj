-- Project Group 87
-- Ethan Clinick
-- Dawson Berry


SET FOREIGN_KEY_CHECKS=0; -- prevents import errors
SET AUTOCOMMIT = 0;

-----------------
-- Create Tables
-----------------

-- Create table for Venues
CREATE OR REPLACE TABLE Venues (
    venueID INT AUTO_INCREMENT PRIMARY KEY,
    venueName VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    CONSTRAINT singleVenue UNIQUE (venueName, location)
);

-- Create table for Events
CREATE OR REPLACE TABLE Events (
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    eventDate DATE,
    venueID INT NOT NULL,
    eventDescription TEXT,
    FOREIGN KEY (venueID) REFERENCES Venues(venueID) ON DELETE CASCADE
);

-- Create table for Attendees
CREATE OR REPLACE TABLE Attendees (
    attendeeID INT AUTO_INCREMENT PRIMARY KEY,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Create table for Speakers
CREATE OR REPLACE TABLE Speakers (
    speakerID INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT NOT NULL,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE
);

--OLD VERSION WITH "HARD CODING FKs"

-- -- Create table for EventAttendees (junction table)
-- CREATE OR REPLACE TABLE EventAttendees (
--     eventAttendeeID INT AUTO_INCREMENT PRIMARY KEY,
--     eventID INT NOT NULL,
--     attendeeID INT NOT NULL,
--     FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE,
--     FOREIGN KEY (attendeeID) REFERENCES Attendees(attendeeID) ON DELETE CASCADE
-- );

-- NEW VERSION Removing Auto Increment
-- Create table for EventAttendees (junction table)

/*
This new version of the EventAttendees table uses a composite primary key, which
is a combination of the eventID and attendeeID. This means that each combination of eventID and attendeeID must be unique, 
allowing for a many-to-many relationship between events and attendees without needing an additional auto-incrementing ID.
*/

CREATE OR REPLACE TABLE EventAttendees (
    eventID INT NOT NULL,
    attendeeID INT NOT NULL,
    PRIMARY KEY (eventID, attendeeID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE,
    FOREIGN KEY (attendeeID) REFERENCES Attendees(attendeeID) ON DELETE CASCADE
);



---------------
-- Insert Data
---------------

-- Sample data for Venues
INSERT INTO Venues (venueName, location, capacity) VALUES
('Convention Center', '123 Main St, Metropolis', 500),
('Community Hall', '456 Elm St, Smallville', 200),
('Downtown Arena', '789 Market St, Big City', 1000);

-- Sample data for Events
INSERT INTO Events (eventName, eventDate, venueID, eventDescription) VALUES
('Tech Conference', '2025-05-10', (SELECT venueID FROM Venues WHERE venueName = 'Convention Center'), 'An annual conference showcasing the latest in technology.'),
('Health Symposium', '2025-06-15', (SELECT venueID FROM Venues WHERE venueName = 'Community Hall'), 'A symposium focused on modern health challenges and breakthroughs.'),
('Music Festival', '2025-07-20', (SELECT venueID FROM Venues WHERE venueName = 'Downtown arena'), 'A day-long festival featuring local lbands and artists.');

-- Sample data for Attendees
INSERT INTO Attendees (fName, lName, email) VALUES
('Alice', 'Smith', 'alice.smith@example.com'),
('Bob', 'Johnson', 'bob.johnson@example.com'),
('Charlie', 'Lee', 'charlie.lee@example.com'),
('Dana', 'White', 'dana.white@example.com');

-- Sample data for Speakers
INSERT INTO Speakers (eventID, fName, lName, specialization) VALUES
((SELECT eventID FROM Events WHERE eventName = 'Tech Conference'), 'Emily', 'Brown', 'Cloud Computing'),
((SELECT eventID FROM Events WHERE eventName = 'Tech Conference'), 'Frank', 'Green', 'Cybersecurity'),
((SELECT eventID FROM Events WHERE eventName = 'Health Symposium'), 'Grace', 'Hopper', 'Nutrition Science'),
((SELECT eventID FROM Events WHERE eventName = 'Music Festival'), 'Henry', 'Adams', 'Music Production');

-- Sample data for EventAttendees
INSERT INTO EventAttendees (eventID, attendeeID) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1),
(3, 4);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;