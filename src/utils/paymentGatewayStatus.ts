export type GatewayKeyType = 'test' | 'live' | 'invalid' | 'missing';
export type GatewayEffectiveMode = 'test' | 'live' | 'unconfigured';
export type GatewayActivationStatus =
  | 'ready_test'
  | 'ready_live'
  | 'pending_activation'
  | 'misconfigured';

export interface BackendHealthPayload {
  success?: boolean;
  gatewayConfigured?: boolean;
  canCreateOrder?: boolean;
  keyIdPresent?: boolean;
  keySecretPresent?: boolean;
  keyType?: GatewayKeyType;
  mode?: GatewayEffectiveMode;
  modeMatchesKey?: boolean;
  issueCode?: string | null;
  status?: GatewayActivationStatus;
  message?: string;
}

export interface BackendConfigPayload {
  success?: boolean;
  gatewayConfigured?: boolean;
  canCreateOrder?: boolean;
  mode?: GatewayEffectiveMode;
  keyType?: GatewayKeyType;
  modeMatchesKey?: boolean;
  issueCode?: string | null;
  status?: GatewayActivationStatus;
  message?: string;
  razorpayKeyId?: string | null;
  businessUpiId?: string;
}

export interface ReconciledGatewayState {
  canEnableCheckout: boolean;
  mode: GatewayEffectiveMode;
  publicKeyId: string | null;
  status: GatewayActivationStatus;
  issueCode: string | null;
  diagnosticMessage: string;
}

export function classifyPublicRazorpayKey(keyIdRaw: string | undefined | null): GatewayKeyType {
  const keyId = (keyIdRaw || '').trim();
  if (!keyId) return 'missing';
  if (/^rzp_test_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'test';
  if (/^rzp_live_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'live';
  return 'invalid';
}

export function reconcileGatewayActivation(params: {
  frontendKeyId?: string | null;
  health?: BackendHealthPayload | null;
  config?: BackendConfigPayload | null;
}): ReconciledGatewayState {
  const frontendKeyId = (params.frontendKeyId || '').trim();
  const frontendKeyType = classifyPublicRazorpayKey(frontendKeyId);
  const health = params.health;
  const config = params.config;

  if (!health?.success || !config?.success) {
    return {
      canEnableCheckout: false,
      mode: 'unconfigured',
      publicKeyId: null,
      status: 'pending_activation',
      issueCode: 'HEALTH_CHECK_UNAVAILABLE',
      diagnosticMessage:
        'Unable to confirm backend Razorpay readiness right now. Please complete payment via Business UPI QR below.'
    };
  }

  if (!health.canCreateOrder || !config.gatewayConfigured || !config.razorpayKeyId) {
    return {
      canEnableCheckout: false,
      mode: 'unconfigured',
      publicKeyId: null,
      status:
        health.status === 'misconfigured' || config.status === 'misconfigured'
          ? 'misconfigured'
          : 'pending_activation',
      issueCode: health.issueCode || config.issueCode || 'CREDENTIALS_MISSING',
      diagnosticMessage:
        health.message ||
        config.message ||
        'Razorpay server credentials are not yet active on the backend.'
    };
  }

  const backendKeyId = config.razorpayKeyId.trim();
  const backendKeyType = classifyPublicRazorpayKey(backendKeyId);
  const backendMode = health.mode;

  if ((backendMode !== 'test' && backendMode !== 'live') || backendKeyType !== backendMode) {
    return {
      canEnableCheckout: false,
      mode: 'unconfigured',
      publicKeyId: null,
      status: 'misconfigured',
      issueCode: 'BACKEND_KEY_MODE_CONFLICT',
      diagnosticMessage:
        'Backend Razorpay key type and configured mode do not match. Checkout is disabled until corrected on the server.'
    };
  }

  if (frontendKeyId) {
    if (frontendKeyType === 'invalid') {
      return {
        canEnableCheckout: false,
        mode: 'unconfigured',
        publicKeyId: null,
        status: 'misconfigured',
        issueCode: 'FRONTEND_KEY_INVALID',
        diagnosticMessage:
          'Frontend VITE_RAZORPAY_KEY_ID is invalid. Ensure both frontend and backend use matching Razorpay key IDs.'
      };
    }

    if (frontendKeyType !== backendMode) {
      return {
        canEnableCheckout: false,
        mode: 'unconfigured',
        publicKeyId: null,
        status: 'misconfigured',
        issueCode: 'FRONTEND_BACKEND_MODE_MISMATCH',
        diagnosticMessage: `Frontend VITE_RAZORPAY_KEY_ID is configured for ${frontendKeyType} mode while backend is configured for ${backendMode} mode. Both must match before Razorpay Checkout can open.`
      };
    }

    if (frontendKeyId !== backendKeyId) {
      return {
        canEnableCheckout: false,
        mode: 'unconfigured',
        publicKeyId: null,
        status: 'misconfigured',
        issueCode: 'FRONTEND_BACKEND_KEY_MISMATCH',
        diagnosticMessage:
          'Frontend VITE_RAZORPAY_KEY_ID does not match the backend RAZORPAY_KEY_ID merchant account. Synchronize both variables before enabling Razorpay Checkout.'
      };
    }
  }

  return {
    canEnableCheckout: true,
    mode: backendMode,
    publicKeyId: backendKeyId,
    status: backendMode === 'live' ? 'ready_live' : 'ready_test',
    issueCode: null,
    diagnosticMessage:
      health.message ||
      (backendMode === 'live'
        ? 'Razorpay Live Gateway is configured and ready.'
        : 'Razorpay Test Gateway (Sandbox) is configured and ready.')
  };
}
