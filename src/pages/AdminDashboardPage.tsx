import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { StoredLead, LeadStatus, AuditLogEntry, PaymentRecord } from '../types/crm';
import { formatINR } from '../utils/pricing';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Database,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Plus,
  X,
  FileText,
  MessageSquare,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  CreditCard,
  Copy,
  Check,
  Ban,
  Trash2,
  Server,
  CloudCheck,
  HelpCircle,
  ArrowUpDown,
  Building2,
  Send
} from 'lucide-react';

interface SupabaseConfigStatus {
  configured: boolean;
  connected: boolean;
  urlConfigured: boolean;
  keyConfigured: boolean;
  error: string | null;
  mode: 'supabase' | 'local_persistent';
  requiredEnvVars: string[];
}

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onLogout }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);

  // Leads & Data State
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    interested: 0,
    converted: 0,
    today: 0,
    qualified: 0,
    proposalSent: 0,
    won: 0,
    lost: 0,
    totalPipelineValueINR: 0
  });

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // UI & Filter States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'payments' | 'audit'>('pipeline');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Online Payments & Orders State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentStats, setPaymentStats] = useState({
    totalOrders: 0,
    paidCount: 0,
    pendingVerificationCount: 0,
    failedCount: 0,
    totalRevenueINR: 0
  });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Selected Lead Drawer / Detail Modal
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Backup status
  const [backupStatus, setBackupStatus] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(id);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // Fetch Supabase status
  const checkSupabaseStatus = async () => {
    setIsCheckingSupabase(true);
    try {
      const res = await fetch('/api/admin/supabase-status');
      if (res.ok) {
        const data: SupabaseConfigStatus = await res.json();
        setSupabaseStatus(data);
      }
    } catch (e) {
      console.warn('Could not query Supabase status:', e);
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  // Check auth and load leads
  useEffect(() => {
    const storedToken = sessionStorage.getItem('rtp_admin_token') || sessionStorage.getItem('edh_admin_token');
    const storedUser = sessionStorage.getItem('rtp_admin_user') || sessionStorage.getItem('edh_admin_user');

    if (!storedToken) {
      onNavigate('admin-login');
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore
      }
    }

    fetchLeads(storedToken);
    fetchPayments(storedToken);
    checkSupabaseStatus();
  }, []);

  const fetchPayments = async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) return;

    try {
      const q = paymentStatusFilter !== 'all' ? `?status=${paymentStatusFilter}` : '';
      const res = await fetch(`/api/admin/payments${q}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        if (data.stats) setPaymentStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Payment confirmed and verified Paid.');
        fetchPayments(token);
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!token) return;
    const reason = prompt(
      'Reason for rejection (e.g. UTR not matched in bank statement):',
      'Bank statement shows no credit for submitted UTR'
    );
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Payment marked as Failed/Rejected.');
        fetchPayments(token);
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('searchTerm', searchTerm);
      if (statusFilter && statusFilter !== 'All') queryParams.set('status', statusFilter);
      if (dateFilter && dateFilter !== 'all') queryParams.set('dateFilter', dateFilter);

      const res = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('rtp_admin_token');
          sessionStorage.removeItem('edh_admin_token');
          sessionStorage.removeItem('rtp_admin_user');
          sessionStorage.removeItem('edh_admin_user');
          onNavigate('admin-login');
          return;
        }
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch leads');
      }

      const data = await res.json();
      let fetchedLeads = data.leads || [];

      // Client-side date filter refinement if applied
      if (dateFilter === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        fetchedLeads = fetchedLeads.filter((l: any) => new Date(l.createdAt || l.created_at) >= startOfToday);
      } else if (dateFilter === '7days') {
        const past7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        fetchedLeads = fetchedLeads.filter((l: any) => new Date(l.createdAt || l.created_at) >= past7);
      } else if (dateFilter === '30days') {
        const past30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        fetchedLeads = fetchedLeads.filter((l: any) => new Date(l.createdAt || l.created_at) >= past30);
      }

      setLeads(fetchedLeads);
      if (data.stats) {
        setStats((prev) => ({
          ...prev,
          ...data.stats
        }));
      }

      // Synchronize selected lead drawer if open
      if (selectedLead) {
        const refreshed = fetchedLeads.find((l: any) => l.id === selectedLead.id);
        if (refreshed) setSelectedLead(refreshed);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error connecting to CRM server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Audit logs error:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) fetchLeads(token);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('all');
    if (token) {
      setTimeout(() => fetchLeads(token), 0);
    }
  };

  // Status Update Handler
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (!token) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Lead status updated to "${newStatus}"`);
        fetchLeads(token);
      } else {
        const d = await res.json();
        alert(d.message || 'Status update failed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add Note Handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedLead || !newNoteText.trim()) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNoteText.trim() })
      });

      if (res.ok) {
        setNewNoteText('');
        showToast('Internal note saved to lead record.');
        fetchLeads(token);
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to add note.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Lead Handler
  const confirmDeleteLead = async () => {
    if (!token || !leadToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/leads/${leadToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast(`Lead "${leadToDelete.fullName || leadToDelete.customer_name}" permanently deleted.`);
        if (selectedLead && selectedLead.id === leadToDelete.id) {
          setSelectedLead(null);
        }
        setLeadToDelete(null);
        fetchLeads(token);
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to delete lead.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting lead.');
    } finally {
      setIsDeleting(false);
    }
  };

  // CSV Export
  const handleExportCSV = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/export-csv', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        alert('CSV export unauthorized or failed.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rubitechpark_leads_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Lead CSV export downloaded securely.');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Manual Backup
  const handleTriggerBackup = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setBackupStatus(`Backup snapshot recorded: ${d.backup.filename}`);
        showToast('Database backup snapshot recorded.');
        setTimeout(() => setBackupStatus(''), 6000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutClick = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // ignore
      }
    }
    sessionStorage.removeItem('rtp_admin_token');
    sessionStorage.removeItem('edh_admin_token');
    sessionStorage.removeItem('rtp_admin_user');
    sessionStorage.removeItem('edh_admin_user');
    onLogout();
    onNavigate('home');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/70 dark:border-blue-800';
      case 'Contacted':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/70 dark:border-amber-800';
      case 'Interested':
      case 'Qualified':
        return 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-950/70 dark:border-purple-800';
      case 'Converted':
      case 'Won':
      case 'Proposal Sent':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-800';
      case 'Not Interested':
      case 'Lost':
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/70 dark:border-rose-800';
    }
  };

  const copySqlSchema = () => {
    const sql = `-- RUBI TECH PARK - Supabase SQL Schema
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    business_name TEXT,
    service_interested TEXT NOT NULL,
    message TEXT,
    source_page TEXT DEFAULT 'Website',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Not Interested', 'Qualified', 'Proposal Sent', 'Won', 'Lost')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public lead inserts" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow service role full lead access" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#E9EEF3] dark:bg-[#101B2C] text-[#182638] dark:text-[#F1F5F9] pb-20 transition-colors">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-white dark:bg-[#1C2B40] border border-[#315D82] dark:border-[#6F9FC5] px-4 py-3 rounded-xl shadow-lg text-xs text-[#182638] dark:text-[#F1F5F9] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Sub-Bar */}
      <div className="bg-white/95 dark:bg-[#17263A]/95 backdrop-blur-md border-b border-[#D5DEE8] dark:border-[#30445B] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] bg-black flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
                alt="RUBI TECH PARK"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                  RUBI TECH PARK Admin
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#315D82]/10 text-[#315D82] dark:bg-[#6F9FC5]/20 dark:text-[#6F9FC5] font-semibold">
                  CRM Console
                </span>
              </div>
              <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] flex items-center gap-2">
                <span>{user?.name || 'Administrator'} ({user?.email || 'admin@rubitechpark.com'})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Firebase Firestore Status Pill */}
            <div
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border flex items-center gap-1.5 bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-xs"
              title="Firebase Cloud Firestore: crm_leads collection active"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden sm:inline font-mono">
                Firestore: crm_leads ({stats.total})
              </span>
              <span className="sm:hidden font-mono">
                Firestore ({stats.total})
              </span>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="hidden md:flex px-3 py-1.5 text-xs text-[#182638] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg transition-colors cursor-pointer items-center gap-1.5"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3 text-[#315D82] dark:text-[#6F9FC5]" />
            </button>

            <button
              onClick={handleTriggerBackup}
              title="Record instant database backup snapshot"
              className="hidden lg:flex px-3 py-1.5 text-xs text-[#182638] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg transition-colors cursor-pointer items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-[#526477] dark:text-[#B8C5D4]" />
              <span>Snapshot</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#315D82] dark:bg-[#416F98] hover:opacity-95 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="p-2 text-[#526477] hover:text-rose-600 dark:text-[#B8C5D4] dark:hover:text-rose-400 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg transition-colors cursor-pointer"
              title="Sign Out of CRM"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {backupStatus && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{backupStatus}</span>
          </div>
        )}

        {/* Firebase Cloud Firestore Active Info Banner */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#172033] dark:text-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-[#172033] dark:text-white flex items-center gap-2">
                <span>Firebase Cloud Firestore Active</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                  crm_leads ({stats.total} Records)
                </span>
              </p>
              <p className="text-[11px] text-[#647087] dark:text-slate-400 mt-0.5">
                All enquiries from Website Lead Forms and the RUBI Assistant Chatbot save to Firestore with Zero-Trust ABAC rules.
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-white/80 dark:bg-purple-950/50 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800 shrink-0">
            Project: possible-coral-nkx2q
          </div>
        </div>

        {/* 7 Required KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Total Leads */}
          <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-sm hover:border-[#6654E8]/40 transition-colors">
            <span className="text-[10px] font-semibold text-[#647087] dark:text-slate-400 uppercase tracking-wider block">
              Total Leads
            </span>
            <div className="mt-1 text-xl font-bold font-display text-[#172033] dark:text-white tabular-nums">
              {stats.total}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">All Firestore</div>
          </div>

          {/* 2. New Leads */}
          <div className="bg-white dark:bg-[#0D1527] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3.5 shadow-sm hover:border-blue-400 transition-colors">
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              New Leads
            </span>
            <div className="mt-1 text-xl font-bold font-display text-blue-700 dark:text-blue-300 tabular-nums">
              {stats.new}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">Needs Callback</div>
          </div>

          {/* 3. Contacted Leads */}
          <div className="bg-white dark:bg-[#0D1527] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-3.5 shadow-sm hover:border-amber-400 transition-colors">
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Contacted
            </span>
            <div className="mt-1 text-xl font-bold font-display text-amber-700 dark:text-amber-300 tabular-nums">
              {stats.contacted}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">First Touch</div>
          </div>

          {/* 4. Quotation Sent */}
          <div className="bg-white dark:bg-[#0D1527] border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-3.5 shadow-sm hover:border-indigo-400 transition-colors">
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Quotation Sent
            </span>
            <div className="mt-1 text-xl font-bold font-display text-indigo-700 dark:text-indigo-300 tabular-nums">
              {(stats as any).quotationSent ?? stats.proposalSent ?? 0}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">Proposal Out</div>
          </div>

          {/* 5. Work In Progress */}
          <div className="bg-white dark:bg-[#0D1527] border border-purple-200 dark:border-purple-900/40 rounded-2xl p-3.5 shadow-sm hover:border-purple-400 transition-colors">
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Work In Progress
            </span>
            <div className="mt-1 text-xl font-bold font-display text-purple-700 dark:text-purple-300 tabular-nums">
              {(stats as any).workInProgress ?? stats.qualified ?? 0}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">In Execution</div>
          </div>

          {/* 6. Completed Leads */}
          <div className="bg-white dark:bg-[#0D1527] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3.5 shadow-sm hover:border-emerald-400 transition-colors">
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Completed
            </span>
            <div className="mt-1 text-xl font-bold font-display text-emerald-700 dark:text-emerald-300 tabular-nums">
              {(stats as any).completed ?? stats.converted ?? 0}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">Delivered / Won</div>
          </div>

          {/* 7. Pending Payments */}
          <div className="bg-white dark:bg-[#0D1527] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-3.5 shadow-sm hover:border-rose-400 transition-colors">
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Pending Payments
            </span>
            <div className="mt-1 text-xl font-bold font-display text-rose-700 dark:text-rose-300 tabular-nums">
              {(stats as any).pendingPayments ?? paymentStats.pendingVerificationCount ?? 0}
            </div>
            <div className="text-[10px] text-[#647087] dark:text-slate-500 mt-0.5">Awaiting UTR</div>
          </div>
        </div>

        {/* Tab Navigation: Pipeline Leads vs Online Payments vs Security Audit */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E9F2] dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#6654E8] text-white shadow-sm'
                : 'text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
            }`}
          >
            Customer Leads ({leads.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('payments');
              fetchPayments();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-[#6654E8] text-white shadow-sm'
                : 'text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Orders & UPI ({payments.length})</span>
            {paymentStats.pendingVerificationCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {paymentStats.pendingVerificationCount} Pending
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              fetchAuditLogs();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#6654E8] text-white shadow-sm'
                : 'text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
            }`}
          >
            Security & Audit Logs
          </button>
        </div>

        {activeTab === 'pipeline' ? (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-4 space-y-3 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-[#647087] dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer name, phone number, email, or business name..."
                    className="w-full bg-[#F3F0FF]/40 dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-[#172033] dark:text-white placeholder-[#647087] focus:outline-none focus:border-[#6654E8]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      if (token) setTimeout(() => fetchLeads(token), 0);
                    }}
                    className="bg-[#F3F0FF]/40 dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-slate-200 focus:outline-none focus:border-[#6654E8]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Work In Progress">Work In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Payments">Pending Payments</option>
                    <option value="Interested">Interested</option>
                    <option value="Converted">Converted</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>

                  {/* Date Filter */}
                  <select
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      if (token) setTimeout(() => fetchLeads(token), 0);
                    }}
                    className="bg-[#F3F0FF]/40 dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-slate-200 focus:outline-none focus:border-[#6654E8]"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6654E8] hover:bg-[#5343D6] text-white font-medium text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    Filter
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-2 text-xs text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchLeads()}
                    className="p-2 text-[#647087] hover:text-[#6654E8] border border-[#E5E9F2] dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Refresh Leads"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Leads Table */}
            {loading ? (
              <div className="p-16 text-center text-[#647087] dark:text-slate-400 space-y-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-[#E5E9F2] dark:border-white/10 shadow-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#6654E8]" />
                <p className="text-xs">Loading customer leads from Cloud Firestore (crm_leads)...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-16 text-center text-[#647087] dark:text-slate-400 space-y-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-[#E5E9F2] dark:border-white/10 shadow-sm">
                <p className="text-sm font-semibold text-[#172033] dark:text-white">No lead inquiries match your query.</p>
                <p className="text-xs text-[#647087] dark:text-slate-500">
                  Try adjusting the search criteria or clear the filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs text-white bg-[#6654E8] rounded-xl mt-2 cursor-pointer font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#172033] dark:text-slate-300">
                    <thead className="bg-[#FAFBFF] dark:bg-[#070B14] border-b border-[#E5E9F2] dark:border-slate-800 text-[11px] text-[#647087] dark:text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Enquiry ID</th>
                        <th className="py-3.5 px-4 font-semibold">Customer Name</th>
                        <th className="py-3.5 px-4 font-semibold">Mobile Number</th>
                        <th className="py-3.5 px-4 font-semibold">Email</th>
                        <th className="py-3.5 px-4 font-semibold">Service Category</th>
                        <th className="py-3.5 px-4 font-semibold">Selected Service</th>
                        <th className="py-3.5 px-4 font-semibold">Source</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Enquiry Date</th>
                        <th className="py-3.5 px-4 font-semibold text-right">View Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E9F2] dark:divide-slate-800/80">
                      {leads.map((lead) => {
                        const enquiryId = lead.enquiryId || lead.referenceNumber || lead.id;
                        const customerName = lead.customerName || lead.fullName || 'Anonymous';
                        const mobileNumber = lead.mobileNumber || lead.phone || '';
                        const email = lead.email || '';
                        const serviceCategory = lead.serviceCategory || 'General';
                        const selectedService = lead.selectedService || lead.requiredService || 'General Inquiry';
                        const source = lead.source || 'Website Lead Form';
                        const status = lead.status || 'New';
                        const createdAt = lead.createdAt || lead.created_at;

                        return (
                          <tr
                            key={enquiryId}
                            onClick={() => setSelectedLead(lead)}
                            className="hover:bg-[#F3F0FF]/30 dark:hover:bg-[#0E1A38]/50 transition-colors cursor-pointer group"
                          >
                            {/* 1. Enquiry ID */}
                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] font-semibold text-[#6654E8] dark:text-[#9689FF]">
                              {enquiryId}
                            </td>

                            {/* 2. Customer Name */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-semibold text-[#172033] dark:text-white group-hover:text-[#6654E8] dark:group-hover:text-[#9689FF] transition-colors">
                                {customerName}
                              </div>
                              {lead.businessName && (
                                <div className="text-[10px] text-[#647087] dark:text-slate-400">
                                  {lead.businessName}
                                </div>
                              )}
                            </td>

                            {/* 3. Mobile Number */}
                            <td className="py-3.5 px-4 whitespace-nowrap font-mono" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${mobileNumber.replace(/\D/g, '')}`}
                                  className="text-[#172033] dark:text-slate-300 hover:text-[#6654E8] dark:hover:text-[#9689FF] flex items-center gap-1"
                                  title="Call customer directly"
                                >
                                  <Phone className="w-3 h-3 text-[#647087] dark:text-slate-400" />
                                  <span>{mobileNumber}</span>
                                </a>
                                {mobileNumber && (
                                  <a
                                    href={`https://wa.me/91${mobileNumber.replace(/\D/g, '').slice(-10)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                                    title="Open WhatsApp chat"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* 4. Email */}
                            <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`mailto:${email}`}
                                className="text-[#172033] dark:text-slate-300 hover:text-[#6654E8] dark:hover:text-[#9689FF] flex items-center gap-1 truncate max-w-[160px]"
                                title={`Send email to ${email}`}
                              >
                                <Mail className="w-3 h-3 text-[#647087] dark:text-slate-400 shrink-0" />
                                <span className="truncate">{email}</span>
                              </a>
                            </td>

                            {/* 5. Service Category */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-[11px] text-[#647087] dark:text-slate-400">
                                {serviceCategory}
                              </span>
                            </td>

                            {/* 6. Selected Service */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#EAF3FF] text-[#4388FF] dark:bg-[#4388FF]/15 dark:text-[#7BAAFF]">
                                {selectedService.replace(/-/g, ' ')}
                              </span>
                            </td>

                            {/* 7. Source */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                source.toLowerCase().includes('chatbot')
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}>
                                {source}
                              </span>
                            </td>

                            {/* 8. Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(status)}`}>
                                {status}
                              </span>
                            </td>

                            {/* 9. Enquiry Date */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#647087] dark:text-slate-400 text-[11px]">
                              {new Date(createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>

                            {/* 10. View Details */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLead(lead)}
                                  className="px-3 py-1 bg-[#6654E8]/10 hover:bg-[#6654E8] text-[#6654E8] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  View Details
                                </button>
                                {mobileNumber && (
                                  <a
                                    href={`https://wa.me/91${mobileNumber.replace(/\D/g, '').slice(-10)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg transition-colors cursor-pointer"
                                    title="Open WhatsApp Chat"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'payments' ? (
          /* Payments & Online Orders Management View */
          <div className="space-y-6">
            {/* Payments Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#0D1527] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Verified Revenue
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-emerald-700 dark:text-emerald-300 font-mono">
                  ₹{paymentStats.totalRevenueINR.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#647087] dark:text-slate-500 mt-0.5">Credited in Bank</div>
              </div>

              <div className="bg-white dark:bg-[#0D1527] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Pending Verification
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-amber-700 dark:text-amber-300 font-mono">
                  {paymentStats.pendingVerificationCount}
                </div>
                <div className="text-[11px] text-[#647087] dark:text-slate-500 mt-0.5">Awaiting UTR Match</div>
              </div>

              <div className="bg-white dark:bg-[#0D1527] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Verified Paid Orders
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-blue-700 dark:text-blue-300 font-mono">
                  {paymentStats.paidCount}
                </div>
                <div className="text-[11px] text-[#647087] dark:text-slate-500 mt-0.5">Successful Transactions</div>
              </div>

              <div className="bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] font-semibold text-[#647087] dark:text-slate-400 uppercase tracking-wider block">
                  Total Orders Created
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-[#172033] dark:text-white font-mono">
                  {paymentStats.totalOrders}
                </div>
                <div className="text-[11px] text-[#647087] dark:text-slate-500 mt-0.5">All Channels</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#647087] dark:text-slate-400">Filter Status:</span>
                <div className="flex gap-1.5 text-xs">
                  {['all', 'pending_verification', 'paid', 'failed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setPaymentStatusFilter(st);
                        setTimeout(() => fetchPayments(token || undefined), 50);
                      }}
                      className={`px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                        paymentStatusFilter === st
                          ? 'border-[#6654E8] bg-[#6654E8] text-white font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-[#647087] dark:text-slate-400 hover:text-[#172033]'
                      }`}
                    >
                      {st === 'pending_verification'
                        ? 'Pending Verification'
                        : st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => fetchPayments(token || undefined)}
                className="px-3 py-1.5 text-xs text-[#172033] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Orders</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#172033] dark:text-slate-300">
                  <thead className="bg-[#FAFBFF] dark:bg-[#070B14] text-[#647087] dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#E5E9F2] dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Order Ref / Date</th>
                      <th className="px-4 py-3">Customer Details</th>
                      <th className="px-4 py-3">Service / Package</th>
                      <th className="px-4 py-3">Amount (INR)</th>
                      <th className="px-4 py-3">Method & UTR</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E9F2] dark:divide-slate-800">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[#647087]">
                          No payment orders found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-mono font-bold text-[#172033] dark:text-white text-xs">
                              {p.orderRef}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {new Date(p.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-[#172033] dark:text-white">{p.customerName}</div>
                            {p.customerBusiness && (
                              <div className="text-[11px] text-[#6654E8] dark:text-[#9689FF] font-medium">{p.customerBusiness}</div>
                            )}
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {p.customerEmail} · {p.customerPhone}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-medium text-[#172033] dark:text-white">{p.serviceTitle}</div>
                            <div className="text-[11px] text-slate-500 uppercase">{p.serviceId}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-mono font-bold text-[#172033] dark:text-white text-sm">
                              ₹{p.totalAmountINR.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              (Base ₹{p.baseAmountINR.toLocaleString('en-IN')} + 18% GST)
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                              {p.paymentMethod.replace('_', ' ')}
                            </span>
                            {p.upiTransactionRef && (
                              <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-300">
                                <span>UTR: {p.upiTransactionRef}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(p.upiTransactionRef!, p.id)}
                                  className="text-slate-400 hover:text-black dark:hover:text-white"
                                  title="Copy UTR"
                                >
                                  {copiedUtr === p.id ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3.5">
                            {p.status === 'paid' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified Paid</span>
                              </span>
                            )}
                            {p.status === 'pending_verification' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Pending Verification</span>
                              </span>
                            )}
                            {p.status === 'created' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <span>Initiated</span>
                              </span>
                            )}
                            {p.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40">
                                <AlertCircle className="w-3 h-3" />
                                <span>Failed</span>
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            {p.status === 'pending_verification' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleVerifyPayment(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                                  title="Confirm funds credited in current account"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Verify Paid</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectPayment(p.id)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                                  title="Reject if no bank record matches"
                                >
                                  <Ban className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}
                            {p.status === 'paid' && (
                              <div className="text-[11px] text-slate-500">
                                <span>Receipt: </span>
                                <span className="font-mono text-[#6654E8] dark:text-[#9689FF] font-semibold">{p.receiptNumber}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Audit Logs View */
          <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">Security & Audit Trail</h2>
                <p className="text-xs text-[#647087] dark:text-slate-400">Immutable chronological activity log of all admin operations.</p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 text-xs text-[#172033] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No audit records found.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-[#172033] dark:text-white font-sans font-medium">{log.resource}</span>
                      </div>
                      <div className="text-[11px] text-[#647087] dark:text-slate-400 font-sans">
                        Performed by: {log.userEmail} ({log.userRole}) · IP: {log.ipAddress}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Supabase Setup Modal */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E9F2] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#6654E8]" />
                <h3 className="text-base font-bold font-display text-[#172033] dark:text-white">
                  Supabase Integration & Database Setup
                </h3>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1.5 text-slate-400 hover:text-black dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Live State */}
            <div className="p-4 rounded-xl bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#647087] dark:text-slate-400 uppercase tracking-wider">
                  Live Engine Status
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  supabaseStatus?.connected
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {supabaseStatus?.connected ? 'Supabase Connected' : 'Local Persistent Mode'}
                </span>
              </div>
              <p className="text-xs text-[#172033] dark:text-slate-300">
                {supabaseStatus?.connected
                  ? 'Your Supabase cloud database is actively receiving and serving customer leads with Row Level Security enabled.'
                  : 'Supabase environment variables are currently pending. All customer leads are being safely recorded in local persistent storage (data/crm_leads.json), ensuring zero data loss.'}
              </p>
              {supabaseStatus?.error && (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                  {supabaseStatus.error}
                </div>
              )}
            </div>

            {/* 3 Easy Setup Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wider">
                How to Connect Your Real Supabase Project:
              </h4>

              <div className="space-y-2.5 text-xs text-[#647087] dark:text-slate-300">
                <div className="p-3 bg-slate-50 dark:bg-[#131D33] rounded-xl space-y-1">
                  <div className="font-semibold text-[#172033] dark:text-white">Step 1: Create Supabase Project</div>
                  <p>Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#6654E8] dark:text-[#9689FF] underline">supabase.com</a>, create a new project, and select the region (e.g. Mumbai, India).</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#131D33] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#172033] dark:text-white">Step 2: Run SQL Schema in Supabase</span>
                    <button
                      type="button"
                      onClick={copySqlSchema}
                      className="px-2.5 py-1 bg-[#6654E8] hover:bg-[#5343D6] text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>
                  <p>In your Supabase dashboard, open the <strong>SQL Editor</strong>, paste the schema from <code className="text-[#6654E8] font-mono">supabase/schema.sql</code>, and click <strong>Run</strong>.</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#131D33] rounded-xl space-y-1">
                  <div className="font-semibold text-[#172033] dark:text-white">Step 3: Add Environment Variables</div>
                  <p>In your <code className="font-mono text-[#6654E8]">.env</code> or deployment dashboard, add:</p>
                  <pre className="mt-1 p-2 bg-[#070B14] text-emerald-400 rounded-lg text-[11px] overflow-x-auto font-mono">
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E9F2] dark:border-slate-800">
              <button
                type="button"
                onClick={checkSupabaseStatus}
                disabled={isCheckingSupabase}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer text-[#172033] dark:text-white disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                <span>Test Supabase Connection</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSupabaseModal(false)}
                className="px-4 py-2 bg-[#6654E8] hover:bg-[#5343D6] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lead Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1527] border border-rose-200 dark:border-rose-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold font-display text-[#172033] dark:text-white">
                Delete Customer Lead?
              </h3>
              <p className="text-xs text-[#647087] dark:text-slate-300">
                Are you sure you want to permanently delete the lead record for{' '}
                <strong className="text-[#172033] dark:text-white">{leadToDelete.fullName || leadToDelete.customer_name}</strong>?
              </p>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[11px] font-mono text-[#647087] dark:text-slate-400 mt-2">
                Reference: {leadToDelete.referenceNumber || leadToDelete.id}
              </div>
            </div>

            <div className="text-[11px] text-rose-600 dark:text-rose-400 text-center font-medium">
              This action cannot be undone. An audit record will be logged.
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#172033] dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLead}
                disabled={isDeleting}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail & Management Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1527] border-l border-[#E5E9F2] dark:border-slate-800 w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E9F2] dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#647087] dark:text-slate-400 font-mono">
                  <span>{selectedLead.referenceNumber || selectedLead.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>Received {new Date(selectedLead.createdAt || selectedLead.created_at).toLocaleString('en-IN')}</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-[#172033] dark:text-white mt-1">
                  {selectedLead.fullName || selectedLead.customer_name}
                </h2>
                <div className="text-xs text-[#6654E8] dark:text-[#9689FF] font-semibold flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{selectedLead.businessName || selectedLead.business_name || 'Individual Enterprise'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-black dark:hover:text-white rounded-xl bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F3F0FF]/30 dark:bg-[#070B14] p-4 rounded-2xl border border-[#E5E9F2] dark:border-slate-800">
              <div>
                <span className="text-[#647087] dark:text-slate-500 block">Phone / WhatsApp</span>
                <div className="font-mono font-medium text-[#172033] dark:text-white flex items-center gap-2 mt-0.5">
                  <a href={`tel:${(selectedLead.phone || selectedLead.phone_number || '').replace(/\D/g, '')}`} className="hover:underline">
                    {selectedLead.phone || selectedLead.phone_number}
                  </a>
                  <a
                    href={`https://wa.me/91${(selectedLead.phone || selectedLead.phone_number || '').replace(/[^\d]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:underline inline-flex items-center gap-0.5 text-[11px]"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[#647087] dark:text-slate-500 block">Email Address</span>
                <div className="text-[#172033] dark:text-white mt-0.5">
                  <a href={`mailto:${selectedLead.email}`} className="hover:text-[#6654E8] transition-colors">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[#647087] dark:text-slate-500 block">Required Service</span>
                <div className="text-[#172033] dark:text-slate-200 font-semibold capitalize mt-0.5">
                  {(selectedLead.requiredService || selectedLead.service_interested || 'Website').replace(/-/g, ' ')}
                </div>
              </div>

              <div>
                <span className="text-[#647087] dark:text-slate-500 block">Budget Range / Page</span>
                <div className="text-[#6654E8] dark:text-[#9689FF] font-mono mt-0.5">
                  {selectedLead.budgetRange || selectedLead.source_page || 'Website Lead'}
                </div>
              </div>
            </div>

            {/* Project Requirements Brief */}
            <div className="bg-[#F3F0FF]/30 dark:bg-[#070B14] p-4 rounded-2xl border border-[#E5E9F2] dark:border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-[#647087] dark:text-slate-400 uppercase tracking-wider text-[11px]">
                Project Scope & Client Message
              </span>
              <p className="text-[#172033] dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLead.projectDescription || selectedLead.message || 'No project description provided.'}
              </p>
            </div>

            {/* Operational Controls: Status */}
            <div className="bg-white dark:bg-[#131D33] border border-[#6654E8]/20 rounded-2xl p-4 space-y-3 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#172033] dark:text-white uppercase tracking-wider text-[11px]">
                  Update Lead Status
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(selectedLead.status)}`}>
                  Current: {selectedLead.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {['New', 'Contacted', 'Interested', 'Converted', 'Not Interested'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedLead.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      selectedLead.status === st
                        ? 'bg-[#6654E8] text-white border-[#6654E8]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#6654E8]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes Timeline */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#172033] dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  Internal Notes & Follow-up History
                </h3>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add administrative note (e.g., Sent proposal over WhatsApp, scheduled demo)..."
                  className="flex-1 bg-[#F3F0FF]/40 dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-white focus:outline-none focus:border-[#6654E8]"
                />
                <button
                  type="submit"
                  disabled={isUpdating || !newNoteText.trim()}
                  className="px-4 py-2 bg-[#6654E8] hover:bg-[#5343D6] text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </form>

              {/* Notes list */}
              <div className="space-y-2 mt-2">
                {(!selectedLead.notes || selectedLead.notes.length === 0) && !selectedLead.admin_notes ? (
                  <p className="text-slate-400 italic text-[11px]">No internal notes recorded yet.</p>
                ) : (
                  <>
                    {selectedLead.admin_notes && (
                      <div className="p-3 bg-slate-50 dark:bg-[#070B14] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="text-[10px] text-[#6654E8] font-semibold">Supabase Admin Remarks</div>
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{selectedLead.admin_notes}</p>
                      </div>
                    )}
                    {selectedLead.notes?.map((note: any) => (
                      <div key={note.id} className="p-3 bg-slate-50 dark:bg-[#070B14] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-semibold text-[#172033] dark:text-slate-300">{note.authorName}</span>
                          <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{note.content}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E5E9F2] dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLeadToDelete(selectedLead)}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[#172033] dark:text-slate-200 hover:bg-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
