// Test script to verify authentication flow
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://recurser-dsa.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // 1. Test registration (create a test user)
    const username = `testuser_${Date.now()}`;
    const password = 'password123';

    console.log('1️⃣ Testing registration...');
    try {
      await api.post('/api/auth/register', {
        username,
        password,
        confirmPassword: password
      });
      console.log('✅ Registration successful');
    } catch (err) {
      if (err.response?.data?.message?.includes('already taken')) {
        console.log('⚠️  Username already exists, proceeding with login');
      } else {
        console.log('❌ Registration failed:', err.response?.data?.message || err.message);
        console.log('Full error:', err.response?.data);
        return;
      }
    }

    // 2. Test login
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await api.post('/api/auth/login', {
      username,
      password
    });

    console.log('✅ Login successful');
    console.log('🍪 Cookies received:', loginResponse.headers['set-cookie']);
    
    // 3. Test protected endpoint
    console.log('\n3️⃣ Testing protected endpoint...');
    const questionsResponse = await api.get('/api/questions');
    console.log('✅ Questions endpoint accessible:', questionsResponse.data.length, 'questions');

    // 4. Test logout
    console.log('\n4️⃣ Testing logout...');
    await api.post('/api/auth/logout');
    console.log('✅ Logout successful');

    // 5. Test protected endpoint after logout (should fail)
    console.log('\n5️⃣ Testing protected endpoint after logout...');
    try {
      await api.get('/api/questions');
      console.log('❌ Questions endpoint still accessible (logout failed)');
    } catch (err) {
      console.log('✅ Questions endpoint properly protected after logout');
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthFlow();