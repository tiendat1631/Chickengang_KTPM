import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useMovies } from '@/features/movies/hooks/useMovies'
import Header from '@/components/common/Header'
import FilterPanel from '@/components/common/FilterPanel'
import MovieList from './MovieList.jsx'
import Pagination from '@/components/common/Pagination.jsx'
import './MoviesPage.css'

export default function MoviesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState(() => {
    // Load from localStorage or default to 'grid'
    return localStorage.getItem('movieListViewMode') || 'grid'
  })
  
  // Get initial values from URL
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0)
  const [pageSize, setPageSize] = useState(Number(searchParams.get('size')) || 20)
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || '',
    yearFrom: searchParams.get('yearFrom') || '',
    yearTo: searchParams.get('yearTo') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'releaseDate,DESC',
  })

  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovies(currentPage, pageSize, filters.sort, {
    genre: filters.genre || undefined,
    yearFrom: filters.yearFrom ? Number(filters.yearFrom) : undefined,
    yearTo: filters.yearTo ? Number(filters.yearTo) : undefined,
    status: filters.status || undefined,
  })

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Update URL when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 0) params.set('page', currentPage.toString())
    if (pageSize !== 20) params.set('size', pageSize.toString())
    if (filters.genre) params.set('genre', filters.genre)
    if (filters.yearFrom) params.set('yearFrom', filters.yearFrom.toString())
    if (filters.yearTo) params.set('yearTo', filters.yearTo.toString())
    if (filters.status) params.set('status', filters.status)
    if (filters.sort && filters.sort !== 'releaseDate,DESC') params.set('sort', filters.sort)
    
    setSearchParams(params)
  }, [currentPage, pageSize, filters, setSearchParams])

  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      navigate(`/movies/search?q=${encodeURIComponent(query)}`)
    }
  }, [navigate])

  const handleMovieClick = useCallback((movie) => {
    if (movie.id && movie.id > 0) {
      navigate(`/movies/${movie.id}`)
    } else {
      console.error('Invalid movie ID:', movie.id)
    }
  }, [navigate])

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize)
    setCurrentPage(0)
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setCurrentPage(0)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({
      genre: '',
      yearFrom: '',
      yearTo: '',
      status: '',
      sort: 'releaseDate,DESC',
    })
    setCurrentPage(0)
  }, [])

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev)
  }, [])

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode)
    localStorage.setItem('movieListViewMode', mode)
  }, [])

  // Count active filters
  const activeFiltersCount = useMemo(() => [
    filters.genre,
    filters.yearFrom,
    filters.yearTo,
    filters.status,
  ].filter(Boolean).length, [filters])

  return (
    <div className="movies-page">
      <Header onSearch={handleSearch} />
      
      <main className="movies-main">
        <div className="container">
          <div className="movies-header">
            <div className="movies-header-content">
              <h1 className="movies-title">Danh Sách Phim</h1>
              <p className="movies-subtitle">
                Khám phá và đặt vé cho các bộ phim đang chiếu và sắp ra mắt
              </p>
            </div>
            
            <div className="movies-header-actions">
              {/* View Mode Toggle */}
              <div className="view-toggle-group">
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => handleViewModeChange('grid')}
                  aria-label="Grid view"
                  title="Lưới"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M1 1h8v8H1V1zm10 0h8v8h-8V1zM1 11h8v8H1v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => handleViewModeChange('list')}
                  aria-label="List view"
                  title="Danh sách"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M1 1h18v4H1V1zm0 6h18v4H1V7zm0 6h18v4H1v-4z"/>
                  </svg>
                </button>
              </div>
              
              <button 
                className="filter-toggle-btn"
                onClick={toggleFilters}
                aria-label="Toggle filters"
              >
                <span className="filter-icon">🔍</span>
                <span>Bộ lọc</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-badge">{activeFiltersCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className={`movies-content ${!showFilters ? 'movies-content--sidebar-collapsed' : ''}`}>
            {/* Sidebar Filters - Desktop */}
            <div className="sidebar-wrapper">
              <aside className={`movies-sidebar ${showFilters ? 'movies-sidebar--open' : ''}`}>
                <div className="sidebar-header">
                  <h2>Bộ lọc tìm kiếm</h2>
                  <button 
                    className="sidebar-close"
                    onClick={toggleFilters}
                    aria-label={showFilters ? "Close filters" : "Open filters"}
                  >
                    <span className="sidebar-close-text">✕</span>
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClose={() => setShowFilters(false)}
                />
              </aside>
              {activeFiltersCount > 0 && (
                <button 
                  className="clear-filters-btn"
                  onClick={handleClearFilters}
                >
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>

            {/* Movies Grid */}
            <div className="movies-grid-container">
              {moviesLoading && (!moviesData?.content || moviesData.content.length === 0) ? (
                <MovieList
                  movies={[]}
                  variant={viewMode}
                  loading={true}
                />
              ) : moviesError ? (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <h3>Có lỗi xảy ra</h3>
                  <p>{moviesError?.message}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </button>
                </div>
              ) : moviesData?.content && moviesData.content.length > 0 ? (
                <>
                  <div className="movies-info">
                    <p className="results-count">
                      Tìm thấy <strong>{moviesData.totalElements}</strong> bộ phim
                    </p>
                  </div>
                  
                  <MovieList
                    movies={moviesData.content}
                    variant={viewMode}
                    onMovieClick={handleMovieClick}
                    loading={moviesLoading}
                  />
                  
                  {moviesData.totalPages > 1 && (
                    <Pagination
                      currentPage={moviesData.currentPage}
                      totalPages={moviesData.totalPages}
                      pageSize={moviesData.pageSize}
                      totalElements={moviesData.totalElements}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🎬</div>
                  <h3>Không tìm thấy phim nào</h3>
                  <p>Không có phim nào phù hợp với bộ lọc của bạn.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleClearFilters}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {showFilters && (
        <div 
          className="movies-overlay"
          onClick={toggleFilters}
          aria-hidden="true"
        />
      )}
    </div>
  )
}


