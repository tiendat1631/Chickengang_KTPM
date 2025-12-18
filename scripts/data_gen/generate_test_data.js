const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    USER_COUNT: 200, // Generates 200 users (enough for 100 concurrent + buffer)
    MOVIE_COUNT: 2000, // Generates 2000 movies for search performance
    OUTPUT_DIR: path.join(__dirname, '../../test_data'),
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// Helper to get random item from array
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 1. Generate Users CSV ---
function generateUsers() {
    console.log(`Generating ${CONFIG.USER_COUNT} users...`);
    const header = 'id,username,email,password,role,phone,address';
    const rows = [];

    for (let i = 1; i <= CONFIG.USER_COUNT; i++) {
        const username = `user_perf_${i}`;
        const email = `user${i}@loadtest.com`;
        const password = 'Password@123'; // Standard password for testing
        const role = 'CUSTOMER';
        const phone = `09${randomInt(10000000, 99999999)}`;
        const address = `123 Test Street, City ${randomInt(1, 100)}`;
        rows.push(`${i},${username},${email},${password},${role},${phone},"${address}"`);
    }

    const content = [header, ...rows].join('\n');
    const filePath = path.join(CONFIG.OUTPUT_DIR, 'users_stress_test.csv');
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
}

// --- 2. Generate Movies CSV ---
function generateMovies() {
    console.log(`Generating ${CONFIG.MOVIE_COUNT} movies...`);
    const header = 'id,title,genre,duration,release_date,rating';
    const rows = [];
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary'];
    const adjectives = ['The', 'A', 'Dark', 'Bright', 'Super', 'Last', 'First', 'Lost', 'Found'];
    const nouns = ['Hero', 'Journey', 'Battle', 'Love', 'Story', 'Man', 'Woman', 'World', 'Star', 'Time'];

    for (let i = 1; i <= CONFIG.MOVIE_COUNT; i++) {
        const title = `${random(adjectives)} ${random(nouns)} ${randomInt(1, 999)}`;
        const genre = random(genres);
        const duration = randomInt(80, 180); // minutes
        const year = randomInt(2010, 2024);
        const month = String(randomInt(1, 12)).padStart(2, '0');
        const day = String(randomInt(1, 28)).padStart(2, '0');
        const release_date = `${year}-${month}-${day}`;
        const rating = (Math.random() * 5 + 5).toFixed(1); // 5.0 to 10.0

        rows.push(`${i},"${title}",${genre},${duration},${release_date},${rating}`);
    }

    const content = [header, ...rows].join('\n');
    const filePath = path.join(CONFIG.OUTPUT_DIR, 'movies_large_dataset.csv');
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
}

// --- Execute ---
try {
    generateUsers();
    generateMovies();
    console.log('Done!');
} catch (error) {
    console.error('Error generating data:', error);
}
