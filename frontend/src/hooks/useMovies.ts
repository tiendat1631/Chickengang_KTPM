import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Movie, MovieRequest, PatchMovie } from '../types/movie';
import { queryKeys } from './useQueryClient';

// Get all movies with pagination
export const useMovies = (page: number = 0, size: number = 10, sort?: string) => {
  return useQuery({
    queryKey: queryKeys.movies.list(page, size, sort),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(sort && { sort }),
      });
      
      const response = await apiClient.get(`/movies?${params}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get movie by ID
export const useMovie = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/movies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Search movies
export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: async () => {
      const response = await apiClient.get(`/movies/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Add new movie (Admin only)
export const useAddMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MovieRequest) => {
      return apiClient.post('/movies', data);
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

// Update movie (Admin only)
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchMovie }) => {
      return apiClient.patch(`/movies/${id}`, data);
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

// Delete movie (Admin only)
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return apiClient.delete(`/movies/${id}`);
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
