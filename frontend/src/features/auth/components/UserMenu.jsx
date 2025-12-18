import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * UserMenu component with dropdown
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {Function} props.onLogout - Logout callback
 * @returns {React.ReactElement}
 */
const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu người dùng"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-menu__avatar">
          {getInitials(user.username)}
        </div>
        <span className="user-menu__name">{user.username}</span>
        <svg 
          className={`user-menu__arrow ${isOpen ? 'user-menu__arrow--open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M2 4L6 8L10 4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown">
          <div className="user-menu__header">
            <div className="user-menu__avatar user-menu__avatar--large">
              {getInitials(user.username)}
            </div>
            <div className="user-menu__info">
              <p className="user-menu__username">{user.username}</p>
              <p className="user-menu__email">{user.email}</p>
            </div>
          </div>

          <div className="user-menu__divider"></div>

          <nav className="user-menu__nav" role="menu">
            <Link 
              to="/profile" 
              className={`user-menu__item ${isActivePath('/profile') ? 'user-menu__item--active' : ''}`}
              role="menuitem"
            >
              <span className="user-menu__icon">👤</span>
              <span>Hồ sơ</span>
            </Link>

            <Link 
              to="/my-tickets" 
              className={`user-menu__item ${isActivePath('/my-tickets') ? 'user-menu__item--active' : ''}`}
              role="menuitem"
            >
              <span className="user-menu__icon">🎫</span>
              <span>Vé của tôi</span>
            </Link>

            {user.role === 'ADMIN' && (
              <>
                <div className="user-menu__divider"></div>
                <Link 
                  to="/admin" 
                  className={`user-menu__item user-menu__item--admin ${isActivePath('/admin') ? 'user-menu__item--active' : ''}`}
                  role="menuitem"
                >
                  <span className="user-menu__icon">🛠️</span>
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </nav>

          <div className="user-menu__divider"></div>

          <button 
            className="user-menu__item user-menu__item--logout"
            onClick={handleLogout}
            role="menuitem"
          >
            <span className="user-menu__icon">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default UserMenu;

