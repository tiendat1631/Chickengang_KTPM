// JavaScript file - no TypeScript checking
// Web-based token storage using localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Store JWT tokens and user data securely
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {any} [userData] - User data to store
 * @returns {Promise<void>}
 */
export const storeTokens = async (accessToken, refreshToken, userData) => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (userData) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw error;
  }
};

/**
 * Get access token
 * @returns {Promise<string|null>} Access token or null
 */
export const getToken = async () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Get refresh token
 * @returns {Promise<string|null>} Refresh token or null
 */
export const getRefreshToken = async () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Get stored user data
 * @returns {Promise<any|null>} User data or null
 */
export const getUserData = async () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

/**
 * Remove all stored tokens and user data
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Failed to remove tokens:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const isAuthenticated = async () => {
  const token = await getToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Parse JWT token payload
 * @param {string} token - JWT token
 * @returns {any|null} Parsed payload or null
 */
export const parseJWT = (token) => {
  try {
    // Validate token format
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    if (!base64Url) {
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  // If no token provided, consider it expired
  if (!token) return true;
  
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

/**
 * Get time until token expiry in seconds
 * @param {string} token - JWT token
 * @returns {number} Seconds until expiry (negative if already expired)
 */
export const getTokenTimeToExpiry = (token) => {
  if (!token) return -1;
  
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return -1;
  
  const currentTime = Date.now() / 1000;
  return payload.exp - currentTime;
};

/**
 * Check if token is expiring soon
 * @param {string} token - JWT token
 * @param {number} thresholdSeconds - Threshold in seconds (default: 300 = 5 minutes)
 * @returns {boolean} True if token expires within threshold
 */
export const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  const timeToExpiry = getTokenTimeToExpiry(token);
  return timeToExpiry > 0 && timeToExpiry < thresholdSeconds;
};

/**
 * Get user role from JWT token
 * @returns {Promise<string|null>} User role or null
 */
export const getUserRole = async () => {
  try {
    const token = await getToken();
    if (!token) return null;
    
    const payload = parseJWT(token);
    return payload?.role || null;
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
};

/**
 * Check if current user is admin
 * @returns {Promise<boolean>} True if user is admin
 */
export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'ADMIN';
};