// Web-based token storage using localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Store JWT tokens and user data securely
 */
export const storeTokens = async (accessToken: string, refreshToken: string, userData?: any): Promise<void> => {
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
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Get stored user data
 */
export const getUserData = async (): Promise<any | null> => {
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
 */
export const removeToken = async (): Promise<void> => {
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
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Parse JWT token payload
 */
export const parseJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
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
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};