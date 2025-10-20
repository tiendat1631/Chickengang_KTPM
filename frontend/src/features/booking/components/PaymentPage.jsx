import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import apiClient from '@/services/api'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingData, setBookingData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const response = await apiClient.post('/v1/bookings', {
        userId: bookingData.userId,
        screeningId: bookingData.screening.id,
        seatIds: bookingData.selectedSeats.map(seat => seat.id),
        totalPrice: bookingData.totalPrice
      })
      return response.data.data
    },
    onSuccess: (booking) => {
      // After creating booking, confirm payment
      confirmPaymentMutation.mutate({
        bookingId: booking.id,
        paymentMethod,
        note
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Tạo đơn đặt vé thất bại')
    }
  })

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await apiClient.post('/v1/payments/confirm', paymentData)
      return response.data.data
    },
    onSuccess: (payment) => {
      toast.success('Đặt vé thành công!')
      // Navigate to success page
      navigate(`/booking/success/${payment.bookingId}`, {
        state: { payment, bookingData }
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Xác nhận thanh toán thất bại')
    }
  })

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

  const handleSubmitPayment = () => {
    if (!bookingData) {
      toast.error('Không tìm thấy thông tin đặt vé')
      return
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán')
      return
    }

    // Start the booking process
    createBookingMutation.mutate(bookingData)
  }

  const handleBackToBooking = () => {
    navigate(`/booking/${movieId}`)
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
            { label: "Xác nhận", href: `/booking/${movieId}` },
            { label: "Thanh toán" }
          ]}
        />
        
        {/* Page title and subtitle */}
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Thanh toán
          </h1>
          <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
            Chọn phương thức thanh toán và xác nhận đặt vé
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Tóm tắt đơn hàng
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
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

          {/* Right Column - Payment Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Phương thức thanh toán
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn phương thức thanh toán
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={paymentMethod === 'CASH'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">💰 Tiền mặt tại quầy</div>
                      <div className="text-sm text-gray-500">Thanh toán tại quầy trước giờ chiếu 30 phút</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">🏦 Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">Chuyển khoản đến tài khoản ngân hàng</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Instructions */}
              {paymentMethod === 'CASH' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Hướng dẫn thanh toán tiền mặt:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Thanh toán tại quầy vé trước giờ chiếu 30 phút</li>
                    <li>• Xuất trình mã vé để thanh toán</li>
                    <li>• Nhận vé sau khi thanh toán thành công</li>
                  </ul>
                </div>
              )}

              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Thông tin chuyển khoản:</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div><strong>STK:</strong> 1234567890</div>
                    <div><strong>Ngân hàng:</strong> Vietcombank</div>
                    <div><strong>Chủ TK:</strong> MovieBooking</div>
                    <div><strong>Nội dung:</strong> [Mã vé sẽ được tạo]</div>
                  </div>
                </div>
              )}

              {/* Note Field */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập ghi chú nếu có..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={handleBackToBooking}
                >
                  ← Quay lại
                </button>
                <button 
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmitPayment}
                  disabled={createBookingMutation.isPending || confirmPaymentMutation.isPending}
                >
                  {(createBookingMutation.isPending || confirmPaymentMutation.isPending) 
                    ? 'Đang xử lý...' 
                    : '💳 Xác nhận thanh toán'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
