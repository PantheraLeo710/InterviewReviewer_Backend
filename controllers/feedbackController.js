const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc Submit feedback and handle applicant promotion/deletion
// @route POST /api/feedback
// @access Staff only
const submitFeedback = async (req, res) => {
    const { applicantId, interviewerName, feedbackText, result } = req.body;
    console.log(req.body, "BODY");

    try {
        const feedback = new Feedback({
            applicantId,
            interviewerName,
            feedbackText,
            result
        });

        await feedback.save();

        // Find the applicant
        const applicant = await User.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        if (result === 'pass') {
            // Promote to staff
            applicant.isStaff = true;
            applicant.promotedAt = new Date();
            await applicant.save();
            console.log(`Applicant ${applicantId} passed — promoted to staff`);

        } else if (result === 'fail') {
            // Delete the applicant
            await User.findByIdAndDelete(applicantId);
            console.log(`Applicant ${applicantId} failed — deleted from applicants`);
        }

        res.status(201).json({ message: 'Feedback submitted and action taken' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get all feedback (staff only)
// @route GET /api/feedback
// @access Staff only
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('applicantId');
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback
};
