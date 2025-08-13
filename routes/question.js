// routes/question.js
const express = require('express');
const { addQuestion, getQuestions } = require('../controllers/questionController');
const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateToken, requireRole('staff'), addQuestion);
router.get('/', authenticateToken, getQuestions);

module.exports = router;
