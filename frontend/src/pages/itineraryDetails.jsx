import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItineraryDetails.css';

const ItineraryDetails = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/itineraries/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItinerary(data.itinerary);
        }
      })
      .catch(err => {
        console.error("Failed to load itinerary:", err);
        navigate("/saved-itineraries");
      });
  }, [id, navigate]);

  if (!itinerary) return <p>Loading itinerary...</p>;

  return (
    <div className="itinerary-details-page">
      <h1>{itinerary.title}</h1>
      <p><strong>Destination:</strong> {itinerary.destination}</p>
      <p><strong>Dates:</strong> {itinerary.start_date} to {itinerary.end_date}</p>
      <p><strong>Description:</strong> {itinerary.description}</p>
  
      <div className="itinerary-card-container">
        {itinerary?.json_data?.itinerary?.map((day, idx) => (
          <div key={idx} className="day-card">
            <h2>Day {day.day}: {day.title}</h2>
            <ul className="activity-list">
              {day.activities.map((act, aIdx) => (
                <li key={aIdx} className="activity-item">
                  <span className="activity-time">{act.time}</span>
                  <p className="activity-desc">{act.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
  
      <button onClick={() => navigate("/savedItinerary")}>🔙 Back</button>
    </div>
  );
};

export default ItineraryDetails;