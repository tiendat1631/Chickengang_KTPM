import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMovies } from '@/hooks/useMovies'
import { Movie } from '@/types/movie'
import Header from '@/components/common/Header'
import './ScreeningListPage.css'

interface Screening {
  id: number
  startTime: string
  endTime: string
  format: '2D' | '3D'
  status: 'ACTIVE' | 'INACTIVE'
  auditorium: {
    id: number
    name: string
  }
  price: number
}

export default function ScreeningListPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for now - will replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Mock movie data
        const mockMovie: Movie = {
          id: parseInt(movieId || '1'),
          title: 'Avengers: Endgame',
          description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins.',
          duration: 181,
          releaseDate: '2019-04-26',
          genre: 'Action, Adventure, Drama',
          director: 'Anthony Russo, Joe Russo',
          cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
          posterUrl: 'https://via.placeholder.com/300x450',
          trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
          rating: 8.4,
          status: 'ACTIVE'
        }
        
        // Mock screenings data
        const mockScreenings: Screening[] = [
          {
            id: 1,
            startTime: '2024-01-15T10:00:00',
            endTime: '2024-01-15T13:01:00',
            format: '2D',
            status: 'ACTIVE',
            auditorium: { id: 1, name: 'Phòng 1' },
            price: 120000
          },
          {
            id: 2,
            startTime: '2024-01-15T14:00:00',
            endTime: '2024-01-15T17:01:00',
            format: '3D',
            status: 'ACTIVE',
            auditorium: { id: 2, name: 'Phòng 2' },
            price: 150000
          },
          {
            id: 3,
            startTime: '2024-01-15T18:00:00',
            endTime: '2024-01-15T21:01:00',
            format: '2D',
            status: 'ACTIVE',
            auditorium: { id: 1, name: 'Phòng 1' },
            price: 120000
          },
          {
            id: 4,
            startTime: '2024-01-15T20:00:00',
            endTime: '2024-01-15T23:01:00',
            format: '3D',
            status: 'ACTIVE',
            auditorium: { id: 3, name: 'Phòng 3' },
            price: 150000
          }
        ]
        
        setMovie(mockMovie)
        setScreenings(mockScreenings)
        setError(null)
      } catch (err) {
        setError('Không thể tải dữ liệu suất chiếu')
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchData()
    }
  }, [movieId])

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
    // Navigate to seat selection page
    window.location.href = `/booking/${movieId}/screening/${screening.id}`
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
        <div className="movie-info">
          <div className="movie-poster">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-details">
            <h1>{movie.title}</h1>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <span><strong>Thể loại:</strong> {movie.genre}</span>
              <span><strong>Thời lượng:</strong> {movie.duration} phút</span>
              <span><strong>Đạo diễn:</strong> {movie.director}</span>
              <span><strong>Diễn viên:</strong> {movie.cast}</span>
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
                  <div className="price">{screening.price.toLocaleString('vi-VN')} VNĐ</div>
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
