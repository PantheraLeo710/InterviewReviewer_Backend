const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Submission = require('../models/Submission');

const PASS_MARK_PERCENTAGE = 60;

exports.submitAnswers = async (req, res) => {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "'answers' must be a non-empty array." });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let score = 0;
        const answerDocs = [];

        for (const ans of answers) {
            const question = await Question.findById(ans.questionId);
            if (!question) continue;

            const isCorrect = ans.selectedOption === question.correctAnswer;
            if (isCorrect) score++;

            answerDocs.push({
                userId: user._id,
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
            userId: user._id,
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

        // Update user record instead of deleting or promoting abruptly
        user.hasAttempted = true;
        user.score = score;
        user.result = status;
        user.eligibleForStaff = status === 'pass';
        user.lastAttemptStatus = status;
        await user.save();

        const responsePayload = {
            message: 'Submission evaluated',
            score,
            totalQuestions,
            percentage,
            status,
            eligibleForStaff: user.eligibleForStaff
        };

        console.log("Backend response payload:", responsePayload);
        res.status(200).json(responsePayload);


    } catch (error) {
        console.error("Error saving answer:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getAllAnswers = async (req, res) => {
    try {
        const answers = await Answer.find().populate('userId', 'name email');
        res.json(answers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching answers' });
    }
};

exports.getMyAnswers = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const history = await Answer.find({ userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        next(err);
    }
};

exports.getMySubmissions = async (req, res) => {
    const user = req.user
    const Id = user._id
    try {
        const submissions = await Submission.find({ userId: Id })
        // const count = await Submission.countDocuments({ userId: Id });
        const count = submissions.length;
        const totalMarks = submissions.reduce((sum, submission) => {
            return sum + (submission.score || 0);
        }, 0);
        const totalPossibleScore = submissions.reduce((sum, submission) => {
            return sum + (submission.totalQuestions || 0);
        }, 0);
        const accuracy = totalPossibleScore > 0
            ? Math.floor((totalMarks / totalPossibleScore) * 100)
            : 0;
        res.json({
            success: true,
            message: "Submissions fetched successfully",
            count: count,
            accuracy: accuracy,
            submission: submissions
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    };
};

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
