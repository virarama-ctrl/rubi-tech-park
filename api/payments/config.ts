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

function classifyRazorpayKeyId(keyIdRaw: string | undefined): 'test' | 'live' | 'invalid' | 'missing' {
  const keyId = (keyIdRaw || '').trim();
  if (!keyId) return 'missing';
  if (/^rzp_test_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'test';
  if (/^rzp_live_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'live';
  return 'invalid';
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
    const keyType = classifyRazorpayKeyId(keyId);
    const configuredModeEnv = !modeRaw
      ? null
      : modeRaw === 'test' || modeRaw === 'live'
      ? modeRaw
      : 'invalid';

    let gatewayConfigured = false;
    let mode: 'test' | 'live' | 'unconfigured' = 'unconfigured';
    let modeMatchesKey = configuredModeEnv !== 'invalid';
    let issueCode: string | null = null;
    let status: 'ready_test' | 'ready_live' | 'pending_activation' | 'misconfigured' = 'pending_activation';
    let message = 'Razorpay server credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured.';

    if (!keyId && !keySecret) {
      issueCode = 'CREDENTIALS_MISSING';
    } else if (!keyId) {
      issueCode = 'KEY_ID_MISSING';
      status = 'misconfigured';
      message = 'RAZORPAY_KEY_ID is missing on the server.';
    } else if (!keySecret) {
      issueCode = 'KEY_SECRET_MISSING';
      status = 'misconfigured';
      modeMatchesKey = configuredModeEnv === null || ((keyType === 'test' || keyType === 'live') && configuredModeEnv === keyType);
      message = 'RAZORPAY_KEY_SECRET is missing on the server.';
    } else if (keyType === 'invalid') {
      issueCode = 'INVALID_KEY_ID_FORMAT';
      status = 'misconfigured';
      modeMatchesKey = false;
      message = 'RAZORPAY_KEY_ID must start with rzp_test_ or rzp_live_ and contain valid key characters.';
    } else if (!/^\S{6,}$/.test(keySecret)) {
      issueCode = 'INVALID_KEY_SECRET_FORMAT';
      status = 'misconfigured';
      message = 'RAZORPAY_KEY_SECRET format is invalid on the server.';
    } else if (configuredModeEnv === 'invalid') {
      issueCode = 'INVALID_MODE_ENV';
      status = 'misconfigured';
      modeMatchesKey = false;
      message = 'RAZORPAY_MODE must be either "test" or "live" when specified.';
    } else if (configuredModeEnv && configuredModeEnv !== keyType) {
      issueCode = 'MODE_MISMATCH';
      status = 'misconfigured';
      modeMatchesKey = false;
      message =
        configuredModeEnv === 'live'
          ? 'RAZORPAY_MODE is set to "live", but RAZORPAY_KEY_ID is a test key (rzp_test_). Configure valid live credentials or set RAZORPAY_MODE="test".'
          : 'RAZORPAY_MODE is set to "test", but RAZORPAY_KEY_ID is a live key (rzp_live_). Update RAZORPAY_MODE to "live" or configure test keys.';
    } else {
      gatewayConfigured = true;
      mode = keyType === 'live' ? 'live' : 'test';
      modeMatchesKey = true;
      status = mode === 'live' ? 'ready_live' : 'ready_test';
      message =
        mode === 'live'
          ? 'Razorpay Live Gateway is configured and ready for checkout order creation.'
          : 'Razorpay Test Gateway (Sandbox) is configured and ready for checkout order creation.';
    }

    sendJson(res, 200, {
      success: true,
      gatewayConfigured,
      canCreateOrder: gatewayConfigured,
      mode,
      keyType,
      modeMatchesKey,
      issueCode,
      status,
      message,
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
