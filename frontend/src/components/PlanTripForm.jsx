import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./Dropdown.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const travelGroups = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "business", label: "Business" },
];
const accommodationTypes = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "resort", label: "Resort" },
];
const transportTypes = [
  { value: "car", label: "Car" },
  { value: "plane", label: "Plane" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "ship", label: "Ship" },
];
const activities = [
  { value: "sightseeing", label: "Sightseeing" },
  { value: "shopping", label: "Shopping" },
  { value: "hiking", label: "Hiking" },
  { value: "beach", label: "Beach" },
  { value: "museum", label: "Museum" },
];
const budgetRanges = [
  { value: "min-100$", label: "min-100$" },
  { value: "100$-500$", label: "100$-500$" },
  { value: "500$-1000$", label: "500$-1000$" },
  { value: "1000$-5000$", label: "1000$-5000$" },
  { value: "5000$-10000$", label: "5000$-10000$"},
  { value: "10000$-max", label: "10000$-max"}
  
];
const PlanTripForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const formTopRef = useRef(null);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    basic: true,
    group: false,
    accommodation: false,
    transport: false,
    budget: false
  });
  const [numPeople, setNumPeople] = useState(1);
  const [peopleAges, setPeopleAges] = useState([]);
  const [numDays, setNumDays] = useState(0);
  const arrivalDate = watch("arrivalDateTime");
  const departureDate = watch("departureDateTime");
  const travelGroup = watch("travelGroup");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (key) => {
    setSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
  
      if (!prev[key]) {
        setTimeout(() => {
          formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
  
      return updated; // ✅ this is correct and MUST be here
    });
  };


  const onSubmit = (data) => {
    const formData = {
      ...data,
      peopleAges: peopleAges,
    }
      if (!data.arrivalDateTime || !data.departureDateTime) {
        toast.error("Please select both start and end dates.");
        return;
      }
    
      if (data.departureDateTime < data.arrivalDateTime) {
        toast.error("End date must be after start date.");
        return;
      }

      if(data.numPlaces > numDays) {
        toast.error("Number of places cannot exceed the total days of the trip.");
        return;
      }
      const buildPrompt = (formData, numDays) => {
        const accommodation = formData.accommodation?.map(a => a.label || a.value).join(", ") || "Any";
        const transport = formData.transport?.map(t => t.label || a.value).join(", ") || "Any";
        const activities = formData.activities?.map(a => a.label || a.value).join(", ") || "General sightseeing";
      
        return `
      You are an expert AI travel planner specializing in crafting highly detailed, time-optimized, and budget-focused travel itineraries. Your task is to generate a professionally structured itinerary for the following trip:
      
      Generate a ${numDays}-day itinerary for a ${formData.travelGroup} traveler visiting ${formData.destination} from ${formData.arrivalDateTime} to ${formData.departureDateTime}. The traveler prefers a relaxed pace, has a ${formData.budget} budget, and requires ${accommodation} accommodation with ${transport} as the preferred mode of transport.
     
     ---

      Important preferences:
      - Food: Non-Vegetarian
      - Must-try cuisine: Local Food
      - Avoid: Museums
      - Activities of interest: ${activities}
      - Special needs: ${formData.specialNeeds || "None"} (must be strictly honored)
      - Number of travelers: ${formData.peopleAges?.length || 1}
      - Purpose: Leisure
     ---
      CRITICAL RESPONSE RULES:
      - Always respond only in JSON — **never include markdown formatting or commentary
      - The root object must contain an "itinerary" array
      - For **follow-up questions**, edits, or single-day changes, return the **entire JSON itinerary** again
      - If editing a single day, **only that day's content should change**, but still return the full itinerary
      - Never wrap output in triple backticks
      - Never include any text or explanation outside the JSON

      
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
      `;
      };
      const prompt = buildPrompt(formData, numDays);
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

      console.log("Form Data:", formData);
      console.log("Selected Accommodations:",data.accommodation.map((accommodation) => accommodation.value));
  };

  const handleNumPeopleChange = (e) => {
    const num = e.target.value;
    setNumPeople(num);

    // Create empty fields for people ages
    const newAges = Array.from({ length: num }, () => "");
    setPeopleAges(newAges);
  };

  const handleAgeChange = (index, age) => {
    const updatedAges = [...peopleAges];
    updatedAges[index] = age;
    setPeopleAges(updatedAges);
  };

  useEffect(() => {
    if (arrivalDate && departureDate) {
      const calculatedDays = (new Date(departureDate) - new Date(arrivalDate)) / (1000 * 3600 * 24) + 1;
      setNumDays(calculatedDays);
    }
  }, [arrivalDate, departureDate]);

  useEffect(() => {
    if (travelGroup === "solo") {
      setNumPeople(1);
      setPeopleAges([""]);
    } else if (travelGroup === "couple") {
      setNumPeople(2);
      setPeopleAges(["", ""]);
    }
  }, [travelGroup]);

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
      <form onSubmit={handleSubmit(onSubmit)} ref={formTopRef}>
      <h2 onClick={() => toggleSection('basic')}>📍 Basic Info {sections.basic ? "▲" : "▼"}</h2>
      {sections.basic && (
          <>
        {/* Destination Dropdown */}
        <div>
        <label>Destination(s)</label>
        <input
          {...register("destination", { required: "Destination is required" })}
            type="text"
            placeholder="Country/City"
        />
        {errors.destination && <p>{errors.destination.message}</p>}
        </div>
        <div>
        <label>Arrival Location</label>
        <input
          {...register("arrivalLocation", { required: "Arrival Location is required" })}
            type="text"
            placeholder="Eg. SFO/LAX"
        />
        {errors.arrivalLocation && <p>{errors.arrivalLocation.message}</p>}
        </div>

        {/* Arrival Date and Time */}
      <div>
        <label>Arrival Date and Time</label>
        <Controller
          name="arrivalDateTime"
          control={control}
          rules={{ required: "Arrival date and time is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="datetime-local"
              defaultValue="" // Set default value if needed
            />
          )}
        </p>
      </div>

      {/* Departure Date and Time */}
      <div>
        <label>Departure Date and Time</label>
        <Controller
          name="departureDateTime"
          control={control}
          rules={{ required: "Departure date and time is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="datetime-local"
            />
          )}
        />
        {errors.departureDateTime && <p>{errors.departureDateTime.message}</p>}
      </div>
        </>
      )}

<h2 onClick={() => toggleSection('group')}>🧑‍🤝‍🧑 Travel Group {sections.group ? "▲" : "▼"}</h2>
        {sections.group && (
          <>
        {/* Travel Group Select */}
        <div>
        <label>Travel Group</label>
        <select className="select" {...register("travelGroup", { required: "This field is required" })} >
        <option value="" disabled selected>Select Travel Group</option>
          {travelGroups.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>
        {errors.travelGroup && <p>{errors.travelGroup.message}</p>}
        </div>
        {/* Number of People */}
        <div>
        <label>Number of People</label>
        <input
              type="number"
              min="1"
              max="10"
              value={numPeople}
              onChange={handleNumPeopleChange}
              placeholder="Number of People"
              disabled={travelGroup === "solo" || travelGroup === "couple"}
    title={
      travelGroup === "solo"
        ? "Fixed to 1 for Solo travel"
        : travelGroup === "couple"
        ? "Fixed to 2 for Couple travel"
        : ""
      }
            />
        </div>

            {/* Age Inputs */}
            {Array.from({ length: numPeople }).map((_, index) => (
              <div key={index}>
                <label>Age of Person {index + 1}</label>
                <input
                  type="number"
                  value={peopleAges[index] || ""}
                  onChange={(e) => handleAgeChange(index, e.target.value)}
                  placeholder="Age"
                  min="0"
                />
                {errors.age && <p>{errors.age.message}</p>}
                </div>
              ))}
          <div>
  <label>Special Needs or Requests</label>
  <textarea
    {...register("specialNeeds")}
    placeholder="Enter any special needs or requests (e.g., accessibility, dietary restrictions)"
    rows="3" // Initial height, will expand as user types
    style={{ width: "100%", minHeight: "50px" }}
    onInput={(e) => {
      e.target.style.height = 'auto'; // Reset height
      e.target.style.height = `${e.target.scrollHeight}px`; // Expand height based on content
    }}
  />
</div>
        </>
        )}

        {/* Multi-Select Dropdown for Accommodation */}
        <h2 onClick={() => toggleSection('accommodation')}>🏨 Accommodation {sections.accommodation ? "▲" : "▼"}</h2>
        {sections.accommodation && (
          <>
          <div>
          <label>Accommodation</label>
        <Controller
          name="accommodation"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
             {...field}
              options={accommodationTypes}
              isMulti
              placeholder="Accommodation Type"
              className="multi-select"
              classNamePrefix="multi-select"
            />
          )}

        />
        {errors.accommodation && <p className="error">{errors.accommodation.message}</p>}
        </div>
        <div>
        <label>How many different places will you be staying during your trip?</label>
        <input
          {...register("numPlaces", {
            required: "Please specify the number of places",
          })}
          type="number"
          placeholder="Number of places"
          min="1"
        />
        {errors.numPlaces && <p>{errors.numPlaces.message}</p>}
      </div>
        </>
        )}

<h2 onClick={() => toggleSection('transport')}>🚗 Transport & Activities {sections.transport ? "▲" : "▼"}</h2>
        {sections.transport && (
          <>

        {/* Transport Select */}
        <div>
        <label>Transport</label>
        <Controller
          name="transport"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
             {...field}
              options={transportTypes}
              isMulti
              placeholder="Transport Type"
              className="multi-select"
              classNamePrefix="multi-select"
            />
          )}
        />
        {errors.transport && <p>{errors.transport.message}</p>}
        </div>
        
        <div className="prompt-tips">
          <h3>Tips for better results:</h3>
          <ul>
            <li>Mention your destination(s)</li>
            <li>Include travel dates or duration</li>
            <li>Specify travel group (solo, family, etc.)</li>
            <li>Mention budget range</li>
            <li>List preferred activities or interests</li>
            <li>Note any special requirements</li>
          </ul>
        </div>
        
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default PlanTripForm;