// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminAuditoriumManagement.css';

/**
 * Admin Auditorium Management component
 * @returns {React.ReactElement}
 */
const AdminAuditoriumManagement = () => {
  const { user } = useAuth();
  const [auditoriums, setAuditoriums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAuditorium, setEditingAuditorium] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    fetchAuditoriums();
  }, []);

  const fetchAuditoriums = async () => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.get('/v1/auditoriums', {
        params: { page: 0, size: 100 }
      });
      
      // Parse ApiResponse structure
      if (response.data?.data) {
        setAuditoriums(response.data.data);
      } else {
        setAuditoriums([]);
      }
    } catch (error) {
      console.error('Error fetching auditoriums:', error);
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách phòng chiếu.');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      } else {
        toast.error('Không thể tải danh sách phòng chiếu. Vui lòng thử lại.');
      }
      
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
    if (!formData.name.trim()) {
      toast.error('Tên phòng chiếu không được để trống!');
      return;
    }
    
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      toast.error('Sức chứa phải là số nguyên dương!');
      return;
    }
    
    try {
      if (editingAuditorium) {
        // Update existing auditorium
        await apiClient.patch(`/v1/auditoriums/${editingAuditorium.id}`, formData);
        toast.success('Cập nhật phòng chiếu thành công!');
      } else {
        // Create new auditorium
        await apiClient.post('/v1/auditoriums', formData);
        toast.success('Thêm phòng chiếu mới thành công!');
      }
      
      // Reset form and refresh data
      setFormData({
        name: '',
        capacity: '',
        description: ''
      });
      setShowAddForm(false);
      setEditingAuditorium(null);
      fetchAuditoriums();
    } catch (error) {
      console.error('Error saving auditorium:', error);
      
      // Better error handling
      if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.');
      } else if (error.response?.status === 401) {
        toast.error('Bạn cần đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền thực hiện thao tác này!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy phòng chiếu!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
      } else {
        toast.error('Có lỗi xảy ra khi lưu phòng chiếu!');
      }
    }
  };

  const handleEdit = (auditorium) => {
    setEditingAuditorium(auditorium);
    setFormData({
      name: auditorium.name || '',
      capacity: auditorium.capacity || '',
      description: auditorium.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (auditoriumId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng chiếu này?')) {
      try {
        await apiClient.delete(`/v1/auditoriums/${auditoriumId}`);
        toast.success('Xóa phòng chiếu thành công!');
        fetchAuditoriums();
      } catch (error) {
        console.error('Error deleting auditorium:', error);
        
        // Better error handling
        if (error.response?.status === 401) {
          toast.error('Bạn cần đăng nhập lại!');
        } else if (error.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện thao tác này!');
        } else if (error.response?.status === 404) {
          toast.error('Không tìm thấy phòng chiếu!');
        } else if (error.response?.status >= 500) {
          toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
        } else {
          toast.error('Có lỗi xảy ra khi xóa phòng chiếu!');
        }
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAuditorium(null);
    setFormData({
      name: '',
      capacity: '',
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
    <div className="admin-auditorium-management">
      <div className="page-header">
        <h1>Quản lý phòng chiếu</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Thêm phòng chiếu mới
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="auditorium-form-overlay">
          <div className="auditorium-form">
            <h2>{editingAuditorium ? 'Chỉnh sửa phòng chiếu' : 'Thêm phòng chiếu mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên phòng chiếu *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sức chứa *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAuditorium ? 'Cập nhật' : 'Thêm phòng chiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auditoriums List */}
      <div className="auditoriums-list">
        {auditoriums.length > 0 ? (
          <div className="auditoriums-grid">
            {auditoriums.map((auditorium) => (
              <div key={auditorium.id} className="auditorium-card">
                <div className="auditorium-header">
                  <h3>{auditorium.name}</h3>
                  <div className="auditorium-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(auditorium)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(auditorium.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="auditorium-details">
                  <p><strong>Sức chứa:</strong> {auditorium.capacity} ghế</p>
                  <p><strong>Mô tả:</strong> {auditorium.description || 'Chưa có mô tả'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-auditoriums">
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>Chưa có phòng chiếu nào</h3>
              <p>Hãy thêm phòng chiếu đầu tiên để bắt đầu quản lý!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Thêm phòng chiếu đầu tiên
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditoriumManagement;
