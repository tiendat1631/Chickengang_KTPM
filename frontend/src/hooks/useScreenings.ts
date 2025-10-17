import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { queryKeys } from './useQueryClient';

// Get screenings for a movie
export const useScreenings = (movieId: number) => {
  return useQuery({
    queryKey: queryKeys.screenings.list(movieId),
    queryFn: async () => {
      const response = await apiClient.get(`/v1/screenings/movie/${movieId}`);
      return response.data.data;
    },
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single screening by ID
export const useScreening = (screeningId: number) => {
  return useQuery({
    queryKey: queryKeys.screenings.detail(screeningId),
    queryFn: async () => {
      const response = await apiClient.get(`/v1/screenings`, { params: { id: screeningId } });
      return response.data.data;
    },
    enabled: !!screeningId,
  });
};

// Get seats for a screening
export const useSeats = (screeningId: number) => {
  return useQuery({
    queryKey: queryKeys.seats.list(screeningId),
    queryFn: async () => {
      // Seats are embedded in screening detail; there is no separate endpoint
      const response = await apiClient.get(`/v1/screenings`, { params: { id: screeningId } });
      return response.data.data?.seats ?? [];
    },
    enabled: !!screeningId,
    staleTime: 30 * 1000, // 30 seconds (seats change frequently)
  });
};

// Reserve seats
export const useReserveSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ screeningId, seatIds }: { screeningId: number; seatIds: number[] }) => {
      return apiClient.post(`/v1/screenings/${screeningId}/reserve`, { seatIds });
    },
    onSuccess: (_, { screeningId }) => {
      // Invalidate seats to refetch updated status
      queryClient.invalidateQueries({ queryKey: queryKeys.seats.list(screeningId) });
    },
    onError: (error) => {
      console.error('Failed to reserve seats:', error);
    },
  });
};
