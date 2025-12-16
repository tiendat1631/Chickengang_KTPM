// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
import apiClient from '@/services/api.js';
import toast from 'react-hot-toast';
import './AdminUserManagement.css';

/**
 * Admin User Management component
 * @returns {React.ReactElement}
 */
const AdminUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDetails, setShowUserDetails] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.get('/v1/users', {
        params: { 
          page: currentPage, 
          size: pageSize,
          search: searchQuery.trim() || undefined
        }
      });
      
      // Handle ApiResponse structure from backend
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setUsers(pageData.content || []);
        setTotalElements(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 0);
      } else {
        // Fallback if response structure is different
        setUsers([]);
        setTotalElements(0);
        setTotalPages(0);
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách người dùng!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách người dùng!');
      }
      
      setUsers([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await apiClient.patch(`/v1/users/${userId}`, {
        isActive: !currentStatus
      });
      
      toast.success(`Đã ${currentStatus ? 'khóa' : 'mở khóa'} người dùng thành công!`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user status:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền cập nhật trạng thái người dùng!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy người dùng!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái người dùng!');
      }
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const userResponse = await apiClient.get(`/v1/users/${userId}`);
      
      // Handle ApiResponse structure from backend
      if (userResponse.data && userResponse.data.data) {
        setShowUserDetails(userResponse.data.data);
      } else {
        toast.error('Không tìm thấy thông tin người dùng!');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền xem thông tin người dùng!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy thông tin người dùng!');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi máy chủ. Vui lòng thử lại sau!');
      } else {
        toast.error('Có lỗi xảy ra khi lấy thông tin người dùng!');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatRole = (role) => {
    return role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng';
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
    <div className="admin-user-management">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <div className="header-stats">
          <span>Tổng: {totalElements} người dùng</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm theo email, username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem.id}>
                <td>{userItem.id}</td>
                <td>{userItem.username}</td>
                <td>{userItem.email}</td>
                <td>{userItem.phoneNumber}</td>
                <td>
                  <span className={`role-badge ${userItem.role.toLowerCase()}`}>
                    {formatRole(userItem.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${userItem.isActive ? 'active' : 'inactive'}`}>
                    {userItem.isActive ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </td>
                <td>{formatDate(userItem.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewDetails(userItem.id)}
                    >
                      Chi tiết
                    </button>
                    <button 
                      className={`btn btn-sm ${userItem.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleUserStatus(userItem.id, userItem.isActive)}
                    >
                      {userItem.isActive ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>Không tìm thấy người dùng nào.</p>
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

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi tiết người dùng</h2>
              <button 
                className="modal-close"
                onClick={() => setShowUserDetails(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="user-details">
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{showUserDetails.id}</span>
                </div>
                <div className="detail-row">
                  <label>Username:</label>
                  <span>{showUserDetails.username}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{showUserDetails.email}</span>
                </div>
                <div className="detail-row">
                  <label>Số điện thoại:</label>
                  <span>{showUserDetails.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <label>Địa chỉ:</label>
                  <span>{showUserDetails.address}</span>
                </div>
                <div className="detail-row">
                  <label>Ngày sinh:</label>
                  <span>{showUserDetails.dateOfBirth || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-row">
                  <label>Vai trò:</label>
                  <span className={`role-badge ${showUserDetails.role.toLowerCase()}`}>
                    {formatRole(showUserDetails.role)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Trạng thái:</label>
                  <span className={`status-badge ${showUserDetails.isActive ? 'active' : 'inactive'}`}>
                    {showUserDetails.isActive ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Ngày tạo:</label>
                  <span>{formatDate(showUserDetails.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <label>Cập nhật lần cuối:</label>
                  <span>{formatDate(showUserDetails.updatedAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowUserDetails(null)}
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

export default AdminUserManagement;
