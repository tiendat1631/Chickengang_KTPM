import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import apiClient from '@/services/api'

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Fetch user's bookings
  const {
    data: bookings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const response = await apiClient.get(`/v1/bookings?userId=${user.id}`)
      return response.data.data || []
    },
    enabled: !!user?.id
  })

  // Fetch payment for selected booking
  const {
    data: payment,
    isLoading: paymentLoading
  } = useQuery({
    queryKey: ['payment', selectedBooking?.id],
    queryFn: async () => {
      if (!selectedBooking?.id) return null
      const response = await apiClient.get(`/v1/payments/booking/${selectedBooking.id}`)
      return response.data.data
    },
    enabled: !!selectedBooking?.id
  })

  // No need for redirect here - ProtectedRoute already handles it
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login', {
  //       state: { 
  //         message: 'Vui lòng đăng nhập để xem vé của bạn',
  //         returnTo: '/my-tickets'
  //       }
  //     })
  //   }
  // }, [isAuthenticated, navigate])

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

  const getStatusBadge = (booking, payment) => {
    if (booking.bookingStatus === 'PENDING') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Chờ thanh toán</span>
    }
    if (booking.bookingStatus === 'PAID') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Đã thanh toán</span>
    }
    if (booking.bookingStatus === 'CANCELLED') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Đã hủy</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Không xác định</span>
  }

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  // ProtectedRoute already handles authentication check
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl font-medium">Đang tải vé của bạn...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="text-red-600 text-lg font-medium mb-4">Lỗi tải dữ liệu</div>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Main Header */}
      <Header onSearch={() => {}} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-blue-800 to-gray-800">
        <Breadcrumb 
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Vé của tôi" }
          ]}
        />
        
        {/* Page title and subtitle */}
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            🎫 Vé của tôi
          </h1>
          <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
            Quản lý và theo dõi vé đã đặt
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        {bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bookings List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Danh sách vé ({bookings.length})
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedBooking?.id === booking.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleBookingClick(booking)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {booking.screening?.movie?.title || 'Phim không xác định'}
                            </h4>
                            {getStatusBadge(booking, null)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div><span className="font-medium">Mã vé:</span> <span className="font-mono">{booking.bookingCode}</span></div>
                            <div><span className="font-medium">Suất chiếu:</span> {booking.screening?.startTime ? formatTime(booking.screening.startTime) : 'N/A'}</div>
                            <div><span className="font-medium">Phòng:</span> {booking.screening?.auditorium?.name || 'N/A'}</div>
                            <div><span className="font-medium">Tổng tiền:</span> {formatVND(booking.totalPrice)}</div>
                          </div>
                          
                          {booking.seats && booking.seats.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Ghế:</span> {booking.seats.map(seat => `${seat.rowLabel}${seat.number}`).join(', ')}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            Đặt lúc: {booking.createdOn ? formatDate(booking.createdOn) : 'N/A'}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Chi tiết →</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="lg:col-span-1">
              {selectedBooking ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-white px-6 py-4 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Chi tiết vé
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Booking Code */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-lg font-semibold text-green-900 mb-2">Mã vé</h4>
                      <div className="text-xl font-bold text-green-700 font-mono">
                        {selectedBooking.bookingCode}
                      </div>
                    </div>

                    {/* Movie Information */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">Thông tin phim</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><span className="font-medium">Phim:</span> {selectedBooking.screening?.movie?.title || 'N/A'}</div>
                          <div><span className="font-medium">Suất chiếu:</span> {selectedBooking.screening?.startTime ? formatTime(selectedBooking.screening.startTime) : 'N/A'}</div>
                          <div><span className="font-medium">Ngày:</span> {selectedBooking.screening?.startTime ? formatDate(selectedBooking.screening.startTime) : 'N/A'}</div>
                          <div><span className="font-medium">Phòng:</span> {selectedBooking.screening?.auditorium?.name || 'N/A'}</div>
                          <div><span className="font-medium">Định dạng:</span> {selectedBooking.screening?.format || 'N/A'}</div>
                          {selectedBooking.seats && selectedBooking.seats.length > 0 && (
                            <div><span className="font-medium">Ghế ngồi:</span> {selectedBooking.seats.map(seat => `${seat.rowLabel}${seat.number}`).join(', ')}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {payment && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><span className="font-medium">Phương thức:</span> {payment.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}</div>
                            <div><span className="font-medium">Trạng thái:</span> {payment.status === 'PENDING' ? 'Chờ thanh toán' : payment.status === 'SUCCESS' ? 'Đã thanh toán' : 'Thất bại'}</div>
                            <div><span className="font-medium">Số tiền:</span> {formatVND(payment.amount)}</div>
                            {payment.note && <div><span className="font-medium">Ghi chú:</span> {payment.note}</div>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button 
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        onClick={handleBackToHome}
                      >
                        🏠 Về trang chủ
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">🎫</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Chọn vé để xem chi tiết</h3>
                    <p className="text-gray-500">Nhấn vào vé trong danh sách để xem thông tin chi tiết</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có vé nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa đặt vé nào. Hãy khám phá những bộ phim hay và đặt vé ngay!</p>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Khám phá phim
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
