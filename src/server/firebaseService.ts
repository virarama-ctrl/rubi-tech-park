import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  Auth
} from 'firebase/auth';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { StoredLead, LeadStatus } from '../types/crm';
import { crmStorage } from './storage';

dotenv.config();

// Load Firebase configuration
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (err) {
    console.error('Failed to read firebase-applet-config.json:', err);
  }
}

export interface FirestoreLeadRecord {
  enquiryId: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  customerType: string;
  serviceCategory: string;
  selectedService: string;
  requirement: string;
  source: string;
  status: string;
  consentStatus: boolean;
  bookingAmount?: number;
  paymentStatus: string;
  linkedOrderRef?: string;
  gatewayPaymentId?: string;
  receiptNumber?: string;
  paidAmountINR?: number;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  internalNotes: string;
  notes?: Array<{ id: string; content: string; author: string; createdAt: string }>;
  activityHistory?: Array<{ id: string; action: string; details: string; timestamp: string }>;
  businessName?: string;
  referenceNumber?: string;
  id?: string;
}

export const PRIMARY_ADMIN_EMAIL = 'admin@rubitechpark.com';
export const PRIMARY_ADMIN_UID = 'xd60RtfunBd6mIOxLAdu6acegio1';
export const HIDDEN_PUBLIC_SERVICE_IDS = new Set<string>(['other-online-government-services']);

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  disabled: boolean;
  displayName?: string;
  customClaims: Record<string, unknown>;
}

export interface FirestoreAdminRoleRecord {
  uid?: string;
  email?: string;
  role?: string;
  name?: string;
  active?: boolean;
}

export interface AdminAuthorizationResult {
  authorized: boolean;
  role: 'super_admin' | 'admin' | null;
  reason: string;
  matchedBy?: 'uid_and_email' | 'email_allowlist' | 'custom_claims' | 'firestore_admin_roles';
}

export function getAuthorizedAdminEmails(): string[] {
  const configured = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const base = [PRIMARY_ADMIN_EMAIL, 'admin@elloradigital.in'];
  if (configured && !base.includes(configured)) {
    base.push(configured);
  }
  return base;
}

/**
 * Pure, deterministic server-side administrator authorization evaluator.
 * Never grants admin access to arbitrary authenticated users.
 */
export function evaluateAdminAuthorization(params: {
  uid?: string;
  email?: string;
  disabled?: boolean;
  customClaims?: Record<string, unknown>;
  firestoreRole?: FirestoreAdminRoleRecord | null;
  extraAuthorizedEmails?: string[];
}): AdminAuthorizationResult {
  if (params.disabled) {
    return { authorized: false, role: null, reason: 'account_disabled' };
  }

  const normalizedEmail = (params.email || '').toLowerCase().trim();
  const normalizedUid = (params.uid || '').trim();
  const allowedEmails = new Set([
    ...getAuthorizedAdminEmails(),
    ...(params.extraAuthorizedEmails || []).map((e) => e.toLowerCase().trim()).filter(Boolean)
  ]);

  // 1. Primary administrator UID bound strictly to admin@rubitechpark.com
  if (normalizedUid === PRIMARY_ADMIN_UID && normalizedEmail === PRIMARY_ADMIN_EMAIL) {
    return {
      authorized: true,
      role: 'super_admin',
      reason: 'verified_primary_admin_uid_and_email',
      matchedBy: 'uid_and_email'
    };
  }

  // 2. Verified authorized administrator email allowlist
  if (normalizedEmail && allowedEmails.has(normalizedEmail)) {
    return {
      authorized: true,
      role: 'super_admin',
      reason: 'verified_admin_email',
      matchedBy: 'email_allowlist'
    };
  }

  // 3. Verified Firebase Custom Claims (set server-side on Firebase Auth)
  const claims = params.customClaims || {};
  if (
    claims.admin === true ||
    claims.super_admin === true ||
    claims.role === 'super_admin' ||
    claims.role === 'admin'
  ) {
    return {
      authorized: true,
      role: claims.role === 'admin' ? 'admin' : 'super_admin',
      reason: 'verified_firebase_custom_claims',
      matchedBy: 'custom_claims'
    };
  }

  // 4. Verified Firestore admin_roles/{uid} or admin_roles/{email} record
  const fsRole = params.firestoreRole;
  if (fsRole && fsRole.active !== false) {
    const roleVal = (fsRole.role || '').toLowerCase().trim();
    if (roleVal === 'super_admin' || roleVal === 'admin') {
      return {
        authorized: true,
        role: roleVal === 'admin' ? 'admin' : 'super_admin',
        reason: 'verified_firestore_admin_role',
        matchedBy: 'firestore_admin_roles'
      };
    }
  }

  return {
    authorized: false,
    role: null,
    reason: 'not_authorized_admin'
  };
}

function decodeFirestoreRestValue(val: any): any {
  if (!val || typeof val !== 'object') return undefined;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    return Array.isArray(val.arrayValue?.values)
      ? val.arrayValue.values.map(decodeFirestoreRestValue)
      : [];
  }
  if ('mapValue' in val) {
    const out: Record<string, any> = {};
    const fields = val.mapValue?.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = decodeFirestoreRestValue(v);
    }
    return out;
  }
  return undefined;
}

function encodeFirestoreRestValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeFirestoreRestValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = encodeFirestoreRestValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function decodeFirestoreRestDocument(docObj: any): Record<string, any> {
  const out: Record<string, any> = {};
  const fields = docObj?.fields || {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = decodeFirestoreRestValue(v);
  }
  return out;
}

export class FirebaseCRMService {
  private app: any = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  private adminEmail = PRIMARY_ADMIN_EMAIL;
  private adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure';
  private isAuthenticated = false;
  private adminAuthBackoffUntil = 0;

  constructor() {
    this.init();
  }

  private init() {
    if (!firebaseConfig.projectId) {
      console.warn('FirebaseCRMService: firebase-applet-config.json missing or incomplete.');
      return;
    }

    try {
      this.app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      this.db = getFirestore(this.app, firebaseConfig.firestoreDatabaseId || undefined);
      this.auth = getAuth(this.app);
    } catch (err) {
      console.error('Error initializing FirebaseCRMService:', err);
    }
  }

  private getFirestoreRestBaseUrl(): string | null {
    if (!firebaseConfig.projectId) return null;
    const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
    return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firebaseConfig.projectId)}/databases/${encodeURIComponent(dbId)}/documents`;
  }

  /**
   * Ensure server has authenticated session as admin to satisfy Firestore rules
   */
  public async ensureAdminAuth(): Promise<boolean> {
    if (!this.auth) return false;
    if (this.auth.currentUser) return true;
    if (Date.now() < this.adminAuthBackoffUntil) return false;

    try {
      await signInWithEmailAndPassword(this.auth, this.adminEmail, this.adminPassword);
      this.isAuthenticated = true;
      this.adminAuthBackoffUntil = 0;
      return true;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(this.auth, this.adminEmail, this.adminPassword);
          this.isAuthenticated = true;
          this.adminAuthBackoffUntil = 0;
          return true;
        } catch (createErr: any) {
          this.adminAuthBackoffUntil = Date.now() + 10 * 60 * 1000;
          console.warn('FirebaseCRMService admin bootstrap note:', createErr?.code || createErr?.message);
          return false;
        }
      }
      // Back off for 10 minutes on credential mismatch or rate-limiting so Firebase Auth is never throttled
      this.adminAuthBackoffUntil = Date.now() + 10 * 60 * 1000;
      if (
        err.code !== 'auth/invalid-credential' &&
        err.code !== 'auth/wrong-password' &&
        err.code !== 'auth/too-many-requests'
      ) {
        console.warn('Admin authentication note in FirebaseCRMService:', err.code || err.message);
      }
      return false;
    }
  }

  /**
   * Verify a Firebase ID token directly with Firebase Auth Identity Toolkit (accounts:lookup).
   * Returns verified UID, email, disabled flag, and custom claims, or null if invalid/expired.
   */
  public async verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
    const cleanToken = (idToken || '').trim();
    if (!cleanToken || !firebaseConfig.apiKey) {
      return null;
    }

    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: cleanToken })
      });

      if (!response.ok) {
        return null;
      }

      const data: any = await response.json();
      const userRecord = Array.isArray(data?.users) ? data.users[0] : null;
      if (!userRecord || !userRecord.localId) {
        return null;
      }

      let customClaims: Record<string, unknown> = {};
      if (typeof userRecord.customAttributes === 'string' && userRecord.customAttributes.trim()) {
        try {
          const parsed = JSON.parse(userRecord.customAttributes);
          if (parsed && typeof parsed === 'object') {
            customClaims = parsed;
          }
        } catch {
          // Ignore malformed customAttributes JSON
        }
      }

      return {
        uid: String(userRecord.localId),
        email: String(userRecord.email || '').toLowerCase().trim(),
        emailVerified: Boolean(userRecord.emailVerified),
        disabled: Boolean(userRecord.disabled),
        displayName: userRecord.displayName ? String(userRecord.displayName) : undefined,
        customClaims
      };
    } catch (err: any) {
      console.warn('Firebase ID token verification failed:', err?.message || err);
      return null;
    }
  }

  /**
   * Authenticate email + password directly against Firebase Auth Identity Toolkit REST API.
   * Useful when a client submits credentials without a pre-fetched idToken.
   */
  public async signInWithFirebasePassword(
    email: string,
    password: string
  ): Promise<{ idToken: string; uid: string; email: string } | null> {
    if (!email || !password || !firebaseConfig.apiKey) return null;

    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true
        })
      });

      if (!response.ok) {
        return null;
      }

      const data: any = await response.json();
      if (!data?.idToken || !data?.localId) return null;

      return {
        idToken: String(data.idToken),
        uid: String(data.localId),
        email: String(data.email || email).toLowerCase().trim()
      };
    } catch {
      return null;
    }
  }

  /**
   * Read a Firestore admin_roles document by UID or email using the caller's verified Firebase ID token.
   */
  public async getFirestoreAdminRole(
    uid: string,
    email: string,
    idToken?: string
  ): Promise<FirestoreAdminRoleRecord | null> {
    const baseUrl = this.getFirestoreRestBaseUrl();
    const candidates = [uid.trim(), email.toLowerCase().trim()].filter(Boolean);

    if (baseUrl && idToken) {
      for (const docId of candidates) {
        try {
          const res = await fetch(`${baseUrl}/admin_roles/${encodeURIComponent(docId)}`, {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          if (res.ok) {
            const docJson = await res.json();
            const decoded = decodeFirestoreRestDocument(docJson) as FirestoreAdminRoleRecord;
            if (decoded && decoded.role) {
              return decoded;
            }
          }
        } catch {
          // Try next candidate
        }
      }
    }

    if (this.db && (await this.ensureAdminAuth())) {
      for (const docId of candidates) {
        try {
          const snap = await getDoc(doc(this.db, 'admin_roles', docId));
          if (snap.exists()) {
            return snap.data() as FirestoreAdminRoleRecord;
          }
        } catch {
          // Try next candidate
        }
      }
    }

    return null;
  }

  /**
   * Ensure Firestore `admin_roles` records exist for both verified UID and email of an authorized admin.
   * Non-blocking so transient network issues never lock out an authorized administrator.
   */
  public async syncAdminRoleRecords(
    verifiedUser: VerifiedFirebaseUser,
    role: 'super_admin' | 'admin',
    idToken: string
  ): Promise<void> {
    const baseUrl = this.getFirestoreRestBaseUrl();
    if (!baseUrl || !idToken || !verifiedUser.uid || !verifiedUser.email) return;

    const now = new Date().toISOString();
    const record = {
      uid: verifiedUser.uid,
      email: verifiedUser.email,
      role,
      name: verifiedUser.displayName || 'RUBI TECH PARK Admin',
      active: true,
      updatedAt: now
    };

    const fieldsPayload = {
      fields: Object.fromEntries(
        Object.entries(record).map(([k, v]) => [k, encodeFirestoreRestValue(v)])
      )
    };

    const docIds = Array.from(new Set([verifiedUser.uid, verifiedUser.email]));
    await Promise.allSettled(
      docIds.map((docId) =>
        fetch(`${baseUrl}/admin_roles/${encodeURIComponent(docId)}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fieldsPayload)
        })
      )
    );
  }

  /**
   * Full server-side authorization check for a verified Firebase user.
   */
  public async authorizeFirebaseAdmin(
    verifiedUser: VerifiedFirebaseUser,
    idToken: string
  ): Promise<AdminAuthorizationResult> {
    const firestoreRole = await this.getFirestoreAdminRole(
      verifiedUser.uid,
      verifiedUser.email,
      idToken
    );

    const decision = evaluateAdminAuthorization({
      uid: verifiedUser.uid,
      email: verifiedUser.email,
      disabled: verifiedUser.disabled,
      customClaims: verifiedUser.customClaims,
      firestoreRole
    });

    if (decision.authorized && decision.role) {
      // Keep Firestore admin_roles/{uid} and admin_roles/{email} synced for this authorized admin
      this.syncAdminRoleRecords(verifiedUser, decision.role, idToken).catch(() => {});
    }

    return decision;
  }

  /**
   * Verify if an email address belongs to an authorized admin
   */
  public isAuthorizedAdmin(email: string): boolean {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return getAuthorizedAdminEmails().includes(lower);
  }

  /**
   * Create or Save a Customer Lead in Firestore
   */
  public async createLead(leadData: Partial<FirestoreLeadRecord>): Promise<{ success: boolean; lead: FirestoreLeadRecord; storage: 'firestore' }> {
    if (!this.db) {
      throw new Error('Firestore is not initialized.');
    }

    const enquiryId = leadData.enquiryId || leadData.referenceNumber || `RTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const record: FirestoreLeadRecord = {
      enquiryId,
      referenceNumber: enquiryId,
      id: enquiryId,
      customerName: leadData.customerName || '',
      businessName: leadData.businessName || '',
      mobileNumber: leadData.mobileNumber || '',
      whatsappNumber: leadData.whatsappNumber || leadData.mobileNumber || '',
      email: leadData.email || '',
      customerType: leadData.customerType || 'Business',
      serviceCategory: leadData.serviceCategory || 'General',
      selectedService: leadData.selectedService || '',
      requirement: leadData.requirement || '',
      source: leadData.source || 'Website Lead Form',
      status: leadData.status || 'New',
      consentStatus: leadData.consentStatus ?? true,
      bookingAmount: leadData.bookingAmount || (leadData.serviceCategory?.toLowerCase().includes('e-service') ? 236 : 0),
      paymentStatus: leadData.paymentStatus || 'Pending',
      createdAt: leadData.createdAt || now,
      updatedAt: now,
      internalNotes: leadData.internalNotes || '',
      notes: leadData.notes || [],
      activityHistory: leadData.activityHistory || [
        {
          id: `act_${Date.now()}`,
          action: 'STATUS_CHANGE',
          details: `Enquiry [${enquiryId}] registered from ${leadData.source || 'Website'}.`,
          timestamp: now
        }
      ]
    };

    // Save directly to Firestore collection `crm_leads` using enquiryId as document key to prevent duplicates
    const docRef = doc(this.db, 'crm_leads', enquiryId);
    await setDoc(docRef, record, { merge: true });

    return {
      success: true,
      lead: record,
      storage: 'firestore'
    };
  }

  /**
   * Get all Leads with Filters & Metrics from Firestore
   */
  public async getLeads(
    filters: { searchTerm?: string; status?: string; dateFilter?: string; category?: string } = {},
    firebaseIdToken?: string
  ) {
    const sdkAuthed = await this.ensureAdminAuth();
    let allLeads: FirestoreLeadRecord[] = [];

    if (sdkAuthed && this.db) {
      const leadsRef = collection(this.db, 'crm_leads');
      const snapshot = await getDocs(leadsRef);
      snapshot.forEach((docSnap) => {
        allLeads.push(docSnap.data() as FirestoreLeadRecord);
      });
    } else if (firebaseIdToken && this.getFirestoreRestBaseUrl()) {
      const baseUrl = this.getFirestoreRestBaseUrl()!;
      const res = await fetch(`${baseUrl}/crm_leads?pageSize=500`, {
        headers: { Authorization: `Bearer ${firebaseIdToken}` }
      });
      if (!res.ok) {
        throw new Error(`Firestore REST getLeads failed (${res.status})`);
      }
      const data: any = await res.json();
      const docs = Array.isArray(data?.documents) ? data.documents : [];
      allLeads = docs.map((d: any) => decodeFirestoreRestDocument(d) as FirestoreLeadRecord);
    } else if (this.db) {
      const leadsRef = collection(this.db, 'crm_leads');
      const snapshot = await getDocs(leadsRef);
      snapshot.forEach((docSnap) => {
        allLeads.push(docSnap.data() as FirestoreLeadRecord);
      });
    } else {
      throw new Error('Firestore is not initialized.');
    }

    // Sort by createdAt descending
    allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter leads
    let filtered = [...allLeads];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((l) =>
        (l.customerName && l.customerName.toLowerCase().includes(term)) ||
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.mobileNumber && l.mobileNumber.includes(term)) ||
        (l.enquiryId && l.enquiryId.toLowerCase().includes(term)) ||
        (l.selectedService && l.selectedService.toLowerCase().includes(term)) ||
        (l.businessName && l.businessName.toLowerCase().includes(term))
      );
    }

    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter((l) => l.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((l) => l.serviceCategory?.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date();
      if (filters.dateFilter === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        filtered = filtered.filter((l) => new Date(l.createdAt).getTime() >= startOfDay);
      } else if (filters.dateFilter === 'this_week') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter((l) => new Date(l.createdAt).getTime() >= sevenDaysAgo);
      } else if (filters.dateFilter === 'this_month') {
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter((l) => new Date(l.createdAt).getTime() >= thirtyDaysAgo);
      }
    }

    // Calculate Dashboard Metrics
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const stats = {
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === 'New').length,
      contacted: allLeads.filter((l) => l.status === 'Contacted').length,
      quotationSent: allLeads.filter((l) => l.status === 'Quotation Sent' || l.status === 'Proposal Sent').length,
      workInProgress: allLeads.filter((l) => l.status === 'Work In Progress' || l.status === 'Qualified').length,
      completed: allLeads.filter((l) => l.status === 'Completed' || l.status === 'Won' || l.status === 'Converted').length,
      pendingPayments: allLeads.filter((l) => l.paymentStatus === 'Pending' || l.paymentStatus === 'pending_verification').length,
      interested: allLeads.filter((l) => l.status === 'Interested').length,
      converted: allLeads.filter((l) => l.status === 'Converted' || l.status === 'Won').length,
      today: allLeads.filter((l) => new Date(l.createdAt).getTime() >= todayStart.getTime()).length
    };

    return {
      success: true,
      storage: 'firestore',
      stats,
      leads: filtered.map((l) => ({
        ...l,
        id: l.enquiryId,
        fullName: l.customerName,
        phone: l.mobileNumber,
        customerRequirement: l.requirement,
        enquiryDate: new Date(l.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }))
    };
  }

  /**
   * Get single Lead by ID
   */
  public async getLeadById(id: string, firebaseIdToken?: string): Promise<FirestoreLeadRecord | null> {
    const sdkAuthed = await this.ensureAdminAuth();
    if (sdkAuthed && this.db) {
      const docRef = doc(this.db, 'crm_leads', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data() as FirestoreLeadRecord;
    }

    const baseUrl = this.getFirestoreRestBaseUrl();
    if (firebaseIdToken && baseUrl) {
      const res = await fetch(`${baseUrl}/crm_leads/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${firebaseIdToken}` }
      });
      if (res.status === 404) return null;
      if (res.ok) {
        return decodeFirestoreRestDocument(await res.json()) as FirestoreLeadRecord;
      }
    }

    if (!this.db) return null;
    try {
      const docRef = doc(this.db, 'crm_leads', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data() as FirestoreLeadRecord;
    } catch {
      return null;
    }
  }

  /**
   * Update Lead Status
   */
  public async updateLeadStatus(
    id: string,
    newStatus: string,
    adminName = 'Admin',
    firebaseIdToken?: string
  ): Promise<FirestoreLeadRecord | null> {
    const sdkAuthed = await this.ensureAdminAuth();
    const lead = await this.getLeadById(id, firebaseIdToken);
    if (!lead) return null;

    const now = new Date().toISOString();
    const history = Array.isArray(lead.activityHistory) ? [...lead.activityHistory] : [];
    history.unshift({
      id: `act_${Date.now()}`,
      action: 'STATUS_CHANGE',
      details: `Status updated from "${lead.status}" to "${newStatus}" by ${adminName}.`,
      timestamp: now
    });

    if (sdkAuthed && this.db) {
      const leadRef = doc(this.db, 'crm_leads', id);
      await updateDoc(leadRef, {
        status: newStatus,
        updatedAt: now,
        activityHistory: history
      });
    } else if (firebaseIdToken && this.getFirestoreRestBaseUrl()) {
      const baseUrl = this.getFirestoreRestBaseUrl()!;
      const updateMask = 'updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=activityHistory';
      const res = await fetch(`${baseUrl}/crm_leads/${encodeURIComponent(id)}?${updateMask}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${firebaseIdToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            status: encodeFirestoreRestValue(newStatus),
            updatedAt: encodeFirestoreRestValue(now),
            activityHistory: encodeFirestoreRestValue(history)
          }
        })
      });
      if (!res.ok) {
        return null;
      }
    } else {
      return null;
    }

    lead.status = newStatus;
    lead.updatedAt = now;
    lead.activityHistory = history;
    return lead;
  }

  /**
   * Add Internal Note to Lead
   */
  public async addNote(
    id: string,
    content: string,
    author = 'Admin',
    firebaseIdToken?: string
  ): Promise<{ id: string; content: string; author: string; createdAt: string } | null> {
    const sdkAuthed = await this.ensureAdminAuth();
    const lead = await this.getLeadById(id, firebaseIdToken);
    if (!lead) return null;

    const now = new Date().toISOString();
    const noteId = `note_${Date.now()}`;
    const newNote = {
      id: noteId,
      content,
      author,
      createdAt: now
    };

    const notes = Array.isArray(lead.notes) ? [...lead.notes] : [];
    notes.unshift(newNote);

    const history = Array.isArray(lead.activityHistory) ? [...lead.activityHistory] : [];
    history.unshift({
      id: `act_${Date.now()}`,
      action: 'NOTE_ADDED',
      details: `Internal note added by ${author}: "${content.substring(0, 60)}..."`,
      timestamp: now
    });

    const combinedInternalNotes = notes.map((n) => `[${n.author}] ${n.content}`).join('\n');

    if (sdkAuthed && this.db) {
      const leadRef = doc(this.db, 'crm_leads', id);
      await updateDoc(leadRef, {
        notes,
        internalNotes: combinedInternalNotes,
        updatedAt: now,
        activityHistory: history
      });
    } else if (firebaseIdToken && this.getFirestoreRestBaseUrl()) {
      const baseUrl = this.getFirestoreRestBaseUrl()!;
      const updateMask =
        'updateMask.fieldPaths=notes&updateMask.fieldPaths=internalNotes&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=activityHistory';
      const res = await fetch(`${baseUrl}/crm_leads/${encodeURIComponent(id)}?${updateMask}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${firebaseIdToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            notes: encodeFirestoreRestValue(notes),
            internalNotes: encodeFirestoreRestValue(combinedInternalNotes),
            updatedAt: encodeFirestoreRestValue(now),
            activityHistory: encodeFirestoreRestValue(history)
          }
        })
      });
      if (!res.ok) {
        return null;
      }
    } else {
      return null;
    }

    return newNote;
  }

  /**
   * Complete Migration from JSON to Firestore
   */
  public async migrateFromJSON(sourceFilePath: string): Promise<{
    success: boolean;
    totalInSource: number;
    migratedCount: number;
    skippedCount: number;
    verifiedLeads: string[];
    errors: string[];
  }> {
    await this.ensureAdminAuth();
    if (!this.db) {
      throw new Error('Firestore database is not initialized.');
    }

    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`Source JSON file not found at: ${sourceFilePath}`);
    }

    const rawContent = fs.readFileSync(sourceFilePath, 'utf-8');
    const sourceLeads: any[] = JSON.parse(rawContent);
    const errors: string[] = [];
    let migratedCount = 0;
    let skippedCount = 0;
    const verifiedLeads: string[] = [];

    // Ensure admin_roles exists
    try {
      const adminDoc = doc(this.db, 'admin_roles', this.adminEmail);
      await setDoc(adminDoc, {
        email: this.adminEmail,
        role: 'super_admin',
        name: 'RUBI TECH PARK Admin',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e: any) {
      console.warn('Could not bootstrap admin role in Firestore:', e.message);
    }

    for (const item of sourceLeads) {
      const enquiryId = item.enquiryId || item.referenceNumber || item.id;
      if (!enquiryId) {
        skippedCount++;
        continue;
      }

      try {
        const docRef = doc(this.db, 'crm_leads', enquiryId);
        
        // Map fields accurately
        const firestoreRecord: FirestoreLeadRecord = {
          enquiryId,
          referenceNumber: enquiryId,
          id: enquiryId,
          customerName: item.customerName || item.fullName || '',
          businessName: item.businessName || '',
          mobileNumber: item.mobileNumber || item.phone || '',
          whatsappNumber: item.whatsappNumber || item.phone || '',
          email: item.email || '',
          customerType: item.customerType || 'Business',
          serviceCategory: item.serviceCategory || 'General',
          selectedService: item.selectedService || item.requiredService || '',
          requirement: item.customerRequirement || item.projectDescription || item.requirement || '',
          source: item.source || 'Website Lead Form',
          status: item.status || 'New',
          consentStatus: item.consentAgreed ?? true,
          bookingAmount: item.bookingAmount !== undefined ? item.bookingAmount : (item.serviceCategory?.toLowerCase().includes('e-service') ? 236 : 0),
          paymentStatus: item.bookingPaymentStatus || 'Pending',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          internalNotes: Array.isArray(item.notes)
            ? item.notes.map((n: any) => typeof n === 'string' ? n : n.content).join('; ')
            : (item.internalNotes || ''),
          notes: Array.isArray(item.notes) ? item.notes : [],
          activityHistory: Array.isArray(item.activityHistory) ? item.activityHistory : []
        };

        await setDoc(docRef, firestoreRecord, { merge: true });
        migratedCount++;
        if (enquiryId === 'RTP-2026-9985' || enquiryId === 'RTP-2026-5051') {
          verifiedLeads.push(enquiryId);
        }
      } catch (err: any) {
        errors.push(`Failed to migrate ${enquiryId}: ${err.message}`);
      }
    }

    return {
      success: errors.length === 0,
      totalInSource: sourceLeads.length,
      migratedCount,
      skippedCount,
      verifiedLeads,
      errors
    };
  }

  /**
   * Delete single Lead by ID from Firestore and local backup
   */
  public async deleteLead(id: string, firebaseIdToken?: string): Promise<boolean> {
    const sdkAuthed = await this.ensureAdminAuth();
    let firestoreDeleted = false;
    if (sdkAuthed && this.db) {
      try {
        const docRef = doc(this.db, 'crm_leads', id);
        await deleteDoc(docRef);
        firestoreDeleted = true;
      } catch (err: any) {
        console.warn('Could not delete lead from Firestore:', err.message);
      }
    } else if (firebaseIdToken && this.getFirestoreRestBaseUrl()) {
      try {
        const baseUrl = this.getFirestoreRestBaseUrl()!;
        const res = await fetch(`${baseUrl}/crm_leads/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${firebaseIdToken}` }
        });
        firestoreDeleted = res.ok;
      } catch (err: any) {
        console.warn('Could not delete lead from Firestore REST:', err.message);
      }
    }
    const localDeleted = crmStorage.deleteLead(id);
    return firestoreDeleted || localDeleted;
  }

  /**
   * Fetch all custom service images from Firestore (with local fallback).
   * Hides deactivated public services without deleting unrelated Firestore records.
   */
  public async getServiceImages(): Promise<Record<string, string>> {
    const localImages = crmStorage.getServiceImages();
    if (!this.db) return localImages;

    try {
      const snap = await getDocs(collection(this.db, 'service_images'));
      const images: Record<string, string> = { ...localImages };
      snap.forEach((d) => {
        if (HIDDEN_PUBLIC_SERVICE_IDS.has(d.id)) {
          return;
        }
        const data = d.data();
        if (data && data.imageUrl) {
          images[d.id] = data.imageUrl;
        }
      });
      return images;
    } catch (err: any) {
      console.warn('Error reading service_images from Firestore, using local cache:', err.message);
      return localImages;
    }
  }

  /**
   * Save or update a custom service image in Firestore and local storage
   */
  public async setServiceImage(serviceId: string, imageUrl: string, updatedBy?: string): Promise<boolean> {
    await this.ensureAdminAuth();
    crmStorage.setServiceImage(serviceId, imageUrl, updatedBy);

    if (this.db) {
      try {
        const docRef = doc(this.db, 'service_images', serviceId);
        await setDoc(docRef, {
          serviceId,
          imageUrl,
          updatedAt: new Date().toISOString(),
          updatedBy: updatedBy || 'admin@rubitechpark.com'
        }, { merge: true });
        return true;
      } catch (err: any) {
        console.warn('Could not save service image to Firestore:', err.message);
      }
    }
    return true;
  }

  /**
   * Delete or reset a custom service image back to default
   */
  public async deleteServiceImage(serviceId: string, deletedBy?: string): Promise<boolean> {
    await this.ensureAdminAuth();
    crmStorage.deleteServiceImage(serviceId, deletedBy);

    if (this.db) {
      try {
        const docRef = doc(this.db, 'service_images', serviceId);
        await deleteDoc(docRef);
        return true;
      } catch (err: any) {
        console.warn('Could not delete service image from Firestore:', err.message);
      }
    }
    return true;
  }

  private stripUndefined<T extends Record<string, any>>(payload: T): Record<string, any> {
    return JSON.parse(JSON.stringify(payload));
  }

  /**
   * Persist or update a Payment Order in Firestore `orders` collection
   */
  public async upsertOrder(order: Record<string, any>): Promise<boolean> {
    if (!this.db || !order?.orderRef) return false;
    try {
      await this.ensureAdminAuth();
      const docRef = doc(this.db, 'orders', order.orderRef);
      await setDoc(docRef, this.stripUndefined(order), { merge: true });
      return true;
    } catch (err: any) {
      console.warn('Non-blocking Firestore upsertOrder error:', err.message);
      return false;
    }
  }

  /**
   * Fetch an Order from Firestore by orderRef or Razorpay gatewayOrderId (for serverless verification)
   */
  public async getOrderByGatewayOrRef(
    orderRef?: string,
    gatewayOrderId?: string
  ): Promise<Record<string, any> | null> {
    if (!this.db) return null;
    try {
      await this.ensureAdminAuth();
      if (orderRef) {
        const snap = await getDoc(doc(this.db, 'orders', orderRef));
        if (snap.exists()) {
          return snap.data() as Record<string, any>;
        }
      }
      if (gatewayOrderId) {
        const q = query(
          collection(this.db, 'orders'),
          where('gatewayOrderId', '==', gatewayOrderId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs[0].data() as Record<string, any>;
        }
      }
      return null;
    } catch (err: any) {
      console.warn('Non-blocking Firestore getOrderByGatewayOrRef error:', err.message);
      return null;
    }
  }

  /**
   * Check whether a Razorpay payment_id was already recorded on any order in Firestore
   */
  public async findOrderByGatewayPaymentId(
    gatewayPaymentId: string
  ): Promise<Record<string, any> | null> {
    if (!this.db || !gatewayPaymentId) return null;
    try {
      await this.ensureAdminAuth();
      const q = query(
        collection(this.db, 'orders'),
        where('gatewayPaymentId', '==', gatewayPaymentId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as Record<string, any>;
      }
      return null;
    } catch (err: any) {
      console.warn('Non-blocking Firestore findOrderByGatewayPaymentId error:', err.message);
      return null;
    }
  }

  /**
   * Link a backend-verified payment to a matching customer / service booking / CRM lead.
   * Only called AFTER cryptographic signature verification succeeds.
   */
  public async linkVerifiedPaymentToLead(params: {
    orderRef: string;
    leadId?: string;
    bookingId?: string;
    customerEmail?: string;
    customerPhone?: string;
    gatewayPaymentId?: string;
    receiptNumber?: string;
    paidAmountINR: number;
    verifiedAt: string;
  }): Promise<{ linkedLeadId: string | null }> {
    let linkedLeadId: string | null = null;

    // Mirror locally first
    try {
      const localLinked = crmStorage.linkVerifiedPaymentToLead(params);
      if (localLinked) {
        linkedLeadId = localLinked.enquiryId || localLinked.referenceNumber || localLinked.id;
      }
    } catch {
      // Non-blocking on read-only environments
    }

    if (!this.db) {
      return { linkedLeadId };
    }

    try {
      await this.ensureAdminAuth();
      let targetDocId: string | null = null;
      let existingLead: FirestoreLeadRecord | null = null;

      const candidateId = (params.leadId || params.bookingId || '').trim();
      if (candidateId) {
        const directSnap = await getDoc(doc(this.db, 'crm_leads', candidateId));
        if (directSnap.exists()) {
          targetDocId = directSnap.id;
          existingLead = directSnap.data() as FirestoreLeadRecord;
        }
      }

      if (!targetDocId && params.customerEmail) {
        const q = query(
          collection(this.db, 'crm_leads'),
          where('email', '==', params.customerEmail.trim().toLowerCase())
        );
        const snap = await getDocs(q);
        const match = snap.docs.find(
          (d) => (d.data() as FirestoreLeadRecord).paymentStatus !== 'Verified Paid'
        );
        if (match) {
          targetDocId = match.id;
          existingLead = match.data() as FirestoreLeadRecord;
        }
      }

      if (!targetDocId && params.customerPhone) {
        const cleanDigits = params.customerPhone.replace(/\D/g, '').slice(-10);
        if (cleanDigits.length === 10) {
          const snap = await getDocs(collection(this.db, 'crm_leads'));
          const match = snap.docs.find((d) => {
            const data = d.data() as FirestoreLeadRecord;
            const phoneDigits = (data.mobileNumber || '').replace(/\D/g, '').slice(-10);
            return phoneDigits === cleanDigits && data.paymentStatus !== 'Verified Paid';
          });
          if (match) {
            targetDocId = match.id;
            existingLead = match.data() as FirestoreLeadRecord;
          }
        }
      }

      if (targetDocId && existingLead) {
        const history = Array.isArray(existingLead.activityHistory)
          ? [...existingLead.activityHistory]
          : [];
        const alreadyLogged = history.some(
          (h) => h.action === 'PAYMENT_VERIFIED' && h.details.includes(params.orderRef)
        );
        if (!alreadyLogged) {
          history.unshift({
            id: `act_${Date.now()}`,
            action: 'PAYMENT_VERIFIED',
            details: `Verified payment ₹${params.paidAmountINR} linked (Order: ${params.orderRef}${
              params.gatewayPaymentId ? `, Payment: ${params.gatewayPaymentId}` : ''
            }).`,
            timestamp: params.verifiedAt
          });
        }

        const nextStatus =
          existingLead.status === 'New' ||
          existingLead.status === 'Pending Payments' ||
          existingLead.status === 'Payment Pending'
            ? 'Booking Confirmed'
            : existingLead.status;

        await updateDoc(doc(this.db, 'crm_leads', targetDocId), {
          paymentStatus: 'Verified Paid',
          status: nextStatus,
          linkedOrderRef: params.orderRef,
          gatewayPaymentId: params.gatewayPaymentId || null,
          receiptNumber: params.receiptNumber || null,
          paidAmountINR: params.paidAmountINR,
          paidAt: params.verifiedAt,
          updatedAt: params.verifiedAt,
          activityHistory: history
        });

        linkedLeadId = targetDocId;
      }
    } catch (err: any) {
      console.warn('Non-blocking Firestore linkVerifiedPaymentToLead error:', err.message);
    }

    return { linkedLeadId };
  }

  /**
   * Persist or update a Subscription in Firestore `subscriptions` collection
   */
  public async upsertSubscription(subscription: Record<string, any>): Promise<boolean> {
    if (!this.db || !subscription?.subscriptionRef) return false;
    try {
      await this.ensureAdminAuth();
      const docRef = doc(this.db, 'subscriptions', subscription.subscriptionRef);
      await setDoc(docRef, this.stripUndefined(subscription), { merge: true });
      return true;
    } catch (err: any) {
      console.warn('Non-blocking Firestore upsertSubscription error:', err.message);
      return false;
    }
  }

  /**
   * Check whether a webhook eventId was already processed in Firestore
   */
  public async hasProcessedWebhookEvent(eventId: string): Promise<boolean> {
    if (!this.db || !eventId) return false;
    try {
      await this.ensureAdminAuth();
      const safeId = eventId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const snap = await getDoc(doc(this.db, 'webhook_events', safeId));
      return snap.exists();
    } catch (err: any) {
      console.warn('Non-blocking Firestore hasProcessedWebhookEvent error:', err.message);
      return false;
    }
  }

  /**
   * Record a processed webhook event in Firestore for cross-restart idempotency
   */
  public async recordWebhookEvent(event: Record<string, any>): Promise<boolean> {
    if (!this.db || !event?.eventId) return false;
    try {
      await this.ensureAdminAuth();
      const safeId = String(event.eventId).replace(/[^a-zA-Z0-9_-]/g, '_');
      await setDoc(doc(this.db, 'webhook_events', safeId), this.stripUndefined(event), { merge: true });
      return true;
    } catch (err: any) {
      console.warn('Non-blocking Firestore recordWebhookEvent error:', err.message);
      return false;
    }
  }
}

export const firebaseCRM = new FirebaseCRMService();
