import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MovieDetailPage from '@/features/movies/components/MovieDetailPage';
import apiClient from '@/services/api';
import { useScreenings } from '@/features/screenings/hooks/useScreenings';

// Mock dependencies
vi.mock('@/services/api');
vi.mock('@/features/screenings/hooks/useScreenings');

// Mock child components
vi.mock('@/components/common/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));
vi.mock('@/components/ui/Breadcrumb', () => ({
    default: ({ items }) => (
        <div data-testid="breadcrumb">
            {items.map(item => item.label).join(' > ')}
        </div>
    )
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('MovieDetailPage', () => {
    const mockMovie = {
        id: 1,
        title: 'Avengers: Endgame',
        director: 'Russo Brothers',
        duration: 181,
        releaseDate: '2019-04-26',
        genres: 'Action, Sci-Fi',
        description: 'Epic conclusion'
    };

    const mockScreenings = [
        {
            id: 101,
            startTime: '2025-12-15T18:00:00',
            endTime: '2025-12-15T21:00:00',
            format: '2D',
            status: 'ACTIVE',
            auditoriumId: 1,
            auditoriumName: 'Hall 1',
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mocks
        apiClient.get.mockImplementation((url) => {
            if (url === '/v1/movies/1') return Promise.resolve({ data: { data: mockMovie } });
            return Promise.reject(new Error('Not Found'));
        });

        useScreenings.mockReturnValue({
            data: mockScreenings,
            isLoading: false,
            error: null
        });
    });

    it('renders movie details correctly', async () => {
        render(
            <MemoryRouter initialEntries={['/movies/1']}>
                <Routes>
                    <Route path="/movies/:id" element={<MovieDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for loading to finish and content to appear
        await waitFor(() => {
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent(/Avengers/i);
        }, { timeout: 3000 });

        expect(screen.getByText('Russo Brothers')).toBeInTheDocument();
        expect(screen.getByText(/181\s*phút/i)).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('displays 404 when movie not found', async () => {
        apiClient.get.mockImplementation((url) => {
            return Promise.reject({ response: { status: 404 } });
        });

        useScreenings.mockReturnValue({ data: [], isLoading: false });

        render(
            <MemoryRouter initialEntries={['/movies/999']}>
                <Routes>
                    <Route path="/movies/:id" element={<MovieDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Không tìm thấy phim')).toBeInTheDocument();
        });
    });

    it('displays available screenings', async () => {
        render(
            <MemoryRouter initialEntries={['/movies/1']}>
                <Routes>
                    <Route path="/movies/:id" element={<MovieDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Suất chiếu')).toBeInTheDocument();
        });

        expect(screen.getByText('2D')).toBeInTheDocument();
    });
});
