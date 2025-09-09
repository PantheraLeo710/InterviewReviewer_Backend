const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isStaff: { type: Boolean, default: false },
  
  hasAttempted: { type: Boolean, default: false }, 
  score: { type: Number, default: null }, 
  result: { 
    type: String, 
    enum: ['pass', 'fail', 'pending'], 
    default: 'pending' 
  }, 
  promotedAt: { type: Date, default: null } 
});

const  User = mongoose.model('user', userSchema);
module.exports = User