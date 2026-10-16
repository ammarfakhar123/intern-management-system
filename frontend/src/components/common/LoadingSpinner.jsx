import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-appText-muted ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-primary`} />
      {label && <p className="text-xs font-medium tracking-wide">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
