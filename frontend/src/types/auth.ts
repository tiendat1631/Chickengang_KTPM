// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
  username: string;
  address: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
  address: string;
  username: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

// API Response Types
export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
  errors: any;
}
