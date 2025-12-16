import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SearchResultsPage from './SearchResultsPage';
import { useSearchMovies } from '@/features/movies/hooks/useMovies';

// Mock child components
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

vi.mock('@/features/movies/components/MovieCard', () => ({
    default: ({ movie, onClick }) => (
        <div data-testid="movie-card" onClick={onClick}>
            {movie.title}
        </div>
    )
}));

vi.mock('@/components/common/Pagination', () => ({
    default: ({ onPageChange, totalPages }) => (
        <div data-testid="pagination">
            <button onClick={() => onPageChange(1)}>Next Page</button>
            <span>Total Pages: {totalPages}</span>
        </div>
    )
}));

// Mock the hook
vi.mock('@/features/movies/hooks/useMovies', () => ({
    useSearchMovies: vi.fn()
}));

const mockNavigate = vi.fn();
let mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn((params) => {
    mockSearchParams = params;
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [mockSearchParams, mockSetSearchParams],
    };
});

describe('SearchResultsPage', () => {
    const mockMoviesData = {
        content: [
            { id: 1, title: 'Avengers 1' },
            { id: 2, title: 'Avengers 2' }
        ],
        totalElements: 2,
        totalPages: 1,
        currentPage: 0,
        pageSize: 20
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams = new URLSearchParams();
    });

    it('renders search results when data is loaded', () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: mockMoviesData,
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Kết quả tìm kiếm cho: "Avengers"')).toBeInTheDocument();
        expect(screen.getByText('Tìm thấy 2 kết quả')).toBeInTheDocument();
        const cards = screen.getAllByTestId('movie-card');
        expect(cards).toHaveLength(2);
    });

    it('shows loading state', () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: null,
            isLoading: true,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Đang tìm kiếm...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Network Error' }
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Có lỗi xảy ra khi tìm kiếm')).toBeInTheDocument();
    });

    it('shows no results message when list is empty (TC-SEARCH-006)', () => {
        mockSearchParams.set('q', 'XYZ123');
        useSearchMovies.mockReturnValue({
            data: { content: [], totalElements: 0, totalPages: 0 },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Không tìm thấy phim nào phù hợp với từ khóa "XYZ123"')).toBeInTheDocument();
    });

    it('renders pagination when totalPages > 1', () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: { ...mockMoviesData, totalPages: 5 },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('updates URL when page changes', async () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: { ...mockMoviesData, totalPages: 5, currentPage: 0 },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Next Page'));

        await waitFor(() => {
            expect(mockSetSearchParams).toHaveBeenCalled();
        });

        const paramsPassed = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1][0];
        expect(paramsPassed.get('page')).toBe('1');
    });

    it('navigates to movie detail on click', () => {
        mockSearchParams.set('q', 'Avengers');
        useSearchMovies.mockReturnValue({
            data: mockMoviesData,
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        fireEvent.click(screen.getAllByTestId('movie-card')[0]);
        expect(mockNavigate).toHaveBeenCalledWith('/movies/1');
    });

    it('handles special characters in search query (Test Case #8)', () => {
        const specialQuery = "Avenger's & <More>";
        mockSearchParams.set('q', specialQuery);
        useSearchMovies.mockReturnValue({
            data: { content: [], totalElements: 0 },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText(`Kết quả tìm kiếm cho: "${specialQuery}"`)).toBeInTheDocument();
    });

    it('safely renders XSS payloads in movie titles (Test Case #10)', () => {
        mockSearchParams.set('q', 'XSS');
        const xssTitle = "<script>alert('XSS')</script>";
        useSearchMovies.mockReturnValue({
            data: {
                content: [{ id: 1, title: xssTitle }],
                totalElements: 1,
                totalPages: 1
            },
            isLoading: false,
            error: null
        });

        render(
            <BrowserRouter>
                <SearchResultsPage />
            </BrowserRouter>
        );

        expect(screen.getByText(xssTitle)).toBeInTheDocument();
    });
});
