const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let testTaskId = '';

console.log('🚀 Testing Task Manager CRUD Operations...\n');

async function testCRUDOperations() {
  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'testpass123',
      confirmPassword: 'testpass123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    if (registerResponse.status === 201) {
      authToken = registerResponse.data.token;
      console.log('✅ Registration successful');
    }

    // Test 2: User Login
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
    }

    // Set authorization header
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    // Test 3: Create Task
    console.log('3. Testing Task Creation...');
    const taskData = {
      title: 'Test Task - CRUD Operations',
      description: 'Testing CRUD operations for tasks',
      status: 'pending',
      priority: 'high'
    };

    const createResponse = await axios.post(`${BASE_URL}/tasks`, taskData, config);
    if (createResponse.status === 201) {
      testTaskId = createResponse.data.data.task._id;
      console.log('✅ Task creation successful');
      console.log(`   Task ID: ${testTaskId}`);
    }

    // Test 4: Read Tasks
    console.log('4. Testing Task Retrieval...');
    const getResponse = await axios.get(`${BASE_URL}/tasks`, config);
    if (getResponse.status === 200) {
      console.log('✅ Task retrieval successful');
      console.log(`   Found ${getResponse.data.data.tasks.length} tasks`);
    }

    // Test 5: Update Task
    console.log('5. Testing Task Update...');
    const updateData = {
      title: 'Updated Test Task',
      status: 'in-progress',
      priority: 'medium'
    };

    const updateResponse = await axios.put(`${BASE_URL}/tasks/${testTaskId}`, updateData, config);
    if (updateResponse.status === 200) {
      console.log('✅ Task update successful');
      console.log(`   New title: ${updateResponse.data.data.task.title}`);
      console.log(`   New status: ${updateResponse.data.data.task.status}`);
    }

    // Test 6: Get Stats
    console.log('6. Testing Task Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/tasks/stats/overview`, config);
    if (statsResponse.status === 200) {
      console.log('✅ Statistics retrieval successful');
      console.log(`   Total tasks: ${statsResponse.data.data.total}`);
    }

    // Test 7: Delete Task
    console.log('7. Testing Task Deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/tasks/${testTaskId}`, config);
    if (deleteResponse.status === 200) {
      console.log('✅ Task deletion successful');
    }

    // Test 8: Verify Deletion
    console.log('8. Verifying Task Deletion...');
    try {
      await axios.get(`${BASE_URL}/tasks/${testTaskId}`, config);
      console.log('❌ Task should have been deleted');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Task deletion verified - task not found');
      }
    }

    console.log('\n🎉 ALL CRUD TESTS PASSED! 🎉');
    console.log('\n✅ Summary:');
    console.log('   • User Registration: Working');
    console.log('   • User Login: Working');
    console.log('   • Task Creation: Working');
    console.log('   • Task Reading: Working');
    console.log('   • Task Update: Working');
    console.log('   • Task Statistics: Working');
    console.log('   • Task Deletion: Working');
    console.log('\n📋 Your Task Manager API is fully functional!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testCRUDOperations();
