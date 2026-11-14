import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { method?: string };

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

export default function handler(req: Req, res: ServerResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Allow', 'GET, OPTIONS');
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      sendJson(
        res,
        405,
        {
          success: false,
          error: 'Method Not Allowed',
          message: `Method ${req.method || 'UNKNOWN'} is not allowed on /api/payments/config. Use HTTP GET.`
        },
        { Allow: 'GET' }
      );
      return;
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    const modeRaw = (process.env.RAZORPAY_MODE || '').trim().toLowerCase();
    const mode: 'test' | 'live' =
      modeRaw === 'live' || keyId.startsWith('rzp_live_') ? 'live' : 'test';
    const gatewayConfigured = Boolean(keyId && keySecret);

    sendJson(res, 200, {
      success: true,
      gatewayConfigured,
      mode,
      razorpayKeyId: gatewayConfigured ? keyId : null,
      businessUpiId: 'rubienterprisesgst-1@okhdfcbank',
      businessName: 'RUBI TECH PARK'
    });
  } catch (err: any) {
    sendJson(res, 500, {
      success: false,
      error: 'Config Error',
      message: err?.message || 'Unable to load payment gateway status.'
    });
  }
}
