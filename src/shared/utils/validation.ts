/**
 * Input validation and sanitization utilities
 * For security best practices and data integrity
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

// Validate display name
export const isValidDisplayName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50 && /^[\p{L}\p{N}\s'-]+$/u.test(trimmed);
};

// Validate phone number (international format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Validate URL
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Prevent SQL injection in search queries
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[;'"\\]/g, '') // Remove SQL special characters
    .slice(0, 100);
};

// Validate and sanitize tag
export const sanitizeTag = (tag: string): string | null => {
  const sanitized = tag.trim().toLowerCase();
  if (sanitized.length < 2 || sanitized.length > 30) {
    return null;
  }
  if (!/^[a-z0-9\-_]+$/.test(sanitized)) {
    return null;
  }
  return sanitized;
};

// Rate limiting helper (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  canProceed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Filter out old attempts
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Content validation
export const validateContent = (content: string, minLength: number = 1, maxLength: number = 10000): {
  valid: boolean;
  error?: string;
} => {
  const trimmed = content.trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `Le contenu doit contenir au moins ${minLength} caractères`
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Le contenu ne peut pas dépasser ${maxLength} caractères`
    };
  }

  return { valid: true };
};

// File validation
export const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number = 5): {
  valid: boolean;
  error?: string;
} => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Le fichier ne peut pas dépasser ${maxSizeMB} MB`
    };
  }

  return { valid: true };
};

// Validate language code
export const isValidLanguageCode = (code: string): boolean => {
  const validLanguages = ['dualaba', 'ewondo', 'bassa', 'bamoun', 'fulfulde', 'anglais', 'français'];
  return validLanguages.includes(code.toLowerCase());
};

// Validate user role
export const isValidUserRole = (role: string): boolean => {
  const validRoles = ['apprenant', 'enseignant', 'admin', 'moderateur'];
  return validRoles.includes(role);
};

// Check for common injection patterns
export const containsInjectionPattern = (input: string): boolean => {
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /data:text\/html/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ];

  return injectionPatterns.some(pattern => pattern.test(input));
};

// Validate and sanitize object keys (prevent prototype pollution)
export const isSafeObjectKey = (key: string): boolean => {
  const unsafeKeys = ['__proto__', 'constructor', 'prototype'];
  return !unsafeKeys.includes(key);
};
