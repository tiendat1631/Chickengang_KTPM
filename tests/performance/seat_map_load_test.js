import http from 'k6/http';
import { check, sleep } from 'k6';

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

export default function () {
    // Simulate fetching seat map for a screening
    const screeningId = 1; // Use a valid screening ID from your test data

    const res = http.get(`http://localhost:8080/api/v1/screenings/${screeningId}/seats`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}
