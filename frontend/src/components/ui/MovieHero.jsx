import PropTypes from 'prop-types';
import GlassBreadcrumb from './GlassBreadcrumb.jsx';
import PosterCard from './PosterCard.jsx';
import MetaList from './MetaList.jsx';
import TagChips from './TagChips.jsx';
import HeroCTA from './HeroCTA.jsx';
import styles from './MovieHero.module.css';

/**
 * Movie Hero Section Component
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie data object
 * @param {string} props.movie.title - Movie title
 * @param {string} props.movie.overview - Movie overview/description
 * @param {string} props.movie.director - Movie director
 * @param {string} props.movie.duration - Movie duration
 * @param {string} props.movie.releaseDate - Release date
 * @param {string[]} props.movie.genres - Array of genres
 * @param {string} [props.movie.posterUrl] - Poster image URL
 * @param {string} [props.movie.rating] - Movie rating
 * @param {boolean} [props.movie.isFeatured] - Whether movie is featured
 * @param {Array} props.breadcrumbItems - Breadcrumb navigation items
 * @param {Function} [props.onWatchTrailer] - Watch trailer handler
 * @param {Function} [props.onBuyTickets] - Buy tickets handler
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const MovieHero = ({ 
  movie, 
  breadcrumbItems, 
  onWatchTrailer, 
  onBuyTickets, 
  className = '' 
}) => {
  return (
    <section className={`${styles.movieHero} ${className}`}>
      {/* Background with gradient and effects */}
      <div className={styles.heroBackground}>
        <div className={styles.gradientOverlay} />
        <div className={styles.noiseOverlay} />
        <div className={styles.vignetteOverlay} />
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <GlassBreadcrumb items={breadcrumbItems} />

          {/* Hero Layout */}
          <div className={styles.heroLayout}>
            {/* Poster Card */}
            <div className={styles.posterSection}>
              <PosterCard
                title={movie.title}
                posterUrl={movie.posterUrl}
                rating={movie.rating}
                isFeatured={movie.isFeatured}
              />
            </div>

            {/* Info Panel */}
            <div className={styles.infoSection}>
              {/* Title */}
              <h1 className={styles.movieTitle}>
                {movie.title}
              </h1>

              {/* Overview */}
              <p className={styles.movieOverview}>
                {movie.overview}
              </p>

              {/* Meta Information */}
              <MetaList
                director={movie.director}
                duration={movie.duration}
                releaseDate={movie.releaseDate}
              />

              {/* Genre Tags */}
              <TagChips genres={movie.genres} />

              {/* Call-to-Action */}
              <HeroCTA
                onWatchTrailer={onWatchTrailer}
                onBuyTickets={onBuyTickets}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

MovieHero.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    posterUrl: PropTypes.string,
    rating: PropTypes.string,
    isFeatured: PropTypes.bool
  }).isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired,
  onWatchTrailer: PropTypes.func,
  onBuyTickets: PropTypes.func,
  className: PropTypes.string
};

export default MovieHero;
