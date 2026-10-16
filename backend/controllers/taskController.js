const Task = require('../models/Task');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Feedback = require('../models/Feedback');

// @desc    Get all tasks (Admin gets their company's tasks, intern gets their assigned tasks)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, internId, search } = req.query;
    let query = {};

    // Intern can only access tasks assigned to them
    if (req.user.role === 'intern') {
      query.assignedTo = req.user._id;
    } else {
      // Admin accesses tasks created within their company
      query.$or = [{ companyAdmin: req.user._id }, { companyAdmin: null }];
      if (internId) {
        query.assignedTo = internId;
      }
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email department phone')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      'assignedTo',
      'name email department phone'
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role check: intern can only view their own tasks
    if (
      req.user.role === 'intern' &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    // Fetch related submissions and feedback for this task
    const submissions = await Submission.find({ taskId: task._id }).sort({ createdAt: -1 });
    const feedbackList = await Feedback.find({ taskId: task._id })
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      task,
      submissions,
      feedback: feedbackList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        message: 'Title, description, assigned intern, and due date are required',
      });
    }

    // Verify assigned intern exists
    const intern = await User.findOne({ _id: assignedTo, role: 'intern' });
    if (!intern) {
      return res.status(404).json({ message: 'Selected intern was not found' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      companyAdmin: req.user._id,
      priority: priority || 'Medium',
      dueDate,
      status: 'Pending',
    });

    const populatedTask = await Task.findById(task._id).populate(
      'assignedTo',
      'name email department phone'
    );

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (assignedTo) {
      const intern = await User.findOne({ _id: assignedTo, role: 'intern' });
      if (!intern) {
        return res.status(404).json({ message: 'Assigned intern not found' });
      }
      task.assignedTo = assignedTo;
    }
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    const updatedTask = await task.save();
    const populated = await Task.findById(updatedTask._id).populate(
      'assignedTo',
      'name email department phone'
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Submission.deleteMany({ taskId: task._id });
    await Feedback.deleteMany({ taskId: task._id });
    await Task.findByIdAndDelete(task._id);

    res.json({ message: 'Task and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (e.g. Intern starts task -> In Progress)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role verification
    if (req.user.role === 'intern') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: Cannot update other users tasks' });
      }
      // Interns can only transition from Pending -> In Progress
      if (status !== 'In Progress' && status !== 'Pending') {
        return res.status(400).json({
          message: 'Interns can only start tasks (set to In Progress). Use submission form to submit work.',
        });
      }
    }

    task.status = status;
    await task.save();

    const populated = await Task.findById(task._id).populate(
      'assignedTo',
      'name email department phone'
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
