const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db'); // Import the MongoDB connection function
const userRoute = require('./routes/userRoute'); // Import the user route
const artistRoute = require('./routes/artistRoute'); // Import the artist route

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/artists', artistRoute);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
