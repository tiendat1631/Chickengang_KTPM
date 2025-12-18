import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import apiClient from '@/services/api'
import { cancelBooking as cancelBookingApi } from '@/services/bookingApi'
import { updatePaymentMethod as updatePaymentMethodApi } from '@/services/paymentApi'
import useWebSocket from '@/hooks/useWebSocket'

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    method: 'BANK_TRANSFER',
    note: ''
  })

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
    isLoading: paymentLoading,
    refetch: refetchPayment
  } = useQuery({
    queryKey: ['payment', selectedBooking?.id],
    queryFn: async () => {
      if (!selectedBooking?.id) return null
      const response = await apiClient.get(`/v1/payments/booking/${selectedBooking.id}`)
      return response.data.data
    },
    enabled: !!selectedBooking?.id
  })

  useEffect(() => {
    if (!selectedBooking && bookings && bookings.length > 0) {
      setSelectedBooking(bookings[0])
    }
  }, [bookings, selectedBooking])

  useEffect(() => {
    if (payment) {
      setPaymentForm({
        method: payment.paymentMethod || 'BANK_TRANSFER',
        note: payment.note || ''
      })
    } else {
      setShowPaymentForm(false)
    }
  }, [payment])

  useEffect(() => {
    setActionMessage(null)
    setActionError(null)
    setShowPaymentForm(false)
  }, [selectedBooking?.id])

  // WebSocket for Real-time Payment Updates
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected || !bookings || bookings.length === 0) return

    const subscriptions = []

    bookings.forEach((booking) => {
      if (booking.bookingStatus === 'PENDING') {
        const sub = subscribe(`/topic/booking/${booking.id}/payment`, (message) => {
          console.log('Payment update received:', message)
          refetch()
          if (selectedBooking?.id === booking.id) {
            refetchPayment()
          }
        })
        if (sub) subscriptions.push(sub)
      }
    })

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe())
    }
  }, [bookings, isConnected, subscribe, refetch, refetchPayment, selectedBooking?.id])

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

  const getPaymentMethodLabel = (method) => {
    if (method === 'CASH') return 'Tiền mặt'
    if (method === 'BANK_TRANSFER') return 'Chuyển khoản'
    return method || 'Không xác định'
  }

  const getPaymentStatusLabel = (status) => {
    if (status === 'PENDING') return 'Chờ thanh toán'
    if (status === 'SUCCESS') return 'Đã thanh toán'
    if (status === 'FAILED') return 'Thất bại'
    if (status === 'CANCELLED') return 'Đã hủy'
    return status || 'Không xác định'
  }

  const pendingActionsAvailable =
    selectedBooking &&
    payment &&
    selectedBooking.bookingStatus === 'PENDING' &&
    payment.status === 'PENDING'

  const handleCancelBooking = async () => {
    if (!selectedBooking) return
    const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đặt vé này?')
    if (!confirmed) return

    setIsCancelling(true)
    setActionMessage(null)
    setActionError(null)
    try {
      await cancelBookingApi(selectedBooking.id)
      setActionMessage('Hủy đặt vé thành công.')
      await refetch()
      await refetchPayment()
    } catch (err) {
      const message = err?.response?.data?.message || 'Hủy đặt vé thất bại.'
      setActionError(message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePaymentUpdate = async () => {
    if (!payment) return
    setIsUpdatingPayment(true)
    setActionMessage(null)
    setActionError(null)
    try {
      await updatePaymentMethodApi(payment.id, {
        paymentMethod: paymentForm.method,
        note: paymentForm.note
      })
      setActionMessage('Cập nhật phương thức thanh toán thành công.')
      await refetchPayment()
      await refetch()
      setShowPaymentForm(false)
    } catch (err) {
      const message = err?.response?.data?.message || 'Cập nhật phương thức thất bại.'
      setActionError(message)
    } finally {
      setIsUpdatingPayment(false)
    }
  }

  const handlePaymentFormChange = (field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value
    }))
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
        <Header onSearch={() => { }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl font-medium">Đang tải vé của bạn...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <Header onSearch={() => { }} />
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
      <Header onSearch={() => { }} />

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
                    Danh sách đặt chỗ ({bookings.length})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Mỗi đặt chỗ có thể gồm nhiều vé
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedBooking?.id === booking.id
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
                            <div><span className="font-medium">Mã đặt chỗ:</span> <span className="font-mono">{booking.bookingCode}</span></div>
                            <div><span className="font-medium">Số vé:</span> <span className="font-semibold text-blue-600">{booking.tickets?.length || booking.seats?.length || 0} vé</span></div>
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
                            Đặt lúc: {booking.createOn ? formatDate(booking.createOn) : 'N/A'}
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
                      <h4 className="text-lg font-semibold text-green-900 mb-2">Mã đặt chỗ</h4>
                      <div className="text-xl font-bold text-green-700 font-mono">
                        {selectedBooking.bookingCode}
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        {selectedBooking.tickets?.length || selectedBooking.seats?.length || 0} vé trong đặt chỗ này
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
                        </div>
                      </div>
                    </div>

                    {/* Individual Tickets */}
                    {selectedBooking.tickets && selectedBooking.tickets.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Danh sách vé ({selectedBooking.tickets.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedBooking.tickets.map((ticket, index) => (
                            <div key={ticket.id || index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-semibold text-blue-900">
                                      Vé #{index + 1}
                                    </div>
                                    {ticket.ticketCode && (
                                      <div className="px-2 py-1 bg-blue-100 rounded border border-blue-300">
                                        <span className="text-xs text-blue-800 font-medium">Mã vé:</span>
                                        <span className="text-xs text-blue-900 font-mono font-bold ml-1">
                                          {ticket.ticketCode}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {ticket.seat && (
                                    <div className="text-sm text-gray-700 mb-1">
                                      <span className="font-medium">Ghế:</span>
                                      <span className="ml-1 font-semibold text-gray-900">
                                        {ticket.seat.rowLabel}{ticket.seat.number}
                                      </span>
                                      {ticket.seat.seatType && (
                                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-200 text-blue-800 font-medium">
                                          {ticket.seat.seatType}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {ticket.status && (
                                    <div className="text-xs text-gray-600 mt-2">
                                      <span className="font-medium">Trạng thái:</span>
                                      <span className={`ml-1 px-2 py-0.5 rounded ${ticket.status === 'ISSUED' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-800' :
                                          ticket.status === 'USED' ? 'bg-gray-100 text-gray-800' :
                                            ticket.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                              'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ticket.status === 'ISSUED' ? 'Đã phát hành' :
                                          ticket.status === 'BOOKED' ? 'Đã đặt' :
                                            ticket.status === 'USED' ? 'Đã sử dụng' :
                                              ticket.status === 'CANCELLED' ? 'Đã hủy' : ticket.status}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : selectedBooking.seats && selectedBooking.seats.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Ghế đã đặt ({selectedBooking.seats.length})
                        </h4>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Ghế ngồi:</span> {selectedBooking.seats.map(seat => `${seat.rowLabel}${seat.number}`).join(', ')}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Payment Information */}
                    {payment && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><span className="font-medium">Phương thức:</span> {getPaymentMethodLabel(payment.paymentMethod)}</div>
                            <div><span className="font-medium">Trạng thái:</span> {getPaymentStatusLabel(payment.status)}</div>
                            <div><span className="font-medium">Số tiền:</span> {formatVND(payment.amount)}</div>
                            {payment.note && <div><span className="font-medium">Ghi chú:</span> {payment.note}</div>}
                          </div>
                        </div>
                      </div>
                    )}

                    {pendingActionsAvailable && (
                      <div className="space-y-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div>
                          <h4 className="text-lg font-semibold text-yellow-900">Đang chờ duyệt</h4>
                          <p className="text-sm text-yellow-800 mt-1">
                            Bạn có thể hủy vé hoặc đổi phương thức thanh toán trước khi quản trị viên duyệt đơn này.
                          </p>
                        </div>
                        {actionMessage && (
                          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            {actionMessage}
                          </div>
                        )}
                        {actionError && (
                          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {actionError}
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            className="flex-1 px-4 py-3 rounded-lg font-semibold border border-red-300 text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-60"
                            onClick={handleCancelBooking}
                            disabled={isCancelling}
                          >
                            {isCancelling ? 'Đang hủy...' : 'Hủy đặt vé'}
                          </button>
                          <button
                            className="flex-1 px-4 py-3 rounded-lg font-semibold border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition-colors disabled:opacity-60"
                            onClick={() => setShowPaymentForm((prev) => !prev)}
                            disabled={isUpdatingPayment}
                          >
                            {showPaymentForm ? 'Đóng' : 'Đổi phương thức thanh toán'}
                          </button>
                        </div>
                        {showPaymentForm && (
                          <div className="space-y-3 bg-white border border-yellow-200 rounded-lg p-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
                              <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={paymentForm.method}
                                onChange={(e) => handlePaymentFormChange('method', e.target.value)}
                              >
                                <option value="BANK_TRANSFER">Chuyển khoản</option>
                                <option value="CASH">Tiền mặt</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho quản trị viên</label>
                              <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={3}
                                value={paymentForm.note}
                                onChange={(e) => handlePaymentFormChange('note', e.target.value)}
                                placeholder="Ví dụ: Tôi muốn thanh toán bằng tiền mặt khi nhận vé."
                              />
                            </div>
                            <button
                              className="w-full px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                              onClick={handlePaymentUpdate}
                              disabled={isUpdatingPayment}
                            >
                              {isUpdatingPayment ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
                            </button>
                          </div>
                        )}
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
