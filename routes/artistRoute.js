const express = require('express');
const { signup,signin, updateProfile } = require('../controllers/artistController');
const { uploadProfilePicture, uploadHeaderImage } = require('../controllers/artistController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Artist Signup Route
router.post('/signup', signup);


router.post('/signin', signin);

// Profile Update Route (assuming you use an authentication middleware like JWT)
router.put('/profile',authMiddleware, updateProfile);



// Assuming you have a route to update the profile
router.post("/profile", uploadProfilePicture, uploadHeaderImage, updateProfile);


  module.exports = router;
