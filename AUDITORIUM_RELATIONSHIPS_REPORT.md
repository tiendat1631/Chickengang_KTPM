# Báo Cáo Kiểm Tra Quan Hệ Giữa Auditorium và Các Entity Khác

## Tổng Quan
Auditorium (Phòng chiếu) có quan hệ với nhiều entity khác trong hệ thống. Báo cáo này phân tích các quan hệ và đảm bảo tính toàn vẹn dữ liệu.

## Các Quan Hệ Đã Phát Hiện

### 1. Auditorium ↔ Seat (Ghế)
**Quan hệ:** One-to-Many (1 phòng có nhiều ghế)

**Cấu hình:**
- `Auditorium.seats`: `@OneToMany(mappedBy = "auditorium", cascade = CascadeType.ALL, orphanRemoval = true)`
- `Seat.auditorium`: `@ManyToOne(fetch = FetchType.LAZY, nullable = false)`

**Đặc điểm:**
- ✅ **Cascade DELETE**: Khi xóa Auditorium, tất cả Seats sẽ tự động bị xóa
- ✅ **Orphan Removal**: Seats sẽ bị xóa khi không còn tham chiếu đến Auditorium
- ✅ **Không nullable**: Seat phải thuộc về một Auditorium

**Trạng thái:** ✅ Đã cấu hình đúng

---

### 2. Auditorium ↔ Screening (Suất chiếu)
**Quan hệ:** One-to-Many (1 phòng có nhiều suất chiếu)

**Cấu hình:**
- `Auditorium.screenings`: `@OneToMany(mappedBy = "auditorium")` (KHÔNG có cascade)
- `Screening.auditorium`: `@ManyToOne(fetch = FetchType.LAZY, nullable = false)`

**Đặc điểm:**
- ⚠️ **KHÔNG có Cascade DELETE**: Khi xóa Auditorium, Screenings sẽ bị orphan (lỗi foreign key)
- ✅ **Validation**: Đã có kiểm tra trong `deleteAuditorium()` để không cho xóa nếu có Screenings
- ✅ **Không nullable**: Screening phải thuộc về một Auditorium

**Trạng thái:** ✅ Đã có validation, không cần cascade (đúng thiết kế)

---

### 3. Auditorium ↔ Ticket (Vé)
**Quan hệ:** Many-to-One (Nhiều vé thuộc về 1 phòng)

**Cấu hình:**
- `Ticket.auditorium`: `@ManyToOne(fetch = FetchType.LAZY, nullable = false)`
- Không có quan hệ ngược từ Auditorium

**Đặc điểm:**
- ⚠️ **KHÔNG có Cascade DELETE**: Khi xóa Auditorium, Tickets sẽ bị orphan (lỗi foreign key)
- ✅ **Validation**: Đã thêm kiểm tra trong `deleteAuditorium()` để không cho xóa nếu có Tickets
- ✅ **Không nullable**: Ticket phải thuộc về một Auditorium
- ✅ **Quan hệ trực tiếp**: Ticket có quan hệ trực tiếp với Auditorium (ngoài quan hệ qua Screening)

**Trạng thái:** ✅ Đã thêm validation

---

### 4. Auditorium ↔ Booking (Đặt vé) - Quan hệ gián tiếp
**Quan hệ:** Gián tiếp qua Screening

**Cấu hình:**
- `Booking.screening`: `@ManyToOne(fetch = FetchType.LAZY, nullable = false)`
- `Screening.auditorium`: `@ManyToOne(fetch = FetchType.LAZY, nullable = false)`

**Đặc điểm:**
- ✅ **Quan hệ gián tiếp**: Booking → Screening → Auditorium
- ✅ **Validation gián tiếp**: Khi kiểm tra Screenings, đã bao gồm cả Bookings liên quan

**Trạng thái:** ✅ Không cần validation riêng (đã được bảo vệ qua Screening)

---

## Sơ Đồ Quan Hệ

```
Auditorium (1)
    │
    ├─── Seat (N) [CASCADE DELETE + ORPHAN REMOVAL] ✅
    │
    ├─── Screening (N) [NO CASCADE, có validation] ✅
    │       │
    │       ├─── Ticket (N) [NO CASCADE, có validation] ✅
    │       │
    │       └─── Booking (N) [NO CASCADE, validation gián tiếp] ✅
    │
    └─── Ticket (N) [NO CASCADE, có validation] ✅
            (quan hệ trực tiếp)
```

## Các Cải Thiện Đã Thực Hiện

### 1. Thêm Validation cho Tickets
**File:** `AuditoriumServiceImpl.java`

**Thay đổi:**
- Thêm `TicketRepository` vào dependencies
- Thêm kiểm tra `ticketRepository.countByAuditoriumId(id)` trước khi xóa
- Ném `AuditoriumInUseException` nếu có tickets

**Lý do:**
- Ticket có quan hệ trực tiếp với Auditorium (nullable = false)
- Cần đảm bảo không xóa Auditorium khi còn tickets

### 2. Thêm Methods vào TicketRepository
**File:** `TicketRepository.java`

**Thêm:**
- `List<Ticket> findByAuditoriumId(Long auditoriumId)`
- `long countByAuditoriumId(Long auditoriumId)`

**Lý do:**
- Hỗ trợ validation khi xóa Auditorium
- Có thể dùng cho các chức năng khác (thống kê, báo cáo)

## Logic Xóa Auditorium (Sau Cải Thiện)

```java
public void deleteAuditorium(Long id) {
    // 1. Kiểm tra Auditorium tồn tại
    Auditorium auditorium = auditoriumRepository.findById(id)
                    .orElseThrow(()-> new InvalidId(id));
    
    // 2. Kiểm tra Screenings (bao gồm cả Bookings gián tiếp)
    List<Screening> screenings = screeningRepository.findByAuditoriumId(id);
    if (!screenings.isEmpty()) {
        throw new AuditoriumInUseException(...);
    }
    
    // 3. Kiểm tra Tickets (quan hệ trực tiếp)
    long ticketCount = ticketRepository.countByAuditoriumId(id);
    if (ticketCount > 0) {
        throw new AuditoriumInUseException(...);
    }
    
    // 4. Xóa Auditorium (Seats sẽ tự động bị xóa do cascade)
    auditoriumRepository.delete(auditorium);
}
```

## Kết Luận

### ✅ Các Quan Hệ Đã Được Bảo Vệ
1. **Seat**: Cascade DELETE + Orphan Removal ✅
2. **Screening**: Validation trong service ✅
3. **Ticket**: Validation trong service (vừa thêm) ✅
4. **Booking**: Validation gián tiếp qua Screening ✅

### ✅ Tính Toàn Vẹn Dữ Liệu
- Không thể xóa Auditorium khi còn Screenings
- Không thể xóa Auditorium khi còn Tickets
- Seats tự động bị xóa khi xóa Auditorium
- Foreign key constraints được đảm bảo

### 📝 Ghi Chú
- Tất cả các quan hệ đều có `nullable = false`, đảm bảo tính toàn vẹn
- Cascade chỉ áp dụng cho Seats (đúng thiết kế)
- Validation được thực hiện ở tầng Service (đúng pattern)

## Khuyến Nghị

### Đã Hoàn Thành ✅
- [x] Kiểm tra tất cả quan hệ
- [x] Thêm validation cho Tickets
- [x] Thêm methods vào TicketRepository
- [x] Cập nhật logic xóa Auditorium

### Có Thể Cải Thiện Thêm (Tùy chọn)
- [ ] Thêm API endpoint để xem thống kê quan hệ (số screenings, tickets, bookings)
- [ ] Thêm logging khi xóa Auditorium để audit
- [ ] Thêm soft delete thay vì hard delete (nếu cần lưu lịch sử)

---

**Ngày tạo:** 2025-11-18  
**Trạng thái:** ✅ Hoàn thành

