const express = require('express');
const { signup,signin, signout, userget, updateUserProfile,deleteUser, getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authMiddleware, signout);
router.get('/getUser', authMiddleware, userget);
router.put('/updateUserProfile', authMiddleware, updateUserProfile);
router.delete("/deleteUser", authMiddleware, deleteUser); 
router.get("/getAllUsers", authMiddleware, getAllUsers); 




module.exports = router;
