const express = require('express');
const { signup,signin,signout,artistget, updateArtistProfile, getAllArtists, deleteArtist } = require('../controllers/artistController');
const { uploadProfilePicture, uploadHeaderImage } = require('../controllers/artistController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Artist Signup Route
router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', authMiddleware, signout);

router.get('/getArtist', authMiddleware, artistget);

router.put('/updateArtistProfile', authMiddleware, uploadProfilePicture, updateArtistProfile);

router.get("/getAllArtists", authMiddleware, getAllArtists); // Get all artists

router.delete("/deleteArtist", authMiddleware, deleteArtist); // Delete artist


  module.exports = router;
