import React from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  ClockIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Button, Badge } from '@/shared/components/ui';
import type { TeacherContent } from '../services/enhanced-teacher.service';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: TeacherContent | null;
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  content
}) => {
  if (!isOpen || !content) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="w-6 h-6" />;
      case 'translation':
        return <LanguageIcon className="w-6 h-6" />;
      default:
        return <DocumentTextIcon className="w-6 h-6" />;
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

  const renderLessonContent = () => {
    const lesson = content.content;
    const exercises = lesson.exercises ? JSON.parse(lesson.exercises) : [];

    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Informations générales
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulté:</span>
                <Badge variant="secondary">{lesson.difficulty}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Durée estimée:</span>
                <span>{lesson.estimatedDuration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Catégorie:</span>
                <span>{lesson.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Langue:</span>
                <span>{lesson.language}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Statistiques
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Complétions:</span>
                <span>{lesson.completionCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Note moyenne:</span>
                <span>{lesson.averageRating || 0}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Contenu de la leçon
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="prose dark:prose-invert max-w-none">
              {lesson.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Media */}
        {(lesson.audioUrl || lesson.videoUrl || lesson.imageUrl) && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Médias
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lesson.audioUrl && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <PlayIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm">Audio disponible</p>
                </div>
              )}
              {lesson.videoUrl && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <PlayIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Vidéo disponible</p>
                </div>
              )}
              {lesson.imageUrl && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm">Image disponible</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Exercices ({exercises.length})
            </h4>
            <div className="space-y-3">
              {exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium">Exercice {index + 1}</h5>
                    <Badge variant="secondary" size="sm">{exercise.type}</Badge>
                  </div>
                  <p className="text-sm mb-2">{exercise.question}</p>
                  {exercise.options && (
                    <div className="space-y-1">
                      {exercise.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className={`text-xs p-2 rounded ${
                            optIndex === exercise.correctAnswer
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                              : 'bg-white dark:bg-gray-600'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  {exercise.explanation && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <strong>Explication:</strong> {exercise.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuizContent = () => {
    const quiz = content.content;
    const questions = quiz.questions ? JSON.parse(quiz.questions) : [];

    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Informations générales
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulté:</span>
                <Badge variant="secondary">{quiz.difficulty}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Temps limite:</span>
                <span>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'Aucune'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Score minimum:</span>
                <span>{quiz.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Questions:</span>
                <span>{questions.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Statistiques
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tentatives:</span>
                <span>{quiz.completionCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Score moyen:</span>
                <span>{quiz.averageScore || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Questions
          </h4>
          <div className="space-y-4">
            {questions.map((question: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium">Question {index + 1}</h5>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" size="sm">{question.type}</Badge>
                    <Badge variant="secondary" size="sm">{question.points} pts</Badge>
                  </div>
                </div>
                <p className="text-sm mb-3">{question.question}</p>
                
                {question.options && (
                  <div className="space-y-1 mb-3">
                    {question.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`text-xs p-2 rounded ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                            : 'bg-white dark:bg-gray-600'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Explication:</strong> {question.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTranslationContent = () => {
    const translation = content.content;
    const examples = translation.examples ? JSON.parse(translation.examples) : [];

    return (
      <div className="space-y-6">
        {/* Translation */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {translation.sourceLanguage}
              </h4>
              <p className="text-lg">{translation.sourceText}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {translation.targetLanguage}
              </h4>
              <p className="text-lg">{translation.targetText}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Informations
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Catégorie:</span>
                <span>{translation.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulté:</span>
                <Badge variant="secondary">{translation.difficulty}</Badge>
              </div>
              {translation.pronunciation && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Prononciation:</span>
                  <span className="font-mono">{translation.pronunciation}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Statistiques
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Utilisations:</span>
                <span>{translation.usageCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Note:</span>
                <span>{translation.rating || 0}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Context */}
        {translation.context && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Contexte
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              {translation.context}
            </p>
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Exemples d'utilisation
            </h4>
            <div className="space-y-3">
              {examples.map((example: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">{example.source}</p>
                    </div>
                    <div>
                      <p className="text-sm">{example.target}</p>
                    </div>
                  </div>
                  {example.context && (
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Contexte:</strong> {example.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (content.type) {
      case 'lesson':
        return renderLessonContent();
      case 'quiz':
        return renderQuizContent();
      case 'translation':
        return renderTranslationContent();
      default:
        return <div>Type de contenu non supporté</div>;
    }
  };

  return (
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              {getTypeIcon(content.type)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {content.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTypeLabel(content.type)} • {content.status}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {content.metadata?.difficulty && (
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Difficulté: {content.metadata.difficulty}</span>
                </div>
              )}
              {content.metadata?.category && (
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Catégorie: {content.metadata.category}</span>
                </div>
              )}
              {content.metadata?.targetAudience && (
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Public: {content.metadata.targetAudience.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Tags */}
                {content.metadata?.tags && content.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {content.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

            {/* Main Content */}
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
