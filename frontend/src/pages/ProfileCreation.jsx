import React, { useContext, useEffect, useState } from 'react';
import './ProfileCreation.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  
  useEffect(() => {
    // Pre-fill form with user data if available
    if (user?.name) {
      reset({
        fullName: user.name,
        email: user.email || '',
        age: '',
        country: '',
        zipCode: '',
        preferredCurrency: '',
      });
    } else {
      // If no user context, try to get from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          reset({
            fullName: parsedUser.name || '',
            email: parsedUser.email || '',
            age: parsedUser.age || '',
            country: parsedUser.country || '',
            zipCode: parsedUser.zip_code || '',
            preferredCurrency: parsedUser.preferred_currency || '',
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [user, reset]);
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Profile Form Data:", data);
      
      // Get current user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("User information not found. Please log in again.");
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Update user data with form values
      const updatedUser = {
        ...parsedUser,
        name: data.fullName || parsedUser.name,
        age: data.age ? parseInt(data.age, 10) : undefined,
        country: data.country || "",
        zip_code: data.zipCode || "",
        preferred_currency: data.preferredCurrency || "",
      };
      
      // Save updated user data to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update user context if available
      if (setUser) {
        setUser(updatedUser);
      }
      
      // Try to update backend if we have an ID
      if (parsedUser.id) {
        try {
          const response = await fetch(`http://localhost:3001/users/${parsedUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: data.fullName,
              age: data.age ? parseInt(data.age, 10) : undefined,
              country: data.country,
              zip_code: data.zipCode,
              preferred_currency: data.preferredCurrency
            })
          });
          
          if (!response.ok) {
            console.warn("Backend update failed, but localStorage was updated");
          } else {
            console.log("Profile updated on backend successfully");
          }
        } catch (error) {
          console.error("Error updating profile on backend:", error);
          // Continue with localStorage update only
        }
      }
      
      toast.success("Profile created successfully!");
      navigate('/interestPage');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile information");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Creation</h2>
        <p className="profile-subtitle">Tell us about yourself to personalize your experience</p>
        <div className="profile-pic-placeholder"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="full-name">Full Name</label>
            <input 
              {...register("fullName", {
                required: "Full Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" }
              })} 
              type="text" 
              id="full-name" 
              placeholder='Your full name'
            />
            {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="age">Age</label>
            <input 
              {...register("age", {
                required: "Age is required",
                min: { value: 1, message: "Age must be greater than 0" },
                max: { value: 120, message: "Age must be less than 120" }
              })} 
              type="number" 
              id="age" 
              placeholder='Your age'
            />
            {errors.age && <p className="error-message">{errors.age.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="country">Country</label>
            <input 
              {...register("country", { 
                required: "Country is required" 
              })} 
              type="text" 
              id="country" 
              placeholder='Your country of residence'
            />
            {errors.country && <p className="error-message">{errors.country.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="zip-code">Zip Code</label>
            <input 
              {...register("zipCode", { 
                required: "Zip Code is required" 
              })} 
              type="text" 
              id="zip-code" 
              placeholder='Your zip/postal code'
            />
            {errors.zipCode && <p className="error-message">{errors.zipCode.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="preferred-currency">Preferred Currency</label>
            <select
              {...register("preferredCurrency", { 
                required: "Preferred Currency is required" 
              })}
              id="preferred-currency"
            >
              <option value="">Select a currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
            {errors.preferredCurrency && <p className="error-message">{errors.preferredCurrency.message}</p>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue to Interests"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
