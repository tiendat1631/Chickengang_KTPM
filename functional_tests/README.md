# Functional Testing Environment (Python + Selenium)

This folder contains automated UI tests for the Movie Booking System.
These tests verify the application from a user's perspective, running against the React Frontend (`localhost:5173`) and Java Backend.

## 1. Prerequisites

- **Python 3.x** installed.
- **Chrome Browser** installed.
- The application (Backend + Frontend) must be running.

## 2. Setup

1. Open a terminal in this folder (`functional_tests`).
2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

## 3. Running Tests

Run all tests:

```bash
pytest
```

Run a specific test file:

```bash
pytest tests/test_booking_ui.py
```

## 4. Test Scenarios Covered

- **M3-16:** Cancel Booking Popup Verification.
- **M3-10:** Empty Booking List Verification.
