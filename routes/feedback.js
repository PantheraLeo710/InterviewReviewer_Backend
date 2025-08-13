const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');

// Submit feedback
router.post('/', authenticateToken, requireRole('staff'), submitFeedback);

// Get all feedback
router.get('/', authenticateToken, requireRole('staff'), getAllFeedback);

module.exports = router;
