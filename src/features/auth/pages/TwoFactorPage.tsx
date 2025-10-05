import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Modal
} from '@/shared/components/ui';
import { 
  ShieldCheckIcon,
  ShieldExclamationIcon,
  PhoneIcon,
  TrashIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/core/services/firebase/auth.service';
import { TwoFactorSetup } from '../components/TwoFactorSetup';
import toast from 'react-hot-toast';

interface EnrolledFactor {
  uid: string;
  displayName: string;
  phoneNumber?: string;
  enrollmentTime: string;
}

export default function TwoFactorPage() {
  const { user } = useAuthStore();
  const [enrolledFactors, setEnrolledFactors] = useState<EnrolledFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [factorToDisable, setFactorToDisable] = useState<string | null>(null);

  useEffect(() => {
    loadEnrolledFactors();
  }, []);

  const loadEnrolledFactors = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Get enrolled MFA factors
        const { multiFactor } = await import('firebase/auth');
        const factors = multiFactor(currentUser).enrolledFactors;
        
        const mappedFactors: EnrolledFactor[] = factors.map(factor => ({
          uid: factor.uid,
          displayName: factor.displayName || 'Téléphone',
          phoneNumber: (factor as any).phoneNumber,
          enrollmentTime: factor.enrollmentTime
        }));
        
        setEnrolledFactors(mappedFactors);
      }
    } catch (error) {
      console.error('Error loading enrolled factors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableFactor = async (factorUid: string) => {
    try {
      await authService.unenrollMFA(factorUid);
      await loadEnrolledFactors();
      toast.success('Authentification 2FA désactivée');
      setShowDisableConfirm(false);
      setFactorToDisable(null);
    } catch (error: any) {
      console.error('Error disabling MFA:', error);
      toast.error('Erreur lors de la désactivation: ' + error.message);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    loadEnrolledFactors();
    toast.success('2FA configurée avec succès!');
  };

  const is2FAEnabled = enrolledFactors.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Authentification à deux facteurs - Ma'a yegue</title>
        <meta name="description" content="Gérez vos paramètres d'authentification à deux facteurs" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {is2FAEnabled ? (
                <div className="bg-green-100 rounded-full p-4">
                  <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 rounded-full p-4">
                  <ShieldExclamationIcon className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Authentification à deux facteurs
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire 
              à votre compte en demandant un code de vérification en plus de votre mot de passe.
            </p>
          </div>

          {/* Status Card */}
          <Card className={`border-2 ${is2FAEnabled ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {is2FAEnabled ? (
                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                  ) : (
                    <ShieldExclamationIcon className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${is2FAEnabled ? 'text-green-900' : 'text-red-900'}`}>
                      {is2FAEnabled ? '2FA Activée' : '2FA Désactivée'}
                    </h3>
                    <p className={`text-sm ${is2FAEnabled ? 'text-green-700' : 'text-red-700'}`}>
                      {is2FAEnabled 
                        ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                        : 'Votre compte n\'est pas protégé par l\'authentification à deux facteurs'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={is2FAEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {is2FAEnabled ? 'Sécurisé' : 'Non sécurisé'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Factors */}
          {is2FAEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PhoneIcon className="w-5 h-5" />
                  <span>Méthodes configurées</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledFactors.map((factor) => (
                    <div key={factor.uid} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{factor.displayName}</p>
                          {factor.phoneNumber && (
                            <p className="text-sm text-gray-500">{factor.phoneNumber}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            Configuré le {new Date(factor.enrollmentTime).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFactorToDisable(factor.uid);
                          setShowDisableConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!is2FAEnabled ? (
                  <Button
                    onClick={() => setShowSetup(true)}
                    className="w-full sm:w-auto"
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                  >
                    Activer l'authentification 2FA
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSetup(true)}
                    variant="outline"
                    className="w-full sm:w-auto"
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                  >
                    Ajouter une méthode
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Conseils de sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Gardez votre téléphone accessible pour recevoir les codes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Ne partagez jamais vos codes de vérification avec qui que ce soit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Configurez plusieurs méthodes de vérification si possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Mettez à jour votre numéro de téléphone si vous changez</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Setup Modal */}
      <Modal
        open={showSetup}
        onClose={() => setShowSetup(false)}
        title="Configuration 2FA"
        size="lg"
      >
        <TwoFactorSetup
          onComplete={handleSetupComplete}
          onCancel={() => setShowSetup(false)}
        />
      </Modal>

      {/* Disable Confirmation Modal */}
      <Modal
        open={showDisableConfirm}
        onClose={() => setShowDisableConfirm(false)}
        title="Désactiver l'authentification 2FA"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Êtes-vous sûr?</h3>
              <p className="text-sm text-gray-600 mt-1">
                La désactivation de l'authentification à deux facteurs rendra votre compte moins sécurisé. 
                Vous pourrez la réactiver à tout moment.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDisableConfirm(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => factorToDisable && handleDisableFactor(factorToDisable)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Désactiver
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
