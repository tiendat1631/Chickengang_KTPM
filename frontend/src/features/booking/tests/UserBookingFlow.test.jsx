import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Import pages involved in the flow
import HomePage from '@/features/movies/components/HomePage';
import MovieDetailPage from '@/features/movies/components/MovieDetailPage';
import SeatSelectionPage from '@/features/booking/components/SeatSelectionPage';
import BookingPage from '@/features/booking/components/BookingPage';

import { useScreenings, useSeats } from '@/features/screenings/hooks/useScreenings';

// Mock Dependencies
vi.mock('@/features/auth/hooks/useAuth');
vi.mock('@/features/screenings/hooks/useScreenings');
vi.mock('@/services/api');
vi.mock('@/components/common/Header', () => ({
    default: ({ onSearch }) => (
        <div data-testid="header">
            <input
                data-testid="search-input"
                placeholder="Search movies..."
                onChange={(e) => onSearch(e ? e.target.value : '')}
            />
        </div>
    )
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('User Booking Flow Integration Test', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };

    // Test Data
    const mockMovies = [
        {
            id: 1,
            title: 'Avengers: Endgame',
            genres: 'Action, Sci-Fi',
            releaseDate: '2023-01-01',
            posterUrl: 'url',
            director: 'Russo Brothers',
            actors: 'Robert Downey Jr., Chris Evans',
            duration: '181 min',
            language: 'English',
            rated: 'C13',
            description: 'Epic finale'
        }
    ];

    const mockMovieDetail = {
        ...mockMovies[0],
        duration: '181 min',
        rating: 9.5
    };

    const mockScreenings = [
        {
            id: 10,
            movieId: 1,
            movieTitle: 'Avengers: Endgame',
            startTime: '2025-12-25T20:00:00',
            auditoriumId: 1,
            auditoriumName: 'Hall 1',
            format: '2D'
        }
    ];

    const mockSeats = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        rowLabel: 'A',
        number: i + 1,
        seatType: 'NORMAL',
        status: 'AVAILABLE'
    }));

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        useAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

        useScreenings.mockReturnValue({
            data: mockScreenings,
            isLoading: false,
            error: null
        });
        useSeats.mockReturnValue({
            data: mockSeats,
            isLoading: false,
            error: null
        });

        // Setup API Mocks
        apiClient.get.mockImplementation((url) => {
            console.log('API GET:', url);
            if (url.includes('/movies/featured') || url.includes('/movies')) {
                // Return Page structure
                return Promise.resolve({ data: { data: { content: mockMovies, totalElements: 1 } } });
            }
            if (url.match(/\/movies\/\d+$/)) {
                return Promise.resolve({ data: { data: mockMovieDetail } });
            }
            if (url.includes('/screenings/movie')) { // Get screenings for movie
                return Promise.resolve({ data: { data: mockScreenings } });
            }
            if (url.match(/\/screenings\/\d+$/)) { // Get single screening
                return Promise.resolve({ data: { data: mockScreenings[0] } });
            }
            if (url.includes('/seats/screening')) {
                return Promise.resolve({ data: { data: mockSeats } });
            }
            return Promise.resolve({ data: { data: [] } });
        });

        apiClient.post.mockImplementation((url, data) => {
            console.log('API POST:', url, data);
            if (url.includes('/bookings')) {
                return Promise.resolve({
                    data: {
                        data: {
                            id: 999,
                            bookingCode: 'BOOK-SUCCESS',
                            totalPrice: 120000,
                            bookingStatus: 'PENDING'
                        }
                    }
                });
            }
            return Promise.reject(new Error('Unknown Endpoint'));
        });
    });

    it.skip('Complete User Flow: Search -> Select Movie -> Select Seat -> Book', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies/:id" element={<MovieDetailPage />} />
                        <Route path="/booking/seat/:movieId/:screeningId" element={<SeatSelectionPage />} />
                        <Route path="/booking/:movieId" element={<BookingPage />} />
                        <Route path="/404" element={<div>404 Not Found</div>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // 1. Home Page & Search
        const movieTitles = await screen.findAllByText(/Avengers: Endgame/i, {}, { timeout: 3000 });
        expect(movieTitles.length).toBeGreaterThan(0);

        // Simulate clicking the movie
        const movieCard = movieTitles[0].closest('a') || movieTitles[0];
        fireEvent.click(movieCard);

        // 2. Movie Detail Page
        await waitFor(async () => {
            const titles = await screen.findAllByText(/Avengers: Endgame/i);
            expect(titles.length).toBeGreaterThan(0);
        });

        // Wait for screenings to load
        await waitFor(async () => {
            const times = await screen.findAllByText(/20:00/i);
            expect(times.length).toBeGreaterThan(0);
            const halls = await screen.findAllByText(/Hall 1/i);
            expect(halls.length).toBeGreaterThan(0);
        });

        // Click on the screening time to select it
        const screeningTime = screen.getByText('20:00');
        fireEvent.click(screeningTime);

        // 3. Seat Selection Page
        await waitFor(() => {
            expect(screen.getByText('Màn hình')).toBeInTheDocument(); // Screen label
        });

        // Find an available seat and click it
        const seat = screen.getByText('A1'); // First seat
        fireEvent.click(seat);

        // Click "Continue" or "Book" button
        const continueButton = screen.getByRole('button', { name: /đặt vé|tiếp tục/i });
        fireEvent.click(continueButton);

        // 4. Booking Page
        await waitFor(() => {
            // Check for payment or booking details confirmation
            // If BookingPage shows "Thanh toán" or "Chi tiết đặt vé"
            // Adjust regex based on actual BookingPage content
            // Assuming it contains payment options or booking status
            expect(screen.queryByText(/Thanh toán/i) || screen.queryByText(/Chi tiết/i)).toBeInTheDocument();
            // Just find anything that signifies success
            expect(screen.getByText(/120.000/)).toBeInTheDocument();
        });
    });
});
