import React from 'react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/common/MovieCard';
import '@/styles/MovieList.css';

interface MovieListProps {
  movies: Movie[];
  title: string;
  subtitle?: string;
  variant?: 'default' | 'featured' | 'compact';
  loading?: boolean;
  error?: string;
  onMovieClick?: (movie: Movie) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  title,
  subtitle,
  variant = 'default',
  loading = false,
  error,
  onMovieClick,
  onLoadMore,
  hasMore = false
}) => {
  if (error) {
    return (
      <div className="movie-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Không thể tải danh sách phim</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <div className="movie-list-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách phim...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-list-empty">
        <div className="empty-icon">🎬</div>
        <h3>Chưa có phim nào</h3>
        <p>Hãy quay lại sau để xem những bộ phim mới nhất!</p>
      </div>
    );
  }

  return (
    <section className={`movie-list movie-list--${variant}`}>
      <div className="movie-list-header">
        <h2 className="movie-list-title">{title}</h2>
        {subtitle && (
          <p className="movie-list-subtitle">{subtitle}</p>
        )}
      </div>

      <div className="movie-list-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            variant={variant}
            onClick={onMovieClick}
          />
        ))}
      </div>

      {loading && movies.length > 0 && (
        <div className="movie-list-loading-more">
          <div className="loading-spinner small"></div>
          <span>Đang tải thêm...</span>
        </div>
      )}

      {hasMore && !loading && onLoadMore && (
        <div className="movie-list-actions">
          <button 
            className="btn btn-outline btn-large"
            onClick={onLoadMore}
          >
            Xem thêm phim
          </button>
        </div>
      )}
    </section>
  );
};

export default MovieList;
