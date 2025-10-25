// JavaScript file - no TypeScript checking
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api.js';
import { queryKeys } from './useQueryClient.js';

/**
 * Hook to get all movies with pagination
 * @param {number} [page=0] - Page number
 * @param {number} [size=10] - Page size
 * @param {string} [sort] - Sort parameter
 * @returns {Object} Movies query result
 */
export const useMovies = (page = 0, size = 10, sort) => {
  return useQuery({
    queryKey: queryKeys.movies.list(page, size, sort),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(sort && { sort }),
      });
      
      const response = await apiClient.get(`/v1/movies?${params}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get movie by ID
 * @param {number} id - Movie ID
 * @returns {Object} Movie query result
 */
export const useMovie = (id) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/v1/movies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to search movies with advanced filters
 * @param {string} query - Search query
 * @param {Object} filters - Filter options
 * @param {string} [filters.genre] - Genre filter
 * @param {string} [filters.yearFrom] - Year from filter
 * @param {string} [filters.yearTo] - Year to filter
 * @param {string} [filters.minRating] - Minimum rating filter
 * @param {string} [filters.language] - Language filter
 * @param {string} [filters.sortBy] - Sort option
 * @returns {Object} Search results query
 */
export const useSearchMovies = (query, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.movies.search(query, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (query) {
        params.append('q', query);
      }
      
      if (filters.genre) {
        params.append('genre', filters.genre);
      }
      
      if (filters.yearFrom) {
        params.append('yearFrom', filters.yearFrom);
      }
      
      if (filters.yearTo) {
        params.append('yearTo', filters.yearTo);
      }
      
      if (filters.minRating) {
        params.append('minRating', filters.minRating);
      }
      
      if (filters.language) {
        params.append('language', filters.language);
      }
      
      if (filters.sortBy && filters.sortBy !== 'popularity') {
        params.append('sortBy', filters.sortBy);
      }
      
      const response = await apiClient.get(`/v1/movies/search?${params}`);
      return response.data.data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to add new movie (Admin only)
 * @returns {Object} Add movie mutation
 */
export const useAddMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return apiClient.post('/v1/movies', data);
    },
    onSuccess: () => {
      // Invalidate movies list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    },
    onError: (error) => {
      console.error('Failed to add movie:', error);
    },
  });
};

/**
 * Hook to update movie (Admin only)
 * @returns {Object} Update movie mutation
 */
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {
      return apiClient.patch(`/v1/movies/${id}`, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific movie and movies list
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    },
    onError: (error) => {
      console.error('Failed to update movie:', error);
    },
  });
};

/**
 * Hook to delete movie (Admin only)
 * @returns {Object} Delete movie mutation
 */
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      return apiClient.delete(`/v1/movies/${id}`);
    },
    onSuccess: () => {
      // Invalidate movies list
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    },
    onError: (error) => {
      console.error('Failed to delete movie:', error);
    },
  });
};
