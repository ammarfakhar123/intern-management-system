import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary shadow-sm hover:shadow',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 focus:ring-secondary shadow-sm hover:shadow',
    outline: 'border border-surface-border bg-white text-appText hover:bg-slate-50 hover:border-slate-300 focus:ring-primary',
    ghost: 'text-appText-muted hover:text-appText hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700 focus:ring-danger shadow-sm',
    success: 'bg-success text-white hover:bg-emerald-600 active:bg-emerald-700 focus:ring-success shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
