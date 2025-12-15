// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './UserProfile.css';

/**
 * User Profile component - Display and edit user information
 * @returns {React.ReactElement}
 */
const UserProfile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      // Since we don't have a specific user endpoint, we'll use the current user data
      // In a real app, you'd have a GET /api/v1/users/{id} endpoint
      const userDetails = {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || 'Chưa cập nhật',
        address: user.address || 'Chưa cập nhật',
        dateOfBirth: user.dateOfBirth || '',
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      };

      setUserData(userDetails);
      setFormData({
        username: userDetails.username || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        address: userDetails.address || '',
        dateOfBirth: userDetails.dateOfBirth || ''
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      // Since we don't have a user update endpoint, we'll just update local state
      // In a real app, you'd have a PATCH /api/v1/users/{id} endpoint
      const updatedUser = { ...userData, ...formData };
      setUserData(updatedUser);
      setIsEditing(false);

      // Show success message
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userData?.username || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      address: userData?.address || '',
      dateOfBirth: userData?.dateOfBirth || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem thông tin cá nhân.</p>
        <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {userData?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{userData?.username || 'Người dùng'}</h1>
          <p className="profile-email">{userData?.email}</p>
          <div className="profile-badges">
            <span className={`role-badge ${userData?.role?.toLowerCase()}`}>
              {userData?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
            </span>
            <span className={`status-badge ${userData?.isActive ? 'active' : 'inactive'}`}>
              {userData?.isActive ? 'Hoạt động' : 'Tạm khóa'}
            </span>
          </div>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Thông tin cá nhân</h2>
          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tên đăng nhập</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.username || 'Chưa cập nhật'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.email || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{userData?.phoneNumber || 'Chưa cập nhật'}</p>
                )}
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{formatDate(userData?.dateOfBirth)}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                />
              ) : (
                <p className="form-value">{userData?.address || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Thông tin tài khoản</h2>
          <div className="account-info">
            <div className="info-row">
              <label>ID tài khoản:</label>
              <span>{userData?.id}</span>
            </div>
            <div className="info-row">
              <label>Vai trò:</label>
              <span className={`role-badge ${userData?.role?.toLowerCase()}`}>
                {userData?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>
            <div className="info-row">
              <label>Trạng thái:</label>
              <span className={`status-badge ${userData?.isActive ? 'active' : 'inactive'}`}>
                {userData?.isActive ? 'Hoạt động' : 'Tạm khóa'}
              </span>
            </div>
            <div className="info-row">
              <label>Ngày tạo:</label>
              <span>{formatDateTime(userData?.createdAt)}</span>
            </div>
            <div className="info-row">
              <label>Cập nhật lần cuối:</label>
              <span>{formatDateTime(userData?.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Thao tác</h2>
          <div className="profile-actions-grid">
            <Link to="/my-tickets" className="action-card">
              <div className="action-icon">🎫</div>
              <h3>Vé của tôi</h3>
              <p>Xem lịch sử đặt vé</p>
            </Link>
            <button className="action-card" onClick={logout}>
              <div className="action-icon">🚪</div>
              <h3>Đăng xuất</h3>
              <p>Thoát khỏi tài khoản</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
