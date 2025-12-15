import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import FilterPanel from './FilterPanel';

describe('FilterPanel', () => {
    const mockOnFilterChange = vi.fn();
    const mockOnClose = vi.fn();
    const defaultFilters = {
        genre: '',
        yearFrom: '',
        yearTo: '',
        status: '',
        sort: 'releaseDate,DESC'
    };

    it('renders all filter options correctly', () => {
        render(
            <FilterPanel
                filters={defaultFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        // Check if labels exist
        expect(screen.getByText('🎭 Thể loại')).toBeInTheDocument();
        expect(screen.getByText('📅 Năm phát hành')).toBeInTheDocument();
        expect(screen.getByText('🎬 Trạng thái')).toBeInTheDocument();
        expect(screen.getByText('⚡ Sắp xếp theo')).toBeInTheDocument();

        // Check buttons
        expect(screen.getByText('Xóa bộ lọc')).toBeInTheDocument();
        expect(screen.getByText('Áp dụng')).toBeInTheDocument();
    });

    it('updates genre selection', () => {
        render(
            <FilterPanel
                filters={defaultFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        const genreSelect = screen.getByLabelText('🎭 Thể loại');
        fireEvent.change(genreSelect, { target: { value: 'Action' } });

        // Click apply to trigger change
        fireEvent.click(screen.getByText('Áp dụng'));

        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            genre: 'Action'
        }));
    });

    it('updates year range selection', () => {
        render(
            <FilterPanel
                filters={defaultFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        const yearFromSelect = screen.getByText('Từ năm').closest('select');
        const yearToSelect = screen.getByText('Đến năm').closest('select');

        fireEvent.change(yearFromSelect, { target: { value: '2020' } });
        fireEvent.change(yearToSelect, { target: { value: '2023' } });

        fireEvent.click(screen.getByText('Áp dụng'));

        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            yearFrom: '2020',
            yearTo: '2023'
        }));
    });

    it('updates status selection', () => {
        render(
            <FilterPanel
                filters={defaultFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        const statusSelect = screen.getByLabelText('🎬 Trạng thái');
        fireEvent.change(statusSelect, { target: { value: 'NOW_SHOWING' } });

        fireEvent.click(screen.getByText('Áp dụng'));

        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            status: 'NOW_SHOWING'
        }));
    });

    it('updates sort selection', () => {
        render(
            <FilterPanel
                filters={defaultFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        const sortSelect = screen.getByLabelText('⚡ Sắp xếp theo');
        fireEvent.change(sortSelect, { target: { value: 'title,ASC' } });

        fireEvent.click(screen.getByText('Áp dụng'));

        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            sort: 'title,ASC'
        }));
    });

    it('clears filters when clear button is clicked', () => {
        const dirtyFilters = {
            genre: 'Action',
            yearFrom: '2020',
            yearTo: '2023',
            status: 'NOW_SHOWING',
            sort: 'title,ASC'
        };

        render(
            <FilterPanel
                filters={dirtyFilters}
                onFilterChange={mockOnFilterChange}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Xóa bộ lọc'));

        expect(mockOnFilterChange).toHaveBeenCalledWith({
            genre: '',
            yearFrom: '',
            yearTo: '',
            status: '',
            sort: 'releaseDate,DESC'
        });
    });
});
