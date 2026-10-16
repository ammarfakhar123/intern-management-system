import React from 'react';

const statusStyles = {
  // Task statuses
  'Pending': 'bg-amber-100 text-amber-900 border-amber-300',
  'In Progress': 'bg-blue-100 text-blue-900 border-blue-300',
  'Submitted': 'bg-purple-100 text-purple-900 border-purple-300',
  'Completed': 'bg-emerald-100 text-emerald-900 border-emerald-300',

  // Intern statuses
  'Active': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'Inactive': 'bg-slate-200 text-slate-800 border-slate-300',

  // Priority
  'High': 'bg-rose-100 text-rose-900 border-rose-300',
  'Medium': 'bg-amber-100 text-amber-900 border-amber-300',
  'Low': 'bg-emerald-100 text-emerald-900 border-emerald-300',

  // Submission/Review Decisions
  'Approved': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'approved': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  'Changes Requested': 'bg-rose-100 text-rose-900 border-rose-300',
  'changes_requested': 'bg-rose-100 text-rose-900 border-rose-300',
};

const dotColors = {
  'Pending': 'bg-amber-600',
  'In Progress': 'bg-blue-600',
  'Submitted': 'bg-purple-600',
  'Completed': 'bg-emerald-600',
  'Active': 'bg-emerald-600',
  'Inactive': 'bg-slate-600',
  'High': 'bg-rose-600',
  'Medium': 'bg-amber-600',
  'Low': 'bg-emerald-600',
  'Approved': 'bg-emerald-600',
  'approved': 'bg-emerald-600',
  'Changes Requested': 'bg-rose-600',
  'changes_requested': 'bg-rose-600',
};

const StatusBadge = ({ status, size = 'sm', showDot = true, className = '' }) => {
  const normalized = status || 'Pending';
  const style = statusStyles[normalized] || 'bg-slate-100 text-slate-800 border-slate-300';
  const dotColor = dotColors[normalized] || 'bg-slate-500';

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1.5',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  const displayText =
    normalized === 'changes_requested'
      ? 'Changes Requested'
      : normalized === 'approved'
      ? 'Approved'
      : normalized;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${
        sizeClasses[size] || sizeClasses.sm
      } ${style} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      )}
      {displayText}
    </span>
  );
};

export default StatusBadge;
