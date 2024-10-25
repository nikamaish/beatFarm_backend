const jwt = require("jsonwebtoken");
const Artist = require("../models/artistModel");
const User = require("../models/userModel");
const Plan = require("../models/planModel");
const Genre = require('../models/genresModel'); // Adjust the path as necessary
const Song = require('../models/songModel'); // Ensure the Song model is imported


exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL; // Store this in your .env file
  const adminPassword = process.env.ADMIN_PASSWORD; // Store this in your .env file
  
  if (email !== adminEmail || password !== adminPassword) {
    return res.status(403).json({ message: "Access denied" });
  }
  
  // Generate a JWT token for admin
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  
  // Set the JWT as an HTTP-only cookie
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  
  res.status(200).json({ message: "Admin signed in successfully", token });
};

exports.getAdmin = async (req, res) => {
  try {
    // Assuming you have middleware that verifies the token and sets req.user
    const { role } = req.user; // Get the role from the token payload

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Directly return the admin's email from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;

    // Respond with the admin's email
    return res.status(200).json({ email: adminEmail });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.editUser = async (req, res) => {
  const { userId } = req.params; // Extracting the user ID from request parameters
  const { email } = req.body; // Fields that can be updated

  try {
    // Prepare the update object
    const updateData = { email };

    // Filter out undefined or empty properties
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Find the user by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // If user not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success and updated user info
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editArtist = async (req, res) => {
  const { artistId } = req.params; // Extracting the artist ID from request parameters
  const { artistName, bio, } = req.body; // Fields that can be updated

  try {
    // Prepare the update object
    const updateData = { artistName, bio, profilePicture: req.file ? req.file.path : undefined };

    // Filter out undefined or empty properties
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Find the artist by ID and update
    const updatedArtist = await Artist.findByIdAndUpdate(artistId, updateData, { new: true });

    // If artist not found
    if (!updatedArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Respond with success and updated artist info
    res.status(200).json({
      message: "Artist updated successfully",
      artist: updatedArtist,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addPlan = async (req, res) => {
  const { name, price } = req.body;

  try {
    // Create a new plan
    const newPlan = new Plan({ name, price });

    // Save the plan to the database
    await newPlan.save();

    // Respond with success and the created plan
    res.status(201).json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deletePlan = async (req, res) => {
  const { planId } = req.params; // Extracting the plan ID from request parameters

  try {
    // Find the plan by ID and delete
    const deletedPlan = await Plan.findByIdAndDelete(planId);

    // If plan not found
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Respond with success message
    res.status(200).json({
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.editPlan = async (req, res) => {
  const { planId } = req.params; // Extracting the plan ID from request parameters
  const { name, price } = req.body; // Fields that can be updated

  try {
    // Prepare the update object
    const updateData = { name, price };

    // Filter out undefined or empty properties
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Find the plan by ID and update
    const updatedPlan = await Plan.findByIdAndUpdate(planId, updateData, { new: true });

    // If plan not found
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Respond with success and updated plan info
    res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    // Fetch all plans from the database
    const plans = await Plan.find();

    // Respond with the list of plans
    res.status(200).json({
      message: "Plans fetched successfully",
      plans,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};




// GET all genres
exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET a specific genre by ID
exports.getGenreById = async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).json({ message: 'Genre not found' });
        res.status(200).json(genre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST a new genre
exports.createGenre = async (req, res) => {
    const genre = new Genre({
        name: req.body.name,
        numberOfArtists: req.body.numberOfArtists,
    });

    try {
        const savedGenre = await genre.save();
        res.status(201).json(savedGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT to update an existing genre
exports.updateGenre = async (req, res) => {
    try {
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGenre) return res.status(404).json({ message: 'Genre not found' });
        res.status(200).json(updatedGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a genre
exports.deleteGenre = async (req, res) => {
    try {
        const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
        if (!deletedGenre) return res.status(404).json({ message: 'Genre not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.approveSong = async (req, res) => {
  const { songId } = req.params; // Assume the song ID is passed as a route parameter

  try {
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Update the isApproved field
    song.isApproved = true;
    await song.save();

    res.status(200).json({ message: "Song approved successfully.", song });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isApproved: true }); // Only fetch approved songs
    res.status(200).json(songs);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
