import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './GlassBreadcrumb.module.css';

/**
 * @typedef {{ label: string, href?: string }} CrumbItem
 */

/**
 * Glassmorphism Breadcrumb Component
 * @param {Object} props - Component props
 * @param {CrumbItem[]} props.items - Array of breadcrumb items
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const GlassBreadcrumb = ({ items, className = '' }) => {
  return (
    <nav 
      className={`${styles.glassBreadcrumb} ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <div className={styles.breadcrumbContainer}>
        <ol className={styles.breadcrumbList}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className={styles.breadcrumbItem}>
                {isLast ? (
                  <span 
                    className={styles.currentPage}
                    aria-current="page"
                  >
                    {item.label === 'Trang chủ' ? '🏠' : item.label}
                  </span>
                ) : (
                  <>
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={styles.breadcrumbLink}
                        title={item.label}
                      >
                        {item.label === 'Trang chủ' ? '🏠' : item.label}
                      </Link>
                    ) : (
                      <span 
                        className={styles.breadcrumbText}
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <span className={styles.separator} aria-hidden="true">
                        ›
                      </span>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

GlassBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string
};

export default GlassBreadcrumb;
