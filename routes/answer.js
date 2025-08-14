// routes/answer.js
const express = require('express');
const {
    submitAnswers,
    getAllAnswers,
    getMyAnswers,
    getMySubmissions,
    getAllSubmissions
} = require('../controllers/answerController');


const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', submitAnswers);
router.get('/', getAllAnswers);
router.get('/mine', getMyAnswers);
router.get('/submissions/mine', getMySubmissions);
router.get('/submissions/all', requireRole('staff'), getAllSubmissions);

module.exports = router;
