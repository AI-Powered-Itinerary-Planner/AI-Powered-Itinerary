import React from 'react';
import './ProfileCreation.css'
import { useNavigate } from 'react-router-dom';

const ProfileCreation = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Creation</h2>
        <div className="profile-pic-placeholder"></div>
        <form>
          <div className="input-group">
            <input type="text" id="full-name" placeholder='Full name'name="full-name" required />
          </div>

          <div className="input-group">
            <input type="number" id="age" placeholder='age' name="age" required />
          </div>

          <div className="input-group">
            <input type="text" id="country" placeholder='Country of Residence'name="country" required />
          </div>

          <div className="input-group">
            <input type="text" id="zip-code" placeholder='Zip Code' name="zip-code" required />
          </div>

          <div className="input-group">
            <input type="text" id="currency" placeholder='Preferred Currency'name="currency" required />
          </div>

          <button type="submit" onClick={() => navigate('/interestPage')}>Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
