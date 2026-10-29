import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:3000';

test('Security check: Unauthorized requests to /api/admin/leads must return 401', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/leads`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Unauthorized');
});

test('Security check: Invalid bearer token must return 401', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/leads`, {
    headers: { Authorization: 'Bearer invalid_forged_token_xyz' }
  });
  assert.equal(res.status, 401);
});

test('Security check: Invalid login credentials must return 401', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@elloradigital.in', password: 'WrongPassword123' })
  });
  assert.equal(res.status, 401);
});

test('Authentication: Correct admin credentials return session token', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@elloradigital.in',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
    })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.email, 'admin@elloradigital.in');

  // Verify /api/admin/me
  const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });
  assert.equal(meRes.status, 200);
  const meData = await meRes.json();
  assert.equal(meData.user.email, 'admin@elloradigital.in');
});

test('End-to-End: Public enquiry submission persists to database and is visible in CRM', async () => {
  // 1. Submit public enquiry
  const uniqueName = `Integration Test Client ${Date.now()}`;
  const enquiryRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: uniqueName,
      businessName: 'Test Enterprises Ltd',
      email: 'integration@testenterprise.in',
      phone: '9876543210',
      businessType: 'manufacturing',
      requiredService: 'custom-crm',
      budgetRange: '₹35,000 - ₹75,000',
      projectDescription: 'We need an automated multi-stage inventory and order dispatch system for Indian operations.',
      preferredContactMethod: 'WhatsApp',
      consentAgreed: true
    })
  });

  assert.equal(enquiryRes.status, 201);
  const enquiryData = await enquiryRes.json();
  assert.ok(enquiryData.referenceId);
  const leadId = enquiryData.lead.id;

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

  // 3. Retrieve leads from CRM and find the newly created lead
  const leadsRes = await fetch(`${BASE_URL}/api/admin/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(leadsRes.status, 200);
  const leadsData = await leadsRes.json();
  const foundLead = leadsData.leads.find((l: any) => l.id === leadId);
  assert.ok(foundLead);
  assert.equal(foundLead.fullName, uniqueName);
  assert.equal(foundLead.status, 'New');

  // 4. Update status to "Contacted"
  const statusRes = await fetch(`${BASE_URL}/api/admin/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'Contacted' })
  });
  assert.equal(statusRes.status, 200);
  const updatedLead = await statusRes.json();
  assert.equal(updatedLead.lead.status, 'Contacted');

  // 5. Add internal note
  const noteRes = await fetch(`${BASE_URL}/api/admin/leads/${leadId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Discovery call scheduled with Managing Director.' })
  });
  assert.equal(noteRes.status, 201);

  // 6. Schedule follow up date
  const followUpRes = await fetch(`${BASE_URL}/api/admin/leads/${leadId}/followup`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ followUpDate: '2026-11-10' })
  });
  assert.equal(followUpRes.status, 200);

  // 7. Test CSV export (authorized)
  const csvRes = await fetch(`${BASE_URL}/api/admin/export-csv`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(csvRes.status, 200);
  const csvText = await csvRes.text();
  assert.ok(csvText.includes('Reference,Date,Status,Name'));
  assert.ok(csvText.includes(enquiryData.referenceId));

  // 8. Test CSV export (unauthorized)
  const unauthCsvRes = await fetch(`${BASE_URL}/api/admin/export-csv`);
  assert.equal(unauthCsvRes.status, 401);

  // 9. Trigger backup snapshot
  const backupRes = await fetch(`${BASE_URL}/api/admin/backup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(backupRes.status, 200);
  const backupData = await backupRes.json();
  assert.ok(backupData.backup.filename.includes('crm_backup_'));

  // 10. Test Logout
  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(logoutRes.status, 200);

  // 11. Subsequent request with logged-out token must fail
  const postLogoutRes = await fetch(`${BASE_URL}/api/admin/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(postLogoutRes.status, 401);
});
