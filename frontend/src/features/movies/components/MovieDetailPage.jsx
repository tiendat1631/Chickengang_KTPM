import { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import apiClient from '@/services/api'
import { useScreenings } from '@/hooks/useScreenings'
import { formatVND } from '@/utils/formatCurrency'

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl font-medium">Đang tải thông tin phim...</div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-4 text-center border border-white/20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-white text-xl font-semibold mb-4">Không tìm thấy phim</h2>
            <p className="text-white/70 mb-6">Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ← Về trang chủ
              </Link>
              <Link 
                to="/movies/search" 
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔍 Tìm kiếm phim khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main Header */}
      <Header onSearch={() => {}} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: movie.title }
          ]}
        />
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Movie Poster Card */}
          <div className="lg:w-1/3">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-2xl">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NỔI BẬT
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                  T16
                </div>
                
                {/* Movie Poster Placeholder */}
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl text-gray-300 mb-4">🎬</div>
                  <h3 className="text-white text-lg font-semibold text-center">{movie.title}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Movie Details */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Movie Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {movie.title}
              </h1>
              
              {/* Movie Information */}
              <div className="space-y-3 text-white">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Đạo diễn:</span>
                  <span>{movie.director}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Thời lượng:</span>
                  <span>{movie.duration} phút</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Khởi chiếu:</span>
                  <span>{formatDate(movie.releaseDate)}</span>
                </div>
              </div>
              
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.split(',').map((genre, index) => (
                  <span 
                    key={`${movie.id}-genre-${index}`} 
                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  <span className="mr-2">▶️</span>
                  Xem Trailer
                </button>
                <button 
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  onClick={() => navigate(`/movies/${movie.id}/screenings`)}
                >
                  <span className="mr-2">🎫</span>
                  MUA VÉ NGAY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Screenings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Suất chiếu</h2>
          {screenings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenings.map((screening) => (
                <div 
                  key={screening.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => handleScreeningClick(screening)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white">
                      <div className="text-lg font-semibold">{formatTime(screening.startTime)}</div>
                      <div className="text-sm text-gray-300">{screening.format}</div>
                    </div>
                    <div className="text-right text-white">
                      <div className="text-sm">{screening.auditorium.name}</div>
                      <div className="font-semibold">{formatVND(screening.price)}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      screening.status === 'ACTIVE' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {screening.status === 'ACTIVE' ? 'Có vé' : 'Hết vé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg">Chưa có suất chiếu nào</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              to="/" 
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ← Quay lại trang chủ
            </Link>
            <Link 
              to={`/movies/${movie.id}/screenings`} 
              className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Xem tất cả suất chiếu
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
