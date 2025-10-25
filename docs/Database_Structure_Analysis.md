# 📊 Database Structure Analysis - Movie Booking System

## 🎯 Cấu trúc Database đã được sửa

### **✅ Quan hệ đúng theo yêu cầu:**

```
Movie (1) ←→ (N) Screening (N) ←→ (1) Auditorium
   ↓                    ↓                    ↓
Ticket ←→ Ticket ←→ Ticket ←→ Ticket ←→ Ticket
   ↓                    ↓                    ↓
Seat (N) ←→ (1) Auditorium
```

### **📋 Chi tiết các Entity:**

#### **1. Movie**
- **Mục đích**: Lưu thông tin phim
- **Quan hệ**: 1 Movie có nhiều Screening

#### **2. Auditorium** 
- **Mục đích**: Lưu thông tin phòng chiếu
- **Quan hệ**: 
  - 1 Auditorium có nhiều Screening
  - 1 Auditorium có nhiều Seat

#### **3. Screening**
- **Mục đích**: Lưu thông tin suất chiếu (Movie + Auditorium + thời gian)
- **Quan hệ**:
  - N Screening thuộc về 1 Movie
  - N Screening thuộc về 1 Auditorium
  - 1 Screening có nhiều Ticket

#### **4. Seat**
- **Mục đích**: Lưu thông tin ghế trong phòng
- **Quan hệ**: N Seat thuộc về 1 Auditorium

#### **5. Ticket** ⭐ **ĐÃ ĐƯỢC SỬA**
- **Mục đích**: Vé cho 1 ghế cụ thể trong 1 suất chiếu cụ thể
- **Quan hệ TRỰC TIẾP**:
  - 1 Ticket → 1 Movie ✅
  - 1 Ticket → 1 Auditorium ✅  
  - 1 Ticket → 1 Screening ✅
  - 1 Ticket → 1 Seat ✅
  - 1 Ticket → 1 Booking (optional) ✅

#### **6. Booking**
- **Mục đích**: Đơn đặt vé của user
- **Quan hệ**: 1 Booking có nhiều Ticket

#### **7. Payment**
- **Mục đích**: Thông tin thanh toán
- **Quan hệ**: 1 Payment thuộc về 1 Booking

### **🔧 Thay đổi chính trong Ticket Entity:**

```java
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "auditorium_id", "screening_id", "seat_id"})
})
public class Ticket {
    // ✅ Quan hệ trực tiếp với Movie
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
    
    // ✅ Quan hệ trực tiếp với Auditorium  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auditorium_id", nullable = false)
    private Auditorium auditorium;
    
    // ✅ Quan hệ với Screening
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;
    
    // ✅ Quan hệ với Seat
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
    
    // ✅ Quan hệ với Booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
```

### **🎬 Flow tạo Ticket:**

1. **User chọn phim** → Movie
2. **User chọn phòng** → Auditorium  
3. **User chọn suất chiếu** → Screening (Movie + Auditorium + thời gian)
4. **User chọn ghế** → Seat (trong Auditorium)
5. **Tạo Ticket** với đầy đủ thông tin:
   - `ticket.movie = screening.movie`
   - `ticket.auditorium = screening.auditorium`
   - `ticket.screening = screening`
   - `ticket.seat = seat`
   - `ticket.booking = booking`

### **🔒 Unique Constraint:**

```sql
-- Đảm bảo không có 2 ticket cho cùng:
-- Movie + Auditorium + Screening + Seat
UNIQUE(movie_id, auditorium_id, screening_id, seat_id)
```

### **✅ Kết luận:**

Database structure hiện tại **ĐÃ ĐÚNG** theo yêu cầu:
- ✅ 1 Movie có nhiều Auditorium (qua Screening)
- ✅ 1 Auditorium có nhiều Screening  
- ✅ 1 Auditorium có nhiều Seat
- ✅ 1 Ticket chứa đầy đủ: Movie + Auditorium + Screening + Seat
- ✅ 1 Booking có nhiều Ticket
- ✅ Unique constraint đảm bảo không duplicate ticket

### **🚀 Lợi ích của cấu trúc mới:**

1. **Truy vấn nhanh**: Không cần JOIN qua nhiều bảng
2. **Dữ liệu đầy đủ**: Mỗi ticket chứa tất cả thông tin cần thiết
3. **Tính nhất quán**: Unique constraint đảm bảo không có ticket trùng lặp
4. **Dễ maintain**: Cấu trúc rõ ràng, dễ hiểu

