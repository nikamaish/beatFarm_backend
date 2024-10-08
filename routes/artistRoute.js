const express = require('express');
const { signup,signin,signout, getByIdArtist, getAllArtist, deleteArtistProfile, updateProfile } = require('../controllers/artistController');
const { uploadProfilePicture, uploadHeaderImage } = require('../controllers/artistController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Artist Signup Route
router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', authMiddleware, signout);


router.put('/profile', authMiddleware, uploadProfilePicture, uploadHeaderImage, updateProfile);

router.get("/allartists", authMiddleware, getAllArtist); // Get all artists
router.get("/:id", authMiddleware, getByIdArtist); // Get artist by ID
router.delete("/:id", authMiddleware, deleteArtistProfile); // Delete artist




  module.exports = router;
