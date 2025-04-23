import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./EditProfile.css"; // Using our new CSS file

const EditProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: 'onChange'
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First check sessionStorage for data passed from Settings page
        const editData = sessionStorage.getItem("editUserData");
        
        // Then check localStorage as fallback
        const storedUser = localStorage.getItem("user");
        
        if (!editData && !storedUser) {
          toast.error("You must be logged in to edit your profile");
          navigate("/login");
          return;
        }

        let parsedUser = null;
        
        // Prioritize data from sessionStorage (passed from Settings)
        if (editData) {
          try {
            parsedUser = JSON.parse(editData);
            console.log("User data from sessionStorage:", parsedUser);
            // Clear sessionStorage after retrieving the data
            sessionStorage.removeItem("editUserData");
          } catch (error) {
            console.error("Error parsing sessionStorage data:", error);
          }
        }
        
        // If no data from sessionStorage or parsing failed, try localStorage
        if (!parsedUser && storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
            console.log("User data from localStorage:", parsedUser);
          } catch (error) {
            console.error("Error parsing localStorage data:", error);
          }
        }
        
        if (parsedUser) {
          // Set the user data
          setUserData(parsedUser);
          
          // Pre-fill form with user data
          setValue("name", parsedUser.name || "");
          setValue("email", parsedUser.email || "");
          setValue("age", parsedUser.age || "");
          setValue("country", parsedUser.country || "");
          setValue("zip_code", parsedUser.zip_code || "");
          setValue("preferred_currency", parsedUser.preferred_currency || "");
          
          // Handle interests
          if (parsedUser.interests) {
            const interestsString = Array.isArray(parsedUser.interests) 
              ? parsedUser.interests.join(", ") 
              : typeof parsedUser.interests === 'string' 
                ? parsedUser.interests 
                : "";
            setValue("interests", interestsString);
          }
          
          // Travel preferences
          setValue("preferred_travel_group", parsedUser.preferred_travel_group || "");
          setValue("preferred_accommodation", parsedUser.preferred_accommodation || "");
          setValue("preferred_transportation", parsedUser.preferred_transportation || "");
          setValue("preferred_activities", parsedUser.preferred_activities || "");
          setValue("preferred_budget_range", parsedUser.preferred_budget_range || "");
          setValue("typical_travel_group_size", parsedUser.typical_travel_group_size || "");
          setValue("special_needs", parsedUser.special_needs || "");
        } else {
          toast.error("Could not load user data");
          navigate("/settings");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
        navigate("/settings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Get user from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("You must be logged in to update your profile");
        navigate("/login");
        return;
      }
      
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Create updated user data
        const updatedUser = {
          ...parsedUser,
          name: data.name,
          age: data.age ? parseInt(data.age, 10) : undefined,
          country: data.country || "",
          zip_code: data.zip_code || "",
          preferred_currency: data.preferred_currency || "",
          preferred_travel_group: data.preferred_travel_group || "",
          preferred_accommodation: data.preferred_accommodation || "",
          preferred_transportation: data.preferred_transportation || "",
          preferred_activities: data.preferred_activities || "",
          preferred_budget_range: data.preferred_budget_range || "",
          typical_travel_group_size: data.typical_travel_group_size ? parseInt(data.typical_travel_group_size, 10) : undefined,
          special_needs: data.special_needs || "",
          interests: data.interests ? data.interests.split(",").map(item => item.trim()) : []
        };
        
        // Remove undefined values
        Object.keys(updatedUser).forEach(key => 
          updatedUser[key] === undefined && delete updatedUser[key]
        );
        
        console.log("Updating user data in localStorage and database:", updatedUser);
        
        // First, update the database via API call
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Make API call to update user profile in database
        const response = await fetch(`http://localhost:3001/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            name: updatedUser.name,
            age: updatedUser.age,
            country: updatedUser.country,
            zip_code: updatedUser.zip_code,
            preferred_currency: updatedUser.preferred_currency,
            preferred_travel_group: updatedUser.preferred_travel_group,
            preferred_accommodation: updatedUser.preferred_accommodation,
            preferred_transportation: updatedUser.preferred_transportation,
            preferred_activities: updatedUser.preferred_activities,
            preferred_budget_range: updatedUser.preferred_budget_range,
            typical_travel_group_size: updatedUser.typical_travel_group_size,
            special_needs: updatedUser.special_needs,
            interests: Array.isArray(updatedUser.interests) ? updatedUser.interests.join(', ') : updatedUser.interests
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile in database');
        }
        
        // Then update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("Profile updated successfully in both database and locally");
        navigate("/settings");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Edit Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
              maxLength: { value: 20, message: "Username must be less than 20 characters" }
            })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            disabled // Email cannot be changed
            className="disabled-input"
            readOnly // Add readOnly attribute for disabled field
          />
          <p className="field-note">Email cannot be changed</p>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            {...register("age", {
              min: { value: 1, message: "Age must be greater than 0" },
              max: { value: 120, message: "Age must be less than 120" }
            })}
            placeholder="Your age"
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            {...register("country")}
            placeholder="Your country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="zip_code">Zip Code</label>
          <input
            id="zip_code"
            type="text"
            {...register("zip_code")}
            placeholder="Your zip code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferred_currency">Preferred Currency</label>
          <select
            id="preferred_currency"
            {...register("preferred_currency")}
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
        </div>

        <div className="form-group">
          <label htmlFor="interests">Interests (comma separated)</label>
          <input
            id="interests"
            type="text"
            {...register("interests")}
            placeholder="Travel, Photography, Hiking, etc."
          />
          <p className="field-note">Separate multiple interests with commas</p>
        </div>

        <h3>Travel Preferences</h3>

        <div className="form-group">
          <label htmlFor="preferred_travel_group">Preferred Travel Group</label>
          <select id="preferred_travel_group" {...register("preferred_travel_group")}>
            <option value="">How do you usually travel?</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_accommodation">Preferred Accommodation</label>
          <select id="preferred_accommodation" {...register("preferred_accommodation")}>
            <option value="">Where do you prefer to stay?</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="apartment">Apartment/Vacation Rental</option>
            <option value="resort">Resort</option>
            <option value="camping">Camping</option>
            <option value="budget">Budget-friendly</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_transportation">Preferred Transportation</label>
          <select id="preferred_transportation" {...register("preferred_transportation")}>
            <option value="">How do you prefer to get around?</option>
            <option value="walking">Walking</option>
            <option value="public">Public Transportation</option>
            <option value="rental_car">Rental Car</option>
            <option value="taxi">Taxi/Rideshare</option>
            <option value="bike">Biking</option>
            <option value="tour_bus">Tour Bus</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_activities">Preferred Activities</label>
          <select id="preferred_activities" {...register("preferred_activities")}>
            <option value="">What activities do you enjoy?</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="adventure">Adventure/Outdoor</option>
            <option value="food">Food & Dining</option>
            <option value="shopping">Shopping</option>
            <option value="relaxation">Relaxation</option>
            <option value="nightlife">Nightlife</option>
            <option value="cultural">Cultural Experiences</option>
            <option value="history">Historical Sites</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_budget_range">Preferred Budget Range</label>
          <select id="preferred_budget_range" {...register("preferred_budget_range")}>
            <option value="">What's your typical travel budget?</option>
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
            <option value="ultra_luxury">Ultra Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="typical_travel_group_size">Typical Travel Group Size</label>
          <input
            id="typical_travel_group_size"
            type="number"
            min="1"
            max="20"
            {...register("typical_travel_group_size", {
              min: { value: 1, message: "Group size must be at least 1" },
              max: { value: 20, message: "Group size must be less than 20" }
            })}
          />
          <p className="field-note">How many people usually travel with you?</p>
          {errors.typical_travel_group_size && <p className="error-message">{errors.typical_travel_group_size.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="special_needs">Special Needs or Preferences</label>
          <textarea
            id="special_needs"
            {...register("special_needs")}
            placeholder="Any dietary restrictions, accessibility needs, or other preferences?"
            rows="4"
          ></textarea>
        </div>

        <div className="button-group">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate("/settings")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
