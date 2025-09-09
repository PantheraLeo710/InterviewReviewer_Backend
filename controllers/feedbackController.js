const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.submitFeedback = async (req, res) => {
  
        console.log(req.body, "BODY");
    
        const { applicantId, interviewerName, feedbackText, result } = req.body;

        if (!applicantId || !interviewerName || !feedbackText || !result) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }
try {
        const newFeedback = await Feedback.create({
            applicantId,
            interviewerName,
            feedbackText,
            result
        });

        console.log("newFeedback",newFeedback);
        
        if (!newFeedback || newFeedback.length === 0) {
            return res.status(404).json({
                success: false,
                message: "not found"
            })
        }
        const applicant = await User.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        if (result === 'pass') {
            applicant.isStaff = true;
            applicant.promotedAt = new Date();
            await applicant.save();
            console.log(`Applicant ${applicantId} passed — promoted to staff`);

        } else if (result === 'fail') {
            applicant.isStaff = false;
            await applicant.save();
            console.log(`Applicant ${applicantId} failed — deleted from applicants`);
        }


        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            newFeedback
        });



    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }

};

exports.getAllFeedback = async (req, res) => {
    
    try {
        const feedbacks = await Feedback.find().populate('applicantId', 'name email');
        if(!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No feedback found"
            });
        }   

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error: error.message });
    }
};

