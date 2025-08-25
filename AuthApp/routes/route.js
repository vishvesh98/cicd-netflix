const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    forgetPassword,
    resetPassword,
    logout,
    getProfile,
    updateProfile
} = require('../controller/Auth');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin only routes (if needed)
router.get('/admin/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password -token');
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
});

module.exports = router;