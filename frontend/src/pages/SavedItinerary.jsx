import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SavedItinerary.css"; // optional for styling

const SavedItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.id;
      
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/itineraries?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setItineraries(data.itineraries);
        } else {
          console.error("Failed to fetch itineraries");
        }
      } catch (err) {
        console.error("Error fetching itineraries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>🚀 Loading your saved itineraries...</h2>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="empty-message">
        <h2>No itineraries saved yet 😔</h2>
        <button onClick={() => navigate("/plantrip")} className="back-btn">
          ➡️ Plan a New Trip
        </button>
      </div>
    );
  }

  return (
    <div className="saved-itineraries-page">
      <h1>📚 Saved Itineraries</h1>

      <div className="itinerary-list">
        {itineraries.map((itinerary) => (
          <motion.div
            key={itinerary.id}
            className="saved-itinerary-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{itinerary.title}</h2>
            <p><strong>Destination:</strong> {itinerary.destination}</p>
            <p><strong>Start Date:</strong> {itinerary.start_date}</p>
            <p><strong>End Date:</strong> {itinerary.end_date}</p>
            <p><strong>Description:</strong> {itinerary.description}</p>

            <button 
              className="btn" 
              onClick={() => navigate(`/itineraryDetails/${itinerary.id}`)}
            >
              🔍 View Details
            </button>
          </motion.div>
        ))}
      </div>
      <button onClick={() => navigate("/plantrip")} className="btn">
        ➡️ Plan a New Trip
      </button>
      <button onClick={() => navigate("/home")} className="btn">
        🔙 Back to Home
        </button>
    </div>
  );
};

export default SavedItinerary;