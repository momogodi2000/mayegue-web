import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Badge, Textarea } from '@/shared/components/ui';
import { enhancedAdminService, type ContentModerationItem } from '../services/enhanced-admin.service';
import toast from 'react-hot-toast';

interface ContentModerationPanelProps {
  className?: string;
}

export const ContentModerationPanel: React.FC<ContentModerationPanelProps> = ({
  className = ''
}) => {
  const [content, setContent] = useState<ContentModerationItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<ContentModerationItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, typeFilter, priorityFilter]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const moderationContent = await enhancedAdminService.getContentForModeration();
      setContent(moderationContent);
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
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdByName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    setFilteredContent(filtered);
  };

  const handlePreview = (item: ContentModerationItem) => {
    setSelectedContent(item);
    setShowPreviewModal(true);
  };

  const handleReview = (item: ContentModerationItem, action: 'approve' | 'reject') => {
    setSelectedContent(item);
    setReviewAction(action);
    setReviewNotes('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedContent) return;

    try {
      if (reviewAction === 'approve') {
        await enhancedAdminService.approveContent(selectedContent.id, reviewNotes);
      } else {
        if (!reviewNotes.trim()) {
          toast.error('Veuillez fournir une raison pour le rejet');
          return;
        }
        await enhancedAdminService.rejectContent(selectedContent.id, reviewNotes);
      }

      await loadContent();
      setShowReviewModal(false);
      setSelectedContent(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <DocumentTextIcon className="w-5 h-5 text-blue-600" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="w-5 h-5 text-green-600" />;
      case 'translation':
        return <LanguageIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-600" />;
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

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: 'danger',
      high: 'warning',
      normal: 'info',
      low: 'secondary'
    } as const;

    const labels = {
      urgent: 'Urgent',
      high: 'Élevée',
      normal: 'Normale',
      low: 'Faible'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'secondary'}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `il y a ${Math.floor(diffInMinutes / 1440)} j`;
    }
  };

  const renderContentPreview = (item: ContentModerationItem) => {
    switch (item.type) {
      case 'lesson':
        const lesson = item.content;
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Contenu de la leçon
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm">{lesson.content}</p>
              </div>
            </div>
            {lesson.exercises && JSON.parse(lesson.exercises).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Exercices ({JSON.parse(lesson.exercises).length})
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {JSON.parse(lesson.exercises).length} exercice(s) inclus
                </div>
              </div>
            )}
          </div>
        );
      
      case 'quiz':
        const quiz = item.content;
        const questions = JSON.parse(quiz.questions || '[]');
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Questions:</span>
                <span className="ml-2 font-medium">{questions.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Score minimum:</span>
                <span className="ml-2 font-medium">{quiz.passingScore}%</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Aperçu des questions
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {questions.slice(0, 3).map((q: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-sm font-medium">Q{index + 1}: {q.question}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Type: {q.type} • Points: {q.points}
                    </p>
                  </div>
                ))}
                {questions.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ... et {questions.length - 3} autres questions
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'translation':
        const translation = item.content;
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {translation.language}
                  </h4>
                  <p className="text-lg">{translation.word}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Français
                  </h4>
                  <p className="text-lg">{translation.translation}</p>
                </div>
              </div>
            </div>
            {translation.pronunciation && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Prononciation:</span>
                <span className="ml-2 font-mono">{translation.pronunciation}</span>
              </div>
            )}
            {translation.examples && translation.examples.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Exemples ({translation.examples.length})
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {translation.examples.length} exemple(s) d'utilisation
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Aperçu non disponible</div>;
    }
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
            Modération du contenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Révisez et approuvez le contenu créé par les enseignants
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="warning">
            {content.length} en attente
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher du contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

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

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevée</option>
            <option value="normal">Normale</option>
            <option value="low">Faible</option>
          </select>

          {/* Advanced Filters */}
          <Button variant="outline" className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>Filtres avancés</span>
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTypeLabel(item.type)}
                      </p>
                    </div>
                  </div>
                  {getPriorityBadge(item.priority)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Par {item.createdByName}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(item.createdAt)}
                  </span>
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
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Catégorie:</span>
                    <span className="text-gray-900 dark:text-white">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Langue:</span>
                    <span className="text-gray-900 dark:text-white">{item.language}</span>
                  </div>
                  {item.metadata?.difficulty && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Difficulté:</span>
                      <Badge variant="secondary" size="sm">
                        {item.metadata.difficulty}
                      </Badge>
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

                {/* Reports */}
                {item.reportCount > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-700 dark:text-red-300">
                        {item.reportCount} signalement(s)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePreview(item)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Aperçu</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReview(item, 'reject')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Rejeter</span>
                    </button>
                    <button
                      onClick={() => handleReview(item, 'approve')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <CheckIcon className="w-4 h-4" />
                      <span>Approuver</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun contenu en attente
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || typeFilter !== 'all' || priorityFilter !== 'all'
              ? 'Aucun contenu ne correspond à vos critères de recherche.'
              : 'Tout le contenu a été révisé.'}
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedContent.type)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedContent.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getTypeLabel(selectedContent.type)} • Par {selectedContent.createdByName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-6">
                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Catégorie:</span>
                      <p className="font-medium">{selectedContent.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Langue:</span>
                      <p className="font-medium">{selectedContent.language}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Priorité:</span>
                      <div className="mt-1">{getPriorityBadge(selectedContent.priority)}</div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedContent.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedContent.description}
                      </p>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Aperçu du contenu
                    </h3>
                    {renderContentPreview(selectedContent)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleReview(selectedContent, 'reject');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Rejeter
                </Button>
                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleReview(selectedContent, 'approve');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approuver
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {reviewAction === 'approve' ? 'Approuver le contenu' : 'Rejeter le contenu'}
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Contenu: <strong>{selectedContent.title}</strong>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Créé par: <strong>{selectedContent.createdByName}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {reviewAction === 'approve' ? 'Commentaires (optionnel)' : 'Raison du rejet *'}
                  </label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder={
                      reviewAction === 'approve'
                        ? 'Ajoutez des commentaires pour l\'auteur...'
                        : 'Expliquez pourquoi ce contenu est rejeté...'
                    }
                    rows={4}
                    required={reviewAction === 'reject'}
                  />
                </div>

                {reviewAction === 'reject' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          Attention
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          L'auteur sera notifié du rejet avec vos commentaires.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className={
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                  disabled={reviewAction === 'reject' && !reviewNotes.trim()}
                >
                  {reviewAction === 'approve' ? 'Approuver' : 'Rejeter'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
