const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Submission must belong to a task'],
    },
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submission must belong to an intern'],
    },
    githubLink: {
      type: String,
      trim: true,
      default: '',
    },
    projectLink: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide submission details or description'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Approved', 'Changes Requested'],
      default: 'Submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
