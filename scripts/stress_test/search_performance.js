const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const CONFIG = {
    API_URL: process.env.API_URL || 'http://localhost:8080/api/v1/movies',
    CSV_FILE: path.join(__dirname, '../../test_data/movies_large_dataset.csv'),
    CONCURRENT_REQUESTS: 2000, // Number of concurrent searchers
    SEARCH_TERMS_COUNT: 2000, // Number of unique search terms to pick from dataset helps simulate cache miss?
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

// --- Helper: Read Search Terms ---
function readSearchTerms() {
    try {
        const content = fs.readFileSync(CONFIG.CSV_FILE, 'utf-8');
        const lines = content.trim().split('\n');

        // Skip header, take random sample of titles/genres to search
        const dataLines = lines.slice(1);
        const terms = [];

        for (let i = 0; i < CONFIG.SEARCH_TERMS_COUNT; i++) {
            const line = dataLines[Math.floor(Math.random() * dataLines.length)];
            if (!line) continue;

            // Extract title (2nd column roughly)
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, ''));
            if (values[1]) terms.push(values[1].split(' ')[0]); // Search first word of title
        }
        return terms;
    } catch (e) {
        console.warn('Could not read CSV for search terms, using defaults.');
        return ['Action', 'Love', 'War', 'The', 'A', 'Man'];
    }
}

// --- Helper: Search Request ---
function search(term) {
    return new Promise((resolve) => {
        const url = new URL(CONFIG.API_URL);
        url.searchParams.append('search', term);
        url.searchParams.append('page', '0');
        url.searchParams.append('size', '10');

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: 'GET',
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
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            stats.failed++;
            resolve();
        });

        req.end();
    });
}

// --- Run Test ---
async function runTest() {
    console.log(`Starting Search Latency Test on ${CONFIG.API_URL}`);
    const terms = readSearchTerms();
    console.log(`Loaded ${terms.length} search terms.`);

    // Generate workload
    const workload = [];
    for (let i = 0; i < CONFIG.CONCURRENT_REQUESTS; i++) {
        const term = terms[Math.floor(Math.random() * terms.length)];
        workload.push(term);
    }

    stats.startTime = performance.now();

    console.log(`Sending ${workload.length} concurrent search requests...`);
    await Promise.all(workload.map(term => search(term)));

    stats.endTime = performance.now();
    printReport();
}

function printReport() {
    const totalTime = (stats.endTime - stats.startTime).toFixed(2);
    const avgTime = (stats.times.reduce((a, b) => a + b, 0) / stats.times.length).toFixed(2) || 0;
    const sortedTimes = stats.times.sort((a, b) => a - b);
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0;

    console.log('\n--- Search Performance Report ---');
    console.log(`Concurrency:    ${CONFIG.CONCURRENT_REQUESTS}`);
    console.log(`Successful:     ${stats.success}`);
    console.log(`Failed:         ${stats.failed}`);
    console.log(`Total Time:     ${totalTime} ms`);
    console.log(`Avg Latency:    ${avgTime} ms`);
    console.log(`P95 Latency:    ${p95.toFixed(2)} ms`);

    if (avgTime > 2000) {
        console.warn('WARNING: Average latency exceeded 2000ms threshold!');
    } else {
        console.log('PASS: Latency within acceptable limits (<2s).');
    }
}

runTest();
