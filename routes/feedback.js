const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/roleMiddleware');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');

// Submit feedback
router.post('/', requireRole('staff'), submitFeedback);

// Get all feedback
router.get('/', requireRole('staff'), getAllFeedback);
//MONGO_URI=mongodb+srv://Cluster30932:87654321foreigth@cluster30932.zzxtnz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster30932


module.exports = router;
