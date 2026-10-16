const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Feedback must reference a task'],
    },
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Feedback must reference an intern'],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Feedback must reference an admin reviewer'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide feedback comments'],
      trim: true,
    },
    decision: {
      type: String,
      enum: ['approved', 'changes_requested'],
      required: [true, 'Please provide an evaluation decision'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
