import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { method?: string };
type RazorpayKeyType = 'test' | 'live' | 'invalid' | 'missing';
type RazorpayEffectiveMode = 'test' | 'live' | 'unconfigured';

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

function classifyRazorpayKeyId(keyIdRaw: string | undefined): RazorpayKeyType {
  const keyId = (keyIdRaw || '').trim();
  if (!keyId) return 'missing';
  if (/^rzp_test_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'test';
  if (/^rzp_live_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'live';
  return 'invalid';
}

function evaluateHealth(env: NodeJS.ProcessEnv = process.env) {
  const keyId = (env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  const modeRaw = (env.RAZORPAY_MODE || '').trim().toLowerCase();

  const keyType = classifyRazorpayKeyId(keyId);
  const keyIdPresent = Boolean(keyId);
  const keySecretPresent = Boolean(keySecret);
  const keySecretValid = /^\S{6,}$/.test(keySecret);
  const webhookSecretPresent = Boolean(webhookSecret);
  const configuredModeEnv: 'test' | 'live' | 'invalid' | null = !modeRaw
    ? null
    : modeRaw === 'test' || modeRaw === 'live'
    ? modeRaw
    : 'invalid';

  if (!keyIdPresent && !keySecretPresent) {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: false,
      keySecretPresent: false,
      webhookSecretPresent,
      keyType: 'missing' as RazorpayKeyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey: configuredModeEnv !== 'invalid',
      issueCode: 'CREDENTIALS_MISSING',
      status: 'pending_activation',
      message: 'Razorpay server credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured.'
    };
  }

  if (!keyIdPresent) {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: false,
      keySecretPresent: true,
      webhookSecretPresent,
      keyType: 'missing' as RazorpayKeyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey: configuredModeEnv !== 'invalid',
      issueCode: 'KEY_ID_MISSING',
      status: 'misconfigured',
      message: 'RAZORPAY_KEY_ID is missing on the server.'
    };
  }

  if (!keySecretPresent) {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: true,
      keySecretPresent: false,
      webhookSecretPresent,
      keyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey:
        configuredModeEnv === null ||
        ((keyType === 'test' || keyType === 'live') && configuredModeEnv === keyType),
      issueCode: 'KEY_SECRET_MISSING',
      status: 'misconfigured',
      message: 'RAZORPAY_KEY_SECRET is missing on the server.'
    };
  }

  if (keyType === 'invalid') {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: true,
      keySecretPresent: true,
      webhookSecretPresent,
      keyType: 'invalid' as RazorpayKeyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey: false,
      issueCode: 'INVALID_KEY_ID_FORMAT',
      status: 'misconfigured',
      message: 'RAZORPAY_KEY_ID must start with rzp_test_ or rzp_live_ and contain valid key characters.'
    };
  }

  if (!keySecretValid) {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: true,
      keySecretPresent: true,
      webhookSecretPresent,
      keyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey: configuredModeEnv === null || configuredModeEnv === keyType,
      issueCode: 'INVALID_KEY_SECRET_FORMAT',
      status: 'misconfigured',
      message: 'RAZORPAY_KEY_SECRET format is invalid on the server.'
    };
  }

  if (configuredModeEnv === 'invalid') {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: true,
      keySecretPresent: true,
      webhookSecretPresent,
      keyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv: 'invalid' as const,
      modeMatchesKey: false,
      issueCode: 'INVALID_MODE_ENV',
      status: 'misconfigured',
      message: 'RAZORPAY_MODE must be either "test" or "live" when specified.'
    };
  }

  if (configuredModeEnv && configuredModeEnv !== keyType) {
    return {
      gatewayConfigured: false,
      canCreateOrder: false,
      keyIdPresent: true,
      keySecretPresent: true,
      webhookSecretPresent,
      keyType,
      mode: 'unconfigured' as RazorpayEffectiveMode,
      configuredModeEnv,
      modeMatchesKey: false,
      issueCode: 'MODE_MISMATCH',
      status: 'misconfigured',
      message:
        configuredModeEnv === 'live'
          ? 'RAZORPAY_MODE is set to "live", but RAZORPAY_KEY_ID is a test key (rzp_test_). Configure valid live credentials or set RAZORPAY_MODE="test".'
          : 'RAZORPAY_MODE is set to "test", but RAZORPAY_KEY_ID is a live key (rzp_live_). Update RAZORPAY_MODE to "live" or configure test keys.'
    };
  }

  const effectiveMode: 'test' | 'live' = keyType === 'live' ? 'live' : 'test';
  return {
    gatewayConfigured: true,
    canCreateOrder: true,
    keyIdPresent: true,
    keySecretPresent: true,
    webhookSecretPresent,
    keyType,
    mode: effectiveMode as RazorpayEffectiveMode,
    configuredModeEnv,
    modeMatchesKey: true,
    issueCode: null,
    status: effectiveMode === 'live' ? 'ready_live' : 'ready_test',
    message:
      effectiveMode === 'live'
        ? 'Razorpay Live Gateway is configured and ready for checkout order creation.'
        : 'Razorpay Test Gateway (Sandbox) is configured and ready for checkout order creation.'
  };
}

/**
 * Secret-free backend health & configuration check.
 * Reports ONLY whether credentials are present and whether the configured mode is test or live.
 * NEVER returns credential values.
 */
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
          message: `Method ${req.method || 'UNKNOWN'} is not allowed on /api/payments/health. Use HTTP GET.`
        },
        { Allow: 'GET' }
      );
      return;
    }

    const health = evaluateHealth();
    sendJson(res, 200, {
      success: true,
      ...health
    });
  } catch (err: any) {
    sendJson(res, 500, {
      success: false,
      error: 'Health Check Error',
      message: err?.message || 'Unable to inspect payment gateway health.'
    });
  }
}
