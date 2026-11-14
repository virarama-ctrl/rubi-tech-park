import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { body?: unknown; method?: string };

const TRUSTED_CATALOG: Record<string, { name: string; basePrice: number }> = {
  'starter-web': { name: 'Business Website Development', basePrice: 5000 },
  'growth-ecommerce': { name: 'E-commerce Storefront', basePrice: 15000 },
  'custom-software': { name: 'Custom CRM System', basePrice: 20000 },
  'integrated-solution': { name: 'Website + CRM Suite', basePrice: 30000 },
  'ai-automation-package': { name: 'AI and Workflow Automation', basePrice: 25000 },
  'booking-deposit': { name: 'Project Booking Advance Token', basePrice: 2500 },
  'eservice-booking': { name: 'Citizen E-Service Initial Booking Deposit', basePrice: 200 }
};

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>, extraHeaders?: Record<string, string>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.setHeader(k, v);
    }
  }
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: Req): Promise<{ ok: true; data: Record<string, any> } | { ok: false; message: string }> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      if (!req.body.trim()) return { ok: true, data: {} };
      try {
        const parsed = JSON.parse(req.body);
        return typeof parsed === 'object' && parsed !== null
          ? { ok: true, data: parsed as Record<string, any> }
          : { ok: false, message: 'Request JSON body must be an object.' };
      } catch {
        return { ok: false, message: 'Malformed JSON in request body.' };
      }
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return { ok: true, data: req.body as Record<string, any> };
    }
    return { ok: false, message: 'Request body must be a JSON object.' };
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    if (chunks.reduce((sum, b) => sum + b.length, 0) > 1024 * 1024) {
      return { ok: false, message: 'Request payload exceeds 1MB limit.' };
    }
  }
  const raw = Buffer.concat(chunks).toString('utf-8').trim();
  if (!raw) return { ok: true, data: {} };
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null
      ? { ok: true, data: parsed as Record<string, any> }
      : { ok: false, message: 'Request JSON body must be an object.' };
  } catch {
    return { ok: false, message: 'Malformed JSON in request body.' };
  }
}

function loadFirebaseConfig(): { apiKey?: string; projectId?: string; firestoreDatabaseId?: string } | null {
  const candidates = [
    path.resolve(process.cwd(), 'firebase-applet-config.json'),
    ...(typeof import.meta.dirname === 'string'
      ? [path.resolve(import.meta.dirname, '../firebase-applet-config.json')]
      : [])
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      }
    } catch {
      // Try next candidate
    }
  }
  return null;
}

function toFirestoreValue(val: unknown): Record<string, unknown> {
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  return { stringValue: String(val ?? '') };
}

async function persistOrderToFirestoreBestEffort(order: Record<string, unknown>): Promise<void> {
  const cfg = loadFirebaseConfig();
  if (!cfg?.apiKey || !cfg?.projectId) return;

  const adminEmail = 'admin@rubitechpark.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure';
  const dbId = cfg.firestoreDatabaseId || '(default)';

  try {
    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(cfg.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword, returnSecureToken: true }),
        signal: AbortSignal.timeout(3500)
      }
    );
    if (!authRes.ok) return;
    const authData = (await authRes.json()) as { idToken?: string };
    if (!authData.idToken) return;

    const fields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(order)) {
      if (value !== undefined && value !== null) {
        fields[key] = toFirestoreValue(value);
      }
    }

    const orderRef = encodeURIComponent(String(order.orderRef));
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/${encodeURIComponent(dbId)}/documents/orders/${orderRef}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.idToken}`
      },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(3500)
    });
  } catch {
    // Non-blocking persistence fallback
  }
}

export default async function handler(req: Req, res: ServerResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Allow', 'POST, OPTIONS');
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      sendJson(
        res,
        405,
        {
          success: false,
          error: 'Method Not Allowed',
          message: `Method ${req.method || 'UNKNOWN'} is not allowed on /api/create-order. Use HTTP POST with a JSON body.`
        },
        { Allow: 'POST' }
      );
      return;
    }

    const parsedBody = await readJsonBody(req);
    if (!parsedBody.ok) {
      sendJson(res, 400, {
        success: false,
        error: 'Invalid JSON Payload',
        message: parsedBody.message
      });
      return;
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keyId || !keySecret) {
      sendJson(res, 503, {
        success: false,
        error: 'Gateway Not Configured',
        message: 'Razorpay server credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not configured.'
      });
      return;
    }

    const body = parsedBody.data;
    const planId = typeof body.planId === 'string' && body.planId.trim() ? body.planId.trim() : undefined;
    const rawCurrency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : 'INR';

    if (rawCurrency !== 'INR') {
      sendJson(res, 400, {
        success: false,
        error: 'Validation Failed',
        message: 'Only INR currency is supported for RUBI TECH PARK orders.'
      });
      return;
    }

    let baseAmountINR = 0;
    let taxAmountINR = 0;
    let totalAmountINR = 0;
    let amountPaise = 0;
    let serviceId = planId || 'custom-order';
    let serviceTitle = 'RUBI TECH PARK Digital Service';

    if (planId && TRUSTED_CATALOG[planId]) {
      const item = TRUSTED_CATALOG[planId];
      baseAmountINR = item.basePrice;
      taxAmountINR = Math.round(baseAmountINR * 0.18);
      totalAmountINR = baseAmountINR + taxAmountINR;
      amountPaise = Math.round(totalAmountINR * 100);
      serviceId = planId;
      serviceTitle = item.name;
    } else {
      const rawAmount = Number(body.amount);
      if (!Number.isFinite(rawAmount) || !Number.isInteger(rawAmount) || rawAmount < 100) {
        sendJson(res, 400, {
          success: false,
          error: 'Validation Failed',
          message: 'amount must be an integer of at least 100 paise (₹1.00).'
        });
        return;
      }
      amountPaise = rawAmount;
      totalAmountINR = Number((amountPaise / 100).toFixed(2));
      baseAmountINR = Number((totalAmountINR / 1.18).toFixed(2));
      taxAmountINR = Number((totalAmountINR - baseAmountINR).toFixed(2));
    }

    const year = new Date().getFullYear();
    const generatedReceipt = `RTP-ORD-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const rawReceipt = body.receipt !== undefined ? String(body.receipt).trim() : generatedReceipt;
    if (!rawReceipt || rawReceipt.length > 40) {
      sendJson(res, 400, {
        success: false,
        error: 'Validation Failed',
        message: 'receipt must be between 1 and 40 characters.'
      });
      return;
    }

    const leadId = typeof body.leadId === 'string' && body.leadId.trim() ? body.leadId.trim().slice(0, 80) : undefined;
    const bookingId =
      typeof body.bookingId === 'string' && body.bookingId.trim() ? body.bookingId.trim().slice(0, 80) : undefined;
    const customerName =
      typeof body.customerName === 'string' && body.customerName.trim()
        ? body.customerName.trim().slice(0, 120)
        : 'RUBI TECH PARK Customer';
    const customerEmail =
      typeof body.customerEmail === 'string' ? body.customerEmail.trim().toLowerCase().slice(0, 120) : '';
    const customerPhone =
      typeof body.customerPhone === 'string' ? body.customerPhone.replace(/\s+/g, '').slice(0, 20) : '';
    const customerBusiness =
      typeof body.customerBusiness === 'string' && body.customerBusiness.trim()
        ? body.customerBusiness.trim().slice(0, 140)
        : undefined;

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: rawReceipt,
        notes: {
          orderRef: rawReceipt,
          serviceId,
          ...(leadId ? { leadId } : {}),
          ...(bookingId ? { bookingId } : {})
        }
      }),
      signal: AbortSignal.timeout(12000)
    });

    const rzpText = await rzpRes.text();
    let rzpData: Record<string, any> = {};
    try {
      rzpData = rzpText ? JSON.parse(rzpText) : {};
    } catch {
      rzpData = {};
    }

    if (!rzpRes.ok || typeof rzpData.id !== 'string' || !rzpData.id.startsWith('order_')) {
      const upstreamMsg =
        rzpData?.error?.description ||
        rzpData?.message ||
        `Razorpay Orders API returned HTTP ${rzpRes.status}.`;
      sendJson(res, rzpRes.status >= 400 && rzpRes.status < 500 ? 400 : 502, {
        success: false,
        error: 'Razorpay Order Creation Failed',
        message: upstreamMsg
      });
      return;
    }

    const modeRaw = (process.env.RAZORPAY_MODE || '').trim().toLowerCase();
    const isLive = modeRaw === 'live' || keyId.startsWith('rzp_live_');
    const now = new Date().toISOString();

    const orderRecord = {
      id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      orderRef: rawReceipt,
      leadId: leadId || bookingId,
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      customerBusiness,
      serviceId,
      serviceTitle,
      orderType: 'one_time',
      currency: 'INR',
      amountPaise,
      baseAmountINR,
      taxAmountINR,
      totalAmountINR,
      paymentMethod: typeof body.paymentMethod === 'string' ? body.paymentMethod : 'razorpay_checkout',
      status: 'created',
      signatureVerified: false,
      refundStatus: 'none',
      gatewayProvider: 'razorpay',
      gatewayMode: isLive ? 'razorpay_live' : 'razorpay_test',
      gatewayOrderId: rzpData.id,
      createdAt: now,
      updatedAt: now
    };

    await persistOrderToFirestoreBestEffort(orderRecord);

    sendJson(res, 201, {
      success: true,
      id: rzpData.id,
      orderId: rzpData.id,
      amount: Number(rzpData.amount ?? amountPaise),
      currency: String(rzpData.currency || 'INR'),
      receipt: rawReceipt,
      order: orderRecord
    });
  } catch (err: any) {
    console.error('Unhandled /api/create-order error:', err?.message || err);
    sendJson(res, 500, {
      success: false,
      error: 'Order Creation Failed',
      message: err?.message || 'Unable to create Razorpay order.'
    });
  }
}
