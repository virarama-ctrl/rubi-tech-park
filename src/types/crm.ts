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
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

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
  action: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'FOLLOWUP_SCHEDULED' | 'EMAIL_SENT' | 'WHATSAPP_CLICKED';
  details: string;
  timestamp: string;
}

export interface StoredLead {
  id: string;
  referenceNumber: string; // e.g. EDH-2026-0042
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  requiredService: RequiredService;
  budgetRange: BudgetRange;
  projectDescription: string;
  preferredContactMethod: ContactMethod;
  consentAgreed: boolean;
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
  | 'refunded';

export type PaymentMethodType =
  | 'upi_qr'
  | 'upi_intent'
  | 'upi_manual'
  | 'card'
  | 'netbanking'
  | 'wallet';

export interface PaymentRecord {
  id: string;
  orderRef: string; // e.g. RTP-ORD-2026-1049
  leadId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerBusiness?: string;
  serviceId: string;
  serviceTitle: string;
  packageName?: string;
  baseAmountINR: number;
  taxAmountINR: number;
  totalAmountINR: number;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  upiTransactionRef?: string; // 12-digit UTR
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  receiptNumber?: string;
  notes?: string;
}
