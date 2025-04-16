import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false)
  const [language, setLanguage] = useState("English");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="settings-container">
      
      {/* Profile Circle */}
      <div className="profile-circle">
        {username.charAt(0).toUpperCase()}
      </div>

      {/* Username */}
      <h2 className="username">{username}</h2>

      {/* Edit Username Button */}
      {editUsername ? (
        <div>
          <input type="text" value={inputUsername} onChange={(e) => setInputUsername(e.target.value)}></input>
          <button onClick={() => {setUsername(inputUsername); setEditUsername(false)}}>Change Username</button>
        </div>
      ) : (
        <button className="edit-btn" onClick={() => {setInputUsername(username); setEditUsername(true)}}>Edit Username</button>
      )}
      

      {/* Language Preferences */}
      <div className="language-container">
        <h3>Language Preferences</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={() => setShowLogoutDialog(true)}>
        Logout
      </button>

      {/* Delete Account Button */}
      <button className="delete-btn" onClick={() => setShowDeleteDialog(true)}>
        Delete Account
      </button>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="dialog">
          <p>Are you sure you want to logout?</p>
          <button onClick={() => setShowLogoutDialog(false)}>No</button>
          <button onClick={() => console.log("Logged Out!") & navigate('/home')}>Yes</button>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button onClick={() => setShowDeleteDialog(false)}>No</button>
          <button onClick={() => console.log("Account Deleted!") & navigate('/home')}>Yes</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
