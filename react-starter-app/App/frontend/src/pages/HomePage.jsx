import { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDiagnosticData = async () => {
    try {
      const URL = `${import.meta.env.VITE_API_URL}diagnostic`;
      const response = await axios.get(URL);
      setDiagnosticData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching diagnostic data:', error);
      setError('Failed to fetch diagnostic data. Please check your database connection.');
      setDiagnosticData(null);
    }
  };

  useEffect(() => {
    fetchDiagnosticData();
  }, []);

  let content;
  if (error) {
    content = <div className="error-message">{error}</div>;
  } else if (diagnosticData === null) {
    content = <p>Loading diagnostic data...</p>;
  } else if (diagnosticData.length === 0) {
    content = <p>No diagnostic data found.</p>;
  } else {
    content = (
      <div className="diagnostic-data">
        <h3>Database Connection Test Results:</h3>
        <pre>{JSON.stringify(diagnosticData, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Event Management System</h1>
      <div className="diagnostic-section">
        <h2>Database Diagnostic Information</h2>
        {content}
      </div>
      
      <div className="project-info">
        <h2>About This Project</h2>
        <p>This is an Event Management System that allows you to:</p>
        <ul>
          <li>Manage venues and their details</li>
          <li>Create and organize events</li>
          <li>Register attendees for events</li>
          <li>Manage speakers and their assignments</li>
          <li>View and manage which events attendees are planning to go to.</li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
