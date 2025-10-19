import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMovies } from '@/hooks/useMovies'
import { useScreenings } from '@/hooks/useScreenings'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import './ScreeningListPage.css'

export default function ScreeningListPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [movie, setMovie] = useState(null)
  const [screenings, setScreenings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const movieIdNum = movieId ? parseInt(movieId) : 0

  const {
    data: movieData,
    isLoading: movieLoading,
    error: movieError,
  } = useMovies(0, 100, 'releaseDate,DESC') // Get all movies to find the specific one

  const {
    data: screeningsData,
    isLoading: screeningsLoading,
    error: screeningsError,
  } = useScreenings(movieIdNum)

  useEffect(() => {
    if (movieData && movieIdNum) {
      // Find the specific movie by ID
      const foundMovie = movieData.find((m) => m.id === movieIdNum)
      if (foundMovie) {
        setMovie(foundMovie)
      }
    }
  }, [movieData, movieIdNum])

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
    setLoading(movieLoading || screeningsLoading)
    setError(movieError?.message || screeningsError?.message || null)
  }, [movieLoading, screeningsLoading, movieError, screeningsError])

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleScreeningClick = (screening) => {
    if (!isAuthenticated) {
      // Store the intended booking URL in localStorage for after login
      const bookingUrl = `/booking/${movieId}/screening/${screening.id}`
      localStorage.setItem('intendedBookingUrl', bookingUrl)
      
      // Navigate to login page
      navigate('/login', { 
        state: { 
          message: 'Vui lòng đăng nhập để tiếp tục đặt vé',
          returnTo: bookingUrl
        } 
      })
      return
    }
    
    // If authenticated, navigate directly to seat selection
    navigate(`/booking/${movieId}/screening/${screening.id}`)
  }

  if (loading) {
    return (
      <div className="screening-list-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="screening-list-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="error">{error || 'Không tìm thấy phim'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="screening-list-page">
      <Header onSearch={() => {}} />
      
      {/* Synced Header Section */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: movie.title, href: `/movies/${movieId}` },
              { label: "Chọn suất" }
            ]}
          />
          
          {/* Page Title */}
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Chọn suất chiếu - {movie.title}
            </h1>
            <p className="text-white/90 text-base md:text-lg font-medium">
              Chọn suất chiếu phù hợp với lịch trình của bạn
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="movie-info">
          <div className="movie-poster">
            <div className="movie-poster-placeholder">🎬</div>
          </div>
          <div className="movie-details">
            <h1>{movie.title}</h1>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <span><strong>Thể loại:</strong> {movie.genres}</span>
              <span><strong>Thời lượng:</strong> {movie.duration} phút</span>
              <span><strong>Đạo diễn:</strong> {movie.director}</span>
              <span><strong>Diễn viên:</strong> {movie.actors}</span>
            </div>
          </div>
        </div>

        <div className="screenings-section">
          <h2>Chọn suất chiếu</h2>
          <div className="screenings-grid">
            {screenings.map((screening) => (
              <div 
                key={screening.id} 
                className="screening-card"
                onClick={() => handleScreeningClick(screening)}
              >
                <div className="screening-time">
                  <div className="time">{formatTime(screening.startTime)}</div>
                  <div className="date">{formatDate(screening.startTime)}</div>
                </div>
                <div className="screening-details">
                  <div className="format">{screening.format}</div>
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
        </div>

        <div className="back-button">
          <Link to={`/movies/${movieId}`} className="btn btn-secondary">
            ← Quay lại chi tiết phim
          </Link>
        </div>
      </div>
    </div>
  )
}
