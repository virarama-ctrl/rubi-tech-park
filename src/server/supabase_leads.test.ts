import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:3000';

test('Supabase Status Endpoint: /api/admin/supabase-status returns configuration object', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/supabase-status`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.configured === 'boolean');
  assert.ok(data.mode === 'supabase' || data.mode === 'local_persistent');
  assert.ok(Array.isArray(data.requiredEnvVars));
});

test('Duplicate Prevention: submitting identical enquiry within 15s returns existing reference', async () => {
  const timestamp = Date.now();
  const phone = '9845112233';
  const email = `test.client.${timestamp}@rubitechpark.com`;

  // First submission
  const firstRes = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Anand Kumar',
      phone: phone,
      email: email,
      requiredService: 'ecommerce-store',
      projectDescription: 'Online jewellery catalog with WhatsApp integration.'
    })
  });
  assert.equal(firstRes.status, 201);
  const firstData = await firstRes.json();
  assert.ok(firstData.referenceId);

  // Immediate second submission (within 15s window)
  const secondRes = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Anand Kumar',
      phone: phone,
      email: email,
      requiredService: 'ecommerce-store',
      projectDescription: 'Duplicate click simulation'
    })
  });
  assert.equal(secondRes.status, 200);
  const secondData = await secondRes.json();
  assert.equal(secondData.duplicate, true);
  assert.equal(secondData.referenceId, firstData.referenceId);
});

test('Lead Deletion: authorized admin can delete a lead', async () => {
  // 1. Submit a lead to delete
  const res = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Lead To Delete',
      phone: '9988776655',
      email: `todelete.${Date.now()}@example.com`,
      requiredService: 'custom-crm'
    })
  });
  const data = await res.json();
  const leadId = data.lead.id;

  // 2. Login as admin
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@elloradigital.in',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  const { token } = await loginRes.json();

  // 3. Delete lead
  const deleteRes = await fetch(`${BASE_URL}/api/admin/leads/${leadId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(deleteRes.status, 200);
  const deleteData = await deleteRes.json();
  assert.equal(deleteData.success, true);
});
