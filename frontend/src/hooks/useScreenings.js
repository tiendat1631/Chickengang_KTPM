// @ts-nocheck
// JavaScript file - no TypeScript checking
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api.js';
import { queryKeys } from './useQueryClient.js';

/**
 * Hook to get screenings for a movie
 * @param {number} movieId - Movie ID
 * @returns {Object} Screenings query result
 */
export const useScreenings = (movieId) => {
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

/**
 * Hook to get single screening by ID
 * @param {number} screeningId - Screening ID
 * @returns {Object} Screening query result
 */
export const useScreening = (screeningId) => {
  return useQuery({
    queryKey: queryKeys.screenings.detail(screeningId),
    queryFn: async () => {
      const response = await apiClient.get(`/v1/screenings`, { params: { id: screeningId } });
      return response.data.data;
    },
    enabled: !!screeningId,
  });
};

/**
 * Hook to get seats for a screening
 * @param {number} screeningId - Screening ID
 * @returns {Object} Seats query result
 */
export const useSeats = (screeningId) => {
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

/**
 * Hook to reserve seats
 * @param {Object} data - Reservation data
 * @param {number} data.screeningId - Screening ID
 * @param {number[]} data.seatIds - Array of seat IDs to reserve
 * @returns {Object} Reserve seats mutation
 */
export const useReserveSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      // Add null safety check
      if (!data || !data.screeningId || !data.seatIds) {
        throw new Error('Invalid reservation data');
      }
      return apiClient.post(`/v1/screenings/${data.screeningId}/reserve`, { seatIds: data.seatIds });
    },
    onSuccess: (_, variables) => {
      // Add null safety check
      if (variables && variables.screeningId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.seats.list(variables.screeningId) });
      }
    },
    onError: (error) => {
      console.error('Failed to reserve seats:', error);
    },
  });
};
