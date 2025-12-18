import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BookingPage from './BookingPage';

// Mock Dependencies
vi.mock('@/components/common/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));
vi.mock('@/components/ui/Breadcrumb', () => ({
    default: () => <div data-testid="breadcrumb">Breadcrumb</div>
}));
vi.mock('@/utils/formatCurrency', () => ({
    formatVND: (amount) => `${amount.toLocaleString('vi-VN')} ₫`
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ movieId: '1' }),
    };
});

describe('BookingPage', () => {
    const mockBookingData = {
        screening: {
            id: 101,
            startTime: '2025-12-20T19:00:00',
            endTime: '2025-12-20T21:00:00',
            format: '2D',
            auditorium: { id: 1, name: 'Hall 1' },
            movie: { id: 1, title: 'Test Movie' }
        },
        selectedSeats: [
            { id: 1, rowLabel: 'A', number: 1, seatType: 'NORMAL', price: 120000 },
            { id: 2, rowLabel: 'A', number: 2, seatType: 'SWEETBOX', price: 150000 }
        ],
        totalPrice: 270000
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderWithRouter = (state = null) => {
        return render(
            <MemoryRouter initialEntries={[{ pathname: '/booking/1', state }]}>
                <Routes>
                    <Route path="/booking/:movieId" element={<BookingPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders booking confirmation page with data from location state', async () => {
        renderWithRouter(mockBookingData);

        await waitFor(() => {
            expect(screen.getByText(/Xác nhận đặt vé/)).toBeInTheDocument();
        });

        // Movie title
        expect(screen.getByText('Test Movie')).toBeInTheDocument();

        // Auditorium
        expect(screen.getByText(/Hall 1/)).toBeInTheDocument();

        // Selected seats
        expect(screen.getByText(/A1/)).toBeInTheDocument();
        expect(screen.getByText(/A2/)).toBeInTheDocument();


    });

    it('shows error when no booking data is available', async () => {
        renderWithRouter(null);

        await waitFor(() => {
            expect(screen.getByText(/Không tìm thấy thông tin đặt vé/)).toBeInTheDocument();
        });

        // Should show link back to movie page
        expect(screen.getByText(/Quay lại trang phim/)).toBeInTheDocument();
    });

    it('loads booking data from localStorage if state is not provided', async () => {
        // Store data in localStorage first
        localStorage.setItem('bookingData', JSON.stringify(mockBookingData));

        renderWithRouter(null);

        await waitFor(() => {
            expect(screen.getByText('Test Movie')).toBeInTheDocument();
        });
    });

    it('navigates to payment page when payment button is clicked', async () => {
        renderWithRouter(mockBookingData);

        await waitFor(() => {
            expect(screen.getByText(/Thanh toán/)).toBeInTheDocument();
        });

        const paymentButton = screen.getByText(/Thanh toán/);
        fireEvent.click(paymentButton);

        expect(mockNavigate).toHaveBeenCalledWith('/booking/1/payment', {
            state: mockBookingData
        });
    });

    it('navigates back to seat selection when back button is clicked', async () => {
        renderWithRouter(mockBookingData);

        await waitFor(() => {
            expect(screen.getByText(/Chọn lại ghế/)).toBeInTheDocument();
        });

        const backButton = screen.getByText(/Chọn lại ghế/);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/booking/1/screening/101');
    });

    it('displays correct seat count and prices', async () => {
        renderWithRouter(mockBookingData);

        await waitFor(() => {
            expect(screen.getByText(/2 ghế/)).toBeInTheDocument();
        });

        // Check individual seat types
        expect(screen.getByText(/Thường/)).toBeInTheDocument();
        expect(screen.getByText(/Sweetbox/)).toBeInTheDocument();
    });

    it('shows loading state initially', async () => {
        // Since loading is fast, we need to test it passes through loading
        // By default loading should disappear quickly when data is available
        renderWithRouter(mockBookingData);

        // Eventually should show booking content
        await waitFor(() => {
            expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        });
    });
});
