// using native fetch (Node 18+)

async function testEndpoints() {
    const baseUrl = 'http://localhost:3000';

    console.log(`Testing ${baseUrl}/api/balance...`);
    try {
        const res = await fetch(`${baseUrl}/api/balance`);
        const data = await res.json();
        console.log('Balance API Result:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Balance API Failed:', err.message);
    }

    console.log(`Testing ${baseUrl}/api/scrape-now...`);
    try {
        const res = await fetch(`${baseUrl}/api/scrape-now`);
        const data = await res.json();
        console.log('Scrape API Result:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Scrape API Failed:', err.message);
    }
}

// Check node version for fetch support, else assume node-fetch might be needed but standard node fetch is now common.
// If this fails on require, I'll rewrite without require if using recent node.
// Given previous steps used 'npm install', I can install node-fetch if needed.
// But let's try native fetch first (Node 18+).
if (typeof fetch === 'undefined') {
    console.log('Native fetch not found. Install node-fetch or use Node 18+');
    process.exit(1);
}

testEndpoints();
