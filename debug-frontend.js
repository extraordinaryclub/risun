#!/usr/bin/env node

/**
 * Debug Frontend-Backend Connection Issues
 */

const https = require('https');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://risun.vercel.app',
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
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data
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

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection Issues...\n');

  // Test 1: CORS Preflight
  console.log('1. Testing CORS Preflight from Frontend Domain...');
  try {
    const corsResult = await makeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://risun.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log(`   CORS Status: ${corsResult.statusCode}`);
    console.log(`   CORS Headers: ${JSON.stringify(corsResult.headers['access-control-allow-origin'] || 'None')}`);
  } catch (error) {
    console.log(`   CORS Error: ${error.message}`);
  }

  // Test 2: Registration with Frontend Origin
  console.log('\n2. Testing Registration with Frontend Origin...');
  const testUser = {
    organizationName: 'Frontend Test Org',
    email: `frontend-test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    location: 'Test Location'
  };

  try {
    const regResult = await makeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'POST',
      headers: {
        'Origin': 'https://risun.vercel.app',
        'Referer': 'https://risun.vercel.app/'
      },
      body: testUser
    });
    console.log(`   Registration Status: ${regResult.statusCode}`);
    console.log(`   Registration Response: ${JSON.stringify(regResult.data, null, 2)}`);

    // Test 3: Login with the same user
    if (regResult.statusCode === 200) {
      console.log('\n3. Testing Login with Frontend Origin...');
      const loginResult = await makeRequest('https://risun-backend.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Origin': 'https://risun.vercel.app',
          'Referer': 'https://risun.vercel.app/'
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

  // Test 4: Check if frontend environment variables are accessible
  console.log('\n4. Frontend Environment Variable Check...');
  console.log('   Expected Backend URL: https://risun-backend.vercel.app');
  console.log('   Environment Variable: VITE_REACT_APP_SERVER_DOMAIN');

  // Test 5: Check network connectivity from different angles
  console.log('\n5. Testing Different Request Patterns...');
  
  // Test without Origin header
  try {
    const noOriginResult = await makeRequest('https://risun-backend.vercel.app/api/register', {
      method: 'POST',
      body: {
        organizationName: 'No Origin Test',
        email: `no-origin-${Date.now()}@example.com`,
        password: 'TestPassword123',
        location: 'Test'
      }
    });
    console.log(`   No Origin Header Status: ${noOriginResult.statusCode}`);
  } catch (error) {
    console.log(`   No Origin Header Error: ${error.message}`);
  }

  console.log('\n📊 DIAGNOSIS:');
  console.log('If registration/login work here but not on the website:');
  console.log('1. Check browser console for JavaScript errors');
  console.log('2. Check browser Network tab for failed requests');
  console.log('3. Verify frontend is using correct environment variables');
  console.log('4. Check if there are any client-side validation errors');
  console.log('5. Ensure frontend is making requests to the right URL');
}

testFrontendBackendConnection().catch(console.error);