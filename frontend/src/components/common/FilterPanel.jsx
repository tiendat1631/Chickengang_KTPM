import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
    minRating: '',
    language: '',
    sortBy: 'popularity'
  });

  const genres = [
    { value: '', label: 'Tất cả thể loại' },
    { value: 'action', label: 'Hành động' },
    { value: 'comedy', label: 'Hài' },
    { value: 'drama', label: 'Chính kịch' },
    { value: 'horror', label: 'Kinh dị' },
    { value: 'sci-fi', label: 'Khoa học viễn tưởng' },
    { value: 'romance', label: 'Lãng mạn' },
    { value: 'thriller', label: 'Ly kỳ' },
    { value: 'animation', label: 'Hoạt hình' }
  ];

  const languages = [
    { value: '', label: 'Tất cả ngôn ngữ' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'Tiếng Anh' },
    { value: 'ko', label: 'Tiếng Hàn' },
    { value: 'ja', label: 'Tiếng Nhật' },
    { value: 'zh', label: 'Tiếng Trung' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Phổ biến' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'releaseDate', label: 'Ngày phát hành' },
    { value: 'title', label: 'Tên phim' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 36 }, (_, i) => currentYear - i);

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
      minRating: '',
      language: '',
      sortBy: 'popularity'
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
            Thể loại
          </label>
          <select
            id="genre-filter"
            className="filter-group__select"
            value={localFilters.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            {genres.map(genre => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range Filter */}
        <div className="filter-group">
          <label className="filter-group__label">Năm phát hành</label>
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

        {/* Rating Filter */}
        <div className="filter-group">
          <label htmlFor="rating-filter" className="filter-group__label">
            Đánh giá tối thiểu
          </label>
          <select
            id="rating-filter"
            className="filter-group__select"
            value={localFilters.minRating}
            onChange={(e) => handleChange('minRating', e.target.value)}
          >
            <option value="">Tất cả</option>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>
                {rating}+ ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <label htmlFor="language-filter" className="filter-group__label">
            Ngôn ngữ
          </label>
          <select
            id="language-filter"
            className="filter-group__select"
            value={localFilters.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-group__label">
            Sắp xếp theo
          </label>
          <select
            id="sort-filter"
            className="filter-group__select"
            value={localFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
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

