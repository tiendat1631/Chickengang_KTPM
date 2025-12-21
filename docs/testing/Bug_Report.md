# Bug Report

**Project**: Movie Ticket Booking System
**Version**: 1.0
**Test Period**: 15/12/2025 - 18/12/2025
**Total Bugs Found**: 21

---

## Summary

| Severity | Count | Percentage |
|----------|-------|------------|
| **Critical** | 3 | 14.3% |
| **High** | 8 | 38.1% |
| **Medium** | 7 | 33.3% |
| **Low** | 3 | 14.3% |
| **Total** | **21** | 100% |

---

## Bug Distribution by Module

| Module | Pass | Fail | Pass Rate |
|--------|------|------|-----------|
| Module 1 (Browse/Search) | 22 | 0 | 100% |
| Module 2 (Seat Selection) | 16 | 3 | 84.2% |
| Module 3 (Booking Management) | 20 | 10 | 66.7% |
| Module 4 (Authentication) | 38 | 8 | 82.6% |
| **Total** | **96** | **21** | **82.1%** |

---

## Detailed Bug List

### Module 2: Seat Selection (3 Bugs)

| Bug ID | Test Case | Description | Severity | Status |
|--------|-----------|-------------|----------|--------|
| BUG-001 | M2-15 | **Concurrent Booking Conflict**: User A and User B select same seat simultaneously → Both succeed (should be only 1) | **Critical** | Open |
| BUG-002 | M2-23 | **Concurrency Locking**: DB lock does not prevent double booking when two users select same seat | **Critical** | Open |
| BUG-003 | M2-27 | **Seat Map Concurrency**: Multiple users accessing seat map causes response >2s and inaccurate status | **High** | Open |

---

### Module 3: Booking Management (10 Bugs)

| Bug ID | Test Case | Description | Severity | Status |
|--------|-----------|-------------|----------|--------|
| BUG-004 | M3-08 | **Filter by Status**: Filtering bookings by CONFIRMED/PENDING/CANCELLED does not work correctly | Medium | Open |
| BUG-005 | M3-09 | **Sort by Date**: Bookings are not sorted by date descending (latest first) | Medium | Open |
| BUG-006 | M3-11 | **Pagination**: Pagination does not work for users with 50+ bookings | Medium | Open |
| BUG-007 | M3-21 | **Admin Booking List**: Admin cannot view all customer bookings with filters | **High** | Open |
| BUG-008 | M3-22 | **Search by Booking Code**: Admin search by booking code returns no results | **High** | Open |
| BUG-009 | M3-23 | **Search by Customer Name**: Admin search by customer name fails | **High** | Open |
| BUG-010 | M3-24 | **Filter by Screening**: Admin filter by movie/screening not implemented | Medium | Open |
| BUG-011 | M3-25 | **Admin Cancel Booking**: Admin cannot cancel invalid bookings | **High** | Open |
| BUG-012 | M3-26 | **Admin View Booking Details**: Customer info, seats, payment status not displayed | **High** | Open |
| BUG-013 | M3-33 | **IDOR Prevention**: User A can access User B's booking URL (403 Forbidden not returned) | **Critical** | Open |

---

### Module 4: Authentication & Authorization (8 Bugs)

| Bug ID | Test Case | Description | Severity | Status |
|--------|-----------|-------------|----------|--------|
| BUG-014 | M4-06 | **Required Fields Validation**: Empty required fields not properly validated on registration | Medium | Open |
| BUG-015 | M4-30 | **Concurrent Sessions**: No policy enforced when user logs in on 2 devices | Low | Open |
| BUG-016 | M4-31 | **Secure Cookie Flags**: JWT not stored with httpOnly, secure, sameSite flags | **High** | Open |
| BUG-017 | M4-39 | **Username Length Validation**: Username <3 or >50 characters not validated | Medium | Open |
| BUG-018 | M4-43 | **View Profile**: User cannot access /profile to view information | Low | Open |
| BUG-019 | M4-44 | **Update Profile**: User cannot update email/phone | Low | Open |
| BUG-020 | M4-45 | **Role Immutability**: User can modify their role (should be blocked) | **High** | Open |
| BUG-021 | M4-46 | **Frontend-Backend Auth Sync**: Token validation inconsistent between frontend and backend | Medium | Open |

---

## Critical Bugs Summary

| ID | Module | Issue | Impact | Recommended Fix |
|----|--------|-------|--------|-----------------|
| BUG-001 | Seat | Race condition in seat booking | Double-booking, revenue loss | Implement pessimistic locking |
| BUG-002 | Seat | DB lock not working | Data integrity | Add SELECT FOR UPDATE |
| BUG-013 | Booking | IDOR vulnerability | Security breach, data exposure | Add authorization check |

---

## Recommendations

1. **Priority 1 - Critical Bugs (BUG-001, BUG-002, BUG-013)**: Must fix before release
2. **Priority 2 - High Bugs (Admin features)**: Fix for full functionality
3. **Priority 3 - Medium/Low Bugs**: Can defer to next sprint

---

## Appendix: Test Execution Summary

- **Total Test Cases**: 146
- **Executed**: 117 (80.1%)
- **Passed**: 96 (82.1% of executed)
- **Failed**: 21 (17.9% of executed)
- **Untested**: 21
- **N/A**: 8
