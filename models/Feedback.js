const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    interviewerName:{
        type: String,
    },
    feedbackText:{
        type: String,
    } ,
    result: {
        type: String,
        enum: ['pass', 'fail'],
        required: true
    }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback
