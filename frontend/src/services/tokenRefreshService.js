// @ts-nocheck
// JavaScript file - no TypeScript checking
import { getToken, getRefreshToken, parseJWT } from '@/lib/auth.js';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8080');

/**
 * Token Refresh Service
 * Handles proactive token refresh to prevent session interruptions
 */
class TokenRefreshService {
  constructor() {
    this.refreshInterval = null;
    this.isRefreshing = false;
    this.checkIntervalMs = 60000; // Check every minute
    this.refreshThresholdSeconds = 300; // Refresh 5 minutes before expiry
  }

  /**
   * Start proactive token refresh monitoring
   */
  startProactiveRefresh() {
    // Clear any existing interval
    this.stopProactiveRefresh();

    console.log('[TokenRefreshService] Starting proactive token refresh');

    // Check immediately
    this.checkAndRefreshToken();

    // Then check every minute
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, this.checkIntervalMs);
  }

  /**
   * Stop proactive token refresh monitoring
   */
  stopProactiveRefresh() {
    if (this.refreshInterval) {
      console.log('[TokenRefreshService] Stopping proactive token refresh');
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.isRefreshing = false;
  }

  /**
   * Check if token should be refreshed and do it if needed
   */
  async checkAndRefreshToken() {
    try {
      const token = await getToken();

      if (!token) {
        console.log('[TokenRefreshService] No token found, skipping refresh check');
        return;
      }

      if (this.shouldRefreshToken(token)) {
        console.log('[TokenRefreshService] Token needs refresh, attempting...');
        await this.refreshToken();
      }
    } catch (error) {
      console.error('[TokenRefreshService] Error checking token:', error);
    }
  }

  /**
   * Check if token should be refreshed (< 5 minutes to expiry)
   * @param {string} token - JWT token
   * @returns {boolean} True if token should be refreshed
   */
  shouldRefreshToken(token) {
    if (!token) return false;

    const payload = parseJWT(token);
    if (!payload || !payload.exp) return false;

    const currentTime = Date.now() / 1000;
    const timeToExpiry = payload.exp - currentTime;

    // Refresh if less than threshold seconds remaining
    const shouldRefresh = timeToExpiry < this.refreshThresholdSeconds && timeToExpiry > 0;

    if (shouldRefresh) {
      console.log(`[TokenRefreshService] Token expires in ${Math.round(timeToExpiry)}s, refreshing...`);
    }

    return shouldRefresh;
  }

  /**
   * Refresh the access token
   * @returns {Promise<boolean>} True if refresh successful
   */
  async refreshToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      console.log('[TokenRefreshService] Refresh already in progress, skipping');
      return false;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        console.warn('[TokenRefreshService] No refresh token available');
        this.isRefreshing = false;
        return false;
      }

      // Use a separate axios instance to avoid triggering interceptors
      const refreshClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await refreshClient.post('/v1/auth/refresh', {
        refreshToken,
      });

      const { accessToken } = response.data.data;

      if (accessToken) {
        // Update token in localStorage
        localStorage.setItem('access_token', accessToken);

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: { accessToken }
        }));

        console.log('[TokenRefreshService] Token refreshed successfully');
        this.isRefreshing = false;
        return true;
      }

      this.isRefreshing = false;
      return false;
    } catch (error) {
      console.error('[TokenRefreshService] Token refresh failed:', error);
      this.isRefreshing = false;

      // Stop proactive refresh if refresh token is invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('[TokenRefreshService] Refresh token invalid, stopping proactive refresh');
        this.stopProactiveRefresh();
      }

      return false;
    }
  }
}

// Export singleton instance
export const tokenRefreshService = new TokenRefreshService();

