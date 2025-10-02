/**
 * Environment Configuration
 * Centralized configuration management for all environments
 */

export interface AppConfig {
  // App Info
  appName: string;
  appVersion: string;
  appDescription: string;
  environment: 'development' | 'staging' | 'production';
  
  // Firebase
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  
  // API Endpoints
  api: {
    baseUrl: string;
    campayUrl: string;
    noupaiUrl: string;
  };
  
  // AI Services
  ai: {
    geminiApiKey?: string;
    openaiApiKey?: string;
  };
  
  // Payment
  payment: {
    campay: {
      appUser: string;
      appPass: string;
    };
    noupai: {
      clientId: string;
      clientSecret: string;
    };
  };
  
  // Security
  security: {
    encryptionKey: string;
    jwtSecret: string;
  };
  
  // Social Auth
  social: {
    googleClientId?: string;
    facebookAppId?: string;
    appleClientId?: string;
  };
  
  // Feature Flags
  features: {
    aiChat: boolean;
    voiceRecognition: boolean;
    offlineMode: boolean;
    payments: boolean;
    community: boolean;
    gamification: boolean;
  };
  
  // Monitoring
  monitoring: {
    sentryDsn?: string;
    googleAnalyticsId?: string;
    hotjarId?: string;
    performanceMonitoring: boolean;
  };
  
  // PWA
  pwa: {
    enabled: boolean;
    updatePopup: boolean;
  };
  
  // Internationalization
  i18n: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };
  
  // Development
  dev: {
    useEmulators: boolean;
    debugMode: boolean;
  };
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

// Helper function to get boolean environment variable
function getBoolEnvVar(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

// Helper function to get array from comma-separated string
function getArrayEnvVar(key: string, fallback: string[] = []): string[] {
  const value = import.meta.env[key];
  if (!value) return fallback;
  return value.split(',').map((item: string) => item.trim());
}

// Main configuration object
export const config: AppConfig = {
  // App Info
  appName: getEnvVar('VITE_APP_NAME', 'Mayegue'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  appDescription: getEnvVar('VITE_APP_DESCRIPTION', 'Application d\'apprentissage des langues camerounaises'),
  environment: getEnvVar('VITE_APP_ENV', 'development') as 'development' | 'staging' | 'production',
  
  // Firebase
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
    measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
  },
  
  // API Endpoints
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5001'),
    campayUrl: getEnvVar('VITE_CAMPAY_API_URL', 'https://demo.campay.net/api'),
    noupaiUrl: getEnvVar('VITE_NOUPAI_API_URL', 'https://api.noupai.com'),
  },
  
  // AI Services
  ai: {
    geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY'),
    openaiApiKey: getEnvVar('VITE_OPENAI_API_KEY'),
  },
  
  // Payment
  payment: {
    campay: {
      appUser: getEnvVar('VITE_CAMPAY_APP_USER'),
      appPass: getEnvVar('VITE_CAMPAY_APP_PASS'),
    },
    noupai: {
      clientId: getEnvVar('VITE_NOUPAI_CLIENT_ID'),
      clientSecret: getEnvVar('VITE_NOUPAI_CLIENT_SECRET'),
    },
  },
  
  // Security
  security: {
    encryptionKey: getEnvVar('VITE_ENCRYPTION_KEY'),
    jwtSecret: getEnvVar('VITE_JWT_SECRET'),
  },
  
  // Social Auth
  social: {
    googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
    facebookAppId: getEnvVar('VITE_FACEBOOK_APP_ID'),
    appleClientId: getEnvVar('VITE_APPLE_CLIENT_ID'),
  },
  
  // Feature Flags
  features: {
    aiChat: getBoolEnvVar('VITE_ENABLE_AI_CHAT', true),
    voiceRecognition: getBoolEnvVar('VITE_ENABLE_VOICE_RECOGNITION', true),
    offlineMode: getBoolEnvVar('VITE_ENABLE_OFFLINE_MODE', true),
    payments: getBoolEnvVar('VITE_ENABLE_PAYMENTS', true),
    community: getBoolEnvVar('VITE_ENABLE_COMMUNITY', true),
    gamification: getBoolEnvVar('VITE_ENABLE_GAMIFICATION', true),
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    googleAnalyticsId: getEnvVar('VITE_GOOGLE_ANALYTICS_ID'),
    hotjarId: getEnvVar('VITE_HOTJAR_ID'),
    performanceMonitoring: getBoolEnvVar('VITE_PERFORMANCE_MONITORING', true),
  },
  
  // PWA
  pwa: {
    enabled: getBoolEnvVar('VITE_PWA_ENABLED', true),
    updatePopup: getBoolEnvVar('VITE_SW_UPDATE_POPUP', true),
  },
  
  // Internationalization
  i18n: {
    defaultLanguage: getEnvVar('VITE_DEFAULT_LANGUAGE', 'fr'),
    supportedLanguages: getArrayEnvVar('VITE_SUPPORTED_LANGUAGES', ['fr', 'en']),
  },
  
  // Development
  dev: {
    useEmulators: getBoolEnvVar('VITE_USE_EMULATORS', false),
    debugMode: getBoolEnvVar('VITE_DEBUG_MODE', false),
  },
};

// Validation function to check required environment variables
export function validateConfig(): void {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  
  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Warn about optional but recommended variables
  const recommended = [
    'VITE_GEMINI_API_KEY',
    'VITE_CAMPAY_APP_USER',
    'VITE_ENCRYPTION_KEY',
  ];
  
  const missingRecommended = recommended.filter(key => !import.meta.env[key]);
  
  if (missingRecommended.length > 0 && config.dev.debugMode) {
    console.warn(`Missing recommended environment variables: ${missingRecommended.join(', ')}`);
  }
}

// Export environment-specific configurations
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isStaging = config.environment === 'staging';

// Initialize validation on module load
if (typeof window !== 'undefined') {
  validateConfig();
}

export default config;
