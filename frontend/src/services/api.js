// @ts-nocheck
// JavaScript file - no TypeScript checking
import axios from 'axios';
import { getToken, removeToken } from '@/lib/auth.js';

// API Configuration - Use proxy in development, direct URL in production
const API_BASE_URL = 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

// Request queue for handling concurrent requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Enable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Always get fresh token from localStorage
      const token = await getToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        // Only log for non-auth endpoints to reduce noise
        if (!config.url?.includes('/auth/')) {
          console.log('[API] Request to', config.url, 'with token (first 20 chars):', token.substring(0, 20) + '...');
        }
      }
    } catch (error) {
      console.warn('[API] Failed to get token:', error);
      // Don't reject the request, just continue without token
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with request queuing
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this is a booking or payment endpoint
      const isBookingEndpoint = originalRequest.url?.includes('/bookings');
      const isPaymentEndpoint = originalRequest.url?.includes('/payments');

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh token first
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Use a separate axios instance to avoid infinite loop
          const refreshClient = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.warn(`${isBookingEndpoint ? 'Booking' : isPaymentEndpoint ? 'Payment' : 'API'} endpoint returned 401, attempting token refresh`);

          const refreshResponse = await refreshClient.post('/v1/auth/refresh', {
            refreshToken,
          });
          const { accessToken } = refreshResponse.data.data;

          // Save new token to localStorage
          localStorage.setItem('access_token', accessToken);

          // Update ONLY the original request header (not global defaults)
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          console.log('[API] Token refreshed successfully, retrying request with new token');
          console.log('[API] New token (first 20 chars):', accessToken.substring(0, 20) + '...');

          // Dispatch custom event to notify components of token refresh
          window.dispatchEvent(new CustomEvent('tokenRefreshed', {
            detail: { accessToken }
          }));

          // Process queued requests with new token
          processQueue(null, accessToken);

          isRefreshing = false;

          // Retry original request with new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          console.error('[API] Refresh error status:', refreshError.response?.status);
          processQueue(refreshError, null);
          isRefreshing = false;

          // For booking/payment endpoints, mark as refresh failed
          if (isBookingEndpoint || isPaymentEndpoint) {
            originalRequest._refreshFailed = true;
          } else {
            // For other endpoints, logout user
            try {
              await removeToken();
              console.warn('Authentication failed, user logged out');
            } catch (removeError) {
              console.error('Failed to remove tokens:', removeError);
            }
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        console.warn('No refresh token available');
        isRefreshing = false;
        processQueue(new Error('No refresh token'), null);

        if (isBookingEndpoint || isPaymentEndpoint) {
          originalRequest._refreshFailed = true;
        } else {
          try {
            await removeToken();
            console.warn('No refresh token available, user logged out');
          } catch (removeError) {
            console.error('Failed to remove tokens:', removeError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
