import React, { useState, useEffect } from 'react';
import { useAdminStore, ContentItem } from '../store/adminStore';
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

const ContentModerationFixed: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { 
    content, 
    loading, 
    error, 
    fetchContent, 
    approveContent, 
    rejectContent,
    clearError 
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: 'pending',
    language: '',
    sortBy: 'createdAt'
  });

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject'>('approve');
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const filteredContent = content.filter((item: ContentItem) => {
    const matchesSearch = !filters.search || 
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.content.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.authorName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesLanguage = !filters.language || item.language === filters.language;

    return matchesSearch && matchesType && matchesStatus && matchesLanguage;
  }).sort((a: ContentItem, b: ContentItem) => {
    if (filters.sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'reports') {
      return b.reports.length - a.reports.length;
    }
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleModerationAction = async () => {
    if (!selectedItem) return;

    try {
      if (moderationAction === 'approve') {
        await approveContent(selectedItem.id);
        showSuccess('Contenu approuvé avec succès');
      } else {
        await rejectContent(selectedItem.id, moderationReason);
        showSuccess('Contenu rejeté avec succès');
      }
      
      setIsModerationModalOpen(false);
      setSelectedItem(null);
      setModerationReason('');
    } catch (err: unknown) {
      showError('Erreur lors de la modération');
      console.error('Erreur de modération:', err);
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

  const getTypeLabel = (type: string): string => {
    const labels = {
      discussion: 'Discussion',
      reply: 'Réponse',
      challenge: 'Défi',
      resource: 'Ressource'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      flagged: 'Signalé',
      removed: 'Supprimé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeColor = (type: string): string => {
    const colors = {
      discussion: 'bg-blue-100 text-blue-800',
      reply: 'bg-green-100 text-green-800',
      challenge: 'bg-purple-100 text-purple-800',
      resource: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      flagged: 'bg-red-100 text-red-800',
      removed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading && content.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement du contenu...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Modération du Contenu</h1>
          <p className="text-gray-600 mt-2">
            Examinez et modérez le contenu signalé par les utilisateurs
          </p>
        </div>
        
        <Button onClick={fetchContent} disabled={loading}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Rechercher dans le contenu..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              <option value="discussion">Discussion</option>
              <option value="reply">Réponse</option>
              <option value="challenge">Défi</option>
              <option value="resource">Ressource</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="flagged">Signalé</option>
              <option value="removed">Supprimé</option>
            </select>
            
            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les langues</option>
              <option value="beti">Beti</option>
              <option value="bulu">Bulu</option>
              <option value="duala">Duala</option>
              <option value="ewondo">Ewondo</option>
              <option value="fulfulde">Fulfulde</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date de création</option>
              <option value="reports">Nombre de signalements</option>
              <option value="title">Titre</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {content.filter((item: ContentItem) => item.status === 'pending').length}
            </div>
            <p className="text-gray-600">En attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {content.filter((item: ContentItem) => item.status === 'flagged').length}
            </div>
            <p className="text-gray-600">Signalés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {content.filter((item: ContentItem) => item.status === 'approved').length}
            </div>
            <p className="text-gray-600">Approuvés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {content.reduce((sum: number, item: ContentItem) => sum + item.reports.length, 0)}
            </div>
            <p className="text-gray-600">Total signalements</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {filteredContent.map((item: ContentItem) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {item.language}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {item.reports.length} signalement{item.reports.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>👤 {item.authorName}</span>
                    <span>📅 {formatRelativeTime(item.createdAt)}</span>
                    <span>🏷️ {item.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    👁️ Détails
                  </Button>
                  
                  {item.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedItem(item);
                          setModerationAction('approve');
                          setIsModerationModalOpen(true);
                        }}
                      >
                        ✅ Approuver
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setSelectedItem(item);
                          setModerationAction('reject');
                          setIsModerationModalOpen(true);
                        }}
                      >
                        ❌ Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredContent.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun contenu trouvé
              </h3>
              <p className="text-gray-600">
                Aucun contenu ne correspond aux critères de recherche sélectionnés.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(null);
        }}
        title="Détails du contenu"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className={getTypeColor(selectedItem.type)}>
                {getTypeLabel(selectedItem.type)}
              </Badge>
              <Badge className={getStatusColor(selectedItem.status)}>
                {getStatusLabel(selectedItem.status)}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {selectedItem.language}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedItem.title}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedItem.content}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Auteur:</span>
                <span className="ml-2 font-medium">{selectedItem.authorName}</span>
              </div>
              <div>
                <span className="text-gray-600">Créé le:</span>
                <span className="ml-2 font-medium">{formatRelativeTime(selectedItem.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Signalements:</span>
                <span className="ml-2 font-medium">{selectedItem.reports.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Catégorie:</span>
                <span className="ml-2 font-medium">{selectedItem.category}</span>
              </div>
            </div>
            
            {selectedItem.reports.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Signalements:</h4>
                <div className="space-y-2">
                  {selectedItem.reports.map((report) => (
                    <div key={report.id} className="bg-red-50 p-3 rounded text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">🚩 {report.reason}</span>
                        <span className="text-gray-500">{formatRelativeTime(report.createdAt)}</span>
                      </div>
                      <p className="text-gray-600">{report.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Par: {report.reporterName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Moderation Action Modal */}
      <Modal
        open={isModerationModalOpen}
        onClose={() => {
          setIsModerationModalOpen(false);
          setSelectedItem(null);
          setModerationReason('');
        }}
        title={moderationAction === 'approve' ? 'Approuver le contenu' : 'Rejeter le contenu'}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {moderationAction === 'approve' ? '✅' : '❌'}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {moderationAction === 'approve' ? 'Approuver' : 'Rejeter'} ce contenu ?
              </h3>
              <p className="text-gray-600 mb-4">
                <strong>{selectedItem.title}</strong>
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600 line-clamp-3">
                {selectedItem.content}
              </p>
            </div>
            
            {moderationAction === 'reject' && (
              <textarea
                placeholder="Raison du rejet (obligatoire)..."
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModerationModalOpen(false);
                  setSelectedItem(null);
                  setModerationReason('');
                }}
              >
                Annuler
              </Button>
              <Button
                className={moderationAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                onClick={handleModerationAction}
                disabled={moderationAction === 'reject' && !moderationReason.trim()}
              >
                {moderationAction === 'approve' ? '✅ Approuver' : '❌ Rejeter'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentModerationFixed;