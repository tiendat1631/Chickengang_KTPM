# Definition of Done (DoD)

**Project**: Movie Ticket Booking System  
**Version**: 1.0  
**Last Updated**: 21/12/2024

---

## Mục đích

Tài liệu này định nghĩa tiêu chí "Hoàn thành" cho các User Stories, Sprint, và Release. Tất cả thành viên trong team phải tuân thủ các tiêu chí này trước khi đánh dấu một item là "Done".

---

## Definition of Done - User Story

Một User Story được coi là **DONE** khi tất cả các tiêu chí sau được thỏa mãn:

### ✅ Code Quality

- [ ] Code đã được commit và push lên branch feature
- [ ] Code tuân thủ coding conventions của project
- [ ] Không có lỗi lint/compile warning
- [ ] Code đã được peer review và approved

### ✅ Testing

- [ ] Unit tests đã được viết (coverage ≥ 80% cho logic mới)
- [ ] Unit tests pass 100%
- [ ] Integration tests pass (nếu applicable)
- [ ] Manual testing đã được thực hiện

### ✅ Documentation

- [ ] Code comments đã được thêm cho logic phức tạp
- [ ] API documentation đã được cập nhật (nếu có API mới)
- [ ] README đã được cập nhật (nếu cần)

### ✅ Acceptance Criteria

- [ ] Tất cả Acceptance Criteria trong User Story đã được thỏa mãn
- [ ] Product Owner đã review và chấp nhận

---

## Definition of Done - Sprint

Một Sprint được coi là **DONE** khi:

### ✅ Deliverables

- [ ] Tất cả User Stories committed trong Sprint đều DONE
- [ ] Sprint Goal đã được đạt được
- [ ] Increment có thể demo được

### ✅ Quality

- [ ] Không có Critical/High bugs open
- [ ] Regression tests pass
- [ ] Performance không bị degradation

### ✅ Process

- [ ] Sprint Review đã được tổ chức
- [ ] Sprint Retrospective đã được tổ chức
- [ ] Backlog đã được refined cho Sprint tiếp theo

---

## Definition of Done - Release

Một Release được coi là **DONE** khi:

### ✅ Testing

- [ ] All test cases pass (Pass rate ≥ 95%)
- [ ] 0 Critical/High bugs open
- [ ] Performance tests pass (API < 2s, Page < 3s)
- [ ] Security scan completed (no critical vulnerabilities)

### ✅ Documentation

- [ ] Release notes đã được viết
- [ ] User documentation đã được cập nhật
- [ ] Deployment guide đã được cập nhật

### ✅ Deployment

- [ ] Deployment to staging thành công
- [ ] Smoke tests on staging pass
- [ ] Rollback plan đã sẵn sàng
- [ ] Production deployment approved

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 21/12/2024 | 1.0 | Initial version | ChickenGang Team |
