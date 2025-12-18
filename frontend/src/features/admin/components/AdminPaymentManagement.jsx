// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import useWebSocket from '@/hooks/useWebSocket';
import './AdminPaymentManagement.css';

/**
 * Admin Payment Management component
 * @returns {React.ReactElement}
 */
const AdminPaymentManagement = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showPaymentDetails, setShowPaymentDetails] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, filters]);

  // WebSocket
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      console.log("Listening for payment updates...");
      const subscription = subscribe('/topic/payments', (message) => {
        console.log("Global payment update received:", message);
        fetchPayments();
      });
      return () => subscription.unsubscribe();
    }
  }, [isConnected, subscribe]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);

      const params = {
        page: currentPage,
        size: pageSize,
        sort: 'id,DESC'
      };

      const response = await apiClient.get('/v1/payments', { params });

      // Handle ApiResponse structure from backend
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setPayments(pageData.content || []);
        setTotalElements(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 0);
      } else {
        setPayments([]);
        setTotalElements(0);
        setTotalPages(0);
      }

    } catch (error) {
      console.error('Error fetching payments:', error);

      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách thanh toán!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách thanh toán!');
      }

      setPayments([]);
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
    fetchPayments();
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      status: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCompletePayment = async (paymentId, status) => {
    const statusText = status === 'SUCCESS' ? 'xác nhận thanh toán' : 'từ chối thanh toán';

    if (window.confirm(`Bạn có chắc chắn muốn ${statusText} này?`)) {
      try {
        setProcessingAction(paymentId);

        await apiClient.patch(`/v1/payments/${paymentId}/complete?status=${status}`);

        toast.success(`${status === 'SUCCESS' ? 'Xác nhận' : 'Từ chối'} thanh toán thành công!`);
        fetchPayments(); // Refresh the payment list
      } catch (error) {
        console.error('Error completing payment:', error);

        if (error.response?.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        } else if (error.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện thao tác này!');
        } else if (error.response?.status === 404) {
          toast.error('Không tìm thấy thanh toán!');
        } else if (error.response?.status >= 500) {
          toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
        } else {
          toast.error('Có lỗi xảy ra khi xử lý thanh toán!');
        }
      } finally {
        setProcessingAction(null);
      }
    }
  };

  const handleViewDetails = async (paymentId) => {
    try {
      // For now, we'll use the payment data from the list
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        setShowPaymentDetails(payment);
      } else {
        toast.error('Không tìm thấy thông tin thanh toán!');
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Có lỗi xảy ra khi lấy thông tin thanh toán!');
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

  const formatPaymentStatus = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xử lý',
      'SUCCESS': 'Thành công',
      'FAILED': 'Thất bại'
    };
    return statusMap[status] || status;
  };

  const formatPaymentMethod = (method) => {
    const methodMap = {
      'CASH': 'Tiền mặt',
      'BANK_TRANSFER': 'Chuyển khoản',
      'VNPAY': 'VNPay',
      'MOMO': 'MoMo'
    };
    return methodMap[method] || method;
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
    <div className="admin-payment-management">
      <div className="page-header">
        <h1>Quản lý thanh toán</h1>
        <div className="header-stats">
          <span>Tổng: {totalElements} thanh toán</span>
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
                placeholder="Transaction ID, Booking Code..."
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
                <option value="SUCCESS">Thành công</option>
                <option value="FAILED">Thất bại</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Phương thức</label>
              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Tất cả phương thức</option>
                <option value="CASH">Tiền mặt</option>
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="VNPAY">VNPay</option>
                <option value="MOMO">MoMo</option>
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

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction ID</th>
              <th>Booking Code</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngày thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>
                  <span className="transaction-id">{payment.transactionId}</span>
                </td>
                <td>
                  <span className="booking-code">{payment.bookingCode || 'N/A'}</span>
                </td>
                <td>
                  <span className="price">{formatCurrency(payment.amount)}</span>
                </td>
                <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                <td>
                  <span className={`status-badge ${payment.status.toLowerCase()}`}>
                    {formatPaymentStatus(payment.status)}
                  </span>
                </td>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewDetails(payment.id)}
                    >
                      Chi tiết
                    </button>

                    {payment.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleCompletePayment(payment.id, 'SUCCESS')}
                          disabled={processingAction === payment.id}
                        >
                          {processingAction === payment.id ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCompletePayment(payment.id, 'FAILED')}
                          disabled={processingAction === payment.id}
                        >
                          {processingAction === payment.id ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="no-payments">
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>Không tìm thấy thanh toán nào</h3>
              <p>Thử thay đổi bộ lọc để tìm kiếm thanh toán.</p>
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

      {/* Payment Details Modal */}
      {showPaymentDetails && (
        <div className="modal-overlay" onClick={() => setShowPaymentDetails(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết thanh toán</h2>
              <button
                className="modal-close"
                onClick={() => setShowPaymentDetails(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="payment-details">
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{showPaymentDetails.id}</span>
                </div>
                <div className="detail-row">
                  <label>Transaction ID:</label>
                  <span className="transaction-id">{showPaymentDetails.transactionId}</span>
                </div>
                <div className="detail-row">
                  <label>Booking Code:</label>
                  <span className="booking-code">{showPaymentDetails.bookingCode || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <label>Số tiền:</label>
                  <span className="price">{formatCurrency(showPaymentDetails.amount)}</span>
                </div>
                <div className="detail-row">
                  <label>Phương thức:</label>
                  <span>{formatPaymentMethod(showPaymentDetails.paymentMethod)}</span>
                </div>
                <div className="detail-row">
                  <label>Trạng thái:</label>
                  <span className={`status-badge ${showPaymentDetails.status.toLowerCase()}`}>
                    {formatPaymentStatus(showPaymentDetails.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Ngày thanh toán:</label>
                  <span>{formatDate(showPaymentDetails.paymentDate)}</span>
                </div>
                {showPaymentDetails.note && (
                  <div className="detail-row">
                    <label>Ghi chú:</label>
                    <span>{showPaymentDetails.note}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPaymentDetails(null)}
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

export default AdminPaymentManagement;

