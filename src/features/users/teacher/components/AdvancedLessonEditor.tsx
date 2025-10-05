import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  useToastActions
} from '@/shared/components/ui';
import {
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface LessonContent {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'exercise';
  content: string;
  metadata?: Record<string, any>;
}

interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  content: LessonContent[];
  exercises: Exercise[];
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdvancedLessonEditorProps {
  lessonId?: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

const AdvancedLessonEditor: React.FC<AdvancedLessonEditorProps> = ({
  lessonId,
  onSave,
  onCancel
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const [lesson, setLesson] = useState<Lesson>({
    id: lessonId || '',
    title: '',
    description: '',
    language: 'ewo',
    level: 'beginner',
    duration: 30,
    content: [],
    exercises: [],
    tags: [],
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [activeTab, setActiveTab] = useState<'content' | 'exercises' | 'settings' | 'preview'>('content');
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId);
    }
  }, [lessonId]);

  const loadLesson = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock lesson data
      const mockLesson: Lesson = {
        id,
        title: 'Salutations en Ewondo',
        description: 'Apprenez les salutations de base en Ewondo',
        language: 'ewo',
        level: 'beginner',
        duration: 45,
        content: [
          {
            id: '1',
            type: 'text',
            content: 'Les salutations sont importantes dans la culture camerounaise...'
          },
          {
            id: '2',
            type: 'audio',
            content: '/audio/greetings-ewondo.mp3',
            metadata: { duration: 120 }
          }
        ],
        exercises: [
          {
            id: '1',
            type: 'multiple_choice',
            question: 'Comment dit-on "Bonjour" en Ewondo ?',
            options: ['Mbolo', 'Akiba', 'Malamu', 'Boni'],
            correctAnswer: 'Mbolo',
            explanation: 'Mbolo est la salutation standard en Ewondo',
            points: 10
          }
        ],
        tags: ['salutations', 'débutant', 'ewondo'],
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setLesson(mockLesson);
    } catch (error) {
      showError('Erreur lors du chargement de la leçon');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedLesson = {
        ...lesson,
        updatedAt: new Date()
      };
      
      setLesson(updatedLesson);
      onSave(updatedLesson);
      showSuccess('Leçon sauvegardée avec succès');
    } catch (error) {
      showError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const addContent = (type: LessonContent['type']) => {
    const newContent: LessonContent = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    };
    
    setLesson(prev => ({
      ...prev,
      content: [...prev.content, newContent]
    }));
  };

  const updateContent = (id: string, updates: Partial<LessonContent>) => {
    setLesson(prev => ({
      ...prev,
      content: prev.content.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const removeContent = (id: string) => {
    setLesson(prev => ({
      ...prev,
      content: prev.content.filter(item => item.id !== id)
    }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10
    };
    
    setLesson(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setLesson(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === id ? { ...exercise, ...updates } : exercise
      )
    }));
  };

  const removeExercise = (id: string) => {
    setLesson(prev => ({
      ...prev,
      exercises: prev.exercises.filter(exercise => exercise.id !== id)
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

  const removeTag = (tag: string) => {
    setLesson(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return <DocumentTextIcon className="w-5 h-5" />;
      case 'image': return <PhotoIcon className="w-5 h-5" />;
      case 'audio': return <SpeakerWaveIcon className="w-5 h-5" />;
      case 'video': return <PlayIcon className="w-5 h-5" />;
      case 'exercise': return <AcademicCapIcon className="w-5 h-5" />;
      default: return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  if (loading && lessonId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onCancel}>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  {lessonId ? 'Modifier la leçon' : 'Nouvelle leçon'}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Créez et éditez vos leçons avec des outils avancés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveTab('preview')}
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { id: 'content', label: 'Contenu', icon: DocumentTextIcon },
              { id: 'exercises', label: 'Exercices', icon: AcademicCapIcon },
              { id: 'settings', label: 'Paramètres', icon: PencilIcon },
              { id: 'preview', label: 'Aperçu', icon: EyeIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <Input
                    value={lesson.title}
                    onChange={(e) => setLesson(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la leçon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Langue</label>
                  <SelectRoot
                    value={lesson.language}
                    onValueChange={(value) => setLesson(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ewo">Ewondo</SelectItem>
                      <SelectItem value="dua">Duala</SelectItem>
                      <SelectItem value="fef">Fe'efe'e</SelectItem>
                      <SelectItem value="ful">Fulfulde</SelectItem>
                      <SelectItem value="bas">Bassa</SelectItem>
                      <SelectItem value="bam">Bamum</SelectItem>
                      <SelectItem value="yem">Yemba</SelectItem>
                    </SelectContent>
                  </SelectRoot>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={lesson.description}
                  onChange={(e) => setLesson(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la leçon"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contenu de la leçon</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addContent('text')}
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Texte
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addContent('image')}
                  >
                    <PhotoIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addContent('audio')}
                  >
                    <SpeakerWaveIcon className="w-4 h-4 mr-2" />
                    Audio
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addContent('video')}
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Vidéo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lesson.content.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getContentIcon(item.type)}
                        <span className="font-medium capitalize">{item.type}</span>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContent(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {item.type === 'text' && (
                      <Textarea
                        value={item.content}
                        onChange={(e) => updateContent(item.id, { content: e.target.value })}
                        placeholder="Contenu textuel..."
                        rows={4}
                      />
                    )}
                    
                    {(item.type === 'image' || item.type === 'audio' || item.type === 'video') && (
                      <div className="space-y-2">
                        <Input
                          value={item.content}
                          onChange={(e) => updateContent(item.id, { content: e.target.value })}
                          placeholder={`URL du ${item.type}...`}
                        />
                        {item.metadata?.duration && (
                          <p className="text-sm text-gray-600">
                            Durée: {item.metadata.duration} secondes
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {lesson.content.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun contenu ajouté. Cliquez sur les boutons ci-dessus pour commencer.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Exercices</CardTitle>
                <Button onClick={addExercise}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter un exercice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lesson.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5" />
                        <span className="font-medium">Exercice #{index + 1}</span>
                        <Badge variant="secondary">{exercise.points} pts</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Question</label>
                        <Input
                          value={exercise.question}
                          onChange={(e) => updateExercise(exercise.id, { question: e.target.value })}
                          placeholder="Question de l'exercice..."
                        />
                      </div>
                      
                      {exercise.type === 'multiple_choice' && exercise.options && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Options</label>
                          {exercise.options.map((option, optionIndex) => (
                            <Input
                              key={optionIndex}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...exercise.options!];
                                newOptions[optionIndex] = e.target.value;
                                updateExercise(exercise.id, { options: newOptions });
                              }}
                              placeholder={`Option ${optionIndex + 1}...`}
                              className="mb-2"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Bonne réponse</label>
                          <Input
                            value={exercise.correctAnswer}
                            onChange={(e) => updateExercise(exercise.id, { correctAnswer: e.target.value })}
                            placeholder="Bonne réponse..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Points</label>
                          <Input
                            type="number"
                            value={exercise.points}
                            onChange={(e) => updateExercise(exercise.id, { points: parseInt(e.target.value) || 0 })}
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Explication (optionnel)</label>
                        <Textarea
                          value={exercise.explanation || ''}
                          onChange={(e) => updateExercise(exercise.id, { explanation: e.target.value })}
                          placeholder="Explication de la réponse..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {lesson.exercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun exercice ajouté. Cliquez sur "Ajouter un exercice" pour commencer.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la leçon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau</label>
                  <SelectRoot
                    value={lesson.level}
                    onValueChange={(value: any) => setLesson(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </SelectRoot>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durée (minutes)</label>
                  <Input
                    type="number"
                    value={lesson.duration}
                    onChange={(e) => setLesson(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={lesson.isPublished}
                  onChange={(e) => setLesson(prev => ({ ...prev, isPublished: e.target.checked }))}
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publier la leçon
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de la leçon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
                  <p className="text-gray-600 mb-4">{lesson.description}</p>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{lesson.language}</Badge>
                    <Badge variant="secondary">{lesson.level}</Badge>
                    <Badge variant="secondary">{lesson.duration} min</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contenu</h3>
                  {lesson.content.map((item, index) => (
                    <div key={item.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getContentIcon(item.type)}
                        <span className="font-medium capitalize">{item.type} #{index + 1}</span>
                      </div>
                      {item.type === 'text' && (
                        <p className="text-gray-700">{item.content}</p>
                      )}
                      {item.type !== 'text' && (
                        <p className="text-sm text-gray-600">Fichier: {item.content}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Exercices ({lesson.exercises.length})</h3>
                  {lesson.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Exercice #{index + 1} ({exercise.points} pts)</h4>
                      <p className="text-gray-700 mb-2">{exercise.question}</p>
                      {exercise.options && (
                        <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                          {exercise.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                          ))}
                        </ul>
                      )}
                      <p className="text-sm text-green-600">Réponse: {exercise.correctAnswer}</p>
                      {exercise.explanation && (
                        <p className="text-sm text-gray-600 mt-2">Explication: {exercise.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedLessonEditor;