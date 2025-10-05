import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  variant = 'default',
  size = 'md',
  error = false,
  helperText,
  ...props
}) => {
  const baseClasses = 'w-full border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none';
  
  const variantClasses = {
    default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
    outline: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white',
    filled: 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <div className="w-full">
      <textarea
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          errorClasses,
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;
