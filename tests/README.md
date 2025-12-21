# 🧪 Tests Directory

**Project**: ChickenGang Movie Ticket Booking System

---

## 📁 Structure

```
tests/
├── e2e/                    # End-to-End Tests (Selenium/Pytest)
│   ├── tests/
│   │   ├── test_booking_ui.py
│   │   ├── test_e2e_booking_flow.py
│   │   └── test_e2e_cancel_booking.py
│   ├── requirements.txt
│   └── README.md
│
├── performance/            # Performance Tests (k6)
│   ├── booking_load_test.js
│   ├── search_load_test.js
│   ├── seat_map_load_test.js
│   └── browser_test.js
│
├── security/               # Security Tests (OWASP ZAP)
│   └── zap_baseline.yml
│
└── data/                   # Test Data
    ├── datasets/           # Large datasets for load testing
    ├── fixtures/           # Static test fixtures
    └── seeds/              # Database seed scripts
```

---

## 🚀 Quick Start

### E2E Tests (Selenium)

```bash
cd tests/e2e
pip install -r requirements.txt
pytest tests/ -v
```

### Performance Tests (k6)

```bash
cd tests/performance
k6 run booking_load_test.js
k6 run search_load_test.js
```

### Unit Tests (Backend)

```bash
cd backend
./mvnw test
```

---

## 📊 Test Coverage Targets

| Test Type | Coverage Target |
|-----------|-----------------|
| Unit Tests | ≥ 80% |
| Integration Tests | Critical paths |
| E2E Tests | Happy paths + edge cases |
| Performance | SLA compliance |
