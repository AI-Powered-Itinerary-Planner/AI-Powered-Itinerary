const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser } = require('../controllers/authController');


//middleware
router.use(cors({
    credentials: true,
    origin: 'http://localhost:5174'
}));

router.post('/register', registerUser); // RegisterUser Function is called when /register route is hit. The function is defined in authController.js

module.exports = router; // Exporting the router to be used in index.js