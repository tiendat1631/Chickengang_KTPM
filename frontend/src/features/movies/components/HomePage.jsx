import { useNavigate } from 'react-router-dom'
import { useMovies } from '@/features/movies/hooks/useMovies'
import Header from '@/components/common/Header'
import HeroSection from './HeroSection.jsx'
import MovieList from './MovieList.jsx'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  // Fetch featured movies (NOW_SHOWING)
  const {
    data: featuredData,
    isLoading: featuredLoading,
    error: featuredError,
  } = useMovies(0, 8, 'releaseDate,DESC', { status: 'NOW_SHOWING' })

  // Fetch coming soon movies
  const {
    data: comingSoonData,
    isLoading: comingSoonLoading,
    error: comingSoonError,
  } = useMovies(0, 8, 'releaseDate,ASC', { status: 'COMING_SOON' })

  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to search results page (will implement later)
      navigate(`/movies/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleMovieClick = (movie) => {
    if (movie.id && movie.id > 0) {
      navigate(`/movies/${movie.id}`)
    } else {
      console.error('Invalid movie ID:', movie.id)
    }
  }

  const handleGetStarted = () => {
    const moviesSection = document.getElementById('movies-section')
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleViewAllMovies = () => {
    navigate('/movies')
  }

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      <main className="home-main">
        <HeroSection onGetStarted={handleGetStarted} />
        <div id="movies-section" className="movies-section">
          <div className="container">
            {/* Featured Movies Section */}
            <MovieList
              movies={featuredData?.content || []}
              title="Phim Nổi Bật"
              subtitle="Những bộ phim đang được yêu thích nhất"
              variant="featured"
              loading={featuredLoading}
              error={featuredError?.message}
              onMovieClick={handleMovieClick}
            />
            
            {/* Coming Soon Section */}
            <div className="section-divider"></div>
            <MovieList
              movies={comingSoonData?.content || []}
              title="Phim Sắp Chiếu"
              subtitle="Những bộ phim đáng mong đợi sắp ra mắt"
              variant="featured"
              loading={comingSoonLoading}
              error={comingSoonError?.message}
              onMovieClick={handleMovieClick}
            />
            
            {/* View All CTA */}
            <div className="view-all-section">
              <button 
                className="btn-view-all"
                onClick={handleViewAllMovies}
              >
                <span>Xem tất cả phim</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🎬 MovieBooking</h3>
              <p>Nền tảng đặt vé xem phim hàng đầu Việt Nam</p>
            </div>
            <div className="footer-section">
              <h4>Liên kết</h4>
              <ul>
                <li><a href="#about">Về chúng tôi</a></li>
                <li><a href="#contact">Liên hệ</a></li>
                <li><a href="#help">Hỗ trợ</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Dịch vụ</h4>
              <ul>
                <li><a href="#movies">Phim</a></li>
                <li><a href="#cinemas">Rạp chiếu</a></li>
                <li><a href="#promotions">Khuyến mãi</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Kết nối</h4>
              <div className="social-links">
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📷 Instagram</a>
                <a href="#" className="social-link">🐦 Twitter</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 MovieBooking. Được phát triển bởi ChickenGang KTPM Team.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
