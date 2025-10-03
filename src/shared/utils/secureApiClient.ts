import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logSecurityEvent } from './security';

export interface SecureApiConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class SecureApiClient {
  private client: AxiosInstance;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config: SecureApiConfig) {
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token if available
        const csrfToken = sessionStorage.getItem('csrf_token');
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Add session ID
        const sessionId = sessionStorage.getItem('session_id');
        if (sessionId) {
          config.headers['X-Session-ID'] = sessionId;
        }

        // Log API request
        logSecurityEvent('api_request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasAuth: !!config.headers.Authorization,
          hasCSRF: !!csrfToken,
        });

        return config;
      },
      (error) => {
        logSecurityEvent('api_request_error', {
          error: error.message,
        });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful API response
        logSecurityEvent('api_response_success', {
          status: response.status,
          url: response.config.url,
        });

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Log API error
        logSecurityEvent('api_response_error', {
          status: error.response?.status,
          url: error.config?.url,
          error: error.message,
        });

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter) {
            await this.delay(parseInt(retryAfter) * 1000);
            return this.client(originalRequest);
          }
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
          // Clear invalid tokens
          sessionStorage.removeItem('csrf_token');
          sessionStorage.removeItem('session_id');
          
          // Redirect to login or refresh token
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Retry logic for network errors
        if (this.shouldRetry(error) && !originalRequest._retry) {
          originalRequest._retry = true;
          
          for (let i = 0; i < this.retryAttempts; i++) {
            await this.delay(this.retryDelay * Math.pow(2, i)); // Exponential backoff
            
            try {
              return await this.client(originalRequest);
            } catch (retryError) {
              if (i === this.retryAttempts - 1) {
                logSecurityEvent('api_retry_failed', {
                  url: originalRequest.url,
                  attempts: this.retryAttempts,
                });
                return Promise.reject(retryError);
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    return (
      !error.response && // Network error
      error.code !== 'ECONNABORTED' && // Timeout
      error.message !== 'Network Error'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Secure GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  // Secure POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  // Secure PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  // Secure PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  // Secure DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Upload file with security validation
  async uploadFile<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non autorisé');
    }

    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux');
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear authentication token
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Create default secure API client
export const secureApiClient = new SecureApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
});

// Helper function for making authenticated requests
export async function makeAuthenticatedRequest<T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Handle authentication error
      logSecurityEvent('authentication_failed', {
        error: error.message,
      });
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    
    if (error.response?.status === 403) {
      // Handle authorization error
      logSecurityEvent('authorization_failed', {
        error: error.message,
      });
      throw new Error('Accès non autorisé.');
    }
    
    if (error.response?.status >= 500) {
      // Handle server error
      logSecurityEvent('server_error', {
        status: error.response.status,
        error: error.message,
      });
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
    
    throw error;
  }
}

