import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Textarea, Badge } from '@/shared/components/ui';
import { enhancedTeacherService, type TeacherContent, type LessonData, type QuizData, type TranslationData } from '../services/enhanced-teacher.service';
import toast from 'react-hot-toast';

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingContent?: TeacherContent | null;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'audio_recognition';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  points: number;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

interface Exercise {
  type: 'multiple_choice' | 'fill_blank' | 'audio_recognition' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export const ContentCreationModal: React.FC<ContentCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingContent
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState<'lesson' | 'quiz' | 'translation'>('lesson');
  const [loading, setLoading] = useState(false);

  // Common fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Lesson specific fields
  const [content, setContent] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(15);
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Quiz specific fields
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Translation specific fields
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [context, setContext] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [examples, setExamples] = useState<{ source: string; target: string; context?: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingContent) {
        loadEditingContent(editingContent);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingContent]);

  const loadEditingContent = (content: TeacherContent) => {
    setContentType(content.type);
    setTitle(content.title);
    setDescription(content.description || '');
    setDifficulty(content.metadata?.difficulty || 'beginner');
    setCategory(content.metadata?.category || '');
    setLanguage(content.metadata?.language || '');
    setTags(content.metadata?.tags || []);
    setTargetAudience(content.metadata?.targetAudience || []);

    if (content.type === 'lesson') {
      const lesson = content.content;
      setContent(lesson.content);
      setEstimatedDuration(lesson.estimatedDuration);
      setAudioUrl(lesson.audioUrl || '');
      setVideoUrl(lesson.videoUrl || '');
      setImageUrl(lesson.imageUrl || '');
      setExercises(lesson.exercises ? JSON.parse(lesson.exercises) : []);
    } else if (content.type === 'quiz') {
      const quiz = content.content;
      setTimeLimit(quiz.timeLimit);
      setPassingScore(quiz.passingScore);
      setQuestions(quiz.questions ? JSON.parse(quiz.questions) : []);
    } else if (content.type === 'translation') {
      const translation = content.content;
      setSourceText(translation.sourceText);
      setTargetText(translation.targetText);
      setSourceLanguage(translation.sourceLanguage);
      setTargetLanguage(translation.targetLanguage);
      setContext(translation.context || '');
      setPronunciation(translation.pronunciation || '');
      setExamples(translation.examples ? JSON.parse(translation.examples) : []);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setContentType('lesson');
    setTitle('');
    setDescription('');
    setDifficulty('beginner');
    setCategory('');
    setLanguage('');
    setTags([]);
    setTargetAudience([]);
    setNewTag('');
    setContent('');
    setEstimatedDuration(15);
    setAudioUrl('');
    setVideoUrl('');
    setImageUrl('');
    setExercises([]);
    setTimeLimit(undefined);
    setPassingScore(70);
    setQuestions([]);
    setSourceText('');
    setTargetText('');
    setSourceLanguage('');
    setTargetLanguage('');
    setContext('');
    setPronunciation('');
    setExamples([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (contentType === 'lesson') {
        const lessonData: LessonData = {
          title,
          description,
          content,
          audioUrl: audioUrl || undefined,
          videoUrl: videoUrl || undefined,
          imageUrl: imageUrl || undefined,
          difficulty,
          estimatedDuration,
          tags,
          category,
          language,
          targetAudience,
          exercises
        };

        if (editingContent) {
          await enhancedTeacherService.updateLesson(editingContent.id, lessonData);
        } else {
          await enhancedTeacherService.createLesson(lessonData);
        }
      } else if (contentType === 'quiz') {
        const quizData: QuizData = {
          title,
          description,
          difficulty,
          timeLimit,
          passingScore,
          category,
          language,
          questions,
          tags,
          targetAudience
        };

        if (editingContent) {
          await enhancedTeacherService.updateQuiz(editingContent.id, quizData);
        } else {
          await enhancedTeacherService.createQuiz(quizData);
        }
      } else if (contentType === 'translation') {
        const translationData: TranslationData = {
          sourceText,
          targetText,
          sourceLanguage,
          targetLanguage,
          category,
          difficulty,
          context: context || undefined,
          pronunciation: pronunciation || undefined,
          audioUrl: audioUrl || undefined,
          examples,
          tags
        };

        if (editingContent) {
          // Translation update would need to be implemented
          toast.error('Modification des traductions non encore implémentée');
          return;
        } else {
          await enhancedTeacherService.createTranslation(translationData);
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addExample = () => {
    setExamples([...examples, { source: '', target: '', context: '' }]);
  };

  const updateExample = (index: number, field: 'source' | 'target' | 'context', value: string) => {
    const updated = [...examples];
    updated[index] = { ...updated[index], [field]: value };
    setExamples(updated);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Type de contenu';
      case 2: return 'Informations générales';
      case 3: return 'Contenu spécifique';
      case 4: return 'Révision et publication';
      default: return '';
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return title.trim() && description.trim() && category && language;
      case 3: 
        if (contentType === 'lesson') return content.trim();
        if (contentType === 'quiz') return questions.length > 0;
        if (contentType === 'translation') return sourceText.trim() && targetText.trim();
        return false;
      default: return true;
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingContent ? 'Modifier le contenu' : 'Créer du contenu'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Étape {currentStep}/4: {getStepTitle()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Step 1: Content Type */}
            {currentStep === 1 && !editingContent && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quel type de contenu souhaitez-vous créer ?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setContentType('lesson')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      contentType === 'lesson'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <BookOpenIcon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Leçon</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Créez une leçon interactive avec du contenu éducatif
                    </p>
                  </button>

                  <button
                    onClick={() => setContentType('quiz')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      contentType === 'quiz'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <QuestionMarkCircleIcon className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Quiz</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Créez un quiz pour évaluer les connaissances
                    </p>
                  </button>

                  <button
                    onClick={() => setContentType('translation')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      contentType === 'translation'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <LanguageIcon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Traduction</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Ajoutez une nouvelle traduction au dictionnaire
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: General Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Informations générales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Titre *
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre du contenu"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description du contenu"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catégorie *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="vocabulaire">Vocabulaire</option>
                        <option value="grammaire">Grammaire</option>
                        <option value="conjugaison">Conjugaison</option>
                        <option value="culture">Culture</option>
                        <option value="histoire">Histoire</option>
                        <option value="conversation">Conversation</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Langue *
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner une langue</option>
                        <option value="bassa">Bassa</option>
                        <option value="ewondo">Ewondo</option>
                        <option value="duala">Duala</option>
                        <option value="fulfulde">Fulfulde</option>
                        <option value="bamoun">Bamoun</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulté
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Ajouter un tag"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button onClick={addTag} size="sm">
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{tag}</span>
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-gray-500 hover:text-red-500"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Specific Content */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contenu spécifique
                </h3>

                {contentType === 'lesson' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contenu de la leçon *
                      </label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Rédigez le contenu de votre leçon..."
                        rows={8}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Durée estimée (minutes)
                        </label>
                        <Input
                          type="number"
                          value={estimatedDuration}
                          onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
                          min="1"
                          max="180"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL Audio
                        </label>
                        <Input
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL Vidéo
                        </label>
                        <Input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL Image
                        </label>
                        <Input
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Exercises */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Exercices (optionnel)
                        </h4>
                        <Button onClick={addExercise} size="sm">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Ajouter un exercice
                        </Button>
                      </div>
                      
                      {exercises.map((exercise, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium">Exercice {index + 1}</h5>
                            <button
                              onClick={() => removeExercise(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Question
                              </label>
                              <Input
                                value={exercise.question}
                                onChange={(e) => updateExercise(index, 'question', e.target.value)}
                                placeholder="Question de l'exercice"
                              />
                            </div>
                            
                            {exercise.type === 'multiple_choice' && exercise.options && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Options de réponse
                                </label>
                                {exercise.options.map((option, optIndex) => (
                                  <Input
                                    key={optIndex}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...exercise.options!];
                                      newOptions[optIndex] = e.target.value;
                                      updateExercise(index, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="mb-2"
                                  />
                                ))}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Réponse correcte (index)
                                  </label>
                                  <Input
                                    type="number"
                                    value={exercise.correctAnswer}
                                    onChange={(e) => updateExercise(index, 'correctAnswer', parseInt(e.target.value))}
                                    min="0"
                                    max="3"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {contentType === 'quiz' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Temps limite (minutes, optionnel)
                        </label>
                        <Input
                          type="number"
                          value={timeLimit || ''}
                          onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="Aucune limite"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Score minimum (%)
                        </label>
                        <Input
                          type="number"
                          value={passingScore}
                          onChange={(e) => setPassingScore(parseInt(e.target.value))}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Questions
                        </h4>
                        <Button onClick={addQuestion} size="sm">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Ajouter une question
                        </Button>
                      </div>
                      
                      {questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium">Question {index + 1}</h5>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Question
                              </label>
                              <Input
                                value={question.question}
                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                placeholder="Votre question"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Type
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="multiple_choice">Choix multiple</option>
                                  <option value="true_false">Vrai/Faux</option>
                                  <option value="fill_blank">Texte à trou</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Points
                                </label>
                                <Input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                                  min="1"
                                />
                              </div>
                            </div>
                            
                            {question.type === 'multiple_choice' && question.options && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Options de réponse
                                </label>
                                {question.options.map((option, optIndex) => (
                                  <Input
                                    key={optIndex}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options!];
                                      newOptions[optIndex] = e.target.value;
                                      updateQuestion(index, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="mb-2"
                                  />
                                ))}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Réponse correcte (index)
                                  </label>
                                  <Input
                                    type="number"
                                    value={typeof question.correctAnswer === 'number' ? question.correctAnswer : 0}
                                    onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                                    min="0"
                                    max="3"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {contentType === 'translation' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Langue source *
                        </label>
                        <select
                          value={sourceLanguage}
                          onChange={(e) => setSourceLanguage(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="français">Français</option>
                          <option value="bassa">Bassa</option>
                          <option value="ewondo">Ewondo</option>
                          <option value="duala">Duala</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Langue cible *
                        </label>
                        <select
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="français">Français</option>
                          <option value="bassa">Bassa</option>
                          <option value="ewondo">Ewondo</option>
                          <option value="duala">Duala</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Texte source *
                        </label>
                        <Input
                          value={sourceText}
                          onChange={(e) => setSourceText(e.target.value)}
                          placeholder="Mot ou phrase à traduire"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Traduction *
                        </label>
                        <Input
                          value={targetText}
                          onChange={(e) => setTargetText(e.target.value)}
                          placeholder="Traduction"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contexte
                        </label>
                        <Textarea
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          placeholder="Contexte d'utilisation"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prononciation
                        </label>
                        <Input
                          value={pronunciation}
                          onChange={(e) => setPronunciation(e.target.value)}
                          placeholder="Guide de prononciation"
                        />
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Exemples d'utilisation
                        </h4>
                        <Button onClick={addExample} size="sm">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Ajouter un exemple
                        </Button>
                      </div>
                      
                      {examples.map((example, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium">Exemple {index + 1}</h5>
                            <button
                              onClick={() => removeExample(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              value={example.source}
                              onChange={(e) => updateExample(index, 'source', e.target.value)}
                              placeholder="Exemple en langue source"
                            />
                            <Input
                              value={example.target}
                              onChange={(e) => updateExample(index, 'target', e.target.value)}
                              placeholder="Exemple traduit"
                            />
                          </div>
                          <Input
                            value={example.context || ''}
                            onChange={(e) => updateExample(index, 'context', e.target.value)}
                            placeholder="Contexte de cet exemple"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Révision et publication
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Résumé du contenu
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium">{contentType === 'lesson' ? 'Leçon' : contentType === 'quiz' ? 'Quiz' : 'Traduction'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Titre:</span>
                      <span className="font-medium">{title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Catégorie:</span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Langue:</span>
                      <span className="font-medium">{language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Difficulté:</span>
                      <span className="font-medium">{difficulty}</span>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" size="sm">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CloudArrowUpIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Processus de validation
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Votre contenu sera soumis pour validation par l'équipe pédagogique. 
                        Vous recevrez une notification une fois la révision terminée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={loading}
              >
                Précédent
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep() || loading}
              >
                Suivant
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : editingContent ? 'Mettre à jour' : 'Créer le contenu'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};