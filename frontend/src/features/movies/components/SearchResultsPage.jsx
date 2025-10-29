import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '@/hooks/useMovies.js';
import Header from '@/components/common/Header.jsx';
import MovieCard from '@/components/common/MovieCard.jsx';
import Pagination from '@/components/common/Pagination.jsx';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('size')) || 20);
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || undefined,
    yearFrom: searchParams.get('yearFrom') ? Number(searchParams.get('yearFrom')) : undefined,
    yearTo: searchParams.get('yearTo') ? Number(searchParams.get('yearTo')) : undefined,
    status: searchParams.get('status') || undefined,
    sort: searchParams.get('sort') || undefined,
  });
  
  const { data: searchData, isLoading, error } = useSearchMovies(query, currentPage, pageSize, filters);

  // Update URL when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (currentPage > 0) params.set('page', currentPage.toString());
    if (pageSize !== 20) params.set('size', pageSize.toString());
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.yearFrom) params.set('yearFrom', filters.yearFrom.toString());
    if (filters.yearTo) params.set('yearTo', filters.yearTo.toString());
    if (filters.status) params.set('status', filters.status);
    if (filters.sort) params.set('sort', filters.sort);
    
    setSearchParams(params);
  }, [query, currentPage, pageSize, filters, setSearchParams]);

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      navigate(`/movies/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  const handleMovieClick = (movie) => {
    if (movie.id && movie.id > 0) {
      navigate(`/movies/${movie.id}`);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      genre: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      status: undefined,
      sort: undefined,
    });
    setCurrentPage(0);
  };

  return (
    <div className="search-results-page">
      <Header onSearch={handleSearch} />
      <div className="container">
        <h1 className="search-title">
          Kết quả tìm kiếm cho: "{query}"
        </h1>
        
        {searchData && (
          <p className="search-count">
            Tìm thấy {searchData.totalElements} kết quả
          </p>
        )}
        
        {isLoading ? (
          <div className="loading">Đang tìm kiếm...</div>
        ) : error ? (
          <div className="error">Có lỗi xảy ra khi tìm kiếm</div>
        ) : searchData?.content && searchData.content.length > 0 ? (
          <>
            <div className="movies-grid">
              {searchData.content.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>
            
            {searchData.totalPages > 1 && (
              <Pagination
                currentPage={searchData.currentPage}
                totalPages={searchData.totalPages}
                pageSize={searchData.pageSize}
                totalElements={searchData.totalElements}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        ) : (
          <div className="no-results">
            Không tìm thấy phim nào phù hợp với từ khóa "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
