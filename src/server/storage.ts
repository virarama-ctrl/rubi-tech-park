import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  StoredLead,
  LeadStatus,
  CRMLeadNote,
  CRMActivityLog,
  LeadFilters,
  AuditLogEntry,
  CRMExportCSVRow
} from '../types/crm';
import { LeadFormData } from '../types';
import { AdminUser, hashPassword } from './auth';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const LEADS_FILE = path.join(DATA_DIR, 'crm_leads.json');
const USERS_FILE = path.join(DATA_DIR, 'crm_users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'crm_audit.json');

// Ensure data directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

// Atomic file write using temporary file and rename
function atomicWriteJson<T>(filePath: string, data: T): void {
  ensureDirectories();
  const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

export class CRMStorage {
  constructor() {
    ensureDirectories();
    this.seedDefaultUsersIfEmpty();
    this.seedInitialLeadsIfEmpty();
  }

  // --- Users ---
  private seedDefaultUsersIfEmpty(): void {
    const users = readJson<AdminUser[]>(USERS_FILE, []);
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure';
    let updated = false;

    // Check if rubitechpark admin exists
    if (!users.some((u) => u.email === 'admin@rubitechpark.com')) {
      users.unshift({
        id: 'usr_admin_rtp',
        email: 'admin@rubitechpark.com',
        name: 'RUBI TECH PARK Admin',
        role: 'super_admin',
        passwordHash: hashPassword(defaultPassword),
        createdAt: new Date().toISOString()
      });
      updated = true;
    }

    // Check if elloradigital admin exists for test compatibility
    if (!users.some((u) => u.email === 'admin@elloradigital.in')) {
      users.push({
        id: 'usr_admin_01',
        email: 'admin@elloradigital.in',
        name: 'Executive Admin',
        role: 'super_admin',
        passwordHash: hashPassword(defaultPassword),
        createdAt: new Date().toISOString()
      });
      updated = true;
    }

    if (updated) {
      atomicWriteJson(USERS_FILE, users);
      this.addAuditLog({
        userId: 'system',
        userEmail: 'admin@rubitechpark.com',
        userRole: 'super_admin',
        action: 'SYSTEM_BOOTSTRAP',
        ipAddress: '127.0.0.1',
        resource: 'AUTH_USERS',
        timestamp: new Date().toISOString(),
        success: true
      });
    }
  }

  public getUserByEmail(email: string): AdminUser | null {
    const users = readJson<AdminUser[]>(USERS_FILE, []);
    const cleanEmail = email.trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  // --- Leads ---
  private seedInitialLeadsIfEmpty(): void {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    if (leads.length === 0) {
      const initialLeads: StoredLead[] = [
        {
          id: 'lead_seed_01',
          referenceNumber: 'EDH-2026-0042',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Won',
          fullName: 'Kishore Jhaveri',
          businessName: 'RUBI Gold & Silver',
          email: 'kishore@rubijewellery.in',
          phone: '9820198201',
          businessType: 'retail-jewellery',
          requiredService: 'ecommerce-store',
          budgetRange: '₹35,000 - ₹75,000',
          projectDescription: 'Digital catalog and luxury WhatsApp inquiry portal for gold and silver ornament collections across India.',
          preferredContactMethod: 'WhatsApp',
          consentAgreed: true,
          followUpDate: '2026-11-05',
          assignedTo: 'Ellora Executive Admin',
          internalEstimatedValueINR: 55000,
          notes: [
            {
              id: 'note_1',
              authorId: 'usr_admin_01',
              authorName: 'Ellora Executive Admin',
              content: 'Phase 1 deployed with positive customer feedback. SKU WhatsApp triggers working flawlessly.',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          activityHistory: [
            {
              id: 'act_1',
              leadId: 'lead_seed_01',
              performedBy: 'Ellora Executive Admin',
              action: 'STATUS_CHANGE',
              details: 'Status changed from Proposal Sent to Won',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 'lead_seed_02',
          referenceNumber: 'EDH-2026-0089',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'Proposal Sent',
          fullName: 'Venkatesh Rao',
          businessName: 'Apex Fasteners & Industrial Tools',
          email: 'v.rao@apexindustrial.co.in',
          phone: '9845098450',
          businessType: 'manufacturing',
          requiredService: 'custom-crm',
          budgetRange: '₹75,000 - ₹1,50,000+',
          projectDescription: 'Multi-branch warehouse stock lookup and dispatch workflow with GST invoice generation.',
          preferredContactMethod: 'Phone Call',
          consentAgreed: true,
          followUpDate: '2026-11-02',
          assignedTo: 'Ellora Executive Admin',
          internalEstimatedValueINR: 85000,
          notes: [
            {
              id: 'note_2',
              authorId: 'usr_admin_01',
              authorName: 'Ellora Executive Admin',
              content: 'Formal milestone proposal sent for review. Follow-up scheduled with director on Monday.',
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            }
          ],
          activityHistory: [
            {
              id: 'act_2',
              leadId: 'lead_seed_02',
              performedBy: 'Ellora Executive Admin',
              action: 'STATUS_CHANGE',
              details: 'Status changed from Qualified to Proposal Sent',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ];

      atomicWriteJson(LEADS_FILE, initialLeads);
    }
  }

  public getAllLeads(filters?: LeadFilters): StoredLead[] {
    let leads = readJson<StoredLead[]>(LEADS_FILE, []);

    if (!filters) return leads;

    if (filters.searchTerm) {
      const term = filters.searchTerm.trim().toLowerCase();
      leads = leads.filter(
        (l) =>
          l.fullName.toLowerCase().includes(term) ||
          (l.businessName && l.businessName.toLowerCase().includes(term)) ||
          l.email.toLowerCase().includes(term) ||
          (l.referenceNumber && l.referenceNumber.toLowerCase().includes(term)) ||
          (l.projectDescription && l.projectDescription.toLowerCase().includes(term)) ||
          (l.customerRequirement && l.customerRequirement.toLowerCase().includes(term))
      );
    }

    if (filters.status && filters.status !== 'All') {
      leads = leads.filter((l) => l.status === filters.status);
    }

    if (filters.service && filters.service !== 'All') {
      leads = leads.filter((l) => l.requiredService === filters.service);
    }

    if (filters.businessType && filters.businessType !== 'All') {
      leads = leads.filter((l) => l.businessType === filters.businessType);
    }

    // Sort newest first
    return leads.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getLeadById(id: string): StoredLead | null {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    return leads.find((l) => l.id === id || l.referenceNumber === id) || null;
  }

  public createLead(data: any, ipAddress: string): StoredLead {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const now = new Date().toISOString();
    const id = `lead_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const referenceNumber = `RTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullName = data.customerName || data.fullName || 'Anonymous';
    const phone = data.mobileNumber || data.phone || '';
    const email = data.email || '';

    const newLead: StoredLead = {
      id,
      referenceNumber,
      enquiryId: referenceNumber,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'New',
      fullName,
      customerName: fullName,
      businessName: data.businessName || data.business_name || '',
      email,
      phone,
      mobileNumber: phone,
      whatsappNumber: data.whatsappNumber || data.whatsapp_number || phone,
      customerType: data.customerType || 'Individual',
      serviceCategory: data.serviceCategory || (typeof data.requiredService === 'string' ? data.requiredService : 'General'),
      selectedService: data.selectedService || data.requiredService || 'General Inquiry',
      customerRequirement: data.customerRequirement || data.projectDescription || data.message || '',
      enquiryDate: data.enquiryDate || new Date().toLocaleString('en-IN'),
      source: data.source || 'Website Form',
      businessType: data.businessType || 'other',
      requiredService: data.requiredService || data.selectedService || 'General',
      budgetRange: data.budgetRange || (data.bookingAmount ? `₹${data.bookingAmount}` : 'Quote on Request'),
      projectDescription: data.customerRequirement || data.projectDescription || data.message || '',
      preferredContactMethod: data.preferredContactMethod || 'WhatsApp',
      consentAgreed: Boolean(data.consentAgreed ?? true),
      bookingPaymentStatus: data.bookingPaymentStatus || (data.bookingAmount ? 'Pending' : 'None'),
      bookingAmount: data.bookingAmount || (data.isEService ? 236 : undefined),
      balanceAmount: data.balanceAmount,
      notes: [],
      activityHistory: [
        {
          id: `act_${Date.now()}`,
          leadId: id,
          performedBy: 'System Webhook',
          action: 'STATUS_CHANGE',
          details: `Enquiry [${referenceNumber}] recorded from ${ipAddress} via ${data.source || 'Website'}.`,
          timestamp: now
        }
      ]
    };

    leads.unshift(newLead);
    atomicWriteJson(LEADS_FILE, leads);

    this.addAuditLog({
      id: `audit_${Date.now()}`,
      userId: 'public_lead_form',
      userEmail: data.email,
      userRole: 'developer',
      action: 'LEAD_SUBMISSION',
      ipAddress,
      resource: `LEAD:${referenceNumber}`,
      timestamp: now,
      success: true
    });

    return newLead;
  }

  public updateLeadStatus(id: string, status: LeadStatus, performedBy: string): StoredLead | null {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return null;

    const oldStatus = lead.status;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();

    const activity: CRMActivityLog = {
      id: `act_${Date.now()}`,
      leadId: id,
      performedBy,
      action: 'STATUS_CHANGE',
      details: `Status changed from "${oldStatus}" to "${status}"`,
      timestamp: lead.updatedAt
    };
    lead.activityHistory.unshift(activity);

    atomicWriteJson(LEADS_FILE, leads);
    return lead;
  }

  public addLeadNote(id: string, authorId: string, authorName: string, content: string): CRMLeadNote | null {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return null;

    const note: CRMLeadNote = {
      id: `note_${Date.now()}`,
      authorId,
      authorName,
      content,
      createdAt: new Date().toISOString()
    };

    lead.notes.unshift(note);
    lead.updatedAt = note.createdAt;

    lead.activityHistory.unshift({
      id: `act_${Date.now()}`,
      leadId: id,
      performedBy: authorName,
      action: 'NOTE_ADDED',
      details: `Internal note added: "${content.slice(0, 60)}${content.length > 60 ? '...' : ''}"`,
      timestamp: note.createdAt
    });

    atomicWriteJson(LEADS_FILE, leads);
    return note;
  }

  public updateFollowUpDate(id: string, followUpDate: string, performedBy: string): StoredLead | null {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return null;

    lead.followUpDate = followUpDate;
    lead.updatedAt = new Date().toISOString();

    lead.activityHistory.unshift({
      id: `act_${Date.now()}`,
      leadId: id,
      performedBy,
      action: 'FOLLOWUP_SCHEDULED',
      details: `Follow-up scheduled for ${followUpDate}`,
      timestamp: lead.updatedAt
    });

    atomicWriteJson(LEADS_FILE, leads);
    return lead;
  }

  public updateEstimatedValue(id: string, value: number, performedBy: string): StoredLead | null {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return null;

    lead.internalEstimatedValueINR = value;
    lead.updatedAt = new Date().toISOString();

    atomicWriteJson(LEADS_FILE, leads);
    return lead;
  }

  public deleteLead(id: string): boolean {
    const leads = readJson<StoredLead[]>(LEADS_FILE, []);
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return false;

    leads.splice(index, 1);
    atomicWriteJson(LEADS_FILE, leads);
    return true;
  }

  // --- Audit Logs ---
  public addAuditLog(entry: Partial<AuditLogEntry>): void {
    const logs = readJson<AuditLogEntry[]>(AUDIT_FILE, []);
    const fullEntry: AuditLogEntry = {
      id: entry.id || `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      userId: entry.userId || 'system',
      userEmail: entry.userEmail || 'system@elloradigital.in',
      userRole: entry.userRole || 'super_admin',
      action: entry.action || 'UNKNOWN_ACTION',
      ipAddress: entry.ipAddress || '127.0.0.1',
      resource: entry.resource || 'GENERAL',
      timestamp: entry.timestamp || new Date().toISOString(),
      success: entry.success ?? true
    };
    logs.unshift(fullEntry);
    // Keep last 1,000 audit logs
    atomicWriteJson(AUDIT_FILE, logs.slice(0, 1000));
  }

  public getAuditLogs(limit: number = 100): AuditLogEntry[] {
    const logs = readJson<AuditLogEntry[]>(AUDIT_FILE, []);
    return logs.slice(0, limit);
  }

  // --- CSV Export ---
  public generateCSV(): string {
    const leads = this.getAllLeads();
    const headers = [
      'Reference',
      'Date',
      'Status',
      'Name',
      'Business',
      'Email',
      'Phone',
      'Service',
      'Budget',
      'Preferred Contact',
      'Estimated Value (INR)',
      'Follow-Up Date'
    ];

    const escapeCsv = (str: string | number | undefined) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = leads.map((l) => [
      escapeCsv(l.referenceNumber),
      escapeCsv(new Date(l.createdAt).toLocaleDateString('en-IN')),
      escapeCsv(l.status),
      escapeCsv(l.fullName),
      escapeCsv(l.businessName || 'N/A'),
      escapeCsv(l.email),
      escapeCsv(l.phone),
      escapeCsv(l.requiredService),
      escapeCsv(l.budgetRange),
      escapeCsv(l.preferredContactMethod),
      escapeCsv(l.internalEstimatedValueINR || 0),
      escapeCsv(l.followUpDate || 'None')
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // --- Backup Routine ---
  public createBackup(): { success: boolean; filename: string; timestamp: string } {
    ensureDirectories();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `crm_backup_${timestamp}.json`;
    const targetPath = path.join(BACKUPS_DIR, filename);

    const snapshot = {
      timestamp: new Date().toISOString(),
      leads: readJson(LEADS_FILE, []),
      audit: readJson(AUDIT_FILE, []),
      schemaVersion: '2.0.0'
    };

    fs.writeFileSync(targetPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    return { success: true, filename, timestamp };
  }
}

export const crmStorage = new CRMStorage();
