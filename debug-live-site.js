#!/usr/bin/env node

/**
 * Debug the exact issue on the live site
 */

const https = require('https');

// Test the exact same request that the frontend makes
async function testExactFrontendRequest() {
  console.log('🔍 Testing Exact Frontend Request Pattern...\n');

  // Test 1: Registration exactly like frontend
  console.log('1. Testing Registration (Frontend Pattern)...');
  const testUser = {
    organizationName: 'Debug Test Org',
    email: `debug-${Date.now()}@example.com`,
    password: 'TestPassword123',
    location: 'Debug Location'
  };

  try {
    const regResult = await makeAxiosLikeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'POST',
      data: testUser,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://risun.vercel.app',
        'Referer': 'https://risun.vercel.app/registerpage'
      }
    });

    console.log(`   Registration Status: ${regResult.status}`);
    console.log(`   Registration Data: ${JSON.stringify(regResult.data, null, 2)}`);

    if (regResult.status === 200) {
      // Test 2: Login exactly like frontend
      console.log('\n2. Testing Login (Frontend Pattern)...');
      const loginResult = await makeAxiosLikeRequest('https://risun-backend.vercel.app/api/login', {
        method: 'POST',
        data: {
          organizationName: testUser.organizationName,
          email: testUser.email,
          password: testUser.password
        },
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://risun.vercel.app',
          'Referer': 'https://risun.vercel.app/loginpage'
        }
      });

      console.log(`   Login Status: ${loginResult.status}`);
      console.log(`   Login Data: ${JSON.stringify(loginResult.data, null, 2)}`);
    }

  } catch (error) {
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Error Status: ${error.response.status}`);
      console.log(`   Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }

  // Test 3: Check what happens with invalid data
  console.log('\n3. Testing Invalid Registration Data...');
  try {
    const invalidResult = await makeAxiosLikeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'POST',
      data: {
        // Missing required fields
        organizationName: '',
        email: 'invalid-email',
        password: '123',
        location: ''
      },
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://risun.vercel.app'
      }
    });
    console.log(`   Invalid Data Status: ${invalidResult.status}`);
    console.log(`   Invalid Data Response: ${JSON.stringify(invalidResult.data, null, 2)}`);
  } catch (error) {
    console.log(`   Invalid Data Error: ${error.message}`);
    if (error.response) {
      console.log(`   Invalid Data Error Status: ${error.response.status}`);
      console.log(`   Invalid Data Error Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }

  // Test 4: Check baseURL behavior
  console.log('\n4. Testing BaseURL Behavior...');
  console.log('   If frontend baseURL is set correctly, requests should go to:');
  console.log('   https://risun-backend.vercel.app/api/register');
  console.log('   https://risun-backend.vercel.app/api/login');
}

function makeAxiosLikeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          if (res.statusCode >= 400) {
            const error = new Error(`Request failed with status ${res.statusCode}`);
            error.response = {
              status: res.statusCode,
              data: jsonData
            };
            reject(error);
          } else {
            resolve({
              status: res.statusCode,
              data: jsonData
            });
          }
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.data) {
      req.write(JSON.stringify(options.data));
    }
    
    req.end();
  });
}

testExactFrontendRequest().catch(console.error);