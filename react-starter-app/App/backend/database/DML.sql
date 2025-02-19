-- Project Group 87
-- Ethan Clinick
-- Dawson Berry

-- : (colon) character denotes the variables that will have data from the backend programming language.

-----------------
-- Events Table
-----------------

/*

Replaced :eventName, :eventDate, :venueID, and :eventDescription with :eventNameInput, :eventDateInput, :venueIDInput, and :eventDescriptionInput.
Updated the WHERE clause to use :eventIDInput.
*/

-- INSERT: Create a new event
INSERT INTO Events (eventName, eventDate, venueID, eventDescription)
VALUES (:eventNameInput, :eventDateInput, :venueIDInput, :eventDescriptionInput);

-- SELECT: Retrieve all events with their corresponding venue names
SELECT e.eventID, e.eventName, e.eventDate, v.venueName, e.eventDescription
FROM Events e
JOIN Venues v ON e.venueID = v.venueID;

-- SELECT: Retrieve all events
SELECT * FROM Events;

-- SELECT: Retrieve a single event
SELECT *
FROM Events
WHERE eventID = :eventIDInput;

-- UPDATE: Update an existing event
UPDATE Events
SET eventName = :eventNameInput,
    eventDate = :eventDateInput,
    venueID = :venueIDInput,
    eventDescription = :eventDescriptionInput
WHERE eventID = :eventIDInput;

-- DELETE: Delete an event
DELETE FROM Events
WHERE eventID = :eventIDInput;


-------------------
-- Attendees Table
-------------------

/*
Replaced :fName and :lName with :firstNameInput and :lastNameInput.
Updated :email to :emailInput and the WHERE clause to use :attendeeIDInput.
*/


-- INSERT: Create a new attendee
INSERT INTO Attendees (fName, lName, email)
VALUES (:firstNameInput, :lastNameInput, :emailInput);

-- SELECT: Retrieve all attendees
SELECT * FROM Attendees;

-- SELECT: Retrieve single attendee
SELECT *
FROM Attendees
WHERE attendeeID = :attendeeIDInput;

-- UPDATE: Update attendee details
UPDATE Attendees
SET fName = :firstNameInput,
    lName = :lastNameInput,
    email = :emailInput
WHERE attendeeID = :attendeeIDInput;

-- DELETE: Delete an attendee
DELETE FROM Attendees
WHERE attendeeID = :attendeeIDInput;


------------------
-- Speakers Table
------------------

/*
Updated to use :eventIDInput, :firstNameInput, :lastNameInput, and :specializationInput.
The WHERE clause uses :speakerIDInput.
*/

-- INSERT: Create a new speaker
INSERT INTO Speakers (eventID, fName, lName, specialization)
VALUES (:eventIDInput, :firstNameInput, :lastNameInput, :specializationInput);

-- SELECT: Retrieve all speakers
SELECT * FROM Speakers;

-- SELECT: Retrieve single speaker
SELECT *
FROM Speakers
WHERE speakerID = :speakerIDInput;

-- UPDATE: Update an existing speaker
UPDATE Speakers
SET fName = :firstNameInput,
    lName = :lastNameInput,
    specialization = :specializationInput
WHERE speakerID = :speakerIDInput;

-- DELETE: Delete a speaker
DELETE FROM Speakers
WHERE speakerID = :speakerIDInput;


----------------
-- Venues Table
----------------

/*
Replaced :venueName, :location, and :capacity with :venueNameInput, :locationInput, and :capacityInput.
Updated the WHERE clause to use :venueIDInput.
*/

-- INSERT: Create a new venue
INSERT INTO Venues (venueName, location, capacity)
VALUES (:venueNameInput, :locationInput, :capacityInput);

-- SELECT: Retrieve all venues
SELECT * FROM Venues;

-- SELECT: Retrieve single venue
SELECT *
FROM Venues
WHERE venueID = :venueIDInput;

-- UPDATE: Update an existing venue
UPDATE Venues
SET venueName = :venueNameInput,
    location = :locationInput,
    capacity = :capacityInput
WHERE venueID = :venueIDInput;

-- DELETE: Delete a venue
DELETE FROM Venues
WHERE venueID = :venueIDInput;


------------------------
-- EventAttendees Table
------------------------

/*
Updated the INSERT and WHERE clause to use :eventIDInput and :attendeeIDInput.
*/

-- INSERT: Create a new EventAttendees relationship
INSERT INTO EventAttendees (eventID, attendeeID)
VALUES (:eventIDInput, :attendeeIDInput);

-- SELECT: Retrieve all EventAttendee relationships
SELECT * FROM EventAttendees;

-- SELECT: Retrieve single EventAttendee relationship
SELECT *
FROM EventAttendees
WHERE 
    eventID = :eventIDInput
    AND
    attendeeID = :attendeeIDInput;

-- DELETE: Delete an EventAttendee relationship
DELETE FROM EventAttendees
WHERE 
    eventID = :eventIDInput
    AND
    attendeeID = :attendeeIDInput;
