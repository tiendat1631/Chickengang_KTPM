// @ts-check
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb component for navigation
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const Breadcrumb = ({ items, className }) => {
  return (
    <nav className={`breadcrumb ${className || ''}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index === items.length - 1 ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <>
                {item.to ? (
                  <Link to={item.to} className="breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-text">{item.label}</span>
                )}
                <span className="breadcrumb-separator">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    to: PropTypes.string
  })).isRequired,
  className: PropTypes.string
};

export default Breadcrumb;
