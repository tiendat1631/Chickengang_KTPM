import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '@/hooks/useMovies.js';
import Header from '@/components/common/Header.jsx';
import MovieCard from '@/components/common/MovieCard.jsx';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data: movies, isLoading, error } = useSearchMovies(query);

  if (isLoading) {
    return (
      <div className="search-results-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="loading">Đang tìm kiếm...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="error">Có lỗi xảy ra khi tìm kiếm</div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <Header onSearch={() => {}} />
      <div className="container">
        <h1 className="search-title">
          Kết quả tìm kiếm cho: "{query}"
        </h1>
        
        {movies && movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
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
