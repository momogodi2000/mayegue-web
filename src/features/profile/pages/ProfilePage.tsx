import React, { useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import type { User, UserPreferences } from '@/shared/types/user.types';

interface TabProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, icon, isActive, onClick }) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-green-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
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
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="text-sm">📷</span>
        </label>
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
        <div className="text-sm text-gray-600">Uploading...</div>
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
    isUploading,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    exportData,
    deleteAccount
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '⚙️'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: '🛡️'
    },
    {
      id: 'data',
      label: 'Data',
      icon: '📊'
    }
  ];

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <AvatarUpload
              currentAvatar={avatar || undefined}
              onUploadStart={() => {}}
              onUploadComplete={uploadAvatar}
              isUploading={isUploading}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.displayName || 'Your Profile'}</h1>
              <p className="text-gray-600">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {profile?.role || 'learner'}
              </span>
            </div>
          </div>
        </div>

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
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <PersonalInfoForm
                profile={profile}
                onUpdateProfile={updateProfile}
              />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">App Preferences</h2>
              <PreferencesForm
                preferences={preferences}
                onUpdatePreferences={updatePreferences}
              />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
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
                        <span className="font-medium">Public</span>
                        <p className="text-sm text-gray-600">Your profile is visible to everyone</p>
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
                        <span className="font-medium">Friends Only</span>
                        <p className="text-sm text-gray-600">Only your friends can see your profile</p>
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
                        <span className="font-medium">Private</span>
                        <p className="text-sm text-gray-600">Your profile is completely private</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sharing</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium">Learning Analytics</span>
                        <p className="text-sm text-gray-600">Help improve the app with anonymous usage data</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium">Marketing Communications</span>
                        <p className="text-sm text-gray-600">Receive personalized learning recommendations</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Export Your Data</h3>
                  <p className="text-gray-600 mb-4">
                    Download a copy of all your learning data, progress, and account information.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>📥</span>
                    Export Data
                  </button>
                </div>

                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-900 mb-2">Delete Account</h3>
                  <p className="text-red-700 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <span>🗑️</span>
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-red-800 font-medium">
                        Are you absolutely sure? This will permanently delete your account.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Yes, Delete My Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
