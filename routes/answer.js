const express = require('express');
const {
    submitAnswers,
    getAllAnswers,
    getMyAnswers,
    getMySubmissions,
    getAllSubmissions
} = require('../controllers/answerController');

const requireRole = require('../middleware/roleMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/quiz', authenticateToken, submitAnswers);
router.get('/', getAllAnswers);
router.get('/mine', getMyAnswers);
router.get('/submissions', authenticateToken ,getMySubmissions);
router.get('/submissions/all', requireRole('staff'), getAllSubmissions);

module.exports = router;