import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import './MovieDetailPage.css'

interface Movie {
  id: number
  title: string
  description: string
  duration: number
  releaseDate: string
  genre: string
  director: string
  cast: string
  posterUrl: string
  trailerUrl: string
  rating: number
  status: string
}

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

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Mock movie data
        const mockMovie: Movie = {
          id: parseInt(id || '1'),
          title: 'Avengers: Endgame',
          description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
          duration: 181,
          releaseDate: '2019-04-26',
          genre: 'Action, Adventure, Drama',
          director: 'Anthony Russo, Joe Russo',
          cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth',
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
          }
        ]
        
        setMovie(mockMovie)
        setScreenings(mockScreenings)
        setError(null)
      } catch (err) {
        setError('Không thể tải dữ liệu phim')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="movie-detail-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="error">{error || 'Không tìm thấy phim'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-detail-page">
      <Header onSearch={() => {}} />
      <div className="container">
        <div className="movie-detail">
          <div className="movie-poster">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-rating">
              <span className="rating">⭐ {movie.rating}/10</span>
              <span className="status">{movie.status}</span>
            </div>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <div className="meta-item">
                <strong>Thể loại:</strong> {movie.genre}
              </div>
              <div className="meta-item">
                <strong>Thời lượng:</strong> {movie.duration} phút
              </div>
              <div className="meta-item">
                <strong>Ngày phát hành:</strong> {formatDate(movie.releaseDate)}
              </div>
              <div className="meta-item">
                <strong>Đạo diễn:</strong> {movie.director}
              </div>
              <div className="meta-item">
                <strong>Diễn viên:</strong> {movie.cast}
              </div>
            </div>
            <div className="trailer-section">
              <h3>Trailer</h3>
              <div className="trailer-placeholder">
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  ▶️ Xem trailer
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="screenings-section">
          <h2>Suất chiếu</h2>
          {screenings.length > 0 ? (
            <div className="screenings-grid">
              {screenings.map((screening) => (
                <div key={screening.id} className="screening-card">
                  <div className="screening-time">
                    <div className="time">{formatTime(screening.startTime)}</div>
                    <div className="format">{screening.format}</div>
                  </div>
                  <div className="screening-details">
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

