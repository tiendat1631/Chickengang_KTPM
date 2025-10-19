import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatVND } from '@/utils/formatCurrency'
import './BookingPage.css'

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
      <div className="booking-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !bookingData) {
    return (
      <div className="booking-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="error">{error || 'Không tìm thấy thông tin đặt vé'}</div>
          <Link to={`/movies/${movieId}`} className="btn btn-primary">
            Quay lại trang phim
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <Header onSearch={() => {}} />
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Trang chủ", to: "/" },
            { label: bookingData.screening.movie.title, to: `/movies/${movieId}` },
            { label: "Chọn suất", to: `/movies/${movieId}/screenings` },
            { label: "Chọn ghế", to: `/booking/${movieId}/screening/${bookingData.screening.id}` },
            { label: "Thanh toán" }
          ]}
          className="mb-6"
        />

        <div className="booking-header">
          <h1>Xác nhận đặt vé</h1>
          <p>Vui lòng kiểm tra lại thông tin trước khi thanh toán</p>
        </div>

        <div className="booking-content">
          <div className="movie-info-section">
            <h2>Thông tin phim</h2>
            <div className="movie-details">
              <div className="movie-poster">
                <div className="movie-poster-placeholder">🎬</div>
              </div>
              <div className="movie-info">
                <h3>{bookingData.screening.movie.title}</h3>
                <div className="movie-meta">
                  <span><strong>Suất chiếu:</strong> {formatTime(bookingData.screening.startTime)}</span>
                  <span><strong>Ngày:</strong> {formatDate(bookingData.screening.startTime)}</span>
                  <span><strong>Phòng:</strong> {bookingData.screening.auditorium.name}</span>
                  <span><strong>Định dạng:</strong> {bookingData.screening.format}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="seats-info-section">
            <h2>Ghế đã chọn</h2>
            <div className="selected-seats">
              {bookingData.selectedSeats.map((seat) => (
                <div key={seat.id} className="seat-item">
                  <span className="seat-label">{seat.rowLabel}{seat.number}</span>
                  <span className="seat-type">{seat.seatType === 'SWEETBOX' ? 'Sweetbox' : 'Thường'}</span>
                  <span className="seat-price"><span className="whitespace-nowrap">{formatVND(seat.price)}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-section">
            <h2>Thông tin thanh toán</h2>
            <div className="payment-summary">
              <div className="summary-row">
                <span>Số ghế:</span>
                <span>{bookingData.selectedSeats.length} ghế</span>
              </div>
              <div className="summary-row">
                <span>Giá vé:</span>
                <span className="whitespace-nowrap">{formatVND(bookingData.totalPrice)}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="whitespace-nowrap">{formatVND(bookingData.totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-secondary"
              onClick={handleBackToSeatSelection}
            >
              ← Chọn lại ghế
            </button>
            <button 
              className="btn btn-primary"
              onClick={handlePayment}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
