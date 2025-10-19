import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'

export default function BookingPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get booking data from location state or localStorage
    const stateData = location.state
    const storedData = localStorage.getItem('bookingData')
    
    try {
      if (stateData) {
        setBookingData(stateData)
        localStorage.setItem('bookingData', JSON.stringify(stateData))
      } else if (storedData) {
        setBookingData(JSON.parse(storedData))
      } else {
        setError('Không tìm thấy thông tin đặt vé')
      }
    } catch (err) {
      setError('Dữ liệu đặt vé không hợp lệ')
    } finally {
      setLoading(false)
    }
  }, [location.state])

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

  const handlePayment = () => {
    // TODO: Implement payment integration
    alert('Chức năng thanh toán sẽ được triển khai sớm!')
  }

  const handleBackToSeatSelection = () => {
    navigate(`/booking/${movieId}/screening/${bookingData?.screening.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl font-medium">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="text-red-600 text-lg font-medium mb-4">{error || 'Không tìm thấy thông tin đặt vé'}</div>
            <Link 
              to={`/movies/${movieId}`} 
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Quay lại trang phim
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Main Header */}
      <Header onSearch={() => {}} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: bookingData.screening.movie.title, href: `/movies/${movieId}` },
            { label: "Chọn suất", href: `/movies/${movieId}/screenings` },
            { label: "Chọn ghế", href: `/booking/${movieId}/screening/${bookingData.screening.id}` },
            { label: "Thanh toán" }
          ]}
        />
        
        {/* Page title and subtitle */}
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Xác nhận đặt vé
          </h1>
          <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
            Vui lòng kiểm tra lại thông tin trước khi thanh toán
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Thông tin đặt vé
            </h3>
            <p className="text-gray-600 text-sm">
              Vui lòng kiểm tra lại thông tin trước khi thanh toán
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Movie Information */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  🎬
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{bookingData.screening.movie.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><span className="font-medium">Suất chiếu:</span> {formatTime(bookingData.screening.startTime)}</div>
                    <div><span className="font-medium">Phòng:</span> {bookingData.screening.auditorium.name}</div>
                    <div><span className="font-medium">Ngày:</span> {formatDate(bookingData.screening.startTime)}</div>
                    <div><span className="font-medium">Định dạng:</span> {bookingData.screening.format}</div>
                  </div>
                </div>
              </div>
              
              {/* Selected Seats */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ghế đã chọn</h4>
                <div className="flex flex-wrap gap-2">
                  {bookingData.selectedSeats && bookingData.selectedSeats.length > 0 ? bookingData.selectedSeats.map((seat) => (
                    <span key={seat.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {seat.rowLabel}{seat.number} - {seat.seatType === 'SWEETBOX' ? 'Sweetbox' : 'Thường'}
                      <span className="ml-2 font-bold">{formatVND(seat.price)}</span>
                    </span>
                  )) : (
                    <p className="text-gray-500">Chưa chọn ghế nào</p>
                  )}
                </div>
              </div>
              
              {/* Payment Summary */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt thanh toán</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số ghế:</span>
                    <span className="font-medium">{bookingData.selectedSeats.length} ghế</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá vé:</span>
                    <span className="font-medium">{formatVND(bookingData.totalPrice)}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-green-700">
                      <span>Tổng cộng:</span>
                      <span>{formatVND(bookingData.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                onClick={handleBackToSeatSelection}
              >
                ← Chọn lại ghế
              </button>
              <button 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg"
                onClick={handlePayment}
              >
                💳 Thanh toán
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
