import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  className
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto',
        className
      )}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className
}) => {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h2>
  );
};

export default Dialog;
