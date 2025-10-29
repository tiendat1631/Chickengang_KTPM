import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FilterPanel.css';

/**
 * FilterPanel component for advanced movie search filters
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onClose - Callback to close panel
 * @param {boolean} props.isMobile - Whether on mobile device
 * @returns {React.ReactElement}
 */
const FilterPanel = ({ filters, onFilterChange, onClose, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    genre: '',
    yearFrom: '',
    yearTo: '',
    status: '',
    sort: 'releaseDate,DESC'
  });

  const genres = [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller'
  ];

  const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'title,ASC', label: 'Tên (A-Z)' },
    { value: 'title,DESC', label: 'Tên (Z-A)' },
    { value: 'releaseDate,DESC', label: 'Mới nhất' },
    { value: 'releaseDate,ASC', label: 'Cũ nhất' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleClear = () => {
    const clearedFilters = {
      genre: '',
      yearFrom: '',
      yearTo: '',
      status: '',
      sort: 'releaseDate,DESC'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className={`filter-panel ${isMobile ? 'filter-panel--mobile' : ''}`}>
      {isMobile && (
        <div className="filter-panel__header">
          <h3 className="filter-panel__title">Bộ lọc tìm kiếm</h3>
          <button 
            className="filter-panel__close"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
          >
            ✕
          </button>
        </div>
      )}

      <div className="filter-panel__content">
        {/* Genre Filter */}
        <div className="filter-group">
          <label htmlFor="genre-filter" className="filter-group__label">
            🎭 Thể loại
          </label>
          <select
            id="genre-filter"
            className="filter-group__select"
            value={localFilters.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            <option value="">Tất cả thể loại</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range Filter */}
        <div className="filter-group">
          <label className="filter-group__label">📅 Năm phát hành</label>
          <div className="filter-group__row">
            <select
              className="filter-group__select filter-group__select--half"
              value={localFilters.yearFrom}
              onChange={(e) => handleChange('yearFrom', e.target.value)}
            >
              <option value="">Từ năm</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              className="filter-group__select filter-group__select--half"
              value={localFilters.yearTo}
              onChange={(e) => handleChange('yearTo', e.target.value)}
            >
              <option value="">Đến năm</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-group__label">
            🎬 Trạng thái
          </label>
          <select
            id="status-filter"
            className="filter-group__select"
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="NOW_SHOWING">🔥 Đang chiếu</option>
            <option value="COMING_SOON">⭐ Sắp chiếu</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-group__label">
            ⚡ Sắp xếp theo
          </label>
          <select
            id="sort-filter"
            className="filter-group__select"
            value={localFilters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-panel__actions">
        <button 
          className="filter-panel__btn filter-panel__btn--clear"
          onClick={handleClear}
        >
          Xóa bộ lọc
        </button>
        <button 
          className="filter-panel__btn filter-panel__btn--apply"
          onClick={handleApply}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  isMobile: PropTypes.bool
};

export default FilterPanel;

