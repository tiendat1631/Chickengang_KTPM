import PropTypes from 'prop-types';
import styles from './MetaList.module.css';

/**
 * Movie Meta Information List Component
 * @param {Object} props - Component props
 * @param {string} props.director - Movie director
 * @param {string} props.duration - Movie duration
 * @param {string} props.releaseDate - Release date
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const MetaList = ({ director, duration, releaseDate, className = '' }) => {
  const metaItems = [
    { label: 'Đạo diễn', value: director },
    { label: 'Thời lượng', value: duration },
    { label: 'Khởi chiếu', value: releaseDate }
  ];

  return (
    <div className={`${styles.metaList} ${className}`}>
      <div className={styles.metaGrid}>
        {metaItems.map((item, index) => (
          <div key={index} className={styles.metaItem}>
            <dt className={styles.metaLabel}>{item.label}:</dt>
            <dd className={styles.metaValue}>{item.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};

MetaList.propTypes = {
  director: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  releaseDate: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default MetaList;
