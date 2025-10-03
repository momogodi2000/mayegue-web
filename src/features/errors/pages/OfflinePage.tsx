import React from 'react';
import { Button } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

const OfflinePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (navigator.onLine) {
      navigate(-1);
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vous êtes hors ligne
          </h1>
          <p className="text-gray-600">
            Vérifiez votre connexion internet et réessayez
          </p>
        </div>

        {/* Status Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {navigator.onLine ? 'Connexion rétablie' : 'Pas de connexion'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Vérifiez votre connexion Wi-Fi ou mobile</p>
            <p>• Assurez-vous que votre routeur est allumé</p>
            <p>• Essayez de vous déplacer vers un endroit avec un meilleur signal</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full"
            disabled={!navigator.onLine}
          >
            {navigator.onLine ? 'Réessayer' : 'Vérifier la connexion'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoHome}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>

        {/* Offline Features Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Fonctionnalités hors ligne
          </h3>
          <p className="text-xs text-blue-700">
            Certaines leçons téléchargées peuvent être disponibles hors ligne. 
            Vérifiez votre bibliothèque de téléchargements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;