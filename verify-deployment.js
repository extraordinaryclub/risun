#!/usr/bin/env node

/**
 * RISUN Deployment Verification Script
 * Tests both frontend and backend deployments on Vercel
 */

const https = require('https');
const http = require('http');

const FRONTEND_URL = 'https://risun.vercel.app';
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

function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
  });
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    log(`\n🔍 Testing ${name}...`, 'blue');
    log(`   URL: ${url}`, 'yellow');
    
    const response = await makeRequest(url);
    
    if (response.statusCode === expectedStatus) {
      log(`   ✅ SUCCESS: ${name} is working (Status: ${response.statusCode})`, 'green');
      return true;
    } else {
      log(`   ⚠️  WARNING: ${name} returned status ${response.statusCode} (expected ${expectedStatus})`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`   ❌ ERROR: ${name} failed - ${error.message}`, 'red');
    return false;
  }
}

async function testAPIEndpoint(name, url, method = 'GET') {
  try {
    log(`\n🔍 Testing ${name}...`, 'blue');
    log(`   URL: ${url}`, 'yellow');
    
    const response = await makeRequest(url);
    
    // API endpoints might return 404 for root, but should be reachable
    if (response.statusCode < 500) {
      log(`   ✅ SUCCESS: ${name} is reachable (Status: ${response.statusCode})`, 'green');
      return true;
    } else {
      log(`   ❌ ERROR: ${name} server error (Status: ${response.statusCode})`, 'red');
      return false;
    }
  } catch (error) {
    log(`   ❌ ERROR: ${name} failed - ${error.message}`, 'red');
    return false;
  }
}

async function runDeploymentTests() {
  log('🚀 RISUN Deployment Verification', 'bold');
  log('=====================================', 'blue');
  
  const results = [];
  
  // Test Frontend
  log('\n📱 FRONTEND TESTS', 'bold');
  results.push(await testEndpoint('Frontend Homepage', FRONTEND_URL));
  
  // Test Backend
  log('\n🖥️  BACKEND TESTS', 'bold');
  results.push(await testAPIEndpoint('Backend API Root', BACKEND_URL));
  results.push(await testAPIEndpoint('Backend API Health', `${BACKEND_URL}/api`));
  
  // Test ML Services (External)
  log('\n🤖 ML SERVICES TESTS', 'bold');
  results.push(await testAPIEndpoint('Fault Detection Service', 'https://faultdetmodel-production.up.railway.app'));
  results.push(await testAPIEndpoint('Power Prediction Service', 'https://ppgmodel-production.up.railway.app'));
  
  // Summary
  log('\n📊 DEPLOYMENT SUMMARY', 'bold');
  log('=====================================', 'blue');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    log(`🎉 ALL TESTS PASSED! (${passed}/${total})`, 'green');
    log('✅ Your RISUN deployment is working correctly!', 'green');
  } else {
    log(`⚠️  SOME TESTS FAILED (${passed}/${total} passed)`, 'yellow');
    log('🔧 Please check the failed services and try again.', 'yellow');
  }
  
  log('\n🔗 Quick Links:', 'blue');
  log(`   Frontend: ${FRONTEND_URL}`, 'blue');
  log(`   Backend:  ${BACKEND_URL}`, 'blue');
  
  log('\n💡 Next Steps:', 'blue');
  log('   1. Test user registration and login', 'blue');
  log('   2. Try the fault detection feature', 'blue');
  log('   3. Test power prediction with a location', 'blue');
  log('   4. Verify weather data is loading', 'blue');
  
  return passed === total;
}

// Run the tests
if (require.main === module) {
  runDeploymentTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`\n💥 Verification script failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runDeploymentTests, testEndpoint, testAPIEndpoint };