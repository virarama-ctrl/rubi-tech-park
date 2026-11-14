import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateGstBreakdown,
  calculateSubscriptionBreakdown,
  TRUSTED_PRICING_CATALOG,
  SUBSCRIPTION_CATALOG
} from '../config/pricingCatalog';
import { CASE_STUDIES } from '../config/agencyConfig';
import {
  verifyRazorpayOrderSignature,
  verifyRazorpaySubscriptionSignature,
  verifyRazorpayWebhookSignature,
  validateCreateOrderInput,
  computeNextBillingDate,
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
