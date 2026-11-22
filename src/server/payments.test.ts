import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import vercelHandler from '../../api/index';
import createOrderHandler from '../../api/create-order';
import verifyPaymentHandler from '../../api/verify-payment';
import paymentConfigHandler from '../../api/payments/config';
import paymentHealthHandler from '../../api/payments/health';
import {
  calculateGstBreakdown,
  calculateSubscriptionBreakdown,
  TRUSTED_PRICING_CATALOG,
  SUBSCRIPTION_CATALOG
} from '../config/pricingCatalog';
import { CASE_STUDIES } from '../config/agencyConfig';
import { reconcileGatewayActivation } from '../utils/paymentGatewayStatus';
import {
  verifyRazorpayOrderSignature,
  verifyRazorpaySubscriptionSignature,
  verifyRazorpayWebhookSignature,
  validateCreateOrderInput,
  computeNextBillingDate,
  classifyRazorpayKeyId,
  getRazorpayHealthStatus,
  getRazorpayConfigStatus,
  paymentManager
} from './payments';
import { crmStorage } from './storage';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILES_TO_BACKUP = [
  'crm_payments.json',
  'crm_subscriptions.json',
  'webhook_events.json',
  'crm_audit.json',
  'crm_leads.json'
];

const snapshots = new Map<string, string | null>();
for (const file of FILES_TO_BACKUP) {
  const full = path.join(DATA_DIR, file);
  snapshots.set(full, fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : null);
}

after(() => {
  for (const [full, content] of snapshots.entries()) {
    if (content === null) {
      if (fs.existsSync(full)) fs.unlinkSync(full);
    } else {
      fs.writeFileSync(full, content, 'utf-8');
    }
  }
});

describe('Pricing & GST Calculations', () => {
  it('computes 18% GST accurately for citizen e-service booking deposit (₹200 -> ₹236)', () => {
    const eservice = TRUSTED_PRICING_CATALOG['eservice-booking'];
    assert.ok(eservice, 'eservice-booking item must exist in catalog');
    const breakdown = calculateGstBreakdown(eservice.basePrice);
    assert.equal(breakdown.baseAmountINR, 200);
    assert.equal(breakdown.taxAmountINR, 36);
    assert.equal(breakdown.totalAmountINR, 236);
  });

  it('computes monthly & yearly SaaS subscription GST breakdowns', () => {
    const monthly = calculateSubscriptionBreakdown('kuralvaani-pro', 'monthly');
    assert.ok(monthly);
    assert.equal(monthly.baseAmountINR, 499);
    assert.equal(monthly.gstAmountINR, 90);
    assert.equal(monthly.totalAmountINR, 589);

    const yearly = calculateSubscriptionBreakdown('bulkmate-business', 'yearly');
    assert.ok(yearly);
    assert.equal(yearly.baseAmountINR, 9990);
    assert.equal(yearly.gstAmountINR, 1798);
    assert.equal(yearly.totalAmountINR, 11788);
  });

  it('returns null for unknown subscription plan IDs', () => {
    assert.equal(calculateSubscriptionBreakdown('non-existent-plan', 'monthly'), null);
  });
});

describe('Razorpay Cryptographic Signature Verification', () => {
  const secret = 'rzp_test_secret_unit_key_12345';

  it('verifies valid Razorpay order payment HMAC-SHA256 signatures and rejects tampered ones', () => {
    const orderId = 'order_Test123456';
    const paymentId = 'pay_Test987654';
    const validSig = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    assert.equal(verifyRazorpayOrderSignature(orderId, paymentId, validSig, secret), true);
    assert.equal(
      verifyRazorpayOrderSignature(orderId, paymentId, `${validSig.slice(0, -1)}0`, secret),
      false
    );
    assert.equal(verifyRazorpayOrderSignature(orderId, paymentId, '', secret), false);
    assert.equal(verifyRazorpayOrderSignature('', paymentId, validSig, secret), false);
  });

  it('verifies valid Razorpay subscription mandate HMAC-SHA256 signatures', () => {
    const paymentId = 'pay_Mandate111';
    const subId = 'sub_Recurring222';
    const validSig = crypto
      .createHmac('sha256', secret)
      .update(`${paymentId}|${subId}`)
      .digest('hex');

    assert.equal(verifyRazorpaySubscriptionSignature(paymentId, subId, validSig, secret), true);
    assert.equal(verifyRazorpaySubscriptionSignature(paymentId, subId, 'forged_sig', secret), false);
  });

  it('verifies webhook raw payload HMAC-SHA256 signatures strictly', () => {
    const webhookSecret = 'whsec_test_999';
    const payload = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1' } } } });
    const validSig = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

    assert.equal(verifyRazorpayWebhookSignature(payload, validSig, webhookSecret), true);
    assert.equal(verifyRazorpayWebhookSignature(payload, 'bad_signature', webhookSecret), false);
    assert.equal(verifyRazorpayWebhookSignature(payload, undefined, webhookSecret), false);
    assert.equal(verifyRazorpayWebhookSignature(payload, validSig, undefined), false);
  });
});

describe('Subscription Billing Dates & Webhook Idempotency', () => {
  it('computes next billing dates accurately for monthly and yearly cycles', () => {
    const base = '2026-03-15T10:00:00.000Z';
    const nextMonth = computeNextBillingDate(base, 'monthly');
    const nextYear = computeNextBillingDate(base, 'yearly');

    assert.equal(nextMonth.slice(0, 7), '2026-04');
    assert.equal(nextYear.slice(0, 4), '2027');
  });

  it('processes webhook payment.captured once and skips duplicate event IDs idempotently', async () => {
    const order = await paymentManager.createOrder({
      planId: 'eservice-booking',
      customerName: 'Unit Test User',
      customerEmail: 'unittest@example.com',
      customerPhone: '+91 9876543210',
      paymentMethod: 'upi_qr',
      ipAddress: '127.0.0.1'
    });

    const eventId = `evt_unit_${Date.now()}`;
    const first = await paymentManager.processWebhookEvent({
      eventId,
      eventType: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_unit_captured_001',
            order_id: order.gatewayOrderId,
            notes: { orderRef: order.orderRef }
          }
        }
      },
      ipAddress: '127.0.0.1'
    });

    assert.equal(first.processed, true);
    assert.equal(first.duplicate, false);

    const updated = paymentManager.getOrderByRef(order.orderRef);
    assert.equal(updated?.status, 'paid');
    assert.equal(updated?.gatewayPaymentId, 'pay_unit_captured_001');

    const second = await paymentManager.processWebhookEvent({
      eventId,
      eventType: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_unit_captured_001',
            order_id: order.gatewayOrderId,
            notes: { orderRef: order.orderRef }
          }
        }
      },
      ipAddress: '127.0.0.1'
    });

    assert.equal(second.processed, false);
    assert.equal(second.duplicate, true);
  });
});

describe('Public Catalog Gold/Silver Compliance Check', () => {
  it('contains zero gold, silver, or jewellery references in public pricing, subscriptions, or case studies', () => {
    const serialized = JSON.stringify({
      TRUSTED_PRICING_CATALOG,
      SUBSCRIPTION_CATALOG,
      CASE_STUDIES
    }).toLowerCase();

    for (const forbidden of ['gold', 'silver', 'jewel', 'நகை', 'தங்கம்', 'வெள்ளி']) {
      assert.equal(
        serialized.includes(forbidden),
        false,
        `Forbidden keyword "${forbidden}" found in public catalog/case studies`
      );
    }
  });
});

describe('/api/create-order Input Validation (Paise, Currency, Receipt)', () => {
  it('rejects amounts below 100 paise, fractional paise, and non-INR currencies', () => {
    assert.equal(validateCreateOrderInput({ amount: 99, currency: 'INR' }).valid, false);
    assert.equal(validateCreateOrderInput({ amount: 0, currency: 'INR' }).valid, false);
    assert.equal(validateCreateOrderInput({ amount: -100, currency: 'INR' }).valid, false);
    assert.equal(validateCreateOrderInput({ amount: 236.5, currency: 'INR' }).valid, false);
    assert.equal(validateCreateOrderInput({ amount: 23600, currency: 'USD' }).valid, false);
    assert.equal(
      validateCreateOrderInput({ amount: 23600, currency: 'INR', receipt: 'R'.repeat(41) }).valid,
      false
    );
    assert.equal(
      validateCreateOrderInput({ amount: 23600, currency: 'INR', receipt: '   ' }).valid,
      false
    );
  });

  it('accepts valid integer paise >= 100, INR currency, and receipt <= 40 chars', () => {
    const okMin = validateCreateOrderInput({ amount: 100, currency: 'inr', receipt: 'RTP_REC_100' });
    assert.equal(okMin.valid, true);
    assert.equal(okMin.amountPaise, 100);
    assert.equal(okMin.currency, 'INR');
    assert.equal(okMin.receipt, 'RTP_REC_100');

    const okPlan = validateCreateOrderInput({ amount: 23600 });
    assert.equal(okPlan.valid, true);
    assert.equal(okPlan.amountPaise, 23600);
    assert.equal(okPlan.currency, 'INR');
  });
});

describe('Verify Payment, Duplicate Replay Protection, and CRM Lead Linking', () => {
  it('links CRM lead only after backend HMAC verification succeeds and prevents duplicate payment replay', async () => {
    const prevKeySecret = process.env.RAZORPAY_KEY_SECRET;
    process.env.RAZORPAY_KEY_SECRET = 'rzp_unit_test_secret_abc';

    try {
      const lead = crmStorage.createLead(
        {
          fullName: 'Checkout Verify Tester',
          email: 'verifytester@example.com',
          phone: '9876501234',
          serviceCategory: 'E-Services',
          selectedService: 'PAN Card New / Correction Support',
          isEService: true,
          bookingAmount: 236,
          bookingPaymentStatus: 'Pending'
        },
        '127.0.0.1'
      );

      const order1 = await paymentManager.createOrder({
        planId: 'eservice-booking',
        customerName: 'Checkout Verify Tester',
        customerEmail: 'verifytester@example.com',
        customerPhone: '9876501234',
        leadId: lead.referenceNumber,
        paymentMethod: 'razorpay_checkout',
        ipAddress: '127.0.0.1'
      });

      const order2 = await paymentManager.createOrder({
        planId: 'eservice-booking',
        customerName: 'Second Order Tester',
        customerEmail: 'secondtester@example.com',
        customerPhone: '9876509999',
        paymentMethod: 'razorpay_checkout',
        ipAddress: '127.0.0.1'
      });

      const rzpOrder1Id = order1.gatewayOrderId!;
      const rzpOrder2Id = order2.gatewayOrderId!;
      const paymentId = `pay_unit_verify_${Date.now()}`;

      // 1. Forged signature must fail and keep lead unpaid
      const badVerify = await paymentManager.verifyGatewayPayment({
        orderRef: order1.orderRef,
        gatewayOrderId: rzpOrder1Id,
        gatewayPaymentId: paymentId,
        gatewaySignature: '0'.repeat(64),
        leadId: lead.referenceNumber,
        ipAddress: '127.0.0.1'
      });
      assert.equal(badVerify.success, false);
      assert.equal(crmStorage.getLeadById(lead.id)?.bookingPaymentStatus, 'Pending');
      assert.equal(paymentManager.getOrderByRef(order1.orderRef)?.status, 'created');

      // 2. Valid HMAC signature must mark order paid & link CRM lead
      const validSig1 = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${rzpOrder1Id}|${paymentId}`)
        .digest('hex');

      const goodVerify = await paymentManager.verifyGatewayPayment({
        orderRef: order1.orderRef,
        gatewayOrderId: rzpOrder1Id,
        gatewayPaymentId: paymentId,
        gatewaySignature: validSig1,
        leadId: lead.referenceNumber,
        ipAddress: '127.0.0.1'
      });

      assert.equal(goodVerify.success, true);
      assert.equal(goodVerify.alreadyProcessed, false);
      assert.equal(goodVerify.payment?.status, 'paid');
      assert.equal(goodVerify.payment?.signatureVerified, true);
      assert.equal(crmStorage.getLeadById(lead.id)?.bookingPaymentStatus, 'Verified Paid');
      assert.equal(crmStorage.getLeadById(lead.id)?.linkedOrderRef, order1.orderRef);

      // 3. Repeat verification for same order + same payment ID is idempotent
      const repeatVerify = await paymentManager.verifyGatewayPayment({
        orderRef: order1.orderRef,
        gatewayOrderId: rzpOrder1Id,
        gatewayPaymentId: paymentId,
        gatewaySignature: validSig1,
        ipAddress: '127.0.0.1'
      });
      assert.equal(repeatVerify.success, true);
      assert.equal(repeatVerify.alreadyProcessed, true);

      // 4. Reusing same payment ID against a different order fails as duplicate conflict
      const validSigOtherOrder = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${rzpOrder2Id}|${paymentId}`)
        .digest('hex');

      const replayConflict = await paymentManager.verifyGatewayPayment({
        orderRef: order2.orderRef,
        gatewayOrderId: rzpOrder2Id,
        gatewayPaymentId: paymentId,
        gatewaySignature: validSigOtherOrder,
        ipAddress: '127.0.0.1'
      });
      assert.equal(replayConflict.success, false);
      assert.equal(replayConflict.conflict, true);
      assert.equal(paymentManager.getOrderByRef(order2.orderRef)?.status, 'created');
    } finally {
      if (prevKeySecret === undefined) {
        delete process.env.RAZORPAY_KEY_SECRET;
      } else {
        process.env.RAZORPAY_KEY_SECRET = prevKeySecret;
      }
    }
  });
});

describe('Environment & Secret Hygiene', () => {
  it('never exposes RAZORPAY_KEY_SECRET with a VITE_ prefix in .env.example', () => {
    const envExample = fs.readFileSync(path.resolve(process.cwd(), '.env.example'), 'utf-8');
    assert.equal(envExample.includes('VITE_RAZORPAY_KEY_ID='), true);
    assert.equal(envExample.includes('VITE_RAZORPAY_KEY_SECRET'), false);
    assert.equal(envExample.includes('VITE_RAZORPAY_WEBHOOK_SECRET'), false);
  });
});

describe('Vercel Serverless Handler & HTTP Method Routing (/api/create-order, /api/verify-payment)', () => {
  it('returns 405 JSON on GET /api/create-order and creates + verifies order on POST', async () => {
    const prevKeyId = process.env.RAZORPAY_KEY_ID;
    const prevKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const origFetch = globalThis.fetch;

    process.env.RAZORPAY_KEY_ID = 'rzp_test_unit_handler';
    process.env.RAZORPAY_KEY_SECRET = 'rzp_secret_unit_handler';

    const server = http.createServer((req, res) => vercelHandler(req as any, res));
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const address = server.address() as { port: number };
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const mockedRazorpayOrderId = `order_MockUnit_${Date.now()}`;

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const targetUrl = typeof input === 'string' ? input : input.toString();
      if (targetUrl === 'https://api.razorpay.com/v1/orders') {
        const parsed = JSON.parse(String(init?.body || '{}'));
        return new Response(
          JSON.stringify({
            id: mockedRazorpayOrderId,
            entity: 'order',
            amount: parsed.amount,
            currency: parsed.currency,
            receipt: parsed.receipt,
            status: 'created'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return origFetch(input, init);
    }) as typeof fetch;

    try {
      // 1. GET /api/create-order must return 405 Method Not Allowed with Allow: POST JSON
      const getOrderRes = await origFetch(`${baseUrl}/api/create-order`);
      assert.equal(getOrderRes.status, 405);
      assert.equal(getOrderRes.headers.get('allow'), 'POST');
      const getOrderJson = (await getOrderRes.json()) as Record<string, any>;
      assert.equal(getOrderJson.success, false);
      assert.equal(getOrderJson.error, 'Method Not Allowed');

      // 2. GET /api/verify-payment must return 405 Method Not Allowed JSON
      const getVerifyRes = await origFetch(`${baseUrl}/api/verify-payment`);
      assert.equal(getVerifyRes.status, 405);
      assert.equal(getVerifyRes.headers.get('allow'), 'POST');
      const getVerifyJson = (await getVerifyRes.json()) as Record<string, any>;
      assert.equal(getVerifyJson.error, 'Method Not Allowed');

      // 3. Unknown /api route must return 404 JSON (never HTML)
      const notFoundRes = await origFetch(`${baseUrl}/api/does-not-exist`);
      assert.equal(notFoundRes.status, 404);
      const notFoundJson = (await notFoundRes.json()) as Record<string, any>;
      assert.equal(notFoundJson.success, false);

      // 4. POST /api/create-order creates a Razorpay order and returns 201 JSON
      const createRes = await origFetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'eservice-booking',
          amount: 23600,
          currency: 'INR',
          customerName: 'Vercel Route Tester',
          customerEmail: 'vercel.tester@example.com',
          customerPhone: '9876543210'
        })
      });
      assert.equal(createRes.status, 201);
      const createJson = (await createRes.json()) as Record<string, any>;
      assert.equal(createJson.success, true);
      assert.equal(createJson.orderId, mockedRazorpayOrderId);
      assert.equal(createJson.amount, 23600);
      assert.equal(createJson.currency, 'INR');

      // 5. POST /api/verify-payment rejects bad signature and verifies valid HMAC-SHA256
      const paymentId = `pay_MockUnit_${Date.now()}`;
      const badVerifyRes = await origFetch(`${baseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: createJson.receipt,
          razorpay_order_id: mockedRazorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'invalid_sig'
        })
      });
      assert.equal(badVerifyRes.status, 400);

      const validSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${mockedRazorpayOrderId}|${paymentId}`)
        .digest('hex');

      const goodVerifyRes = await origFetch(`${baseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: createJson.receipt,
          razorpay_order_id: mockedRazorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: validSig
        })
      });
      assert.equal(goodVerifyRes.status, 200);
      const goodVerifyJson = (await goodVerifyRes.json()) as Record<string, any>;
      assert.equal(goodVerifyJson.success, true);
      assert.equal(goodVerifyJson.verified, true);
      assert.equal(goodVerifyJson.payment?.status, 'paid');

      // 6. Simulate Vercel pre-parsed req.body (readableEnded: true) without stream stall
      const preParsedResp = await new Promise<{ statusCode: number; body: string }>((resolve) => {
        const mockReq: any = {
          method: 'POST',
          url: '/api/create-order',
          originalUrl: '/api/create-order',
          headers: { 'content-type': 'application/json' },
          readableEnded: true,
          socket: { remoteAddress: '127.0.0.1' },
          body: {
            planId: 'eservice-booking',
            amount: 23600,
            currency: 'INR',
            customerName: 'PreParsed Tester',
            customerEmail: 'preparsed@example.com',
            customerPhone: '9876543210'
          }
        };
        let chunks = '';
        const headers: Record<string, string> = {};
        const mockRes: any = {
          statusCode: 200,
          setHeader(k: string, v: string) {
            headers[k.toLowerCase()] = String(v);
          },
          getHeader(k: string) {
            return headers[k.toLowerCase()];
          },
          removeHeader(k: string) {
            delete headers[k.toLowerCase()];
          },
          writeHead(code: number) {
            this.statusCode = code;
            return this;
          },
          write(chunk: any) {
            chunks += Buffer.isBuffer(chunk) ? chunk.toString('utf-8') : String(chunk);
            return true;
          },
          end(chunk?: any) {
            if (chunk) chunks += Buffer.isBuffer(chunk) ? chunk.toString('utf-8') : String(chunk);
            resolve({ statusCode: this.statusCode, body: chunks });
          }
        };
        vercelHandler(mockReq, mockRes);
      });
      assert.equal(preParsedResp.statusCode, 201);
      const preParsedJson = JSON.parse(preParsedResp.body);
      assert.equal(preParsedJson.success, true);
      assert.equal(preParsedJson.orderId, mockedRazorpayOrderId);
    } finally {
      globalThis.fetch = origFetch;
      await new Promise<void>((resolve) => server.close(() => resolve()));
      if (prevKeyId === undefined) delete process.env.RAZORPAY_KEY_ID;
      else process.env.RAZORPAY_KEY_ID = prevKeyId;
      if (prevKeySecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
      else process.env.RAZORPAY_KEY_SECRET = prevKeySecret;
    }
  });

  it('standalone /api/create-order, /api/verify-payment, and /api/payments/config return valid JSON on all responses', async () => {
    const prevKeyId = process.env.RAZORPAY_KEY_ID;
    const prevKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const origFetch = globalThis.fetch;

    const server = http.createServer((req, res) => {
      if (req.url?.startsWith('/api/create-order')) return createOrderHandler(req as any, res);
      if (req.url?.startsWith('/api/verify-payment')) return verifyPaymentHandler(req as any, res);
      if (req.url?.startsWith('/api/payments/config')) return paymentConfigHandler(req as any, res);
      res.statusCode = 404;
      res.end('not found');
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const address = server.address() as { port: number };
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const mockedOrderId = `order_Standalone_${Date.now()}`;

    try {
      // 1. Missing credentials must return 503 valid JSON (not HTML or uncaught throw)
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;

      const cfgUnconfigured = await origFetch(`${baseUrl}/api/payments/config`);
      assert.equal(cfgUnconfigured.status, 200);
      assert.ok(cfgUnconfigured.headers.get('content-type')?.includes('application/json'));
      const cfgUnconfiguredJson = (await cfgUnconfigured.json()) as Record<string, any>;
      assert.equal(cfgUnconfiguredJson.gatewayConfigured, false);
      assert.equal(cfgUnconfiguredJson.razorpayKeyId, null);

      const unconfRes = await origFetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'eservice-booking', amount: 23600, currency: 'INR' })
      });
      assert.equal(unconfRes.status, 503);
      assert.ok(unconfRes.headers.get('content-type')?.includes('application/json'));
      const unconfJson = (await unconfRes.json()) as Record<string, any>;
      assert.equal(unconfJson.success, false);

      // 2. GET /api/create-order returns 405 JSON with Allow: POST
      const getOrderRes = await origFetch(`${baseUrl}/api/create-order`);
      assert.equal(getOrderRes.status, 405);
      assert.equal(getOrderRes.headers.get('allow'), 'POST');
      assert.ok(getOrderRes.headers.get('content-type')?.includes('application/json'));

      // 3. Configure keys and create + verify order cleanly
      process.env.RAZORPAY_KEY_ID = 'rzp_test_standalone';
      process.env.RAZORPAY_KEY_SECRET = 'rzp_secret_standalone';

      globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.toString();
        if (url === 'https://api.razorpay.com/v1/orders') {
          const parsed = JSON.parse(String(init?.body || '{}'));
          return new Response(
            JSON.stringify({
              id: mockedOrderId,
              amount: parsed.amount,
              currency: parsed.currency,
              receipt: parsed.receipt
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return origFetch(input, init);
      }) as typeof fetch;

      const malformedRes = await origFetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid-json'
      });
      assert.equal(malformedRes.status, 400);
      assert.ok(malformedRes.headers.get('content-type')?.includes('application/json'));

      const createRes = await origFetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'eservice-booking', amount: 23600, currency: 'INR' })
      });
      assert.equal(createRes.status, 201);
      assert.ok(createRes.headers.get('content-type')?.includes('application/json'));
      const createJson = (await createRes.json()) as Record<string, any>;
      assert.equal(createJson.success, true);
      assert.equal(createJson.orderId, mockedOrderId);
      assert.equal(createJson.amount, 23600);

      const paymentId = `pay_Standalone_${Date.now()}`;
      const sig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${mockedOrderId}|${paymentId}`)
        .digest('hex');

      const verifyRes = await origFetch(`${baseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: createJson.receipt,
          razorpay_order_id: mockedOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: sig
        })
      });
      assert.equal(verifyRes.status, 200);
      assert.ok(verifyRes.headers.get('content-type')?.includes('application/json'));
      const verifyJson = (await verifyRes.json()) as Record<string, any>;
      assert.equal(verifyJson.success, true);
      assert.equal(verifyJson.verified, true);
    } finally {
      globalThis.fetch = origFetch;
      await new Promise<void>((resolve) => server.close(() => resolve()));
      if (prevKeyId === undefined) delete process.env.RAZORPAY_KEY_ID;
      else process.env.RAZORPAY_KEY_ID = prevKeyId;
      if (prevKeySecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
      else process.env.RAZORPAY_KEY_SECRET = prevKeySecret;
    }
  });
});

describe('Razorpay Key Classification, Live-Mode Guard & Secret-Free Health Telemetry', () => {
  it('distinguishes rzp_test_ vs rzp_live_ vs invalid keys and rejects mismatched RAZORPAY_MODE', () => {
    assert.equal(classifyRazorpayKeyId(''), 'missing');
    assert.equal(classifyRazorpayKeyId('rzp_test_AbC12345'), 'test');
    assert.equal(classifyRazorpayKeyId('rzp_live_XyZ98765'), 'live');
    assert.equal(classifyRazorpayKeyId('rzp_test_'), 'invalid');
    assert.equal(classifyRazorpayKeyId('invalid_placeholder_key'), 'invalid');

    // Never activates live mode when RAZORPAY_MODE=live is set with missing keys
    const unconfLive = getRazorpayHealthStatus({ RAZORPAY_MODE: 'live' } as any);
    assert.equal(unconfLive.gatewayConfigured, false);
    assert.equal(unconfLive.canCreateOrder, false);
    assert.equal(unconfLive.mode, 'unconfigured');
    assert.equal(unconfLive.issueCode, 'CREDENTIALS_MISSING');
    assert.equal(unconfLive.status, 'pending_activation');

    // Never activates live mode when RAZORPAY_MODE=live is paired with rzp_test_ key
    const mismatchLive = getRazorpayHealthStatus({
      RAZORPAY_KEY_ID: 'rzp_test_Sample123',
      RAZORPAY_KEY_SECRET: 'secret_sample_123',
      RAZORPAY_MODE: 'live'
    } as any);
    assert.equal(mismatchLive.gatewayConfigured, false);
    assert.equal(mismatchLive.canCreateOrder, false);
    assert.equal(mismatchLive.keyType, 'test');
    assert.equal(mismatchLive.mode, 'unconfigured');
    assert.equal(mismatchLive.modeMatchesKey, false);
    assert.equal(mismatchLive.issueCode, 'MODE_MISMATCH');
    assert.equal(mismatchLive.status, 'misconfigured');

    // Valid test credentials activate strictly in test mode
    const readyTest = getRazorpayConfigStatus({
      RAZORPAY_KEY_ID: 'rzp_test_Sample123',
      RAZORPAY_KEY_SECRET: 'secret_sample_123',
      RAZORPAY_MODE: 'test'
    } as any);
    assert.equal(readyTest.gatewayConfigured, true);
    assert.equal(readyTest.canCreateOrder, true);
    assert.equal(readyTest.mode, 'test');
    assert.equal(readyTest.keyType, 'test');
    assert.equal(readyTest.keyId, 'rzp_test_Sample123');
    assert.equal(readyTest.status, 'ready_test');

    // Valid live credentials activate live mode only when both rzp_live_ key and secret are valid
    const readyLive = getRazorpayConfigStatus({
      RAZORPAY_KEY_ID: 'rzp_live_LiveMerchant123',
      RAZORPAY_KEY_SECRET: 'live_secret_value_123',
      RAZORPAY_MODE: 'live'
    } as any);
    assert.equal(readyLive.gatewayConfigured, true);
    assert.equal(readyLive.canCreateOrder, true);
    assert.equal(readyLive.mode, 'live');
    assert.equal(readyLive.keyType, 'live');
    assert.equal(readyLive.status, 'ready_live');
  });

  it('reconcileGatewayActivation disables checkout if frontend VITE_RAZORPAY_KEY_ID disagrees with backend', () => {
    // Backend unconfigured while stale VITE_RAZORPAY_KEY_ID is set -> must NOT enable checkout
    const pendingState = reconcileGatewayActivation({
      frontendKeyId: 'rzp_test_FrontendOnly123',
      health: { success: true, gatewayConfigured: false, canCreateOrder: false, mode: 'unconfigured', issueCode: 'CREDENTIALS_MISSING', status: 'pending_activation' },
      config: { success: true, gatewayConfigured: false, razorpayKeyId: null, mode: 'unconfigured', status: 'pending_activation' }
    });
    assert.equal(pendingState.canEnableCheckout, false);
    assert.equal(pendingState.publicKeyId, null);
    assert.equal(pendingState.status, 'pending_activation');

    // Frontend has test key while backend has live key -> must block mismatch
    const modeMismatch = reconcileGatewayActivation({
      frontendKeyId: 'rzp_test_Frontend123',
      health: { success: true, gatewayConfigured: true, canCreateOrder: true, mode: 'live', status: 'ready_live' },
      config: { success: true, gatewayConfigured: true, razorpayKeyId: 'rzp_live_Backend999', mode: 'live', status: 'ready_live' }
    });
    assert.equal(modeMismatch.canEnableCheckout, false);
    assert.equal(modeMismatch.issueCode, 'FRONTEND_BACKEND_MODE_MISMATCH');
    assert.equal(modeMismatch.status, 'misconfigured');

    // Synchronized backend & frontend keys -> enables checkout in matching mode
    const syncedTest = reconcileGatewayActivation({
      frontendKeyId: 'rzp_test_Synced1234',
      health: { success: true, gatewayConfigured: true, canCreateOrder: true, mode: 'test', status: 'ready_test' },
      config: { success: true, gatewayConfigured: true, razorpayKeyId: 'rzp_test_Synced1234', mode: 'test', status: 'ready_test' }
    });
    assert.equal(syncedTest.canEnableCheckout, true);
    assert.equal(syncedTest.mode, 'test');
    assert.equal(syncedTest.publicKeyId, 'rzp_test_Synced1234');
    assert.equal(syncedTest.status, 'ready_test');
  });

  it('GET /api/payments/health reports presence and mode with zero credential values on both standalone and Express handlers', async () => {
    const prevKeyId = process.env.RAZORPAY_KEY_ID;
    const prevKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const prevMode = process.env.RAZORPAY_MODE;
    const prevWebhook = process.env.RAZORPAY_WEBHOOK_SECRET;

    const standaloneServer = http.createServer((req, res) => {
      if (req.url?.startsWith('/api/payments/health')) return paymentHealthHandler(req as any, res);
      if (req.url?.startsWith('/api/create-order')) return createOrderHandler(req as any, res);
      res.statusCode = 404;
      res.end();
    });
    const expressServer = http.createServer((req, res) => vercelHandler(req as any, res as any));

    await new Promise<void>((resolve) => standaloneServer.listen(0, '127.0.0.1', () => resolve()));
    await new Promise<void>((resolve) => expressServer.listen(0, '127.0.0.1', () => resolve()));

    const sAddr = standaloneServer.address() as { port: number };
    const eAddr = expressServer.address() as { port: number };
    const sBase = `http://127.0.0.1:${sAddr.port}`;
    const eBase = `http://127.0.0.1:${eAddr.port}`;

    try {
      const secretSample = 'rzp_secret_NEVER_EXPOSE_ME_999';
      const keySample = 'rzp_test_NeverInHealth999';
      const webhookSample = 'whsec_NEVER_EXPOSE_ME_999';
      process.env.RAZORPAY_KEY_ID = keySample;
      process.env.RAZORPAY_KEY_SECRET = secretSample;
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSample;
      process.env.RAZORPAY_MODE = 'test';

      for (const base of [sBase, eBase]) {
        const healthRes = await fetch(`${base}/api/payments/health`);
        assert.equal(healthRes.status, 200);
        const rawText = await healthRes.text();
        assert.equal(rawText.includes(keySample), false);
        assert.equal(rawText.includes(secretSample), false);
        assert.equal(rawText.includes(webhookSample), false);
        const body = JSON.parse(rawText) as Record<string, any>;
        assert.equal(body.gatewayConfigured, true);
        assert.equal(body.canCreateOrder, true);
        assert.equal(body.keyIdPresent, true);
        assert.equal(body.keySecretPresent, true);
        assert.equal(body.webhookSecretPresent, true);
        assert.equal(body.keyType, 'test');
        assert.equal(body.mode, 'test');
        assert.equal('keyId' in body, false);
        assert.equal('razorpayKeyId' in body, false);
        assert.equal('keySecret' in body, false);
      }

      // Mode mismatch returns 503 JSON on POST /api/create-order with structured error code and zero secrets
      process.env.RAZORPAY_MODE = 'live';
      for (const base of [sBase, eBase]) {
        const orderRes = await fetch(`${base}/api/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: 'eservice-booking', amount: 23600, currency: 'INR' })
        });
        assert.equal(orderRes.status, 503);
        const text = await orderRes.text();
        assert.equal(text.includes(secretSample), false);
        const json = JSON.parse(text) as Record<string, any>;
        assert.equal(json.success, false);
        assert.equal(json.code, 'MODE_MISMATCH');
      }
    } finally {
      await new Promise<void>((resolve) => standaloneServer.close(() => resolve()));
      await new Promise<void>((resolve) => expressServer.close(() => resolve()));
      if (prevKeyId === undefined) delete process.env.RAZORPAY_KEY_ID;
      else process.env.RAZORPAY_KEY_ID = prevKeyId;
      if (prevKeySecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
      else process.env.RAZORPAY_KEY_SECRET = prevKeySecret;
      if (prevMode === undefined) delete process.env.RAZORPAY_MODE;
      else process.env.RAZORPAY_MODE = prevMode;
      if (prevWebhook === undefined) delete process.env.RAZORPAY_WEBHOOK_SECRET;
      else process.env.RAZORPAY_WEBHOOK_SECRET = prevWebhook;
    }
  });
});

