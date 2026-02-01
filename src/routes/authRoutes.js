const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const optionalAuth = require('../middleware/optionalAuth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/github', authLimiter, authController.githubAuth);
router.post('/github/callback', authLimiter, optionalAuth, authController.githubCallback);

// Protected routes with rate limiting
router.get('/profile', apiLimiter, authMiddleware, authController.getProfile);
router.put('/profile', apiLimiter, authMiddleware, authController.updateProfile);
router.put('/password', apiLimiter, authMiddleware, authController.updatePassword);
router.get('/stats', apiLimiter, authMiddleware, checkRole('admin', 'moderator'), authController.getUserStats);

module.exports = router;
