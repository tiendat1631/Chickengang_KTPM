# Movie Ticket Booking System

# Test Plan

**Version 3.0**

## Revision History

| Date | Version | Description | Author |
|---|---|---|---|
| 08/12/24 | 1.0 | Initial edition | ChickenGang KTPM Team |
| 08/12/24 | 2.0 | Aligned with standard ABC template | ChickenGang KTPM Team |
| 08/12/24 | 2.1 | Updated scope, references Test Design 144 TC & 20 priority TC | ChickenGang KTPM Team |
| 20/12/25 | 3.0 | Master Plan: English refactoring, Risk-based strategy, Test Distribution, Entry/Exit Criteria, Detailed Schedule | Antigravity AI |

## Table of Contents

[1. Introduction](#1-introduction)
[1.1 Purpose](#11-purpose)
[1.2 Background](#12-background)
[1.3 Scope](#13-scope)
[1.4 Project Identification](#14-project-identification)
[1.5 References](#15-references)
[2. Features to be Tested](#2-features-to-be-tested)
[2.1 Functionality](#21-functionality)
[2.2 Usability](#22-usability)
[2.3 Design Constraints](#23-design-constraints)
[2.4 Interfaces](#24-interfaces)
[2.5 Risk Assessment & Prioritization](#25-risk-assessment--prioritization)
[3. Features Not to be Tested](#3-features-not-to-be-tested)
[4. Test Strategy](#4-test-strategy)
[4.1 Testing Types](#41-testing-types)
[4.2 Test Distribution](#42-test-distribution)
[4.3 Entry/Exit Criteria](#43-entryexit-criteria)
[4.4 Tools](#44-tools)
[5. Resources](#5-resources)
[6. Project Milestones](#6-project-milestones)
[7. Deliverables](#7-deliverables)
[Appendix A: Project Tasks](#appendix-a-project-tasks)

---

# 1. Introduction

## 1.1 Purpose

> This Test Plan document for the Movie Ticket Booking System supports the following objectives:

- Identify existing project information and software components to be tested.
- List recommended Requirements for Test (high level).
- Recommend and describe testing strategies to be employed.
- Identify required resources and provide a test effort estimate.
- List the test project deliverable elements.

## 1.2 Background

> The system developed is a web-based movie ticket booking platform.

- **Architecture**: SPA React 18 + Vite; backend Spring Boot 3.5.6; MySQL 8.0; Docker deployment.
- **Business Logic**: Browse movies, select showtimes/seats, book tickets, simulated payment (CASH/BANK_TRANSFER), RBAC Admin/User.
- **Limitations**: No real payment gateway; no ticketing/check-in hardware.
- **Requirements & Design**: `docs/UseCase.md`, `docs/Architecture_Design.md`, `docs/Database_Design.md`.

## 1.3 Scope

> This Test Plan describes the System Testing and UAT that will be conducted within tagged builds.

- Coverage: 4 core modules (146 criteria in `test_template/Test_Design - Test_Design_Complete.csv`): Browse/Search (26), Seat Selection (28), Booking Management (40), Authentication (52).
- Priority Test Set: Full test cases in `test_template/TestCase_TestReport - Module1.csv` through `Module4.csv`.
- Test Report: `test_template/TestCase_TestReport - Test Report.csv`

## 1.4 Project Identification

> The table below identifies the documentation and availability used for developing the *Test Plan*:

| Document (and version/date) | Created or Available | Received or Reviewed | Author or Resource | Notes |
|---|:---:|:---:|---|---|
| Requirements Specification | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/UseCase.md` |
| Functional Specification | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/UseCase.md` |
| Use-Case Reports | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/UseCase.md` |
| Project Plan | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | This document |
| Design Specifications | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/Architecture_Design.md`, `docs/Database_Design.md` |
| Prototype | No | No | — | Not applicable |
| User's Manuals | No | No | — | To be created |
| Business Model or Flow | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/UseCase.md` |
| Data Model or Flow | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/Database_Design.md` |
| Business Functions and Rules | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/UseCase.md` |
| Project or Business Risk Assessment | ✓ Yes | ✓ Yes | ChickenGang KTPM Team | `docs/Baocao.md` section 3.1.8 |

## 1.5 References

> The following table contains references to external documents.

| No. | Document | Description |
|----|----|----|
| 1 | `UseCase.md`, `Architecture_Design.md`, `Database_Design.md`, `Screen_Design.md` | SRS & design of the Movie Ticket Booking System |
| 2 | `docs/Baocao.md` Chapter 3 | Test Plan v2.1 (Vietnamese) |
| 3 | `test_template/Test_Design - Test_Design_Complete.csv` | Complete Test Design with 146 criteria |
| 4 | `test_template/TestCase_TestReport - Module1.csv` to `Module4.csv` | Detailed test case suites (146 TC total) |
| 5 | `test_template/TestCase_TestReport - Test Report.csv` | Test execution summary report |
| 6 | `test-data/Test_Data_Specification.md` | Test data specification |
| 7 | `test-reports/Test_Execution_Report.md`, `test-reports/Test_Summary.md` | Execution reports & summary |
| 8 | `review-checklists/Test_Plan_Review_Checklist.md`, `review-checklists/Test_Case_Review_Checklist.md` | Review checklists for Test Plan & Test Cases |

---

# 2. Features to be Tested

The listing below identifies those items − use cases, functional requirements, and non-functional requirements − that have been identified as targets for testing.

## 2.1 Functionality

### 2.1.1 Browse/Search Movies (Module1: 26 TC)

- Verify that the system provides the capability to display a paginated list of movies.
- Verify that the system provides the capability to search movies by title.
- Verify that the system provides the capability to filter movies by genre, rating, and release date.
- Verify that the system provides the capability to sort movie results.
- Verify that the system provides the capability to view movie details and showtimes.
- Verify that the system handles empty search results gracefully with an appropriate message.
- Verify that the system prevents basic SQLi/XSS attacks in the search input field.
- Verify that pagination handles edge cases (page 0, page exceeding total).

### 2.1.2 Seat Selection (Module2: 28 TC)

- Verify that the system renders a seat map accurately based on the selected showtime.
- Verify that the system displays real-time seat status: available, booked, selected.
- Verify that the system provides the capability to select and deselect seats.
- Verify that the system enforces a maximum seat limit per booking.
- Verify that the system calculates the total price based on selected seats.
- Verify that the system prevents overselling (concurrency control).
- Verify that the system handles multiple browser tabs by the same user without data collision.
- Verify that the system provides minimum accessibility features for the seat map.

### 2.1.3 Booking Management (Module3: 40 TC)

- Verify that the system provides the capability to create a booking with validation and re-check seat availability within a transaction.
- Verify that the system calculates price, fees, and promotions correctly.
- Verify that the system provides the capability for users to view their booking history.
- Verify that the system provides the capability to cancel PENDING bookings.
- Verify that the system prevents IDOR (Insecure Direct Object Reference) attacks on booking resources.
- Verify that the Admin can view and approve bookings.
- Verify that the system handles edge cases like duplicate booking attempts within a short time frame.
- Verify that the system prevents cancellation of already PAID bookings (must show appropriate error).

### 2.1.4 Payment (Sandbox)

- Verify that the system provides the capability to create a PENDING payment record.
- Verify that the system validates the payment amount against the booking total.
- Verify that the system simulates CASH and BANK_TRANSFER payment methods.
- Verify that Admin can confirm payment status to PAID or CANCELLED.
- Verify that the system synchronizes booking status with payment status.
- Verify that the system handles retry, timeout, and idempotent callbacks (simulated).

### 2.1.5 Access Control / Authentication (Module4: 52 TC)

- Verify that the system provides the capability for user registration with input validation.
- Verify that the system provides the capability for user login.
- Verify that the system implements JWT access and refresh token mechanism.
- Verify that the system enforces RBAC (Role-Based Access Control) for Admin and User roles.
- Verify that the system handles session timeout correctly.
- Verify that the system prevents bypass and IDOR vulnerabilities.
- Verify that the system logs security-related events for auditing.
- Verify that the system protects against brute-force login attempts (e.g., rate limiting).
- Verify that the system enforces a basic password policy.

### 2.1.6 Admin Dashboard

- Verify that the Admin can perform CRUD operations on movies, showtimes, and rooms.
- Verify that the Admin can manage bookings and payments.
- Verify that the Admin can view basic statistics.
- Verify that input validation is enforced on all CRUD forms.

## 2.2 Usability

- Verify that the system supports multi-browser desktop access (Chrome, Edge, Firefox).
- Verify that the system supports mobile Chrome browser.
- Verify that the system is responsive with at least 3 breakpoints.
- Verify that error messages are clear and user-friendly, specifying the field in error.
- Verify that the seat selection UX updates in near real-time.

## 2.3 Design Constraints

### 2.3.1 Performance SLA

- **SLA**: API response ≤ 2s, page load ≤ 3s, DB query ≤ 1s.
- **Throughput**: ≥50 concurrent users, ≥100 bookings/hour.

### 2.3.2 Technical Constraints

- No real payment gateway integration.
- No QR/OTP functionality.
- No seat-holding TTL mechanism (seats are not reserved over time).
- DB MySQL 8.0: prevent deadlock/oversell via locking + UNIQUE constraint (showtime_id, seat_id).

## 2.4 Interfaces

### 2.4.1 User Interfaces

- Verify that the system provides a React SPA interface.
- Verify that the system supports keyboard navigation and basic alt text for images.
- Verify that loading states are clearly indicated.

### 2.4.2 System Interfaces

- REST API endpoints: `/api/auth`, `/api/movies`, `/api/showtimes`, `/api/bookings`, `/api/payments`, `/api/admin/**`.
- DB: MySQL.
- Gateway/Notification: out-of-scope for future integration.

## 2.5 Risk Assessment & Prioritization

Based on analysis of 21 defects found during testing and business criticality, modules are prioritized as follows:

| Rank | Module | Risk Level | Defects Found | Rationale & Strategy |
|---|---|---|---|---|
| **1** | **Booking Management** | **Critical** | 10 Fail | Directly impacts revenue, concurrency (seat locking), and financial transactions. **Strategy**: 100% Unit Test coverage for pricing logic; Stress test seat locking; Manual test each cancel/refund case. |
| **2** | **Authentication** | **High** | 8 Fail | Single security gateway; risk of IDOR, User/Admin data leakage. **Strategy**: Automated Security Scan (ZAP); thorough Unit test for Token/RBAC logic. |
| **3** | **Seat Selection** | **Medium** | 3 Fail | Core user experience; risk of incorrect real-time seat status display. **Strategy**: Visual Testing (Manual/UI); Integration test for seat selection flow. |
| **4** | **Browse/Search** | **Low** | 0 Fail | Low complexity, primarily Read-only operations. **Strategy**: Exploratory Testing; check basic SQLi; lowest priority if time-constrained. |

---

# 3. Features Not to be Tested

- Email/SMS/OTP notification (not implemented).
- Real payment gateway & callback.
- QR code / hardware check-in devices.
- Advanced analytics/reporting.
- Ticketing & check-in endpoints (not available, only simulated flow).

---

# 4. Test Strategy

## 4.1 Testing Types

### 4.1.1 Functionality Testing

| Item | Description |
|---|---|
| **Test Objective** | To ensure proper target-of-test functionality, including navigation, data entry, processing, and retrieval. |
| **Technique** | Execute each use case, use-case flow, or function, using valid and invalid data, to verify expected results occur when valid data are used, and appropriate error messages are displayed when invalid data are used. |
| **Completion Criteria** | All planned tests have been executed. All UC/TC marked as priority pass. No blocker/critical defects open. |

### 4.1.2 Usability Testing

| Item | Description |
|---|---|
| **Test Objective** | To ensure clear UX, understandable error messages, and responsive design. |
| **Technique** | Heuristic review, walkthrough, error message validation, responsive testing (≥3 breakpoints). |
| **Completion Criteria** | No UX-blocking defects; significant display issues are logged and triaged. |

### 4.1.3 User Interface Testing

| Item | Description |
|---|---|
| **Test Objective** | To verify navigation, control states, minimum accessibility, and real-time seat-map accuracy. |
| **Technique** | Verify each form/view, tab/mouse/shortcut navigation, control states, seat-map prevention of selecting booked seats. |
| **Completion Criteria** | Each form meets standards; no control state drift; seat-map correctly blocks booked seats. |

### 4.1.4 Performance Testing

| Item | Description |
|---|---|
| **Test Objective** | To ensure the system meets SLA (API <2s, page <3s, DB <1s), supports ≥50 concurrent users, ≥100 bookings/h; no oversell. |
| **Technique** | k6/JMeter speed/load/spike tests; monitor CPU/mem; hot scenarios (showtimes, seat-map, booking, payment confirm). |
| **Completion Criteria** | p95 meets SLA; no memory leaks; no oversell; recovery <5 minutes. |

### 4.1.5 Security Testing

| Item | Description |
|---|---|
| **Test Objective** | To protect AuthN/AuthZ, prevent IDOR, basic SQLi/XSS, manage session/JWT, check headers/CORS. |
| **Technique** | Registration/login/refresh tests, RBAC Admin/User, IDOR checks, fuzz input, ZAP baseline scan. |
| **Completion Criteria** | No critical vulnerabilities; all security TC pass; session/JWT secure. |

### 4.1.6 Database Testing

| Item | Description |
|---|---|
| **Test Objective** | To ensure data integrity, key/unique constraints, ACID compliance, deadlock/locking behavior, primary query performance. |
| **Technique** | DB CRUD, constraint/foreign key, rollback/snapshot, seat/booking concurrency, index & execution plan checks. |
| **Completion Criteria** | No constraint violations; no deadlock in standard scenarios; primary queries <1s; data consistent after rollback. |

### 4.1.7 Compatibility Testing

| Item | Description |
|---|---|
| **Test Objective** | To ensure the system works on target browsers/devices/OS; compatible with MySQL 8.0. |
| **Technique** | Browser matrix (Chrome/Edge/Firefox desktop, mobile Chrome), viewport ≥3 breakpoints; verify seat-map render, input; confirm DB connection. |
| **Completion Criteria** | No blocking defects on matrix; UI display/navigation stable; no DB compatibility issues. |

### 4.1.8 Crowd Testing

| Item | Description |
|---|---|
| **Test Objective** | To collect diverse feedback on UX/usability, discover rare real-world defects. |
| **Technique** | Crowd test sessions with light scenarios (signup/login/browse/seat/booking/simulated payment); minimal checklist; log defects/feedback. |
| **Completion Criteria** | All critical/high defects logged; main feedback added to backlog; no blockers open. |

## 4.2 Test Distribution

Effort allocation based on Risk-Based Testing strategy:

| Module | Unit (%) | Integration (%) | E2E/UI Flow (%) | Perf/Sec (%) | Manual/Exploratory (%) | Total |
|---|---|---|---|---|---|---|
| **Booking** | 40% | 20% | 15% | 15% | 10% | 100% |
| **Auth** | 50% | 20% | 10% | 20% | 0% | 100% |
| **Seat Select** | 10% | 20% | 30% | 10% | 30% | 100% |
| **Search** | 10% | 10% | 20% | 0% | 60% | 100% |

## 4.3 Entry/Exit Criteria

### 4.3.1 Entry Criteria (System Test Start)

- Code freeze or tagged test version.
- Staging environment deployed successfully; Database seeded with clean test data.
- Unit Test pass rate: 100%.
- Smoke Test (Login + View Movie + Book 1 ticket) pass.

### 4.3.2 Exit Criteria (Release)

- **Pass Rate**: 100% Critical/High Test Cases pass; Overall pass rate ≥ 95%.
- **Defects**:
  - 0 Critical/High bugs open.
  - Medium/Low bugs reviewed and accepted (Deferred) by PM.
- **Performance**: API response < 2s with 50 CCU.
- **Deliverables**: Complete Test Report, Bug List, and Release Note.

## 4.4 Tools

| Type | Tool | Version |
|------|------|---------|
| Unit Testing | JUnit 5, Mockito | 5.x |
| API Testing | Postman/Newman | latest |
| Performance Testing | k6 or JMeter | latest |
| Security Testing | OWASP ZAP baseline | 2.14+ |
| UI Testing (optional) | Selenium/Cypress | latest |
| CI | GitHub Actions | latest |
| Bug Tracking | GitHub Issues/Projects | latest |

---

# 5. Resources

## 5.1 Roles

> This table shows the staff required for the project.

| Role | Min FTE | Responsibilities |
|------|---------|------------------|
| Test Lead | 1 | Develops Test Plan, prioritizes, reviews/approves TC & evidence, triages defects, reports. |
| Tester | 2 | Writes/executes TC (catalog, seat, booking, payment), logs defects, collects evidence. |
| Test Automation Eng (opt) | 1 | Scripts API/perf/regression tests, integrates with CI. |

---

# 6. Project Milestones

> Test activities and milestones are dependent upon the development iterations. The Construction Phase is split into 4 phases. Each phase contains a full test cycle of planning, design, execution, and evaluation.

Detailed schedule for the Final Sprint:

| Phase | Duration | Key Activities | Deliverable |
|---|---|---|---|
| **P1: Fix & Regression** | **24/11 - 04/12** | Fix 21 outstanding bugs; Re-run all Unit/Integration Tests. | Build Stable Release Candidate (RC1) |
| **P2: Non-Functional** | **05/12 - 10/12** | Perform Load Test (Booking/Search) & Security Scan (ZAP). Optimize queries if slow. | Performance Report, Security Scan Report |
| **P3: Final E2E** | **11/12 - 17/12** | Run Full E2E flows (Manual + Auto); Cross-browser Compatibility Testing. Verify Exit Criteria. | E2E Test Report, Final Bug List |
| **P4: Release & Demo** | **18/12** | Package documentation (User Manual, Test Summary); Prepare Demo script; Final Sign-off. | **Final Project Report**, Demo Slides |

---

# 7. Deliverables

## 7.1 Test Model

> Test Model defines all test cases and references, test procedures and test scripts which are associated with each test case.

**Current Test Execution Summary** (from `TestCase_TestReport - Test Report.csv`):

| Module | Pass | Fail | Untested | N/A | Total TC |
|---|---|---|---|---|---|
| Module1 (Browse/Search) | 22 | 0 | 4 | 0 | 26 |
| Module2 (Seat Selection) | 16 | 3 | 9 | 0 | 28 |
| Module3 (Booking) | 20 | 10 | 6 | 4 | 40 |
| Module4 (Auth) | 38 | 8 | 2 | 4 | 52 |
| **Total** | **96** | **21** | **21** | **8** | **146** |

- **Test Coverage**: 84.78%
- **Test Pass Rate**: 69.57%

**Source Files**:

- Design: `test_template/Test_Design - Test_Design_Complete.csv`
- Test Cases: `test_template/TestCase_TestReport - Module1.csv` to `Module4.csv`
- Report: `test_template/TestCase_TestReport - Test Report.csv`

## 7.2 Test Logs

> Microsoft Word/Markdown is used to record and report test results. Daily tracking during the test execution phase.

## 7.3 Bug Reports

> GitHub Issues is used for logging and tracking individual malfunctions. Defects are classified by severity (Critical/High/Medium/Low) until closure.

---

# Appendix A: Project Tasks

Test-related tasks are given below:

> **Test Planning**
>
> - Identify requirements for testing
> - Assess risks
> - Develop test strategy
> - Identify test resources
> - Create schedule
> - Generate Test Plan

> **Test Design**
>
> - Prepare workload analysis
> - Identify and describe test cases
> - Design test data

> **Test Implementation**
>
> - Prepare test environment
> - Seed/snapshot DB
> - Script automation

> **Test Execution**
>
> - Execute test procedures
> - Verify results
> - Investigate unexpected results
> - Log bugs

> **Test Evaluation**
>
> - Evaluate test-case coverage
> - Evaluate code coverage
> - Analyze defects
> - Determine whether Test Completion Criteria and Success Criteria have been achieved
