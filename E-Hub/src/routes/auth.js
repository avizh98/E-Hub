const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/send-otp', authController.sendOTP);

// Protected routes
router.post('/verify-phone', authenticate, authController.verifyPhone);
router.post('/logout', authenticate, authController.logout);

module.exports = router;