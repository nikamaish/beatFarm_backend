const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { getAllArtists, deleteArtist } = require('../controllers/artistController');
const { adminSignin , editArtist, editUser, addPlan, editPlan, deletePlan, getAllPlans, approveSong, getSongs} = require('../controllers/adminController');
const {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/adminController'); // Adjust the path as necessary

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
router.post('/addPlan', authMiddleware, adminMiddleware, addPlan); 
router.put('/editPlan/:planId', authMiddleware, adminMiddleware, editPlan); // Admin edit artist
router.delete('/deletePlan/:planId', authMiddleware, adminMiddleware, deletePlan); // Admin edit artist
router.get('/getAllPlans', authMiddleware, adminMiddleware, getAllPlans); // Admin edit artist


router.get('/getAllGenres', authMiddleware, adminMiddleware, getAllGenres);
router.get('/getGenres/:id', authMiddleware, adminMiddleware, getGenreById);
router.post('/createGenres', authMiddleware, adminMiddleware, createGenre);
router.put('/editGenres/:id', authMiddleware, adminMiddleware, updateGenre);
router.delete('/deleteGenres/:id', authMiddleware, adminMiddleware, deleteGenre);


router.put('/approve/:songId', authMiddleware, adminMiddleware, approveSong);
router.get('/',authMiddleware,adminMiddleware, getSongs)


module.exports = router;


