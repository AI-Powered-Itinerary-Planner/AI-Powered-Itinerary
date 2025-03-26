import React, { useState } from 'react';
import './InterestScreen.css';
import { useNavigate } from 'react-router-dom';

export default function InterestPage() {
  const categories = {
    Music: ["Pop", "R&B", "Country Music", "Rock", "Jazz", "Rap"],
    Adventure: ["Hiking", "Off Roading", "Kayaking", "Biking", "Skiing", "Camping"],
    Nightlife: ["Bars", "Live Music", "Clubs"],
    "Social & Community": ["Art", "Local Food", "Boba Shop"],
  };

  const [selectedInterests, setSelectedInterests] = useState(new Set());

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interest)) {
        newSet.delete(interest);
      } else {
        newSet.add(interest);
      }
      return newSet;
    });
  };

  const navigate = useNavigate();

  return (
    <div className="interest-page">
      <h1 className="title">Choose Your Interest!</h1>
      {Object.entries(categories).map(([category, interests]) => (
        <div key={category} className="interest-container">
          <h2 className="category-title">{category}</h2>
          <div className="interest-grid">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`interest-button ${selectedInterests.has(interest) ? "selected" : ""}`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="done-button" onClick={() => navigate('/home')}>Done</button>
    </div>
  );
}

