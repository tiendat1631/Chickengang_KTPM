import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useScreening, useSeats } from '@/hooks/useScreenings'
import Header from '@/components/common/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import './SeatSelectionPage.css'

// Utility function for currency formatting
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Map backend status to display status
const getDisplayStatus = (backendStatus) => {
  if (backendStatus === 'AVAILABLE') return 'available';
  if (backendStatus === 'BOOKED') return 'booked';
  // ISSUED, USED, CANCELLED all show as SOLD
  return 'sold';
}

export default function SeatSelectionPage() {
  const { movieId, screeningId } = useParams()
  const navigate = useNavigate()
  const [screening, setScreening] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const screeningIdNum = screeningId ? parseInt(screeningId) : 0

  const {
    data: screeningData,
    isLoading: screeningLoading,
    error: screeningError,
  } = useScreening(screeningIdNum)

  const {
    data: seatsData,
    isLoading: seatsLoading,
    error: seatsError,
  } = useSeats(screeningIdNum)

  useEffect(() => {
    if (screeningData) {
      // Transform API data to match our interface
      const transformedScreening = {
        id: screeningData.id,
        startTime: screeningData.startTime,
        endTime: screeningData.endTime,
        format: screeningData.format === 'TwoD' ? '2D' : screeningData.format === 'ThreeD' ? '3D' : screeningData.format,
        auditorium: {
          id: screeningData.auditoriumId,
          name: screeningData.auditoriumName
        },
        movie: {
          id: screeningData.movieId,
          title: screeningData.movieTitle
        }
      }
      setScreening(transformedScreening)
    }
  }, [screeningData])

  useEffect(() => {
    if (seatsData && seatsData.length > 0) {
      console.log('Raw seats data from API:', seatsData);
      // Transform API data to match our interface
      const transformedSeats = seatsData.map((seat) => ({
        id: seat.id,
        rowLabel: seat.rowLabel,
        number: seat.number,
        seatType: seat.seatType,
        status: seat.status
      }))
      console.log('Transformed seats:', transformedSeats);
      setSeats(transformedSeats)
    } else {
      console.log('No seats data received');
      // Fallback: generate a default 8x10 layout for UI demo
      const generated = []
      const rows = 8
      const cols = 10
      for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + r) // A-H
        for (let c = 1; c <= cols; c++) {
          const isSweetbox = r >= rows - 2 // last 2 rows are sweetbox
          generated.push({
            id: r * 100 + c,
            rowLabel,
            number: c,
            seatType: isSweetbox ? 'SWEETBOX' : 'NORMAL',
            status: 'AVAILABLE',
          })
        }
      }
      setSeats(generated)
    }
  }, [seatsData])

  useEffect(() => {
    setLoading(screeningLoading || seatsLoading)
    setError(screeningError?.message || seatsError?.message || null)
  }, [screeningLoading, seatsLoading, screeningError, seatsError])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleSeatClick = (seat) => {
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

  const getSeatPrice = (seat) => {
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
    
    if (!screening) {
      alert('Không tìm thấy thông tin suất chiếu')
      return
    }
    
    // Prepare booking data
    const bookingData = {
      screening: screening,
      selectedSeats: selectedSeats.map(seat => ({
        ...seat,
        price: getSeatPrice(seat)
      })),
      totalPrice: getTotalPrice()
    }
    
    // Navigate to booking page with data
    navigate(`/booking/${movieId}`, { 
      state: bookingData 
    })
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
      
      {/* Synced Header Section */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: "Trang chủ", href: "/" },
              { label: screening.movie.title, href: `/movies/${movieId}` },
              { label: "Chọn suất", href: `/movies/${movieId}/screenings` },
              { label: "Chọn ghế" }
            ]}
          />
          
          {/* Page Title */}
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Chọn ghế - {screening.movie.title}
            </h1>
            <p className="text-white/90 text-base md:text-lg font-medium">
              Chọn ghế phù hợp cho suất chiếu của bạn
            </p>
          </div>
        </div>
      </header>

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

          <div className="seats-container">
            {(() => {
              // Calculate max seats per row to determine grid columns
              const maxSeatsPerRow = Math.max(
                ...Array.from({ length: 26 }, (_, i) => {
                  const rowLabel = String.fromCharCode(65 + i)
                  return seats.filter(seat => seat.rowLabel === rowLabel).length
                }),
                10 // minimum 10 columns
              )
              
              // Get unique row labels from seats data
              const uniqueRowLabels = [...new Set(seats.map(seat => seat.rowLabel))].sort()
              
              return uniqueRowLabels.map((rowLabel) => {
                const rowSeats = seats.filter(seat => seat.rowLabel === rowLabel)
                
                return (
                  <div key={rowLabel} className="seat-row">
                    <div className="row-label">{rowLabel}</div>
                    <div 
                      className="seat-row-grid"
                      style={{ gridTemplateColumns: `repeat(${maxSeatsPerRow}, 1fr)` }}
                    >
                      {rowSeats.map((seat) => (
                        <button
                          key={seat.id}
                          className={`seat ${getDisplayStatus(seat.status)} ${seat.seatType.toLowerCase()} ${
                            selectedSeats.some(s => s.id === seat.id) ? 'selected' : ''
                          }`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status !== 'AVAILABLE'}
                          title={`${seat.rowLabel}${seat.number} - ${formatVND(getSeatPrice(seat))}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })
            })()}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-icon available"></div>
              <span>Có thể chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon booked"></div>
              <span>Đang giữ chỗ</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon sold"></div>
              <span>Đã bán</span>
            </div>
            <div className="legend-item">
              <div className="seat-icon selected"></div>
              <span>Đang chọn</span>
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
                    {seat.rowLabel}{seat.number} (<span className="whitespace-nowrap">{formatVND(getSeatPrice(seat))}</span>)
                  </span>
                ))}
              </div>
            ) : (
              <p>Chưa chọn ghế nào</p>
            )}
          </div>
          
          <div className="total-price">
            <h3>Tổng tiền: <span className="whitespace-nowrap">{formatVND(getTotalPrice())}</span></h3>
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
