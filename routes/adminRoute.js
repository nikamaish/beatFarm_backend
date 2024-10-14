const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { getAllArtists, deleteArtist } = require('../controllers/artistController');
const { adminSignin , editArtist, editUser} = require('../controllers/adminController');
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
router.delete('/deleteUser/:id', authMiddleware, adminMiddleware, deleteUser); // Delete user by ID
router.get('/getAllArtists', authMiddleware, adminMiddleware, getAllArtists); // Get all artists
router.delete('/deleteArtist/:id', authMiddleware, adminMiddleware, deleteArtist); // Delete artist by ID
router.put('/editUser/:userId', authMiddleware, adminMiddleware, editUser); // Admin edit user
router.put('/editArtist/:artistId', authMiddleware, adminMiddleware, editArtist); // Admin edit artist

module.exports = router;
