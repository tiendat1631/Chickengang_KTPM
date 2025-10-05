import React from 'react';
import { Movie } from '@/types/movie';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  variant?: 'default' | 'featured' | 'compact';
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  variant = 'default' 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenres = (genres: string) => {
    return genres.split(',').map(genre => genre.trim());
  };

  return (
    <div 
      className={`movie-card movie-card--${variant}`}
      onClick={handleClick}
    >
      {/* Movie Poster Placeholder */}
      <div className="movie-poster">
        <div className="poster-placeholder">
          🎬
        </div>
        <div className="movie-rating">
          <span className="rated-badge">{movie.rated}</span>
        </div>
        {variant === 'featured' && (
          <div className="featured-overlay">
            <span className="featured-text">Nổi bật</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        
        <div className="movie-meta">
          <div className="movie-director">
            <span className="meta-label">Đạo diễn:</span>
            <span className="meta-value">{movie.director}</span>
          </div>
          
          <div className="movie-duration">
            <span className="meta-label">Thời lượng:</span>
            <span className="meta-value">{movie.duration}</span>
          </div>
          
          <div className="movie-release">
            <span className="meta-label">Khởi chiếu:</span>
            <span className="meta-value">{formatDate(movie.releaseDate)}</span>
          </div>
        </div>

        <div className="movie-genres">
          {getGenres(movie.genres).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>

        {variant !== 'compact' && (
          <div className="movie-description">
            <p>{movie.description}</p>
          </div>
        )}

        <div className="movie-actions">
          <button className="btn btn-primary btn-sm">
            Xem chi tiết
          </button>
          <button className="btn btn-outline btn-sm">
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
