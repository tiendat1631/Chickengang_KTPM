import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './HeroCTA.module.css';

/**
 * Hero Call-to-Action Buttons Component
 * @param {Object} props - Component props
 * @param {Function} [props.onWatchTrailer] - Watch trailer handler
 * @param {Function} [props.onBuyTickets] - Buy tickets handler
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const HeroCTA = ({ onWatchTrailer, onBuyTickets, className = '' }) => {
  const [ripple, setRipple] = useState(null);

  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    setRipple({ x, y, size });
    
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div className={`${styles.heroCTA} ${className}`}>
      <div className={styles.buttonGroup}>
        {/* Watch Trailer Button */}
        <button
          className={styles.trailerButton}
          onClick={onWatchTrailer}
          onMouseDown={createRipple}
          aria-label="Xem trailer phim"
        >
          <span className={styles.buttonIcon}>▶</span>
          <span className={styles.buttonText}>Xem Trailer</span>
          {ripple && (
            <span
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size
              }}
            />
          )}
        </button>

        {/* Buy Tickets Button */}
        <button
          className={styles.buyButton}
          onClick={onBuyTickets}
          onMouseDown={createRipple}
          aria-label="Mua vé ngay"
        >
          <span className={styles.buttonIcon}>🎟️</span>
          <span className={styles.buttonText}>Mua vé ngay</span>
          {ripple && (
            <span
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

HeroCTA.propTypes = {
  onWatchTrailer: PropTypes.func,
  onBuyTickets: PropTypes.func,
  className: PropTypes.string
};

export default HeroCTA;
