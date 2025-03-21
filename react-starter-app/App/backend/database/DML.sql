-- Project Group 87
-- Ethan Clinick
-- Dawson Berry

-- : (colon) character denotes the variables that will have data from the backend programming language.

-----------------
-- Events Table
-----------------

-- INSERT: Create a new event
INSERT INTO Events (eventName, eventDate, venueID, eventDescription)
VALUES (:eventNameInput, :eventDateInput, :venueIDInput, :eventDescriptionInput);

-- SELECT: Retrieve all events with their corresponding venue names
SELECT e.eventID, e.eventName, e.eventDate, v.venueName, e.eventDescription
FROM Events e
JOIN Venues v ON e.venueID = v.venueID
ORDER BY e.eventDate ASC;

-- SELECT: Retrieve a single event with their corresponding venue name
SELECT e.eventID, e.eventName, e.eventDate, v.venueName, e.eventDescription
FROM Events e
JOIN Venues v ON e.venueID = v.venueID
WHERE e.eventName = :eventNameInput
ORDER BY e.eventDate ASC;

-- SELECT: Retrieve the venue names to populate the dropdown.
SELECT v.venueName
FROM Venues v
ORDER BY v.venueName;

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

-- INSERT: Create a new attendee
INSERT INTO Attendees (fName, lName, email)
VALUES (:firstNameInput, :lastNameInput, :emailInput);

-- SELECT: Retrieve all attendees
SELECT attendeeID, a.fName, a.lName, email 
FROM Attendees a
ORDER BY a.lName;

-- SELECT: Retrieve single attendee
SELECT attendeeID, a.fName, a.lName, email
FROM Attendees a
WHERE attendeeID = :attendeeIDInput
ORDER BY a.lName;

-- SELECT: Retrieve the event names to populate the dropdown.
SELECT e.eventName
FROM Events e
ORDER BY e.eventDate ASC;

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

-- INSERT: Create a new speaker
INSERT INTO Speakers (eventID, fName, lName, specialization)
VALUES (:eventIDInput, :firstNameInput, :lastNameInput, :specializationInput);

-- SELECT: Retrieve all speakers
SELECT speakerID, s.fName, s.lName, specialization
FROM Speakers s
ORDER BY s.lName;

-- SELECT: Retrieve single speaker
SELECT speakerID, s.fName, s.lName, specialization
FROM Speakers s
WHERE speakerID = :speakerIDInput
ORDER BY s.lName;

-- SELECT: Retrieve the event names to populate the dropdown.
SELECT e.eventName
FROM Events e
ORDER BY e.eventDate ASC;

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

-- INSERT: Create a new venue
INSERT INTO Venues (venueName, location, capacity)
VALUES (:venueNameInput, :locationInput, :capacityInput);

-- SELECT: Retrieve all venues
SELECT venueID, venueName, location, capacity 
FROM Venues
ORDER BY venueName;

-- SELECT: Retrieve single venue
SELECT venueID, venueName, location, capacity
FROM Venues
WHERE venueID = :venueIDInput
ORDER BY venueName;

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

-- INSERT: Create a new EventAttendees relationship
INSERT INTO EventAttendees (eventID, attendeeID)
VALUES (:eventIDInput, :attendeeIDInput);

-- SELECT: Retrieve all EventAttendee relationships
SELECT ea.eventID, e.eventName, a.fName as firstName, a.lName as lastName, a.email
FROM EventAttendees ea
    JOIN Events e ON ea.eventID = e.eventID
    JOIN Attendees a ON ea.attendeeID = a.attendeeID
ORDER BY a.lName;

-- SELECT: Retrieve single EventAttendee relationship
SELECT ea.eventID, e.eventName, a.fName as firstName, a.lName as lastName, a.email
FROM EventAttendees ea
    JOIN Events e ON ea.eventID = e.eventID
    JOIN Attendees a ON ea.attendeeID = a.attendeeID
WHERE 
    ea.eventID = :eventIDInput
    AND
    ea.attendeeID = :attendeeIDInput
ORDER BY a.lName;

-- SELECT: Retrieve the event names to populate the dropdown.
SELECT e.eventName
FROM Events e
ORDER BY e.eventDate ASC;

-- SELECT: Retrieve the attendee names to populate the dropdown.
SELECT (a.fName, a.lName) as attendeeName
FROM Attendees a
ORDER BY a.lName;

-- UPDATE: Update an EventAttendee relationship
UPDATE EventAttendees
SET eventID = :eventIDInput,
    attendeeID = :attendeeIDInput
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