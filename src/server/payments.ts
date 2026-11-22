import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  PaymentRecord,
  PaymentStatus,
  PaymentMethodType,
  RefundStatus,
  BillingCycle,
  CustomerSubscription,
  SubscriptionStatus,
  WebhookEventRecord
} from '../types/crm';
import { crmStorage } from './storage';
import { firebaseCRM } from './firebaseService';
import {
  BUSINESS_UPI_ID,
  BUSINESS_NAME,
  TRUSTED_PRICING_CATALOG,
  SUBSCRIPTION_CATALOG,
  ServicePricingItem,
  SubscriptionPlanOption,
  calculateGstBreakdown,
  calculateSubscriptionBreakdown
} from '../config/pricingCatalog';

export {
  BUSINESS_UPI_ID,
  BUSINESS_NAME,
  TRUSTED_PRICING_CATALOG,
  SUBSCRIPTION_CATALOG,
  calculateGstBreakdown,
  calculateSubscriptionBreakdown
};
export type { ServicePricingItem, SubscriptionPlanOption };

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'rubi-crm-data')
  : path.resolve(process.cwd(), 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'crm_payments.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'crm_subscriptions.json');
const WEBHOOK_EVENTS_FILE = path.join(DATA_DIR, 'webhook_events.json');

// -------------------------------------------------------------
// Pure Cryptographic & Date Helpers (Unit-Testable)
// -------------------------------------------------------------

function safeCompareHex(expectedHex: string, providedHex: string): boolean {
  if (!expectedHex || !providedHex) return false;
  const normalizedExpected = expectedHex.trim().toLowerCase();
  const normalizedProvided = providedHex.trim().toLowerCase();
  if (normalizedExpected.length !== normalizedProvided.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(normalizedExpected, 'utf8'),
      Buffer.from(normalizedProvided, 'utf8')
    );
  } catch {
    return false;
  }
}

export function verifyRazorpayOrderSignature(
  gatewayOrderId: string,
  gatewayPaymentId: string,
  gatewaySignature: string,
  secret: string
): boolean {
  if (!gatewayOrderId || !gatewayPaymentId || !gatewaySignature || !secret) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${gatewayOrderId}|${gatewayPaymentId}`)
    .digest('hex');
  return safeCompareHex(expected, gatewaySignature);
}

export function verifyRazorpaySubscriptionSignature(
  gatewayPaymentId: string,
  gatewaySubscriptionId: string,
  gatewaySignature: string,
  secret: string
): boolean {
  if (!gatewayPaymentId || !gatewaySubscriptionId || !gatewaySignature || !secret) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${gatewayPaymentId}|${gatewaySubscriptionId}`)
    .digest('hex');
  return safeCompareHex(expected, gatewaySignature);
}

export function verifyRazorpayWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string | undefined,
  webhookSecret: string | undefined
): boolean {
  if (!rawBody || !signatureHeader || !webhookSecret) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  return safeCompareHex(expected, signatureHeader);
}

export function computeNextBillingDate(fromIso: string, billingCycle: BillingCycle): string {
  const baseDate = new Date(fromIso);
  if (Number.isNaN(baseDate.getTime())) {
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
    return fallback.toISOString();
  }
  const next = new Date(baseDate.getTime());
  if (billingCycle === 'yearly') {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString();
}

export interface CreateOrderValidationResult {
  valid: boolean;
  amountPaise?: number;
  currency?: 'INR';
  receipt?: string;
  error?: string;
}

export function validateCreateOrderInput(input: {
  amount?: unknown;
  currency?: unknown;
  receipt?: unknown;
}): CreateOrderValidationResult {
  const rawCurrency =
    input.currency === undefined || input.currency === null || String(input.currency).trim() === ''
      ? 'INR'
      : String(input.currency).trim().toUpperCase();

  if (rawCurrency !== 'INR') {
    return {
      valid: false,
      error: `Unsupported currency "${rawCurrency}". Only INR is supported.`
    };
  }

  const parsedAmount = Number(input.amount);
  if (!Number.isFinite(parsedAmount) || !Number.isInteger(parsedAmount) || parsedAmount < 100) {
    return {
      valid: false,
      error: 'Amount must be an integer in paise of at least 100 paise (₹1.00).'
    };
  }

  if (parsedAmount > 500000000) {
    return {
      valid: false,
      error: 'Amount exceeds maximum single transaction limit.'
    };
  }

  let normalizedReceipt: string | undefined;
  if (input.receipt !== undefined && input.receipt !== null) {
    const trimmed = String(input.receipt).trim();
    if (!trimmed) {
      return {
        valid: false,
        error: 'Receipt cannot be blank when explicitly provided.'
      };
    }
    if (trimmed.length > 40) {
      return {
        valid: false,
        error: 'Receipt identifier must be 40 characters or fewer (Razorpay limit).'
      };
    }
    if (!/^[a-zA-Z0-9_.-]{1,40}$/.test(trimmed)) {
      return {
        valid: false,
        error: 'Receipt may only contain letters, numbers, underscores, hyphens, and periods.'
      };
    }
    normalizedReceipt = trimmed;
  }

  return {
    valid: true,
    amountPaise: parsedAmount,
    currency: 'INR',
    receipt: normalizedReceipt
  };
}

export type RazorpayKeyType = 'test' | 'live' | 'invalid' | 'missing';
export type RazorpayEffectiveMode = 'test' | 'live' | 'unconfigured';
export type RazorpayIssueCode =
  | 'CREDENTIALS_MISSING'
  | 'KEY_ID_MISSING'
  | 'KEY_SECRET_MISSING'
  | 'INVALID_KEY_ID_FORMAT'
  | 'INVALID_KEY_SECRET_FORMAT'
  | 'MODE_MISMATCH'
  | 'INVALID_MODE_ENV';

export interface RazorpayHealthStatus {
  gatewayConfigured: boolean;
  canCreateOrder: boolean;
  keyIdPresent: boolean;
  keySecretPresent: boolean;
  webhookSecretPresent: boolean;
  keyType: RazorpayKeyType;
  mode: RazorpayEffectiveMode;
  configuredModeEnv: 'test' | 'live' | 'invalid' | null;
  modeMatchesKey: boolean;
  issueCode: RazorpayIssueCode | null;
  status: 'ready_test' | 'ready_live' | 'pending_activation' | 'misconfigured';
  message: string;
}

export function classifyRazorpayKeyId(keyIdRaw: string | undefined): RazorpayKeyType {
  const keyId = (keyIdRaw || '').trim();
  if (!keyId) return 'missing';
  if (/^rzp_test_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'test';
  if (/^rzp_live_[A-Za-z0-9_]{4,}$/.test(keyId)) return 'live';
  return 'invalid';
}

export function getRazorpayHealthStatus(env: NodeJS.ProcessEnv = process.env): RazorpayHealthStatus {
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
      keyType: 'missing',
      mode: 'unconfigured',
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
      keyType: 'missing',
      mode: 'unconfigured',
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
      mode: 'unconfigured',
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
      keyType: 'invalid',
      mode: 'unconfigured',
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
      mode: 'unconfigured',
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
      mode: 'unconfigured',
      configuredModeEnv: 'invalid',
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
      mode: 'unconfigured',
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
    mode: effectiveMode,
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

export function getRazorpayConfigStatus(env: NodeJS.ProcessEnv = process.env): {
  gatewayConfigured: boolean;
  canCreateOrder: boolean;
  mode: RazorpayEffectiveMode;
  keyType: RazorpayKeyType;
  keyId: string | null;
  webhookSecretConfigured: boolean;
  modeMatchesKey: boolean;
  issueCode: RazorpayIssueCode | null;
  status: RazorpayHealthStatus['status'];
  message: string;
} {
  const health = getRazorpayHealthStatus(env);
  const keyId = (env.RAZORPAY_KEY_ID || '').trim();

  return {
    gatewayConfigured: health.gatewayConfigured,
    canCreateOrder: health.canCreateOrder,
    mode: health.mode,
    keyType: health.keyType,
    keyId: health.gatewayConfigured ? keyId : null,
    webhookSecretConfigured: health.webhookSecretPresent,
    modeMatchesKey: health.modeMatchesKey,
    issueCode: health.issueCode,
    status: health.status,
    message: health.message
  };
}

// -------------------------------------------------------------
// Atomic JSON Storage Helpers
// -------------------------------------------------------------

function ensureJsonFile(filePath: string) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

function atomicWriteJson<T>(filePath: string, data: T[]): void {
  ensureJsonFile(filePath);
  const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

function readJsonArray<T>(filePath: string): T[] {
  ensureJsonFile(filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function sanitizeGatewayErrorMessage(raw: string, keySecret?: string): string {
  let clean = String(raw || '').trim();
  if (keySecret && keySecret.trim()) {
    clean = clean.split(keySecret.trim()).join('[REDACTED]');
  }
  return clean.replace(/Basic\s+[A-Za-z0-9+/=]+/gi, 'Basic [REDACTED]');
}

async function createRemoteRazorpayOrder(params: {
  amountINR?: number;
  amountPaise?: number;
  currency?: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<{ id: string; amount?: number; currency?: string; receipt?: string } | null> {
  const config = getRazorpayConfigStatus();
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!config.canCreateOrder || !keyId || !keySecret) return null;

  const amountPaise =
    typeof params.amountPaise === 'number'
      ? Math.round(params.amountPaise)
      : Math.round((params.amountINR || 0) * 100);
  const currency = (params.currency || 'INR').toUpperCase();

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency,
      receipt: params.receipt,
      notes: params.notes
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedMsg = errText;
    try {
      const parsed = JSON.parse(errText);
      parsedMsg = parsed?.error?.description || parsed?.message || errText;
    } catch {
      // keep raw text if non-JSON
    }
    throw new Error(`Razorpay Order API error (${response.status}): ${sanitizeGatewayErrorMessage(parsedMsg, keySecret)}`);
  }

  return (await response.json()) as { id: string; amount?: number; currency?: string; receipt?: string };
}

function getRazorpayPlanEnvName(planId: string, cycle: BillingCycle): string | undefined {
  const map: Record<string, Record<BillingCycle, string>> = {
    'kuralvaani-pro': {
      monthly: 'RAZORPAY_PLAN_KURALVAANI_MONTHLY',
      yearly: 'RAZORPAY_PLAN_KURALVAANI_YEARLY'
    },
    'bulkmate-business': {
      monthly: 'RAZORPAY_PLAN_BULKMATE_MONTHLY',
      yearly: 'RAZORPAY_PLAN_BULKMATE_YEARLY'
    },
    'rubi-crm-cloud': {
      monthly: 'RAZORPAY_PLAN_CRM_MONTHLY',
      yearly: 'RAZORPAY_PLAN_CRM_YEARLY'
    }
  };
  return map[planId]?.[cycle];
}

async function createRemoteRazorpaySubscription(params: {
  razorpayPlanId: string;
  billingCycle: BillingCycle;
  notes: Record<string, string>;
}): Promise<{ id: string } | null> {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!keyId || !keySecret || !params.razorpayPlanId) return null;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const totalCount = params.billingCycle === 'yearly' ? 10 : 120;

  const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      plan_id: params.razorpayPlanId,
      total_count: totalCount,
      customer_notify: 1,
      notes: params.notes
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Razorpay Subscription API error (${response.status}): ${errText}`);
  }

  return (await response.json()) as { id: string };
}

export class PaymentManager {
  constructor() {
    ensureJsonFile(PAYMENTS_FILE);
    ensureJsonFile(SUBSCRIPTIONS_FILE);
    ensureJsonFile(WEBHOOK_EVENTS_FILE);
  }

  public getPricingCatalog(): Record<string, ServicePricingItem> {
    return TRUSTED_PRICING_CATALOG;
  }

  public getSubscriptionCatalog(): Record<string, SubscriptionPlanOption> {
    return SUBSCRIPTION_CATALOG;
  }

  public calculateOrderTotal(planId: string): {
    service: ServicePricingItem;
    baseAmountINR: number;
    taxAmountINR: number;
    totalAmountINR: number;
  } {
    const service = TRUSTED_PRICING_CATALOG[planId] || TRUSTED_PRICING_CATALOG['starter-web'];
    const breakdown = calculateGstBreakdown(service.basePrice);
    return {
      service,
      baseAmountINR: breakdown.baseAmountINR,
      taxAmountINR: breakdown.taxAmountINR,
      totalAmountINR: breakdown.totalAmountINR
    };
  }

  public generateUpiIntentUri(orderRef: string, amount: number): string {
    const cleanAmount = amount.toFixed(2);
    const note = encodeURIComponent(`Payment for Order ${orderRef} - RUBI TECH PARK`);
    const name = encodeURIComponent(BUSINESS_NAME);
    return `upi://pay?pa=${BUSINESS_UPI_ID}&pn=${name}&am=${cleanAmount}&tn=${note}&cu=INR`;
  }

  private persistOrder(order: PaymentRecord, allPayments?: PaymentRecord[]): void {
    const list = allPayments || readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const idx = list.findIndex((p) => p.id === order.id || p.orderRef === order.orderRef);
    if (idx === -1) {
      list.unshift(order);
    } else {
      list[idx] = order;
    }
    atomicWriteJson(PAYMENTS_FILE, list);
    firebaseCRM.upsertOrder(order as Record<string, any>).catch(() => {});
  }

  private async persistOrderDurable(order: PaymentRecord, allPayments?: PaymentRecord[]): Promise<void> {
    const list = allPayments || readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const idx = list.findIndex((p) => p.id === order.id || p.orderRef === order.orderRef);
    if (idx === -1) {
      list.unshift(order);
    } else {
      list[idx] = order;
    }
    atomicWriteJson(PAYMENTS_FILE, list);
    await firebaseCRM.upsertOrder(order as Record<string, any>);
  }

  private persistSubscription(sub: CustomerSubscription, allSubs?: CustomerSubscription[]): void {
    const list = allSubs || readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const idx = list.findIndex(
      (s) => s.id === sub.id || s.subscriptionRef === sub.subscriptionRef
    );
    if (idx === -1) {
      list.unshift(sub);
    } else {
      list[idx] = sub;
    }
    atomicWriteJson(SUBSCRIPTIONS_FILE, list);
    firebaseCRM.upsertSubscription(sub as Record<string, any>).catch(() => {});
  }

  public async createStandardRazorpayOrder(params: {
    planId?: string;
    amount?: unknown;
    currency?: unknown;
    receipt?: unknown;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerBusiness?: string;
    leadId?: string;
    bookingId?: string;
    paymentMethod?: PaymentMethodType;
    ipAddress: string;
  }): Promise<{
    id: string;
    orderId: string;
    amount: number;
    currency: 'INR';
    receipt: string;
    order: PaymentRecord;
  }> {
    const configStatus = getRazorpayConfigStatus();
    if (!configStatus.canCreateOrder) {
      throw new Error(
        `RAZORPAY_NOT_CONFIGURED:${configStatus.issueCode || 'CREDENTIALS_MISSING'}:${configStatus.message}`
      );
    }

    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    const defaultReceipt = `RTP-ORD-${year}-${rand}`;

    let service: ServicePricingItem | undefined;
    let baseAmountINR = 0;
    let taxAmountINR = 0;
    let totalAmountINR = 0;
    let rawAmountPaise: unknown = params.amount;

    if (params.planId) {
      service = TRUSTED_PRICING_CATALOG[params.planId];
      if (!service) {
        throw new Error(`VALIDATION_ERROR: Unknown service planId "${params.planId}".`);
      }
      const breakdown = calculateGstBreakdown(service.basePrice);
      baseAmountINR = breakdown.baseAmountINR;
      taxAmountINR = breakdown.taxAmountINR;
      totalAmountINR = breakdown.totalAmountINR;
      rawAmountPaise = Math.round(totalAmountINR * 100);
    }

    const validation = validateCreateOrderInput({
      amount: rawAmountPaise,
      currency: params.currency,
      receipt: params.receipt ?? defaultReceipt
    });

    if (!validation.valid || !validation.amountPaise || !validation.receipt || !validation.currency) {
      throw new Error(`VALIDATION_ERROR: ${validation.error || 'Invalid order request.'}`);
    }

    const amountPaise = validation.amountPaise;
    const receipt = validation.receipt;
    const currency = validation.currency;

    if (!service) {
      totalAmountINR = Number((amountPaise / 100).toFixed(2));
      baseAmountINR = Number((totalAmountINR / 1.18).toFixed(2));
      taxAmountINR = Number((totalAmountINR - baseAmountINR).toFixed(2));
    }

    const remoteOrder = await createRemoteRazorpayOrder({
      amountPaise,
      currency,
      receipt,
      notes: {
        orderRef: receipt,
        serviceId: service?.id || 'custom-service',
        ...(params.leadId ? { leadId: params.leadId } : {}),
        ...(params.bookingId ? { bookingId: params.bookingId } : {}),
        ...(params.customerEmail ? { customerEmail: params.customerEmail.toLowerCase().trim() } : {})
      }
    });

    if (!remoteOrder?.id) {
      throw new Error('Failed to create Razorpay order ID.');
    }

    const now = new Date().toISOString();
    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      orderRef: receipt,
      leadId: params.leadId?.trim() || undefined,
      bookingId: params.bookingId?.trim() || undefined,
      customerName: params.customerName?.trim() || 'RUBI TECH PARK Customer',
      customerEmail: params.customerEmail?.toLowerCase().trim() || '',
      customerPhone: params.customerPhone?.trim() || '',
      customerBusiness: params.customerBusiness?.trim(),
      serviceId: service?.id || 'custom-order',
      serviceTitle: service?.name || 'RUBI TECH PARK Digital Service',
      orderType: 'one_time',
      currency,
      amountPaise,
      baseAmountINR,
      taxAmountINR,
      totalAmountINR,
      paymentMethod: params.paymentMethod || 'razorpay_checkout',
      status: 'created',
      signatureVerified: false,
      refundStatus: 'none',
      gatewayProvider: 'razorpay',
      gatewayMode: configStatus.mode === 'live' ? 'razorpay_live' : 'razorpay_test',
      gatewayOrderId: remoteOrder.id,
      createdAt: now,
      updatedAt: now
    };

    await this.persistOrderDurable(newPayment);

    crmStorage.addAuditLog({
      userId: 'public_customer',
      userEmail: newPayment.customerEmail || 'checkout@rubitechpark.com',
      userRole: 'developer',
      action: 'RAZORPAY_ORDER_CREATED',
      ipAddress: params.ipAddress,
      resource: `${receipt} | ${remoteOrder.id} (${amountPaise} paise)`,
      success: true
    });

    return {
      id: remoteOrder.id,
      orderId: remoteOrder.id,
      amount: amountPaise,
      currency,
      receipt,
      order: newPayment
    };
  }

  public async createOrder(params: {
    planId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerBusiness?: string;
    leadId?: string;
    bookingId?: string;
    paymentMethod: PaymentMethodType;
    ipAddress: string;
  }): Promise<PaymentRecord> {
    const { service, baseAmountINR, taxAmountINR, totalAmountINR } = this.calculateOrderTotal(params.planId);
    const amountPaise = Math.round(totalAmountINR * 100);

    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderRef = `RTP-ORD-${year}-${rand}`;
    const id = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const configStatus = getRazorpayConfigStatus();

    let gatewayOrderId: string | undefined;
    if (configStatus.gatewayConfigured) {
      const remoteOrder = await createRemoteRazorpayOrder({
        amountPaise,
        currency: 'INR',
        receipt: orderRef,
        notes: {
          orderRef,
          serviceId: service.id,
          ...(params.leadId ? { leadId: params.leadId } : {}),
          customerEmail: params.customerEmail.toLowerCase().trim()
        }
      });
      gatewayOrderId = remoteOrder?.id;
    } else {
      gatewayOrderId = `local_ord_${rand}_${crypto.randomBytes(3).toString('hex')}`;
    }

    const now = new Date().toISOString();
    const newPayment: PaymentRecord = {
      id,
      orderRef,
      leadId: params.leadId?.trim() || undefined,
      bookingId: params.bookingId?.trim() || undefined,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.toLowerCase().trim(),
      customerPhone: params.customerPhone.trim(),
      customerBusiness: params.customerBusiness?.trim(),
      serviceId: service.id,
      serviceTitle: service.name,
      orderType: 'one_time',
      currency: 'INR',
      amountPaise,
      baseAmountINR,
      taxAmountINR,
      totalAmountINR,
      paymentMethod: params.paymentMethod,
      status: 'created',
      signatureVerified: false,
      refundStatus: 'none',
      gatewayProvider: configStatus.gatewayConfigured ? 'razorpay' : 'upi_direct',
      gatewayMode: configStatus.gatewayConfigured
        ? configStatus.mode === 'live'
          ? 'razorpay_live'
          : 'razorpay_test'
        : 'upi_direct',
      gatewayOrderId,
      createdAt: now,
      updatedAt: now
    };

    await this.persistOrderDurable(newPayment);

    crmStorage.addAuditLog({
      userId: 'public_customer',
      userEmail: newPayment.customerEmail,
      userRole: 'developer',
      action: 'PAYMENT_ORDER_CREATED',
      ipAddress: params.ipAddress,
      resource: `${orderRef} (${newPayment.gatewayProvider})`,
      success: true
    });

    return newPayment;
  }

  public async createSubscription(params: {
    planId: string;
    billingCycle: BillingCycle;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerBusiness?: string;
    paymentMethod: PaymentMethodType;
    autoRenewConsent: boolean;
    ipAddress: string;
  }): Promise<{ subscription: CustomerSubscription; initialOrder: PaymentRecord }> {
    if (!params.autoRenewConsent) {
      throw new Error('Explicit auto-renewal mandate consent is required before starting a subscription.');
    }

    const breakdown = calculateSubscriptionBreakdown(params.planId, params.billingCycle);
    if (!breakdown) {
      throw new Error('Selected subscription plan was not found in trusted catalog.');
    }

    const year = new Date().getFullYear();
    const randSub = crypto.randomBytes(3).toString('hex').toUpperCase();
    const randOrd = crypto.randomBytes(3).toString('hex').toUpperCase();
    const subscriptionRef = `RTP-SUB-${year}-${randSub}`;
    const orderRef = `RTP-ORD-${year}-${randOrd}`;
    const now = new Date().toISOString();
    const configStatus = getRazorpayConfigStatus();

    let gatewaySubscriptionId: string | undefined;
    let gatewayOrderId: string | undefined;

    if (configStatus.gatewayConfigured) {
      const envKey = getRazorpayPlanEnvName(breakdown.plan.id, params.billingCycle);
      const rzpPlanId = envKey ? (process.env[envKey] || '').trim() : '';

      if (rzpPlanId) {
        const rzpSub = await createRemoteRazorpaySubscription({
          razorpayPlanId: rzpPlanId,
          billingCycle: params.billingCycle,
          notes: {
            subscriptionRef,
            orderRef,
            planId: breakdown.plan.id,
            billingCycle: params.billingCycle,
            customerEmail: params.customerEmail.toLowerCase().trim()
          }
        });
        gatewaySubscriptionId = rzpSub?.id;
      }

      if (!gatewaySubscriptionId) {
        const remoteOrder = await createRemoteRazorpayOrder({
          amountINR: breakdown.totalAmountINR,
          receipt: orderRef,
          notes: {
            subscriptionRef,
            orderRef,
            planId: breakdown.plan.id,
            billingCycle: params.billingCycle
          }
        });
        gatewayOrderId = remoteOrder?.id;
      }
    } else {
      gatewayOrderId = `local_sub_ord_${randOrd}`;
    }

    const subscription: CustomerSubscription = {
      id: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      subscriptionRef,
      planId: breakdown.plan.id,
      planName: breakdown.plan.productName,
      billingCycle: params.billingCycle,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.toLowerCase().trim(),
      customerPhone: params.customerPhone.trim(),
      customerBusiness: params.customerBusiness?.trim(),
      baseAmountINR: breakdown.baseAmountINR,
      taxAmountINR: breakdown.gstAmountINR,
      totalAmountINR: breakdown.totalAmountINR,
      status: 'pending',
      autoRenew: true,
      autoRenewConsent: true,
      consentTimestamp: now,
      gatewaySubscriptionId,
      latestOrderRef: orderRef,
      createdAt: now,
      updatedAt: now
    };

    const initialOrder: PaymentRecord = {
      id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      orderRef,
      customerName: subscription.customerName,
      customerEmail: subscription.customerEmail,
      customerPhone: subscription.customerPhone,
      customerBusiness: subscription.customerBusiness,
      serviceId: breakdown.plan.id,
      serviceTitle: `${breakdown.plan.productName} (${params.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Subscription)`,
      orderType: 'subscription_initial',
      subscriptionId: subscription.id,
      subscriptionRef: subscription.subscriptionRef,
      billingCycle: params.billingCycle,
      baseAmountINR: breakdown.baseAmountINR,
      taxAmountINR: breakdown.gstAmountINR,
      totalAmountINR: breakdown.totalAmountINR,
      paymentMethod: params.paymentMethod,
      status: 'created',
      refundStatus: 'none',
      gatewayProvider: configStatus.gatewayConfigured ? 'razorpay' : 'upi_direct',
      gatewayOrderId,
      createdAt: now,
      updatedAt: now
    };

    this.persistSubscription(subscription);
    this.persistOrder(initialOrder);

    crmStorage.addAuditLog({
      userId: 'public_customer',
      userEmail: subscription.customerEmail,
      userRole: 'developer',
      action: 'SUBSCRIPTION_INITIATED',
      ipAddress: params.ipAddress,
      resource: `${subscriptionRef} | ${orderRef}`,
      success: true
    });

    return { subscription, initialOrder };
  }

  public getOrderByRef(orderRef: string): PaymentRecord | undefined {
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    return payments.find(
      (p) => p.orderRef.toUpperCase() === orderRef.toUpperCase() || p.id === orderRef
    );
  }

  public getAllPayments(filter?: {
    status?: PaymentStatus | 'all';
    searchTerm?: string;
  }): PaymentRecord[] {
    let payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);

    if (filter?.status && filter.status !== 'all') {
      payments = payments.filter((p) => p.status === filter.status);
    }

    if (filter?.searchTerm) {
      const q = filter.searchTerm.toLowerCase().trim();
      payments = payments.filter(
        (p) =>
          p.orderRef.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.customerEmail.toLowerCase().includes(q) ||
          p.customerPhone.includes(q) ||
          (p.serviceTitle && p.serviceTitle.toLowerCase().includes(q)) ||
          (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(q)) ||
          (p.upiTransactionRef && p.upiTransactionRef.toLowerCase().includes(q))
      );
    }

    return payments;
  }

  public getAllSubscriptions(filter?: {
    status?: SubscriptionStatus | 'all';
    searchTerm?: string;
  }): CustomerSubscription[] {
    let subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);

    if (filter?.status && filter.status !== 'all') {
      subs = subs.filter((s) => s.status === filter.status);
    }

    if (filter?.searchTerm) {
      const q = filter.searchTerm.toLowerCase().trim();
      subs = subs.filter(
        (s) =>
          s.subscriptionRef.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.customerEmail.toLowerCase().includes(q) ||
          s.customerPhone.includes(q) ||
          s.planName.toLowerCase().includes(q)
      );
    }

    return subs;
  }

  public lookupSubscription(subscriptionRef: string, email: string): {
    subscription: CustomerSubscription;
    payments: PaymentRecord[];
  } | null {
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const cleanRef = subscriptionRef.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    const sub = subs.find(
      (s) =>
        s.subscriptionRef.toUpperCase() === cleanRef &&
        s.customerEmail.toLowerCase() === cleanEmail
    );

    if (!sub) return null;

    const allPayments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const payments = allPayments.filter(
      (p) =>
        p.subscriptionRef?.toUpperCase() === sub.subscriptionRef.toUpperCase() ||
        p.subscriptionId === sub.id
    );

    return { subscription: sub, payments };
  }

  private activateLinkedSubscriptionIfNeeded(payment: PaymentRecord, activatedAtIso: string): void {
    if (!payment.subscriptionRef && !payment.subscriptionId) return;
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const idx = subs.findIndex(
      (s) => s.subscriptionRef === payment.subscriptionRef || s.id === payment.subscriptionId
    );
    if (idx === -1) return;

    const sub = subs[idx];
    sub.status = 'active';
    sub.mandateAuthorizedAt = sub.mandateAuthorizedAt || activatedAtIso;
    sub.lastPaymentAt = activatedAtIso;
    sub.nextBillingAt = computeNextBillingDate(activatedAtIso, sub.billingCycle);
    sub.latestOrderRef = payment.orderRef;
    sub.updatedAt = activatedAtIso;
    this.persistSubscription(sub, subs);
  }

  /**
   * Manual UPI Submission (Customer enters 12-digit UTR)
   * Stays in 'pending_verification' until confirmed by business admin
   */
  public submitManualUpiPayment(
    orderRef: string,
    utr: string,
    ipAddress: string
  ): { success: boolean; payment?: PaymentRecord; message: string } {
    const cleanUtr = utr.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (cleanUtr.length < 8 || cleanUtr.length > 24) {
      return {
        success: false,
        message: 'Invalid UTR format. Please provide an 8 to 24 character alphanumeric bank reference.'
      };
    }

    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const index = payments.findIndex((p) => p.orderRef === orderRef || p.id === orderRef);

    if (index === -1) {
      return { success: false, message: 'Order reference not found.' };
    }

    const payment = payments[index];
    if (payment.status === 'paid') {
      return {
        success: true,
        payment,
        message: 'This payment is already verified and marked paid.'
      };
    }

    payment.paymentMethod = 'upi_manual';
    payment.upiTransactionRef = cleanUtr;
    payment.status = 'pending_verification';
    payment.updatedAt = new Date().toISOString();

    this.persistOrder(payment, payments);

    crmStorage.addAuditLog({
      userId: 'customer',
      userEmail: payment.customerEmail,
      userRole: 'developer',
      action: 'MANUAL_UPI_UTR_SUBMITTED',
      ipAddress,
      resource: `${orderRef}:${cleanUtr}`,
      success: true
    });

    return {
      success: true,
      payment,
      message: 'UTR submitted successfully. Order is placed in Pending Verification.'
    };
  }

  /**
   * Strict Razorpay Order Payment Verification (HMAC-SHA256 + Timing-Safe Comparison + Duplicate Prevention)
   */
  public async verifyGatewayPayment(params: {
    orderRef?: string;
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
    leadId?: string;
    bookingId?: string;
    ipAddress: string;
  }): Promise<{
    success: boolean;
    alreadyProcessed?: boolean;
    conflict?: boolean;
    notConfigured?: boolean;
    linkedLeadId?: string | null;
    payment?: PaymentRecord;
    message: string;
  }> {
    const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!secret) {
      return {
        success: false,
        notConfigured: true,
        message: 'Razorpay key secret is not configured on the server.'
      };
    }

    if (!params.gatewayOrderId || !params.gatewayPaymentId || !params.gatewaySignature) {
      return {
        success: false,
        message: 'Missing required payment verification parameters (order_id, payment_id, signature).'
      };
    }

    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    let index = payments.findIndex(
      (p) =>
        (params.orderRef && (p.orderRef === params.orderRef || p.id === params.orderRef)) ||
        (params.gatewayOrderId && p.gatewayOrderId === params.gatewayOrderId)
    );

    let payment: PaymentRecord | undefined = index !== -1 ? payments[index] : undefined;

    // Vercel serverless cold-start fallback: inspect Firestore `orders` collection
    if (!payment) {
      const firestoreOrder = await firebaseCRM.getOrderByGatewayOrRef(
        params.orderRef,
        params.gatewayOrderId
      );
      if (firestoreOrder) {
        payment = firestoreOrder as PaymentRecord;
        payments.unshift(payment);
        index = 0;
      }
    }

    if (!payment) {
      return { success: false, message: 'Matching order reference not found.' };
    }

    const orderIdToVerify = payment.gatewayOrderId || params.gatewayOrderId;
    if (payment.gatewayOrderId && params.gatewayOrderId && payment.gatewayOrderId !== params.gatewayOrderId) {
      return {
        success: false,
        message: 'Razorpay order ID does not match the recorded order.'
      };
    }

    // Strict HMAC-SHA256 + timing-safe comparison BEFORE mutating any state
    const valid = verifyRazorpayOrderSignature(
      orderIdToVerify,
      params.gatewayPaymentId,
      params.gatewaySignature,
      secret
    );

    if (!valid) {
      crmStorage.addAuditLog({
        userId: 'gateway_system',
        userEmail: payment.customerEmail || 'unknown@rubitechpark.com',
        userRole: 'developer',
        action: 'PAYMENT_SIGNATURE_INVALID',
        ipAddress: params.ipAddress,
        resource: `${payment.orderRef}`,
        success: false
      });
      return { success: false, message: 'Payment signature verification failed (HMAC mismatch).' };
    }

    // Prevent duplicate payment ID reuse across different orders
    const localPaymentConflict = payments.find(
      (p) =>
        p.gatewayPaymentId === params.gatewayPaymentId &&
        p.orderRef !== payment!.orderRef
    );
    const remotePaymentConflict = !localPaymentConflict
      ? await firebaseCRM.findOrderByGatewayPaymentId(params.gatewayPaymentId)
      : null;
    const conflictOrderRef = localPaymentConflict?.orderRef || remotePaymentConflict?.orderRef;

    if (conflictOrderRef && conflictOrderRef !== payment.orderRef) {
      return {
        success: false,
        conflict: true,
        message: `Duplicate payment rejected: payment ID ${params.gatewayPaymentId} is already bound to order ${conflictOrderRef}.`
      };
    }

    // Idempotent duplicate handling for already-paid same order
    if (payment.status === 'paid') {
      if (!payment.gatewayPaymentId || payment.gatewayPaymentId === params.gatewayPaymentId) {
        const linkResult = await firebaseCRM.linkVerifiedPaymentToLead({
          orderRef: payment.orderRef,
          leadId: payment.leadId || params.leadId,
          bookingId: payment.bookingId || params.bookingId,
          customerEmail: payment.customerEmail,
          customerPhone: payment.customerPhone,
          gatewayPaymentId: payment.gatewayPaymentId || params.gatewayPaymentId,
          receiptNumber: payment.receiptNumber,
          paidAmountINR: payment.totalAmountINR,
          verifiedAt: payment.verifiedAt || payment.updatedAt
        });
        return {
          success: true,
          alreadyProcessed: true,
          linkedLeadId: linkResult.linkedLeadId,
          payment,
          message: 'Payment already verified and recorded.'
        };
      }

      return {
        success: false,
        conflict: true,
        message: `Order ${payment.orderRef} is already settled with another payment ID.`
      };
    }

    const now = new Date().toISOString();
    const year = new Date().getFullYear();
    const receiptNum =
      payment.receiptNumber ||
      `RTP-REC-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    if (params.leadId && !payment.leadId) payment.leadId = params.leadId.trim();
    if (params.bookingId && !payment.bookingId) payment.bookingId = params.bookingId.trim();

    payment.status = 'paid';
    payment.signatureVerified = true;
    payment.gatewayProvider = 'razorpay';
    payment.gatewayOrderId = orderIdToVerify;
    payment.gatewayPaymentId = params.gatewayPaymentId;
    payment.gatewaySignature = params.gatewaySignature;
    payment.receiptNumber = receiptNum;
    payment.verifiedAt = now;
    payment.updatedAt = now;

    await this.persistOrderDurable(payment, payments);
    this.activateLinkedSubscriptionIfNeeded(payment, now);

    // Only link booking/lead AFTER verification & persistence succeed
    const linkResult = await firebaseCRM.linkVerifiedPaymentToLead({
      orderRef: payment.orderRef,
      leadId: payment.leadId,
      bookingId: payment.bookingId,
      customerEmail: payment.customerEmail,
      customerPhone: payment.customerPhone,
      gatewayPaymentId: payment.gatewayPaymentId,
      receiptNumber: receiptNum,
      paidAmountINR: payment.totalAmountINR,
      verifiedAt: now
    });

    crmStorage.addAuditLog({
      userId: 'gateway_system',
      userEmail: payment.customerEmail || 'checkout@rubitechpark.com',
      userRole: 'developer',
      action: 'PAYMENT_VERIFIED_SUCCESS',
      ipAddress: params.ipAddress,
      resource: `${payment.orderRef} | ${receiptNum}${
        linkResult.linkedLeadId ? ` | Lead:${linkResult.linkedLeadId}` : ''
      }`,
      success: true
    });

    return {
      success: true,
      alreadyProcessed: false,
      linkedLeadId: linkResult.linkedLeadId,
      payment,
      message: 'Payment signature verified successfully.'
    };
  }

  /**
   * Strict Razorpay Subscription Mandate Verification (HMAC-SHA256)
   */
  public verifySubscriptionMandate(params: {
    subscriptionRef: string;
    orderRef?: string;
    gatewayPaymentId: string;
    gatewaySubscriptionId?: string;
    gatewayOrderId?: string;
    gatewaySignature: string;
    ipAddress: string;
  }): {
    success: boolean;
    subscription?: CustomerSubscription;
    payment?: PaymentRecord;
    message: string;
  } {
    const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!secret) {
      return { success: false, message: 'Razorpay key secret is not configured on the server.' };
    }

    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const subIdx = subs.findIndex(
      (s) =>
        s.subscriptionRef === params.subscriptionRef ||
        (params.gatewaySubscriptionId && s.gatewaySubscriptionId === params.gatewaySubscriptionId)
    );
    if (subIdx === -1) {
      return { success: false, message: 'Subscription reference not found.' };
    }

    const sub = subs[subIdx];
    const subIdToVerify = params.gatewaySubscriptionId || sub.gatewaySubscriptionId;
    let verified = false;

    if (subIdToVerify) {
      verified = verifyRazorpaySubscriptionSignature(
        params.gatewayPaymentId,
        subIdToVerify,
        params.gatewaySignature,
        secret
      );
    }

    if (!verified && params.gatewayOrderId) {
      verified = verifyRazorpayOrderSignature(
        params.gatewayOrderId,
        params.gatewayPaymentId,
        params.gatewaySignature,
        secret
      );
    }

    if (!verified) {
      return { success: false, message: 'Subscription mandate signature verification failed.' };
    }

    const now = new Date().toISOString();
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const payIdx = payments.findIndex(
      (p) =>
        (params.orderRef && p.orderRef === params.orderRef) ||
        p.orderRef === sub.latestOrderRef
    );

    let updatedPayment: PaymentRecord | undefined;
    if (payIdx !== -1) {
      const p = payments[payIdx];
      const receiptNum =
        p.receiptNumber ||
        `RTP-REC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      p.status = 'paid';
      p.gatewayProvider = 'razorpay';
      p.gatewayPaymentId = params.gatewayPaymentId;
      p.gatewaySignature = params.gatewaySignature;
      if (params.gatewayOrderId) p.gatewayOrderId = params.gatewayOrderId;
      p.receiptNumber = receiptNum;
      p.verifiedAt = now;
      p.updatedAt = now;
      this.persistOrder(p, payments);
      updatedPayment = p;
    }

    sub.status = 'active';
    if (subIdToVerify) sub.gatewaySubscriptionId = subIdToVerify;
    sub.mandateAuthorizedAt = now;
    sub.lastPaymentAt = now;
    sub.nextBillingAt = computeNextBillingDate(now, sub.billingCycle);
    sub.updatedAt = now;
    this.persistSubscription(sub, subs);

    crmStorage.addAuditLog({
      userId: 'gateway_system',
      userEmail: sub.customerEmail,
      userRole: 'developer',
      action: 'SUBSCRIPTION_MANDATE_ACTIVATED',
      ipAddress: params.ipAddress,
      resource: `${sub.subscriptionRef} | ${params.gatewayPaymentId}`,
      success: true
    });

    return {
      success: true,
      subscription: sub,
      payment: updatedPayment,
      message: 'Subscription mandate verified and activated.'
    };
  }

  /**
   * Self-Serve Subscription Cancellation (Stops Future Auto-Renewals)
   */
  public async cancelSubscription(params: {
    subscriptionRef: string;
    email: string;
    reason?: string;
    ipAddress: string;
  }): Promise<{ success: boolean; subscription?: CustomerSubscription; message: string }> {
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const idx = subs.findIndex(
      (s) =>
        s.subscriptionRef.toUpperCase() === params.subscriptionRef.toUpperCase() &&
        s.customerEmail.toLowerCase() === params.email.toLowerCase().trim()
    );

    if (idx === -1) {
      return { success: false, message: 'Subscription not found or email does not match.' };
    }

    const sub = subs[idx];
    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (keyId && keySecret && sub.gatewaySubscriptionId) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        await fetch(
          `https://api.razorpay.com/v1/subscriptions/${encodeURIComponent(sub.gatewaySubscriptionId)}/cancel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${auth}`
            },
            body: JSON.stringify({ cancel_at_cycle_end: 1 })
          }
        );
      } catch (err) {
        console.warn('Non-blocking Razorpay subscription remote cancel warning:', err);
      }
    }

    const now = new Date().toISOString();
    sub.status = 'cancelled';
    sub.autoRenew = false;
    sub.cancelledAt = now;
    sub.cancellationReason = params.reason || 'Customer self-serve cancellation';
    sub.updatedAt = now;

    this.persistSubscription(sub, subs);

    crmStorage.addAuditLog({
      userId: 'customer',
      userEmail: sub.customerEmail,
      userRole: 'developer',
      action: 'SUBSCRIPTION_CANCELLED',
      ipAddress: params.ipAddress,
      resource: sub.subscriptionRef,
      success: true
    });

    return {
      success: true,
      subscription: sub,
      message: 'Subscription auto-renewal has been cancelled.'
    };
  }

  /**
   * Customer Upgrade / Downgrade Plan Request
   */
  public requestSubscriptionPlanChange(params: {
    subscriptionRef: string;
    email: string;
    newPlanId: string;
    newBillingCycle: BillingCycle;
    ipAddress: string;
  }): { success: boolean; subscription?: CustomerSubscription; message: string } {
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const idx = subs.findIndex(
      (s) =>
        s.subscriptionRef.toUpperCase() === params.subscriptionRef.toUpperCase() &&
        s.customerEmail.toLowerCase() === params.email.toLowerCase().trim()
    );

    if (idx === -1) {
      return { success: false, message: 'Subscription not found or email mismatch.' };
    }

    const sub = subs[idx];
    if (sub.status === 'cancelled') {
      return { success: false, message: 'Cancelled subscriptions cannot change plans; please start a new subscription.' };
    }

    const targetPlan = SUBSCRIPTION_CATALOG[params.newPlanId];
    if (!targetPlan) {
      return { success: false, message: 'Selected target plan is invalid.' };
    }

    const now = new Date().toISOString();
    sub.pendingPlanChange = {
      newPlanId: targetPlan.id,
      newPlanName: targetPlan.productName,
      newBillingCycle: params.newBillingCycle,
      requestedAt: now
    };
    sub.updatedAt = now;
    this.persistSubscription(sub, subs);

    crmStorage.addAuditLog({
      userId: 'customer',
      userEmail: sub.customerEmail,
      userRole: 'developer',
      action: 'SUBSCRIPTION_PLAN_CHANGE_REQUESTED',
      ipAddress: params.ipAddress,
      resource: `${sub.subscriptionRef} -> ${targetPlan.id} (${params.newBillingCycle})`,
      success: true
    });

    return {
      success: true,
      subscription: sub,
      message: `Scheduled transition to ${targetPlan.productName} (${params.newBillingCycle}) for next renewal cycle.`
    };
  }

  /**
   * Admin Manual Verification (Authorized Admin marks UTR receipt confirmed)
   */
  public adminVerifyManualPayment(
    paymentId: string,
    adminName: string,
    ipAddress: string
  ): { success: boolean; payment?: PaymentRecord; message: string } {
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const index = payments.findIndex((p) => p.id === paymentId || p.orderRef === paymentId);

    if (index === -1) {
      return { success: false, message: 'Payment record not found.' };
    }

    const payment = payments[index];
    const now = new Date().toISOString();
    const year = new Date().getFullYear();
    const receiptNum =
      payment.receiptNumber ||
      `RTP-REC-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    payment.status = 'paid';
    payment.verifiedBy = adminName;
    payment.verifiedAt = now;
    payment.receiptNumber = receiptNum;
    payment.updatedAt = now;

    this.persistOrder(payment, payments);
    this.activateLinkedSubscriptionIfNeeded(payment, now);
    firebaseCRM
      .linkVerifiedPaymentToLead({
        orderRef: payment.orderRef,
        leadId: payment.leadId,
        bookingId: payment.bookingId,
        customerEmail: payment.customerEmail,
        customerPhone: payment.customerPhone,
        gatewayPaymentId: payment.upiTransactionRef || payment.gatewayPaymentId,
        receiptNumber: receiptNum,
        paidAmountINR: payment.totalAmountINR,
        verifiedAt: now
      })
      .catch(() => {});

    crmStorage.addAuditLog({
      userId: adminName,
      userEmail: payment.customerEmail,
      userRole: 'super_admin',
      action: 'ADMIN_MANUAL_PAYMENT_VERIFIED',
      ipAddress,
      resource: `${payment.orderRef} | Receipt: ${receiptNum}`,
      success: true
    });

    return {
      success: true,
      payment,
      message: `Payment confirmed and marked Paid by ${adminName}.`
    };
  }

  /**
   * Admin Reject Manual Payment (e.g. invalid UTR)
   */
  public adminRejectPayment(
    paymentId: string,
    reason: string,
    adminName: string,
    ipAddress: string
  ): { success: boolean; payment?: PaymentRecord; message: string } {
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const index = payments.findIndex((p) => p.id === paymentId || p.orderRef === paymentId);

    if (index === -1) {
      return { success: false, message: 'Payment record not found.' };
    }

    const payment = payments[index];
    const now = new Date().toISOString();
    payment.status = 'failed';
    payment.notes = `Rejected by ${adminName}: ${reason}`;
    payment.updatedAt = now;

    this.persistOrder(payment, payments);

    if (payment.subscriptionRef) {
      const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
      const subIdx = subs.findIndex((s) => s.subscriptionRef === payment.subscriptionRef);
      if (subIdx !== -1 && subs[subIdx].status === 'pending') {
        subs[subIdx].status = 'failed';
        subs[subIdx].updatedAt = now;
        this.persistSubscription(subs[subIdx], subs);
      }
    }

    crmStorage.addAuditLog({
      userId: adminName,
      userEmail: payment.customerEmail,
      userRole: 'super_admin',
      action: 'ADMIN_PAYMENT_REJECTED',
      ipAddress,
      resource: `${payment.orderRef} | Reason: ${reason}`,
      success: true
    });

    return {
      success: true,
      payment,
      message: `Payment rejected and marked Failed.`
    };
  }

  /**
   * Admin Refund Status Update
   */
  public adminUpdateRefundStatus(params: {
    paymentId: string;
    refundStatus: RefundStatus;
    refundAmountINR?: number;
    refundId?: string;
    refundNotes?: string;
    adminName: string;
    ipAddress: string;
  }): { success: boolean; payment?: PaymentRecord; message: string } {
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const index = payments.findIndex(
      (p) => p.id === params.paymentId || p.orderRef === params.paymentId
    );
    if (index === -1) {
      return { success: false, message: 'Payment record not found.' };
    }

    const payment = payments[index];
    const now = new Date().toISOString();

    payment.refundStatus = params.refundStatus;
    if (params.refundId) payment.refundId = params.refundId;
    if (params.refundNotes) payment.refundNotes = params.refundNotes;
    if (typeof params.refundAmountINR === 'number' && params.refundAmountINR >= 0) {
      payment.refundAmountINR = params.refundAmountINR;
    }

    if (params.refundStatus === 'requested' || params.refundStatus === 'processing') {
      payment.status = 'refund_pending';
    } else if (params.refundStatus === 'processed') {
      const isPartial =
        typeof payment.refundAmountINR === 'number' &&
        payment.refundAmountINR > 0 &&
        payment.refundAmountINR < payment.totalAmountINR;
      payment.status = isPartial ? 'partial_refund' : 'refunded';
    }

    payment.updatedAt = now;
    this.persistOrder(payment, payments);

    crmStorage.addAuditLog({
      userId: params.adminName,
      userEmail: payment.customerEmail,
      userRole: 'super_admin',
      action: 'ADMIN_REFUND_STATUS_UPDATED',
      ipAddress: params.ipAddress,
      resource: `${payment.orderRef} -> ${params.refundStatus}`,
      success: true
    });

    return {
      success: true,
      payment,
      message: `Refund status updated to ${params.refundStatus}.`
    };
  }

  /**
   * Admin Update Subscription Status
   */
  public adminUpdateSubscriptionStatus(params: {
    subscriptionRef: string;
    status: SubscriptionStatus;
    adminName: string;
    ipAddress: string;
  }): { success: boolean; subscription?: CustomerSubscription; message: string } {
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    const index = subs.findIndex(
      (s) => s.subscriptionRef === params.subscriptionRef || s.id === params.subscriptionRef
    );
    if (index === -1) {
      return { success: false, message: 'Subscription record not found.' };
    }

    const sub = subs[index];
    const now = new Date().toISOString();
    sub.status = params.status;
    if (params.status === 'cancelled') {
      sub.autoRenew = false;
      sub.cancelledAt = sub.cancelledAt || now;
    } else if (params.status === 'active') {
      sub.autoRenew = true;
      sub.nextBillingAt = sub.nextBillingAt || computeNextBillingDate(now, sub.billingCycle);
    }
    sub.updatedAt = now;
    this.persistSubscription(sub, subs);

    crmStorage.addAuditLog({
      userId: params.adminName,
      userEmail: sub.customerEmail,
      userRole: 'super_admin',
      action: 'ADMIN_SUBSCRIPTION_STATUS_UPDATED',
      ipAddress: params.ipAddress,
      resource: `${sub.subscriptionRef} -> ${params.status}`,
      success: true
    });

    return {
      success: true,
      subscription: sub,
      message: `Subscription status updated to ${params.status}.`
    };
  }

  /**
   * Idempotent Razorpay Webhook Event Processor
   */
  public async processWebhookEvent(params: {
    eventId: string;
    eventType: string;
    payload: any;
    ipAddress: string;
  }): Promise<{ processed: boolean; duplicate: boolean; summary: string }> {
    const events = readJsonArray<WebhookEventRecord>(WEBHOOK_EVENTS_FILE);
    const alreadyLocal = events.some((e) => e.eventId === params.eventId);
    const alreadyRemote = !alreadyLocal && (await firebaseCRM.hasProcessedWebhookEvent(params.eventId));

    if (alreadyLocal || alreadyRemote) {
      return {
        processed: false,
        duplicate: true,
        summary: `Duplicate webhook event ${params.eventId} skipped idempotently.`
      };
    }

    const now = new Date().toISOString();
    const payments = readJsonArray<PaymentRecord>(PAYMENTS_FILE);
    const subs = readJsonArray<CustomerSubscription>(SUBSCRIPTIONS_FILE);
    let summary = `Received webhook ${params.eventType}`;

    const paymentEntity = params.payload?.payment?.entity;
    const refundEntity = params.payload?.refund?.entity;
    const subscriptionEntity = params.payload?.subscription?.entity;

    switch (params.eventType) {
      case 'payment.captured': {
        const gatewayOrderId = paymentEntity?.order_id;
        const gatewayPaymentId = paymentEntity?.id;
        const orderRefNote = paymentEntity?.notes?.orderRef;
        let target = payments.find(
          (p) =>
            (gatewayOrderId && p.gatewayOrderId === gatewayOrderId) ||
            (orderRefNote && p.orderRef === orderRefNote)
        );
        if (!target && (gatewayOrderId || orderRefNote)) {
          const remoteOrder = await firebaseCRM.getOrderByGatewayOrRef(orderRefNote, gatewayOrderId);
          if (remoteOrder) {
            target = remoteOrder as PaymentRecord;
            payments.unshift(target);
          }
        }
        if (target) {
          target.status = 'paid';
          target.signatureVerified = true;
          target.gatewayProvider = 'razorpay';
          if (gatewayPaymentId) target.gatewayPaymentId = gatewayPaymentId;
          if (!target.receiptNumber) {
            target.receiptNumber = `RTP-REC-${new Date().getFullYear()}-${crypto
              .randomBytes(3)
              .toString('hex')
              .toUpperCase()}`;
          }
          target.verifiedAt = target.verifiedAt || now;
          target.updatedAt = now;
          await this.persistOrderDurable(target, payments);
          this.activateLinkedSubscriptionIfNeeded(target, now);
          await firebaseCRM.linkVerifiedPaymentToLead({
            orderRef: target.orderRef,
            leadId: target.leadId || paymentEntity?.notes?.leadId,
            bookingId: target.bookingId || paymentEntity?.notes?.bookingId,
            customerEmail: target.customerEmail,
            customerPhone: target.customerPhone,
            gatewayPaymentId: target.gatewayPaymentId,
            receiptNumber: target.receiptNumber,
            paidAmountINR: target.totalAmountINR,
            verifiedAt: now
          });
          summary = `Marked order ${target.orderRef} paid via webhook payment.captured (${gatewayPaymentId || 'n/a'}).`;
        }
        break;
      }

      case 'payment.failed': {
        const gatewayOrderId = paymentEntity?.order_id;
        const gatewayPaymentId = paymentEntity?.id;
        const orderRefNote = paymentEntity?.notes?.orderRef;
        const reason = paymentEntity?.error_description || 'Payment failed at gateway';
        const target = payments.find(
          (p) =>
            (gatewayOrderId && p.gatewayOrderId === gatewayOrderId) ||
            (orderRefNote && p.orderRef === orderRefNote)
        );
        if (target && target.status !== 'paid') {
          target.status = 'failed';
          if (gatewayPaymentId) target.gatewayPaymentId = gatewayPaymentId;
          target.notes = reason;
          target.updatedAt = now;
          this.persistOrder(target, payments);
          summary = `Marked order ${target.orderRef} failed via webhook payment.failed.`;
        }
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const gatewayPaymentId = refundEntity?.payment_id || paymentEntity?.id;
        const refundId = refundEntity?.id;
        const refundAmtPaise = refundEntity?.amount;
        const target = payments.find(
          (p) => gatewayPaymentId && p.gatewayPaymentId === gatewayPaymentId
        );
        if (target) {
          const isProcessed = params.eventType === 'refund.processed';
          const refundINR =
            typeof refundAmtPaise === 'number' ? Math.round(refundAmtPaise / 100) : target.totalAmountINR;
          target.refundId = refundId || target.refundId;
          target.refundAmountINR = refundINR;
          target.refundStatus = isProcessed ? 'processed' : 'processing';
          target.status = isProcessed
            ? refundINR < target.totalAmountINR
              ? 'partial_refund'
              : 'refunded'
            : 'refund_pending';
          target.updatedAt = now;
          this.persistOrder(target, payments);
          summary = `Updated refund status (${target.refundStatus}) on ${target.orderRef}.`;
        }
        break;
      }

      case 'subscription.activated':
      case 'subscription.charged': {
        const rzpSubId = subscriptionEntity?.id;
        const subRefNote = subscriptionEntity?.notes?.subscriptionRef;
        const targetSub = subs.find(
          (s) =>
            (rzpSubId && s.gatewaySubscriptionId === rzpSubId) ||
            (subRefNote && s.subscriptionRef === subRefNote)
        );
        if (targetSub) {
          targetSub.status = 'active';
          targetSub.autoRenew = true;
          targetSub.mandateAuthorizedAt = targetSub.mandateAuthorizedAt || now;
          targetSub.lastPaymentAt = now;
          targetSub.nextBillingAt = computeNextBillingDate(now, targetSub.billingCycle);
          targetSub.updatedAt = now;

          if (params.eventType === 'subscription.charged' && paymentEntity?.id) {
            const existingCharge = payments.find(
              (p) => p.gatewayPaymentId === paymentEntity.id
            );
            if (!existingCharge) {
              const renewalRef = `RTP-ORD-${new Date().getFullYear()}-${crypto
                .randomBytes(3)
                .toString('hex')
                .toUpperCase()}`;
              const renewalPayment: PaymentRecord = {
                id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
                orderRef: renewalRef,
                customerName: targetSub.customerName,
                customerEmail: targetSub.customerEmail,
                customerPhone: targetSub.customerPhone,
                customerBusiness: targetSub.customerBusiness,
                serviceId: targetSub.planId,
                serviceTitle: `${targetSub.planName} (Auto-Renewal)`,
                orderType: 'subscription_renewal',
                subscriptionId: targetSub.id,
                subscriptionRef: targetSub.subscriptionRef,
                billingCycle: targetSub.billingCycle,
                baseAmountINR: targetSub.baseAmountINR,
                taxAmountINR: targetSub.taxAmountINR,
                totalAmountINR: targetSub.totalAmountINR,
                paymentMethod: 'upi_mandate',
                status: 'paid',
                refundStatus: 'none',
                gatewayProvider: 'razorpay',
                gatewayOrderId: paymentEntity.order_id,
                gatewayPaymentId: paymentEntity.id,
                receiptNumber: `RTP-REC-${new Date().getFullYear()}-${crypto
                  .randomBytes(3)
                  .toString('hex')
                  .toUpperCase()}`,
                verifiedAt: now,
                createdAt: now,
                updatedAt: now
              };
              this.persistOrder(renewalPayment, payments);
              targetSub.latestOrderRef = renewalRef;
            }
          }

          this.persistSubscription(targetSub, subs);
          summary = `Processed ${params.eventType} for ${targetSub.subscriptionRef}.`;
        }
        break;
      }

      case 'subscription.pending':
      case 'subscription.halted':
      case 'subscription.cancelled': {
        const rzpSubId = subscriptionEntity?.id;
        const subRefNote = subscriptionEntity?.notes?.subscriptionRef;
        const targetSub = subs.find(
          (s) =>
            (rzpSubId && s.gatewaySubscriptionId === rzpSubId) ||
            (subRefNote && s.subscriptionRef === subRefNote)
        );
        if (targetSub) {
          if (params.eventType === 'subscription.pending') {
            targetSub.status = 'pending';
          } else if (params.eventType === 'subscription.halted') {
            targetSub.status = 'failed';
          } else {
            targetSub.status = 'cancelled';
            targetSub.autoRenew = false;
            targetSub.cancelledAt = targetSub.cancelledAt || now;
          }
          targetSub.updatedAt = now;
          this.persistSubscription(targetSub, subs);
          summary = `Updated subscription ${targetSub.subscriptionRef} to ${targetSub.status}.`;
        }
        break;
      }

      default:
        break;
    }

    const record: WebhookEventRecord = {
      eventId: params.eventId,
      eventType: params.eventType,
      processedAt: now,
      status: 'processed',
      summary
    };

    events.unshift(record);
    atomicWriteJson(WEBHOOK_EVENTS_FILE, events.slice(0, 500));
    await firebaseCRM.recordWebhookEvent(record).catch(() => {});

    crmStorage.addAuditLog({
      userId: 'payment_webhook',
      userEmail: 'system@rubitechpark.com',
      userRole: 'developer',
      action: `WEBHOOK_EVENT_${params.eventType || 'UNKNOWN'}`,
      ipAddress: params.ipAddress,
      resource: `${params.eventId} | ${summary}`,
      success: true
    });

    return { processed: true, duplicate: false, summary };
  }
}

export const paymentManager = new PaymentManager();
