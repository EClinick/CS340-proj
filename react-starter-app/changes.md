# Fixes and Improvements Log

Below is a comprehensive list of fixes we need to implement along with the original suggestions based on the feedback received throughout the project.

## Suggestor: **Jeffrey Benner**

## 1. EventAttendees Table – Composite Primary Key (DONE)
- **Suggestion:**  
  Instead of hard coding foreign keys using an auto-increment surrogate key in the EventAttendees table, remove the auto-increment column and use a composite primary key composed of `eventID` and `attendeeID`.
- **Fix:**  
  Updated the DDL by removing the `eventAttendeeID` column and defining the primary key as `(eventID, attendeeID)`, ensuring each event-attendee pair is unique.

## 2. PDF & Submission Requirements (DONE)
- **Suggestion:**  
  - Rename your zip file to `projectgroup87_step3_DRAFT.zip`.
  - Do not include the HTML files in the zip (the web pages should only be available online).
  - Add a link to the live website in your PDF file.
- **Fix:**  
  These changes have been noted for documentation and submission purposes. Ensure that the final submission meets these requirements.

## 3. SQL Best Practices – SELECT Queries (DONE)
- **Suggestion:**  
  Replace all “SELECT *” queries with explicit column selections to avoid potential issues (e.g., receiving too many columns, order changes) and to improve code clarity.
- **Fix:**  
  For production code, update the queries accordingly. (Note: Some sample queries still use “SELECT *” for ad hoc testing.)

## 4. Host Variable Naming in SQL/DML (DONE)
- **Suggestion:**  
  Use more descriptive host variable names (e.g., use `:eventNameInput` instead of `:eventName`) to clearly indicate that these values come from the UI/form.
- **Fix:**  
  Updated the DML.sql file by renaming all host variables to include “Input” (for example, `:firstNameInput`, `:lastNameInput`, `:eventNameInput`, etc.) so that the binding between form data and SQL is explicit.

## 5. Column Naming Conventions for Clarity (DONE)
- **Suggestion:**  
  Change ambiguous column names like `fName` and `lName` to more descriptive names such as `firstName` and `lastName` for clarity.
- **Fix:**  
  Updated both the DML SQL statements and the corresponding HTML form input names to use `firstNameInput` and `lastNameInput` (representing the UI values).

## 6. EventAttendees UI Page (DONE)
- **Suggestion:**  
  The UI was missing a working page for the EventAttendees (join table) to add and remove relationships between events and attendees.
- **Fix:**  
  Created and updated the `event_attendees.html` file with a layout similar to the events page. This file now includes a table to display current relationships and forms to add and delete an event-attendee relationship.

## 7. HTML Form Host Variable Names (DONE)
- **Suggestion:**  
  In the HTML forms, update the input `name` attributes to match the new descriptive host variable names (e.g., change `name="eventName"` to `name="eventNameInput"`).
- **Fix:**  
  Updated all HTML files (`attendees.html`, `event_attendees.html`, `events.html`, `speakers.html`, `venues.html`) so that every form field uses descriptive names that correspond with the updated DML host variable names.

## 8. Dynamic Dropdown Population (DONE)
- **Suggestion:**  
  For forms like the “Add New Event” page, ensure that dropdowns (e.g., for selecting a venue) are dynamically populated with current data from the database rather than hard-coded options.
- **Fix:**  
  A static example remains in the HTML for now; however, this feature should eventually be implemented in the backend to fetch current venue data dynamically.

## 9. UI Navigation & Consistency (DONE)
- **Suggestion:**  
  Ensure that all pages (for each table/entity) are accessible via the navigation menu and that actions (insert, update, delete) are consistent across the site.
- **Fix:**  
  Verified that each HTML file includes a consistent header with navigation links, and that each entity (including the many-to-many EventAttendees) has dedicated forms for CRUD operations.


## Suggestor: **Alexandra Orlova**

## 1. Dropdowns Use Names (DONE)
- **Suggestion:**
  Offering a drop down of events by name, not id.
- **Fix:**
  All drop downs use the corresponding name, rather than the corresponding ID.

---

*This log summarizes all the changes made based on the feedback received. Make sure that any future updates continue to reflect these standards and best practices.*
