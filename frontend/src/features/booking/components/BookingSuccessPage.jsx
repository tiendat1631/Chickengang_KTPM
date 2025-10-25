import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'

export default function BookingSuccessPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [payment, setPayment] = useState(null)
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get data from location state
    const stateData = location.state
    
    try {
      if (stateData && stateData.payment && stateData.bookingData) {
        setPayment(stateData.payment)
        setBookingData(stateData.bookingData)
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

  const handleViewMyTickets = () => {
    navigate('/my-tickets')
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl font-medium">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !payment || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="text-red-600 text-lg font-medium mb-4">{error || 'Không tìm thấy thông tin đặt vé'}</div>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Main Header */}
      <Header onSearch={() => {}} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-green-800 to-gray-800">
        <Breadcrumb 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Đặt vé thành công" }
          ]}
        />
        
        {/* Page title and subtitle */}
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            🎉 Đặt vé thành công!
          </h1>
          <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
            Cảm ơn bạn đã đặt vé. Vui lòng làm theo hướng dẫn thanh toán bên dưới.
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-white px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Thông tin đặt vé
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Code */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-2">Mã vé</h4>
                <div className="text-2xl font-bold text-green-700 font-mono">
                  {payment.bookingCode}
                </div>
                <p className="text-sm text-green-600 mt-1">Vui lòng lưu lại mã vé này để thanh toán</p>
              </div>

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
          </div>

          {/* Right Column - Payment Instructions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Hướng dẫn thanh toán
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Method */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Phương thức: {payment.paymentMethod === 'CASH' ? '💰 Tiền mặt tại quầy' : '🏦 Chuyển khoản ngân hàng'}
                </h4>
                <div className="text-sm text-blue-800">
                  Trạng thái: <span className="font-semibold">{payment.status === 'PENDING' ? 'Chờ thanh toán' : 'Đã thanh toán'}</span>
                </div>
              </div>

              {/* Payment Instructions */}
              {payment.paymentMethod === 'CASH' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">📋 Hướng dẫn thanh toán tiền mặt:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Đến quầy vé trước giờ chiếu <strong>30 phút</strong></li>
                      <li>• Xuất trình mã vé: <strong className="font-mono">{payment.bookingCode}</strong></li>
                      <li>• Thanh toán số tiền: <strong>{formatVND(payment.amount)}</strong></li>
                      <li>• Nhận vé sau khi thanh toán thành công</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">⚠️ Lưu ý quan trọng:</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Vé sẽ bị hủy nếu không thanh toán trước giờ chiếu 30 phút</li>
                      <li>• Vui lòng giữ lại mã vé để tra cứu</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">🏦 Thông tin chuyển khoản:</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <div><strong>STK:</strong> 1234567890</div>
                      <div><strong>Ngân hàng:</strong> Vietcombank</div>
                      <div><strong>Chủ TK:</strong> MovieBooking</div>
                      <div><strong>Số tiền:</strong> {formatVND(payment.amount)}</div>
                      <div><strong>Nội dung:</strong> <span className="font-mono">{payment.bookingCode}</span></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Hướng dẫn:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Chuyển khoản đúng số tiền và nội dung như trên</li>
                      <li>• Vé sẽ được kích hoạt sau khi xác nhận thanh toán</li>
                      <li>• Thời gian xử lý: 1-2 giờ làm việc</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg"
                  onClick={handleViewMyTickets}
                >
                  🎫 Xem vé của tôi
                </button>
                
                <button 
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={handleBackToHome}
                >
                  🏠 Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
