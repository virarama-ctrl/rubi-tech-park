import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:3000';

test('1. Admin login with admin@rubitechpark.com succeeds and returns token', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.equal(data.user.email, 'admin@rubitechpark.com');
});

test('2. Invalid password rejection on login', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: 'TotallyWrongPassword123!'
    })
  });
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Invalid Credentials');
});

test('3. Unauthorised user access rejection (non-admin role)', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hacker_or_guest@randomdomain.com',
      password: 'SomePassword123'
    })
  });
  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.error, 'Forbidden');
  assert.equal(data.code, 'ACCESS_DENIED');
});

test('4. Direct dashboard API access without token is blocked (HTTP 401)', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/leads`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Unauthorized');
});

test('5. Existing two lead records (RTP-2026-9985 and RTP-2026-5051) are available in Firestore', async () => {
  // Login first
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  // Fetch RTP-2026-9985
  const res1 = await fetch(`${BASE_URL}/api/admin/leads/RTP-2026-9985`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res1.status, 200);
  const data1 = await res1.json();
  assert.ok(data1.lead);
  assert.equal(data1.lead.enquiryId, 'RTP-2026-9985');
  assert.equal(data1.lead.source, 'Website Lead Form');

  // Fetch RTP-2026-5051
  const res2 = await fetch(`${BASE_URL}/api/admin/leads/RTP-2026-5051`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res2.status, 200);
  const data2 = await res2.json();
  assert.ok(data2.lead);
  assert.equal(data2.lead.enquiryId, 'RTP-2026-5051');
  assert.equal(data2.lead.source, 'Chatbot');
});

test('6. Website lead form creates a new Firestore record in crm_leads', async () => {
  const uniquePhone = '9840' + Math.floor(100000 + Math.random() * 900000);
  const uniqueEmail = `web_lead_${Date.now()}@example.com`;

  const submitRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'RTP Website Lead Form Verification',
      businessName: 'Kongu Tech Logistics',
      email: uniqueEmail,
      phone: uniquePhone,
      customerType: 'Enterprise',
      serviceCategory: 'Software Development & Digital Solutions',
      selectedService: 'E-commerce & WhatsApp Ordering Platforms',
      projectDescription: 'Full catalog setup with automated WhatsApp notification integration.',
      source: 'Website Lead Form'
    })
  });
  assert.equal(submitRes.status, 201);
  const submitData = await submitRes.json();
  assert.equal(submitData.success, true);
  assert.equal(submitData.storage, 'firestore');
  assert.equal(submitData.collection, 'crm_leads');
  assert.ok(submitData.referenceId.startsWith('RTP-2026-'));

  // Verify in Firestore
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  const fetchRes = await fetch(`${BASE_URL}/api/admin/leads/${submitData.referenceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(fetchRes.status, 200);
  const fetchData = await fetchRes.json();
  assert.equal(fetchData.lead.email, uniqueEmail);
  assert.equal(fetchData.lead.source, 'Website Lead Form');
});

test('7. Gemini chatbot creates a new Firestore record in crm_leads with ₹236 booking fee', async () => {
  const uniquePhone = '9870' + Math.floor(100000 + Math.random() * 900000);
  const uniqueEmail = `chatbot_lead_${Date.now()}@example.com`;

  const submitRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'RTP Chatbot Citizen Lead',
      email: uniqueEmail,
      phone: uniquePhone,
      customerType: 'Citizen / Individual',
      serviceCategory: 'Citizen E-Services (TN e-Sevai)',
      selectedService: 'New Smart Ration Card Application',
      projectDescription: 'Applied through RUBI Assistant AI chatbot interaction.',
      source: 'Chatbot',
      isEService: true,
      bookingAmount: 236,
      bookingPaymentStatus: 'Pending'
    })
  });
  assert.equal(submitRes.status, 201);
  const submitData = await submitRes.json();
  assert.equal(submitData.success, true);
  assert.equal(submitData.storage, 'firestore');
  assert.equal(submitData.bookingDetails.totalBookingAmount, 236);

  // Verify in Firestore
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  const fetchRes = await fetch(`${BASE_URL}/api/admin/leads/${submitData.referenceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(fetchRes.status, 200);
  const fetchData = await fetchRes.json();
  assert.equal(fetchData.lead.email, uniqueEmail);
  assert.equal(fetchData.lead.source, 'Chatbot');
  assert.equal(fetchData.lead.bookingAmount, 236);
});

test('8. Admin can update lead status in Firestore', async () => {
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  const patchRes = await fetch(`${BASE_URL}/api/admin/leads/RTP-2026-9985/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'Quotation Sent' })
  });
  assert.equal(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.equal(patchData.success, true);
  assert.equal(patchData.lead.status, 'Quotation Sent');
});

test('9. Admin can add internal notes to lead in Firestore', async () => {
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  const noteRes = await fetch(`${BASE_URL}/api/admin/leads/RTP-2026-9985/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Spoke with client. Scope approved for development.' })
  });
  assert.equal(noteRes.status, 201);
  const noteData = await noteRes.json();
  assert.equal(noteData.success, true);
  assert.ok(noteData.note.content.includes('Spoke with client'));
});

test('10. Logout invalidates admin session', async () => {
  const loginRes = await fetch(`${BASE_URL}/api/admin/firebase-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(logoutRes.status, 200);

  // Subsequent request using logged out token must fail
  const testRes = await fetch(`${BASE_URL}/api/admin/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(testRes.status, 401);
});
