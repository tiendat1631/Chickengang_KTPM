import PropTypes from 'prop-types';
import styles from './TagChips.module.css';

/**
 * Genre Tag Chips Component
 * @param {Object} props - Component props
 * @param {string[]} props.genres - Array of genre names
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const TagChips = ({ genres, className = '' }) => {
  return (
    <div className={`${styles.tagChips} ${className}`}>
      <div className={styles.chipsContainer}>
        {genres.map((genre, index) => (
          <span 
            key={index} 
            className={styles.chip}
            role="button"
            tabIndex={0}
            aria-label={`Thể loại ${genre}`}
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

TagChips.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string
};

export default TagChips;
