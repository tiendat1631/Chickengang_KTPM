# Test Design Template - Cinema Booking System

## 📁 Files trong thư mục này

### 1. Test_Design_Complete.md
**Tài liệu chính** - Test Design chi tiết với 144 test criteria

**Nội dung:**
- 4 chức năng chính với bảng test design đầy đủ
- Test Data Summary
- Test Coverage Estimation
- Hướng dẫn sử dụng và mapping sang test cases
- Tham chiếu đến các tài liệu khác

**Sử dụng khi:**
- Cần xem chi tiết test criteria cho từng chức năng
- Mapping requirements sang test cases
- Hiểu rõ test data requirements
- Tham khảo trong quá trình test execution

---

### 2. Test_Design_Complete.csv
**File dữ liệu** - Format CSV để import vào tools

**Cấu trúc:**
```csv
#, Requirement Level 1, Requirement Level 2, Requirement Level 3, Test Criteria, Test Type, Note
```

**Sử dụng khi:**
- Import vào Excel để view dạng bảng
- Import vào test management tools (Jira, TestRail, etc.)
- Sắp xếp, filter, analyze dữ liệu
- Phân bổ test cases cho team members

**Cách mở trong Excel:**
1. Mở Excel
2. File → Open → Chọn Test_Design_Complete.csv
3. Chọn delimiter: Comma
4. Import thành công → Có thể apply formatting, colors, filters

---

### 3. Test_Design_Summary.md
**Tài liệu phân tích** - Coverage analysis, gap analysis, và recommendations

**Nội dung:**
- Coverage summary cho từng module
- Statistics và metrics
- Gap analysis (strengths & areas for enhancement)
- Risk assessment
- Test execution strategy
- Automation recommendations
- Quality gates

**Sử dụng khi:**
- Presentation cho stakeholders
- Test planning và resource allocation
- Risk management
- Quyết định automation strategy
- Quality gate definition

---

### 4. README.md (file này)
**Hướng dẫn** - Quick reference guide

---

## 🎯 Quick Start Guide

### Cho Test Lead/Test Manager

1. **Review Test Design**: Đọc `Test_Design_Complete.md` để hiểu scope
2. **Check Coverage**: Đọc `Test_Design_Summary.md` section "Coverage Summary"
3. **Assess Risks**: Xem "Risk Assessment" để prioritize
4. **Plan Execution**: Dùng "Test Execution Strategy" để lập lịch
5. **Allocate Resources**: Dùng CSV để assign test cases cho team

### Cho Test Engineer/Tester

1. **Understand Requirements**: Đọc phần Use Cases trong `Test_Design_Complete.md`
2. **Get Assigned Tests**: Check CSV file hoặc test management tool
3. **Prepare Test Data**: Xem "Test Data Summary" section
4. **Execute Tests**: Follow test criteria trong từng test case
5. **Log Results**: Ghi nhận Pass/Fail và create bug reports

### Cho Developer

1. **Understand Test Scope**: Xem "Coverage Summary" để biết features nào được test
2. **Check Security Requirements**: Đọc phần Security tests (quan trọng!)
3. **Review Critical Tests**: Focus vào 30 Critical test cases
4. **Prepare Test Environment**: Ensure seed data có sẵn
5. **Support Test Execution**: Fix bugs và re-test

---

## 📊 Test Design Structure

### Requirement Level 1
**Chức năng chính** - Top-level module
- Movie Management
- Booking Management - Seat Selection
- Booking & Order Management
- Authentication & Authorization

### Requirement Level 2
**Sub-module** - Feature group
- Ví dụ: Browse Movies, Search Movies, Filter Movies

### Requirement Level 3
**Scenario** - Specific case
- Ví dụ: Search by title (valid input), Search with empty input

### Test Criteria
**Chi tiết test** - What to test and expected result
- Input data
- Action to perform
- Expected output
- Format: "Condition → Expected Result"

### Test Type
**Loại test**
- **Function**: Functional testing (majority)
- **Security**: Security testing (SQL injection, XSS, IDOR, etc.)
- **Permission**: Authorization/Role-based access
- **Performance**: Response time, load testing
- **Usability**: UI/UX testing
- **Accessibility**: WCAG compliance

### Note
**Metadata**
- Test data requirements
- Preconditions
- User roles needed
- Priority hints
- Special setup requirements

---

## 📈 Test Statistics

| Metric | Value |
|--------|-------|
| **Total Test Criteria** | 144 |
| **Modules Covered** | 4 |
| **Critical Tests** | 30 (20.8%) |
| **High Priority Tests** | 77 (53.5%) |
| **Security Tests** | 22 (15.3%) |
| **Estimated Execution Time (Manual)** | 72-96 hours |
| **Recommended for Automation** | 50-70 tests |

---

## 🔥 Critical Tests (Must Pass Before Release)

Top 10 Most Critical Tests:

1. **#40**: Concurrent booking conflict handling
2. **#98**: SQL injection prevention in login
3. **#110-111**: Customer cannot access admin functions
4. **#81**: IDOR prevention (cannot view other user's bookings)
5. **#127**: Password hashing verification
6. **#61**: Seats released after booking cancellation
7. **#35-37**: Price calculation accuracy
8. **#9**: SQL injection prevention in search
9. **#120-123**: Authorization bypass prevention
10. **#49**: Create booking success path

**⚠️ These tests MUST pass 100% before production release!**

---

## 🛠️ How to Use This Test Design

### Scenario 1: Creating Detailed Test Cases

**Input**: Test Design Row #4
```
Requirement Level 2: Search Movies
Requirement Level 3: Search by title (valid input)
Test Criteria: Enter valid movie title "Avengers" → System returns matching movies
Test Type: Function
Note: Test data: Movie "Avengers Endgame" exists
```

**Output**: Detailed Test Case
```
Test Case ID: TC-SEARCH-001
Test Name: Search movie by valid title
Priority: High
Preconditions:
  - At least one movie with title "Avengers" exists in database
  - User is on the movie list page
Test Steps:
  1. Locate search input field
  2. Enter "Avengers" into search field
  3. Press Enter or click Search button
  4. Wait for results to load
Expected Result:
  - System displays movies with "Avengers" in title
  - "Avengers Endgame" is shown in results
  - No error messages displayed
Test Data:
  - Search term: "Avengers"
  - Expected movie: "Avengers Endgame"
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
Bug ID: [If failed]
```

---

### Scenario 2: Assigning Tests to Team Members

**Using CSV file:**

1. Open `Test_Design_Complete.csv` in Excel
2. Add column "Assigned To"
3. Add column "Status" (Not Started/In Progress/Completed)
4. Filter by module:
   - Assign "Tìm kiếm hàng" (24 tests) → Tester A
   - Assign "Giỏ hàng" (24 tests) → Tester B
   - Assign "Đơn hàng" (36 tests) → Tester C & D
   - Assign "Phân quyền" (60 tests) → Tester E & F
5. Track progress daily

---

### Scenario 3: Reporting Test Coverage

**Use data from Test_Design_Summary.md:**

```
Test Execution Report - Week 1

Total Test Cases: 144
Executed: 75 (52%)
Passed: 68 (91%)
Failed: 7 (9%)
Blocked: 0

By Priority:
- Critical: 30/30 executed, 28 passed (93%)
- High: 35/77 executed, 32 passed (91%)
- Medium: 10/26 executed, 8 passed (80%)

By Module:
- Tìm kiếm hàng: 24/24 executed, 23 passed (96%)
- Giỏ hàng: 18/24 executed, 16 passed (89%)
- Đơn hàng: 20/36 executed, 18 passed (90%)
- Phân quyền: 13/60 executed, 11 passed (85%)

Critical Issues:
- Bug #001: Concurrent booking allows double booking (Test #40)
- Bug #002: SQL injection possible in search (Test #9)
```

---

## 🚀 Test Execution Workflow

```
1. Setup Test Environment
   ↓
2. Prepare Test Data (from Test_Data_Specification.md)
   ↓
3. Execute Phase 1: Critical Tests (30 tests)
   ↓
4. Bug Fixing & Retesting
   ↓
5. Execute Phase 2: High Priority (77 tests)
   ↓
6. Bug Fixing & Retesting
   ↓
7. Execute Phase 3: Medium/Low Priority (37 tests)
   ↓
8. Regression Testing (Re-run Critical + Failed tests)
   ↓
9. Test Report & Sign-off
```

---

## 📚 Related Documents

### Requirements
- `docs/UseCase.md` - Use case specifications
- `docs/Architecture_Design.md` - System architecture
- `docs/Database_Design.md` - Database schema

### Test Documentation
- `docs/Test_Plan.md` - Overall test strategy and plan
- `docs/test-cases/UTC_Unit_Test_Cases.md` - Unit test cases
- `docs/test-cases/ITC_Integration_Test_Cases.md` - Integration test cases
- `docs/test-cases/STC_System_Test_Cases.md` - System test cases
- `docs/test-data/Test_Data_Specification.md` - Test data details

### Test Execution
- `docs/test-reports/Test_Execution_Report.md` - Test execution tracking
- `docs/test-reports/Test_Summary.md` - Test summary template

### Review
- `docs/review-checklists/Test_Plan_Review_Checklist.md`
- `docs/review-checklists/Test_Case_Review_Checklist.md`

---

## ✅ Quality Checklist

### Before Starting Test Execution

- [ ] Test environment setup completed
- [ ] Test data prepared and loaded
- [ ] All testers trained on test approach
- [ ] Bug tracking system ready
- [ ] Test management tool configured
- [ ] Test Design reviewed and approved

### During Test Execution

- [ ] Following test criteria exactly
- [ ] Logging results in real-time
- [ ] Creating bug reports immediately
- [ ] Communicating blockers to team
- [ ] Updating test status daily

### After Test Execution

- [ ] All test results logged
- [ ] All bugs created and linked to test cases
- [ ] Test metrics calculated
- [ ] Test report generated
- [ ] Retesting completed for fixed bugs
- [ ] Regression testing passed
- [ ] Sign-off obtained from stakeholders

---

## 🆘 FAQ

### Q1: Tôi có cần execute tất cả 144 test cases không?
**A**: Phụ thuộc vào phase:
- **Phase 1 (Critical)**: 30 tests - BẮT BUỘC 100%
- **Phase 2 (High)**: 77 tests - Khuyến nghị >= 95%
- **Phase 3 (Medium/Low)**: 37 tests - Khuyến nghị >= 85%

### Q2: Test data ở đâu?
**A**: Xem `docs/test-data/Test_Data_Specification.md` và seed data trong `backend/src/main/resources/data.sql`

### Q3: Làm sao để prioritize tests khi thiếu thời gian?
**A**: 
1. Execute tất cả Critical tests (30) trước
2. Focus vào Security tests (22)
3. Focus vào core user journey (browse → seat selection → booking → payment)
4. Skip Low priority và Nice-to-have tests

### Q4: Test case nào nên automate trước?
**A**: Xem section "Automation Recommendations" trong `Test_Design_Summary.md`:
- Smoke tests (10-15)
- API tests (30-40)
- Regression tests (20-25)

### Q5: Có template để tạo detailed test cases không?
**A**: Có, xem section "Hướng dẫn sử dụng Test Design" trong `Test_Design_Complete.md`, phần "Mapping sang Test Case Execution"

### Q6: Làm sao track test progress?
**A**: 
- **Option 1**: Dùng CSV file + add columns (Status, Assigned To, Execution Date)
- **Option 2**: Import vào test management tool (Jira, TestRail)
- **Option 3**: Dùng spreadsheet với dashboard

---

## 📞 Contact & Support

**Test Team**: ChickenGang KTPM Team  
**Document Version**: 1.0  
**Last Updated**: 08/12/2025

**For questions or clarifications:**
- Review this README first
- Check `Test_Design_Summary.md` for detailed analysis
- Refer to `Test_Plan.md` for overall strategy
- Contact Test Lead for guidance

---

## 🎓 Best Practices

### Test Execution
1. ✅ Always reset database before test run
2. ✅ Execute tests in isolation (don't depend on previous test results)
3. ✅ Document actual results even when test passes
4. ✅ Take screenshots for failed tests
5. ✅ Log all defects immediately

### Test Data
1. ✅ Use dedicated test accounts (don't use production data)
2. ✅ Create fresh test data for each test run when needed
3. ✅ Don't hardcode test data in test scripts
4. ✅ Document test data assumptions

### Bug Reporting
1. ✅ Link bug to test case ID
2. ✅ Include steps to reproduce
3. ✅ Attach screenshots/logs
4. ✅ Specify environment details
5. ✅ Assign priority based on test priority

### Communication
1. ✅ Daily standup: Share progress and blockers
2. ✅ Weekly report: Test metrics and status
3. ✅ Immediate escalation for Critical test failures
4. ✅ Document all assumptions and decisions

---

**Happy Testing! 🚀**

_Remember: Quality is not an act, it is a habit. - Aristotle_


