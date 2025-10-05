/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_GEMINI_API_KEY: string;
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

const requiredEnvVars: (keyof EnvConfig)[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GEMINI_API_KEY'
];

export function validateEnv(): EnvConfig {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  for (const varName of requiredEnvVars) {
    const value = import.meta.env[varName];

    if (!value) {
      missingVars.push(varName);
    } else if (typeof value !== 'string' || value.trim().length === 0) {
      invalidVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new EnvValidationError(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (invalidVars.length > 0) {
    throw new EnvValidationError(
      `Invalid environment variables (empty or not string): ${invalidVars.join(', ')}`
    );
  }

  return {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY
  };
}

export function getEnv(): EnvConfig {
  return validateEnv();
}
