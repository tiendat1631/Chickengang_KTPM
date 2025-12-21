# Product Backlog

**Project**: Movie Ticket Booking System  
**Product Owner**: ChickenGang Team  
**Last Updated**: 21/12/2024

---

## Backlog Overview

| Priority | Total Stories | Story Points |
|----------|---------------|--------------|
| 🔴 High | 8 | 34 |
| 🟡 Medium | 6 | 21 |
| 🟢 Low | 4 | 13 |
| **Total** | **18** | **68** |

---

## User Stories

### 🔴 High Priority

#### US-001: User Registration

**As a** visitor  
**I want to** register an account  
**So that** I can book movie tickets

**Acceptance Criteria:**

- Given I am on the registration page
- When I enter valid email, password, and personal info
- Then my account is created and I receive a confirmation

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-002: User Login

**As a** registered user  
**I want to** log in to my account  
**So that** I can access my bookings

**Acceptance Criteria:**

- Given I have a valid account
- When I enter correct email and password
- Then I am logged in and redirected to homepage

**Story Points**: 3  
**Status**: ✅ Done

---

#### US-003: Browse Movies

**As a** user  
**I want to** browse available movies  
**So that** I can find a movie to watch

**Acceptance Criteria:**

- Given I am on the homepage
- When the page loads
- Then I see a list of currently showing movies with posters, titles, and ratings

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-004: Search Movies

**As a** user  
**I want to** search for movies by title  
**So that** I can quickly find a specific movie

**Acceptance Criteria:**

- Given I am on the movies page
- When I enter a search term and submit
- Then I see movies matching my search term

**Story Points**: 3  
**Status**: ✅ Done

---

#### US-005: Select Screening

**As a** user  
**I want to** select a movie screening  
**So that** I can choose a convenient showtime

**Acceptance Criteria:**

- Given I am viewing a movie's details
- When I see the available screenings
- Then I can select a date and time that suits me

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-006: Select Seats

**As a** user  
**I want to** select seats for my booking  
**So that** I can choose where to sit

**Acceptance Criteria:**

- Given I have selected a screening
- When I view the seat map
- Then I can select available seats (max 10 per booking)

**Story Points**: 8  
**Status**: ✅ Done

---

#### US-007: Create Booking

**As a** user  
**I want to** complete my booking  
**So that** my seats are reserved

**Acceptance Criteria:**

- Given I have selected seats
- When I confirm my booking
- Then a booking is created with status PENDING

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-008: Make Payment

**As a** user  
**I want to** pay for my booking  
**So that** my booking is confirmed

**Acceptance Criteria:**

- Given I have a pending booking
- When I select a payment method and confirm
- Then my payment is processed (simulated) and booking status updates to PAID

**Story Points**: 5  
**Status**: ✅ Done

---

### 🟡 Medium Priority

#### US-009: View Booking History

**As a** user  
**I want to** view my booking history  
**So that** I can see my past and upcoming bookings

**Story Points**: 3  
**Status**: ✅ Done

---

#### US-010: Cancel Booking

**As a** user  
**I want to** cancel a pending booking  
**So that** I can change my plans

**Story Points**: 3  
**Status**: ✅ Done

---

#### US-011: Admin - Manage Movies (CRUD)

**As an** admin  
**I want to** manage movies  
**So that** I can keep the movie catalog updated

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-012: Admin - Manage Screenings

**As an** admin  
**I want to** manage screenings  
**So that** I can schedule movie showtimes

**Story Points**: 5  
**Status**: ✅ Done

---

#### US-013: Admin - View Bookings

**As an** admin  
**I want to** view all bookings  
**So that** I can manage customer reservations

**Story Points**: 3  
**Status**: ✅ Done

---

#### US-014: Admin - Confirm Payment

**As an** admin  
**I want to** confirm payments  
**So that** bookings are finalized

**Story Points**: 2  
**Status**: ✅ Done

---

### 🟢 Low Priority (Future)

#### US-015: Email Notifications

**As a** user  
**I want to** receive email confirmation  
**So that** I have a record of my booking

**Story Points**: 5  
**Status**: ⬜ Backlog

---

#### US-016: Seat Holding (TTL)

**As a** user  
**I want** my selected seats to be held temporarily  
**So that** nobody else can book them while I complete payment

**Story Points**: 8  
**Status**: ⬜ Backlog

---

#### US-017: QR Code Tickets

**As a** user  
**I want to** receive a QR code for my ticket  
**So that** I can quickly check in at the cinema

**Story Points**: 5  
**Status**: ⬜ Backlog

---

#### US-018: Real Payment Gateway

**As a** user  
**I want to** pay with real payment methods  
**So that** the transaction is processed securely

**Story Points**: 13  
**Status**: ⬜ Backlog

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 21/12/2024 | 1.0 | Initial backlog from UseCase.md | ChickenGang Team |
