const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { getAllArtists, deleteArtist } = require('../controllers/artistController');
const { adminSignin } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Middleware to check for admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.post('/adminSignIn', adminSignin);
router.get('/getAllUsers', authMiddleware, adminMiddleware, getAllUsers); // Get all users
router.delete('/deleteUser', authMiddleware, adminMiddleware, deleteUser); // Delete user by ID
router.get('/getAllArtists', authMiddleware, adminMiddleware, getAllArtists); // Get all artists
router.delete('/deleteArtist', authMiddleware, adminMiddleware, deleteArtist); // Delete artist by ID

module.exports = router;
