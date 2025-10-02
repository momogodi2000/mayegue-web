import React from 'react';
import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  outlined?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  outlined = false,
  rounded = false,
  children,
  ...rest
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2'
  ];

  const variantClasses: Record<BadgeVariant, string> = {
    default: outlined 
      ? 'bg-transparent border border-gray-300 text-gray-700 focus:ring-gray-500'
      : 'bg-gray-100 text-gray-800',
    primary: outlined
      ? 'bg-transparent border border-blue-300 text-blue-700 focus:ring-blue-500'
      : 'bg-blue-100 text-blue-800',
    secondary: outlined
      ? 'bg-transparent border border-purple-300 text-purple-700 focus:ring-purple-500'
      : 'bg-purple-100 text-purple-800',
    success: outlined
      ? 'bg-transparent border border-green-300 text-green-700 focus:ring-green-500'
      : 'bg-green-100 text-green-800',
    warning: outlined
      ? 'bg-transparent border border-yellow-300 text-yellow-700 focus:ring-yellow-500'
      : 'bg-yellow-100 text-yellow-800',
    danger: outlined
      ? 'bg-transparent border border-red-300 text-red-700 focus:ring-red-500'
      : 'bg-red-100 text-red-800',
    info: outlined
      ? 'bg-transparent border border-cyan-300 text-cyan-700 focus:ring-cyan-500'
      : 'bg-cyan-100 text-cyan-800'
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses,
    className
  );

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };