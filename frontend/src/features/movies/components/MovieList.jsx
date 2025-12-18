import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from '@/features/movies/components/MovieCard.jsx';
import SkeletonCard from '@/features/movies/components/SkeletonCard.jsx';
import '@/styles/MovieList.css';

const MovieList = React.memo(({
  movies,
  title,
  subtitle,
  variant = 'default',
  loading = false,
  error,
  onMovieClick,
  onLoadMore,
  hasMore = false,
  skeletonCount = 8
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
        <div className="movie-list-grid movie-list-grid--skeleton">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} variant={variant} />
          ))}
        </div>
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
        {movies && movies.length > 0 ? movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            variant={variant}
            onClick={onMovieClick}
          />
        )) : (
          <div className="movie-list-empty">
            <div className="empty-icon">🎬</div>
            <h3>Chưa có phim nào</h3>
            <p>Hãy quay lại sau để xem những bộ phim mới nhất!</p>
          </div>
        )}
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
});

MovieList.displayName = 'MovieList';

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'featured', 'compact', 'grid', 'list']),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onMovieClick: PropTypes.func,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  skeletonCount: PropTypes.number
};

export default MovieList;
