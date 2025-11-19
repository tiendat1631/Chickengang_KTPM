import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/HeroSection.css';

const HeroSection = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    navigate(`/movies?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-container">
          <div className="hero-text">
            <h1 className="hero-title">
              Khám phá thế giới
              <span className="hero-highlight"> điện ảnh</span>
            </h1>
            <p className="hero-subtitle">
              Đặt vé xem phim dễ dàng, nhanh chóng và tiện lợi. 
              Trải nghiệm những bộ phim hay nhất với chất lượng cao.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={onGetStarted}
              >
                🎬 Đặt vé ngay
              </button>
              <button className="btn btn-secondary btn-large">
                📽️ Xem trailer
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Phim hay</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Rạp chiếu</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Khách hàng</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="movie-showcase">
              <div 
                className="movie-poster movie-poster-1"
                onClick={() => handleGenreClick('Action')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGenreClick('Action');
                  }
                }}
                aria-label="Xem phim thể loại Action"
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-content">
                  <div className="poster-icon">🎬</div>
                  <div className="poster-title">Action</div>
                </div>
              </div>
              <div 
                className="movie-poster movie-poster-2"
                onClick={() => handleGenreClick('Romance')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGenreClick('Romance');
                  }
                }}
                aria-label="Xem phim thể loại Romance"
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-content">
                  <div className="poster-icon">💕</div>
                  <div className="poster-title">Romance</div>
                </div>
              </div>
              <div 
                className="movie-poster movie-poster-3"
                onClick={() => handleGenreClick('Comedy')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGenreClick('Comedy');
                  }
                }}
                aria-label="Xem phim thể loại Comedy"
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-content">
                  <div className="poster-icon">😂</div>
                  <div className="poster-title">Comedy</div>
                </div>
              </div>
              <div 
                className="movie-poster movie-poster-4"
                onClick={() => handleGenreClick('Horror')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGenreClick('Horror');
                  }
                }}
                aria-label="Xem phim thể loại Horror"
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-content">
                  <div className="poster-icon">👻</div>
                  <div className="poster-title">Horror</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
