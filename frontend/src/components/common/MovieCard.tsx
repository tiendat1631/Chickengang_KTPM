import React from 'react';
import { Movie } from '@/types/movie';
import '@/styles/MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  variant?: 'default' | 'featured' | 'compact';
  rankTag?: string; // CGV-style ranking ribbon (e.g., "No.1", "Hot")
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  variant = 'default',
  rankTag 
}) => {
  const handleClick = () => {
    if (onClick && movie.id) {
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
      {/* CGV-style Poster Container */}
      <div className="movie-card__poster">
        <div className="movie-card__poster-image">
          <div className="movie-card__poster-placeholder">
            🎬
          </div>
        </div>
        
        {/* Age Rating Badge - Top Left */}
        <div 
          className="movie-card__badge movie-card__badge--age"
          aria-label={`Phim dành cho độ tuổi ${movie.rated}`}
        >
          <span className="movie-card__badge-text">{movie.rated}</span>
        </div>
        
        {/* Ranking Ribbon - Top Right */}
        {rankTag && (
          <div 
            className="movie-card__ribbon"
            aria-label={`Phim ${rankTag}`}
          >
            <span className="movie-card__ribbon-icon">🏆</span>
            <span className="movie-card__ribbon-text">{rankTag}</span>
          </div>
        )}
      </div>

      {/* Movie Content */}
      <div className="movie-card__content">
        {/* Title */}
        <h3 className="movie-card__title" title={movie.title}>
          {movie.title}
        </h3>
        
        {/* Meta Information - 3 Lines */}
        <div className="movie-card__meta">
          <div className="movie-card__meta-item">
            <span className="movie-card__meta-label">Thể loại:</span>
            <span className="movie-card__meta-value">{getGenres(movie.genres).join(', ')}</span>
          </div>
          
          <div className="movie-card__meta-item">
            <span className="movie-card__meta-label">Thời lượng:</span>
            <span className="movie-card__meta-value">{movie.duration}</span>
          </div>
          
          <div className="movie-card__meta-item">
            <span className="movie-card__meta-label">Khởi chiếu:</span>
            <span className="movie-card__meta-value">{formatDate(movie.releaseDate)}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="movie-card__cta">
          <button 
            className="movie-card__cta-button"
            onClick={(e) => {
              e.stopPropagation();
              // Handle booking
            }}
          >
            MUA VÉ
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

