import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
  Progress,
  useToastActions
} from '@/shared/components/ui';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastActive: Date;
  streak: number;
  achievements: string[];
}

interface StudentProgressTrackerProps {
  lessonId?: string;
}

export default function StudentProgressTracker({ lessonId }: StudentProgressTrackerProps) {
  const { success: showSuccess, error: showError } = useToastActions();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [sortBy, setSortBy] = useState<'progress' | 'name' | 'lastActive'>('progress');

  useEffect(() => {
    loadStudentProgress();
  }, [lessonId]);

  const loadStudentProgress = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Marie Nguema',
          email: 'marie.nguema@email.com',
          level: 'beginner',
          progress: 75,
          completedLessons: 15,
          totalLessons: 20,
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          streak: 5,
          achievements: ['Premier pas', 'Persévérant']
        },
        {
          id: '2',
          name: 'Jean Mballa',
          email: 'jean.mballa@email.com',
          level: 'intermediate',
          progress: 90,
          completedLessons: 18,
          totalLessons: 20,
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
          streak: 12,
          achievements: ['Premier pas', 'Persévérant', 'Expert']
        },
        {
          id: '3',
          name: 'Fatou Diallo',
          email: 'fatou.diallo@email.com',
          level: 'advanced',
          progress: 95,
          completedLessons: 19,
          totalLessons: 20,
          lastActive: new Date(Date.now() - 30 * 60 * 1000),
          streak: 8,
          achievements: ['Premier pas', 'Persévérant', 'Expert', 'Maître']
        }
      ];

      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading student progress:', error);
      showError('Erreur lors du chargement des données des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !filterLevel || student.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastActive':
        return b.lastActive.getTime() - a.lastActive.getTime();
      default:
        return 0;
    }
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Progression des Étudiants
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez la progression de vos étudiants
          </p>
        </div>
        <Button onClick={loadStudentProgress} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserGroupIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Étudiants
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {students.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AcademicCapIcon className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Moyenne Progression
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Étudiants Actifs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {students.filter(s => s.lastActive.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Leçons Complétées
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {students.reduce((acc, s) => acc + s.completedLessons, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Tous les niveaux</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="progress">Progression</option>
                <option value="name">Nom</option>
                <option value="lastActive">Dernière activité</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {student.name}
                      </h3>
                      <Badge className={getLevelColor(student.level)}>
                        {student.level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {student.email}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatLastActive(student.lastActive)}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrophyIcon className="w-4 h-4" />
                        {student.streak} jours de suite
                      </div>
                      <div>
                        {student.completedLessons}/{student.totalLessons} leçons
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progression
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {student.progress}%
                      </span>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(student.progress)} transition-all duration-300`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end">
                    {student.achievements.slice(0, 2).map((achievement) => (
                      <Badge key={achievement} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                    {student.achievements.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{student.achievements.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun étudiant trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterLevel 
                ? 'Aucun étudiant ne correspond à vos critères de recherche.'
                : 'Aucun étudiant n\'est inscrit à vos leçons pour le moment.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
