import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 20 }, // Ramp up to 20 users
        { duration: '30s', target: 50 }, // Ramp up to 50 users
        { duration: '1m', target: 50 },  // Stay at 50 users for 1 min
        { duration: '10s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
        http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    },
};

export default function () {
    // Random search queries to simulate real usage
    const queries = ['Action', 'Love', '2024', 'Marvel', 'Vietnam'];
    const query = queries[Math.floor(Math.random() * queries.length)];

    const res = http.get(`http://localhost:8080/api/v1/movies?title=${query}`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'protocol is HTTP/2': (r) => r.proto === 'HTTP/2.0', // Optional check
    });

    sleep(1);
}
