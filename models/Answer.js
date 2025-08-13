const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: String,
  isCorrect: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
