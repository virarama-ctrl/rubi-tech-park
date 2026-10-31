import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { crmStorage } from './storage';
import { StoredLead, LeadStatus } from '../types/crm';

dotenv.config();

export interface SupabaseLeadRow {
  id: string;
  customer_name: string;
  phone_number: string;
  email: string;
  business_name: string | null;
  service_interested: string;
  message: string | null;
  source_page: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseConfigStatus {
  configured: boolean;
  connected: boolean;
  urlConfigured: boolean;
  keyConfigured: boolean;
  error: string | null;
  mode: 'supabase' | 'local_persistent';
  requiredEnvVars: string[];
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private isConfigured: boolean = false;
  private lastConnectionCheck: { connected: boolean; error: string | null; timestamp: number } = {
    connected: false,
    error: null,
    timestamp: 0
  };

  constructor() {
    this.initClient();
  }

  public initClient() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseKey.includes('placeholder')) {
      try {
        this.client = createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
        this.isConfigured = true;
      } catch (err: any) {
        console.error('Failed to initialize Supabase client:', err.message);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  /**
   * Check connection status to Supabase
   */
  public async getStatus(): Promise<SupabaseConfigStatus> {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    const urlConfigured = Boolean(supabaseUrl && !supabaseUrl.includes('placeholder'));
    const keyConfigured = Boolean(supabaseKey && !supabaseKey.includes('placeholder'));

    if (!this.client || !urlConfigured || !keyConfigured) {
      return {
        configured: false,
        connected: false,
        urlConfigured,
        keyConfigured,
        error: 'Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not yet configured.',
        mode: 'local_persistent',
        requiredEnvVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
      };
    }

    // Cache check for 10 seconds to avoid excessive network queries
    const now = Date.now();
    if (now - this.lastConnectionCheck.timestamp < 10000) {
      return {
        configured: true,
        connected: this.lastConnectionCheck.connected,
        urlConfigured,
        keyConfigured,
        error: this.lastConnectionCheck.error,
        mode: this.lastConnectionCheck.connected ? 'supabase' : 'local_persistent',
        requiredEnvVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
      };
    }

    try {
      const { data, error } = await this.client.from('leads').select('id').limit(1);
      if (error) {
        this.lastConnectionCheck = {
          connected: false,
          error: `Supabase query failed: ${error.message}. Please verify that you ran the SQL schema in supabase/schema.sql.`,
          timestamp: now
        };
      } else {
        this.lastConnectionCheck = {
          connected: true,
          error: null,
          timestamp: now
        };
      }
    } catch (err: any) {
      this.lastConnectionCheck = {
        connected: false,
        error: `Supabase connection failed: ${err.message}`,
        timestamp: now
      };
    }

    return {
      configured: true,
      connected: this.lastConnectionCheck.connected,
      urlConfigured,
      keyConfigured,
      error: this.lastConnectionCheck.error,
      mode: this.lastConnectionCheck.connected ? 'supabase' : 'local_persistent',
      requiredEnvVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    };
  }

  /**
   * Save a newly submitted lead.
   * If Supabase is connected, inserts directly to Supabase AND mirrors to persistent storage.
   * If Supabase is not configured, saves to persistent storage so zero leads are ever lost.
   */
  public async createLead(leadData: {
    customer_name: string;
    phone_number: string;
    email: string;
    business_name?: string;
    service_interested: string;
    message?: string;
    source_page?: string;
  }, clientIp: string): Promise<{ success: boolean; lead: any; storage: 'supabase' | 'local_persistent'; error?: string }> {
    // 1. Mirror into persistent local storage for bulletproof reliability
    const localLead = crmStorage.createLead(
      {
        fullName: leadData.customer_name,
        businessName: leadData.business_name || '',
        email: leadData.email,
        phone: leadData.phone_number,
        businessType: 'other',
        requiredService: leadData.service_interested as any,
        budgetRange: '₹15,000 - ₹35,000',
        projectDescription: leadData.message || '',
        preferredContactMethod: 'WhatsApp',
        consentAgreed: true
      },
      clientIp
    );

    // 2. If Supabase is configured, attempt direct database insertion
    const status = await this.getStatus();
    if (status.connected && this.client) {
      try {
        const { data, error } = await this.client
          .from('leads')
          .insert([
            {
              customer_name: leadData.customer_name,
              phone_number: leadData.phone_number,
              email: leadData.email,
              business_name: leadData.business_name || null,
              service_interested: leadData.service_interested,
              message: leadData.message || null,
              source_page: leadData.source_page || 'Website',
              status: 'New'
            }
          ])
          .select()
          .single();

        if (error) {
          console.warn('Supabase insert failed, relied on persistent local storage:', error.message);
          return {
            success: true,
            lead: localLead,
            storage: 'local_persistent',
            error: error.message
          };
        }

        return {
          success: true,
          lead: {
            ...localLead,
            id: data.id,
            supabaseId: data.id,
            customer_name: data.customer_name,
            phone_number: data.phone_number,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          },
          storage: 'supabase'
        };
      } catch (err: any) {
        console.warn('Error connecting to Supabase during insert:', err.message);
      }
    }

    return {
      success: true,
      lead: localLead,
      storage: 'local_persistent'
    };
  }

  /**
   * Fetch all leads with optional filtering
   */
  public async getLeads(filters: {
    searchTerm?: string;
    status?: string;
    dateFilter?: string;
  }): Promise<{
    leads: any[];
    stats: {
      total: number;
      new: number;
      contacted: number;
      interested: number;
      converted: number;
      today: number;
    };
    storage: 'supabase' | 'local_persistent';
  }> {
    const status = await this.getStatus();

    if (status.connected && this.client) {
      try {
        let query = this.client.from('leads').select('*').order('created_at', { ascending: false });

        if (filters.status && filters.status !== 'All') {
          query = query.eq('status', filters.status);
        }

        if (filters.searchTerm) {
          query = query.or(
            `customer_name.ilike.%${filters.searchTerm}%,phone_number.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,business_name.ilike.%${filters.searchTerm}%`
          );
        }

        const { data, error } = await query;
        if (!error && data) {
          // Compute today's enquiries
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);

          // Get full stats
          const { data: allRows } = await this.client.from('leads').select('status, created_at');
          const all = allRows || data;

          const stats = {
            total: all.length,
            new: all.filter((l: any) => l.status === 'New').length,
            contacted: all.filter((l: any) => l.status === 'Contacted').length,
            interested: all.filter((l: any) => l.status === 'Interested' || l.status === 'Qualified').length,
            converted: all.filter((l: any) => l.status === 'Converted' || l.status === 'Won').length,
            today: all.filter((l: any) => new Date(l.created_at) >= startOfToday).length,
            qualified: all.filter((l: any) => l.status === 'Qualified' || l.status === 'Interested').length,
            proposalSent: all.filter((l: any) => l.status === 'Proposal Sent').length,
            won: all.filter((l: any) => l.status === 'Won' || l.status === 'Converted').length,
            lost: all.filter((l: any) => l.status === 'Lost' || l.status === 'Not Interested').length,
            totalPipelineValueINR: 0
          };

          const formattedLeads = data.map((row: SupabaseLeadRow) => ({
            id: row.id,
            referenceNumber: `RTP-${row.id.slice(0, 8).toUpperCase()}`,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            status: row.status,
            fullName: row.customer_name,
            businessName: row.business_name || '',
            email: row.email,
            phone: row.phone_number,
            requiredService: row.service_interested,
            projectDescription: row.message || '',
            sourcePage: row.source_page || 'Website',
            adminNotes: row.admin_notes || '',
            notes: row.admin_notes ? [{
              id: 'supa_note_1',
              authorId: 'admin',
              authorName: 'Admin',
              content: row.admin_notes,
              createdAt: row.updated_at
            }] : [],
            preferredContactMethod: 'WhatsApp'
          }));

          return {
            leads: formattedLeads,
            stats,
            storage: 'supabase'
          };
        }
      } catch (err: any) {
        console.warn('Failed to retrieve leads from Supabase, falling back to local persistent store:', err.message);
      }
    }

    // Fallback: Persistent Local CRM Storage
    const allLocal = crmStorage.getAllLeads();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const filtered = crmStorage.getAllLeads({
      searchTerm: filters.searchTerm,
      status: filters.status && filters.status !== 'All' ? (filters.status as any) : undefined
    });

    const stats = {
      total: allLocal.length,
      new: allLocal.filter((l) => l.status === 'New').length,
      contacted: allLocal.filter((l) => l.status === 'Contacted').length,
      interested: allLocal.filter((l) => l.status === 'Qualified' || (l.status as any) === 'Interested').length,
      converted: allLocal.filter((l) => l.status === 'Won' || (l.status as any) === 'Converted').length,
      today: allLocal.filter((l) => new Date(l.createdAt) >= startOfToday).length,
      qualified: allLocal.filter((l) => l.status === 'Qualified').length,
      proposalSent: allLocal.filter((l) => l.status === 'Proposal Sent').length,
      won: allLocal.filter((l) => l.status === 'Won').length,
      lost: allLocal.filter((l) => l.status === 'Lost' || (l.status as any) === 'Not Interested').length,
      totalPipelineValueINR: allLocal.reduce((sum, l) => sum + (l.internalEstimatedValueINR || 0), 0)
    };

    return {
      leads: filtered.map((l) => ({
        ...l,
        customer_name: l.fullName,
        phone_number: l.phone,
        service_interested: l.requiredService,
        message: l.projectDescription,
        source_page: 'Website',
        admin_notes: l.notes?.map((n) => n.content).join('; ') || ''
      })),
      stats,
      storage: 'local_persistent'
    };
  }

  /**
   * Update lead status in Supabase and local store
   */
  public async updateLeadStatus(id: string, status: string, adminName: string): Promise<any> {
    const connStatus = await this.getStatus();
    if (connStatus.connected && this.client) {
      try {
        const { data, error } = await this.client
          .from('leads')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          crmStorage.updateLeadStatus(id, status as any, adminName);
          return {
            id: data.id,
            status: data.status,
            customer_name: data.customer_name,
            fullName: data.customer_name,
            phone_number: data.phone_number,
            phone: data.phone_number,
            email: data.email,
            business_name: data.business_name,
            service_interested: data.service_interested,
            requiredService: data.service_interested,
            updatedAt: data.updated_at
          };
        }
      } catch (err: any) {
        console.warn('Failed to update status in Supabase:', err.message);
      }
    }

    // Local persistent update
    const updated = crmStorage.updateLeadStatus(id, status as any, adminName);
    return updated;
  }

  /**
   * Add internal note to lead
   */
  public async addNote(id: string, noteText: string, adminName: string): Promise<any> {
    const connStatus = await this.getStatus();
    if (connStatus.connected && this.client) {
      try {
        const { data: existing } = await this.client.from('leads').select('admin_notes').eq('id', id).single();
        const combined = existing?.admin_notes
          ? `${existing.admin_notes}\n[${new Date().toLocaleDateString()}] ${noteText}`
          : `[${new Date().toLocaleDateString()}] ${noteText}`;

        await this.client
          .from('leads')
          .update({ admin_notes: combined, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err: any) {
        console.warn('Failed to add note in Supabase:', err.message);
      }
    }

    // Local persistent note
    const note = crmStorage.addLeadNote(id, 'admin', adminName, noteText);
    return note;
  }

  /**
   * Delete lead by ID
   */
  public async deleteLead(id: string): Promise<boolean> {
    const connStatus = await this.getStatus();
    if (connStatus.connected && this.client) {
      try {
        const { error } = await this.client.from('leads').delete().eq('id', id);
        if (!error) return true;
      } catch (err: any) {
        console.warn('Failed to delete lead from Supabase:', err.message);
      }
    }

    // Local persistent delete
    return crmStorage.deleteLead(id);
  }
}

export const supabaseService = new SupabaseService();
