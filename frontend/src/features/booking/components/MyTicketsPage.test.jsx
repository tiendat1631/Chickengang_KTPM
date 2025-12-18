import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MyTicketsPage from './MyTicketsPage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import apiClient from '@/services/api';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Dependencies
vi.mock('@/features/auth/hooks/useAuth');
vi.mock('@/services/api');
vi.mock('@/components/common/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));
vi.mock('@/components/ui/Breadcrumb', () => ({
    default: () => <div data-testid="breadcrumb">Breadcrumb</div>
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithQuery = (component) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    );
};

describe('MyTicketsPage', () => {
    const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
    };

    const mockBookings = [
        {
            id: 101,
            bookingCode: 'BK-001',
            totalPrice: 150000,
            bookingStatus: 'PENDING',
            createOn: '2025-12-20T10:00:00',
            screening: {
                movie: { title: 'Test Movie A' },
                startTime: '2025-12-20T19:00:00',
                auditorium: { name: 'Hall 1' }
            },
            tickets: [
                { id: 1, ticketCode: 'TICKET-1-A1', seat: { rowLabel: 'A', number: 1 } }
            ]
        },
        {
            id: 102,
            bookingCode: 'BK-002',
            totalPrice: 200000,
            bookingStatus: 'PAID',
            createOn: '2025-12-21T10:00:00',
            screening: {
                movie: { title: 'Test Movie B' },
                startTime: '2025-12-21T20:00:00',
                auditorium: { name: 'Hall 2' }
            },
            tickets: []
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        useAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });
    });

    it('renders loading state initially', () => {
        // Mock infinite loading to test loading state
        apiClient.get.mockReturnValue(new Promise(() => { }));

        renderWithQuery(
            <MemoryRouter>
                <MyTicketsPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Đang tải vé của bạn...')).toBeInTheDocument();
    });

    it('renders empty state when no bookings found', async () => {
        apiClient.get.mockResolvedValue({ data: { data: [] } });

        renderWithQuery(
            <MemoryRouter>
                <MyTicketsPage />
            </MemoryRouter>
        );

        // Wait for loading to finish
        await waitForElementToBeRemoved(() => screen.queryByText('Đang tải vé của bạn...'));

        expect(screen.getByText('Chưa có vé nào')).toBeInTheDocument();
        expect(screen.getByText('Khám phá phim')).toBeInTheDocument();
    });

    it('renders list of user bookings', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockBookings } });
        // Mock payment details for the first booking (selected by default)
        apiClient.get.mockImplementation((url) => {
            if (url.includes('/payments/booking/101')) {
                return Promise.resolve({ data: { data: { paymentMethod: 'BANK_TRANSFER', status: 'PENDING', amount: 150000 } } });
            }
            return Promise.resolve({ data: { data: mockBookings } });
        });

        renderWithQuery(
            <MemoryRouter>
                <MyTicketsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText(/Danh sách đặt chỗ/i)[0]).toBeInTheDocument();
        });

        expect(screen.getAllByText('Test Movie A').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Test Movie B').length).toBeGreaterThan(0);
        expect(screen.getAllByText('BK-001').length).toBeGreaterThan(0);
        expect(screen.getAllByText('BK-002').length).toBeGreaterThan(0);
    });

    it('displays detailed view of selected booking', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockBookings } });
        // Mock payment call
        apiClient.get.mockImplementation((url) => {
            if (url.includes('/payments/booking/')) {
                return Promise.resolve({ data: { data: { paymentMethod: 'BANK_TRANSFER', status: 'PENDING', amount: 150000 } } });
            }
            return Promise.resolve({ data: { data: mockBookings } });
        });

        renderWithQuery(
            <MemoryRouter>
                <MyTicketsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Chi tiết vé/)).toBeInTheDocument();
        });

        // By default, first booking is selected
        expect(screen.getAllByText('BK-001').length).toBeGreaterThan(0);
        expect(screen.getByText('TICKET-1-A1')).toBeInTheDocument();
    });
});
