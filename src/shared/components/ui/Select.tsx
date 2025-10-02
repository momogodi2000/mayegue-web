import { SelectHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'error' | 'success';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const getLabelTextColor = (variant: SelectVariant, isFocused: boolean): string => {
  if (variant === 'error') return 'text-red-700';
  if (variant === 'success') return 'text-green-700';
  return isFocused ? 'text-blue-700' : 'text-gray-700';
};

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize;
  variant?: SelectVariant;
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  size = 'md',
  variant = 'default',
  label,
  error,
  success,
  hint,
  options,
  placeholder,
  fullWidth = false,
  required = false,
  disabled,
  id,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine variant based on error/success state
  let currentVariant = variant;
  if (error) currentVariant = 'error';
  else if (success) currentVariant = 'success';

  const baseClasses = [
    'block w-full rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    'bg-white appearance-none pr-10'
  ];

  const sizeClasses: Record<SelectSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses: Record<SelectVariant, string> = {
    default: [
      'border-gray-300 text-gray-900',
      'focus:border-blue-500 focus:ring-blue-500/20',
      'hover:border-gray-400'
    ].join(' '),
    error: [
      'border-red-300 text-gray-900',
      'focus:border-red-500 focus:ring-red-500/20'
    ].join(' '),
    success: [
      'border-green-300 text-gray-900',
      'focus:border-green-500 focus:ring-green-500/20'
    ].join(' ')
  };

  const selectClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[currentVariant],
    !fullWidth && 'max-w-xs',
    className
  );

  return (
    <div className={clsx('space-y-1', fullWidth ? 'w-full' : 'max-w-xs')}>
      {label && (
        <label
          htmlFor={selectId}
          className={clsx(
            'block text-sm font-medium transition-colors duration-200',
            getLabelTextColor(currentVariant, isFocused)
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
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

Select.displayName = 'Select';

export { Select };