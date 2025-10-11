import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import './SeatSelectionPage.css'

interface Seat {
  id: number
  rowLabel: string
  number: number
  seatType: 'NORMAL' | 'SWEETBOX'
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED'
}

interface Screening {
  id: number
  startTime: string
  endTime: string
  format: '2D' | '3D'
  auditorium: {
    id: number
    name: string
  }
  movie: {
    id: number
    title: string
  }
}

export default function SeatSelectionPage() {
  const { movieId, screeningId } = useParams<{ movieId: string; screeningId: string }>()
  const [screening, setScreening] = useState<Screening | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for now - will replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Mock screening data
        const mockScreening: Screening = {
          id: parseInt(screeningId || '1'),
          startTime: '2024-01-15T18:00:00',
          endTime: '2024-01-15T21:01:00',
          format: '2D',
          auditorium: { id: 1, name: 'Phòng 1' },
          movie: { id: parseInt(movieId || '1'), title: 'Avengers: Endgame' }
        }
        
        // Mock seats data
        const mockSeats: Seat[] = []
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        
        rows.forEach((row, rowIndex) => {
          for (let seatNum = 1; seatNum <= 12; seatNum++) {
            // Skip first and last seats in each row (aisles)
            if (seatNum === 1 || seatNum === 12) continue
            
            mockSeats.push({
              id: rowIndex * 12 + seatNum,
              rowLabel: row,
              number: seatNum,
              seatType: rowIndex >= 6 ? 'SWEETBOX' : 'NORMAL',
              status: Math.random() > 0.3 ? 'AVAILABLE' : 'SOLD' // 70% available
            })
          }
        })
        
        setScreening(mockScreening)
        setSeats(mockSeats)
        setError(null)
      } catch (err) {
        setError('Không thể tải dữ liệu ghế')
      } finally {
        setLoading(false)
      }
    }

    if (movieId && screeningId) {
      fetchData()
    }
  }, [movieId, screeningId])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'AVAILABLE') return

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id)
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id)
      } else {
        return [...prev, seat]
      }
    })
  }

  const getSeatPrice = (seat: Seat) => {
    return seat.seatType === 'SWEETBOX' ? 150000 : 120000
  }

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0)
  }

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế')
      return
    }
    
    // Navigate to booking page with selected seats
    const seatIds = selectedSeats.map(seat => seat.id).join(',')
    window.location.href = `/booking/${movieId}/screening/${screeningId}/seats/${seatIds}`
  }

  if (loading) {
    return (
      <div className="seat-selection-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error || !screening) {
    return (
      <div className="seat-selection-page">
        <Header onSearch={() => {}} />
        <div className="container">
          <div className="error">{error || 'Không tìm thấy suất chiếu'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="seat-selection-page">
      <Header onSearch={() => {}} />
      <div className="container">
        <div className="screening-info">
          <h1>{screening.movie.title}</h1>
          <div className="screening-details">
            <span><strong>Suất chiếu:</strong> {formatTime(screening.startTime)}</span>
            <span><strong>Phòng:</strong> {screening.auditorium.name}</span>
            <span><strong>Định dạng:</strong> {screening.format}</span>
          </div>
        </div>

        <div className="seat-selection-container">
          <div className="screen-indicator">
            <div className="screen">MÀN HÌNH</div>
          </div>

          <div className="seats-grid">
            {seats.map((seat) => (
              <button
                key={seat.id}
                className={`seat ${seat.status.toLowerCase()} ${seat.seatType.toLowerCase()} ${
                  selectedSeats.some(s => s.id === seat.id) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status !== 'AVAILABLE'}
                title={`${seat.rowLabel}${seat.number} - ${getSeatPrice(seat).toLocaleString('vi-VN')} VNĐ`}
              >
                {seat.number}
              </button>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-icon available"></div>
              <span>Có thể chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon sold"></div>
              <span>Đã bán</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon selected"></div>
              <span>Đã chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon sweetbox"></div>
              <span>Sweetbox</span>
            </div>
          </div>
        </div>

        <div className="booking-summary">
          <div className="selected-seats">
            <h3>Ghế đã chọn:</h3>
            {selectedSeats.length > 0 ? (
              <div className="seat-list">
                {selectedSeats.map((seat) => (
                  <span key={seat.id} className="seat-tag">
                    {seat.rowLabel}{seat.number} ({getSeatPrice(seat).toLocaleString('vi-VN')} VNĐ)
                  </span>
                ))}
              </div>
            ) : (
              <p>Chưa chọn ghế nào</p>
            )}
          </div>
          
          <div className="total-price">
            <h3>Tổng tiền: {getTotalPrice().toLocaleString('vi-VN')} VNĐ</h3>
          </div>

          <div className="action-buttons">
            <Link 
              to={`/movies/${movieId}/screenings`} 
              className="btn btn-secondary"
            >
              ← Quay lại
            </Link>
            <button 
              className="btn btn-primary"
              onClick={handleProceedToBooking}
              disabled={selectedSeats.length === 0}
            >
              Tiếp tục đặt vé
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
