const express = require('express');
const { getApplicants } = require('../controllers/applicantController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });
  res.json(req.user); 
});

router.route('/applicants').get(getApplicants);

module.exports = router;

// router.put('/me', authenticateToken, async (req, res) => {
//   const { name, email } = req.body;
//   const updated = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true }).select('-password');
//   res.json(updated);
// });
