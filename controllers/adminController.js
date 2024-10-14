const jwt = require("jsonwebtoken");

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