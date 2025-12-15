import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import MovieCard from '@/components/common/MovieCard';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('MovieCard', () => {
    const mockMovie = {
        id: 1,
        title: 'Avengers: Endgame',
        director: 'Russo Brothers',
        actors: 'Robert Downey Jr.',
        genres: 'Action, Sci-Fi',
        releaseDate: '2019-04-26',
        duration: '181 min',
        language: 'English',
        rated: 'P',
        description: 'Epic conclusion',
        posterUrl: 'http://example.com/poster.jpg'
    };

    it('renders movie information correctly', () => {
        render(
            <BrowserRouter>
                <MovieCard movie={mockMovie} />
            </BrowserRouter>
        );

        expect(screen.getByText('Avengers: Endgame')).toBeInTheDocument();
        expect(screen.getByText('181 min')).toBeInTheDocument();
        // Genres joined by comma
        expect(screen.getByText('Action, Sci-Fi')).toBeInTheDocument();
        // Date formatting check (approximate or mock function if needed, but here checking presence)
        // 2019-04-26 -> 26 tháng 4, 2019 (depending on locale)
    });

    it('navigates to details on card click', () => {
        const handleClick = vi.fn();
        render(
            <BrowserRouter>
                <MovieCard movie={mockMovie} onClick={handleClick} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Avengers: Endgame').closest('.movie-card'));
        expect(handleClick).toHaveBeenCalledWith(mockMovie);
    });

    it('navigates to screenings on buy ticket click', () => {
        render(
            <BrowserRouter>
                <MovieCard movie={mockMovie} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('MUA VÉ'));
        expect(mockNavigate).toHaveBeenCalledWith('/movies/1/screenings');
    });

    it('renders rank tag when provided', () => {
        render(
            <BrowserRouter>
                <MovieCard movie={mockMovie} rankTag="No.1" />
            </BrowserRouter>
        );

        expect(screen.getByText('No.1')).toBeInTheDocument();
    });
});
