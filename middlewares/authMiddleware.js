const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with the secret
    req.user = decoded // Save the user data in the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
