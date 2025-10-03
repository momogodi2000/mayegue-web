import { useState, useCallback } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateUsername,
  validatePhone,
  validateUrl,
  sanitizeHtml,
  sanitizeString,
  INPUT_LIMITS
} from '../utils/security';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string, formData?: any) => string | null;
  sanitize?: 'html' | 'string' | 'none';
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string | null;
}

export interface FormData {
  [key: string]: any;
}

export function useFormValidation<T extends FormData>(
  initialData: T,
  rules: ValidationRules
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Sanitize input based on rule
    let sanitizedValue = value;
    if (rule.sanitize === 'html') {
      sanitizedValue = sanitizeHtml(value);
    } else if (rule.sanitize === 'string') {
      sanitizedValue = sanitizeString(value);
    }

    // Required validation
    if (rule.required && (!sanitizedValue || sanitizedValue.trim() === '')) {
      return 'Ce champ est requis';
    }

    // Skip other validations if field is empty and not required
    if (!sanitizedValue || sanitizedValue.trim() === '') {
      return null;
    }

    // Length validations
    if (rule.minLength && sanitizedValue.length < rule.minLength) {
      return `Minimum ${rule.minLength} caractères requis`;
    }

    if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} caractères autorisés`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
      return 'Format invalide';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(sanitizedValue, data);
    }

    return null;
  }, [rules]);

  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, rules, validateField]);

  const setFieldValue = useCallback((name: string, value: string) => {
    setData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field when touched
    const error = validateField(name, data[name] || '');
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [data, validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const getFieldError = useCallback((name: string): string | null => {
    return touched[name] ? errors[name] || null : null;
  }, [errors, touched]);

  const isFieldValid = useCallback((name: string): boolean => {
    return !getFieldError(name);
  }, [getFieldError]);

  const isFormValid = useCallback((): boolean => {
    return Object.keys(rules).every(fieldName => isFieldValid(fieldName));
  }, [rules, isFieldValid]);

  return {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateAll,
    getFieldError,
    isFieldValid,
    isFormValid,
    reset,
  };
}

// Predefined validation rules for common fields
export const COMMON_VALIDATION_RULES: ValidationRules = {
  email: {
    required: true,
    maxLength: INPUT_LIMITS.email,
    custom: (value) => validateEmail(value) ? null : 'Adresse email invalide',
    sanitize: 'string'
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: INPUT_LIMITS.password,
    custom: (value) => {
      const result = validatePassword(value);
      return result.valid ? null : result.errors[0];
    },
    sanitize: 'none'
  },
  confirmPassword: {
    required: true,
    custom: (value, formData) => {
      return value === formData.password ? null : 'Les mots de passe ne correspondent pas';
    },
    sanitize: 'none'
  },
  name: {
    required: true,
    maxLength: INPUT_LIMITS.name,
    custom: (value) => validateName(value) ? null : 'Nom invalide',
    sanitize: 'string'
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: INPUT_LIMITS.username,
    custom: (value) => validateUsername(value) ? null : 'Nom d\'utilisateur invalide',
    sanitize: 'string'
  },
  phone: {
    required: false,
    custom: (value) => value ? (validatePhone(value) ? null : 'Numéro de téléphone invalide') : null,
    sanitize: 'string'
  },
  url: {
    required: false,
    custom: (value) => value ? (validateUrl(value) ? null : 'URL invalide') : null,
    sanitize: 'string'
  },
  bio: {
    required: false,
    maxLength: INPUT_LIMITS.bio,
    sanitize: 'html'
  },
  comment: {
    required: true,
    maxLength: INPUT_LIMITS.comment,
    sanitize: 'html'
  },
  message: {
    required: true,
    maxLength: INPUT_LIMITS.message,
    sanitize: 'html'
  }
};

// Hook for specific form types
export function useAuthFormValidation() {
  return useFormValidation(
    { email: '', password: '', confirmPassword: '', name: '', username: '' },
    {
      email: COMMON_VALIDATION_RULES.email,
      password: COMMON_VALIDATION_RULES.password,
      confirmPassword: COMMON_VALIDATION_RULES.confirmPassword,
      name: COMMON_VALIDATION_RULES.name,
      username: COMMON_VALIDATION_RULES.username,
    }
  );
}

export function useContactFormValidation() {
  return useFormValidation(
    { name: '', email: '', subject: '', message: '', phone: '' },
    {
      name: COMMON_VALIDATION_RULES.name,
      email: COMMON_VALIDATION_RULES.email,
      subject: {
        required: true,
        maxLength: 100,
        sanitize: 'string'
      },
      message: COMMON_VALIDATION_RULES.message,
      phone: COMMON_VALIDATION_RULES.phone,
    }
  );
}

export function useProfileFormValidation() {
  return useFormValidation(
    { name: '', username: '', bio: '', phone: '', website: '' },
    {
      name: COMMON_VALIDATION_RULES.name,
      username: COMMON_VALIDATION_RULES.username,
      bio: COMMON_VALIDATION_RULES.bio,
      phone: COMMON_VALIDATION_RULES.phone,
      website: COMMON_VALIDATION_RULES.url,
    }
  );
}
