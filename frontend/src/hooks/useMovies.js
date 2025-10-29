// JavaScript file - no TypeScript checking
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api.js';
import { queryKeys } from './useQueryClient.js';

/**
 * Hook to get all movies with pagination and filters
 * @param {number} [page=0] - Page number
 * @param {number} [size=10] - Page size
 * @param {string} [sort] - Sort parameter
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Object} Movies query result with pagination metadata
 */
export const useMovies = (page = 0, size = 10, sort, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.movies.list(page, size, sort, filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(sort && { sort }),
        ...(filters.search && { search: filters.search }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.yearFrom && { yearFrom: filters.yearFrom.toString() }),
        ...(filters.yearTo && { yearTo: filters.yearTo.toString() }),
        ...(filters.status && { status: filters.status }),
      });
      
      const response = await apiClient.get(`/v1/movies?${params}`);
      return response.data.data; // Returns PageResponse with content, totalElements, etc.
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
 * Hook to search movies with advanced filters and pagination
 * @param {string} query - Search query
 * @param {number} [page=0] - Page number
 * @param {number} [size=10] - Page size
 * @param {Object} [filters={}] - Filter options
 * @returns {Object} Search results query with pagination
 */
export const useSearchMovies = (query, page = 0, size = 10, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.movies.search(query, { page, size, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(query && { search: query }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.yearFrom && { yearFrom: filters.yearFrom.toString() }),
        ...(filters.yearTo && { yearTo: filters.yearTo.toString() }),
        ...(filters.status && { status: filters.status }),
        ...(filters.sort && { sort: filters.sort }),
      });
      
      const response = await apiClient.get(`/v1/movies?${params}`);
      return response.data.data; // Returns PageResponse
    },
    enabled: !!query && query.length > 0,
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
