const express = require ('express');
const dotenv = require ('dotenv').config();
const cors = require ('cors');
const {mongoose} = require ('mongoose');
const authRoute = require('./routes/authRoutes'); // Import the route
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL) // Database Connection
.then(() => {
    console.log('Database Connected');
}
)
.catch((err) => {
    console.log("Database not connected",err);
})

//middleware

app.use('/api', authRoute); // Mounting the authentication routes

const port  = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });