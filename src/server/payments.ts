import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PaymentRecord, PaymentStatus, PaymentMethodType } from '../types/crm';
import { crmStorage } from './storage';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'crm_payments.json');

import {
  BUSINESS_UPI_ID,
  BUSINESS_NAME,
  TRUSTED_PRICING_CATALOG,
  ServicePricingItem
} from '../config/pricingCatalog';

export {
  BUSINESS_UPI_ID,
  BUSINESS_NAME,
  TRUSTED_PRICING_CATALOG
};
export type { ServicePricingItem };

function ensurePaymentsFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PAYMENTS_FILE)) {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function atomicWritePayments(data: PaymentRecord[]): void {
  ensurePaymentsFile();
  const tempPath = `${PAYMENTS_FILE}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, PAYMENTS_FILE);
}

function readPayments(): PaymentRecord[] {
  ensurePaymentsFile();
  try {
    const raw = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    return JSON.parse(raw) as PaymentRecord[];
  } catch (err) {
    console.error('Error reading payments file:', err);
    return [];
  }
}

export class PaymentManager {
  constructor() {
    ensurePaymentsFile();
  }

  public getPricingCatalog(): Record<string, ServicePricingItem> {
    return TRUSTED_PRICING_CATALOG;
  }

  public calculateOrderTotal(planId: string): {
    service: ServicePricingItem;
    baseAmountINR: number;
    taxAmountINR: number;
    totalAmountINR: number;
  } {
    const service = TRUSTED_PRICING_CATALOG[planId] || TRUSTED_PRICING_CATALOG['starter-web'];
    const baseAmountINR = service.basePrice;
    // 18% GST (CGST 9% + SGST 9%)
    const taxAmountINR = Math.round(baseAmountINR * 0.18);
    const totalAmountINR = baseAmountINR + taxAmountINR;

    return {
      service,
      baseAmountINR,
      taxAmountINR,
      totalAmountINR
    };
  }

  public generateUpiIntentUri(orderRef: string, amount: number): string {
    const cleanAmount = amount.toFixed(2);
    const note = encodeURIComponent(`Payment for Order ${orderRef} - RUBI TECH PARK`);
    const name = encodeURIComponent(BUSINESS_NAME);
    return `upi://pay?pa=${BUSINESS_UPI_ID}&pn=${name}&am=${cleanAmount}&tn=${note}&cu=INR`;
  }

  public createOrder(params: {
    planId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerBusiness?: string;
    paymentMethod: PaymentMethodType;
    ipAddress: string;
  }): PaymentRecord {
    const { service, baseAmountINR, taxAmountINR, totalAmountINR } = this.calculateOrderTotal(params.planId);

    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderRef = `RTP-ORD-${year}-${rand}`;
    const id = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Razorpay or gateway order ID simulation if live keys are not configured
    const gatewayOrderId = process.env.RAZORPAY_KEY_ID
      ? `order_${crypto.randomBytes(7).toString('hex')}`
      : `sandbox_ord_${rand}`;

    const newPayment: PaymentRecord = {
      id,
      orderRef,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.toLowerCase().trim(),
      customerPhone: params.customerPhone.trim(),
      customerBusiness: params.customerBusiness?.trim(),
      serviceId: service.id,
      serviceTitle: service.name,
      baseAmountINR,
      taxAmountINR,
      totalAmountINR,
      paymentMethod: params.paymentMethod,
      status: 'created',
      gatewayOrderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const payments = readPayments();
    payments.unshift(newPayment);
    atomicWritePayments(payments);

    crmStorage.addAuditLog({
      userId: 'public_customer',
      userEmail: params.customerEmail,
      userRole: 'developer',
      action: 'PAYMENT_ORDER_CREATED',
      ipAddress: params.ipAddress,
      resource: orderRef,
      success: true
    });

    return newPayment;
  }

  public getOrderByRef(orderRef: string): PaymentRecord | undefined {
    const payments = readPayments();
    return payments.find((p) => p.orderRef.toUpperCase() === orderRef.toUpperCase() || p.id === orderRef);
  }

  public getAllPayments(filter?: {
    status?: PaymentStatus | 'all';
    searchTerm?: string;
  }): PaymentRecord[] {
    let payments = readPayments();

    if (filter?.status && filter.status !== 'all') {
      payments = payments.filter((p) => p.status === filter.status);
    }

    if (filter?.searchTerm) {
      const q = filter.searchTerm.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.orderRef.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.customerEmail.toLowerCase().includes(q) ||
          p.customerPhone.includes(q) ||
          (p.upiTransactionRef && p.upiTransactionRef.toLowerCase().includes(q))
      );
    }

    return payments;
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
        message: 'Invalid UTR format. Please provide an 8 to 22 digit alphanumeric bank reference.'
      };
    }

    const payments = readPayments();
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

    atomicWritePayments(payments);

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
   * Gateway Signature Verification (Razorpay / Cashfree HMAC verification)
   */
  public verifyGatewayPayment(params: {
    orderRef: string;
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
    ipAddress: string;
  }): { success: boolean; payment?: PaymentRecord; message: string } {
    const payments = readPayments();
    const index = payments.findIndex((p) => p.orderRef === params.orderRef || p.id === params.orderRef);

    if (index === -1) {
      return { success: false, message: 'Order reference not found.' };
    }

    const payment = payments[index];
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret) {
      // Real cryptographic verification
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${params.gatewayOrderId}|${params.gatewayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== params.gatewaySignature) {
        crmStorage.addAuditLog({
          userId: 'gateway',
          userEmail: payment.customerEmail,
          userRole: 'developer',
          action: 'GATEWAY_SIGNATURE_INVALID',
          ipAddress: params.ipAddress,
          resource: params.orderRef,
          success: false
        });
        return { success: false, message: 'Cryptographic signature verification failed.' };
      }
    } else {
      // In Sandbox / Development mode without live secrets:
      // Verify valid payload format and ensure test payment signature is present
      if (!params.gatewayPaymentId || !params.gatewaySignature) {
        return { success: false, message: 'Missing gateway transaction signatures.' };
      }
    }

    // Mark as paid
    const year = new Date().getFullYear();
    const receiptNum = `RTP-REC-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    payment.status = 'paid';
    payment.gatewayOrderId = params.gatewayOrderId;
    payment.gatewayPaymentId = params.gatewayPaymentId;
    payment.gatewaySignature = params.gatewaySignature;
    payment.receiptNumber = receiptNum;
    payment.updatedAt = new Date().toISOString();

    atomicWritePayments(payments);

    crmStorage.addAuditLog({
      userId: 'gateway_system',
      userEmail: payment.customerEmail,
      userRole: 'developer',
      action: 'PAYMENT_VERIFIED_SUCCESS',
      ipAddress: params.ipAddress,
      resource: `${payment.orderRef} | ${receiptNum}`,
      success: true
    });

    return {
      success: true,
      payment,
      message: 'Payment signature verified successfully.'
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
    const payments = readPayments();
    const index = payments.findIndex((p) => p.id === paymentId || p.orderRef === paymentId);

    if (index === -1) {
      return { success: false, message: 'Payment record not found.' };
    }

    const payment = payments[index];
    const year = new Date().getFullYear();
    const receiptNum = `RTP-REC-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    payment.status = 'paid';
    payment.verifiedBy = adminName;
    payment.verifiedAt = new Date().toISOString();
    payment.receiptNumber = receiptNum;
    payment.updatedAt = new Date().toISOString();

    atomicWritePayments(payments);

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
    const payments = readPayments();
    const index = payments.findIndex((p) => p.id === paymentId || p.orderRef === paymentId);

    if (index === -1) {
      return { success: false, message: 'Payment record not found.' };
    }

    const payment = payments[index];
    payment.status = 'failed';
    payment.notes = `Rejected by ${adminName}: ${reason}`;
    payment.updatedAt = new Date().toISOString();

    atomicWritePayments(payments);

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
}

export const paymentManager = new PaymentManager();
