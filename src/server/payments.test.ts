import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:3000';

test('Payments: Catalog endpoint returns trusted pricing and business UPI ID', async () => {
  const res = await fetch(`${BASE_URL}/api/payments/catalog`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.businessUpiId, 'rubienterprisesgst-1@okhdfcbank');
  assert.equal(data.businessName, 'RUBI TECH PARK');
  assert.ok(data.catalog['starter-web']);
  assert.equal(data.catalog['starter-web'].basePrice, 5000);
});

test('Payments: Order creation calculates server-side trusted price with 18% GST', async () => {
  const res = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: 'starter-web',
      customerName: 'Karthik Subramanian',
      customerEmail: 'karthik@kovai.in',
      customerPhone: '9876543210',
      customerBusiness: 'Kovai Precision Tools',
      paymentMethod: 'upi_qr'
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.order.orderRef.startsWith('RTP-ORD-'));
  assert.equal(data.order.baseAmountINR, 5000);
  assert.equal(data.order.taxAmountINR, 900); // 18% of 5000
  assert.equal(data.order.totalAmountINR, 5900);
  assert.equal(data.order.status, 'created');
  assert.ok(data.upiIntentUri.includes('rubienterprisesgst-1%40okhdfcbank') || data.upiIntentUri.includes('rubienterprisesgst-1@okhdfcbank'));
});

test('Payments: Manual UPI submission transitions order to pending_verification only', async () => {
  // 1. Create order
  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: 'growth-ecommerce',
      customerName: 'Anitha Rajan',
      customerEmail: 'anitha@silks.in',
      customerPhone: '9842112345',
      customerBusiness: 'Rajan Silks Coimbatore',
      paymentMethod: 'upi_qr'
    })
  });
  const { order } = await orderRes.json();

  // 2. Submit manual UTR
  const utrRes = await fetch(`${BASE_URL}/api/payments/submit-manual-upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderRef: order.orderRef,
      utr: '429182371920'
    })
  });

  assert.equal(utrRes.status, 200);
  const utrData = await utrRes.json();
  assert.equal(utrData.success, true);
  assert.equal(utrData.payment.status, 'pending_verification');
  assert.equal(utrData.payment.upiTransactionRef, '429182371920');

  // Verify status is NOT marked as paid automatically
  assert.notEqual(utrData.payment.status, 'paid');
});

test('Security check: Unauthorized requests to /api/admin/payments must return 401', async () => {
  const res = await fetch(`${BASE_URL}/api/admin/payments`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Unauthorized');
});

test('Admin Workflow: Authorized admin verifies manual UPI payment and marks Paid', async () => {
  // 1. Create order
  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: 'custom-software',
      customerName: 'Selvam Murugan',
      customerEmail: 'selvam@logistics.in',
      customerPhone: '9443312345',
      customerBusiness: 'Murugan Roadways',
      paymentMethod: 'upi_manual'
    })
  });
  const { order } = await orderRes.json();

  // 2. Submit UTR
  await fetch(`${BASE_URL}/api/payments/submit-manual-upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderRef: order.orderRef,
      utr: '987654321098'
    })
  });

  // 3. Admin Login
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rubitechpark.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'Rudhra$2026'
    })
  });
  const { token } = await loginRes.json();

  // 4. Verify payment via admin endpoint
  const verifyRes = await fetch(`${BASE_URL}/api/admin/payments/${order.id}/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(verifyRes.status, 200);
  const verifyData = await verifyRes.json();
  assert.equal(verifyData.success, true);
  assert.equal(verifyData.payment.status, 'paid');
  assert.ok(verifyData.payment.receiptNumber.startsWith('RTP-REC-'));

  // 5. Check public order endpoint returns updated verified receipt
  const publicRes = await fetch(`${BASE_URL}/api/payments/order/${order.orderRef}`);
  assert.equal(publicRes.status, 200);
  const publicData = await publicRes.json();
  assert.equal(publicData.order.status, 'paid');
  assert.equal(publicData.order.receiptNumber, verifyData.payment.receiptNumber);
});
