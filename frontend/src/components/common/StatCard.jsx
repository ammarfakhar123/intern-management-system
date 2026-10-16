import React from 'react';
import { motion } from 'motion/react';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    border: 'hover:border-indigo-300',
    badge: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  },
  purple: {
    bg: 'bg-purple-50 text-purple-700 border border-purple-200',
    border: 'hover:border-purple-300',
    badge: 'bg-purple-100 text-purple-800 border border-purple-200',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    border: 'hover:border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-700 border border-amber-200',
    border: 'hover:border-amber-300',
    badge: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-700 border border-rose-200',
    border: 'hover:border-rose-300',
    badge: 'bg-rose-100 text-rose-800 border border-rose-200',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  badgeText,
  icon: Icon,
  color = 'indigo',
  index = 0,
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${theme.border} transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.bg}`}>
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </h4>
        {badgeText && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-600 font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
