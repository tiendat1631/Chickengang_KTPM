// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './AdminReports.css';

/**
 * Admin Reports component
 * @returns {React.ReactElement}
 */
const AdminReports = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('week');
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    revenueTrend: [],
    topMovies: [],
    topUsers: []
  });

  useEffect(() => {
    fetchReportData();
  }, [timePeriod]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch data from backend analytics APIs
      const [dashboardStatsResponse, revenueTrendResponse, topMoviesResponse, topUsersResponse] = await Promise.all([
        apiClient.get('/v1/reports/dashboard-stats'),
        apiClient.get(`/v1/reports/revenue-trend?period=${timePeriod}`),
        apiClient.get('/v1/reports/top-movies?limit=5'),
        apiClient.get('/v1/reports/top-users?limit=5')
      ]);

      // Parse responses
      const dashboardStats = dashboardStatsResponse.data?.data;
      const revenueTrend = revenueTrendResponse.data?.data;
      const topMovies = topMoviesResponse.data?.data || [];
      const topUsers = topUsersResponse.data?.data || [];

      console.log('Top movies data:', topMovies);
      console.log('Top users data:', topUsers);

      // Transform topMovies to add 'name' field for chart
      const transformedTopMovies = topMovies.map(movie => ({
        ...movie,
        name: movie.title // Add 'name' field for XAxis dataKey
      }));

      setReportData({
        totalRevenue: dashboardStats?.totalRevenue || 0,
        totalBookings: dashboardStats?.totalBookings || 0,
        averageBookingValue: dashboardStats?.averageBookingValue || 0,
        revenueTrend: revenueTrend?.dataPoints || [],
        topMovies: transformedTopMovies,
        topUsers: topUsers
      });
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập báo cáo.');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else {
        toast.error('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
      }
      
      // Set default empty data
      setReportData({
        totalRevenue: 0,
        totalBookings: 0,
        averageBookingValue: 0,
        revenueTrend: [],
        topMovies: [],
        topUsers: []
      });
    } finally {
      setIsLoading(false);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatPeriod = (period) => {
    const periodMap = {
      'day': 'Hôm nay',
      'week': '7 ngày qua',
      'month': 'Tháng này'
    };
    return periodMap[period] || period;
  };

  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

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
        <p>Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  return (
    <div className="admin-reports">
      <div className="page-header">
        <h1>Báo cáo & Thống kê</h1>
        <div className="period-selector">
          <label>Khoảng thời gian:</label>
          <select 
            value={timePeriod} 
            onChange={(e) => setTimePeriod(e.target.value)}
            className="period-select"
          >
            <option value="day">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>{formatCurrency(reportData.totalRevenue)}</h3>
            <p>Tổng doanh thu ({formatPeriod(timePeriod)})</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🎫</div>
          <div className="card-content">
            <h3>{reportData.totalBookings}</h3>
            <p>Tổng số đặt vé</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>{formatCurrency(reportData.averageBookingValue)}</h3>
            <p>Giá trị đặt vé trung bình</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>Xu hướng doanh thu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Doanh thu' : 'Số đặt vé'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#667eea" 
                strokeWidth={2}
                name="revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Top phim theo doanh thu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.topMovies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
              <Bar dataKey="revenue" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        <div className="table-container">
          <h2>Top phim</h2>
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Phim</th>
                  <th>Doanh thu</th>
                  <th>Số đặt vé</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topMovies.map((movie, index) => (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td className="revenue">{formatCurrency(movie.revenue)}</td>
                    <td>{movie.bookingCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <h2>Top người dùng</h2>
          <div className="table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Tổng chi tiêu</th>
                  <th>Số đặt vé</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td className="revenue">{formatCurrency(user.totalSpent)}</td>
                    <td>{user.bookingCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <h2>Xuất báo cáo</h2>
        <div className="export-actions">
          <button className="btn btn-primary">
            📊 Xuất Excel
          </button>
          <button className="btn btn-secondary">
            📄 Xuất PDF
          </button>
          <button className="btn btn-outline" onClick={fetchReportData}>
            🔄 Làm mới dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
