import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovies } from '@/hooks/useMovies'
import { Movie } from '@/types/movie'
import Header from '@/components/common/Header'
import HeroSection from './HeroSection'
import MovieList from './MovieList'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [recentMovies, setRecentMovies] = useState<Movie[]>([])

  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovies(currentPage, 12, 'releaseDate,DESC')

  const {
    data: featuredData,
    isLoading: featuredLoading,
    error: featuredError,
  } = useMovies(0, 4, 'releaseDate,DESC')

  useEffect(() => {
    if (moviesData) {
      if (currentPage === 0) {
        setRecentMovies(moviesData)
      } else {
        setRecentMovies((prev) => [...prev, ...moviesData])
      }
    }
  }, [moviesData, currentPage])

  useEffect(() => {
    if (featuredData) {
      setFeaturedMovies(featuredData)
    }
  }, [featuredData])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to search results page (will implement later)
      navigate(`/movies/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movies/${movie.id}`)
  }

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleGetStarted = () => {
    const moviesSection = document.getElementById('movies-section')
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      <main className="home-main">
        <HeroSection onGetStarted={handleGetStarted} />
        <div id="movies-section" className="movies-section">
          <div className="container">
            <MovieList
              movies={featuredMovies}
              title="Phim Nổi Bật"
              subtitle="Những bộ phim được yêu thích nhất hiện tại"
              variant="featured"
              loading={featuredLoading}
              error={featuredError?.message}
              onMovieClick={handleMovieClick}
            />
            <MovieList
              movies={recentMovies}
              title="Phim Mới Nhất"
              subtitle="Khám phá những bộ phim mới được cập nhật"
              variant="default"
              loading={moviesLoading}
              error={moviesError?.message}
              onMovieClick={handleMovieClick}
              onLoadMore={handleLoadMore}
              hasMore={!!moviesData && moviesData.length === 12}
            />
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
            <p>&copy; 2024 MovieBooking. Được phát triển bởi ChickenGang KTPM Team.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

