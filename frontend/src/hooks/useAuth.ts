import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { storeTokens, removeToken, getToken } from '../utils/auth';
import { LoginRequest, RegisterRequest, UserResponse } from '../types/auth';
import { queryKeys } from './useQueryClient';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async (response) => {
      // Store tokens securely
      await storeTokens(response.accessToken, response.refreshToken);
      
      // Update current user in cache
      queryClient.setQueryData(queryKeys.auth.currentUser, response.user);
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

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

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => AuthService.getCurrentUser(),
    enabled: false, // Will be enabled when user is authenticated
    retry: false,
  });
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserResponse | null>(null);
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          // Try to get user data
          try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            // Token might be invalid, remove it
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  const login = (data: LoginRequest, options?: any) => {
    loginMutation.mutate(data, {
      ...options,
      onSuccess: (response) => {
        setUser(response.user);
        options?.onSuccess?.(response);
      },
    });
  };

  const logout = (options?: any) => {
    logoutMutation.mutate(undefined, {
      ...options,
      onSuccess: () => {
        setUser(null);
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
