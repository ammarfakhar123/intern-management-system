const express = require('express');
const router = express.Router();
const { getAdminStats, getInternStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/admin', authorize('admin'), getAdminStats);
router.get('/intern', authorize('intern'), getInternStats);

module.exports = router;
