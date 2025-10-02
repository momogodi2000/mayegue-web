import React from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form = forwardRef<HTMLFormElement, FormProps>(({
  className,
  children,
  onSubmit,
  ...rest
}, ref) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <form
      ref={ref}
      className={clsx('space-y-6', className)}
      onSubmit={handleSubmit}
      {...rest}
    >
      {children}
    </form>
  );
});

Form.displayName = 'Form';

// Form Group component for organizing form fields
export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  inline?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({
  className,
  children,
  inline = false,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        inline ? 'flex items-center space-x-4' : 'space-y-2',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Form Actions component for submit/cancel buttons
export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

const FormActions: React.FC<FormActionsProps> = ({
  className,
  children,
  align = 'right',
  spacing = 'md',
  ...rest
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  const spacingClasses = {
    sm: 'space-x-2',
    md: 'space-x-3',
    lg: 'space-x-4'
  };

  return (
    <div
      className={clsx(
        'flex items-center',
        alignClasses[align],
        spacingClasses[spacing],
        'pt-4 border-t border-gray-200',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Form Error component for displaying form-level errors
export interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  show?: boolean;
}

const FormError: React.FC<FormErrorProps> = ({
  className,
  message,
  show = true,
  ...rest
}) => {
  if (!show) return null;

  return (
    <div
      className={clsx(
        'rounded-md bg-red-50 border border-red-200 p-4',
        className
      )}
      role="alert"
      {...rest}
    >
      <div className="flex">
        <svg
          className="w-5 h-5 text-red-400 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There was an error with your submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Success component for displaying success messages
export interface FormSuccessProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  show?: boolean;
}

const FormSuccess: React.FC<FormSuccessProps> = ({
  className,
  message,
  show = true,
  ...rest
}) => {
  if (!show) return null;

  return (
    <div
      className={clsx(
        'rounded-md bg-green-50 border border-green-200 p-4',
        className
      )}
      role="alert"
      {...rest}
    >
      <div className="flex">
        <svg
          className="w-5 h-5 text-green-400 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Success!
          </h3>
          <div className="mt-2 text-sm text-green-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Form, FormGroup, FormActions, FormError, FormSuccess };