// JavaScript file - no TypeScript checking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth.js';
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
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [selectedAuditorium, setSelectedAuditorium] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rows: '',
    columns: '',
    originalRows: '',
    originalColumns: ''
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
      
      console.log('Auditoriums API Response:', response.data);
      
      // Parse ApiResponse structure
      if (response.data?.data) {
        console.log('Auditoriums data:', response.data.data);
        setAuditoriums(response.data.data);
      } else {
        console.warn('No data in response:', response.data);
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
    
    if (editingAuditorium) {
      // Update: validate all fields if provided
      if (formData.rows && parseInt(formData.rows) <= 0) {
        toast.error('Số dãy phải là số nguyên dương!');
        return;
      }
      
      if (formData.columns && parseInt(formData.columns) <= 0) {
        toast.error('Số ghế mỗi dãy phải là số nguyên dương!');
        return;
      }
      
      try {
        const requestData = {
          name: formData.name.trim()
        };
        
        // Only include rows and columns if they actually changed from original values
        const rowsChanged = formData.rows && formData.rows !== '' && 
                           formData.rows !== formData.originalRows;
        const columnsChanged = formData.columns && formData.columns !== '' && 
                              formData.columns !== formData.originalColumns;
        
        if (rowsChanged) {
          requestData.rows = parseInt(formData.rows, 10);
        }
        if (columnsChanged) {
          requestData.columns = parseInt(formData.columns, 10);
        }
        
        await apiClient.patch(`/v1/auditoriums/${editingAuditorium.id}`, requestData);
        toast.success('Cập nhật phòng chiếu thành công!');
        
        // Reset form and refresh data
        setFormData({
          name: '',
          rows: '',
          columns: '',
          originalRows: '',
          originalColumns: ''
        });
        setShowAddForm(false);
        setEditingAuditorium(null);
        fetchAuditoriums();
      } catch (error) {
        console.error('Error updating auditorium:', error);
        handleError(error);
      }
    } else {
      // Create: validate all fields
      if (!formData.rows || parseInt(formData.rows) <= 0) {
        toast.error('Số dãy phải là số nguyên dương!');
        return;
      }
      
      if (!formData.columns || parseInt(formData.columns) <= 0) {
        toast.error('Số ghế mỗi dãy phải là số nguyên dương!');
        return;
      }
      
      try {
        const requestData = {
          name: formData.name.trim(),
          rows: parseInt(formData.rows, 10),
          columns: parseInt(formData.columns, 10)
        };
        await apiClient.post('/v1/auditoriums', requestData);
        toast.success('Thêm phòng chiếu mới thành công!');
        
        // Reset form and refresh data
        setFormData({
          name: '',
          rows: '',
          columns: '',
          originalRows: '',
          originalColumns: ''
        });
        setShowAddForm(false);
        setEditingAuditorium(null);
        fetchAuditoriums();
      } catch (error) {
        console.error('Error creating auditorium:', error);
        handleError(error);
      }
    }
  };

  const handleError = (error) => {
    // Better error handling
    if (error.response?.status === 400) {
      toast.error('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.');
    } else if (error.response?.status === 401) {
      toast.error('Bạn cần đăng nhập lại!');
    } else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    } else if (error.response?.status === 404) {
      toast.error('Không tìm thấy phòng chiếu!');
    } else if (error.response?.status === 409) {
      // Conflict - auditorium in use
      const errorMessage = error.response?.data?.message || 'Phòng chiếu đang được sử dụng. Không thể thay đổi cấu hình!';
      toast.error(errorMessage);
    } else if (error.response?.status >= 500) {
      toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
    } else {
      toast.error('Có lỗi xảy ra khi lưu phòng chiếu!');
    }
  };

  const handleEdit = (auditorium) => {
    setEditingAuditorium(auditorium);
    // Calculate rows and columns from seats if available
    let rows = '';
    let columns = '';
    if (auditorium.seats && auditorium.seats.length > 0) {
      const rowLabels = [...new Set(auditorium.seats.map(s => s.rowLabel))].sort();
      rows = rowLabels.length.toString();
      const firstRowSeats = auditorium.seats.filter(s => s.rowLabel === rowLabels[0]);
      columns = firstRowSeats.length.toString();
    }
    setFormData({
      name: auditorium.name || '',
      rows: rows,
      columns: columns,
      originalRows: rows, // Store original values to compare
      originalColumns: columns
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
        } else if (error.response?.status === 409) {
          // Conflict - auditorium in use
          const errorMessage = error.response?.data?.message || 'Phòng chiếu đang được sử dụng. Không thể xóa!';
          toast.error(errorMessage);
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
      rows: '',
      columns: ''
    });
  };

  const fetchSeats = async (auditoriumId) => {
    try {
      setLoadingSeats(true);
      const response = await apiClient.get(`/v1/seats/auditorium/${auditoriumId}`);
      
      if (response.data?.data) {
        setSeats(response.data.data);
      } else {
        setSeats([]);
      }
    } catch (error) {
      console.error('Error fetching seats:', error);
      toast.error('Không thể tải danh sách ghế. Vui lòng thử lại.');
      setSeats([]);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleViewSeats = async (auditorium) => {
    setSelectedAuditorium(auditorium);
    setShowSeatsModal(true);
    await fetchSeats(auditorium.id);
  };

  const handleCloseSeatsModal = () => {
    setShowSeatsModal(false);
    setSelectedAuditorium(null);
    setSeats([]);
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
                <label>Số dãy *</label>
                <input
                  type="number"
                  name="rows"
                  value={formData.rows}
                  onChange={handleInputChange}
                  min="1"
                  max="26"
                  placeholder="Ví dụ: 10"
                  required
                />
                <small className="form-hint">Số dãy ghế (A-Z, tối đa 26 dãy)</small>
              </div>

              <div className="form-group">
                <label>Số ghế mỗi dãy *</label>
                <input
                  type="number"
                  name="columns"
                  value={formData.columns}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Ví dụ: 15"
                  required
                />
                <small className="form-hint">Số lượng ghế trong mỗi dãy</small>
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
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewSeats(auditorium)}
                    >
                      Xem ghế
                    </button>
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
                  {auditorium.seats && auditorium.seats.length > 0 ? (
                    <>
                      {(() => {
                        const rowLabels = [...new Set(auditorium.seats.map(s => s.rowLabel))].sort();
                        const firstRowSeats = auditorium.seats.filter(s => s.rowLabel === rowLabels[0]);
                        return (
                          <p><strong>Cấu hình:</strong> {rowLabels.length} dãy × {firstRowSeats.length} ghế = {auditorium.seats.length} ghế</p>
                        );
                      })()}
                    </>
                  ) : (
                    <p><strong>Cấu hình:</strong> Chưa có thông tin</p>
                  )}
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

      {/* Seats Modal */}
      {showSeatsModal && (
        <div className="seats-modal-overlay" onClick={handleCloseSeatsModal}>
          <div className="seats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seats-modal-header">
              <h2>Danh sách ghế - {selectedAuditorium?.name}</h2>
              <button 
                className="btn btn-sm btn-close"
                onClick={handleCloseSeatsModal}
              >
                ×
              </button>
            </div>
            
            <div className="seats-modal-content">
              {loadingSeats ? (
                <div className="loading-seats">
                  <div className="loading-spinner"></div>
                  <p>Đang tải danh sách ghế...</p>
                </div>
              ) : seats.length > 0 ? (
                <div className="seats-container">
                  {(() => {
                    // Group seats by row and calculate columns
                    const seatsByRow = {};
                    seats.forEach(seat => {
                      if (!seatsByRow[seat.rowLabel]) {
                        seatsByRow[seat.rowLabel] = [];
                      }
                      seatsByRow[seat.rowLabel].push(seat);
                    });
                    
                    // Sort rows and seats within each row
                    const sortedRows = Object.keys(seatsByRow).sort();
                    sortedRows.forEach(rowLabel => {
                      seatsByRow[rowLabel].sort((a, b) => a.number - b.number);
                    });
                    
                    // Calculate max columns (seats per row)
                    const maxColumns = Math.max(...sortedRows.map(row => seatsByRow[row].length));
                    
                    return (
                      <div 
                        className="seats-grid" 
                        style={{ gridTemplateColumns: `repeat(${maxColumns}, 1fr)` }}
                      >
                        {sortedRows.map(rowLabel => 
                          seatsByRow[rowLabel].map((seat) => (
                            <div 
                              key={seat.id} 
                              className={`seat-item seat-${seat.seatType?.toLowerCase() || 'normal'}`}
                              title={`${seat.rowLabel}${seat.number} - ${seat.seatType || 'NORMAL'}`}
                            >
                              <span className="seat-label">{seat.rowLabel}{seat.number}</span>
                              <span className="seat-type-badge">{seat.seatType || 'NORMAL'}</span>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })()}
                  
                  <div className="seats-summary">
                    <p><strong>Tổng số ghế:</strong> {seats.length}</p>
                    <p><strong>Ghế thường:</strong> {seats.filter(s => s.seatType === 'NORMAL' || !s.seatType).length}</p>
                    <p><strong>Ghế Sweetbox:</strong> {seats.filter(s => s.seatType === 'SWEETBOX').length}</p>
                  </div>
                </div>
              ) : (
                <div className="no-seats">
                  <p>Chưa có ghế nào trong phòng chiếu này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditoriumManagement;
