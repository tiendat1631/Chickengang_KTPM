// JavaScript file - no TypeScript checking
import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from './constants.js';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { accessToken } = response.data;
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to home
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            window.location.href = '/';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic GET request
   * @param {string} url - Request URL
   * @param {Object} [config] - Axios config
   * @returns {Promise<any>} Response data
   */
  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   * @param {string} url - Request URL
   * @param {any} [data] - Request data
   * @param {Object} [config] - Axios config
   * @returns {Promise<any>} Response data
   */
  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   * @param {string} url - Request URL
   * @param {any} [data] - Request data
   * @param {Object} [config] - Axios config
   * @returns {Promise<any>} Response data
   */
  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   * @param {string} url - Request URL
   * @param {Object} [config] - Axios config
   * @returns {Promise<any>} Response data
   */
  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   * @param {string} url - Request URL
   * @param {any} [data] - Request data
   * @param {Object} [config] - Axios config
   * @returns {Promise<any>} Response data
   */
  async patch(url, data, config) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
