import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SeatSelectionPage from './SeatSelectionPage';
import { useScreening, useSeats } from '@/hooks/useScreenings';

// Mock Dependencies
vi.mock('@/hooks/useScreenings');
vi.mock('@/components/common/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));
vi.mock('@/components/ui/Breadcrumb', () => ({
    default: () => <div data-testid="breadcrumb">Breadcrumb</div>
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ movieId: '1', screeningId: '101' }),
    };
});

describe('SeatSelectionPage', () => {
    const mockScreening = {
        id: 101,
        startTime: '2025-12-20T19:00:00',
        endTime: '2025-12-20T21:00:00',
        format: 'TwoD',
        auditoriumId: 1,
        auditoriumName: 'Hall 1',
        movieId: 1,
        movieTitle: 'Test Movie'
    };

    const mockSeats = [
        { id: 1, rowLabel: 'A', number: 1, seatType: 'NORMAL', status: 'AVAILABLE' },
        { id: 2, rowLabel: 'A', number: 2, seatType: 'NORMAL', status: 'BOOKED' },
        { id: 4, rowLabel: 'B', number: 1, seatType: 'SWEETBOX', status: 'AVAILABLE' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        useScreening.mockReturnValue({
            data: mockScreening,
            isLoading: false,
            error: null
        });
        useSeats.mockReturnValue({
            data: mockSeats,
            isLoading: false,
            error: null
        });
    });

    it('selects and deselects seats correctly', async () => {
        render(
            <MemoryRouter>
                <SeatSelectionPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByTitle(/A1/));
        const seatA1 = screen.getByTitle(/A1/);

        // Select
        fireEvent.click(seatA1);
        expect(seatA1).toHaveClass('selected');

        // Check price (120k for NORMAL)
        expect(screen.getAllByText(/120\.000/)[0]).toBeInTheDocument();

        // Deselect
        fireEvent.click(seatA1);
        expect(seatA1).not.toHaveClass('selected');
        expect(screen.getAllByText(/0\s*₫/)[0]).toBeInTheDocument();
    });

    it('prevents selecting booked seats and shows 0 price', async () => {
        render(
            <MemoryRouter>
                <SeatSelectionPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByTitle(/A2/));
        const seatA2 = screen.getByTitle(/A2/); // Booked seat

        // Check it has booked class and is disabled
        expect(seatA2).toHaveClass('booked');
        expect(seatA2).toBeDisabled();

        // Try clicking
        fireEvent.click(seatA2);

        // Should NOT be selected
        expect(seatA2).not.toHaveClass('selected');
        expect(screen.getAllByText(/0\s*₫/)[0]).toBeInTheDocument();
    });

    it('calculates total price for mixed seat types', async () => {
        render(
            <MemoryRouter>
                <SeatSelectionPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByTitle(/A1/));
        const seatA1 = screen.getByTitle(/A1/); // Normal (120k)
        const seatB1 = screen.getByTitle(/B1/); // Sweetbox (150k)

        fireEvent.click(seatA1);
        fireEvent.click(seatB1);

        // Total 270k
        expect(screen.getAllByText(/270\.000/)[0]).toBeInTheDocument();
    });

    it('prevents selecting more than 10 seats (Requirement #32)', async () => {
        // Create mock data with 12 available seats
        const manySeats = [];
        for (let i = 1; i <= 12; i++) {
            manySeats.push({
                id: i,
                rowLabel: String.fromCharCode(65 + Math.floor((i - 1) / 4)), // A, A, A, A, B, B, B, B, C, C, C, C
                number: ((i - 1) % 4) + 1,
                seatType: 'NORMAL',
                status: 'AVAILABLE'
            });
        }

        useSeats.mockReturnValue({
            data: manySeats,
            isLoading: false,
            error: null
        });

        // Mock window.alert
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(
            <MemoryRouter>
                <SeatSelectionPage />
            </MemoryRouter>
        );

        // Wait for seats to render
        await waitFor(() => screen.getAllByRole('button', { name: /[0-9]+/ }));
        const allSeats = screen.getAllByRole('button', { name: /[0-9]+/ });

        // Select 10 seats (should succeed)
        for (let i = 0; i < 10; i++) {
            fireEvent.click(allSeats[i]);
        }

        // Try to select 11th seat (should fail)
        fireEvent.click(allSeats[10]);

        // Alert should be called
        expect(alertMock).toHaveBeenCalledWith('Bạn chỉ có thể chọn tối đa 10 ghế');

        alertMock.mockRestore();
    });
});
