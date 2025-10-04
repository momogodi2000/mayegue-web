import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-2 text-sm underline">
        Réessayer
      </button>
    )}
  </div>
);

export default ErrorMessage;
