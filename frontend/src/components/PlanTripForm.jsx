import React, { useState, useEffect } from "react";
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
    setValue,
    watch,
    control,
  } = useForm();

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

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
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

      navigate('/generateItinerary');

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
      const calculatedDays = (new Date(departureDate) - new Date(arrivalDate)) / (1000 * 3600 * 24);
      setNumDays(calculatedDays);
    }
  }, [arrivalDate, departureDate]);

  return (
    <div className="forms">
      <h1>Plan Your Trip</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        />
        {errors.arrivalDateTime && <p>{errors.arrivalDateTime.message}</p>}
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

        {/* Activity Select */}
        <div>
        <label>Activities</label>
        <Controller
          name="activities"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
             {...field}
              options={activities}
              isMulti
              placeholder="Activities"
              className="multi-select"
              classNamePrefix="multi-select"
            />
          )}
        />
        {errors.activity && <p>{errors.activity.message}</p>}
        </div>
        </>
        )}
        <h2 onClick={() => toggleSection('budget')}>💰 Budget {sections.budget ? "▲" : "▼"}</h2>
        {sections.budget && (
          <>
        <div>
        <label>Budget</label>
        {/* Budget Range Select */}
        <select className="select" {...register("budget", { required: "This field is required" })}>
        <option value="" disabled selected>Select Budget Range</option>
          {budgetRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        {errors.budget && <p>{errors.budget.message}</p>}
        </div>
        </>
        )}

        {/* Submit Button */}
        <button type="submit">Generate Itinerary</button>
      </form>
    </div>
  );
};

export default PlanTripForm;