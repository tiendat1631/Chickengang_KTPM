// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminMovieManagement.css';

/**
 * Admin Movie Management component
 * @returns {React.ReactElement}
 */
const AdminMovieManagement = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    actors: '',
    genres: '',
    releaseDate: '',
    duration: '',
    language: '',
    rated: '',
    description: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/v1/movies', { 
        params: { page: 0, size: 100 } 
      });
      setMovies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
      // Show user-friendly error message
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập trang này.');
      } else {
        toast.error('Không thể tải danh sách phim. Vui lòng thử lại.');
      }
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
    if (!formData.title.trim()) {
      toast.error('Tên phim không được để trống!');
      return;
    }
    
    if (!formData.director.trim()) {
      toast.error('Tên đạo diễn không được để trống!');
      return;
    }
    
    if (!formData.actors.trim()) {
      toast.error('Tên diễn viên không được để trống!');
      return;
    }
    
    if (!formData.genres.trim()) {
      toast.error('Thể loại không được để trống!');
      return;
    }
    
    if (!formData.releaseDate) {
      toast.error('Ngày phát hành không được để trống!');
      return;
    }
    
    if (!formData.duration.trim()) {
      toast.error('Thời lượng không được để trống!');
      return;
    }
    
    if (!formData.language.trim()) {
      toast.error('Ngôn ngữ không được để trống!');
      return;
    }
    
    if (!formData.rated) {
      toast.error('Độ tuổi không được để trống!');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Mô tả không được để trống!');
      return;
    }
    
    try {
      if (editingMovie) {
        // Update existing movie
        await apiClient.patch(`/v1/movies/${editingMovie.id}`, formData);
        toast.success('Cập nhật phim thành công!');
      } else {
        // Create new movie
        await apiClient.post('/v1/movies', formData);
        toast.success('Thêm phim mới thành công!');
      }
      
      // Reset form and refresh data
      setFormData({
        title: '',
        director: '',
        actors: '',
        genres: '',
        releaseDate: '',
        duration: '',
        language: '',
        rated: '',
        description: ''
      });
      setShowAddForm(false);
      setEditingMovie(null);
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
      
      // Better error handling
      if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.');
      } else if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền thực hiện thao tác này!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy phim!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
      } else {
        toast.error('Có lỗi xảy ra khi lưu phim!');
      }
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      director: movie.director || '',
      actors: movie.actors || '',
      genres: movie.genres || '',
      releaseDate: movie.releaseDate || '',
      duration: movie.duration || '',
      language: movie.language || '',
      rated: movie.rated || '',
      description: movie.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await apiClient.delete(`/v1/movies/${movieId}`);
        toast.success('Xóa phim thành công!');
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
        
        // Better error handling
        if (error.response?.status === 401) {
          toast.error('Bạn cần đăng nhập lại!');
        } else if (error.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện thao tác này!');
        } else if (error.response?.status === 404) {
          toast.error('Không tìm thấy phim!');
        } else if (error.response?.status >= 500) {
          toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
        } else {
          toast.error('Có lỗi xảy ra khi xóa phim!');
        }
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMovie(null);
    setFormData({
      title: '',
      director: '',
      actors: '',
      genres: '',
      releaseDate: '',
      duration: '',
      language: '',
      rated: '',
      description: ''
    });
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
    <div className="admin-movie-management">
      <div className="page-header">
        <h1>Quản lý phim</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Thêm phim mới
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="movie-form-overlay">
          <div className="movie-form">
            <h2>{editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên phim *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Đạo diễn *</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Diễn viên *</label>
                  <input
                    type="text"
                    name="actors"
                    value={formData.actors}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thể loại *</label>
                  <input
                    type="text"
                    name="genres"
                    value={formData.genres}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày phát hành *</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thời lượng *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="VD: 120 phút"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngôn ngữ *</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Độ tuổi *</label>
                  <select
                    name="rated"
                    value={formData.rated}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn độ tuổi</option>
                    <option value="G">G - Mọi lứa tuổi</option>
                    <option value="PG">PG - Trẻ em cần giám sát</option>
                    <option value="PG-13">PG-13 - Trên 13 tuổi</option>
                    <option value="R">R - Trên 17 tuổi</option>
                    <option value="NC-17">NC-17 - Chỉ người lớn</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMovie ? 'Cập nhật' : 'Thêm phim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movies List */}
      <div className="movies-list">
        {movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-header">
                  <h3>{movie.title}</h3>
                  <div className="movie-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(movie)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(movie.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="movie-details">
                  <p><strong>Đạo diễn:</strong> {movie.director}</p>
                  <p><strong>Diễn viên:</strong> {movie.actors}</p>
                  <p><strong>Thể loại:</strong> {movie.genres}</p>
                  <p><strong>Ngày phát hành:</strong> {movie.releaseDate}</p>
                  <p><strong>Thời lượng:</strong> {movie.duration}</p>
                  <p><strong>Ngôn ngữ:</strong> {movie.language}</p>
                  <p><strong>Độ tuổi:</strong> {movie.rated}</p>
                  <p><strong>Mô tả:</strong> {movie.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-movies">
            <p>Chưa có phim nào. Hãy thêm phim đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovieManagement;
