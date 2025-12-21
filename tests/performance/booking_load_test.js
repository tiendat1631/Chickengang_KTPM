import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 },  // Ramp up to 10 users
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '30s', target: 50 },  // Stay at 50 users
        { duration: '10s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
        http_req_failed: ['rate<0.01'],    // Error rate should be less than 1%
    },
};

const BASE_URL = 'http://localhost:8080/api';

export default function () {
    // Test 1: Get all bookings (admin endpoint)
    group('Admin Bookings API', () => {
        const res = http.get(`${BASE_URL}/v1/bookings?page=0&size=10`, {
            headers: {
                'Authorization': `Bearer ${__ENV.ADMIN_TOKEN || 'test-token'}`,
                'Content-Type': 'application/json'
            }
        });

        check(res, {
            'bookings list status is 200': (r) => r.status === 200,
            'bookings response time < 2s': (r) => r.timings.duration < 2000,
        });
    });

    // Test 2: Get single booking by ID
    group('Get Booking Details', () => {
        const bookingId = 1; // Use a valid booking ID
        const res = http.get(`${BASE_URL}/v1/bookings/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${__ENV.USER_TOKEN || 'test-token'}`,
                'Content-Type': 'application/json'
            }
        });

        check(res, {
            'booking detail status is 200 or 404': (r) => r.status === 200 || r.status === 404,
            'booking detail response time < 1s': (r) => r.timings.duration < 1000,
        });
    });

    sleep(1);
}
