const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const CONFIG = {
    // API_URL: 'http://localhost:8080/api/v1/auth/login', // Adjust port if needed
    API_URL: process.env.API_URL || 'http://localhost:8080/api/v1/auth/login',
    CSV_FILE: path.join(__dirname, '../../test_data/users_stress_test.csv'),
    CONCURRENT_REQUESTS: 200, // Number of concurrent users to simulate
    TEST_DURATION_SEC: 60, // Not strictly used in this one-shot batch, but good for context
};

// Statistics
const stats = {
    total: 0,
    success: 0,
    failed: 0,
    times: [],
    startTime: 0,
    endTime: 0
};

// --- Helper: Read CSV ---
function readUsers() {
    const content = fs.readFileSync(CONFIG.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    // Parse CSV simple (assuming no commas in values based on our generator)
    const users = lines.slice(1).map(line => {
        const values = line.split(',');
        const user = {};
        headers.forEach((h, i) => user[h.trim()] = values[i].trim());
        return user;
    });

    console.log(`Loaded ${users.length} users from CSV.`);
    return users;
}

// --- Helper: Send Login Request ---
function login(user) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: user.username, // or email depending on your API
            password: user.password
        });

        const url = new URL(CONFIG.API_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const start = performance.now();
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = performance.now() - start;
                stats.times.push(duration);

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    stats.success++;
                } else {
                    stats.failed++;
                    // console.error(`Failed ${user.username}: ${res.statusCode} ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            stats.failed++;
            console.error(`Request error for ${user.username}: ${e.message}`);
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

// --- Run Stress Test ---
async function runTest() {
    console.log(`Starting stress test on ${CONFIG.API_URL}`);
    console.log(`Concurrency: ${CONFIG.CONCURRENT_REQUESTS}`);

    const users = readUsers();
    // Limit users to concurrency count for this specific test case "100 concurrent users"
    // Or we can loop them. Requirements say "100 concurrent users logging in".
    // We will pick the first 100 users.
    const targetUsers = users.slice(0, CONFIG.CONCURRENT_REQUESTS);

    if (targetUsers.length < CONFIG.CONCURRENT_REQUESTS) {
        console.warn(`Warning: Only ${targetUsers.length} users available in CSV. Running with that many.`);
    }

    stats.startTime = performance.now();

    // Launch all requests in parallel
    const promises = targetUsers.map(user => login(user));
    await Promise.all(promises);

    stats.endTime = performance.now();
    printReport();
}

function printReport() {
    const totalTime = (stats.endTime - stats.startTime).toFixed(2);
    const avgTime = (stats.times.reduce((a, b) => a + b, 0) / stats.times.length).toFixed(2) || 0;
    const maxTime = Math.max(...stats.times, 0).toFixed(2);
    const minTime = Math.min(...stats.times, 0).toFixed(2);

    console.log('\n--- Load Test Report ---');
    console.log(`Total Requests: ${targetUsers.length} (Active: ${stats.success + stats.failed})`); // targetUsers scope issue fixed below
    console.log(`Successful:     ${stats.success}`);
    console.log(`Failed:         ${stats.failed}`);
    console.log(`Total Time:     ${totalTime} ms`);
    console.log(`Avg Latency:    ${avgTime} ms`);
    console.log(`Min Latency:    ${minTime} ms`);
    console.log(`Max Latency:    ${maxTime} ms`);

    if (stats.failed > 0) {
        console.log('Note: Failed requests might be due to server overload or invalid credentials.');
    }
}

// Fix scope issue for report
let targetUsers = [];
const users = readUsers();
targetUsers = users.slice(0, CONFIG.CONCURRENT_REQUESTS);

runTest();
