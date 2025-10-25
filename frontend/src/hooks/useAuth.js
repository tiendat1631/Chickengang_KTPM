// JavaScript file - no TypeScript checking
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService.js';
import { storeTokens, removeToken, getToken, getUserData, isTokenExpired } from '@/lib/auth.js';
import { queryKeys } from './useQueryClient.js';
import { tokenRefreshService } from '@/services/tokenRefreshService.js';

/**
 * Hook for handling login mutation
 * @returns {Object} Login mutation object
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => AuthService.login(data),
    onSuccess: async (response) => {
      // Create user object from response
      const userData = {
        id: response.id,
        email: response.email,
        username: response.username,
        phoneNumber: response.phoneNumber,
        role: response.role,
        isActive: true,
        address: response.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store tokens and user data securely
      await storeTokens(response.accessToken, response.refreshToken, userData);
      
      // Update current user in cache
      queryClient.setQueryData(queryKeys.auth.currentUser, userData);
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

/**
 * Hook for handling registration mutation
 * @returns {Object} Registration mutation object
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => AuthService.register(data),
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

/**
 * Hook for handling logout mutation
 * @returns {Object} Logout mutation object
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      // Remove tokens from storage
      await removeToken();
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};

/**
 * Main authentication hook
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token && token.trim() !== '') {
          // Get user data from localStorage
          const userData = await getUserData();
          if (userData) {
            setUser(userData);
            
            // Start proactive token refresh if token is valid
            if (!isTokenExpired(token)) {
              tokenRefreshService.startProactiveRefresh();
            }
          } else {
            // If no user data found, remove invalid token
            console.warn('No user data found, removing tokens');
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Remove invalid tokens on error
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for token refresh events
    const handleTokenRefresh = async () => {
      console.log('Token refreshed, updating auth state');
      // Re-check auth state with new token
      const token = await getToken();
      if (token && !isTokenExpired(token)) {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      }
    };

    checkAuth();
    
    // Add event listener for token refresh
    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    
    // Cleanup event listener and stop proactive refresh
    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
      tokenRefreshService.stopProactiveRefresh();
    };
  }, []);

  const isAuthenticated = !!user;

  /**
   * Login function
   * @param {Object} data - Login credentials
   * @param {Object} [options] - Additional options
   */
  const login = (data, options) => {
    loginMutation.mutate(data, {
      ...options,
      onSuccess: (response) => {
        // Create user object from response
        const userData = {
          id: response.id,
          email: response.email,
          username: response.username,
          phoneNumber: response.phoneNumber,
          role: response.role,
          isActive: true,
          address: response.address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userData);
        
        // Start proactive token refresh after successful login
        tokenRefreshService.startProactiveRefresh();
        
        options?.onSuccess?.(response);
      },
    });
  };

  /**
   * Logout function
   * @param {Object} [options] - Additional options
   */
  const logout = (options) => {
    logoutMutation.mutate(undefined, {
      ...options,
      onSuccess: () => {
        setUser(null);
        
        // Stop proactive token refresh on logout
        tokenRefreshService.stopProactiveRefresh();
        
        options?.onSuccess?.();
      },
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
