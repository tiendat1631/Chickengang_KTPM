// @ts-check
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/Header.css';

/**
 * Header component with search functionality and user menu
 * @param {Object} props - Component props
 * @param {Function} [props.onSearch] - Callback function for search
 * @returns {JSX.Element}
 */
const Header = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Handle search form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" aria-label="Trang chủ" className="header-logo-link">
          <div className="header-logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">MovieBooking</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>

        {/* User Menu */}
        <div className="header-user">
          {user ? (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                👤 {user.username}
              </button>
              {isMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.username}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-actions">
                    <button className="dropdown-item">Hồ sơ</button>
                    <button className="dropdown-item">Đặt vé của tôi</button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func
};

export default Header;
