// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
} as const;

// Query Keys
export const QUERY_KEYS = {
  MOVIES: ['movies'] as const,
  MOVIE_DETAIL: (id: string) => ['movies', id] as const,
  USER_PROFILE: ['user', 'profile'] as const,
  BOOKINGS: ['bookings'] as const,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: (id: string) => `/movies/${id}`,
  BOOKING: (movieId: string) => `/booking/${movieId}`,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;
