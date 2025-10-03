import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RateLimiter, validateEnvironment, logSecurityEvent } from '../utils/security';

interface SecurityState {
  isSecureContext: boolean;
  environmentWarnings: string[];
  rateLimiter: RateLimiter;
  csrfToken: string;
  sessionId: string;
}

interface SecurityContextType extends SecurityState {
  checkRateLimit: (identifier: string) => boolean;
  getRemainingRequests: (identifier: string) => number;
  logSecurityEvent: (event: string, details: Record<string, any>) => void;
  refreshCSRFToken: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [environmentWarnings, setEnvironmentWarnings] = useState<string[]>([]);
  const [csrfToken, setCSRFToken] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Initialize security components
  const rateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

  useEffect(() => {
    // Check environment security
    const envCheck = validateEnvironment();
    setIsSecureContext(envCheck.secure);
    setEnvironmentWarnings(envCheck.warnings);

    // Generate CSRF token and session ID
    const token = generateCSRFToken();
    const session = generateSessionId();
    setCSRFToken(token);
    setSessionId(session);

    // Log security initialization
    logSecurityEvent('security_initialized', {
      secureContext: envCheck.secure,
      warnings: envCheck.warnings,
      sessionId: session
    });

    // Store tokens in session storage
    sessionStorage.setItem('csrf_token', token);
    sessionStorage.setItem('session_id', session);
  }, []);

  const checkRateLimit = (identifier: string): boolean => {
    const allowed = rateLimiter.isAllowed(identifier);
    
    if (!allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        identifier,
        remaining: rateLimiter.getRemainingRequests(identifier)
      });
    }
    
    return allowed;
  };

  const getRemainingRequests = (identifier: string): number => {
    return rateLimiter.getRemainingRequests(identifier);
  };

  const refreshCSRFToken = () => {
    const newToken = generateCSRFToken();
    setCSRFToken(newToken);
    sessionStorage.setItem('csrf_token', newToken);
    
    logSecurityEvent('csrf_token_refreshed', {
      sessionId
    });
  };

  const logSecurityEventWrapper = (event: string, details: Record<string, any>) => {
    logSecurityEvent(event, {
      ...details,
      sessionId,
      csrfToken: csrfToken.substring(0, 8) + '...' // Only log partial token
    });
  };

  const value: SecurityContextType = {
    isSecureContext,
    environmentWarnings,
    rateLimiter,
    csrfToken,
    sessionId,
    checkRateLimit,
    getRemainingRequests,
    logSecurityEvent: logSecurityEventWrapper,
    refreshCSRFToken,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity(): SecurityContextType {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

// Helper functions
function generateCSRFToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function generateSessionId(): string {
  const nonce = generateCSRFToken();
  return nonce + Date.now().toString(36);
}
