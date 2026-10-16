const express = require('express');
const router = express.Router();
const {
  getInterns,
  getInternById,
  createIntern,
  updateIntern,
  deleteIntern,
} = require('../controllers/internController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), getInterns)
  .post(authorize('admin'), createIntern);

router
  .route('/:id')
  .get(getInternById)
  .put(authorize('admin'), updateIntern)
  .delete(authorize('admin'), deleteIntern);

module.exports = router;
