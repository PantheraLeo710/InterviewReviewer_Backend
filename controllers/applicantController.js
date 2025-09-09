const User = require('../models/User');
exports.getApplicants = async (req, res) => {
  try {
    const applicants = await User.find()
      .select("name email result hasAttempted");
    res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error(error);
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Server error acknowledge" });
  }
};
