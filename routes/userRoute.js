const express = require('express');
const { signup,signin, signout } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authMiddleware, signout);

module.exports = router;
