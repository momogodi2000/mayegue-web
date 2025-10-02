import React from 'react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={clsx('animate-spin rounded-full border-2 border-current border-t-transparent', sizeClasses[size])} />
  );
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  ...rest
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-95 transform'
  ];

  const variantClasses: Record<ButtonVariant, string> = {
    primary: [
      'bg-blue-600 hover:bg-blue-700 text-white',
      'focus:ring-blue-500',
      'shadow-sm hover:shadow-md'
    ].join(' '),
    secondary: [
      'bg-gray-100 hover:bg-gray-200 text-gray-900',
      'focus:ring-gray-500',
      'border border-gray-300'
    ].join(' '),
    outline: [
      'bg-transparent border-2 border-blue-600 text-blue-600',
      'hover:bg-blue-50 focus:ring-blue-500'
    ].join(' '),
    ghost: [
      'bg-transparent text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-500'
    ].join(' '),
    danger: [
      'bg-red-600 hover:bg-red-700 text-white',
      'focus:ring-red-500',
      'shadow-sm hover:shadow-md'
    ].join(' '),
    success: [
      'bg-green-600 hover:bg-green-700 text-white',
      'focus:ring-green-500',
      'shadow-sm hover:shadow-md'
    ].join(' ')
  };

  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const spinnerSizes: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
    xs: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'md',
    xl: 'lg'
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingSpinner size={spinnerSizes[size]} />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      );
    }

    return (
      <>
        {leftIcon && (
          <span className={clsx('flex-shrink-0', iconSizes[size], children && 'mr-2')}>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={clsx('flex-shrink-0', iconSizes[size], children && 'ml-2')}>
            {rightIcon}
          </span>
        )}
      </>
    );
  };

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      {...rest}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };


