const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interviewerName: String,
    feedbackText: String,
    result: {
        type: String,
        enum: ['pass', 'fail'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
