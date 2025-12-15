// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

/**
 * Admin Dashboard component - Main admin overview page
 * @returns {React.ReactElement}
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    topMovies: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có thời gian';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard stats from backend analytics API
      const statsResponse = await apiClient.get('/v1/reports/dashboard-stats');
      
      if (statsResponse.data?.data) {
        const dashboardData = statsResponse.data.data;
        console.log('Dashboard data received:', dashboardData);
        console.log('Recent bookings:', dashboardData.recentBookings);
        setStats({
          totalUsers: dashboardData.totalUsers || 0,
          totalMovies: dashboardData.totalMovies || 0,
          totalBookings: dashboardData.totalBookings || 0,
          totalRevenue: dashboardData.totalRevenue || 0,
          recentBookings: dashboardData.recentBookings || [],
          topMovies: dashboardData.topMovies || []
        });
      } else {
        // Fallback to individual API calls if analytics endpoint fails
        const [moviesResponse, bookingsResponse, usersResponse] = await Promise.all([
          apiClient.get('/v1/movies', { params: { page: 0, size: 100 } }),
          apiClient.get('/v1/bookings', { params: { page: 0, size: 100 } }),
          apiClient.get('/v1/users', { params: { page: 0, size: 100 } })
        ]);

      setStats({
          totalUsers: usersResponse.data?.data?.totalElements || 0,
        totalMovies: moviesResponse.data?.data?.length || 0,
        totalBookings: bookingsResponse.data?.data?.length || 0,
          totalRevenue: bookingsResponse.data?.data?.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) || 0,
        recentBookings: bookingsResponse.data?.data?.slice(0, 5) || [],
        topMovies: moviesResponse.data?.data?.slice(0, 5) || []
      });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập dữ liệu dashboard.');
      } else {
        toast.error('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      }
      
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalMovies: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
        topMovies: []
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Chào mừng, {user.username}! Đây là tổng quan hệ thống.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-content">
            <h3>{stats.totalMovies}</h3>
            <p>Tổng phim</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Tổng đặt vé</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="action-grid">
          <Link to="/admin/movies" className="action-card">
            <div className="action-icon">🎬</div>
            <h3>Quản lý phim</h3>
            <p>Thêm, sửa, xóa phim</p>
          </Link>
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Quản lý người dùng</h3>
            <p>Xem và quản lý tài khoản</p>
          </Link>
          <Link to="/admin/auditoriums" className="action-card">
            <div className="action-icon">🏢</div>
            <h3>Quản lý phòng chiếu</h3>
            <p>Cấu hình phòng chiếu</p>
          </Link>
          <Link to="/admin/screenings" className="action-card">
            <div className="action-icon">📅</div>
            <h3>Quản lý lịch chiếu</h3>
            <p>Tạo và quản lý lịch chiếu</p>
          </Link>
          <Link to="/admin/bookings" className="action-card">
            <div className="action-icon">🎫</div>
            <h3>Quản lý đặt vé</h3>
            <p>Xem và quản lý đặt vé</p>
          </Link>
          <Link to="/admin/payments" className="action-card">
            <div className="action-icon">💳</div>
            <h3>Quản lý thanh toán</h3>
            <p>Xác nhận và hoàn tiền</p>
          </Link>
          <Link to="/admin/reports" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Báo cáo</h3>
            <p>Thống kê và báo cáo</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          {stats.recentBookings.length > 0 ? (
            stats.recentBookings.map((booking) => (
              <div key={booking.id} className="activity-item">
                <div className="activity-icon">🎫</div>
                <div className="activity-content">
                  <p><strong>Đặt vé mới</strong></p>
                  <p>ID: {booking.id} - {booking.totalPrice?.toLocaleString('vi-VN')} VNĐ</p>
                  <p className="activity-time">
                    {formatDateTime(booking.createdOn)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activity">Chưa có hoạt động nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
