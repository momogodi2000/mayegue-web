import React from 'react';
import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  size = 'md',
  variant = 'default',
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  fullWidth = false,
  required = false,
  disabled,
  type = 'text',
  id,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine variant based on error/success state
  const currentVariant = error ? 'error' : success ? 'success' : variant;

  const baseClasses = [
    'block w-full rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    'placeholder-gray-400'
  ];

  const sizeClasses: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses: Record<InputVariant, string> = {
    default: [
      'border-gray-300 bg-white text-gray-900',
      'focus:border-blue-500 focus:ring-blue-500/20',
      'hover:border-gray-400'
    ].join(' '),
    error: [
      'border-red-300 bg-white text-gray-900',
      'focus:border-red-500 focus:ring-red-500/20'
    ].join(' '),
    success: [
      'border-green-300 bg-white text-gray-900',
      'focus:border-green-500 focus:ring-green-500/20'
    ].join(' ')
  };

  const iconClasses = 'w-5 h-5 text-gray-400';
  const addonClasses = 'px-3 py-2 bg-gray-50 border border-gray-300 text-gray-500 text-sm';

  const inputClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[currentVariant],
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    leftAddon && 'rounded-l-none border-l-0',
    rightAddon && 'rounded-r-none border-r-0',
    !fullWidth && 'max-w-xs',
    className
  );

  const renderInput = () => {
    const input = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={inputClasses}
        disabled={disabled}
        onFocus={(e) => {
          setIsFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
    );

    if (leftIcon || rightIcon || leftAddon || rightAddon) {
      return (
        <div className={clsx('relative flex', fullWidth ? 'w-full' : 'max-w-xs')}>
          {leftAddon && (
            <span className={clsx(addonClasses, 'rounded-l-lg border-r-0')}>
              {leftAddon}
            </span>
          )}
          
          <div className="relative flex-1">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className={iconClasses}>{leftIcon}</span>
              </div>
            )}
            
            {input}
            
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className={iconClasses}>{rightIcon}</span>
              </div>
            )}
          </div>
          
          {rightAddon && (
            <span className={clsx(addonClasses, 'rounded-r-lg border-l-0')}>
              {rightAddon}
            </span>
          )}
        </div>
      );
    }

    return input;
  };

  return (
    <div className={clsx('space-y-1', fullWidth ? 'w-full' : 'max-w-xs')}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium transition-colors duration-200',
            currentVariant === 'error' ? 'text-red-700' :
            currentVariant === 'success' ? 'text-green-700' :
            isFocused ? 'text-blue-700' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </p>
      )}
      
      {hint && !error && !success && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };


