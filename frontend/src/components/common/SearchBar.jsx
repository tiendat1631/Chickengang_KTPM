import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import FilterPanel from './FilterPanel';

/**
 * SearchBar component with advanced filtering
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback when search is submitted
 * @param {boolean} props.isMobile - Whether on mobile device
 * @returns {React.ReactElement}
 */
const SearchBar = ({ onSearch, isMobile = false }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    yearFrom: '',
    yearTo: '',
    status: '',
    sort: 'releaseDate,DESC'
  });
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery.trim(), filters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onSearch]);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFilters]);

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilters]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) {
        onSearch(searchQuery.trim(), filters);
      }
    }
  }, [searchQuery, filters, navigate, onSearch]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const hasActiveFilters = Object.values(filters).some(v => 
    v !== '' && v !== 'releaseDate,DESC'
  );

  return (
    <form 
      className={`search-bar ${isMobile ? 'search-bar--mobile' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className="search-bar__wrapper">
        <input
          ref={searchRef}
          type="text"
          className="search-bar__input"
          placeholder="Tìm kiếm phim... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Tìm kiếm phim"
        />
        
        <button 
          type="submit" 
          className="search-bar__button search-bar__button--search"
          aria-label="Tìm kiếm"
        >
          🔍
        </button>

        <div className="search-bar__divider"></div>

        <button
          type="button"
          className={`search-bar__button search-bar__button--filter ${hasActiveFilters ? 'search-bar__button--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Bộ lọc tìm kiếm"
          aria-expanded={showFilters}
        >
          <span className="search-bar__filter-icon">⚙️</span>
          {hasActiveFilters && <span className="search-bar__filter-badge"></span>}
        </button>
      </div>

      {showFilters && (
        <div ref={filterRef} className="search-bar__filters">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
            isMobile={isMobile}
          />
        </div>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  isMobile: PropTypes.bool
};

export default SearchBar;

