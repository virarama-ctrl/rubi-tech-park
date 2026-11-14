import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { body?: unknown; method?: string };

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

function verifySignatureTimingSafe(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  try {
    const expectedBuf = Buffer.from(expected, 'utf-8');
    const providedBuf = Buffer.from(signature.trim(), 'utf-8');
    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
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
      // ignore
    }
  }
  return null;
}

function fromFirestoreFields(fields?: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  if (!fields) return out;
  for (const [k, v] of Object.entries(fields)) {
    if (!v || typeof v !== 'object') continue;
    if ('stringValue' in v) out[k] = v.stringValue;
    else if ('integerValue' in v) out[k] = Number(v.integerValue);
    else if ('doubleValue' in v) out[k] = Number(v.doubleValue);
    else if ('booleanValue' in v) out[k] = Boolean(v.booleanValue);
  }
  return out;
}

function toFirestoreValue(val: unknown): Record<string, unknown> {
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  return { stringValue: String(val ?? '') };
}

async function getFirestoreRestSession() {
  const cfg = loadFirebaseConfig();
  if (!cfg?.apiKey || !cfg?.projectId) return null;
  const adminEmail = 'admin@rubitechpark.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure';
  const dbId = cfg.firestoreDatabaseId || '(default)';

  const authRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(cfg.apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword, returnSecureToken: true }),
      signal: AbortSignal.timeout(3500)
    }
  );
  if (!authRes.ok) return null;
  const authData = (await authRes.json()) as { idToken?: string };
  if (!authData.idToken) return null;

  return {
    baseUrl: `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/${encodeURIComponent(dbId)}/documents`,
    idToken: authData.idToken
  };
}

async function queryFirestoreSingleDoc(
  baseUrl: string,
  idToken: string,
  collectionId: string,
  fieldPath: string,
  value: string
): Promise<Record<string, any> | null> {
  const queryUrl = `${baseUrl}:runQuery`;
  const res = await fetch(queryUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: {
          fieldFilter: {
            field: { fieldPath },
            op: 'EQUAL',
            value: { stringValue: value }
          }
        },
        limit: 1
      }
    }),
    signal: AbortSignal.timeout(3500)
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as Array<{ document?: { fields?: Record<string, any> } }>;
  const doc = rows.find((r) => r.document)?.document;
  return doc ? fromFirestoreFields(doc.fields) : null;
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
          message: `Method ${req.method || 'UNKNOWN'} is not allowed on /api/verify-payment. Use HTTP POST with a JSON body.`
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

    const body = parsedBody.data;
    const orderRefInput = typeof body.orderRef === 'string' ? body.orderRef.trim() : undefined;
    const gatewayOrderId = String(body.razorpay_order_id || body.gatewayOrderId || '').trim();
    const gatewayPaymentId = String(body.razorpay_payment_id || body.gatewayPaymentId || '').trim();
    const gatewaySignature = String(body.razorpay_signature || body.gatewaySignature || '').trim();
    const leadIdInput = typeof body.leadId === 'string' ? body.leadId.trim() : undefined;
    const bookingIdInput = typeof body.bookingId === 'string' ? body.bookingId.trim() : undefined;

    if (!gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
      sendJson(res, 400, {
        success: false,
        error: 'Bad Request',
        message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required for backend verification.'
      });
      return;
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keySecret) {
      sendJson(res, 503, {
        success: false,
        error: 'Gateway Not Configured',
        message: 'RAZORPAY_KEY_SECRET is not configured on the server. Signature cannot be verified.'
      });
      return;
    }

    const isValid = verifySignatureTimingSafe(gatewayOrderId, gatewayPaymentId, gatewaySignature, keySecret);
    if (!isValid) {
      sendJson(res, 400, {
        success: false,
        verified: false,
        error: 'Signature Verification Failed',
        message: 'Invalid Razorpay cryptographic payment signature. Verification rejected.'
      });
      return;
    }

    const now = new Date().toISOString();
    let existingOrder: Record<string, any> | null = null;
    let session: { baseUrl: string; idToken: string } | null = null;

    try {
      session = await getFirestoreRestSession();
      if (session) {
        // Check duplicate payment replay across different orders
        const dupOrder = await queryFirestoreSingleDoc(
          session.baseUrl,
          session.idToken,
          'orders',
          'gatewayPaymentId',
          gatewayPaymentId
        );
        if (dupOrder && dupOrder.gatewayOrderId !== gatewayOrderId) {
          sendJson(res, 409, {
            success: false,
            error: 'Duplicate Payment Rejected',
            message: `Payment ID ${gatewayPaymentId} has already been redeemed for order ${dupOrder.orderRef || dupOrder.gatewayOrderId}.`
          });
          return;
        }

        if (orderRefInput) {
          const docRes = await fetch(
            `${session.baseUrl}/orders/${encodeURIComponent(orderRefInput)}`,
            { headers: { Authorization: `Bearer ${session.idToken}` }, signal: AbortSignal.timeout(3500) }
          );
          if (docRes.ok) {
            const docJson = (await docRes.json()) as { fields?: Record<string, any> };
            existingOrder = fromFirestoreFields(docJson.fields);
          }
        }
        if (!existingOrder) {
          existingOrder = await queryFirestoreSingleDoc(
            session.baseUrl,
            session.idToken,
            'orders',
            'gatewayOrderId',
            gatewayOrderId
          );
        }
      }
    } catch {
      // Non-fatal read error; continue safely
    }

    if (existingOrder && existingOrder.status === 'paid' && existingOrder.gatewayPaymentId === gatewayPaymentId) {
      sendJson(res, 200, {
        success: true,
        verified: true,
        alreadyProcessed: true,
        linkedLeadId: existingOrder.leadId || leadIdInput || bookingIdInput || null,
        receiptNumber: existingOrder.receiptNumber,
        payment: existingOrder,
        message: 'Payment signature verified and order settlement confirmed.'
      });
      return;
    }

    const resolvedOrderRef =
      String(existingOrder?.orderRef || orderRefInput || `RTP-ORD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`);
    const receiptNumber =
      String(existingOrder?.receiptNumber || `RTP-REC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`);
    const effectiveLeadId = String(existingOrder?.leadId || existingOrder?.bookingId || leadIdInput || bookingIdInput || '').trim() || undefined;

    const updatedPayment: Record<string, any> = {
      ...(existingOrder || {
        id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        orderRef: resolvedOrderRef,
        customerName: 'RUBI TECH PARK Customer',
        customerEmail: '',
        customerPhone: '',
        serviceId: 'razorpay-checkout',
        serviceTitle: 'RUBI TECH PARK Digital Service',
        orderType: 'one_time',
        currency: 'INR',
        baseAmountINR: 0,
        taxAmountINR: 0,
        totalAmountINR: 0,
        paymentMethod: 'razorpay_checkout',
        refundStatus: 'none',
        gatewayProvider: 'razorpay',
        createdAt: now
      }),
      orderRef: resolvedOrderRef,
      ...(effectiveLeadId ? { leadId: effectiveLeadId } : {}),
      status: 'paid',
      signatureVerified: true,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
      receiptNumber,
      verifiedBy: 'Razorpay Cryptographic Signature Verification',
      verifiedAt: now,
      updatedAt: now
    };

    if (session) {
      try {
        const orderFields: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(updatedPayment)) {
          if (v !== undefined && v !== null) orderFields[k] = toFirestoreValue(v);
        }
        await fetch(`${session.baseUrl}/orders/${encodeURIComponent(resolvedOrderRef)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.idToken}`
          },
          body: JSON.stringify({ fields: orderFields }),
          signal: AbortSignal.timeout(3500)
        });

        if (effectiveLeadId) {
          const leadDocRes = await fetch(`${session.baseUrl}/crm_leads/${encodeURIComponent(effectiveLeadId)}`, {
            headers: { Authorization: `Bearer ${session.idToken}` },
            signal: AbortSignal.timeout(3500)
          });
          if (leadDocRes.ok) {
            const leadPatchFields = {
              paymentStatus: toFirestoreValue('Verified Paid'),
              status: toFirestoreValue('Booking Confirmed'),
              linkedOrderRef: toFirestoreValue(resolvedOrderRef),
              gatewayPaymentId: toFirestoreValue(gatewayPaymentId),
              receiptNumber: toFirestoreValue(receiptNumber),
              paidAt: toFirestoreValue(now),
              updatedAt: toFirestoreValue(now)
            };
            const updateMask = Object.keys(leadPatchFields)
              .map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
              .join('&');
            await fetch(
              `${session.baseUrl}/crm_leads/${encodeURIComponent(effectiveLeadId)}?${updateMask}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.idToken}`
                },
                body: JSON.stringify({ fields: leadPatchFields }),
                signal: AbortSignal.timeout(3500)
              }
            );
          }
        }
      } catch {
        // Non-blocking Firestore persistence fallback
      }
    }

    sendJson(res, 200, {
      success: true,
      verified: true,
      alreadyProcessed: false,
      linkedLeadId: effectiveLeadId || null,
      receiptNumber,
      payment: updatedPayment,
      message: 'Payment signature verified and order settlement confirmed.'
    });
  } catch (err: any) {
    console.error('Unhandled /api/verify-payment error:', err?.message || err);
    sendJson(res, 500, {
      success: false,
      error: 'Verification Error',
      message: err?.message || 'Unable to verify Razorpay payment signature.'
    });
  }
}
