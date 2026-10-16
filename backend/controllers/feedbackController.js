const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const Submission = require('../models/Submission');

// @desc    Create feedback and evaluate submission (Admin only)
// @route   POST /api/feedback
// @access  Private/Admin
const createFeedback = async (req, res) => {
  try {
    const { taskId, comment, decision } = req.body;

    if (!taskId || !comment || !decision) {
      return res.status(400).json({ message: 'Task ID, comment, and decision are required' });
    }

    if (!['approved', 'changes_requested'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be approved or changes_requested' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Create feedback record
    const feedback = await Feedback.create({
      taskId,
      internId: task.assignedTo,
      adminId: req.user._id,
      comment: comment.trim(),
      decision,
    });

    // Update Task status
    if (decision === 'approved') {
      task.status = 'Completed';
    } else {
      task.status = 'In Progress';
    }
    await task.save();

    // Update the latest submission status
    const latestSubmission = await Submission.findOne({ taskId }).sort({ createdAt: -1 });
    if (latestSubmission) {
      latestSubmission.status = decision === 'approved' ? 'Approved' : 'Changes Requested';
      await latestSubmission.save();
    }

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('adminId', 'name email')
      .populate('internId', 'name email');

    res.status(201).json({
      feedback: populatedFeedback,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback for a specific task
// @route   GET /api/feedback/task/:taskId
// @access  Private
const getFeedbackByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      req.user.role === 'intern' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    const feedback = await Feedback.find({ taskId })
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByTaskId,
};
