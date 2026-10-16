const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  getSubmissionsByTaskId,
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createSubmission).get(getSubmissions);
router.get('/task/:taskId', getSubmissionsByTaskId);

module.exports = router;
