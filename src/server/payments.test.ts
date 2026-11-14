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
  computeNextBillingDate,
  paymentManager
} from './payments';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILES_TO_BACKUP = [
  'crm_payments.json',
  'crm_subscriptions.json',
  'webhook_events.json',
  'crm_audit_logs.json'
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
