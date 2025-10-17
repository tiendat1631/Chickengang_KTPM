import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMovies } from '@/hooks/useMovies'
import { useScreenings } from '@/hooks/useScreenings'
import { Movie } from '@/types/movie'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import './ScreeningListPage.css'

interface Screening {
  id: number
  startTime: string
  endTime: string
  format: '2D' | '3D' | 'IMAX'
  status: 'ACTIVE' | 'INACTIVE'
  auditorium: {
    id: number
    name: string
  }
  price: number
}

export default function ScreeningListPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      const foundMovie = movieData.find((m: Movie) => m.id === movieIdNum)
      if (foundMovie) {
        setMovie(foundMovie)
      }
    }
  }, [movieData, movieIdNum])

  useEffect(() => {
    if (screeningsData) {
      // Transform API data to match our interface
      const transformedScreenings: Screening[] = screeningsData.map((screening: any) => ({
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleScreeningClick = (screening: Screening) => {
    // Navigate to seat selection page using React Router
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
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Trang chủ", to: "/" },
            { label: movie.title, to: `/movies/${movieId}` },
            { label: "Chọn suất" }
          ]}
          className="mb-6"
        />

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
