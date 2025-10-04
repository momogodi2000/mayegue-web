import React, { useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import type { User, UserPreferences } from '@/shared/types/user.types';
import { RPGStatsCard, FamilyTreeCard, LearningAnalyticsCard } from '../components';
import { AnimatedSection, FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

interface TabProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, icon, isActive, onClick }) => (
  <motion.button
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-primary-600 dark:bg-primary-500 text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.2 }}
  >
    <motion.span
      className="text-lg"
      animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.span>
    <span className="hidden sm:inline">{label}</span>
  </motion.button>
);

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadStart: () => void;
  onUploadComplete: (avatarUrl: string) => void;
  isUploading: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUploadStart,
  onUploadComplete,
  isUploading
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    onUploadStart();
    
    // Simulate upload delay
    setTimeout(() => {
      const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
      onUploadComplete(mockUrl);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {currentAvatar ? (
            <motion.img
              src={currentAvatar}
              alt="Profile avatar"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.span
                className="text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👤
              </motion.span>
            </div>
          )}
        </motion.div>
        <motion.label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-sm">📷</span>
        </motion.label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <motion.div
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Téléchargement...
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface PersonalInfoFormProps {
  profile: User | null;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    email: profile?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>💾</span>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

interface PreferencesFormProps {
  preferences: UserPreferences | null;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onUpdatePreferences }) => {
  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'light',
    language: preferences?.language || 'en',
    notificationsEnabled: preferences?.notificationsEnabled ?? true,
    dailyGoalMinutes: preferences?.dailyGoalMinutes || 15,
    targetLanguages: preferences?.targetLanguages || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdatePreferences(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    'Ewondo', 'Duala', 'Bamileke', 'Fulfulde', 'Bassa', 'Bakweri'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Theme
          </label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' | 'system' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interface Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as 'fr' | 'en' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Goal (minutes)
          </label>
          <select
            value={formData.dailyGoalMinutes}
            onChange={(e) => setFormData({ ...formData, dailyGoalMinutes: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map(lang => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.targetLanguages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      targetLanguages: [...formData.targetLanguages, lang]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      targetLanguages: formData.targetLanguages.filter(l => l !== lang)
                    });
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.notificationsEnabled}
            onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span>Enable notifications</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>💾</span>
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
};

const ProfilePage: React.FC = () => {
  const {
    profile,
    preferences,
    avatar,
    rpgStats,
    familyTree,
    varkProfile,
    performanceAnalytics,
    culturalProgress,
    isUploading,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    exportData,
    deleteAccount,
    fetchRPGData,
    fetchFamilyTree,
    fetchPerformanceAnalytics,
    fetchCulturalProgress
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchRPGData();
    fetchFamilyTree();
    fetchPerformanceAnalytics();
    fetchCulturalProgress();
  }, [fetchProfile, fetchRPGData, fetchFamilyTree, fetchPerformanceAnalytics, fetchCulturalProgress]);

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: '🏠'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '👤'
    },
    {
      id: 'rpg',
      label: 'RPG',
      icon: '🎮'
    },
    {
      id: 'family',
      label: 'Famille',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊'
    },
    {
      id: 'preferences',
      label: 'Préférences',
      icon: '⚙️'
    },
    {
      id: 'privacy',
      label: 'Confidentialité',
      icon: '🛡️'
    },
    {
      id: 'data',
      label: 'Données',
      icon: '💾'
    }
  ];

  const handleNavigation = (section: string) => {
    setActiveTab(section);
  };

  const handleExportData = async () => {
    try {
      await exportData();
      alert('Your data export has been prepared. Check your downloads folder.');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (showDeleteConfirm) {
      try {
        await deleteAccount();
        alert('Your account has been scheduled for deletion.');
      } catch (error) {
        alert('Failed to delete account. Please try again.');
      }
    }
    setShowDeleteConfirm(!showDeleteConfirm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load profile: {error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Profil - Ma'a yegue</title>
        <meta name="description" content="Gérez votre profil, vos statistiques RPG, votre arbre familial et vos analytics d'apprentissage." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              <AvatarUpload
                currentAvatar={avatar || undefined}
                onUploadStart={() => {}}
                onUploadComplete={uploadAvatar}
                isUploading={isUploading}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.displayName || 'Votre Profil'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    {profile?.role || 'apprenant'}
                  </span>
                  {rpgStats && (
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      Niveau {rpgStats.level} - {rpgStats.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <AnimatedSection>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Vue d'ensemble du Profil
                </h2>
                
                {/* RPG Stats and Family Tree */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {rpgStats && (
                    <RPGStatsCard 
                      stats={rpgStats} 
                      onNavigate={handleNavigation}
                    />
                  )}
                  
                  {familyTree && (
                    <FamilyTreeCard 
                      familyTree={familyTree} 
                      onNavigate={handleNavigation}
                      onInviteMember={() => handleNavigation('family')}
                    />
                  )}
                </div>

                {/* Learning Analytics */}
                {varkProfile && performanceAnalytics && culturalProgress && (
                  <LearningAnalyticsCard 
                    varkProfile={varkProfile}
                    performance={performanceAnalytics}
                    culturalProgress={culturalProgress}
                    onNavigate={handleNavigation}
                  />
                )}
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'profile' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Informations Personnelles
                </h2>
                <PersonalInfoForm
                  profile={profile}
                  onUpdateProfile={updateProfile}
                />
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'rpg' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Statistiques RPG
                </h2>
                {rpgStats ? (
                  <RPGStatsCard 
                    stats={rpgStats} 
                    onNavigate={handleNavigation}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Chargement des statistiques RPG...
                  </p>
                )}
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'family' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Arbre Familial
                </h2>
                {familyTree ? (
                  <FamilyTreeCard 
                    familyTree={familyTree} 
                    onNavigate={handleNavigation}
                    onInviteMember={() => {}}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Chargement de l'arbre familial...
                  </p>
                )}
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'analytics' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Analytics d'Apprentissage
                </h2>
                {varkProfile && performanceAnalytics && culturalProgress ? (
                  <LearningAnalyticsCard 
                    varkProfile={varkProfile}
                    performance={performanceAnalytics}
                    culturalProgress={culturalProgress}
                    onNavigate={handleNavigation}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Chargement des analytics...
                  </p>
                )}
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'preferences' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Préférences de l'App
                </h2>
                <PreferencesForm
                  preferences={preferences}
                  onUpdatePreferences={updatePreferences}
                />
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'privacy' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Paramètres de Confidentialité
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Visibilité du Profil
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          defaultChecked
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Public</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Votre profil est visible par tous
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="visibility"
                          value="friends"
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Amis Seulement</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Seuls vos amis peuvent voir votre profil
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Privé</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Votre profil est complètement privé
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Partage de Données
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Analytics d'Apprentissage
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Aidez à améliorer l'app avec des données d'usage anonymes
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Communications Marketing
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Recevez des recommandations d'apprentissage personnalisées
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {activeTab === 'data' && (
            <AnimatedSection>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Gestion des Données
                </h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Exporter Vos Données
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Téléchargez une copie de toutes vos données d'apprentissage, 
                      progrès et informations de compte.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>📥</span>
                      Exporter les Données
                    </button>
                  </div>

                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-400 mb-2">
                      Supprimer le Compte
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">
                      Supprimez définitivement votre compte et toutes les données associées. 
                      Cette action ne peut pas être annulée.
                    </p>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <span>🗑️</span>
                        Supprimer le Compte
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-red-800 dark:text-red-200 font-medium">
                          Êtes-vous absolument sûr ? Cela supprimera définitivement votre compte.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Oui, Supprimer Mon Compte
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
