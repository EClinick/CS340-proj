import { Link } from "react-router-dom";
import { MdEvent } from "react-icons/md";

const Navbar = () => {
  return (
    <header>
      <div>
        <Link to="/">
          <MdEvent size={80} />
        </Link>
      </div>
      <h1 style={{ color: 'white' }}>Event Management System</h1>
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
    </header>
  );
};

export default Navbar;
