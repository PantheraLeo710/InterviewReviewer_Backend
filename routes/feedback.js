const express = require('express');
const feedrouter = express.Router();
const { submitFeedback, getAllFeedback, } = require('../controllers/feedbackController');

feedrouter.post("/submit", submitFeedback);
feedrouter.get("/viewfeedback", getAllFeedback);



module.exports = feedrouter;
