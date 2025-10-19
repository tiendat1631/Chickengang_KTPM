import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMovies } from '@/hooks/useMovies'
import { useScreenings } from '@/hooks/useScreenings'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'

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
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-600 text-xl font-medium">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center border border-gray-200">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-gray-900 text-xl font-semibold mb-4">Không tìm thấy phim</h2>
            <p className="text-gray-600 mb-6">{error || 'Phim bạn đang tìm kiếm không tồn tại.'}</p>
            <Link 
              to="/" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <Header onSearch={() => {}} />
      
      {/* Header Section */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: movie.title, href: `/movies/${movieId}` },
              { label: "Chọn suất" }
            ]}
          />
          
          {/* Page Title */}
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Chọn suất chiếu - {movie.title}
            </h1>
            <p className="text-white/90 text-base md:text-lg font-medium">
              Chọn suất chiếu phù hợp với lịch trình của bạn
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Movie Information Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* Movie Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                🎬
              </div>
              
              {/* Movie Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-4">{movie.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="font-medium">Thể loại:</span> {movie.genres}</div>
                  <div><span className="font-medium">Thời lượng:</span> {movie.duration} phút</div>
                  <div><span className="font-medium">Đạo diễn:</span> {movie.director}</div>
                  <div><span className="font-medium">Diễn viên:</span> {movie.actors}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Chọn suất chiếu
            <div className="ml-3 w-12 h-1 bg-purple-600 rounded"></div>
          </h2>
          
          {screenings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenings.map((screening) => (
                <div 
                  key={screening.id} 
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-300 group"
                  onClick={() => handleScreeningClick(screening)}
                >
                  {/* Time */}
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {formatTime(screening.startTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(screening.startTime)}
                    </div>
                  </div>
                  
                  {/* Format and Room */}
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {screening.format}
                    </div>
                    <div className="text-gray-700 font-medium">
                      {screening.auditorium.name}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {formatVND(screening.price)}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      screening.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {screening.status === 'ACTIVE' ? 'Có vé' : 'Hết vé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có suất chiếu</h3>
              <p className="text-gray-500">Hiện tại chưa có suất chiếu nào cho phim này.</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link 
            to={`/movies/${movieId}`} 
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Quay lại chi tiết phim
          </Link>
        </div>
      </main>
    </div>
  )
}
