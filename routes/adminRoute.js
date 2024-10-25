const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { getAllArtists, deleteArtist } = require('../controllers/artistController');
const { adminSignin , getAdmin, editArtist, editUser, addPlan, editPlan, deletePlan, getAllPlans, approveSong, getSongs} = require('../controllers/adminController');
const {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/adminController'); 

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// Middleware to check for admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.post('/signin', adminSignin);
router.get('/getAdmin',authMiddleware,getAdmin)

router.get('/getAllUsers', authMiddleware, adminMiddleware, getAllUsers); 
router.delete('/deleteUser/:id', authMiddleware, adminMiddleware, deleteUser); 
router.get('/getAllArtists', authMiddleware, adminMiddleware, getAllArtists); 
router.delete('/deleteArtist/:id', authMiddleware, adminMiddleware, deleteArtist); 
router.put('/editUser/:userId', authMiddleware, adminMiddleware, editUser); 
router.put('/editArtist/:artistId', authMiddleware, adminMiddleware, editArtist); 

router.post('/addPlan', authMiddleware, adminMiddleware, addPlan); 
router.put('/editPlan/:planId', authMiddleware, adminMiddleware, editPlan); 
router.delete('/deletePlan/:planId', authMiddleware, adminMiddleware, deletePlan); 
router.get('/getAllPlans', authMiddleware, adminMiddleware, getAllPlans); 


router.get('/getAllGenres', authMiddleware, adminMiddleware, getAllGenres);
router.get('/getGenres/:id', authMiddleware, adminMiddleware, getGenreById);
router.post('/createGenres', authMiddleware, adminMiddleware, createGenre);
router.put('/editGenres/:id', authMiddleware, adminMiddleware, updateGenre);
router.delete('/deleteGenres/:id', authMiddleware, adminMiddleware, deleteGenre);


router.put('/approve/:songId', authMiddleware, adminMiddleware, approveSong);
router.get('/',authMiddleware,adminMiddleware, getSongs)


module.exports = router;


