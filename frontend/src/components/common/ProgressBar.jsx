import React from 'react';
import { motion } from 'motion/react';

const ProgressBar = ({
  progress = 0,
  showLabel = true,
  label = 'Progress',
  size = 'md',
  showStats = false,
  completed = 0,
  total = 0,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getGradient = (val) => {
    if (val >= 100) return 'from-emerald-500 to-teal-500';
    if (val >= 60) return 'from-indigo-600 to-purple-600';
    if (val >= 30) return 'from-blue-600 to-indigo-600';
    return 'from-amber-500 to-indigo-600';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
          <span className="text-slate-600 uppercase tracking-wider">{label}</span>
          <div className="flex items-center gap-2">
            {showStats && (
              <span className="text-slate-500 font-medium">
                {completed} of {total} completed
              </span>
            )}
            <span className="text-indigo-600 font-extrabold text-sm">
              {clampedProgress}%
            </span>
          </div>
        </div>
      )}

      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heights[size] || heights.md}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getGradient(clampedProgress)} rounded-full shadow-xs`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
