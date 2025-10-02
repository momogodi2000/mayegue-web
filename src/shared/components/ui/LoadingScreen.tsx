import React from 'react';

/**
 * Full-screen loading component
 */
export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        {/* Logo or spinner */}
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Ma’a yegue
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Chargement en cours...
        </p>
      </div>
    </div>
  );
};
