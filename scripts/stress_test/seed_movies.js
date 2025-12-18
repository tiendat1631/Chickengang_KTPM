const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const CONFIG = {
    LOGIN_URL: process.env.LOGIN_URL || 'http://localhost:8080/api/v1/auth/login',
    MOVIES_URL: process.env.MOVIES_URL || 'http://localhost:8080/api/v1/movies',
    CSV_FILE: path.join(__dirname, '../../test_data/movies_large_dataset.csv'),
    ADMIN_CREDS: {
        username: 'admin',
        password: 'password'
    },
    BATCH_SIZE: 10,
};

// --- Helper: Register Admin ---
function registerAdmin() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            username: CONFIG.ADMIN_CREDS.username.split('@')[0], // Extract username from email
            email: CONFIG.ADMIN_CREDS.username,
            password: CONFIG.ADMIN_CREDS.password,
            phoneNumber: '0900000000',
            address: 'Admin HQ'
        });

        const url = new URL(CONFIG.LOGIN_URL.replace('login', 'register')); // Hacky url replace
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
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else if (res.statusCode === 409 || data.includes('exist')) {
                    resolve(); // Already exists
                } else {
                    reject(`Admin registration failed: ${res.statusCode} ${data}`);
                }
            });
        });

        req.on('error', (e) => reject(e.message));
        req.write(postData);
        req.end();
    });
}

// --- Helper: Login as Admin ---
async function getAdminToken() {
    const attemptLogin = (usernamePayload) => new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            username: usernamePayload,
            password: CONFIG.ADMIN_CREDS.password
        });

        console.log(`[DEBUG] Attempting login with username: '${usernamePayload}'...`);

        const url = new URL(CONFIG.LOGIN_URL);
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
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        const token = json.data ? json.data.accessToken : json.accessToken;
                        if (token) resolve(token);
                        else reject('No access token in response');
                    } catch (e) {
                        reject('Failed to parse response');
                    }
                } else {
                    reject(`Status: ${res.statusCode}, Body: ${data}`);
                }
            });
        });
        req.on('error', (e) => reject(e.message));
        req.write(postData);
        req.end();
    });

    // Try with exact config username (email) first
    try {
        return await attemptLogin(CONFIG.ADMIN_CREDS.username);
    } catch (e) {
        console.warn(`[WARN] Login with '${CONFIG.ADMIN_CREDS.username}' failed: ${e}`);

        // Try with simple username part
        if (CONFIG.ADMIN_CREDS.username.includes('@')) {
            const simple = CONFIG.ADMIN_CREDS.username.split('@')[0];
            try {
                return await attemptLogin(simple);
            } catch (e2) {
                throw new Error(`All login attempts failed. Last error: ${e2}`);
            }
        }
        throw e;
    }
}

// --- Helper: Read CSV ---
function readMovies() {
    const content = fs.readFileSync(CONFIG.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    // Parse CSV handling quotes roughly (works for our generated data)
    const movies = lines.slice(1).map(line => {
        // Regex to split by comma but ignore commas inside quotes
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, ''));

        // Map to API payload structure
        // Header: id,title,genre,duration,release_date,rating
        // API might expect: title, director, cast, genre, releaseDate, runningTime, language, rating, poster, trailer, description
        return {
            title: values[1],
            genre: values[2],
            runningTime: parseInt(values[3]),
            releaseDate: values[4],
            rating: parseFloat(values[5]),
            // Fake missing required fields
            director: 'Test Director',
            cast: 'Test Cast',
            language: 'English',
            poster: 'https://via.placeholder.com/300x450',
            trailer: 'https://youtube.com',
            description: `Generated test movie ${values[1]}`
        };
    });
    return movies;
}

// --- Helper: Create Movie ---
function createMovie(movie, token) {
    return new Promise((resolve) => {
        const postData = JSON.stringify(movie);
        const url = new URL(CONFIG.MOVIES_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                resolve({ success: isSuccess, title: movie.title, status: res.statusCode });
            });
        });

        req.on('error', (e) => {
            resolve({ success: false, title: movie.title, error: e.message });
        });

        req.write(postData);
        req.end();
    });
}

// --- Run Seed ---
async function runSeed() {
    try {
        console.log('Logging in as Admin...');
        const token = await getAdminToken();
        console.log('Login successful.');

        const movies = readMovies();
        console.log(`Found ${movies.length} movies to seed.`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < movies.length; i += CONFIG.BATCH_SIZE) {
            const batch = movies.slice(i, i + CONFIG.BATCH_SIZE);
            const promises = batch.map(m => createMovie(m, token));
            const results = await Promise.all(promises);

            results.forEach(r => {
                if (r.success) successCount++;
                else {
                    console.error(`Failed: ${r.title} (${r.status}) - ${r.error || ''}`);
                    failCount++;
                }
            });

            process.stdout.write(`\rProgress: ${Math.min(i + CONFIG.BATCH_SIZE, movies.length)}/${movies.length}`);
        }

        console.log(`\n\n--- Movie Seeding Complete ---`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed:  ${failCount}`);

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

runSeed();
