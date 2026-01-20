import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies
});

// Response interceptor for auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 (Unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if already on refresh or login endpoints
      if (originalRequest.url?.includes('/sessions/refresh') ||
          originalRequest.url?.includes('/login') ||
          originalRequest.url?.includes('/logout')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        await apiClient.post('/sessions/refresh');

        // Token refreshed successfully
        processQueue(null);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        processQueue(new Error('Session expired'));

        // Clear any stored user state and redirect
        if (typeof window !== 'undefined') {
          // Don't redirect if already on an auth page
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/login') &&
              !currentPath.startsWith('/register') &&
              !currentPath.startsWith('/forgot-password')) {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Preserve original error for special cases that need access to full response
    if (error.response?.status === 403) {
      const data = error.response?.data as Record<string, unknown>;
      // Email verification required
      if (data?.requiresEmailVerification) {
        return Promise.reject(error);
      }
      // Account deleted (within grace period)
      if (data?.accountDeleted) {
        return Promise.reject(error);
      }
    }

    // Extract error message from server if exists
    const message = (error.response?.data as Record<string, string>)?.error || error.message || 'Error de conexión';
    return Promise.reject(new Error(message));
  }
);

// Alias for backwards compatibility
export const api = apiClient;
