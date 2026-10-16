import React from 'react';
import { motion } from 'motion/react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria yet.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-indigo-50/60 text-primary mb-4">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-base font-bold text-appText">{title}</h3>
      <p className="mt-1 text-xs text-appText-muted max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="sm"
            icon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
