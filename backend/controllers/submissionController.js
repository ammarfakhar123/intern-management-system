const Submission = require('../models/Submission');
const Task = require('../models/Task');

// @desc    Submit work for a task
// @route   POST /api/submissions
// @access  Private/Intern
const createSubmission = async (req, res) => {
  try {
    const { taskId, githubLink, projectLink, description } = req.body;

    if (!taskId || !description) {
      return res.status(400).json({ message: 'Task ID and description are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role check: Only the assigned intern can submit
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only submit work for your assigned tasks' });
    }

    const submission = await Submission.create({
      taskId,
      internId: req.user._id,
      githubLink: githubLink ? githubLink.trim() : '',
      projectLink: projectLink ? projectLink.trim() : '',
      description: description.trim(),
      status: 'Submitted',
      submittedAt: new Date(),
    });

    // Update Task status to 'Submitted'
    task.status = 'Submitted';
    await task.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
const getSubmissions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'intern') {
      query.internId = req.user._id;
    }

    const submissions = await Submission.find(query)
      .populate('taskId', 'title priority dueDate status')
      .populate('internId', 'name email department')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submissions for a specific task
// @route   GET /api/submissions/task/:taskId
// @access  Private
const getSubmissionsByTaskId = async (req, res) => {
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

    const submissions = await Submission.find({ taskId })
      .populate('internId', 'name email')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionsByTaskId,
};
