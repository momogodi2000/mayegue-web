import React, { useState, useEffect } from 'react';
import { useAdminStore, ContentReport } from '../store/adminStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Spinner,
  Input,
  Modal,
  useToastActions 
} from '@/shared/components/ui';

const ReportsManagement: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { 
    reports, 
    loading, 
    error, 
    fetchReports, 
    reviewReport,
    clearError 
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    status: 'pending',
    reason: '',
    sortBy: 'createdAt'
  });

  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter((report: ContentReport) => {
    const matchesSearch = !filters.search || 
      report.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || report.status === filters.status;
    const matchesReason = !filters.reason || report.reason === filters.reason;

    return matchesSearch && matchesStatus && matchesReason;
  }).sort((a: ContentReport, b: ContentReport) => {
    if (filters.sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'reason') {
      return a.reason.localeCompare(b.reason);
    }
    return 0;
  });

  const handleReviewAction = async () => {
    if (!selectedReport) return;

    try {
      await reviewReport(selectedReport.id, reviewAction, reviewNotes);
      showSuccess(`Signalement ${reviewAction === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
      
      setIsReviewModalOpen(false);
      setSelectedReport(null);
      setReviewNotes('');
    } catch (err: unknown) {
      showError('Erreur lors de la révision du signalement');
      console.error('Erreur de révision:', err);
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      pending: 'En attente',
      reviewed: 'Examiné',
      resolved: 'Résolu'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getReasonColor = (reason: string): string => {
    const colors = {
      spam: 'bg-red-100 text-red-800',
      harassment: 'bg-purple-100 text-purple-800',
      'inappropriate-content': 'bg-orange-100 text-orange-800',
      'copyright-violation': 'bg-pink-100 text-pink-800',
      'false-information': 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[reason as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getReasonLabel = (reason: string): string => {
    const labels = {
      spam: 'Spam',
      harassment: 'Harcèlement',
      'inappropriate-content': 'Contenu inapproprié',
      'copyright-violation': 'Violation de copyright',
      'false-information': 'Fausse information',
      other: 'Autre'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement des signalements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={clearError}>Réessayer</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Signalements</h1>
          <p className="text-gray-600 mt-2">
            Examinez et traitez les signalements des utilisateurs
          </p>
        </div>
        
        <Button onClick={fetchReports} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Actualisation...
            </>
          ) : (
            '🔄 Actualiser'
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher dans les signalements..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="reviewed">Examiné</option>
              <option value="resolved">Résolu</option>
            </select>
            
            <select
              value={filters.reason}
              onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les raisons</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harcèlement</option>
              <option value="inappropriate-content">Contenu inapproprié</option>
              <option value="copyright-violation">Violation de copyright</option>
              <option value="false-information">Fausse information</option>
              <option value="other">Autre</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date de signalement</option>
              <option value="reason">Raison</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {reports.filter((report: ContentReport) => report.status === 'pending').length}
            </div>
            <p className="text-gray-600">En attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {reports.filter((report: ContentReport) => report.status === 'reviewed').length}
            </div>
            <p className="text-gray-600">Examinés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {reports.filter((report: ContentReport) => report.status === 'resolved').length}
            </div>
            <p className="text-gray-600">Résolus</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Signalements ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Signalement</th>
                  <th className="text-left py-3 px-4">Raison</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report: ContentReport) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          ID: {report.id.slice(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {report.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          Par: {report.reporterName}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <Badge className={getReasonColor(report.reason)}>
                        {getReasonLabel(report.reason)}
                      </Badge>
                    </td>
                    
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {formatRelativeTime(report.createdAt)}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          👁️ Détails
                        </Button>
                        
                        {report.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsReviewModalOpen(true);
                            }}
                          >
                            ⚖️ Examiner
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun signalement trouvé avec ces critères
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
        title="Détails du signalement"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className={getReasonColor(selectedReport.reason)}>
                {getReasonLabel(selectedReport.reason)}
              </Badge>
              <Badge className={getStatusColor(selectedReport.status)}>
                {getStatusLabel(selectedReport.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID du signalement:</span>
                <span className="ml-2 font-medium">{selectedReport.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Signalé par:</span>
                <span className="ml-2 font-medium">{selectedReport.reporterName}</span>
              </div>
              <div>
                <span className="text-gray-600">Date de signalement:</span>
                <span className="ml-2 font-medium">{formatRelativeTime(selectedReport.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">ID du signaleur:</span>
                <span className="ml-2 font-medium">{selectedReport.reporterId}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Description du problème:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        open={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReport(null);
          setReviewNotes('');
        }}
        title="Examiner le signalement"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold mb-2">
                Examiner ce signalement
              </h3>
              <Badge className={getReasonColor(selectedReport.reason)}>
                {getReasonLabel(selectedReport.reason)}
              </Badge>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium mb-2">Description:</p>
              <p className="text-sm text-gray-600">
                {selectedReport.description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action à prendre:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="approve"
                    checked={reviewAction === 'approve'}
                    onChange={(e) => setReviewAction(e.target.value as 'approve' | 'reject')}
                    className="mr-2"
                  />
                  <span>✅ Approuver le signalement (action nécessaire)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="reject"
                    checked={reviewAction === 'reject'}
                    onChange={(e) => setReviewAction(e.target.value as 'approve' | 'reject')}
                    className="mr-2"
                  />
                  <span>❌ Rejeter le signalement (non fondé)</span>
                </label>
              </div>
            </div>
            
            <textarea
              placeholder="Notes de révision (optionnel)..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedReport(null);
                  setReviewNotes('');
                }}
              >
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleReviewAction}
              >
                ⚖️ Confirmer l'examen
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsManagement;