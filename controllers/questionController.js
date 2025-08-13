// controllers/questionController.js
const Question = require('../models/Question');

// Add a new question (staff only)
exports.addQuestion = async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Options must be an array with at least 2 items' });
    }

    if (!options.includes(correctAnswer)) {
        return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    try {
        const question = new Question({
            questionText,
            options,
            correctAnswer,
            createdBy: req.user.id // req.user comes from authMiddleware
        });

        await question.save();
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error('Add Question Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all questions (without correctAnswer)
exports.getQuestions = async (req, res) => {
    try {
        console.log("Decoded JWT inside questions route:", req.user);
        const questions = await Question.find().select('-correctAnswer'); 
        res.json(questions);
    } catch (error) {
        console.error('Get Questions Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
