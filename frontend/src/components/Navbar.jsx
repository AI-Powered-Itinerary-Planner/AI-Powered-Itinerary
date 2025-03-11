import  { useState } from 'react'
import React from 'react'

import { Link, NavLink } from 'react-router-dom'
import "./Navbar.css"

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
  return <nav>
    <Link to="/" className="title">AI-POWERED ITINERARY</Link>
    <div className="menu" onClick={() =>{
        setMenuOpen(!menuOpen)
    }}>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <ul className={menuOpen ? "open" : ""}>
        <li><NavLink to="/home">Home</NavLink></li>
        <li><NavLink to="/explore">Explore</NavLink></li>
        <li><NavLink to="/plantrip">Plan Trip</NavLink></li>
        <li><NavLink to="/saved-itineary">Saved Itineary</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
        {/* <li><NavLink to="/about">About</NavLink></li> */}
    </ul>
  </nav>
}

export default Navbar
