import React from 'react'
import "./Explore.css";
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h4>Outdoor activities</h4>
      <textarea></textarea>
      <h4>Shops and landscapes</h4>
      <textarea></textarea>
      <button onClick={() => navigate('/plantrip')}>What's the plan?</button>
    </div>
  )
}

export default Explore;