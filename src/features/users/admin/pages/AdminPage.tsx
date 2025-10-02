import React, { useState } from 'react';
import { 
  AdminDashboard, 
  UserManagement, 
  ContentModeration, 
  ReportsManagement 
} from '../components';
import { Card, CardContent, Button } from '@/shared/components/ui';

type AdminView = 'dashboard' | 'users' | 'content' | 'reports';

const AdminPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const navigationItems = [
    {
      id: 'dashboard' as AdminView,
      label: '📊 Tableau de Bord',
      description: 'Vue d\'ensemble et métriques'
    },
    {
      id: 'users' as AdminView,
      label: '👥 Utilisateurs',
      description: 'Gestion des comptes utilisateurs'
    },
    {
      id: 'content' as AdminView,
      label: '📝 Contenu',
      description: 'Modération du contenu'
    },
    {
      id: 'reports' as AdminView,
      label: '🚩 Signalements',
      description: 'Gestion des rapports'
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentModeration />;
      case 'reports':
        return <ReportsManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Administration Mayegue
              </h1>
              <p className="text-gray-600 mt-1">
                Interface d'administration pour la plateforme d'apprentissage
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Connecté en tant qu'administrateur
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? undefined : 'outline'}
                      className={`w-full text-left justify-start ${
                        currentView === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentView(item.id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs opacity-75">{item.description}</span>
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Statistiques Rapides
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilisateurs actifs:</span>
                    <span className="font-medium text-green-600">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contenu en attente:</span>
                    <span className="font-medium text-yellow-600">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Signalements:</span>
                    <span className="font-medium text-red-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus du mois:</span>
                    <span className="font-medium text-blue-600">€2,850</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;