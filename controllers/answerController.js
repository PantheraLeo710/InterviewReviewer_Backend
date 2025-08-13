// controllers/answerController.js
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Submission = require('../models/Submission');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const PASS_MARK_PERCENTAGE = 60;

// Submit answers & evaluate
exports.submitAnswers = async (req, res) => {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "'answers' must be a non-empty array." });
    }

    try {
        let score = 0;
        const answerDocs = [];

        for (const ans of answers) {
            const question = await Question.findById(ans.questionId);
            if (!question) continue;

            const isCorrect = ans.selectedOption === question.correctAnswer;
            if (isCorrect) score++;

            answerDocs.push({
                userId: req.user._id,
                question: ans.questionId,
                selectedOption: ans.selectedOption,
                isCorrect
            });
        }

        await Answer.insertMany(answerDocs);

        const totalQuestions = answers.length;
        const percentage = (score / totalQuestions) * 100;
        const status = percentage >= PASS_MARK_PERCENTAGE ? 'pass' : 'fail';

        await Submission.create({
            userId: req.user._id,
            answers: answerDocs.map(ans => ({
                question: ans.question,
                selectedOption: ans.selectedOption,
                isCorrect: ans.isCorrect
            })),
            score,
            totalQuestions,
            percentage,
            status
        });

        const applicant = await User.findById(req.user._id);
        if (!applicant) return res.status(404).json({ message: 'User not found' });

        if (status === 'pass') {
            applicant.isStaff = true;
            applicant.promotedAt = new Date();
            await applicant.save();


            const newToken = jwt.sign(
                {
                    id: applicant._id,
                    name: applicant.name,
                    email: applicant.email,
                    isStaff: true
                },
                JWT_SECRET,
                { expiresIn: '10h' }
            );

            if (process.env.NODE_ENV !== 'production') {
                console.log("Submitted answers:", answers);
                console.log("Decoded User:", req.user);
            }

            return res.status(200).json({
                message: 'Submission successful',
                score,
                totalQuestions,
                percentage,
                status,
                token: newToken,
                user: {
                    id: applicant._id,
                    name: applicant.name,
                    email: applicant.email,
                    is: true
                }
            });
        } else {
            await User.findByIdAndDelete(req.user._id);

            if (process.env.NODE_ENV !== 'production') {
                console.log("Submitted answers:", answers);
                console.log("Decoded User:", req.user);
            }

            return res.status(200).json({
                message: 'Submission evaluated',
                score,
                totalQuestions,
                percentage,
                status,
                answers
            });
        }
    } catch (error) {
        console.error("Error saving answer:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all answers (staff only)
exports.getAllAnswers = async (req, res) => {
    try {
        const answers = await Answer.find().populate('userId', 'name email');
        res.json(answers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching answers' });
    }
};

// Get my answer history
exports.getMyAnswers = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await Answer.find({ userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my submissions
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id })
            .sort({ submittedAt: -1 })
            .populate('answers.question', 'questionText');

        res.json(submissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all submissions (staff only)
exports.getAllSubmissions = async (req, res) => {
    console.log("User Role Check:", {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isStaff: req.user.isStaff
    });
    try {
        const submissions = await Submission.find()
            .sort({ submittedAt: -1 })
            .populate('userId', 'name email')
            .populate('answers.question', 'questionText');
        res.json(submissions);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
