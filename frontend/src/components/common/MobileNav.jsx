import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar';

/**
 * MobileNav component with full-screen overlay menu
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether menu is open
 * @param {Function} props.onClose - Callback to close menu
 * @param {Object} props.user - User object (null if not authenticated)
 * @param {Function} props.onLogout - Logout callback
 * @param {Function} props.onSearch - Search callback
 * @returns {React.ReactElement}
 */
const MobileNav = ({ isOpen, onClose, user, onLogout, onSearch }) => {
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="mobile-nav__backdrop"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Menu Panel */}
      <div className="mobile-nav__panel" role="dialog" aria-modal="true">
        <div className="mobile-nav__header">
          <h2 className="mobile-nav__title">Menu</h2>
          <button
            className="mobile-nav__close"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        {/* Search Section */}
        <div className="mobile-nav__search">
          <SearchBar onSearch={onSearch} isMobile={true} />
        </div>

        <div className="mobile-nav__content">
          {/* User Section */}
          {user ? (
            <div className="mobile-nav__user">
              <div className="mobile-nav__user-avatar">
                {getInitials(user.username)}
              </div>
              <div className="mobile-nav__user-info">
                <p className="mobile-nav__user-name">{user.username}</p>
                <p className="mobile-nav__user-email">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="mobile-nav__auth">
              <Link to="/login" className="mobile-nav__auth-btn mobile-nav__auth-btn--outline">
                Đăng nhập
              </Link>
              <Link to="/register" className="mobile-nav__auth-btn mobile-nav__auth-btn--primary">
                Đăng ký
              </Link>
            </div>
          )}

          <div className="mobile-nav__divider"></div>

          {/* Navigation Links */}
          <nav className="mobile-nav__links">
            <Link to="/" className="mobile-nav__link">
              <span className="mobile-nav__link-icon">🏠</span>
              <span>Trang chủ</span>
            </Link>

            <Link to="/movies" className="mobile-nav__link">
              <span className="mobile-nav__link-icon">🎬</span>
              <span>Danh sách phim</span>
            </Link>

            {user && (
              <>
                <Link to="/profile" className="mobile-nav__link">
                  <span className="mobile-nav__link-icon">👤</span>
                  <span>Hồ sơ</span>
                </Link>

                <Link to="/my-tickets" className="mobile-nav__link">
                  <span className="mobile-nav__link-icon">🎫</span>
                  <span>Vé của tôi</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <>
                    <div className="mobile-nav__divider"></div>
                    <Link to="/admin" className="mobile-nav__link mobile-nav__link--admin">
                      <span className="mobile-nav__link-icon">🛠️</span>
                      <span>Admin Panel</span>
                    </Link>
                  </>
                )}

                <div className="mobile-nav__divider"></div>

                <button 
                  className="mobile-nav__link mobile-nav__link--logout"
                  onClick={handleLogout}
                >
                  <span className="mobile-nav__link-icon">🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

MobileNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  onSearch: PropTypes.func
};

export default MobileNav;

