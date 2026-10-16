const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('admin'), createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(authorize('admin'), updateTask)
  .delete(authorize('admin'), deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
