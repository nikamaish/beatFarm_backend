const mongoose = require('mongoose');

// Define the artist schema
const artistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  artistName: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  profilePicture: {
    type: String, // URL of the profile image
  },
}, { timestamps: true }); // Enables 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Artist', artistSchema);
