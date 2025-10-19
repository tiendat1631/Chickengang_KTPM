// JavaScript file - no TypeScript checking
import apiClient from './api.js';

export class AuthService {
  /**
   * Register new user
   * @param {Object} data - Registration data
   * @returns {Promise<Object>} User response
   */
  static async register(data) {
    const response = await apiClient.post('/v1/auth/register', data);
    return response.data.data;
  }

  /**
   * Login user
   * @param {Object} data - Login credentials
   * @returns {Promise<Object>} Auth response
   */
  static async login(data) {
    const response = await apiClient.post('/v1/auth/login', data);
    return response.data.data;
  }

  /**
   * Logout user (client-side only)
   * @returns {Promise<void>}
   */
  static async logout() {
    // Clear tokens from storage
    // Additional cleanup can be added here
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} Auth response
   */
  static async refreshToken(refreshToken) {
    const response = await apiClient.post('/v1/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  }

}
