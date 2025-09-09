const mongoose = require('mongoose');
const User = require('./User');

const submissionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedOption: String,
      isCorrect: Boolean
    }
  ],

  score: Number,
  totalQuestions: Number,
  percentage: Number,
  status: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Submission = mongoose.model('submission' ,submissionSchema )

module.exports = Submission;