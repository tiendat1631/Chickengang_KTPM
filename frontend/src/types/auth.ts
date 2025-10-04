// Authentication Types
export interface LoginRequest {
  email: string;
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
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
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
