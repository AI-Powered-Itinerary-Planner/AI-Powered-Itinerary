import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    country: "",
    zip_code: "",
    preferred_currency: "",
    interests: []
  });
  const [language, setLanguage] = useState("English");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Debug function to show all localStorage data
    const debugLocalStorage = () => {
      let debug = "localStorage contents:\n";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);
        try {
          // Try to parse JSON values for better display
          const parsed = JSON.parse(value);
          value = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // If not JSON, keep as is
        }
        debug += `${key}: ${value}\n`;
      }
      return debug;
    };

    // Fetch user data from localStorage or API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Debug all localStorage
        const debugData = debugLocalStorage();
        console.log("DEBUG LOCALSTORAGE:", debugData);
        setDebugInfo(debugData);
        
        // First try to get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log("User data from localStorage:", parsedUser);
            
            // Update state with user data
            setUserData({
              name: parsedUser.name || "",
              email: parsedUser.email || "",
              age: parsedUser.age || "",
              country: parsedUser.country || "",
              zip_code: parsedUser.zip_code || "",
              preferred_currency: parsedUser.preferred_currency || "",
              interests: parsedUser.interests || []
            });
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
        } else {
          // If no user data in localStorage, redirect to login
          toast.error("Please log in to view settings");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear user context
    setUser(null);
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to login page instead of home
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      // Get user ID and token
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (storedUser.id) {
        // Call backend to delete the user account
        const response = await fetch(`http://localhost:3001/users/${storedUser.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok && response.status !== 204) {
          console.error("Server responded with status:", response.status);
          throw new Error('Failed to delete account on server');
        }
      }
      
      // Clear ALL localStorage even if the backend call fails
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear user context
      setUser(null);
      
      // Show success message
      toast.success("Account deleted successfully");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // Even if there's an error with the server, still clear local data and log out
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      
      // Show a warning message but still redirect
      toast.error("There was an issue deleting your account on the server, but you've been logged out.");
      navigate("/login");
    }
  };

  const handleEditProfile = () => {
    // Store current user data in sessionStorage for the edit form
    if (userData) {
      sessionStorage.setItem("editUserData", JSON.stringify(userData));
    }
    navigate("/edit-username");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      {/* Debug Info (hidden) */}
      {debugInfo && (
        <div className="debug-info" style={{ display: 'none' }}>
          <pre>{debugInfo}</pre>
        </div>
      )}
      
      <div className="settings-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-circle">
            {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="profile-title">
            <h2 className="username">{userData.name || "User"}</h2>
            <p className="email">{userData.email || "No email provided"}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-details">
          {userData.age && (
            <div className="detail-item">
              <span className="detail-label">Age</span>
              <span className="detail-value">{userData.age}</span>
            </div>
          )}
          
          {userData.country && (
            <div className="detail-item">
              <span className="detail-label">Country</span>
              <span className="detail-value">{userData.country}</span>
            </div>
          )}
          
          {userData.zip_code && (
            <div className="detail-item">
              <span className="detail-label">Zip Code</span>
              <span className="detail-value">{userData.zip_code}</span>
            </div>
          )}
          
          {userData.preferred_currency && (
            <div className="detail-item">
              <span className="detail-label">Currency</span>
              <span className="detail-value">{userData.preferred_currency}</span>
            </div>
          )}
        </div>

        {/* Interests */}
        {userData.interests && userData.interests.length > 0 && (
          <div className="interests-section">
            <h3>Interests</h3>
            <div className="interests-tags">
              {Array.isArray(userData.interests) ? 
                userData.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                )) : 
                <span className="interest-tag">{userData.interests}</span>
              }
            </div>
          </div>
        )}

        {/* Edit Profile Button */}
        <button className="btn edit-btn" onClick={handleEditProfile}>
          <i className="fas fa-user-edit"></i> Edit Profile
        </button>

        {/* Language Preferences */}
        <div className="settings-section">
          <h3>Language Preferences</h3>
          <div className="language-selector">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Account Actions */}
        <div className="account-actions">
          <button className="btn logout-btn" onClick={() => setShowLogoutDialog(true)}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <button className="btn delete-btn" onClick={() => setShowDeleteDialog(true)}>
            <i className="fas fa-trash-alt"></i> Delete Account
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="dialog-actions">
              <button className="btn cancel-btn" onClick={() => setShowLogoutDialog(false)}>Cancel</button>
              <button className="btn confirm-btn" onClick={() => {
                setShowLogoutDialog(false);
                handleLogout();
              }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn cancel-btn" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
              <button className="btn delete-confirm-btn" onClick={() => {
                setShowDeleteDialog(false);
                handleDeleteAccount();
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;