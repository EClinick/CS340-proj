import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AttendeesPage from "./pages/AttendeesPage";
import EventAttendeesPage from "./pages/EventAttendeesPage";
import EventsPage from "./pages/EventsPage";
import SpeakersPage from "./pages/SpeakersPage";
import VenuesPage from "./pages/VenuesPage";
import Navbar from "./components/navbar/NavBar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/attendees" element={<AttendeesPage />} />
        <Route path="/event_attendees" element={<EventAttendeesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/speakers" element={<SpeakersPage />} />
        <Route path="/venues" element={<VenuesPage />} />
      </Routes>
    </>
  );
}

export default App;
