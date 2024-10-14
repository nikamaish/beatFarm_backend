const jwt = require("jsonwebtoken");
const Artist = require("../models/artistModel");
const User = require("../models/userModel");

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