import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import Select from "react-select";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./Dropdown.css";
import { useNavigate } from 'react-router-dom';

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


  const onSubmit = (data) => {

      console.log("Form Data:", data);
      console.log("Selected Accommodations:",data.accommodation.map((accommodation) => accommodation.value));
  };

  const navigate = useNavigate();

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

        {/* Multi-Select Dropdown for Accommodation */}
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

        {/* Transport Select */}
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

        {/* Activity Select */}
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
        <button type="submit" onClick={() => navigate('/generateItinerary')}>Generate Itinerary</button>
      </form>
    </div>
  );
};

export default PlanTripForm;