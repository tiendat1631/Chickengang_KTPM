// JavaScript file - no TypeScript checking
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const queryKeys = {
  // Auth queries
  auth: {
    currentUser: ['auth', 'currentUser'],
  },
  
  // Movie queries
  movies: {
    all: ['movies'],
    list: (page, size, sort, filters) => 
      ['movies', 'list', { page, size, sort, ...filters }],
    detail: (id) => ['movies', 'detail', id],
    search: (query, filters) => ['movies', 'search', { query, ...filters }],
  },
  
  // User queries
  users: {
    all: ['users'],
    list: (page, size) => 
      ['users', 'list', { page, size }],
    detail: (id) => ['users', 'detail', id],
  },
  
  // Screening queries
  screenings: {
    all: ['screenings'],
    list: (movieId) => ['screenings', 'list', movieId],
    detail: (id) => ['screenings', 'detail', id],
  },
  
  // Seat queries
  seats: {
    all: ['seats'],
    list: (screeningId) => ['seats', 'list', screeningId],
  },
  
  // Booking queries (for future implementation)
  bookings: {
    all: ['bookings'],
    userBookings: (userId) => ['bookings', 'user', userId],
    detail: (id) => ['bookings', 'detail', id],
  },
};
