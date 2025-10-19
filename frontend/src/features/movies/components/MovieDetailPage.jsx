import { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import apiClient from '@/services/api'
import { useScreenings } from '@/hooks/useScreenings'
import { formatVND } from '@/utils/formatCurrency'
import './MovieDetailPage.css'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [screenings, setScreenings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const movieId = id ? parseInt(id) : 0

  const {
    data: screeningsData,
    isLoading: screeningsLoading,
    error: screeningsError,
  } = useScreenings(movieId)

  useEffect(() => {
    if (screeningsData) {
      // Transform API data to match our interface
      const transformedScreenings = screeningsData.map((screening) => ({
        id: screening.id,
        startTime: screening.startTime,
        endTime: screening.endTime,
        format: screening.format === 'TwoD' ? '2D' : screening.format === 'ThreeD' ? '3D' : screening.format,
        status: screening.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        auditorium: {
          id: screening.auditoriumId,
          name: screening.auditoriumName
        },
        price: 120000 // Default price - you might want to add this to the API response
      }))
      setScreenings(transformedScreenings)
    }
  }, [screeningsData])

  useEffect(() => {
    setLoading(screeningsLoading)
    if (screeningsError) {
      setError(screeningsError.message)
    }
  }, [screeningsLoading, screeningsError])

  // Validate movie ID parameter
  if (!movieId || movieId <= 0) {
    return <Navigate to="/404" replace />
  }

  // Fetch movie data with fallback to mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from API first
        try {
          console.log(`Fetching movie with ID: ${movieId}`)
          const response = await apiClient.get(`/v1/movies/${movieId}`)
          console.log('API Response:', response.data)
          
          if (response.data && response.data.data) {
            const movieData = response.data.data
            // Convert releaseDate from LocalDate to string if needed
            const formattedMovie = {
              ...movieData,
              releaseDate: typeof movieData.releaseDate === 'string' 
                ? movieData.releaseDate 
                : movieData.releaseDate?.toString() || ''
            }
            setMovie(formattedMovie)
            console.log('Movie data set:', formattedMovie)
          } else {
            throw new Error('Invalid API response structure')
          }
        } catch (apiError) {
          console.error('API Error:', apiError)
          setError('Không thể tải dữ liệu phim')
        }
        
        // Note: Screenings will be loaded separately via useScreenings hook
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Không thể tải dữ liệu phim')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleScreeningClick = (screening) => {
    // Navigate to seat selection page using React Router
    navigate(`/booking/${movieId}/screening/${screening.id}`)
  }

  if (loading) {
    return (
      <div className="movie-detail-page">
        <Header onSearch={() => {}} />
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải thông tin phim...</p>
            </div>
          </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <Header onSearch={() => {}} />
          <div className="container">
            <div className="error-container">
            <div className="error-icon">🎬</div>
            <h2>Không tìm thấy phim</h2>
            <p>Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <div className="error-actions">
              <Link to="/" className="btn btn-primary">
                ← Về trang chủ
              </Link>
              <Link to="/movies/search" className="btn btn-secondary">
                🔍 Tìm kiếm phim khác
              </Link>
            </div>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div className="movie-detail-page">
      <Header onSearch={() => {}} />
      
      {/* Synced Header Section */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: movie.title }
            ]}
          />
          
          {/* Page Title */}
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              {movie.title}
            </h1>
            <p className="text-white/90 text-base md:text-lg font-medium">
              {movie.description}
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Hero Section - CGV Style */}
        <div className="movie-hero-section">
          <div className="hero-background">
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content">
            <div className="hero-layout">
              {/* Movie Poster */}
              <div className="hero-poster">
                {movie.posterUrl && movie.posterUrl !== 'https://via.placeholder.com/300x450' ? (
                  <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                  <div className="movie-poster-placeholder" data-title={movie.title}></div>
                )}
                
                {/* Featured Badge */}
                <div className="featured-badge">Nổi bật</div>
                
                {/* Rating Badge */}
                <div className="rating-badge-hero">T16</div>
            </div>

              {/* Movie Info */}
              <div className="hero-info">
                <h1 className="hero-title">{movie.title}</h1>
                
                <div className="hero-quick-info">
                  <div className="quick-info-item">
                    <span className="info-label">Đạo diễn:</span>
                    <span className="info-value">{movie.director}</span>
                  </div>
                  <div className="quick-info-item">
                    <span className="info-label">Thời lượng:</span>
                    <span className="info-value">{movie.duration} phút</span>
                  </div>
                  <div className="quick-info-item">
                    <span className="info-label">Khởi chiếu:</span>
                    <span className="info-value">{formatDate(movie.releaseDate)}</span>
                  </div>
                </div>

                {/* Genre Tags */}
                <div className="genre-tags">
                  {movie.genres.split(',').map((genre, index) => (
                    <span key={`${movie.id}-genre-${index}`} className="genre-tag">{genre.trim()}</span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="hero-actions">
                  <button className="btn-trailer">
                    <span className="trailer-icon">▶️</span>
                    Xem Trailer
                  </button>
                  <button className="btn-buy-ticket-hero">
                    <span className="ticket-icon">🎫</span>
                    MUA VÉ NGAY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="movie-details-section">
          <div className="details-layout">
            {/* Left Column - Detailed Info */}
            <div className="details-info">
              <h2 className="section-title">Thông tin chi tiết</h2>
              
              <div className="movie-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Diễn viên:</span>
                  <span className="detail-value">{movie.actors}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ngôn ngữ:</span>
                  <span className="detail-value">Tiếng Anh - Phụ đề Tiếng Việt</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rated:</span>
                  <span className="detail-value">T16 - PHIM ĐƯỢC PHỔ BIẾN ĐẾN NGƯỜI XEM TỪ ĐỦ 16 TUỔI TRỞ LÊN (16+)</span>
                </div>
              </div>

              {/* Movie Synopsis */}
              <div className="movie-synopsis">
                <h3>Nội dung phim</h3>
                <p>{movie.description}</p>
              </div>

              {/* Social Actions */}
              <div className="social-actions">
                <button className="btn-facebook">
                  <span className="facebook-icon">📘</span>
                  Like 0
                </button>
                <button className="btn-share">
                  <span className="share-icon">📤</span>
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Right Column - Promotions */}
            <div className="promotions-sidebar">
              <h3 className="sidebar-title">Ưu đãi đặc biệt</h3>
              
              <div className="promotion-cards">
                <div className="promotion-card">
                  <div className="promo-badge">HOT</div>
                  <h4>Combo 2 vé + nước</h4>
                  <p>Tiết kiệm 20% khi mua combo</p>
                  <div className="promo-price"><span className="whitespace-nowrap">{formatVND(199000)}</span></div>
                </div>
                
                <div className="promotion-card">
                  <div className="promo-badge">NEW</div>
                  <h4>Thành viên VIP</h4>
                  <p>Giảm giá 15% cho thành viên</p>
                  <button className="btn-promo">Đăng ký ngay</button>
                </div>
              </div>
              </div>
            </div>
          </div>

        <div className="screenings-section">
          <h2>Suất chiếu</h2>
          {screenings.length > 0 ? (
              <div className="screenings-grid">
              {screenings.map((screening) => (
                  <div 
                    key={screening.id} 
                    className="screening-card"
                    onClick={() => handleScreeningClick(screening)}
                  >
                    <div className="screening-time">
                    <div className="time">{formatTime(screening.startTime)}</div>
                    <div className="format">{screening.format}</div>
                    </div>
                    <div className="screening-details">
                    <div className="auditorium">{screening.auditorium.name}</div>
                    <div className="price"><span className="whitespace-nowrap">{formatVND(screening.price)}</span></div>
                      </div>
                  <div className="screening-status">
                    <span className={`status ${screening.status.toLowerCase()}`}>
                      {screening.status === 'ACTIVE' ? 'Có vé' : 'Hết vé'}
                    </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-screenings">Chưa có suất chiếu nào</p>
          )}
          
          <div className="action-buttons">
            <Link to="/" className="btn btn-secondary">
              ← Quay lại trang chủ
            </Link>
            <Link to={`/movies/${movie.id}/screenings`} className="btn btn-primary">
              Xem tất cả suất chiếu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
