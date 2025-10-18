// @ts-check
import PropTypes from 'prop-types';
import '@/styles/MovieCard.css';

/**
 * MovieCard component for displaying movie information
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object
 * @param {Function} [props.onClick] - Click handler for movie card
 * @param {'default' | 'featured' | 'compact'} [props.variant='default'] - Card variant
 * @param {string} [props.rankTag] - Ranking tag (e.g., "No.1", "Hot")
 * @returns {JSX.Element}
 */
const MovieCard = ({ 
  movie, 
  onClick, 
  variant = 'default',
  rankTag 
}) => {
  /**
   * Handle movie card click
   */
  const handleClick = () => {
    if (onClick && movie.id) {
      onClick(movie);
    }
  };

  /**
   * Format date string to Vietnamese locale
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Parse genres string into array
   * @param {string} genres - Comma-separated genres string
   * @returns {string[]} Array of genre strings
   */
  const getGenres = (genres) => {
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

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
    actors: PropTypes.string.isRequired,
    genres: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    rated: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    posterUrl: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'featured', 'compact']),
  rankTag: PropTypes.string
};

export default MovieCard;
