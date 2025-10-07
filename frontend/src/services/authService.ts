import apiClient from './api';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types/auth';

export class AuthService {
  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  }

  /**
   * Logout user (client-side only)
   */
  static async logout(): Promise<void> {
    // Clear tokens from storage
    // Additional cleanup can be added here
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get('/users/profile');
    return response.data.data;
  }
}
