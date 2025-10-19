import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import styles from './PosterCard.module.css';

/**
 * Glassmorphism Poster Card Component
 * @param {Object} props - Component props
 * @param {string} props.title - Movie title
 * @param {string} [props.posterUrl] - Poster image URL
 * @param {string} [props.rating] - Movie rating (e.g., "T16")
 * @param {boolean} [props.isFeatured] - Whether movie is featured
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const PosterCard = ({ 
  title, 
  posterUrl, 
  rating = "T16", 
  isFeatured = true, 
  className = '' 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isHovered) {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePosition({
          x: (e.clientX - centerX) * 0.1,
          y: (e.clientY - centerY) * 0.1
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const card = document.querySelector(`.${styles.posterCard}`);
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [isHovered]);

  return (
    <div 
      className={`${styles.posterCard} ${className}`}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
      }}
    >
      <div className={styles.posterImage}>
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`Poster của phim ${title}`}
            className={styles.posterImg}
          />
        ) : (
          <div className={styles.posterPlaceholder}>
            <div className={styles.filmIcon}>🎬</div>
            <div className={styles.titleText}>{title}</div>
          </div>
        )}
      </div>
      
      {/* Badges */}
      <div className={styles.badges}>
        {isFeatured && (
          <div className={styles.featuredBadge}>
            Nổi bật
          </div>
        )}
        <div className={styles.ratingBadge}>
          {rating}
        </div>
      </div>
    </div>
  );
};

PosterCard.propTypes = {
  title: PropTypes.string.isRequired,
  posterUrl: PropTypes.string,
  rating: PropTypes.string,
  isFeatured: PropTypes.bool,
  className: PropTypes.string
};

export default PosterCard;
