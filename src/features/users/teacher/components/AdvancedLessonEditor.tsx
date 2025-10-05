import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Progress,
  useToastActions
} from '@/shared/components/ui';
import { 
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: string;
  language: string;
  category: string;
  duration: number;
  tags: string[];
  culturalNotes: string;
  objectives: string[];
  exercises: Exercise[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
  averageRating: number;
  completionRate: number;
}

interface Exercise {
  id: string;
  type: 'multiple_choice' | 'translation' | 'pronunciation' | 'cultural' | 'fill_blank' | 'audio_recording';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  audioUrl?: string;
  imageUrl?: string;
  hints: string[];
}

interface AdvancedLessonEditorProps {
  lessonId?: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export default function AdvancedLessonEditor({ 
  lessonId, 
  onSave, 
  onCancel 
}: AdvancedLessonEditorProps) {
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [lesson, setLesson] = useState<Lesson>({
    id: lessonId || Date.now().toString(),
    title: '',
    description: '',
    content: '',
    level: 'beginner',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 30,
    tags: [],
    culturalNotes: '',
    objectives: [],
    exercises: [],
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    studentCount: 0,
    averageRating: 0,
    completionRate: 0
  });

  const [currentTab, setCurrentTab] = useState<'basic' | 'content' | 'exercises' | 'analytics'>('basic');
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const levels = ['beginner', 'intermediate', 'advanced'];
  const languages = ['dualaba', 'ewondo', 'bassa', 'bamoun', 'fulfulde', 'yemba', 'anglais', 'français'];
  const categories = ['vocabulaire', 'grammaire', 'conversation', 'culture', 'prononciation', 'compréhension', 'expression'];

  useEffect(() => {
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock lesson data
      const mockLesson: Lesson = {
        id: lessonId!,
        title: 'Salutations en Dualaba',
        description: 'Apprenez les salutations de base en langue dualaba',
        content: 'Les salutations sont essentielles dans la culture camerounaise...',
        level: 'beginner',
        language: 'dualaba',
        category: 'conversation',
        duration: 45,
        tags: ['salutations', 'dualaba', 'culture'],
        culturalNotes: 'Les salutations montrent le respect dans la culture camerounaise...',
        objectives: ['Comprendre les salutations de base', 'Utiliser les salutations appropriées'],
        exercises: [
          {
            id: '1',
            type: 'multiple_choice',
            question: 'Comment dit-on "Bonjour" en dualaba?',
            options: ['Mbote', 'Sango', 'Mbolo', 'Awo'],
            correctAnswer: 'Mbote',
            explanation: 'Mbote est la salutation standard en dualaba',
            points: 10,
            hints: ['Pense aux salutations courantes', 'C\'est une salutation universelle']
          }
        ],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        studentCount: 156,
        averageRating: 4.7,
        completionRate: 85
      };
      
      setLesson(mockLesson);
    } catch (error) {
      showError('Erreur lors du chargement de la leçon');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Lesson, value: any) => {
    setLesson(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !lesson.tags.includes(newTag.trim())) {
      setLesson(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setLesson(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim() && !lesson.objectives.includes(newObjective.trim())) {
      setLesson(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (objectiveToRemove: string) => {
    setLesson(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objectiveToRemove)
    }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10,
      hints: []
    };
    setLesson(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setLesson(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setLesson(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const duplicateExercise = (exerciseId: string) => {
    const exercise = lesson.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      const duplicatedExercise: Exercise = {
        ...exercise,
        id: Date.now().toString(),
        question: `${exercise.question} (Copie)`
      };
      setLesson(prev => ({
        ...prev,
        exercises: [...prev.exercises, duplicatedExercise]
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate lesson
      if (!lesson.title.trim() || !lesson.content.trim()) {
        showError('Le titre et le contenu sont requis');
        return;
      }

      if (lesson.exercises.length === 0) {
        showError('Veuillez ajouter au moins un exercice');
        return;
      }

      await onSave(lesson);
      showSuccess('Leçon sauvegardée avec succès');
    } catch (error) {
      showError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base', icon: BookOpenIcon },
    { id: 'content', label: 'Contenu', icon: DocumentDuplicateIcon },
    { id: 'exercises', label: 'Exercices', icon: AcademicCapIcon },
    { id: 'analytics', label: 'Analytiques', icon: ChartBarIcon }
  ];

  if (loading && lessonId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {lessonId ? 'Modifier la leçon' : 'Créer une nouvelle leçon'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Éditeur avancé pour les leçons
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {currentTab === 'basic' && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Titre de la leçon *
                    </label>
                    <Input
                      value={lesson.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Salutations en dualaba"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durée (minutes)
                    </label>
                    <Input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      min="5"
                      max="180"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={lesson.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez brièvement le contenu de cette leçon..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Niveau
                    </label>
                    <SelectRoot value={lesson.level} onValueChange={(value: string) => handleInputChange('level', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langue
                    </label>
                    <SelectRoot value={lesson.language} onValueChange={(value: string) => handleInputChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language.charAt(0).toUpperCase() + language.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <SelectRoot value={lesson.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </div>
                </div>

                {/* Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objectifs d'apprentissage
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Ajouter un objectif..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    />
                    <Button type="button" onClick={addObjective} size="sm">
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {lesson.objectives.length > 0 && (
                    <div className="space-y-2">
                      {lesson.objectives.map((objective) => (
                        <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                          {objective}
                          <button
                            type="button"
                            onClick={() => removeObjective(objective)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lesson.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Contenu de la leçon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenu principal *
                  </label>
                  <Textarea
                    value={lesson.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Rédigez le contenu principal de votre leçon..."
                    rows={12}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes culturelles
                  </label>
                  <Textarea
                    value={lesson.culturalNotes}
                    onChange={(e) => handleInputChange('culturalNotes', e.target.value)}
                    placeholder="Ajoutez des informations culturelles importantes..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentTab === 'exercises' && (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Exercices ({lesson.exercises.length})</span>
                  <Button onClick={addExercise} size="sm">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Ajouter un exercice
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lesson.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">Exercice {index + 1}</h5>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateExercise(exercise.id)}
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingExercise(exercise)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeExercise(exercise.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Type
                          </label>
                          <SelectRoot
                            value={exercise.type}
                            onValueChange={(value: string) => updateExercise(exercise.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Choix multiple</SelectItem>
                              <SelectItem value="translation">Traduction</SelectItem>
                              <SelectItem value="pronunciation">Prononciation</SelectItem>
                              <SelectItem value="cultural">Culturel</SelectItem>
                              <SelectItem value="fill_blank">Texte à trous</SelectItem>
                              <SelectItem value="audio_recording">Enregistrement audio</SelectItem>
                            </SelectContent>
                          </SelectRoot>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Points
                          </label>
                          <Input
                            type="number"
                            value={exercise.points}
                            onChange={(e) => updateExercise(exercise.id, 'points', parseInt(e.target.value))}
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Question
                        </label>
                        <Input
                          value={exercise.question}
                          onChange={(e) => updateExercise(exercise.id, 'question', e.target.value)}
                          placeholder="Tapez votre question..."
                        />
                      </div>

                      {exercise.type === 'multiple_choice' && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Options
                          </label>
                          <div className="space-y-2">
                            {exercise.options?.map((option, optIndex) => (
                              <Input
                                key={optIndex}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(exercise.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateExercise(exercise.id, 'options', newOptions);
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Réponse correcte
                        </label>
                        <Input
                          value={exercise.correctAnswer}
                          onChange={(e) => updateExercise(exercise.id, 'correctAnswer', e.target.value)}
                          placeholder="Réponse correcte..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Explication
                        </label>
                        <Textarea
                          value={exercise.explanation}
                          onChange={(e) => updateExercise(exercise.id, 'explanation', e.target.value)}
                          placeholder="Explication de la réponse..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {lesson.exercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AcademicCapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun exercice ajouté</p>
                    <p className="text-sm">Cliquez sur "Ajouter un exercice" pour commencer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Étudiants
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lesson.studentCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                      <ChartBarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Note moyenne
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lesson.averageRating}/5
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <ClockIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Taux de réussite
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lesson.completionRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progression des étudiants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Taux de complétion
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {lesson.completionRate}%
                      </span>
                    </div>
                    <Progress value={lesson.completionRate} className="h-3" />
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Dernière mise à jour: {lesson.updatedAt.toLocaleDateString('fr-FR')}</p>
                    <p>Créée le: {lesson.createdAt.toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
