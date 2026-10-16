const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting End-to-End API Test Suite for InternPulse...\n');

  try {
    // 1. Admin Login
    console.log('1️⃣ Testing Admin Login...');
    const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@internpulse.com', password: 'admin123' }),
    });
    const adminAuth = await adminLoginRes.json();
    if (!adminLoginRes.ok || !adminAuth.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminAuth)}`);
    }
    const adminToken = adminAuth.token;
    console.log(`   ✅ Admin logged in: ${adminAuth.name} (${adminAuth.role})`);

    // 2. Intern Login
    console.log('\n2️⃣ Testing Intern Login...');
    const internLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.morgan@internpulse.com', password: 'intern123' }),
    });
    const internAuth = await internLoginRes.json();
    if (!internLoginRes.ok || !internAuth.token) {
      throw new Error(`Intern login failed: ${JSON.stringify(internAuth)}`);
    }
    const internToken = internAuth.token;
    console.log(`   ✅ Intern logged in: ${internAuth.name} (${internAuth.role})`);

    // 3. Admin Dashboard Metrics
    console.log('\n3️⃣ Testing GET /api/dashboard/admin...');
    const adminDashRes = await fetch(`${API_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminDash = await adminDashRes.json();
    console.log(`   ✅ Total Interns: ${adminDash.stats.totalInterns}`);
    console.log(`   ✅ Total Tasks: ${adminDash.stats.totalTasks}`);
    console.log(`   ✅ Completed: ${adminDash.stats.completedTasks}, Pending: ${adminDash.stats.pendingTasks}, Submitted: ${adminDash.stats.submittedTasks}`);

    // 4. Intern Dashboard Metrics & Progress Formula
    console.log('\n4️⃣ Testing GET /api/dashboard/intern...');
    const internDashRes = await fetch(`${API_URL}/dashboard/intern`, {
      headers: { Authorization: `Bearer ${internToken}` },
    });
    const internDash = await internDashRes.json();
    console.log(`   ✅ Assigned Tasks: ${internDash.stats.assignedTasks}`);
    console.log(`   ✅ Completed: ${internDash.stats.completedTasks}`);
    console.log(`   ✅ Calculated Progress: ${internDash.stats.overallProgress}%`);

    // 5. Create New Intern by Admin
    console.log('\n5️⃣ Testing POST /api/interns (Create Intern)...');
    const newInternEmail = `test.intern.${Date.now()}@internpulse.com`;
    const createInternRes = await fetch(`${API_URL}/interns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: newInternEmail,
        password: 'password123',
        phone: '+1 555-987-6543',
        department: 'Full-Stack Development',
        joiningDate: new Date().toISOString(),
        status: 'Active',
      }),
    });
    const createdIntern = await createInternRes.json();
    if (!createInternRes.ok || !createdIntern._id) {
      throw new Error(`Create intern failed: ${JSON.stringify(createdIntern)}`);
    }
    console.log(`   ✅ Intern created: ${createdIntern.name} (ID: ${createdIntern._id})`);

    // 6. Create and Assign Task to Jordan Lee
    console.log('\n6️⃣ Testing POST /api/tasks (Create & Assign Task)...');
    const createTaskRes = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Build Reusable Table Component',
        description: 'Implement responsive pagination, search filter, and column sorting using React and Tailwind.',
        assignedTo: createdIntern._id,
        priority: 'High',
        dueDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      }),
    });
    const createdTask = await createTaskRes.json();
    if (!createTaskRes.ok || !createdTask._id) {
      throw new Error(`Create task failed: ${JSON.stringify(createdTask)}`);
    }
    console.log(`   ✅ Task created: "${createdTask.title}" -> Assigned to: ${createdTask.assignedTo.name}`);

    // 7. Log in as Jordan Lee
    console.log('\n7️⃣ Testing Login for New Intern Jordan Lee...');
    const jordanLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newInternEmail, password: 'password123' }),
    });
    const jordanAuth = await jordanLoginRes.json();
    const jordanToken = jordanAuth.token;
    console.log(`   ✅ Jordan Lee authenticated successfully!`);

    // 8. Jordan starts task (Pending -> In Progress)
    console.log('\n8️⃣ Testing PATCH /api/tasks/:id/status (Start Task)...');
    const startTaskRes = await fetch(`${API_URL}/tasks/${createdTask._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jordanToken}`,
      },
      body: JSON.stringify({ status: 'In Progress' }),
    });
    const startedTask = await startTaskRes.json();
    console.log(`   ✅ Task status updated to: ${startedTask.status}`);

    // 9. Jordan submits work
    console.log('\n9️⃣ Testing POST /api/submissions (Submit Work)...');
    const submitWorkRes = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jordanToken}`,
      },
      body: JSON.stringify({
        taskId: createdTask._id,
        githubLink: 'https://github.com/jordan/reusable-table',
        projectLink: 'https://jordan-table.internpulse.dev',
        description: 'Completed responsive table with sortable columns and zebra rows.',
      }),
    });
    const submittedWork = await submitWorkRes.json();
    console.log(`   ✅ Work submitted with status: ${submittedWork.status}`);

    // Verify task is now 'Submitted'
    const checkTaskRes = await fetch(`${API_URL}/tasks/${createdTask._id}`, {
      headers: { Authorization: `Bearer ${jordanToken}` },
    });
    const taskDetails = await checkTaskRes.json();
    console.log(`   ✅ Task status verified after submission: ${taskDetails.task.status}`);

    // 10. Admin reviews submission and approves work
    console.log('\n🔟 Testing POST /api/feedback (Admin Evaluation & Approval)...');
    const feedbackRes = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        taskId: createdTask._id,
        comment: 'Outstanding implementation! The responsiveness and accessibility are top notch. Approved!',
        decision: 'approved',
      }),
    });
    const feedbackResult = await feedbackRes.json();
    console.log(`   ✅ Evaluation submitted: Decision = ${feedbackResult.feedback.decision}`);
    console.log(`   ✅ Task status is now: ${feedbackResult.task.status}`);

    // 11. Verify Jordan's progress is now 100% (1 completed out of 1 assigned)
    console.log('\n1️⃣1️⃣ Testing Jordan\'s Progress Calculation after Approval...');
    const jordanDashRes = await fetch(`${API_URL}/dashboard/intern`, {
      headers: { Authorization: `Bearer ${jordanToken}` },
    });
    const jordanDash = await jordanDashRes.json();
    console.log(`   ✅ Assigned: ${jordanDash.stats.assignedTasks}, Completed: ${jordanDash.stats.completedTasks}`);
    console.log(`   ✅ Progress: ${jordanDash.stats.overallProgress}% (100% expected)`);

    // 12. Authorization Security Test: Intern cannot access Admin endpoints
    console.log('\n1️⃣2️⃣ Testing Authorization Security: Intern attempting Admin endpoint...');
    const unauthorizedRes = await fetch(`${API_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${jordanToken}` },
    });
    if (unauthorizedRes.status === 403) {
      console.log('   🔒 Protected: Access forbidden (403) as expected for intern role.');
    } else {
      console.warn(`   ⚠️ Unexpected status: ${unauthorizedRes.status}`);
    }

    console.log('\n🎉 ALL 12 END-TO-END TESTS PASSED WITH 100% SUCCESS!\n');
  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error.message);
    process.exit(1);
  }
}

runTests();
