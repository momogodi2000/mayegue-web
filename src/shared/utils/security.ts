/**
 * Security utilities for input validation, sanitization, and security checks
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+237|237)?[0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  safeString: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
  noScript: /^[^<>]*$/,
} as const;

// XSS prevention - HTML sanitization
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// SQL injection prevention - basic string sanitization
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['"\\]/g, '')
    .replace(/[;]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .trim();
}

// Input validation functions
export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.phone.test(phone);
}

export function validateName(name: string): boolean {
  return VALIDATION_PATTERNS.name.test(name);
}

export function validateUsername(username: string): boolean {
  return VALIDATION_PATTERNS.username.test(username);
}

export function validateUrl(url: string): boolean {
  return VALIDATION_PATTERNS.url.test(url);
}

// Content Security Policy helpers
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Rate limiting helpers
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// CSRF protection
export function generateCSRFToken(): string {
  return generateNonce();
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length > 0;
}

// File upload security
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  document: ['application/pdf', 'text/plain', 'application/msword'],
} as const;

export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 10 * 1024 * 1024, // 10MB
} as const;

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Environment security checks
export function isSecureContext(): boolean {
  return window.isSecureContext || window.location.protocol === 'https:';
}

export function validateEnvironment(): { secure: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (!isSecureContext()) {
    warnings.push('Application is not running in a secure context (HTTPS)');
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    warnings.push('Application is running in development mode');
  }
  
  return {
    secure: warnings.length === 0,
    warnings
  };
}

// Data encryption helpers (for sensitive data)
export async function encryptData(data: string, key: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(key);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );
    
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  try {
    const decoder = new TextDecoder();
    const keyBuffer = new TextEncoder().encode(key);
    
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Session security
export function generateSessionId(): string {
  return generateNonce() + Date.now().toString(36);
}

export function validateSessionId(sessionId: string): boolean {
  return /^[a-f0-9]{32}[a-z0-9]+$/.test(sessionId);
}

// Input length limits
export const INPUT_LIMITS = {
  email: 254,
  password: 128,
  name: 50,
  username: 20,
  bio: 500,
  comment: 1000,
  post: 5000,
  message: 2000,
} as const;

export function validateInputLength(input: string, maxLength: number): boolean {
  return input.length <= maxLength;
}

// Logging security events
export function logSecurityEvent(event: string, details: Record<string, any>): void {
  console.warn(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details
  });
}

