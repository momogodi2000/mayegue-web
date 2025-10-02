import React from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hoverable?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  size = 'md',
  hoverable = false,
  clickable = false,
  children,
  onClick,
  ...rest
}, ref) => {
  const baseClasses = [
    'rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  ];

  const variantClasses: Record<CardVariant, string> = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100',
    filled: 'bg-gray-50 border border-gray-200'
  };

  const sizeClasses: Record<CardSize, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveClasses = clsx({
    'hover:shadow-md hover:border-gray-300 cursor-pointer': hoverable,
    'active:scale-[0.98] transform': clickable,
    'hover:shadow-lg': clickable && variant === 'elevated'
  });

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    (hoverable || clickable) && interactiveClasses,
    className
  );

  if (clickable && onClick) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        onClick={(e) => onClick(e as React.MouseEvent<HTMLDivElement | HTMLButtonElement>)}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Sub-components for structured card content
export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...rest 
}) => (
  <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  children, 
  ...rest 
}) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...rest}>
    {children}
  </h3>
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ 
  className, 
  children, 
  ...rest 
}) => (
  <p className={clsx('text-sm text-gray-600 mt-1', className)} {...rest}>
    {children}
  </p>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...rest 
}) => (
  <div className={clsx('text-gray-700', className)} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...rest 
}) => (
  <div className={clsx('border-t border-gray-200 pt-4 mt-4 flex items-center justify-between', className)} {...rest}>
    {children}
  </div>
);

export { Card };


