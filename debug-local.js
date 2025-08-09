#!/usr/bin/env node

/**
 * Debug local development authentication issues
 */

const https = require('https');

async function testLocalToProduction() {
  console.log('🔍 Testing Local Frontend → Production Backend Connection...\n');

  // Test 1: Check if backend allows localhost origin
  console.log('1. Testing CORS from localhost:5173...');
  try {
    const corsResult = await makeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log(`   CORS Status: ${corsResult.statusCode}`);
    console.log(`   CORS Headers: ${JSON.stringify(corsResult.headers['access-control-allow-origin'] || 'None')}`);
  } catch (error) {
    console.log(`   CORS Error: ${error.message}`);
  }

  // Test 2: Try registration from localhost
  console.log('\n2. Testing Registration from localhost...');
  const testUser = {
    organizationName: 'Local Test Org',
    email: `local-test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    location: 'Local Test Location'
  };

  try {
    const regResult = await makeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:5173',
        'Content-Type': 'application/json'
      },
      body: testUser
    });
    console.log(`   Registration Status: ${regResult.statusCode}`);
    console.log(`   Registration Response: ${JSON.stringify(regResult.data, null, 2)}`);

    // Test 3: Try login if registration worked
    if (regResult.statusCode === 200) {
      console.log('\n3. Testing Login from localhost...');
      const loginResult = await makeRequest('https://risun-backend.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Origin': 'http://localhost:5173',
          'Content-Type': 'application/json'
        },
        body: {
          organizationName: testUser.organizationName,
          email: testUser.email,
          password: testUser.password
        }
      });
      console.log(`   Login Status: ${loginResult.statusCode}`);
      console.log(`   Login Response: ${JSON.stringify(loginResult.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`   Registration Error: ${error.message}`);
  }

  console.log('\n📊 DIAGNOSIS:');
  console.log('If tests pass here but fail in browser:');
  console.log('1. Check browser console for exact error messages');
  console.log('2. Check Network tab for failed requests');
  console.log('3. Verify environment variables are loaded correctly');
  console.log('4. Check if there are any client-side validation errors');
}

function makeRequest(url, options = {}) {
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
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

testLocalToProduction().catch(console.error);