// @ts-check
// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
};

// Query Keys
export const QUERY_KEYS = {
  MOVIES: ['movies'],
  MOVIE_DETAIL: (id) => ['movies', id],
  USER_PROFILE: ['user', 'profile'],
  BOOKINGS: ['bookings'],
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: (id) => `/movies/${id}`,
  BOOKING: (movieId) => `/booking/${movieId}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};
