const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Feedback = require('../models/Feedback');

// @desc    Get all interns (with search and department filter)
// @route   GET /api/interns
// @access  Private/Admin
const getInterns = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    let query = { role: 'intern' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const interns = await User.find(query).sort({ createdAt: -1 });

    // Attach task count & progress to each intern
    const internsWithStats = await Promise.all(
      interns.map(async (intern) => {
        const totalTasks = await Task.countDocuments({ assignedTo: intern._id });
        const completedTasks = await Task.countDocuments({
          assignedTo: intern._id,
          status: 'Completed',
        });
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...intern.toJSON(),
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json(internsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single intern by ID (with full details and tasks)
// @route   GET /api/interns/:id
// @access  Private
const getInternById = async (req, res) => {
  try {
    const intern = await User.findOne({ _id: req.params.id, role: 'intern' });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // Role check: Only admin or the intern themselves can view
    if (req.user.role !== 'admin' && req.user._id.toString() !== intern._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    const tasks = await Task.find({ assignedTo: intern._id }).sort({ createdAt: -1 });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const submittedTasks = tasks.filter((t) => t.status === 'Submitted').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      intern,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        submittedTasks,
        progress,
      },
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new intern account
// @route   POST /api/interns
// @access  Private/Admin
const createIntern = async (req, res) => {
  try {
    const { name, email, password, phone, department, joiningDate, endDate, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const internExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (internExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const intern = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'intern',
      phone: phone ? phone.trim() : '',
      department: department || 'Engineering',
      joiningDate: joiningDate || Date.now(),
      endDate: endDate || null,
      status: status || 'Active',
    });

    res.status(201).json(intern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update intern information
// @route   PUT /api/interns/:id
// @access  Private/Admin
const updateIntern = async (req, res) => {
  try {
    const intern = await User.findOne({ _id: req.params.id, role: 'intern' });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const { name, email, phone, department, joiningDate, endDate, status, password } = req.body;

    if (name) intern.name = name.trim();
    if (email) {
      const emailLower = email.toLowerCase().trim();
      if (emailLower !== intern.email) {
        const existing = await User.findOne({ email: emailLower });
        if (existing) {
          return res.status(400).json({ message: 'Email is already in use by another account' });
        }
        intern.email = emailLower;
      }
    }
    if (phone !== undefined) intern.phone = phone.trim();
    if (department) intern.department = department;
    if (joiningDate) intern.joiningDate = joiningDate;
    if (endDate !== undefined) intern.endDate = endDate;
    if (status) intern.status = status;
    if (password && password.trim().length >= 6) {
      intern.password = password;
    }

    const updatedIntern = await intern.save();
    res.json(updatedIntern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete intern account
// @route   DELETE /api/interns/:id
// @access  Private/Admin
const deleteIntern = async (req, res) => {
  try {
    const intern = await User.findOne({ _id: req.params.id, role: 'intern' });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // Cascade delete associated tasks, submissions, feedback
    await Task.deleteMany({ assignedTo: intern._id });
    await Submission.deleteMany({ internId: intern._id });
    await Feedback.deleteMany({ internId: intern._id });
    await User.findByIdAndDelete(intern._id);

    res.json({ message: 'Intern and all associated tasks removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInterns,
  getInternById,
  createIntern,
  updateIntern,
  deleteIntern,
};
