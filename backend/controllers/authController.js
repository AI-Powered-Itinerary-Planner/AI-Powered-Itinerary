
const User = require('../models/users')

const registerUser = async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email }); //checking if user already exists
  existingUser
    ? res.json("User already exists")
    : User.create(req.body) //creating entry in the database
        .then(() => res.json("Customer saved Successfully"))
        .catch((err) => res.json(err));
}


module.exports = {
    registerUser
}