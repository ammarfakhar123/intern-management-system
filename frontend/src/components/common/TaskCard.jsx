import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';

const TaskCard = ({
  task,
  onView,
  onStart,
  onSubmitWork,
  isAdmin = false,
  index = 0,
}) => {
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={task.priority} size="xs" />
          <StatusBadge status={task.status} size="xs" />
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 line-clamp-1">
          {task.title}
        </h4>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {task.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        {/* Metadata row */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          {isAdmin && task.assignedTo && (
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="truncate max-w-[110px]">{task.assignedTo.name}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(task)}
            className="flex-1 text-xs font-bold border-slate-300 text-slate-700"
          >
            Details
          </Button>

          {!isAdmin && task.status === 'Pending' && onStart && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStart(task._id)}
              className="flex-1 text-xs font-bold"
            >
              Start Task
            </Button>
          )}

          {!isAdmin &&
            (task.status === 'In Progress' || task.status === 'Submitted') &&
            onSubmitWork && (
              <Button
                variant={task.status === 'Submitted' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => onSubmitWork(task)}
                className="flex-1 text-xs font-bold"
              >
                {task.status === 'Submitted' ? 'Update Work' : 'Submit Work'}
              </Button>
            )}

          {isAdmin && task.status === 'Submitted' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(task)}
              className="flex-1 text-xs font-bold"
            >
              Review
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
