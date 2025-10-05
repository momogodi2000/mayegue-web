import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  useToastActions
} from '@/shared/components/ui';
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface BulkOperation {
  id: string;
  type: 'status_update' | 'role_change' | 'email_send' | 'delete' | 'export';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface BulkOperationsPanelProps {
  selectedUsers: string[];
  onOperationComplete: () => void;
}

const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({
  selectedUsers,
  onOperationComplete
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [operationParams, setOperationParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const bulkOperations: BulkOperation[] = [
    {
      id: 'status_update',
      type: 'status_update',
      label: 'Mettre à jour le statut',
      description: 'Modifier le statut de plusieurs utilisateurs',
      icon: ShieldCheckIcon,
      color: 'bg-blue-500'
    },
    {
      id: 'role_change',
      type: 'role_change',
      label: 'Changer le rôle',
      description: 'Modifier le rôle de plusieurs utilisateurs',
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      id: 'email_send',
      type: 'email_send',
      label: 'Envoyer un email',
      description: 'Envoyer un email à plusieurs utilisateurs',
      icon: EnvelopeIcon,
      color: 'bg-green-500'
    },
    {
      id: 'delete',
      type: 'delete',
      label: 'Supprimer',
      description: 'Supprimer définitivement les utilisateurs',
      icon: TrashIcon,
      color: 'bg-red-500'
    },
    {
      id: 'export',
      type: 'export',
      label: 'Exporter',
      description: 'Exporter les données des utilisateurs',
      icon: CheckCircleIcon,
      color: 'bg-indigo-500'
    }
  ];

  const handleOperationSelect = (operationId: string) => {
    setSelectedOperation(operationId);
    setOperationParams({});
  };

  const handleParameterChange = (key: string, value: any) => {
    setOperationParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const executeBulkOperation = async () => {
    if (!selectedOperation || selectedUsers.length === 0) {
      showError('Veuillez sélectionner une opération et des utilisateurs');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const operation = bulkOperations.find(op => op.id === selectedOperation);
      showSuccess(
        `Opération "${operation?.label}" exécutée avec succès sur ${selectedUsers.length} utilisateur(s)`
      );

      setSelectedOperation('');
      setOperationParams({});
      onOperationComplete();
    } catch (error) {
      showError('Erreur lors de l\'exécution de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const renderOperationForm = () => {
    switch (selectedOperation) {
      case 'status_update':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nouveau statut</label>
              <SelectRoot
                value={operationParams.status || ''}
                onValueChange={(value) => handleParameterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="banned">Banni</SelectItem>
                </SelectContent>
              </SelectRoot>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Raison (optionnel)</label>
              <Input
                placeholder="Raison du changement de statut"
                value={operationParams.reason || ''}
                onChange={(e) => handleParameterChange('reason', e.target.value)}
              />
            </div>
          </div>
        );

      case 'role_change':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nouveau rôle</label>
              <SelectRoot
                value={operationParams.role || ''}
                onValueChange={(value) => handleParameterChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learner">Apprenant</SelectItem>
                  <SelectItem value="teacher">Enseignant</SelectItem>
                  <SelectItem value="moderator">Modérateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </SelectRoot>
            </div>
          </div>
        );

      case 'email_send':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <Input
                placeholder="Sujet de l'email"
                value={operationParams.subject || ''}
                onChange={(e) => handleParameterChange('subject', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Contenu de l'email"
                value={operationParams.message || ''}
                onChange={(e) => handleParameterChange('message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Attention</span>
              </div>
              <p className="text-red-700 mt-2">
                Cette action supprimera définitivement {selectedUsers.length} utilisateur(s) et toutes leurs données.
                Cette action est irréversible.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tapez "SUPPRIMER" pour confirmer
              </label>
              <Input
                placeholder="SUPPRIMER"
                value={operationParams.confirmation || ''}
                onChange={(e) => handleParameterChange('confirmation', e.target.value)}
              />
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Format d'export</label>
              <SelectRoot
                value={operationParams.format || ''}
                onValueChange={(value) => handleParameterChange('format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </SelectRoot>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Champs à inclure</label>
              <div className="space-y-2">
                {['email', 'displayName', 'role', 'status', 'createdAt', 'lastActive'].map(field => (
                  <label key={field} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={operationParams.fields?.includes(field) || false}
                      onChange={(e) => {
                        const fields = operationParams.fields || [];
                        if (e.target.checked) {
                          handleParameterChange('fields', [...fields, field]);
                        } else {
                          handleParameterChange('fields', fields.filter((f: string) => f !== field));
                        }
                      }}
                    />
                    <span className="text-sm capitalize">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedUsers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Sélectionnez des utilisateurs pour effectuer des opérations en lot</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5" />
          Opérations en Lot
          <Badge variant="secondary">{selectedUsers.length} utilisateur(s) sélectionné(s)</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Choisir une opération</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bulkOperations.map((operation) => {
              const Icon = operation.icon;
              return (
                <motion.button
                  key={operation.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOperationSelect(operation.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOperation === operation.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${operation.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{operation.label}</p>
                      <p className="text-xs text-gray-600">{operation.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Operation Form */}
        {selectedOperation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <h4 className="font-medium mb-4">Paramètres de l'opération</h4>
            {renderOperationForm()}
          </motion.div>
        )}

        {/* Execute Button */}
        {selectedOperation && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOperation('');
                setOperationParams({});
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={executeBulkOperation}
              disabled={loading}
              className={`flex-1 ${
                selectedOperation === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
            >
              {loading ? (
                <>
                  <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                  Exécution...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Exécuter
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkOperationsPanel;
