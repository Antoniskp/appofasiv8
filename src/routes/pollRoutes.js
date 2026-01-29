const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const authMiddleware = require('../middleware/auth');
const optionalAuthMiddleware = require('../middleware/optionalAuth');

// Public routes (with optional auth)
router.get('/', optionalAuthMiddleware, pollController.getPolls);
router.get('/:id', optionalAuthMiddleware, pollController.getPoll);
router.get('/:id/results', pollController.getPollResults);

// Protected routes (require authentication)
router.post('/', authMiddleware, pollController.createPoll);
router.put('/:id', authMiddleware, pollController.updatePoll);
router.delete('/:id', authMiddleware, pollController.deletePoll);

// Voting (optional auth - depends on poll settings)
router.post('/:id/vote', optionalAuthMiddleware, pollController.submitVote);

// User-submitted options (optional auth)
router.post('/:id/options', optionalAuthMiddleware, pollController.addUserOption);

module.exports = router;
