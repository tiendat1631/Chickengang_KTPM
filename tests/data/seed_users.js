const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const CONFIG = {
    REGISTER_URL: process.env.REGISTER_URL || 'http://localhost:8080/api/v1/auth/register',
    CSV_FILE: path.join(__dirname, '../../test_data/users_stress_test.csv'),
    BATCH_SIZE: 5, // Concurrent requests during seeding (keep low to avoid overloading dev server)
};

// --- Helper: Read CSV ---
function readUsers() {
    const content = fs.readFileSync(CONFIG.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    // Parse CSV (handling quoted fields simply)
    const users = lines.slice(1).map(line => {
        // Simple regex to split by comma ignoring quotes
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, ''));
        const user = {};
        headers.forEach((h, i) => user[h.trim()] = values[i] ? values[i].trim() : '');
        return user;
    });
    return users;
}

// --- Helper: Register User ---
function register(user) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password,
            phoneNumber: user.phone,
            address: user.address
        });

        const url = new URL(CONFIG.REGISTER_URL);
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

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                // Treat 400 (already exists) as success-ish
                if (isSuccess || res.statusCode === 409 || (data.includes('exist'))) {
                    resolve({ success: true, user: user.username, status: res.statusCode });
                } else {
                    resolve({ success: false, user: user.username, status: res.statusCode, error: data });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ success: false, user: user.username, error: e.message });
        });

        req.write(postData);
        req.end();
    });
}

// --- Run Seed ---
async function runSeed() {
    console.log(`Seeding users from CSV to ${CONFIG.REGISTER_URL}`);
    const users = readUsers();
    console.log(`Found ${users.length} users to seed.`);

    let successCount = 0;
    let failCount = 0;

    // Process in batches
    for (let i = 0; i < users.length; i += CONFIG.BATCH_SIZE) {
        const batch = users.slice(i, i + CONFIG.BATCH_SIZE);
        const promises = batch.map(u => register(u));
        const results = await Promise.all(promises);

        results.forEach(r => {
            if (r.success) {
                // console.log(`[OK] ${r.user} (${r.status})`);
                successCount++;
            } else {
                console.error(`[FAIL] ${r.user}: ${r.status} - ${r.error}`);
                failCount++;
            }
        });

        process.stdout.write(`\rProgress: ${Math.min(i + CONFIG.BATCH_SIZE, users.length)}/${users.length}`);
    }

    console.log(`\n\n--- Seeding Complete ---`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed:  ${failCount}`);
}

runSeed();
