import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/attendees">Attendees</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/speakers">Speakers</Link></li>
          <li><Link to="/venues">Venues</Link></li>
          <li><Link to="/event_attendees">Event Attendees</Link></li>
        </ul>
      </nav>
      <button className="back-button" onClick={() => window.history.back()}>Back</button>
    </header>
  );
}

export default Navbar; 