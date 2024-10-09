const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assuming User is your mongoose model

// Signup Function
exports.signup = async (req, res) => {  // Fix the typo 'singup' to 'signup'
  const { email, password, confirmPassword } = req.body;

  try {
    // Validate input fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ errorMessage: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ errorMessage: "Password must be at least 6 characters." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ errorMessage: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ errorMessage: "Email already in use." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Increased cost factor to 10 for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved:", savedUser); // Debugging log
    
    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: savedUser._id }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Set the JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "none", // Change to "lax" if you encounter issues with cross-site cookies
    });

    // Respond with the saved user data and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
      token, // Include the token in the response
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Signin Function
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison:", isMatch); // Debugging log
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign(
      { id: user._id }, // Payload: user's ID
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Set the JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "none",
    });

    // Return the token and user information
    res.status(200).json({
      message: "Sign in successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token, // Return the JWT token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Logout Function
exports.signout = (req, res) => {
  try {
    // Clear the cookie that contains the JWT token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "none",
    });

    // Respond with a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.userget = async (req, res) => {
  try {
    // Assuming req.user contains the decoded token
    const userId = req.user.id; // or however you store the user ID
    const user = await User.findById(userId).select('-password'); // Fetch user without password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email }); // Send back user email or other profile info
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
}