const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Feedback = require('../models/Feedback');

const seedDefaultsIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`📦 Database already initialized with ${userCount} users.`);
      return;
    }

    console.log('🌱 Database is empty. Seeding default demo data...');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@internpulse.com',
      password: 'admin123',
      role: 'admin',
      companyName: 'TechCorp Global',
      phone: '+1 (555) 019-2834',
      department: 'Talent & HR',
      status: 'Active',
      joiningDate: new Date('2024-01-10'),
    });

    // 2. Create Intern Users
    const intern1 = await User.create({
      name: 'Alex Morgan',
      email: 'alex.morgan@internpulse.com',
      password: 'intern123',
      role: 'intern',
      companyName: 'TechCorp Global',
      companyAdmin: admin._id,
      phone: '+1 (555) 234-5678',
      department: 'Frontend Engineering',
      status: 'Active',
      joiningDate: new Date('2025-01-15'),
      endDate: new Date('2025-07-15'),
    });

    const intern2 = await User.create({
      name: 'Sophia Chen',
      email: 'sophia.chen@internpulse.com',
      password: 'intern123',
      role: 'intern',
      companyName: 'TechCorp Global',
      companyAdmin: admin._id,
      phone: '+1 (555) 345-6789',
      department: 'Backend Engineering',
      status: 'Active',
      joiningDate: new Date('2025-02-01'),
      endDate: new Date('2025-08-01'),
    });

    const intern3 = await User.create({
      name: 'Liam Patel',
      email: 'liam.patel@internpulse.com',
      password: 'intern123',
      role: 'intern',
      companyName: 'TechCorp Global',
      companyAdmin: admin._id,
      phone: '+1 (555) 456-7890',
      department: 'UI/UX Design',
      status: 'Active',
      joiningDate: new Date('2025-02-15'),
      endDate: new Date('2025-08-15'),
    });

    // 3. Create Tasks for Alex Morgan
    const alexTask1 = await Task.create({
      title: 'Design Responsive Navigation Bar',
      description: 'Implement a mobile-responsive navigation bar with clean dropdowns, smooth animations, and active state indicators using Tailwind CSS.',
      assignedTo: intern1._id,
      companyAdmin: admin._id,
      priority: 'High',
      dueDate: new Date(Date.now() + 5 * 86400000),
      status: 'Completed',
    });

    const alexTask2 = await Task.create({
      title: 'Build Reusable StatCard Component',
      description: 'Create an animated metric card component supporting icons, percentage changes, and smooth hover elevation states.',
      assignedTo: intern1._id,
      companyAdmin: admin._id,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 3 * 86400000),
      status: 'Submitted',
    });

    const alexTask3 = await Task.create({
      title: 'Integrate User Profile Settings Form',
      description: 'Develop an interactive profile update form with client-side validation and toast notifications.',
      assignedTo: intern1._id,
      companyAdmin: admin._id,
      priority: 'Low',
      dueDate: new Date(Date.now() + 7 * 86400000),
      status: 'In Progress',
    });

    const alexTask4 = await Task.create({
      title: 'Implement Dark Mode Theme Toggle',
      description: 'Add a persistent theme switcher utilizing local storage and Tailwind CSS dark mode class strategy.',
      assignedTo: intern1._id,
      companyAdmin: admin._id,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 10 * 86400000),
      status: 'Pending',
    });

    // 4. Create Tasks for Sophia Chen
    const sophiaTask1 = await Task.create({
      title: 'Implement JWT Authentication Middleware',
      description: 'Write robust express middleware to verify bearer tokens, extract user context, and return standard JSON error responses.',
      assignedTo: intern2._id,
      companyAdmin: admin._id,
      priority: 'High',
      dueDate: new Date(Date.now() + 2 * 86400000),
      status: 'Completed',
    });

    const sophiaTask2 = await Task.create({
      title: 'Build REST APIs for Task CRUD',
      description: 'Create Express routes and Mongoose controllers for task creation, retrieval with pagination/filters, update, and deletion.',
      assignedTo: intern2._id,
      companyAdmin: admin._id,
      priority: 'High',
      dueDate: new Date(Date.now() + 4 * 86400000),
      status: 'Completed',
    });

    const sophiaTask3 = await Task.create({
      title: 'Add Request Rate Limiting & Validation',
      description: 'Protect public auth endpoints against brute force with IP-based rate limiting and input sanitization.',
      assignedTo: intern2._id,
      companyAdmin: admin._id,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 6 * 86400000),
      status: 'Pending',
    });

    // 5. Create Tasks for Liam Patel
    const liamTask1 = await Task.create({
      title: 'Design Intern Dashboard Wireframes in Figma',
      description: 'Create high-fidelity wireframes for the intern overview, task tracking table, and progress gauges.',
      assignedTo: intern3._id,
      companyAdmin: admin._id,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 1 * 86400000),
      status: 'Submitted',
    });

    const liamTask2 = await Task.create({
      title: 'Design System Color & Typography Tokens',
      description: 'Establish standard hex color palette and typography scales for consistency across dashboard cards and badges.',
      assignedTo: intern3._id,
      companyAdmin: admin._id,
      priority: 'Low',
      dueDate: new Date(Date.now() + 8 * 86400000),
      status: 'In Progress',
    });

    // 6. Submissions & Feedback
    await Submission.create({
      taskId: alexTask1._id,
      internId: intern1._id,
      githubLink: 'https://github.com/internpulse/navbar-component',
      projectLink: 'https://navbar-demo.internpulse.dev',
      description: 'Completed responsive navbar with Framer Motion slide-in transitions on mobile viewports.',
      status: 'Approved',
      submittedAt: new Date(Date.now() - 2 * 86400000),
    });

    await Feedback.create({
      taskId: alexTask1._id,
      internId: intern1._id,
      adminId: admin._id,
      comment: 'Excellent work! The mobile animations are smooth and the code is clean and modular. Approved!',
      decision: 'approved',
    });

    await Submission.create({
      taskId: alexTask2._id,
      internId: intern1._id,
      githubLink: 'https://github.com/internpulse/stat-card',
      projectLink: 'https://statcard.internpulse.dev',
      description: 'Implemented StatCard component with dynamic trend arrows and responsive padding. Ready for review.',
      status: 'Submitted',
      submittedAt: new Date(Date.now() - 4 * 3600000),
    });

    await Submission.create({
      taskId: sophiaTask1._id,
      internId: intern2._id,
      githubLink: 'https://github.com/internpulse/auth-middleware',
      projectLink: '',
      description: 'Implemented JWT token verification with expiration checks and clean error forwarding.',
      status: 'Approved',
      submittedAt: new Date(Date.now() - 3 * 86400000),
    });

    await Feedback.create({
      taskId: sophiaTask1._id,
      internId: intern2._id,
      adminId: admin._id,
      comment: 'Secure implementation and good test coverage for token verification. Approved.',
      decision: 'approved',
    });

    await Submission.create({
      taskId: liamTask1._id,
      internId: intern3._id,
      githubLink: '',
      projectLink: 'https://figma.com/file/intern-dashboard-wireframes',
      description: 'Completed desktop and tablet layout wireframes with full component library specifications.',
      status: 'Submitted',
      submittedAt: new Date(Date.now() - 6 * 3600000),
    });

    console.log('✅ Default demo dataset ready with company association!');
  } catch (error) {
    console.error('Failed to seed default demo data:', error.message);
  }
};

module.exports = { seedDefaultsIfEmpty };
