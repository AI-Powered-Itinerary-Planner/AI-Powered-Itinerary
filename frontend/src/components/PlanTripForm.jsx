import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Dropdown.css";

const PlanTripForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Load user from DB using ID stored in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    console.log("Stored user data:", stored);
    if (!stored) {
      toast.error("Please log in.");
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    console.log("Parsed user data:", parsed);
    if (!parsed?.id) return;

    fetch(`http://localhost:3001/users/${parsed.id}`)
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err);
        toast.error("Could not load user data");
      });
  }, []);

  const onSubmit = async (data) => {
    if (!userProfile) {
      toast.error("User data not loaded yet.");
      return;
    }

    setIsLoading(true);

    // Safely parse fields that may be stringified JSON
    const parseArray = (v) => {
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed.join(", ") : v;
      } catch {
        return v || "N/A";
      }
    };

    // Build prompt
    const prompt = `
You are an expert AI travel planner specializing in crafting highly detailed, time-optimized, and budget-focused travel itineraries. Your task is to generate a professionally structured itinerary for the following trip:

User Request:
"${data.tripPrompt}"

User Profile:
- Country: ${userProfile.country || "N/A"}
- Age: ${userProfile.age || "N/A"}
- Travel Group: ${userProfile.preferred_travel_group || "N/A"}
- Accommodation: ${parseArray(userProfile.preferred_accommodation)}
- Transportation: ${parseArray(userProfile.preferred_transportation)}
- Activities: ${parseArray(userProfile.preferred_activities)}
- Budget: ${userProfile.preferred_budget_range || "N/A"}
- Special Needs: ${userProfile.special_needs || "None"}
- Typical Group Size: ${userProfile.typical_travel_group_size || 1}
User companions:
- Ages: ${userProfile.travel_companions_ages || "N/A"}
Companion Interests:
${userProfile.companion_interests || "N/A"}


Strictly follow these rules when creating the itinerary:
      - Precise minute-based scheduling (e.g., "8:00 AM - 8:15 AM: Wake up & freshen up")
      - Exact travel times, routes, and distances (e.g., "Drive via A61 highway, ~45 min")
      - Specific hotel names, addresses, and amenities
      - Named restaurant recommendations for every meal (include cuisine type, signature dishes, and whether a reservation is required)
      - Backup options for each activity
      - Local insider tips to avoid crowds or discover hidden gems
      - Weather considerations (e.g., "If it rains, visit XYZ indoor attraction instead")
      - Dress code and required essentials
      - Include a relaxing evening closure each day (spa, lounge, night drive, etc.)
      - Include hotel amenities in daily activities
      - Strictly return your response in the following JSON format (no extra commentary):
      
      \`\`\`json
      {
        "itinerary": [
          {
            "day": 1,
            "title": "Day 1 Title Here",
            "activities": [
              { "time": "8:00 AM - 9:00 AM", "description": "Activity description here" },
              ...
            ]
          }
        ]
      }
      \`\`\`
      
    `.trim();

    console.log ("Prompt:", prompt);
    setIsGenerating(true);
      fetch('http://localhost:3001/itineraries/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      })
        .then(res => res.json())
        .then(data => {
          const itinerary = data.itinerary;
          localStorage.setItem('generatedItinerary', itinerary);
          localStorage.setItem('prompt', prompt);
          navigate('/generateItinerary');
        })
        .catch(err => {
          console.error("Itinerary generation failed:", err);
          toast.error("Failed to generate itinerary. Try again.");
        })
        .finally(() => {
          setIsGenerating(false);
        });
  };
  if (isGenerating) {
    return (
      <div className="loading-screen">
        <h2>✈️ Generating your itinerary...</h2>
        <p>This might take a few seconds.</p>
        <div className="spinner"></div> {/* Add a CSS loader or use any animation */}
      </div>
    );
  }

  return (
    <div className="trip-prompt-container">
      <h1>Plan Your Trip</h1>
      {!userProfile && <p>Loading your preferences...</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="prompt-section">
          <label htmlFor="tripPrompt">What kind of trip are you planning?</label>
          <textarea
            id="tripPrompt"
            {...register("tripPrompt", {
              required: "Please describe your trip",
              minLength: {
                value: 15,
                message: "Please write at least 15 characters",
              },
            })}
            placeholder='e.g. "Plan a luxury honeymoon in Italy with vineyard visits and spa time."'
            rows="6"
          />
          {errors.tripPrompt && <p className="error-message">{errors.tripPrompt.message}</p>}
        </div>

        <button type="submit" className="generate-button" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default PlanTripForm;