// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminScreeningManagement.css';

/**
 * Admin Screening Management component
 * @returns {React.ReactElement}
 */
const AdminScreeningManagement = () => {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScreening, setEditingScreening] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    auditoriumId: '',
    startTime: '',
    endTime: '',
    format: 'TwoD',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch movies for dropdown
      const moviesResponse = await apiClient.get('/v1/movies', { 
        params: { page: 0, size: 100 } 
      });
      // API returns PageResponse with content array
      const moviesPageData = moviesResponse.data?.data;
      const moviesList = moviesPageData?.content || (Array.isArray(moviesPageData) ? moviesPageData : []);
      setMovies(Array.isArray(moviesList) ? moviesList : []);

      // Fetch auditoriums for dropdown
      const auditoriumsResponse = await apiClient.get('/v1/auditoriums', {
        params: { page: 0, size: 100 }
      });
      // API returns PageResponse with content array or direct array
      const auditoriumsPageData = auditoriumsResponse.data?.data;
      const auditoriumsList = auditoriumsPageData?.content || (Array.isArray(auditoriumsPageData) ? auditoriumsPageData : []);
      setAuditoriums(Array.isArray(auditoriumsList) ? auditoriumsList : []);

      // Fetch screenings from real API
      const screeningsResponse = await apiClient.get('/v1/screenings/all', {
        params: { page: 0, size: 100 }
      });
      
      if (screeningsResponse.data?.data) {
        setScreenings(screeningsResponse.data.data);
      } else {
        setScreenings([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập trang này.');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      }
      
      setScreenings([]);
      setMovies([]);
      setAuditoriums([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.movieId) {
      toast.error('Vui lòng chọn phim!');
      return;
    }
    
    if (!formData.auditoriumId) {
      toast.error('Vui lòng chọn phòng chiếu!');
      return;
    }
    
    if (!formData.startTime) {
      toast.error('Vui lòng chọn giờ bắt đầu!');
      return;
    }
    
    if (!formData.endTime) {
      toast.error('Vui lòng chọn giờ kết thúc!');
      return;
    }
    
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu!');
      return;
    }
    
    try {
      // Convert datetime-local format to ISO 8601 format for backend
      const formatDateTimeForBackend = (dateTimeLocal) => {
        if (!dateTimeLocal) return null;
        // datetime-local format: "YYYY-MM-DDTHH:mm"
        // Convert to ISO 8601: "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm:ss.SSS"
        // Add seconds if not present
        if (dateTimeLocal.length === 16) {
          return dateTimeLocal + ':00'; // Add seconds
        }
        return dateTimeLocal;
      };

      const screeningData = {
        movieId: parseInt(formData.movieId),
        auditoriumId: parseInt(formData.auditoriumId),
        startTime: formatDateTimeForBackend(formData.startTime),
        endTime: formatDateTimeForBackend(formData.endTime),
        format: formData.format,
        status: formData.status
      };

      if (editingScreening) {
        // Update existing screening
        await apiClient.patch(`/v1/screenings?id=${editingScreening.id}`, screeningData);
        toast.success('Cập nhật lịch chiếu thành công!');
      } else {
        // Create new screening
        await apiClient.post('/v1/screenings', screeningData);
        toast.success('Thêm lịch chiếu mới thành công!');
      }
      
      // Reset form and refresh data
      setFormData({
        movieId: '',
        auditoriumId: '',
        startTime: '',
        endTime: '',
        format: 'TwoD',
        status: 'ACTIVE'
      });
      setShowAddForm(false);
      setEditingScreening(null);
      fetchData();
    } catch (error) {
      console.error('Error saving screening:', error);
      
      if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.');
      } else if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền thực hiện thao tác này!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy lịch chiếu!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
      } else {
        toast.error('Có lỗi xảy ra khi lưu lịch chiếu!');
      }
    }
  };

  const handleEdit = (screening) => {
    setEditingScreening(screening);
    setFormData({
      movieId: screening.movieId.toString(),
      auditoriumId: screening.auditoriumId.toString(),
      startTime: screening.startTime.substring(0, 16), // Format for datetime-local
      endTime: screening.endTime.substring(0, 16),
      format: screening.format,
      status: screening.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (screeningId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      try {
        await apiClient.delete(`/v1/screenings?id=${screeningId}`);
        toast.success('Xóa lịch chiếu thành công!');
        fetchData();
      } catch (error) {
        console.error('Error deleting screening:', error);
        
        if (error.response?.status === 401) {
          toast.error('Bạn cần đăng nhập lại!');
        } else if (error.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện thao tác này!');
        } else if (error.response?.status === 404) {
          toast.error('Không tìm thấy lịch chiếu!');
        } else if (error.response?.status >= 500) {
          toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
        } else {
          toast.error('Có lỗi xảy ra khi xóa lịch chiếu!');
        }
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingScreening(null);
    setFormData({
      movieId: '',
      auditoriumId: '',
      startTime: '',
      endTime: '',
      format: 'TwoD',
      status: 'ACTIVE'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const formatFormat = (format) => {
    const formatMap = {
      'TwoD': '2D',
      'ThreeD': '3D',
      'IMAX': 'IMAX'
    };
    return formatMap[format] || format;
  };

  const formatStatus = (status) => {
    const statusMap = {
      'ACTIVE': 'Hoạt động',
      'CANCELLED': 'Đã hủy',
      'FINISHED': 'Đã kết thúc'
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
    <div className="admin-screening-management">
      <div className="page-header">
        <h1>Quản lý lịch chiếu</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Thêm lịch chiếu mới
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="screening-form-overlay">
          <div className="screening-form">
            <h2>{editingScreening ? 'Chỉnh sửa lịch chiếu' : 'Thêm lịch chiếu mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Phim *</label>
                  <select
                    name="movieId"
                    value={formData.movieId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn phim</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phòng chiếu *</label>
                  <select
                    name="auditoriumId"
                    value={formData.auditoriumId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn phòng chiếu</option>
                    {auditoriums.map((auditorium) => (
                      <option key={auditorium.id} value={auditorium.id}>
                        {auditorium.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giờ bắt đầu *</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Giờ kết thúc *</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Định dạng *</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="TwoD">2D</option>
                    <option value="ThreeD">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="CANCELLED">Đã hủy</option>
                    <option value="FINISHED">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingScreening ? 'Cập nhật' : 'Thêm lịch chiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenings List */}
      <div className="screenings-list">
        {screenings.length > 0 ? (
          <div className="screenings-table-container">
            <table className="screenings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Phim</th>
                  <th>Phòng chiếu</th>
                  <th>Giờ bắt đầu</th>
                  <th>Giờ kết thúc</th>
                  <th>Định dạng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {screenings.map((screening) => (
                  <tr key={screening.id}>
                    <td>{screening.id}</td>
                    <td>{screening.movieTitle}</td>
                    <td>{screening.auditoriumName}</td>
                    <td>{formatDateTime(screening.startTime)}</td>
                    <td>{formatDateTime(screening.endTime)}</td>
                    <td>
                      <span className={`format-badge ${screening.format.toLowerCase()}`}>
                        {formatFormat(screening.format)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${screening.status.toLowerCase()}`}>
                        {formatStatus(screening.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(screening)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(screening.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-screenings">
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>Chưa có lịch chiếu nào</h3>
              <p>Hãy thêm lịch chiếu đầu tiên để bắt đầu quản lý!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Thêm lịch chiếu đầu tiên
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreeningManagement;
