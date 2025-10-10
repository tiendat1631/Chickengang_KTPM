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
    currentUser: ['auth', 'currentUser'] as const,
  },
  
  // Movie queries
  movies: {
    all: ['movies'] as const,
    list: (page: number, size: number, sort?: string) => 
      ['movies', 'list', { page, size, sort }] as const,
    detail: (id: number) => ['movies', 'detail', id] as const,
    search: (query: string) => ['movies', 'search', query] as const,
  },
  
  // User queries
  users: {
    all: ['users'] as const,
    list: (page: number, size: number) => 
      ['users', 'list', { page, size }] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
  },
  
  // Booking queries (for future implementation)
  bookings: {
    all: ['bookings'] as const,
    userBookings: (userId: number) => ['bookings', 'user', userId] as const,
    detail: (id: number) => ['bookings', 'detail', id] as const,
  },
} as const;
