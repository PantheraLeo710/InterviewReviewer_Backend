// routes/answer.js
const express = require('express');
const {
    submitAnswers,
    getAllAnswers,
    getMyAnswers,
    getMySubmissions,
    getAllSubmissions
} = require('../controllers/answerController');

const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateToken, submitAnswers);
router.get('/', authenticateToken, getAllAnswers);
router.get('/mine', authenticateToken, getMyAnswers);
router.get('/submissions/mine', authenticateToken, getMySubmissions);
router.get('/submissions/all', authenticateToken, requireRole('staff'), getAllSubmissions);

module.exports = router;
