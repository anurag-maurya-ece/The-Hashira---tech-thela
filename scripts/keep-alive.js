const http = require('http');
const https = require('https');

// Get URL from environment or fallback to localhost
const url = process.argv[2] || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const endpoint = `${url.replace(/\/$/, '')}/api/health`;

console.log(`🚀 Starting Keep-Alive script for: ${endpoint}`);

function ping() {
  const lib = endpoint.startsWith('https') ? https : http;
  
  lib.get(endpoint, (res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Ping status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleTimeString()}] Ping Error: ${err.message}`);
  });
}

// Ping immediately
ping();

// Ping every 5 minutes (300,000 ms)
setInterval(ping, 300000);
