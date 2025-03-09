import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

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
  } = useForm();
  const [destinations, setDestinations] = useState([]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="forms">
      <h1>Plan Your Trip</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Destination Dropdown */}
        <input
          {...register("destination", { required: "Destination is required" })}
            type="text"
            placeholder="Enter Destination"
        />
        {errors.destination && <p>{errors.destination.message}</p>}

        {/* Date Picker */}
        <DatePicker
          selected={watch("date")}
          onChange={(date) => setValue("date", date)}
          placeholderText="Select Date"
          dateFormat={"dd/MM/yyyy"}
        />
        {errors.date && <p>{errors.date.message}</p>}

        {/* Travel Group Select */}
        <select className="select" {...register("travelGroup", { required: "This field is required" })} >
        <option value="" disabled selected>Select Travel Group</option>
          {travelGroups.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>
        {errors.travelGroup && <p>{errors.travelGroup.message}</p>}

        {/* Accommodation Select */}
        <select className="select" {...register("accommodation", { required: "This field is required" })}>
        <option value="" disabled selected>Select Accomodation Type</option>
          {accommodationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.accommodation && <p>{errors.accommodation.message}</p>}

        {/* Transport Select */}
        <select className="select" {...register("transport", { required: "This field is required" })}>
        <option value="" disabled selected>Select Transport Type</option>
          {transportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.transport && <p>{errors.transport.message}</p>}

        {/* Activity Select */}
        <select className="select" {...register("activity", { required: "This field is required" })}>
        <option value="" disabled selected>Select Prefered Activity</option>
          {activities.map((activity) => (
            <option key={activity.value} value={activity.value}>
              {activity.label}
            </option>
          ))}
        </select>
        {errors.activity && <p>{errors.activity.message}</p>}
        
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

        {/* Submit Button */}
        <button type="submit">Generate Itinerary</button>
      </form>
    </div>
  );
};

export default PlanTripForm;