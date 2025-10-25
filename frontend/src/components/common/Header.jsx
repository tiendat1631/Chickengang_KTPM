import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks/useAuth.js';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import MobileNav from './MobileNav';
import '@/styles/Header.css';

/**
 * Main Header component - orchestrates all sub-components
 * @param {Object} props - Component props
 * @param {Function} [props.onSearch] - Callback function for search
 * @returns {React.ReactElement}
 */
const Header = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (query, filters) => {
    if (onSearch) {
      onSearch(query, filters);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          {/* Logo */}
          <Link to="/" className="header__logo" aria-label="Trang chủ">
            <span className="header__logo-icon">🎬</span>
            <span className="header__logo-text">MovieBooking</span>
          </Link>

          {/* Desktop Search */}
          <div className="header__search-desktop">
            <SearchBar onSearch={handleSearch} isMobile={false} />
          </div>

          {/* Desktop User Menu / Auth Buttons */}
          <div className="header__actions-desktop">
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="header__auth">
                <Link to="/login" className="header__auth-btn header__auth-btn--outline">
                  Đăng nhập
                </Link>
                <Link to="/register" className="header__auth-btn header__auth-btn--primary">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="header__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Search - Below header on mobile */}
        <div className="header__search-mobile">
          <SearchBar onSearch={handleSearch} isMobile={true} />
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
    </>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func
};

export default Header;
