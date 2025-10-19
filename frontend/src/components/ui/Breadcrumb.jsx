// JavaScript file - no TypeScript checking
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

/**
 * @typedef {{ label: string, href?: string }} CrumbItem
 */

/**
 * Breadcrumb component for navigation with A11y support and responsive design
 * @param {Object} props - Component props
 * @param {CrumbItem[]} props.items - Array of breadcrumb items in order, last item is current page (no href)
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const Breadcrumb = ({ items, className = '' }) => {
  // Get full breadcrumb path for tooltip
  const getFullPath = () => {
    return items.map(item => item.label).join(' / ');
  };

  return (
    <div className={`${styles.breadcrumbContainer} ${className}`}>
      <nav 
        className={styles.breadcrumbNav}
        aria-label="Breadcrumb"
        title={getFullPath()}
      >
        <ol className={`${styles.breadcrumbNav} ol`}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index}>
                {isLast ? (
                  <span 
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <>
                    {item.href ? (
                      <Link
                        to={item.href}
                        title={item.label}
                        className={item.label === 'Trang chủ' ? 'home-icon' : ''}
                      >
                        {item.label === 'Trang chủ' ? '🏠' : item.label}
                      </Link>
                    ) : (
                      <span 
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    )}
                    {!isLast && (
                      <span className={styles.separator}>›</span>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string
};

export default Breadcrumb;