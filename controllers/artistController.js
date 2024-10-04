const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Artist = require("../models/artistModel");
const multer = require("multer");

// Artist Signup Function
// Artist Signup Function
exports.signup = async (req, res) => {
    const {
      email,
      password,
      confirmPassword,
      artistName,
    } = req.body;
  
    try {
      // Validate input fields
      if (!email || !password || !confirmPassword || !artistName) {
        return res
          .status(400)
          .json({ errorMessage: "All required fields must be provided." });
      }
  
      if (password.length < 6) {
        return res
          .status(400)
          .json({ errorMessage: "Password must be at least 6 characters." });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ errorMessage: "Passwords do not match." });
      }
  
      // Check if artist already exists
      const existingArtist = await Artist.findOne({ email });
      if (existingArtist) {
        return res.status(400).json({ errorMessage: "Email already in use." });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new artist profile with only the necessary fields
      const newArtist = new Artist({
        email,
        password: hashedPassword,
        artistName,
        // No bio, profilePicture, headerImage, or socialMediaLinks here
      });
  
      const savedArtist = await newArtist.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: savedArtist._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
  
      // Respond with the saved artist data and token
      res.status(201).json({
        message: "Artist registered successfully",
        artist: {
          id: savedArtist._id,
          email: savedArtist.email,
          artistName: savedArtist.artistName,
          // No bio, profilePicture, headerImage, or socialMediaLinks here
        },
        token,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// Artist Profile Update Function
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if artist exists
    const artist = await Artist.findOne({ email });
    if (!artist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    // Return the token and artist information
    res.status(200).json({
      message: "Sign in successful",
      artist: {
        id: artist._id,
        email: artist.email,
        artistName: artist.artistName,
        bio: artist.bio,
        profilePicture: artist.profilePicture,
        headerImage: artist.headerImage,
        socialMediaLinks: artist.socialMediaLinks,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
    const { artistName, bio, socialMediaLinks } = req.body;
  
    try {
      const artistId = req.user.id; // Assuming you've authenticated the user and added user ID to req.user
  
      // Prepare the update object
      const updateData = {
        artistName,
        bio,
        profilePicture: req.file ? req.file.path : undefined, // For profile picture
        headerImage: req.headerImage ? req.headerImage.path : undefined, // For header image
        socialMediaLinks,
      };
  
      // Filter out undefined properties to avoid overwriting with null
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  
      // Find artist by ID and update their profile
      const updatedArtist = await Artist.findByIdAndUpdate(
        artistId,
        updateData,
        { new: true } // Returns the updated document
      );
  
      res.status(200).json({
        message: "Profile updated successfully",
        artist: updatedArtist,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  



// Setup for storing uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

exports.uploadProfilePicture = upload.single("profilePicture");
exports.uploadHeaderImage = upload.single("headerImage");
