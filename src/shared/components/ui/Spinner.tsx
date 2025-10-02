import React from 'react';
import clsx from 'clsx';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'white';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  label = 'Loading...'
}) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses: Record<SpinnerVariant, string> = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    white: 'text-white'
  };

  const borderSize = size === 'xs' ? 'border-2' : size === 'sm' ? 'border-2' : 'border-4';

  const classes = clsx(
    'animate-spin rounded-full border-solid border-current border-t-transparent',
    sizeClasses[size],
    variantClasses[variant],
    borderSize,
    className
  );

  return (
    <div className={classes} role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text = 'Loading...',
  size = 'lg',
  variant = 'primary',
  className
}) => {
  if (!show) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      <Spinner size={size} variant={variant} />
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-700">{text}</p>
      )}
    </div>
  );
};

export interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  spinnerSize?: SpinnerSize;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  className,
  spinnerSize = 'sm'
}) => {
  return (
    <span className={clsx('inline-flex items-center', className)}>
      {isLoading && (
        <Spinner 
          size={spinnerSize} 
          variant="white" 
          className="mr-2" 
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </span>
  );
};

export { Spinner, LoadingOverlay, LoadingButton };