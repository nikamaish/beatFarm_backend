const express = require('express');
const { signup,signin, signout, userget } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authMiddleware, signout);
router.get('/me', authMiddleware, userget);

module.exports = router;
