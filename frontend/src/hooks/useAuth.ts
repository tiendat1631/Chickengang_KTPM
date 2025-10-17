import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';
import { storeTokens, removeToken, getToken, getUserData } from '@/lib/auth';
import { LoginRequest, RegisterRequest, UserResponse } from '@/types/auth';
import { queryKeys } from './useQueryClient';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async (response) => {
      // Create user object from response
      const userData = {
        id: response.id,
        email: response.email,
        username: response.username,
        phoneNumber: response.phoneNumber,
        role: response.role as any,
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
          // Get user data from localStorage
          const userData = await getUserData();
          if (userData) {
            setUser(userData);
          } else {
            // If no user data found, remove invalid token
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

    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  const login = (data: LoginRequest, options?: any) => {
    loginMutation.mutate(data, {
      ...options,
      onSuccess: (response) => {
        // Create user object from response
        const userData = {
          id: response.id,
          email: response.email,
          username: response.username,
          phoneNumber: response.phoneNumber,
          role: response.role as any,
          isActive: true,
          address: response.address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userData);
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
