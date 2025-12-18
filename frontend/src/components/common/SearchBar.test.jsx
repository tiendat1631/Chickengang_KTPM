import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockOnSearch = vi.fn();

// Mock FilterPanel since it's used in SearchBar
vi.mock('./FilterPanel', () => ({
    default: () => <div data-testid="filter-panel">FilterPanel</div>
}));

describe('SearchBar', () => {
    // Reset all mocks before each test to avoid state leaking between tests
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with correct placeholder (Test Case #23)', () => {
        render(<SearchBar onSearch={mockOnSearch} />, { wrapper: MemoryRouter });
        expect(screen.getByPlaceholderText('Tìm kiếm phim... (Ctrl+K)')).toBeInTheDocument();
    });

    it('navigates on valid search input', () => {
        render(<SearchBar onSearch={mockOnSearch} />, { wrapper: MemoryRouter });
        const input = screen.getByPlaceholderText('Tìm kiếm phim... (Ctrl+K)');
        fireEvent.change(input, { target: { value: 'Avengers' } });
        fireEvent.submit(input);
        expect(mockNavigate).toHaveBeenCalledWith('/movies/search?q=Avengers');
        expect(mockOnSearch).toHaveBeenCalledWith('Avengers', expect.anything());
    });

    it('does not search/navigate with empty input (Test Case #7)', () => {
        render(<SearchBar onSearch={mockOnSearch} />, { wrapper: MemoryRouter });
        const input = screen.getByPlaceholderText('Tìm kiếm phim... (Ctrl+K)');
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.submit(input);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
