const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { seedDefaultsIfEmpty } = require('./config/seedDefault');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Ensure database is connected on every request (crucial for serverless environments)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err.message);
    next();
  }
});

// Root & Health Checks
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'InternPulse Backend API', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Intern Management API', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interns', require('./routes/internRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server locally
connectDB().then(async () => {
  await seedDefaultsIfEmpty();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`🚀 InternPulse Backend Server running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    });
  }
}).catch((err) => {
  console.error('Failed to initialize server database connection:', err.message);
});

module.exports = app;
