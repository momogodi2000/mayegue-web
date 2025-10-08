import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Select, Badge } from '@/shared/components/ui';
import { enhancedTeacherService, type TeacherContent } from '../services/enhanced-teacher.service';
import { ContentCreationModal } from './ContentCreationModal';
import { ContentPreviewModal } from './ContentPreviewModal';
import toast from 'react-hot-toast';

interface ContentManagementPanelProps {
  className?: string;
}

export const ContentManagementPanel: React.FC<ContentManagementPanelProps> = ({
  className = ''
}) => {
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<TeacherContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<TeacherContent | null>(null);
  const [editingContent, setEditingContent] = useState<TeacherContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, statusFilter, typeFilter]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const teacherContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
      setContent(teacherContent);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    setFilteredContent(filtered);
  };

  const handleDelete = async (contentId: string, type: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      return;
    }

    try {
      if (type === 'lesson') {
        await enhancedTeacherService.deleteLesson(contentId);
      } else if (type === 'quiz') {
        await enhancedTeacherService.deleteQuiz(contentId);
      }
      
      await loadContent();
      toast.success('Contenu supprimé avec succès');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (content: TeacherContent) => {
    setEditingContent(content);
    setShowCreateModal(true);
  };

  const handlePreview = (content: TeacherContent) => {
    setSelectedContent(content);
    setShowPreviewModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      case 'pending_review':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'success',
      rejected: 'danger',
      pending_review: 'warning',
      draft: 'secondary'
    } as const;

    const labels = {
      approved: 'Approuvé',
      rejected: 'Rejeté',
      pending_review: 'En attente',
      draft: 'Brouillon'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚';
      case 'quiz':
        return '❓';
      case 'translation':
        return '🔤';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      lesson: 'Leçon',
      quiz: 'Quiz',
      translation: 'Traduction'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion du contenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Créez et gérez vos leçons, quiz et traductions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingContent(null);
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Nouveau contenu</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="pending_review">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="lesson">Leçons</option>
            <option value="quiz">Quiz</option>
            <option value="translation">Traductions</option>
          </select>

          {/* Filter Button */}
          <Button variant="outline" className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>Filtres avancés</span>
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredContent.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTypeLabel(item.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {item.metadata?.difficulty && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Difficulté:</span>
                      <Badge variant="secondary" size="sm">
                        {item.metadata.difficulty}
                      </Badge>
                    </div>
                  )}
                  {item.metadata?.category && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Catégorie:</span>
                      <span className="text-gray-900 dark:text-white">
                        {item.metadata.category}
                      </span>
                    </div>
                  )}
                  {item.metadata?.estimatedDuration && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Durée:</span>
                      <span className="text-gray-900 dark:text-white">
                        {item.metadata.estimatedDuration} min
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {item.metadata?.tags && item.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.metadata.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {item.metadata.tags.length > 3 && (
                      <Badge variant="secondary" size="sm">
                        +{item.metadata.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-500 mb-4">
                  <div>Créé: {item.createdAt.toLocaleDateString('fr-FR')}</div>
                  <div>Modifié: {item.updatedAt.toLocaleDateString('fr-FR')}</div>
                </div>

                {/* Review Notes */}
                {item.status === 'rejected' && item.reviewNotes && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mb-4">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      <strong>Commentaire:</strong> {item.reviewNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreview(item)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Aperçu"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.type)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {item.status === 'approved' && (
                    <Badge variant="success" size="sm">
                      ✓ Publié
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun contenu trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Aucun contenu ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre premier contenu.'}
          </p>
          <Button
            onClick={() => {
              setEditingContent(null);
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Créer du contenu</span>
          </Button>
        </div>
      )}

      {/* Modals */}
      <ContentCreationModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingContent(null);
        }}
        onSave={() => {
          setShowCreateModal(false);
          setEditingContent(null);
          loadContent();
        }}
        editingContent={editingContent}
      />

      <ContentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedContent(null);
        }}
        content={selectedContent}
      />
    </div>
  );
};
