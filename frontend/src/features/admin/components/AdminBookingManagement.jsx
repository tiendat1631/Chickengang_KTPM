// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminBookingManagement.css';

/**
 * Admin Booking Management component
 * @returns {React.ReactElement}
 */
const AdminBookingManagement = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showBookingDetails, setShowBookingDetails] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filters]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      const params = {
        page: currentPage,
        size: pageSize
      };

      // Add filters if provided
      if (filters.searchQuery.trim()) {
        params.search = filters.searchQuery.trim();
      }

      const response = await apiClient.get('/v1/bookings', { params });
      
      // Handle ApiResponse structure from backend
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setBookings(Array.isArray(pageData) ? pageData : []);
        setTotalElements(Array.isArray(pageData) ? pageData.length : 0);
        setTotalPages(1); // Simple pagination for now
      } else {
        setBookings([]);
        setTotalElements(0);
        setTotalPages(0);
      }
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách đặt vé!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách đặt vé!');
      }
      
      setBookings([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchBookings();
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = async (bookingId) => {
    try {
      // For now, we'll use the booking data from the list
      // In a real app, you might want to fetch detailed booking info
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setShowBookingDetails(booking);
      } else {
        toast.error('Không tìm thấy thông tin đặt vé!');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Có lỗi xảy ra khi lấy thông tin đặt vé!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatBookingStatus = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xử lý',
      'CONFIRMED': 'Đã xác nhận',
      'CANCELLED': 'Đã hủy',
      'COMPLETED': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-error">
        <h2>Không có quyền truy cập</h2>
        <p>Bạn cần có quyền admin để truy cập trang này.</p>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-booking-management">
      <div className="page-header">
        <h1>Quản lý đặt vé</h1>
        <div className="header-stats">
          <span>Tổng: {totalElements} đặt vé</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="filters-form">
          <div className="filter-row">
            <div className="filter-group">
              <label>Tìm kiếm</label>
              <input
                type="text"
                name="searchQuery"
                placeholder="Mã đặt vé, tên người dùng..."
                value={filters.searchQuery}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Trạng thái</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Từ ngày</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Đến ngày</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn btn-primary">
              🔍 Tìm kiếm
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đặt vé</th>
              <th>Người dùng</th>
              <th>Lịch chiếu</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>
                  <span className="booking-code">{booking.bookingCode}</span>
                </td>
                <td>{booking.username}</td>
                <td>ID: {booking.screeningId}</td>
                <td>
                  <span className="price">{formatCurrency(booking.totalPrice)}</span>
                </td>
                <td>
                  <span className={`status-badge ${booking.bookingStatus.toLowerCase()}`}>
                    {formatBookingStatus(booking.bookingStatus)}
                  </span>
                </td>
                <td>{formatDate(booking.createOn)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="no-bookings">
            <div className="empty-state">
              <div className="empty-icon">🎫</div>
              <h3>Không tìm thấy đặt vé nào</h3>
              <p>Thử thay đổi bộ lọc để tìm kiếm đặt vé.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Trước
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 1, currentPage - 2 + i));
              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button 
            className="btn btn-outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi tiết đặt vé</h2>
              <button 
                className="modal-close"
                onClick={() => setShowBookingDetails(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="booking-details">
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{showBookingDetails.id}</span>
                </div>
                <div className="detail-row">
                  <label>Mã đặt vé:</label>
                  <span className="booking-code">{showBookingDetails.bookingCode}</span>
                </div>
                <div className="detail-row">
                  <label>Người dùng:</label>
                  <span>{showBookingDetails.username}</span>
                </div>
                <div className="detail-row">
                  <label>Lịch chiếu:</label>
                  <span>ID: {showBookingDetails.screeningId}</span>
                </div>
                <div className="detail-row">
                  <label>Tổng tiền:</label>
                  <span className="price">{formatCurrency(showBookingDetails.totalPrice)}</span>
                </div>
                <div className="detail-row">
                  <label>Trạng thái:</label>
                  <span className={`status-badge ${showBookingDetails.bookingStatus.toLowerCase()}`}>
                    {formatBookingStatus(showBookingDetails.bookingStatus)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Ngày tạo:</label>
                  <span>{formatDate(showBookingDetails.createOn)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowBookingDetails(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;
