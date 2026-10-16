const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbackByTaskId,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('admin'), createFeedback);
router.get('/task/:taskId', getFeedbackByTaskId);

module.exports = router;
