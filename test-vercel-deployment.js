#!/usr/bin/env node

/**
 * Test individual Vercel API endpoints
 */

const https = require('https');

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testAllEndpoints() {
  const endpoints = [
    'https://risun-backend.vercel.app',
    'https://risun-backend.vercel.app/api',
    'https://risun-backend.vercel.app/api/index',
    'https://risun-backend.vercel.app/api/register',
    'https://risun-backend.vercel.app/api/login',
    'https://risun-backend.vercel.app/api/visualizations'
  ];

  console.log('🔍 Testing Vercel Backend Endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const result = await testEndpoint(endpoint);
      console.log(`✅ Status: ${result.status}`);
      if (result.data) {
        console.log(`📄 Response: ${result.data.substring(0, 200)}...`);
      }
      console.log('---');
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log('---');
    }
  }
}

testAllEndpoints();