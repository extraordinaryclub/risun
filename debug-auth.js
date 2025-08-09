#!/usr/bin/env node

/**
 * RISUN Authentication Debug Script
 * Tests login and registration endpoints to identify issues
 */

const https = require('https');

const BACKEND_URL = 'https://risun-backend.vercel.app';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
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
        'Content-Type': 'application/json',
        'User-Agent': 'RISUN-Debug-Script',
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
      reject(new Error('Request timeout after 15 seconds'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    log(`\n🔍 Testing ${name}...`, 'blue');
    log(`   URL: ${url}`, 'yellow');
    if (options.body) {
      log(`   Body: ${JSON.stringify(options.body, null, 2)}`, 'yellow');
    }
    
    const response = await makeRequest(url, options);
    
    log(`   Status: ${response.statusCode}`, response.statusCode < 400 ? 'green' : 'red');
    log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'blue');
    
    if (response.statusCode < 400) {
      log(`   ✅ SUCCESS: ${name}`, 'green');
      return { success: true, response };
    } else {
      log(`   ❌ ERROR: ${name} failed with status ${response.statusCode}`, 'red');
      return { success: false, response };
    }
  } catch (error) {
    log(`   💥 EXCEPTION: ${name} - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runAuthTests() {
  log('🔐 RISUN Authentication Debug', 'bold');
  log('=====================================', 'blue');
  
  const results = [];
  
  // Test 1: Backend Health Check
  log('\n🏥 BACKEND HEALTH CHECKS', 'bold');
  results.push(await testEndpoint('Backend Root', BACKEND_URL));
  results.push(await testEndpoint('API Root', `${BACKEND_URL}/api`));
  
  // Test 2: Registration Endpoint
  log('\n📝 REGISTRATION TESTS', 'bold');
  
  const testUser = {
    organizationName: 'Test Organization',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    location: 'Test Location'
  };
  
  const registerResult = await testEndpoint('User Registration', `${BACKEND_URL}/api/register`, {
    method: 'POST',
    body: testUser
  });
  results.push(registerResult);
  
  // Test 3: Login Endpoint
  log('\n🔑 LOGIN TESTS', 'bold');
  
  // First try with the user we just registered (if successful)
  if (registerResult.success) {
    const loginResult = await testEndpoint('Login with New User', `${BACKEND_URL}/api/login`, {
      method: 'POST',
      body: {
        organizationName: testUser.organizationName,
        email: testUser.email,
        password: testUser.password
      }
    });
    results.push(loginResult);
  }
  
  // Test with invalid credentials
  const invalidLoginResult = await testEndpoint('Login with Invalid Credentials', `${BACKEND_URL}/api/login`, {
    method: 'POST',
    body: {
      organizationName: 'Invalid Org',
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }
  });
  results.push(invalidLoginResult);
  
  // Test 4: CORS Check
  log('\n🌐 CORS TESTS', 'bold');
  const corsResult = await testEndpoint('CORS Preflight', `${BACKEND_URL}/api/login`, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://risun.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });
  results.push(corsResult);
  
  // Test 5: Environment Variables Check
  log('\n⚙️ ENVIRONMENT TESTS', 'bold');
  log('   Checking if backend has required environment variables...', 'blue');
  
  // We can infer this from the registration/login responses
  if (registerResult.success === false && registerResult.response?.rawData?.includes('MongoError')) {
    log('   ❌ MongoDB connection issue detected', 'red');
  } else if (registerResult.success) {
    log('   ✅ MongoDB connection appears to be working', 'green');
  }
  
  // Summary
  log('\n📊 DEBUG SUMMARY', 'bold');
  log('=====================================', 'blue');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  // Specific issue identification
  log('\n🔍 ISSUE ANALYSIS:', 'bold');
  
  if (!results[0]?.success) {
    log('❌ Backend is not accessible - Check Vercel deployment', 'red');
  } else if (!results[2]?.success) {
    log('❌ Registration endpoint failing - Check MongoDB connection and environment variables', 'red');
  } else if (!results[3]?.success) {
    log('❌ Login endpoint failing - Check authentication logic', 'red');
  } else {
    log('✅ Authentication endpoints appear to be working', 'green');
  }
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'bold');
  log('1. Check Vercel environment variables are set correctly', 'blue');
  log('2. Verify MongoDB Atlas connection string', 'blue');
  log('3. Check CORS configuration allows your frontend domain', 'blue');
  log('4. Test with browser developer tools for more details', 'blue');
  
  return results;
}

// Run the tests
if (require.main === module) {
  runAuthTests()
    .then(results => {
      const allPassed = results.every(r => r.success);
      process.exit(allPassed ? 0 : 1);
    })
    .catch(error => {
      log(`\n💥 Debug script failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runAuthTests, testEndpoint };