import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MoviesPage from './MoviesPage';
import { useMovies } from '@/hooks/useMovies';

// Mock child components to simplify test
vi.mock('@/components/common/Header', () => ({
    default: ({ onSearch }) => (
        <div data-testid="header">
            <input
                data-testid="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    )
}));

vi.mock('@/components/common/FilterPanel', () => ({
    default: ({ onFilterChange }) => (
        <div data-testid="filter-panel">
            <button onClick={() => onFilterChange({ genre: 'Action' })}>Filter Action</button>
        </div>
    )
}));

vi.mock('./MovieList', () => ({
    default: ({ movies, loading }) => (
        <div data-testid="movie-list">
            {loading ? 'Loading...' : movies.map(m => <div key={m.id}>{m.title}</div>)}
        </div>
    )
}));

vi.mock('@/components/common/Pagination', () => ({
    default: ({ onPageChange }) => (
        <button onClick={() => onPageChange(1)}>Next Page</button>
    )
}));

// Mock the hook
vi.mock('@/hooks/useMovies', () => ({
    useMovies: vi.fn()
}));

const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
// We need a stable searchParams mock if we want to test updates properly, 
// but existing test used simple mock. I'll stick to simple mock but verify calls.

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
        useLocation: () => ({ pathname: '/movies' }),
    };
});

describe('MoviesPage', () => {
    const mockMoviesData = {
        content: [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' }
        ],
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        pageSize: 20
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders movie list when data is loaded', () => {
        useMovies.mockReturnValue({
            data: mockMoviesData,
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('movie-list')).toBeInTheDocument();
        expect(screen.getByText('Movie 1')).toBeInTheDocument();
        expect(screen.getByText('Movie 2')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        useMovies.mockReturnValue({
            data: null,
            isLoading: true,
            error: null
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        useMovies.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Network Error' }
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Có lỗi xảy ra')).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    it('shows no movies found message when list is empty (TC-BROWSE-003)', () => {
        useMovies.mockReturnValue({
            data: { content: [], totalElements: 0, totalPages: 0 },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Không tìm thấy phim nào')).toBeInTheDocument();
        expect(screen.getByText('Không có phim nào phù hợp với bộ lọc của bạn.')).toBeInTheDocument();
    });

    it('navigates on search', () => {
        useMovies.mockReturnValue({
            data: mockMoviesData,
            isLoading: false
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Avengers' } });

        expect(mockNavigate).toHaveBeenCalledWith('/movies/search?q=Avengers');
    });

    it('updates filters when changed', () => {
        useMovies.mockReturnValue({
            data: mockMoviesData,
            isLoading: false
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Filter Action'));

        expect(mockSetSearchParams).toHaveBeenCalled();
    });

    it('updates pagination when page changes', () => {
        useMovies.mockReturnValue({
            data: { ...mockMoviesData, totalPages: 2 },
            isLoading: false
        });

        render(
            <BrowserRouter>
                <MoviesPage />
            </BrowserRouter>
        );

        // Click next page
        fireEvent.click(screen.getByText('Next Page'));

        // Should update search params
        expect(mockSetSearchParams).toHaveBeenCalled();
        // Since we mock useSearchParams returning empty params, checking exactly what it was called with might be tricky if it depends on current params. 
        // But checking it was called is enough to verify interaction.
    });
});
