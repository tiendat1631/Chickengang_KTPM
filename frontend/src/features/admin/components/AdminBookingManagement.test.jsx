import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminBookingManagement from './AdminBookingManagement';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';

// Mock Dependencies
vi.mock('@/features/auth/hooks/useAuth.js');
vi.mock('@/services/api.js');
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn()
    }
}));
vi.mock('./AdminBookingManagement.css', () => ({}));

describe('AdminBookingManagement', () => {
    const mockAdminUser = {
        id: 1,
        username: 'admin',
        role: 'ADMIN'
    };

    const mockBookings = [
        {
            id: 1,
            bookingCode: 'BK-20251220-001',
            username: 'customer1',
            screeningId: 101,
            totalPrice: 270000,
            bookingStatus: 'PENDING',
            createOn: '2025-12-20T10:00:00'
        },
        {
            id: 2,
            bookingCode: 'BK-20251220-002',
            username: 'customer2',
            screeningId: 102,
            totalPrice: 150000,
            bookingStatus: 'CONFIRMED',
            createOn: '2025-12-20T11:00:00'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ user: mockAdminUser });
        apiClient.get.mockResolvedValue({
            data: {
                data: mockBookings
            }
        });
    });

    it('renders booking management page for admin users', async () => {
        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Quản lý đặt vé/)).toBeInTheDocument();
        });

        // Check table headers
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Mã đặt vé')).toBeInTheDocument();
        expect(screen.getByText('Người dùng')).toBeInTheDocument();
    });

    it('shows access denied for non-admin users', async () => {
        useAuth.mockReturnValue({ user: { id: 2, username: 'customer', role: 'CUSTOMER' } });

        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        expect(screen.getByText(/Không có quyền truy cập/)).toBeInTheDocument();
        expect(screen.getByText(/Về trang chủ/)).toBeInTheDocument();
    });

    it('displays bookings list from API', async () => {
        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('BK-20251220-001')).toBeInTheDocument();
        });

        expect(screen.getByText('customer1')).toBeInTheDocument();
        expect(screen.getByText('customer2')).toBeInTheDocument();
        expect(screen.getByText('BK-20251220-002')).toBeInTheDocument();
    });

    it('shows empty state when no bookings found', async () => {
        apiClient.get.mockResolvedValue({
            data: { data: [] }
        });

        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Không tìm thấy đặt vé nào/)).toBeInTheDocument();
        });
    });

    it('opens booking details modal when clicking details button', async () => {
        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('BK-20251220-001')).toBeInTheDocument();
        });

        // Click details button for first booking
        const detailButtons = screen.getAllByText('Chi tiết');
        fireEvent.click(detailButtons[0]);

        // Modal should open
        await waitFor(() => {
            expect(screen.getByText('Chi tiết đặt vé')).toBeInTheDocument();
        });
    });

    it('allows filtering by search query', async () => {
        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Mã đặt vé/)).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Mã đặt vé/);
        fireEvent.change(searchInput, { target: { value: 'BK-001' } });

        expect(searchInput.value).toBe('BK-001');
    });

    it('allows filtering by status', async () => {
        render(
            <MemoryRouter>
                <AdminBookingManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Tất cả trạng thái/)).toBeInTheDocument();
        });

        const statusSelect = screen.getByRole('combobox');
        fireEvent.change(statusSelect, { target: { value: 'PENDING' } });

        expect(statusSelect.value).toBe('PENDING');
    });
});
