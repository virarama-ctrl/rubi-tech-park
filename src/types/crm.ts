/**
 * Ellora Digital Hub - Future Admin CRM Schema & Architecture Specification
 * 
 * NOTE: This module defines the strict type contracts for the future Phase 2 
 * server-side CRM. In accordance with system instructions, no fake backend or 
 * mock public dashboard is exposed.
 */

import { BusinessType, RequiredService, BudgetRange, ContactMethod } from './index';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Requirement Collected'
  | 'Quotation Sent'
  | 'Awaiting Customer Approval'
  | 'Booking Confirmed'
  | 'Work In Progress'
  | 'Work Completed'
  | 'Payment Pending'
  | 'Closed'
  | 'Cancelled'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost'
  | 'Interested'
  | 'Converted'
  | 'Not Interested';

export type UserRole = 'super_admin' | 'crm_manager' | 'sales_executive' | 'developer';

export interface CRMLeadNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CRMActivityLog {
  id: string;
  leadId: string;
  performedBy: string;
  action: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'FOLLOWUP_SCHEDULED' | 'EMAIL_SENT' | 'WHATSAPP_CLICKED' | 'PAYMENT_VERIFIED';
  details: string;
  timestamp: string;
}

export interface StoredLead {
  id: string;
  referenceNumber: string; // e.g. RTP-2026-0042
  enquiryId?: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  fullName: string;
  customerName?: string;
  businessName?: string;
  email: string;
  phone: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  customerType?: 'Individual' | 'Business' | 'Startup' | string;
  serviceCategory?: string;
  selectedService?: string;
  customerRequirement?: string;
  enquiryDate?: string;
  source?: 'Chatbot' | 'Website Form' | 'WhatsApp' | string;
  businessType?: BusinessType;
  requiredService?: RequiredService | string;
  budgetRange?: BudgetRange | string;
  projectDescription?: string;
  preferredContactMethod?: ContactMethod | string;
  consentAgreed: boolean;
  bookingPaymentStatus?: 'None' | 'Pending' | 'Verified Paid' | 'Failed';
  bookingAmount?: number;
  balanceAmount?: number;
  linkedOrderRef?: string;
  gatewayPaymentId?: string;
  receiptNumber?: string;
  paidAt?: string;
  followUpDate?: string;
  assignedTo?: string;
  internalEstimatedValueINR?: number;
  notes: CRMLeadNote[];
  activityHistory: CRMActivityLog[];
}

export interface LeadFilters {
  searchTerm?: string;
  status?: LeadStatus | 'All';
  service?: RequiredService | 'All';
  businessType?: BusinessType | 'All';
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  ipAddress: string;
  resource: string;
  timestamp: string;
  success: boolean;
}

export interface CRMExportCSVRow {
  Reference: string;
  Date: string;
  Status: string;
  Name: string;
  Business: string;
  Email: string;
  Phone: string;
  Service: string;
  Budget: string;
  AssignedTo: string;
  FollowUpDate: string;
}

export type PaymentStatus =
  | 'created'
  | 'pending_verification'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refund_pending'
  | 'partial_refund'
  | 'refunded';

export type RefundStatus = 'none' | 'requested' | 'processing' | 'processed' | 'rejected';

export type PaymentMethodType =
  | 'upi_qr'
  | 'upi_intent'
  | 'upi_manual'
  | 'upi_mandate'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'razorpay_checkout';

export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionStatus = 'pending' | 'active' | 'paused' | 'cancelled' | 'failed';

export interface PaymentRecord {
  id: string;
  orderRef: string; // e.g. RTP-ORD-2026-1049
  orderType?: 'one_time' | 'subscription_initial' | 'subscription_renewal';
  subscriptionId?: string;
  subscriptionRef?: string;
  billingCycle?: BillingCycle;
  leadId?: string;
  bookingId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerBusiness?: string;
  serviceId: string;
  serviceTitle: string;
  packageName?: string;
  currency?: string;
  amountPaise?: number;
  baseAmountINR: number;
  taxAmountINR: number;
  totalAmountINR: number;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  gatewayProvider?: 'razorpay' | 'upi_direct';
  gatewayMode?: 'razorpay_live' | 'razorpay_test' | 'upi_direct';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  signatureVerified?: boolean;
  upiTransactionRef?: string; // 12-digit UTR
  verifiedBy?: string;
  verifiedAt?: string;
  refundStatus?: RefundStatus;
  refundAmountINR?: number;
  refundId?: string;
  refundNotes?: string;
  refundReason?: string;
  refundUpdatedAt?: string;
  mandateConsentAccepted?: boolean;
  mandateConsentAt?: string;
  createdAt: string;
  updatedAt: string;
  receiptNumber?: string;
  notes?: string;
}

export interface CustomerSubscription {
  id: string;
  subscriptionRef: string; // e.g. RTP-SUB-2026-A1B2
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerBusiness?: string;
  baseAmountINR: number;
  taxAmountINR: number;
  totalAmountINR: number;
  status: SubscriptionStatus;
  autoRenew: boolean;
  autoRenewConsent: boolean;
  consentTimestamp: string;
  gatewaySubscriptionId?: string;
  latestOrderRef?: string;
  mandateAuthorizedAt?: string;
  lastPaymentAt?: string;
  nextBillingAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  pendingPlanChange?: {
    newPlanId: string;
    newPlanName: string;
    newBillingCycle: BillingCycle;
    requestedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  orderId?: string;
  paymentId?: string;
  subscriptionId?: string;
  processedAt: string;
  status: 'processed' | 'ignored_duplicate' | 'failed';
  summary?: string;
  notes?: string;
}


