const User = require('../models/User');
const Task = require('../models/Task');
const Feedback = require('../models/Feedback');

// @desc    Get Admin Dashboard metrics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalInterns = await User.countDocuments({ role: 'intern' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const submittedTasks = await Task.countDocuments({ status: 'Submitted' });

    // Task status counts for Donut Chart
    const statusBreakdown = [
      { name: 'Pending', value: await Task.countDocuments({ status: 'Pending' }), color: '#F59E0B' },
      { name: 'In Progress', value: await Task.countDocuments({ status: 'In Progress' }), color: '#3B82F6' },
      { name: 'Submitted', value: submittedTasks, color: '#8B5CF6' },
      { name: 'Completed', value: completedTasks, color: '#10B981' },
    ];

    // Priority breakdown
    const priorityBreakdown = [
      { name: 'High', value: await Task.countDocuments({ priority: 'High' }), color: '#EF4444' },
      { name: 'Medium', value: await Task.countDocuments({ priority: 'Medium' }), color: '#F59E0B' },
      { name: 'Low', value: await Task.countDocuments({ priority: 'Low' }), color: '#10B981' },
    ];

    // Recent 5 interns
    const recentInterns = await User.find({ role: 'intern' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 tasks
    const recentTasks = await Task.find()
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalInterns,
        totalTasks,
        completedTasks,
        pendingTasks,
        submittedTasks,
      },
      statusBreakdown,
      priorityBreakdown,
      recentInterns,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Intern Dashboard metrics
// @route   GET /api/dashboard/intern
// @access  Private/Intern
const getInternStats = async (req, res) => {
  try {
    const internId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: internId });
    const completedTasks = await Task.countDocuments({ assignedTo: internId, status: 'Completed' });
    const submittedTasks = await Task.countDocuments({ assignedTo: internId, status: 'Submitted' });
    const pendingTasks = await Task.countDocuments({
      assignedTo: internId,
      status: { $in: ['Pending', 'In Progress'] },
    });

    // Formula: Progress = (Completed Tasks / Total Assigned Tasks) * 100
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks
    const myTasks = await Task.find({ assignedTo: internId })
      .sort({ createdAt: -1 })
      .limit(6);

    // Upcoming deadlines (tasks not yet completed, ordered by dueDate ascending)
    const upcomingDeadlines = await Task.find({
      assignedTo: internId,
      status: { $ne: 'Completed' },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Recent feedback from Admin on this intern's tasks
    const recentFeedback = await Feedback.find({ internId })
      .populate('adminId', 'name email')
      .populate('taskId', 'title priority')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        assignedTasks: totalTasks,
        pendingTasks,
        submittedTasks,
        completedTasks,
        overallProgress: progress,
      },
      intern: {
        name: req.user.name,
        email: req.user.email,
        department: req.user.department,
        status: req.user.status,
        joiningDate: req.user.joiningDate,
      },
      myTasks,
      upcomingDeadlines,
      recentFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getInternStats,
};
