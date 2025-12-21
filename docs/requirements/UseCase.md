# Use Case Specification - Cinema Booking System

**Project Name**: Cinema Booking System  
**Project Code**: MBS  
**Document Code**: MBS_UseCase_v1.0  
**Version**: 1.0  
**Date**: 08/12/2025  
**Team**: ChickenGang KTPM  
**Status**: Approved

---

## Document History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 08/12/2025 | ChickenGang KTPM | Initial version extracted from Baocao.md |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Use Case Summary by Module](#2-use-case-summary-by-module)
   - 2.1 [Module 1: Access Control](#21-module-1-access-control-4-use-cases)
   - 2.2 [Module 2: Movie Management](#22-module-2-movie-management-5-use-cases)
   - 2.3 [Module 3: Reservation Management](#23-module-3-reservation-management-7-use-cases)
   - 2.4 [Module 4: Payment Process](#24-module-4-payment-process-3-use-cases)
3. [Actors](#3-actors)
4. [Use Case Overview](#4-use-case-overview)
5. [Use Case Specifications](#5-use-case-specifications)
   - 5.1 [Access Control Module](#51-access-control-module)
   - 5.2 [Movie Management Module](#52-movie-management-module)
   - 5.3 [Reservation Management Module](#53-reservation-management-module)
   - 5.4 [Payment Process Module](#54-payment-process-module)
6. [Business Rules](#6-business-rules)
7. [References](#7-references)

---

## 1. Introduction

### 1.1 Purpose

This document provides detailed use case specifications for the Cinema Booking System. It describes the functional requirements through use cases that specify how actors interact with the system to achieve their goals.

### 1.2 Scope

This document covers all major use cases for the Cinema Booking System, including:
- User registration and authentication (Customer & Admin)
- Movie browsing, searching, and management
- Screening and seat selection
- Booking creation and management
- Payment processing (simulated)
- Admin dashboard operations

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| UC | Use Case |
| Customer | End user who browses movies and books tickets |
| Admin | System administrator with management privileges |
| Staff | Staff member who validates tickets (future) |
| JWT | JSON Web Token for authentication |
| RBAC | Role-Based Access Control |
| Screening | A specific showing of a movie at a date/time |
| Booking | A reservation for seats at a screening |
| IDOR | Insecure Direct Object Reference |

### 1.4 Business Context

The Cinema Booking System includes four main business modules:
1. **Access Control**: User registration, login, JWT management, RBAC
2. **Movie Management**: Browse movie catalog, view details, search/filter, Admin CRUD
3. **Reservation Management**: View showtimes, select seats, create/cancel bookings
4. **Payment Process**: Simulated payment (CASH/BANK_TRANSFER), Admin confirmation

---

## 2. Use Case Summary by Module

This section provides a quick overview of all use cases organized by the 4 core modules of the Cinema Booking System.

### 2.1 Module 1: Access Control (4 Use Cases)

**Purpose**: Manage user authentication, authorization, and session management

| ID | Use Case | Actor | Priority | Description |
|----|----------|-------|----------|-------------|
| UC-AC-001 | Register Account | Customer | High | Create new customer account with validation |
| UC-AC-002 | Login (Customer) | Customer | Critical | Authenticate customer with JWT tokens |
| UC-AC-003 | Login (Admin) | Admin | Critical | Authenticate admin with role verification |
| UC-AC-004 | Logout | Customer, Admin | High | End user session and invalidate tokens |

**Key Features**:
- JWT authentication (access token: 15 min, refresh token: 7 days)
- BCrypt password hashing
- Role-based access control (RBAC)
- Rate limiting and brute force protection

---

### 2.2 Module 2: Movie Management (5 Use Cases)

**Purpose**: Manage movie catalog with browsing, searching, and admin CRUD operations

| ID | Use Case | Actor | Priority | Description |
|----|----------|-------|----------|-------------|
| UC-MM-001 | Browse Movies | Customer | Critical | Browse movies with filter, sort, search, pagination |
| UC-MM-002 | View Movie Details | Customer | High | View movie details and available screenings |
| UC-MM-003 | Add Movie | Admin | High | Admin creates new movie in catalog |
| UC-MM-004 | Update Movie | Admin | High | Admin edits existing movie information |
| UC-MM-005 | Delete Movie | Admin | Medium | Admin removes movie (soft delete) |

**Key Features**:
- Search and filter (genre, rating, release date)
- Pagination (12 movies per page)
- SQL injection and XSS prevention
- Real-time screening availability

---

### 2.3 Module 3: Reservation Management (7 Use Cases)

**Purpose**: Handle screening selection, seat booking, and booking management with concurrency control

| ID | Use Case | Actor | Priority | Description |
|----|----------|-------|----------|-------------|
| UC-RM-001 | View Showtimes | Customer | Critical | View available screenings for selected movie |
| UC-RM-002 | View Seat Map | Customer | Critical | Display auditorium seat layout with real-time status |
| UC-RM-003 | Create Booking | Customer | Critical | Create booking with transaction locking (prevent overbooking) |
| UC-RM-004 | View All Bookings | Admin | High | Admin views all customer bookings |
| UC-RM-005 | Cancel Invalid Booking | Admin | High | Admin cancels problematic bookings with audit trail |
| UC-RM-006 | View Own Bookings | Customer | High | Customer views own booking history (IDOR prevention) |
| UC-RM-007 | Cancel Own Booking | Customer | High | Customer cancels PENDING booking and releases seats |

**Key Features**:
- **No TTL hold**: Seats booked immediately on transaction commit
- **Transaction locking**: `SELECT ... FOR UPDATE` prevents race conditions
- **IDOR prevention**: Customers can only access own bookings
- Maximum 10 seats per booking
- Real-time seat availability (no auto-refresh)

---

### 2.4 Module 4: Payment Process (3 Use Cases)

**Purpose**: Handle simulated payments with admin confirmation workflow

| ID | Use Case | Actor | Priority | Description |
|----|----------|-------|----------|-------------|
| UC-PP-001 | Checkout & Pay | Customer | Critical | Create payment for booking (CASH/BANK_TRANSFER simulated) |
| UC-PP-002 | Review Payment Records | Admin | High | Admin views and confirms pending payments |
| UC-PP-003 | Handle Refunds | Admin | Medium | Admin processes refunds and releases seats |

**Key Features**:
- **Simulated payment**: CASH, BANK_TRANSFER (no real gateway integration)
- **Manual confirmation**: Admin confirms payments manually
- Idempotent operations (safe to retry)
- Payment status tracking: PENDING → COMPLETED / FAILED / REFUNDED

**Note**: Real payment gateway integration (VNPay, MoMo) is planned for future releases.

---

## 3. Actors

### 3.1 Customer (Primary Actor)

**Description**: End user who uses the system to browse movies, book tickets, and make payments.

**Responsibilities**:
- Register and login to the system
- Browse and search for movies
- View movie details and screenings
- Select seats and create bookings
- Make payments for bookings
- View and cancel own bookings

**Characteristics**:
- Role: CUSTOMER
- Authentication: Required for booking and payment
- Authorization: Can only access own bookings and data

---

### 2.2 Admin (Primary Actor)

**Description**: System administrator who manages movies, screenings, bookings, and payments.

**Responsibilities**:
- Login to admin portal
- Manage movies (CRUD operations)
- Manage screenings and auditoriums
- View all bookings and payments
- Confirm payments manually
- Handle refunds
- View reports and statistics

**Characteristics**:
- Role: ADMIN
- Authentication: Required via admin portal
- Authorization: Full access to all system functions

---

### 2.3 System (Supporting Actor)

**Description**: The Cinema Booking System itself, which handles automated processing.

**Responsibilities**:
- Validate input data
- Calculate prices and apply promotions
- Manage seat availability in real-time
- Update booking/payment status
- Enforce business rules and constraints
- Log audit trails

---

## 4. Use Case Overview

### 4.1 Complete Use Case List

The following table lists all 19 use cases with their basic information. For detailed specifications of each use case, see Section 5.

| ID | Use Case Name | Actor(s) | Priority | Status |
|----|---------------|----------|----------|--------|
| UC-AC-001 | Register Account | Customer | High | Active |
| UC-AC-002 | Login (Customer) | Customer | Critical | Active |
| UC-AC-003 | Login (Admin) | Admin | Critical | Active |
| UC-AC-004 | Logout | Customer, Admin | High | Active |
| UC-MM-001 | Browse Movies | Customer | Critical | Active |
| UC-MM-002 | View Movie Details | Customer | High | Active |
| UC-MM-003 | Add Movie | Admin | High | Active |
| UC-MM-004 | Update Movie | Admin | High | Active |
| UC-MM-005 | Delete Movie | Admin | Medium | Active |
| UC-RM-001 | View Showtimes | Customer | Critical | Active |
| UC-RM-002 | View Seat Map | Customer | Critical | Active |
| UC-RM-003 | Create Booking | Customer | Critical | Active |
| UC-RM-004 | View All Bookings | Admin | High | Active |
| UC-RM-005 | Cancel Invalid Booking | Admin | High | Active |
| UC-RM-006 | View Own Bookings | Customer | High | Active |
| UC-RM-007 | Cancel Own Booking | Customer | High | Active |
| UC-PP-001 | Checkout & Pay | Customer | Critical | Active |
| UC-PP-002 | Review Payment Records | Admin | High | Active |
| UC-PP-003 | Handle Refunds | Admin | Medium | Active |

---

## 5. Use Case Specifications

This section provides detailed specifications for all 19 use cases, organized by module. Each use case follows IEEE/ISO format with:
- Preconditions and Postconditions
- Main Flow (numbered steps)
- Alternative Flows (A1, A2...)
- Exception Flows (E1, E2...)
- Business Rules
- Non-Functional Requirements

---

## 5.1 Access Control Module

### UC-AC-001: Register Account

**Use Case ID**: UC-AC-001  
**Use Case Name**: Register Account  
**Actor(s)**: Customer (Primary)  
**Priority**: High  
**Related Requirements**: FR1

#### Description
Allows a new user to create a customer account in the system by providing required personal information.

#### Preconditions
- User is not logged in
- User has valid email address
- User has internet connection

#### Postconditions
- Success: New user account created with CUSTOMER role
- Success: User redirected to login page
- Failure: User remains on registration page with error message

#### Main Flow
1. User navigates to registration page
2. System displays registration form
3. User enters required information:
   - Username
   - Email
   - Password
   - Phone number
   - Address
   - Date of birth
4. User clicks "Register" button
5. System validates input data (see Business Rules BR-AC-001 to BR-AC-004)
6. System checks email uniqueness
7. System hashes password using BCrypt
8. System creates user account with CUSTOMER role
9. System displays success message
10. System redirects user to login page

#### Alternative Flows

**A1: Email Already Exists**
- At step 6, if email already registered:
  - System displays error: "Email already registered"
  - Return to step 3

**A2: Weak Password**
- At step 5, if password doesn't meet strength requirements:
  - System displays error: "Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character"
  - Return to step 3

**A3: Invalid Email Format**
- At step 5, if email format is invalid:
  - System displays error: "Invalid email format"
  - Return to step 3

#### Exception Flows

**E1: Database Connection Error**
- At step 8, if database unavailable:
  - System displays error: "Service temporarily unavailable. Please try again later"
  - Log error for investigation
  - Return to step 3

**E2: Network Error**
- At any step, if network connection lost:
  - System displays error: "Connection lost. Please check your internet connection"
  - System preserves entered data (client-side)

#### Business Rules

- **BR-AC-001**: Email must be unique in the system
- **BR-AC-002**: Password must be at least 8 characters with uppercase, lowercase, digit, and special character
- **BR-AC-003**: Phone number must be valid Vietnamese format (10 digits starting with 0)
- **BR-AC-004**: Date of birth must be at least 13 years ago (age restriction)
- **BR-AC-005**: All required fields must be filled
- **BR-AC-006**: Password must be hashed using BCrypt before storage
- **BR-AC-007**: New users automatically assigned CUSTOMER role

#### Non-Functional Requirements
- **NFR2**: Password hashed using BCrypt
- **NFR4**: Form validation works in real-time
- **NFR5**: Input sanitized to prevent XSS

---

### UC-AC-002: Login (Customer)

**Use Case ID**: UC-AC-002  
**Use Case Name**: Login (Customer)  
**Actor(s)**: Customer (Primary)  
**Priority**: Critical  
**Related Requirements**: FR1

#### Description
Allows registered customer to authenticate and access the system using username and password.

#### Preconditions
- User has registered account
- User is not currently logged in
- User knows username and password

#### Postconditions
- Success: User authenticated with JWT tokens (access + refresh)
- Success: User redirected to home page (movie list)
- Success: User session created
- Failure: User remains on login page with error message

#### Main Flow
1. User navigates to login page
2. System displays login form
3. User enters username/email
4. User enters password
5. User clicks "Login" button
6. System validates credentials
7. System generates JWT access token (expires in 15 minutes)
8. System generates JWT refresh token (expires in 7 days)
9. System stores tokens securely (HttpOnly cookies or localStorage)
10. System retrieves user profile and role
11. System displays success message
12. System redirects user to home page

#### Alternative Flows

**A1: Invalid Credentials**
- At step 6, if credentials invalid:
  - System displays error: "Invalid username or password"
  - System logs failed login attempt
  - Return to step 3

**A2: Account Disabled**
- At step 6, if account is disabled:
  - System displays error: "Your account has been disabled. Please contact support"
  - System logs attempted access
  - Stop

**A3: Remember Me Option**
- At step 4, user checks "Remember Me":
  - System extends refresh token expiry to 30 days
  - Continue to step 5

#### Exception Flows

**E1: Database Unavailable**
- At step 6, if database connection fails:
  - System displays error: "Service temporarily unavailable"
  - System logs error
  - Return to step 3

**E2: Too Many Failed Attempts**
- After 5 failed attempts within 15 minutes:
  - System temporarily blocks IP address for 30 minutes
  - System displays error: "Too many failed attempts. Please try again in 30 minutes"
  - Stop

#### Business Rules

- **BR-AC-008**: Maximum 5 login attempts per IP within 15 minutes
- **BR-AC-009**: JWT access token expires in 15 minutes
- **BR-AC-010**: JWT refresh token expires in 7 days (30 days if "Remember Me")
- **BR-AC-011**: Password comparison uses BCrypt verify
- **BR-AC-012**: Failed login attempts are logged for security
- **BR-AC-013**: Tokens signed with HMAC-SHA256

#### Non-Functional Requirements
- **NFR2**: JWT authentication with secure token storage
- **NFR2**: RBAC enforced (CUSTOMER role)
- **NFR1**: Login API response time < 2 seconds

---

### UC-AC-003: Login (Admin)

**Use Case ID**: UC-AC-003  
**Use Case Name**: Login (Admin)  
**Actor(s)**: Admin (Primary)  
**Priority**: Critical  
**Related Requirements**: FR1

#### Description
Allows administrator to authenticate and access the admin portal.

#### Preconditions
- Admin account exists in system
- Admin is not currently logged in
- Admin navigates to admin portal (/admin)

#### Postconditions
- Success: Admin authenticated with JWT tokens
- Success: Admin redirected to admin dashboard
- Success: Admin session created with ADMIN role
- Failure: Admin remains on login page

#### Main Flow
1. Admin navigates to admin login page (/admin/login)
2. System displays admin login form
3. Admin enters username
4. Admin enters password
5. Admin clicks "Login" button
6. System validates credentials
7. System verifies role = ADMIN
8. System generates JWT access token (expires in 15 minutes)
9. System generates JWT refresh token (expires in 7 days)
10. System stores tokens securely
11. System retrieves admin profile
12. System displays success message
13. System redirects to admin dashboard

#### Alternative Flows

**A1: Customer Attempts Admin Login**
- At step 7, if role != ADMIN:
  - System displays error: "Access denied. Admin privileges required"
  - System logs unauthorized access attempt
  - Stop

**A2: Invalid Credentials**
- At step 6, if credentials invalid:
  - System displays error: "Invalid admin credentials"
  - System logs failed attempt with IP address
  - Return to step 3

#### Exception Flows

**E1: Brute Force Attack**
- After 3 failed attempts within 10 minutes:
  - System temporarily blocks IP for 1 hour
  - System sends alert to admin group
  - System displays error: "Account temporarily locked. Contact system administrator"
  - Stop

#### Business Rules

- **BR-AC-014**: Only users with ADMIN role can access admin portal
- **BR-AC-015**: Admin login attempts more strictly rate-limited (3 attempts / 10 minutes)
- **BR-AC-016**: Admin failed login triggers security alerts
- **BR-AC-017**: Admin tokens have same expiry as customer tokens

#### Non-Functional Requirements
- **NFR2**: RBAC strictly enforced at API and UI level
- **NFR2**: Failed admin login attempts trigger security monitoring
- **NFR1**: Admin login API response time < 2 seconds

---

### UC-AC-004: Logout

**Use Case ID**: UC-AC-004  
**Use Case Name**: Logout  
**Actor(s)**: Customer, Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR1

#### Description
Allows authenticated user to end their session and log out from the system.

#### Preconditions
- User is logged in
- Valid JWT tokens exist

#### Postconditions
- Success: User session terminated
- Success: JWT tokens invalidated
- Success: User redirected to home page or login page
- User can no longer access protected resources

#### Main Flow
1. User clicks "Logout" button in user menu
2. System prompts for confirmation: "Are you sure you want to logout?"
3. User confirms logout
4. System invalidates JWT tokens (add to blacklist if implemented)
5. System clears tokens from storage (cookies/localStorage)
6. System clears user session data
7. System displays message: "You have been logged out successfully"
8. System redirects to home page (or admin login for admin)

#### Alternative Flows

**A1: User Cancels Logout**
- At step 3, if user clicks "Cancel":
  - System closes confirmation dialog
  - User remains logged in
  - Stop

**A2: Auto Logout on Token Expiry**
- When access token expires and refresh fails:
  - System automatically logs out user
  - System displays message: "Your session has expired. Please login again"
  - System redirects to login page

#### Exception Flows

**E1: Network Error During Logout**
- At step 4, if network error occurs:
  - System clears tokens locally (client-side)
  - System displays warning: "Logged out locally. Session may still be active on server"
  - User is logged out from UI perspective

#### Business Rules

- **BR-AC-018**: Logout must clear all authentication tokens
- **BR-AC-019**: User cannot access protected resources after logout
- **BR-AC-020**: Session cleanup must be thorough (no residual data)

#### Non-Functional Requirements
- **NFR2**: Tokens properly invalidated for security
- **NFR1**: Logout operation completes within 1 second

---

## 5.2 Movie Management Module

### UC-MM-001: Browse Movies

**Use Case ID**: UC-MM-001  
**Use Case Name**: Browse Movies (Filter, Sort, Search)  
**Actor(s)**: Customer (Primary), System (Supporting)  
**Priority**: Critical  
**Related Requirements**: FR2

#### Description
Allows customer to browse available movies with filtering, sorting, and search capabilities.

#### Preconditions
- System is running
- Database contains movie data
- Internet connection available

#### Postconditions
- Success: List of movies displayed with pagination
- Success: Filters and sorting applied correctly
- Movies match search/filter criteria

#### Main Flow
1. Customer navigates to home page or movie list page
2. System loads movie catalog from database
3. System displays list of available movies with:
   - Movie poster
   - Title
   - Genre
   - Rating
   - Duration
   - Release date
4. System shows 12 movies per page (default)
5. System displays pagination controls
6. Customer can interact with filters/search (see Alternative Flows)

#### Alternative Flows

**A1: Apply Genre Filter**
- At step 6, customer selects genre from dropdown:
  - System filters movies by selected genre
  - System updates movie list and count
  - System displays only matching movies
  - Pagination resets to page 1

**A2: Apply Sort**
- At step 6, customer selects sort option:
  - Options: Title (A-Z), Rating (High-Low), Release Date (Newest)
  - System re-orders movie list
  - Current page position maintained if possible

**A3: Search by Title**
- At step 6, customer enters search term in search box:
  - System searches movies where title contains term (case-insensitive)
  - System displays matching movies
  - System displays count: "Found X movies"
  - If no results: System displays "No movies found"

**A4: Combine Filter + Search + Sort**
- Customer can apply multiple criteria simultaneously:
  - System applies all filters and search
  - System sorts results
  - System displays filtered, searched, sorted results

**A5: Navigate to Next Page**
- At step 6, customer clicks pagination (Next, Previous, or page number):
  - System loads requested page
  - System maintains current filters/search/sort
  - System updates page indicator

#### Exception Flows

**E1: No Movies Available**
- At step 2, if database has no movies:
  - System displays message: "No movies available at the moment"
  - System shows empty state UI

**E2: Database Error**
- At step 2, if database connection fails:
  - System displays error: "Unable to load movies. Please try again"
  - System logs error
  - System shows retry button

**E3: SQL Injection Attempt**
- At A3, if search input contains SQL injection payload:
  - System safely handles input using parameterized queries
  - System treats payload as plain text
  - No SQL error occurs
  - System returns legitimate search results (or empty)

**E4: XSS Attack Attempt**
- At A3, if search input contains HTML/JavaScript tags:
  - System escapes HTML entities
  - System treats payload as plain text
  - Script does not execute
  - System displays escaped text safely

#### Business Rules

- **BR-MM-001**: Default 12 movies per page
- **BR-MM-002**: Pagination required if more than 12 movies
- **BR-MM-003**: Search is case-insensitive and matches partial titles
- **BR-MM-004**: All user input must be sanitized and escaped
- **BR-MM-005**: SQL injection must be prevented using parameterized queries
- **BR-MM-006**: XSS must be prevented using output encoding
- **BR-MM-007**: Empty search shows all movies (no filter)

#### Non-Functional Requirements
- **NFR1**: Movie list loads within 3 seconds
- **NFR1**: Search/filter updates within 2 seconds
- **NFR2**: Input validated and sanitized (SQL injection, XSS prevention)
- **NFR4**: Responsive design on desktop, tablet, mobile

---

### UC-MM-002: View Movie Details

**Use Case ID**: UC-MM-002  
**Use Case Name**: View Movie Details  
**Actor(s)**: Customer (Primary)  
**Priority**: High  
**Related Requirements**: FR2

#### Description
Allows customer to view detailed information about a specific movie including description, trailer, cast, and available screenings.

#### Preconditions
- Movie exists in database
- Customer has browsed movie list (UC-MM-001)

#### Postconditions
- Success: Movie details displayed with all metadata
- Success: Available screenings listed
- Customer can proceed to book screening

#### Main Flow
1. Customer clicks on movie card from movie list
2. System retrieves movie details by movie ID
3. System retrieves available screenings for this movie
4. System displays movie detail page with:
   - Movie title
   - Full description
   - Poster/banner image
   - Trailer (embedded video)
   - Genre
   - Duration (in minutes)
   - Rating (e.g., PG-13, R)
   - Release date
   - Director
   - Cast
   - User rating (if available)
5. System displays list of available screenings:
   - Date and time
   - Auditorium
   - Available seats count
   - Price
6. System displays "Book Now" button for each screening
7. Customer can click "Book Now" to proceed to UC-RM-001

#### Alternative Flows

**A1: No Screenings Available**
- At step 3, if no future screenings exist:
  - System displays message: "No screenings available for this movie"
  - "Book Now" buttons disabled

**A2: Trailer Not Available**
- At step 4, if trailer URL is null or invalid:
  - System hides trailer section
  - Other details still displayed

**A3: Filter Screenings by Date**
- At step 5, customer selects date from calendar:
  - System filters screenings for selected date
  - System updates screening list

#### Exception Flows

**E1: Movie Not Found**
- At step 2, if movie ID invalid or movie deleted:
  - System displays error page: "Movie not found"
  - System provides link back to movie list

**E2: IDOR Attempt**
- At step 2, if customer manipulates URL with non-existent movie ID:
  - System returns 404 Not Found
  - System logs attempt for security monitoring

#### Business Rules

- **BR-MM-008**: Only future screenings displayed (date/time > current time)
- **BR-MM-009**: Available seats count must be real-time accurate
- **BR-MM-010**: Movie details must show all mandatory fields (title, description, duration)
- **BR-MM-011**: Trailer is optional

#### Non-Functional Requirements
- **NFR1**: Movie details page loads within 2 seconds
- **NFR4**: Responsive design, images optimized
- **NFR4**: Trailer plays smoothly

---

### UC-MM-003: Add Movie

**Use Case ID**: UC-MM-003  
**Use Case Name**: Add Movie  
**Actor(s)**: Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR2

#### Description
Allows admin to add a new movie to the system catalog.

#### Preconditions
- Admin is logged in
- Admin has navigated to admin dashboard
- Admin has ADMIN role

#### Postconditions
- Success: New movie created in database
- Success: Movie appears in public catalog
- Success: Admin redirected to movie management page
- Failure: Movie not created, error displayed

#### Main Flow
1. Admin navigates to "Movies" section in admin dashboard
2. Admin clicks "Add New Movie" button
3. System displays movie creation form
4. Admin enters movie information:
   - Title (required)
   - Description (required)
   - Duration in minutes (required)
   - Genre (required, select from predefined list)
   - Rating (required, e.g., G, PG, PG-13, R)
   - Release date (required)
   - Director (optional)
   - Cast (optional)
   - Poster URL (required)
   - Trailer URL (optional)
5. Admin clicks "Save" button
6. System validates input data (see Business Rules)
7. System checks for duplicate movie (same title + release year)
8. System saves movie to database
9. System generates movie ID
10. System displays success message: "Movie added successfully"
11. System redirects admin to movie management page
12. New movie appears in list

#### Alternative Flows

**A1: Upload Poster Image**
- At step 4, admin uploads poster image file:
  - System validates file type (jpg, png, webp)
  - System validates file size (< 5MB)
  - System uploads to storage
  - System generates poster URL
  - Continue to step 5

**A2: Duplicate Movie Warning**
- At step 7, if similar movie exists (same title, similar year):
  - System displays warning: "A similar movie already exists. Do you want to add anyway?"
  - Admin can confirm or cancel
  - If confirmed: Continue to step 8
  - If cancelled: Return to step 4

**A3: Save as Draft**
- At step 5, admin clicks "Save as Draft":
  - System saves movie with status = DRAFT
  - Movie not visible to customers
  - Admin can edit later

#### Exception Flows

**E1: Validation Error**
- At step 6, if required fields missing or invalid:
  - System highlights problematic fields
  - System displays error messages next to fields
  - Return to step 4

**E2: Database Constraint Violation**
- At step 8, if database constraint violated:
  - System displays error: "Unable to save movie. Please check data and try again"
  - System logs error
  - Return to step 4

**E3: Unauthorized Access**
- At step 1, if non-admin user attempts access:
  - System returns 403 Forbidden
  - System displays error: "Access denied"
  - System logs unauthorized attempt

#### Business Rules

- **BR-MM-012**: Only ADMIN role can add movies
- **BR-MM-013**: Title, description, duration, genre, rating, release date, poster are required
- **BR-MM-014**: Duration must be positive integer (typically 60-240 minutes)
- **BR-MM-015**: Genre must be from predefined list
- **BR-MM-016**: Poster file must be image format (jpg, png, webp) and < 5MB
- **BR-MM-017**: Release date can be past or future

#### Non-Functional Requirements
- **NFR2**: Authorization check enforced (ADMIN only)
- **NFR4**: Form validation in real-time
- **NFR1**: Movie creation API response < 2 seconds

---

### UC-MM-004: Update Movie

**Use Case ID**: UC-MM-004  
**Use Case Name**: Update Movie  
**Actor(s)**: Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR2

#### Description
Allows admin to edit existing movie information.

#### Preconditions
- Admin is logged in with ADMIN role
- Movie exists in database
- Admin has navigated to movie management

#### Postconditions
- Success: Movie information updated in database
- Success: Changes reflected in public catalog
- Success: Audit log entry created
- Failure: Movie not updated, error displayed

#### Main Flow
1. Admin navigates to "Movies" section in admin dashboard
2. System displays list of all movies
3. Admin searches/filters to find target movie
4. Admin clicks "Edit" button for selected movie
5. System loads movie data into edit form
6. System displays edit form with current values
7. Admin modifies desired fields
8. Admin clicks "Update" button
9. System validates input data
10. System updates movie in database
11. System creates audit log entry (who, what, when)
12. System displays success message: "Movie updated successfully"
13. System refreshes movie list with updated data

#### Alternative Flows

**A1: Change Poster Image**
- At step 7, admin uploads new poster:
  - System validates file
  - System uploads to storage
  - System updates poster URL
  - Old poster can be deleted or archived
  - Continue to step 8

**A2: No Changes Made**
- At step 8, if no fields modified:
  - System displays info message: "No changes detected"
  - Return to movie list without update

#### Exception Flows

**E1: Movie Not Found**
- At step 5, if movie ID invalid or deleted:
  - System displays error: "Movie not found"
  - Return to movie list

**E2: Concurrent Edit Conflict**
- At step 10, if another admin modified same movie:
  - System detects version conflict
  - System displays error: "Movie was modified by another user. Please refresh and try again"
  - Return to step 2

**E3: Validation Error**
- At step 9, if validation fails:
  - System highlights errors
  - Return to step 7

#### Business Rules

- **BR-MM-018**: Only ADMIN can update movies
- **BR-MM-019**: All validation rules from UC-MM-003 apply
- **BR-MM-020**: Audit trail required for movie updates
- **BR-MM-021**: Movie ID cannot be changed

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization required
- **NFR5**: Audit log with who/what/when
- **NFR1**: Update API response < 2 seconds

---

### UC-MM-005: Delete Movie

**Use Case ID**: UC-MM-005  
**Use Case Name**: Delete Movie  
**Actor(s)**: Admin (Primary)  
**Priority**: Medium  
**Related Requirements**: FR2

#### Description
Allows admin to remove a movie from the system catalog.

#### Preconditions
- Admin is logged in with ADMIN role
- Movie exists in database
- Admin has navigated to movie management

#### Postconditions
- Success: Movie marked as deleted (soft delete) or removed (hard delete)
- Success: Movie no longer visible in public catalog
- Success: Audit log entry created
- Failure: Movie not deleted if active bookings exist

#### Main Flow
1. Admin navigates to "Movies" section
2. Admin finds movie to delete
3. Admin clicks "Delete" button
4. System checks for active bookings/screenings
5. System displays confirmation dialog: "Are you sure you want to delete '{movie_title}'? This action cannot be undone."
6. Admin confirms deletion
7. System performs soft delete (sets is_deleted = true, deleted_at = now)
8. System creates audit log entry
9. System displays success message: "Movie deleted successfully"
10. System removes movie from displayed list

#### Alternative Flows

**A1: Admin Cancels Deletion**
- At step 6, if admin clicks "Cancel":
  - System closes dialog
  - No changes made
  - Return to movie list

**A2: Movie Has Active Screenings**
- At step 4, if movie has future screenings:
  - System displays warning: "This movie has active screenings. Delete anyway?"
  - If admin confirms: Continue to step 7
  - If admin cancels: Stop

#### Exception Flows

**E1: Movie Has Active Bookings**
- At step 4, if movie has bookings with status = PENDING or CONFIRMED:
  - System displays error: "Cannot delete movie with active bookings. Please cancel bookings first or wait for screenings to complete."
  - System lists affected screenings/bookings
  - Stop

**E2: Movie Not Found**
- At step 4, if movie already deleted:
  - System displays error: "Movie not found or already deleted"
  - Return to movie list

#### Business Rules

- **BR-MM-022**: Only ADMIN can delete movies
- **BR-MM-023**: Cannot delete movie with active bookings (PENDING/CONFIRMED)
- **BR-MM-024**: Soft delete preferred (preserve data integrity)
- **BR-MM-025**: Audit trail required for deletions
- **BR-MM-026**: Deleted movies hidden from public catalog but data retained

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization required
- **NFR5**: Audit log with deletion reason
- **NFR5**: Data integrity preserved (soft delete)

---

## 5.3 Reservation Management Module

### UC-RM-001: View Showtimes

**Use Case ID**: UC-RM-001  
**Use Case Name**: View Showtimes  
**Actor(s)**: Customer (Primary)  
**Priority**: Critical  
**Related Requirements**: FR3

#### Description
Allows customer to view available screenings for a selected movie with date, time, auditorium, and seat availability.

#### Preconditions
- Customer has viewed movie details (UC-MM-002)
- Movie has at least one future screening

#### Postconditions
- Success: List of available screenings displayed
- Customer can select a screening to view seats
- Screening information is accurate and up-to-date

#### Main Flow
1. Customer is on movie detail page
2. System retrieves screenings for movie where date/time > current time
3. System calculates available seats for each screening
4. System displays screenings grouped by date:
   - Date (e.g., "Today", "Tomorrow", "Dec 10")
   - Time (e.g., "10:00", "13:30", "19:00")
   - Auditorium name/number
   - Available seats count (e.g., "45/100 seats available")
   - Price per seat
   - "Book Now" button
5. Customer can filter by date (see Alternative Flows)
6. Customer clicks "Book Now" for desired screening
7. System navigates to seat selection page (UC-RM-002)

#### Alternative Flows

**A1: Filter by Date**
- At step 5, customer selects date from calendar:
  - System filters screenings for selected date
  - System updates screening list
  - If no screenings: Display "No screenings on this date"

**A2: Filter by Time Range**
- At step 5, customer selects time range (Morning, Afternoon, Evening):
  - System filters screenings by time range
  - System updates screening list

**A3: Sold Out Screening**
- At step 4, if available_seats = 0:
  - System displays "SOLD OUT" badge
  - "Book Now" button disabled
  - Customer cannot select this screening

#### Exception Flows

**E1: No Screenings Available**
- At step 2, if no future screenings exist:
  - System displays message: "No upcoming screenings for this movie"
  - System suggests browsing other movies

**E2: Screening Expired**
- If screening date/time passes while customer viewing:
  - System automatically removes from list
  - System displays message: "This screening has started. Please select another time"

#### Business Rules

- **BR-RM-001**: Only future screenings displayed (date/time > now)
- **BR-RM-002**: Available seats count must be real-time accurate
- **BR-RM-003**: Screenings sorted by date then time
- **BR-RM-004**: Sold out screenings displayed but cannot be booked
- **BR-RM-005**: Seat availability updated on page load (no auto-refresh)

#### Non-Functional Requirements
- **NFR1**: Screenings load within 2 seconds
- **NFR4**: Clear display of date/time, timezone-aware
- **NFR4**: Responsive layout

---

### UC-RM-002: View Seat Map

**Use Case ID**: UC-RM-002  
**Use Case Name**: View Seat Map  
**Actor(s)**: Customer (Primary), System (Supporting)  
**Priority**: Critical  
**Related Requirements**: FR3

#### Description
Allows customer to view auditorium seat layout with real-time seat status (Available, Booked) and select desired seats for booking.

#### Preconditions
- Customer is logged in (authentication required)
- Customer has selected screening (UC-RM-001)
- Screening has available seats

#### Postconditions
- Success: Seat map displayed with accurate status
- Success: Customer has selected 1-10 seats
- Success: Total price calculated
- Ready to proceed to booking creation

#### Main Flow
1. Customer clicks "Book Now" for screening
2. System checks if customer is logged in
3. System retrieves auditorium layout for screening
4. System retrieves current seat bookings for screening
5. System displays seat map with:
   - Grid layout matching auditorium configuration
   - Seat labels (e.g., A1, A2, B1, B2...)
   - Seat status colors:
     - Green: Available
     - Red: Booked
     - Blue: Selected (by current customer)
     - Gray: Disabled/Blocked
   - Legend explaining colors
6. System displays seat type and pricing:
   - Normal seats: 100,000 VND
   - VIP seats: 150,000 VND
7. Customer clicks on available seats to select (max 10)
8. System highlights selected seats in blue
9. System updates selected seat count
10. System calculates and displays total price
11. Customer clicks "Confirm Booking" button
12. System proceeds to UC-RM-003 (Create Booking)

#### Alternative Flows

**A1: Customer Deselects Seat**
- At step 8, customer clicks on already-selected seat:
  - System removes selection (changes blue back to green)
  - System decreases seat count
  - System recalculates total price

**A2: Customer Selects Maximum Seats**
- At step 7, if customer has selected 10 seats already:
  - System displays warning: "Maximum 10 seats per booking"
  - System prevents selecting 11th seat
  - Customer must deselect before selecting different seat

**A3: Seat Becomes Booked While Viewing**
- While customer viewing seat map, another customer books seats:
  - System does NOT auto-refresh (no real-time WebSocket)
  - When customer tries to book (step 11): See UC-RM-003 E2 (Seat Conflict)

#### Exception Flows

**E1: Customer Not Logged In**
- At step 2, if customer not authenticated:
  - System displays message: "Please login to book seats"
  - System redirects to login page
  - After login: System returns to seat selection for same screening

**E2: Customer Attempts to Select Booked Seat**
- At step 7, if customer clicks red (booked) seat:
  - System does nothing (no action)
  - Seat remains red
  - System can display tooltip: "This seat is already booked"

**E3: All Seats Booked**
- At step 4, if all seats have status = BOOKED:
  - System displays message: "Sorry, this screening is sold out"
  - System disables seat selection
  - System suggests other screenings

**E4: Screening Started**
- At step 3, if screening date/time has passed:
  - System displays error: "This screening has already started"
  - System redirects back to movie details

#### Business Rules

- **BR-RM-006**: Customer must be logged in to view seat map and book
- **BR-RM-007**: Maximum 10 seats per booking
- **BR-RM-008**: Minimum 1 seat required to proceed
- **BR-RM-009**: Cannot select already booked seats (red)
- **BR-RM-010**: Cannot select disabled/blocked seats (gray)
- **BR-RM-011**: No TTL hold mechanism - seats booked immediately on transaction commit
- **BR-RM-012**: Price calculation: sum of seat prices based on seat type
- **BR-RM-013**: Selected seats stored client-side only (no hold on server)

#### Non-Functional Requirements
- **NFR1**: Seat map loads within 2 seconds
- **NFR4**: Responsive seat map on mobile devices
- **NFR4**: Clear visual distinction between seat statuses
- **NFR4**: Accessible seat selection (keyboard navigation)

---

### UC-RM-003: Create Booking

**Use Case ID**: UC-RM-003  
**Use Case Name**: Create Booking  
**Actor(s)**: Customer (Primary), System (Supporting)  
**Priority**: Critical  
**Related Requirements**: FR4

#### Description
Allows customer to create a booking for selected seats at a screening. The system immediately marks seats as BOOKED using database transaction with locking to prevent overbooking.

#### Preconditions
- Customer is logged in
- Customer has selected 1-10 seats (UC-RM-002)
- Screening exists and has not started
- Selected seats were available when displayed

#### Postconditions
- Success: Booking created with status = PENDING
- Success: Seats marked as BOOKED in database
- Success: Unique booking code generated
- Success: Total price calculated with breakdown
- Success: Customer redirected to payment page
- Failure: Booking not created, seats remain available
- Failure: Customer notified of conflict

#### Main Flow
1. Customer clicks "Confirm Booking" on seat selection page
2. System displays booking summary:
   - Movie title
   - Screening date and time
   - Auditorium
   - Selected seats (e.g., A5, A6, B3)
   - Seat type breakdown (2 Normal, 1 VIP)
   - Price per seat
   - Total price
3. Customer reviews summary
4. Customer clicks "Proceed to Payment"
5. System starts database transaction
6. System locks selected seats (SELECT ... FOR UPDATE)
7. System re-checks seat availability
8. System creates Booking record:
   - booking_code (unique, 8-10 characters)
   - user_id
   - screening_id
   - status = PENDING
   - total_price
   - created_at
9. System creates BookingSeat records for each selected seat
10. System updates seat status to BOOKED
11. System commits transaction
12. System generates booking confirmation
13. System displays success message with booking code
14. System redirects to payment page (UC-PP-001)

#### Alternative Flows

**A1: Customer Edits Selection**
- At step 3, customer clicks "Back" or "Edit Seats":
  - System returns to seat selection (UC-RM-002)
  - Selected seats remain highlighted (client-side)
  - No booking created yet

#### Exception Flows

**E1: Authentication Lost**
- At step 5, if customer session expired:
  - System displays error: "Session expired. Please login again"
  - System redirects to login page
  - After login: System can restore seat selection if possible

**E2: Seat Conflict (Concurrent Booking)**
- At step 7, if one or more seats already booked by another customer:
  - System detects conflict (seats locked by another transaction or already BOOKED)
  - System rolls back transaction
  - System displays error: "Sorry, the following seats are no longer available: {seat_list}. Please select different seats."
  - System returns to seat selection with conflicting seats removed
  - Available seats refreshed

**E3: Screening Full**
- At step 7, if all seats for screening now booked:
  - System rolls back transaction
  - System displays error: "Sorry, this screening is now sold out"
  - System suggests other screenings for same movie

**E4: Screening Started**
- At step 5, if screening start time passed:
  - System displays error: "This screening has already started. You cannot book seats"
  - System returns to movie details

**E5: Maximum Bookings Exceeded**
- At step 8, if customer has 5 pending bookings:
  - System displays error: "Maximum 5 pending bookings allowed. Please complete or cancel existing bookings"
  - Stop

**E6: Database Deadlock**
- At step 6 or 10, if database deadlock occurs:
  - System retries transaction (up to 3 times)
  - If still fails: Display error "Unable to complete booking due to high demand. Please try again"
  - Return to seat selection

#### Business Rules

- **BR-RM-014**: Customer must be authenticated
- **BR-RM-015**: Booking created with status = PENDING initially
- **BR-RM-016**: Seats marked BOOKED immediately (no TTL hold)
- **BR-RM-017**: Transaction locking prevents overbooking (UNIQUE constraint on screening_id, seat_id)
- **BR-RM-018**: Re-check seat availability before commit (prevent race condition)
- **BR-RM-019**: Booking code must be unique (8-10 alphanumeric characters)
- **BR-RM-020**: Total price = sum of seat prices (based on seat type)
- **BR-RM-021**: Maximum 5 pending bookings per customer
- **BR-RM-022**: Cannot book seats for past screenings

#### Non-Functional Requirements
- **NFR1**: Booking creation API p95 < 800ms (with transaction + lock)
- **NFR2**: Transaction isolation prevents race conditions
- **NFR3**: Idempotency - retry-safe, no duplicate bookings
- **NFR5**: Audit trail for all bookings

---

### UC-RM-004: View All Bookings (Admin)

**Use Case ID**: UC-RM-004  
**Use Case Name**: View All Bookings  
**Actor(s)**: Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR4, FR8

#### Description
Allows admin to view all customer bookings across the system with filtering and search capabilities.

#### Preconditions
- Admin is logged in with ADMIN role
- Admin has navigated to admin dashboard

#### Postconditions
- Success: List of all bookings displayed
- Success: Filters applied correctly
- Admin can drill down into booking details

#### Main Flow
1. Admin navigates to "Bookings" section in admin dashboard
2. System retrieves all bookings from database
3. System displays booking list with columns:
   - Booking Code
   - Customer Name
   - Movie Title
   - Screening Date/Time
   - Seats (e.g., "A5, A6, B3")
   - Total Price
   - Status (PENDING, CONFIRMED, CANCELLED)
   - Created Date
   - Actions (View, Cancel)
4. System shows pagination (20 bookings per page)
5. Admin can apply filters (see Alternative Flows)
6. Admin can click "View" to see booking details
7. Admin can click "Cancel" to cancel invalid booking (UC-RM-005)

#### Alternative Flows

**A1: Filter by Status**
- At step 5, admin selects status filter:
  - System filters bookings by status (PENDING, CONFIRMED, CANCELLED)
  - System updates list

**A2: Filter by Date Range**
- At step 5, admin selects date range:
  - System filters bookings by screening date
  - System updates list

**A3: Search by Booking Code or Customer**
- At step 5, admin enters search term:
  - System searches bookings by booking_code or customer name/email
  - System displays matching results

**A4: Sort by Column**
- At step 5, admin clicks column header:
  - System sorts bookings by that column
  - Toggle ascending/descending

**A5: Export to CSV**
- At step 5, admin clicks "Export" button:
  - System generates CSV file with booking data
  - System downloads file to admin's device

#### Exception Flows

**E1: No Bookings Found**
- At step 2, if no bookings exist:
  - System displays message: "No bookings found"
  - System shows empty state

**E2: Unauthorized Access**
- At step 1, if non-admin user attempts access:
  - System returns 403 Forbidden
  - System displays error: "Admin access required"

#### Business Rules

- **BR-RM-023**: Only ADMIN can view all bookings
- **BR-RM-024**: Bookings from all customers visible to admin
- **BR-RM-025**: Pagination required for performance (20 per page)
- **BR-RM-026**: All booking statuses visible (PENDING, CONFIRMED, CANCELLED)

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization enforced
- **NFR1**: Booking list loads within 3 seconds
- **NFR4**: Sortable, filterable, searchable interface

---

### UC-RM-005: Cancel Invalid Booking (Admin)

**Use Case ID**: UC-RM-005  
**Use Case Name**: Cancel Invalid Booking  
**Actor(s)**: Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR4, FR8

#### Description
Allows admin to cancel invalid or problematic bookings and release the reserved seats.

#### Preconditions
- Admin is logged in with ADMIN role
- Booking exists in system
- Booking status = PENDING or CONFIRMED

#### Postconditions
- Success: Booking status changed to CANCELLED
- Success: Seats released (status = AVAILABLE)
- Success: Customer notified (if notification service available)
- Success: Audit log entry created

#### Main Flow
1. Admin viewing booking list (UC-RM-004)
2. Admin identifies invalid booking (e.g., duplicate, fraud, expired payment)
3. Admin clicks "Cancel" button for target booking
4. System displays booking details and cancellation form:
   - Booking information
   - Customer details
   - Reason field (required)
5. Admin enters cancellation reason
6. Admin clicks "Confirm Cancellation"
7. System starts database transaction
8. System updates booking status to CANCELLED
9. System updates related seats to AVAILABLE
10. System creates audit log entry (admin_id, reason, timestamp)
11. System commits transaction
12. System displays success message: "Booking {booking_code} cancelled successfully"
13. System updates booking list

#### Alternative Flows

**A1: Admin Cancels Operation**
- At step 6, admin clicks "Cancel" or closes dialog:
  - No changes made
  - Return to booking list

**A2: Refund Required**
- At step 5, if booking was paid (status = CONFIRMED):
  - Admin checks "Issue Refund" checkbox
  - System creates refund record
  - System updates payment status
  - Continue to step 6

#### Exception Flows

**E1: Booking Already Cancelled**
- At step 8, if booking status already CANCELLED:
  - System displays error: "Booking is already cancelled"
  - Return to booking list

**E2: Screening Already Started/Completed**
- At step 8, if screening date/time has passed:
  - System displays warning: "This screening has already occurred. Cancel anyway?"
  - Admin must confirm
  - If confirmed: Continue to step 8
  - If not: Return to step 3

**E3: Concurrent Cancellation**
- At step 8, if customer cancelled same booking simultaneously:
  - System detects conflict
  - System displays info: "Booking was already cancelled by customer"
  - Admin cancellation completes normally (idempotent)

#### Business Rules

- **BR-RM-027**: Only ADMIN can cancel any booking
- **BR-RM-028**: Cancellation reason required for audit trail
- **BR-RM-029**: Seats must be released when booking cancelled
- **BR-RM-030**: Cannot cancel already-cancelled booking (idempotent check)
- **BR-RM-031**: Cancelled bookings remain in database (soft cancel)
- **BR-RM-032**: Refund optional based on payment policy

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization required
- **NFR5**: Audit log with reason and admin identity
- **NFR3**: Transaction ensures seat release consistency

---

### UC-RM-006: View Own Bookings (Customer)

**Use Case ID**: UC-RM-006  
**Use Case Name**: View Own Bookings  
**Actor(s)**: Customer (Primary)  
**Priority**: High  
**Related Requirements**: FR4

#### Description
Allows customer to view their own booking history with details and status.

#### Preconditions
- Customer is logged in
- Customer has at least one booking (or empty list shown)

#### Postconditions
- Success: List of customer's bookings displayed
- Customer can view booking details
- Customer can cancel pending bookings

#### Main Flow
1. Customer clicks "My Bookings" in user menu
2. System retrieves bookings for current customer (user_id = current_user)
3. System displays booking list:
   - Booking Code
   - Movie Title and Poster
   - Screening Date/Time
   - Auditorium
   - Seats (e.g., "A5, A6")
   - Total Price
   - Status (PENDING, CONFIRMED, CANCELLED)
   - Created Date
   - Actions: View Details, Cancel (if PENDING)
4. System sorts bookings by created date (newest first)
5. Customer can click on booking to view details
6. Customer can click "Cancel" for PENDING bookings (UC-RM-007)

#### Alternative Flows

**A1: Filter by Status**
- At step 3, customer selects status filter:
  - System filters bookings (Show All, Pending, Confirmed, Cancelled)
  - System updates list

**A2: No Bookings**
- At step 2, if customer has no bookings:
  - System displays empty state: "You have no bookings yet"
  - System displays "Browse Movies" button
  - Link to movie catalog

#### Exception Flows

**E1: Session Expired**
- At step 2, if customer session invalid:
  - System redirects to login
  - After login: Return to bookings page

**E2: IDOR Attempt**
- If customer manipulates URL to view another customer's bookings:
  - System returns 403 Forbidden
  - System only shows bookings where user_id = current_user
  - System logs suspicious activity

#### Business Rules

- **BR-RM-033**: Customer can only view own bookings (data isolation)
- **BR-RM-034**: IDOR prevention: authorization check on user_id
- **BR-RM-035**: Only PENDING bookings can be cancelled by customer
- **BR-RM-036**: All statuses visible in history (including CANCELLED)

#### Non-Functional Requirements
- **NFR2**: Authorization enforces data isolation (customer sees only own bookings)
- **NFR2**: IDOR protection implemented
- **NFR1**: Booking list loads within 2 seconds

---

### UC-RM-007: Cancel Own Booking (Customer)

**Use Case ID**: UC-RM-007  
**Use Case Name**: Cancel Own Booking  
**Actor(s)**: Customer (Primary)  
**Priority**: High  
**Related Requirements**: FR4

#### Description
Allows customer to cancel their own PENDING booking and release seats.

#### Preconditions
- Customer is logged in
- Customer has PENDING booking
- Booking belongs to current customer
- Screening has not started

#### Postconditions
- Success: Booking status changed to CANCELLED
- Success: Seats released (AVAILABLE)
- Success: Booking visible in history as cancelled
- Customer can create new booking

#### Main Flow
1. Customer viewing own bookings (UC-RM-006)
2. Customer identifies PENDING booking to cancel
3. Customer clicks "Cancel" button
4. System displays confirmation dialog:
   - Booking details
   - "Are you sure you want to cancel this booking?"
5. Customer clicks "Yes, Cancel Booking"
6. System starts database transaction
7. System verifies booking belongs to customer (authorization check)
8. System verifies booking status = PENDING
9. System updates booking status to CANCELLED
10. System updates related seats to AVAILABLE
11. System commits transaction
12. System displays success message: "Booking {booking_code} cancelled successfully"
13. System updates booking list

#### Alternative Flows

**A1: Customer Changes Mind**
- At step 5, customer clicks "No, Keep Booking":
  - System closes dialog
  - No changes made
  - Return to booking list

#### Exception Flows

**E1: Booking Already Confirmed**
- At step 8, if booking status = CONFIRMED (payment completed):
  - System displays error: "Cannot cancel confirmed booking. Please contact support for refund"
  - System provides support contact information
  - Stop

**E2: Booking Not Owned by Customer**
- At step 7, if booking user_id != current_user:
  - System returns 403 Forbidden
  - System displays error: "Access denied"
  - System logs IDOR attempt
  - Stop

**E3: Screening Already Started**
- At step 8, if screening date/time has passed:
  - System displays error: "Cannot cancel booking for screening that has already started"
  - Stop

**E4: Concurrent Cancellation**
- At step 9, if booking already cancelled:
  - System detects status = CANCELLED
  - System displays info: "This booking is already cancelled"
  - Idempotent operation completes successfully

#### Business Rules

- **BR-RM-037**: Only booking owner can cancel own booking
- **BR-RM-038**: Only PENDING bookings can be cancelled by customer
- **BR-RM-039**: CONFIRMED bookings require admin/support intervention
- **BR-RM-040**: Seats must be released when booking cancelled
- **BR-RM-041**: Cannot cancel bookings for past screenings
- **BR-RM-042**: Cancellation is idempotent (can attempt multiple times safely)

#### Non-Functional Requirements
- **NFR2**: Authorization check prevents IDOR
- **NFR3**: Transaction ensures seat release
- **NFR1**: Cancellation API response < 2 seconds

---

## 5.4 Payment Process Module

### UC-PP-001: Checkout & Pay

**Use Case ID**: UC-PP-001  
**Use Case Name**: Checkout & Pay  
**Actor(s)**: Customer (Primary), Admin (Supporting)  
**Priority**: Critical  
**Related Requirements**: FR5

#### Description
Allows customer to pay for a pending booking using simulated payment methods (CASH or BANK_TRANSFER). Admin confirms payment manually.

#### Preconditions
- Customer is logged in
- Customer has PENDING booking
- Booking has not expired

#### Postconditions
- Success: Payment record created with status = PENDING
- Success: Customer receives payment instructions
- Success: Admin can confirm payment later
- After admin confirmation: Booking status = CONFIRMED, Payment status = COMPLETED

#### Main Flow
1. Customer is redirected to payment page after booking creation (UC-RM-003)
2. System displays booking summary:
   - Booking code
   - Movie and screening details
   - Seats and total price
3. System displays payment method selection:
   - CASH (Pay at cinema counter)
   - BANK_TRANSFER (Bank transfer to cinema account)
4. Customer selects payment method
5. System displays payment instructions based on method:
   - **CASH**: "Please pay at cinema counter before screening. Show booking code: {code}"
   - **BANK_TRANSFER**: "Transfer {amount} VND to account: {bank_details}. Use booking code {code} as reference"
6. Customer clicks "I Have Made Payment" or "Confirm"
7. System creates Payment record:
   - payment_id
   - booking_id
   - payment_method (CASH or BANK_TRANSFER)
   - amount
   - status = PENDING
   - created_at
8. System keeps booking status = PENDING
9. System displays success message: "Payment received. Waiting for admin confirmation"
10. System sends notification to admin queue (if notification service available)
11. Customer can view booking in "My Bookings" with status "Awaiting Payment Confirmation"

**[Admin Confirmation - Out of Band]**
12. Admin reviews payment (UC-PP-002)
13. Admin confirms payment in admin dashboard
14. System updates payment status to COMPLETED
15. System updates booking status to CONFIRMED
16. System sends confirmation to customer (if notification service available)

#### Alternative Flows

**A1: Customer Selects Different Payment Method**
- At step 4, customer changes payment method:
  - System updates displayed instructions
  - Continue to step 6

**A2: Customer Abandons Payment**
- At any step, customer closes browser or navigates away:
  - Booking remains PENDING
  - No payment record created (if before step 7)
  - Booking can be cancelled or paid later

**A3: Customer Returns to Pay Later**
- From "My Bookings", customer clicks "Pay Now" for PENDING booking:
  - System resumes from step 2
  - Booking code and details pre-loaded

#### Exception Flows

**E1: Booking Not Found**
- At step 2, if booking_id invalid:
  - System displays error: "Booking not found"
  - Redirect to "My Bookings"

**E2: Booking Already Paid**
- At step 7, if payment record already exists:
  - System displays message: "Payment already submitted. Awaiting confirmation"
  - Skip to step 11

**E3: Booking Expired (Timeout)**
- At step 2, if booking created > 30 minutes ago and still PENDING:
  - System displays warning: "Booking will be auto-cancelled soon if not paid"
  - Customer can still proceed
  - Or admin may have auto-cancelled it

**E4: Session Expired**
- At step 7, if customer session expired:
  - System prompts re-login
  - After login: Resume payment flow

#### Business Rules

- **BR-PP-001**: Only CASH and BANK_TRANSFER payment methods supported (sandbox)
- **BR-PP-002**: No real payment gateway integration (VNPay/MoMo not available)
- **BR-PP-003**: Payment requires manual admin confirmation
- **BR-PP-004**: Payment status = PENDING until admin confirms
- **BR-PP-005**: Booking status updated to CONFIRMED only after admin confirmation
- **BR-PP-006**: Customer can submit payment intent multiple times (idempotent)
- **BR-PP-007**: Payment amount must match booking total_price

#### Non-Functional Requirements
- **NFR1**: Payment page loads within 2 seconds
- **NFR3**: Payment creation is idempotent
- **NFR5**: Payment instructions clear and accurate

---

### UC-PP-002: Review Payment Records (Admin)

**Use Case ID**: UC-PP-002  
**Use Case Name**: Review Payment Records  
**Actor(s)**: Admin (Primary)  
**Priority**: High  
**Related Requirements**: FR5, FR8

#### Description
Allows admin to view all payment records, verify payment proof, and confirm or reject payments.

#### Preconditions
- Admin is logged in with ADMIN role
- Admin has navigated to admin dashboard

#### Postconditions
- Success: Payment list displayed with current status
- Admin can confirm or reject payments
- Payment status updated accordingly

#### Main Flow
1. Admin navigates to "Payments" section in admin dashboard
2. System retrieves all payment records
3. System displays payment list:
   - Payment ID
   - Booking Code
   - Customer Name
   - Payment Method
   - Amount
   - Status (PENDING, COMPLETED, FAILED)
   - Created Date
   - Actions (Confirm, Reject, View Details)
4. System highlights PENDING payments (require action)
5. Admin clicks "View Details" for pending payment
6. System displays payment details:
   - Full booking information
   - Customer contact details
   - Payment method and instructions given
   - Upload field for payment proof (if BANK_TRANSFER)
7. Admin reviews payment
8. Admin clicks "Confirm Payment" button
9. System prompts for confirmation: "Confirm payment received?"
10. Admin confirms
11. System starts database transaction
12. System updates payment status to COMPLETED
13. System updates booking status to CONFIRMED
14. System commits transaction
15. System creates audit log entry
16. System displays success message: "Payment confirmed for booking {booking_code}"
17. System sends confirmation to customer (if notification available)

#### Alternative Flows

**A1: Reject Payment**
- At step 8, admin clicks "Reject Payment":
  - System displays rejection form with reason field
  - Admin enters rejection reason
  - System updates payment status to FAILED
  - System keeps booking status = PENDING
  - System notifies customer (if available)
  - Booking can be cancelled or re-paid

**A2: Filter Pending Payments**
- At step 4, admin filters by status = PENDING:
  - System shows only payments requiring action
  - Admin can process efficiently

**A3: Bulk Confirm**
- Admin selects multiple pending payments:
  - Admin clicks "Bulk Confirm"
  - System confirms all selected payments
  - System updates all related bookings

#### Exception Flows

**E1: Payment Already Confirmed**
- At step 12, if payment already COMPLETED:
  - System displays info: "Payment already confirmed"
  - No duplicate confirmation
  - Idempotent operation

**E2: Booking Cancelled**
- At step 13, if booking was cancelled:
  - System displays error: "Cannot confirm payment for cancelled booking"
  - Payment marked as FAILED
  - Stop

#### Business Rules

- **BR-PP-008**: Only ADMIN can confirm/reject payments
- **BR-PP-009**: Payment confirmation updates both payment and booking status
- **BR-PP-010**: Confirmed payments cannot be undone (except via refund)
- **BR-PP-011**: Rejection reason required for audit trail
- **BR-PP-012**: Payment confirmation is idempotent

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization enforced
- **NFR5**: Audit trail for all payment actions
- **NFR1**: Payment confirmation API response < 2 seconds

---

### UC-PP-003: Handle Refunds (Admin)

**Use Case ID**: UC-PP-003  
**Use Case Name**: Handle Refunds  
**Actor(s)**: Admin (Primary)  
**Priority**: Medium  
**Related Requirements**: FR5, FR8

#### Description
Allows admin to process refund requests for confirmed bookings/payments.

#### Preconditions
- Admin is logged in with ADMIN role
- Booking exists with status = CONFIRMED
- Payment exists with status = COMPLETED
- Valid reason for refund

#### Postconditions
- Success: Refund record created
- Success: Payment status updated to REFUNDED
- Success: Booking status updated to CANCELLED
- Success: Seats released
- Customer notified of refund

#### Main Flow
1. Admin navigates to payment or booking details
2. Admin identifies booking requiring refund (customer request, cancellation policy, error correction)
3. Admin clicks "Process Refund" button
4. System displays refund form:
   - Booking and payment details
   - Original amount
   - Refund amount field (default = full amount)
   - Refund reason field (required)
5. Admin enters refund reason
6. Admin optionally adjusts refund amount (partial refund)
7. Admin clicks "Confirm Refund"
8. System validates refund amount <= original amount
9. System starts database transaction
10. System creates Refund record
11. System updates payment status to REFUNDED
12. System updates booking status to CANCELLED
13. System updates seats to AVAILABLE
14. System commits transaction
15. System creates audit log entry
16. System displays success message: "Refund processed for booking {booking_code}"
17. System notifies customer (if notification available)

#### Alternative Flows

**A1: Partial Refund**
- At step 6, admin enters amount < original amount:
  - System calculates refund percentage
  - System displays warning if < 50%: "Partial refund: {percentage}%"
  - Admin confirms
  - Continue to step 8

**A2: Admin Cancels Refund**
- At step 7, admin clicks "Cancel":
  - No changes made
  - Return to payment/booking details

#### Exception Flows

**E1: Payment Not Confirmed**
- At step 9, if payment status != COMPLETED:
  - System displays error: "Cannot refund payment that is not completed"
  - Stop

**E2: Already Refunded**
- At step 11, if payment status already REFUNDED:
  - System displays info: "Payment already refunded"
  - Idempotent operation
  - No duplicate refund

**E3: Screening Already Occurred**
- At step 9, if screening date has passed:
  - System displays warning: "Screening has already occurred. Process refund anyway?"
  - Admin must confirm exceptional refund
  - If confirmed: Continue
  - If not: Stop

**E4: Invalid Refund Amount**
- At step 8, if refund_amount > original_amount:
  - System displays error: "Refund amount cannot exceed original payment"
  - Return to step 5

#### Business Rules

- **BR-PP-013**: Only ADMIN can process refunds
- **BR-PP-014**: Refund amount cannot exceed original payment amount
- **BR-PP-015**: Refund reason required for audit trail
- **BR-PP-016**: Full refund or partial refund allowed
- **BR-PP-017**: Refund releases seats (status = AVAILABLE)
- **BR-PP-018**: Refunded bookings status = CANCELLED
- **BR-PP-019**: Refund operation is idempotent

#### Non-Functional Requirements
- **NFR2**: ADMIN authorization required
- **NFR5**: Complete audit trail (who, amount, reason, timestamp)
- **NFR3**: Transaction ensures consistency

---

## 6. Business Rules

### 6.1 Authentication & Authorization (Access Control)

- **BR-AC-001**: Email must be unique in the system
- **BR-AC-002**: Password must be at least 8 characters with uppercase, lowercase, digit, and special character
- **BR-AC-003**: Phone number must be valid Vietnamese format (10 digits starting with 0)
- **BR-AC-004**: Date of birth must be at least 13 years ago
- **BR-AC-005**: All required fields must be filled
- **BR-AC-006**: Password must be hashed using BCrypt before storage
- **BR-AC-007**: New users automatically assigned CUSTOMER role
- **BR-AC-008**: Maximum 5 login attempts per IP within 15 minutes
- **BR-AC-009**: JWT access token expires in 15 minutes
- **BR-AC-010**: JWT refresh token expires in 7 days (30 days if "Remember Me")
- **BR-AC-011**: Password comparison uses BCrypt verify
- **BR-AC-012**: Failed login attempts logged for security
- **BR-AC-013**: Tokens signed with HMAC-SHA256
- **BR-AC-014**: Only users with ADMIN role can access admin portal
- **BR-AC-015**: Admin login rate-limited (3 attempts / 10 minutes)
- **BR-AC-016**: Admin failed login triggers security alerts
- **BR-AC-017**: Admin tokens have same expiry as customer tokens
- **BR-AC-018**: Logout must clear all authentication tokens
- **BR-AC-019**: User cannot access protected resources after logout
- **BR-AC-020**: Session cleanup must be thorough

### 6.2 Movie Management

- **BR-MM-001**: Default 12 movies per page
- **BR-MM-002**: Pagination required if more than 12 movies
- **BR-MM-003**: Search is case-insensitive and matches partial titles
- **BR-MM-004**: All user input must be sanitized and escaped
- **BR-MM-005**: SQL injection prevented using parameterized queries
- **BR-MM-006**: XSS prevented using output encoding
- **BR-MM-007**: Empty search shows all movies
- **BR-MM-008**: Only future screenings displayed
- **BR-MM-009**: Available seats count must be real-time accurate
- **BR-MM-010**: Movie details must show all mandatory fields
- **BR-MM-011**: Trailer is optional
- **BR-MM-012**: Only ADMIN can add movies
- **BR-MM-013**: Title, description, duration, genre, rating, release date, poster required
- **BR-MM-014**: Duration must be positive integer (60-240 minutes)
- **BR-MM-015**: Genre from predefined list
- **BR-MM-016**: Poster file < 5MB, image format
- **BR-MM-017**: Release date can be past or future
- **BR-MM-018**: Only ADMIN can update movies
- **BR-MM-019**: All validation rules from add apply to update
- **BR-MM-020**: Audit trail required for updates
- **BR-MM-021**: Movie ID immutable
- **BR-MM-022**: Only ADMIN can delete movies
- **BR-MM-023**: Cannot delete with active bookings
- **BR-MM-024**: Soft delete preferred
- **BR-MM-025**: Audit trail required for deletions
- **BR-MM-026**: Deleted movies hidden but data retained

### 6.3 Reservation Management

- **BR-RM-001**: Only future screenings displayed
- **BR-RM-002**: Available seats count real-time accurate
- **BR-RM-003**: Screenings sorted by date then time
- **BR-RM-004**: Sold out screenings displayed but cannot be booked
- **BR-RM-005**: Seat availability updated on page load
- **BR-RM-006**: Customer must be logged in
- **BR-RM-007**: Maximum 10 seats per booking
- **BR-RM-008**: Minimum 1 seat required
- **BR-RM-009**: Cannot select booked seats
- **BR-RM-010**: Cannot select disabled seats
- **BR-RM-011**: No TTL hold - seats booked immediately on commit
- **BR-RM-012**: Price = sum of seat prices by type
- **BR-RM-013**: Selected seats stored client-side only
- **BR-RM-014**: Customer must be authenticated
- **BR-RM-015**: Booking created with status = PENDING
- **BR-RM-016**: Seats marked BOOKED immediately
- **BR-RM-017**: Transaction locking prevents overbooking
- **BR-RM-018**: Re-check availability before commit
- **BR-RM-019**: Booking code unique (8-10 alphanumeric)
- **BR-RM-020**: Total price = sum of seat prices
- **BR-RM-021**: Maximum 5 pending bookings per customer
- **BR-RM-022**: Cannot book past screenings
- **BR-RM-023**: Only ADMIN views all bookings
- **BR-RM-024**: All customer bookings visible to admin
- **BR-RM-025**: Pagination required (20 per page)
- **BR-RM-026**: All statuses visible
- **BR-RM-027**: Only ADMIN cancels any booking
- **BR-RM-028**: Cancellation reason required
- **BR-RM-029**: Seats released when cancelled
- **BR-RM-030**: Idempotent cancellation
- **BR-RM-031**: Soft cancel (data retained)
- **BR-RM-032**: Refund optional
- **BR-RM-033**: Customer views only own bookings
- **BR-RM-034**: IDOR prevention
- **BR-RM-035**: Only PENDING bookings cancelled by customer
- **BR-RM-036**: All statuses in history
- **BR-RM-037**: Only owner cancels own booking
- **BR-RM-038**: Only PENDING cancelled by customer
- **BR-RM-039**: CONFIRMED requires admin intervention
- **BR-RM-040**: Seats released when cancelled
- **BR-RM-041**: Cannot cancel past screenings
- **BR-RM-042**: Cancellation idempotent

### 6.4 Payment Process

- **BR-PP-001**: Only CASH and BANK_TRANSFER supported
- **BR-PP-002**: No real gateway integration
- **BR-PP-003**: Manual admin confirmation required
- **BR-PP-004**: Payment status = PENDING until confirmed
- **BR-PP-005**: Booking CONFIRMED only after payment confirmed
- **BR-PP-006**: Payment submission idempotent
- **BR-PP-007**: Payment amount = booking total_price
- **BR-PP-008**: Only ADMIN confirms/rejects payments
- **BR-PP-009**: Confirmation updates payment and booking
- **BR-PP-010**: Confirmed payments permanent (except refund)
- **BR-PP-011**: Rejection reason required
- **BR-PP-012**: Payment confirmation idempotent
- **BR-PP-013**: Only ADMIN processes refunds
- **BR-PP-014**: Refund amount <= original amount
- **BR-PP-015**: Refund reason required
- **BR-PP-016**: Full or partial refund allowed
- **BR-PP-017**: Refund releases seats
- **BR-PP-018**: Refunded bookings cancelled
- **BR-PP-019**: Refund operation idempotent

---

## 7. References

### 7.1 Related Documents

| Document | Description | Location |
|----------|-------------|----------|
| Baocao.md | Source document with business context, user stories, and use case diagrams | `docs/Baocao.md` |
| Test_Plan.md | Test plan referencing these use cases | `docs/Test_Plan.md` |
| Architecture_Design.md | System architecture and API endpoints | `docs/Architecture_Design.md` |
| Database_Design.md | Database schema and entity relationships | `docs/Database_Design.md` |
| Screen_Design.md | UI/UX specifications | `docs/Screen_Design.md` |

### 7.2 Functional Requirements Mapping

| Requirement | Use Cases |
|-------------|-----------|
| FR1: Access Control & Authentication | UC-AC-001, UC-AC-002, UC-AC-003, UC-AC-004 |
| FR2: Movie & Content Browsing | UC-MM-001, UC-MM-002, UC-MM-003, UC-MM-004, UC-MM-005 |
| FR3: Showtime & Seat Map | UC-RM-001, UC-RM-002 |
| FR4: Booking Management | UC-RM-003, UC-RM-004, UC-RM-005, UC-RM-006, UC-RM-007 |
| FR5: Payment Processing | UC-PP-001, UC-PP-002, UC-PP-003 |
| FR8: Admin Dashboard | UC-MM-003, UC-MM-004, UC-MM-005, UC-RM-004, UC-RM-005, UC-PP-002, UC-PP-003 |

### 7.3 Test Case Traceability

Each use case maps to multiple test cases in the test documentation:
- Unit Test Cases (UTC): Test individual service methods
- Integration Test Cases (ITC): Test API endpoints for each use case
- System Test Cases (STC): Test end-to-end flows
- Security Test Cases: Test authorization, IDOR prevention, input validation

See `docs/test-cases/` for detailed test case mappings.

---

**Document prepared by**: ChickenGang KTPM Team  
**Date**: 08/12/2025  
**Status**: Approved for Implementation and Testing
