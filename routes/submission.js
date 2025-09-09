const { viewsubmit } = require('../controllers/submissionController');
const express = require('express')
const router = express.Router();

router.route('/viewsubmit').get(viewsubmit)

module.exports = router;