const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db'); // Import the MongoDB connection function
const userRoute = require('./routes/userRoute'); // Import the user route
const artistRoute = require('./routes/artistRoute'); // Import the artist route
const adminRoute = require('./routes/adminRoute'); // Import the admin route
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Function to create directories if they don't exist
const createDirectoryIfNotExists = (directory) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  };
  
  // Create the uploads/songs directory if it doesn't exist
  createDirectoryIfNotExists('uploads/songs/');

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your React app origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api/artists', artistRoute);
app.use('/api/admin', adminRoute);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
