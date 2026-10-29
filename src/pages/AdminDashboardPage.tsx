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
  Ban
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onLogout }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);

  // Leads & Data State
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposalSent: 0,
    won: 0,
    lost: 0,
    totalPipelineValueINR: 0
  });

  // UI & Filter States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
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
  const [selectedLead, setSelectedLead] = useState<StoredLead | null>(null);
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

  const fetchLeads = async (authToken: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('searchTerm', searchTerm);
      if (statusFilter && statusFilter !== 'All') queryParams.set('status', statusFilter);
      if (serviceFilter && serviceFilter !== 'All') queryParams.set('service', serviceFilter);

      const res = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('edh_admin_token');
          sessionStorage.removeItem('edh_admin_user');
          onNavigate('admin-login');
          return;
        }
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch leads');
      }

      const data = await res.json();
      setLeads(data.leads || []);
      if (data.stats) setStats(data.stats);

      // Keep selected lead synchronized if open
      if (selectedLead) {
        const refreshed = data.leads.find((l: StoredLead) => l.id === selectedLead.id);
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
    setServiceFilter('All');
    if (token) {
      setTimeout(() => fetchLeads(token), 0);
    }
  };

  // Status Update Handler
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
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
        showToast('Internal note saved.');
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

  // Follow-Up Date Handler
  const handleFollowUpChange = async (leadId: string, date: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/followup`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ followUpDate: date })
      });

      if (res.ok) {
        showToast('Follow-up scheduled.');
        fetchLeads(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Estimated Value Handler
  const handleValueChange = async (leadId: string, valStr: string) => {
    if (!token) return;
    const value = parseInt(valStr, 10);
    if (isNaN(value)) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/value`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });

      if (res.ok) {
        showToast('Estimated pipeline value updated.');
        fetchLeads(token);
      }
    } catch (err) {
      console.error(err);
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
      a.download = `ellora_leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
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
        setBackupStatus(`Backup snapshot created: ${d.backup.filename}`);
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
    sessionStorage.removeItem('edh_admin_token');
    sessionStorage.removeItem('edh_admin_user');
    onLogout();
    onNavigate('home');
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'text-blue-400 bg-blue-950/70 border-blue-800';
      case 'Contacted':
        return 'text-yellow-400 bg-yellow-950/70 border-yellow-800';
      case 'Qualified':
        return 'text-purple-400 bg-purple-950/70 border-purple-800';
      case 'Proposal Sent':
        return 'text-[#F3DC87] bg-[#D4AF37]/20 border-[#D4AF37]/50';
      case 'Won':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      case 'Lost':
        return 'text-red-400 bg-red-950/70 border-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#0B132B] border border-[#D4AF37] px-4 py-3 rounded-xl shadow-2xl text-xs text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Sub-Bar */}
      <div className="bg-[#0A1020] border-b border-slate-800 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#D4AF37]/50 bg-black flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
                alt="RUBI TECH PARK"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-display text-white">
                RUBI TECH PARK Lead Console
              </h1>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Logged in as: {user?.name || 'Administrator'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#E5C158] uppercase text-[10px] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded">
                  {user?.role || 'super_admin'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:flex px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#070B14] border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer items-center gap-1.5"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
            </button>

            <button
              onClick={handleTriggerBackup}
              title="Record instant database backup snapshot"
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#070B14] border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Snapshot Backup</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-[#070B14] bg-[#E5C158] hover:bg-[#F3DC87] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="p-2 text-slate-400 hover:text-red-400 bg-[#070B14] border border-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Sign Out of CRM"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {backupStatus && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{backupStatus}</span>
          </div>
        )}

        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inbound
            </span>
            <div className="mt-1 text-2xl font-bold font-display text-white tabular-nums">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Recorded Leads</div>
          </div>

          <div className="bg-[#0B132B] border border-blue-900/40 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
              New Leads
            </span>
            <div className="mt-1 text-2xl font-bold font-display text-blue-300 tabular-nums">
              {stats.new}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Awaiting Callback</div>
          </div>

          <div className="bg-[#0B132B] border border-purple-900/40 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
              In Pipeline
            </span>
            <div className="mt-1 text-2xl font-bold font-display text-purple-300 tabular-nums">
              {stats.contacted + stats.qualified}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Contacted / Qualified</div>
          </div>

          <div className="bg-[#0B132B] border border-[#D4AF37]/30 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-[#E5C158] uppercase tracking-wider block">
              Proposals
            </span>
            <div className="mt-1 text-2xl font-bold font-display text-[#F3DC87] tabular-nums">
              {stats.proposalSent}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Quotes Dispatched</div>
          </div>

          <div className="bg-[#0B132B] border border-emerald-900/40 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Closed Won
            </span>
            <div className="mt-1 text-2xl font-bold font-display text-emerald-300 tabular-nums">
              {stats.won}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active Engagements</div>
          </div>

          <div className="bg-[#0B132B] border border-[#D4AF37]/40 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-[#E5C158] uppercase tracking-wider block">
              Pipeline Value
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-bold font-display text-white gold-gradient-text tabular-nums">
              {formatINR(stats.totalPipelineValueINR)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Estimated In Portfolio</div>
          </div>
        </div>

        {/* Tab Selector: Pipeline Leads vs Online Payments vs Audit Logs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#D4AF37] text-[#070B14]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Leads Pipeline ({leads.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('payments');
              fetchPayments();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-[#D4AF37] text-[#070B14]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Orders & Online Payments ({payments.length})</span>
            {paymentStats.pendingVerificationCount > 0 && (
              <span className="ml-1 bg-amber-500 text-[#070B14] font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {paymentStats.pendingVerificationCount} Pending
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              fetchAuditLogs();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#D4AF37] text-[#070B14]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & Activity Audit
          </button>
        </div>

        {activeTab === 'pipeline' ? (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-4 space-y-3">
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search leads by name, business, email, phone, or reference code..."
                    className="w-full bg-[#070B14] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      if (token) {
                        setTimeout(() => fetchLeads(token), 0);
                      }
                    }}
                    className="bg-[#070B14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <select
                    value={serviceFilter}
                    onChange={(e) => {
                      setServiceFilter(e.target.value);
                      if (token) {
                        setTimeout(() => fetchLeads(token), 0);
                      }
                    }}
                    className="bg-[#070B14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="All">All Services</option>
                    <option value="business-website">Business Website</option>
                    <option value="ecommerce-store">E-commerce Store</option>
                    <option value="custom-crm">Custom CRM</option>
                    <option value="website-crm-integration">Website + CRM</option>
                    <option value="ai-workflow-automation">AI Automation</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0E1A38] hover:bg-[#162347] border border-slate-700 text-xs text-slate-200 rounded-lg cursor-pointer"
                  >
                    Search
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Leads Table */}
            {loading ? (
              <div className="p-16 text-center text-slate-400 space-y-3 bg-[#0B132B] rounded-xl border border-slate-800">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                <p className="text-xs">Loading persistent pipeline records...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-3 bg-[#0B132B] rounded-xl border border-slate-800">
                <p className="text-sm font-semibold text-white">No lead inquiries match your query.</p>
                <p className="text-xs text-slate-500">
                  Try adjusting the search criteria or clear the filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs text-[#070B14] bg-[#E5C158] rounded-lg mt-2 cursor-pointer font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="bg-[#0B132B] border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#070B14] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Reference</th>
                      <th className="py-3.5 px-4 font-semibold">Client / Business</th>
                      <th className="py-3.5 px-4 font-semibold">Required Service</th>
                      <th className="py-3.5 px-4 font-semibold">Budget</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Follow-Up</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-[#0E1A38]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-white whitespace-nowrap">
                          {lead.referenceNumber}
                          <div className="text-[10px] text-slate-500 font-sans">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white group-hover:text-[#F3DC87] transition-colors">
                            {lead.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {lead.businessName || 'Individual Enterprise'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {lead.phone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="capitalize text-slate-200">
                            {lead.requiredService.replace(/-/g, ' ')}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize">
                            {lead.businessType.replace(/-/g, ' ')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-[#F3DC87] font-medium font-mono">
                            {lead.budgetRange}
                          </div>
                          {lead.internalEstimatedValueINR ? (
                            <div className="text-[10px] text-emerald-400 font-mono">
                              Est: {formatINR(lead.internalEstimatedValueINR)}
                            </div>
                          ) : null}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {lead.followUpDate ? (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Calendar className="w-3 h-3 text-[#D4AF37]" />
                              <span>{lead.followUpDate}</span>
                            </div>
                          ) : (
                            <span className="text-slate-600">Not Scheduled</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                            }}
                            className="px-3 py-1.5 bg-[#070B14] hover:bg-[#D4AF37] text-slate-300 hover:text-[#070B14] border border-slate-700 hover:border-[#D4AF37] rounded-lg transition-colors text-xs font-medium cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : activeTab === 'payments' ? (
          /* Payments & Online Orders Management View */
          <div className="space-y-6">
            {/* Payments Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0B132B] border border-emerald-900/40 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  Verified Revenue
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-emerald-300 font-mono">
                  ₹{paymentStats.totalRevenueINR.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Credited in Bank</div>
              </div>

              <div className="bg-[#0B132B] border border-amber-900/40 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  Pending Verification
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-amber-300 font-mono">
                  {paymentStats.pendingVerificationCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Awaiting Bank Match</div>
              </div>

              <div className="bg-[#0B132B] border border-blue-900/40 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                  Verified Paid Orders
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-blue-300 font-mono">
                  {paymentStats.paidCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Successful Transactions</div>
              </div>

              <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Orders Created
                </span>
                <div className="mt-1 text-2xl font-bold font-display text-white font-mono">
                  {paymentStats.totalOrders}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">All Channels</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter Status:</span>
                <div className="flex gap-1.5 text-xs">
                  {['all', 'pending_verification', 'paid', 'failed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setPaymentStatusFilter(st);
                        setTimeout(() => fetchPayments(token || undefined), 50);
                      }}
                      className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                        paymentStatusFilter === st
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3DC87] font-semibold'
                          : 'border-slate-800 text-slate-400 hover:text-white'
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
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#070B14] border border-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Orders</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-[#0B132B] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#070B14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
                  <tbody className="divide-y divide-slate-800">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          No payment orders found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-mono font-bold text-white text-xs">
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
                            <div className="font-semibold text-white">{p.customerName}</div>
                            {p.customerBusiness && (
                              <div className="text-[11px] text-[#F3DC87]">{p.customerBusiness}</div>
                            )}
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {p.customerEmail} · {p.customerPhone}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-medium text-white">{p.serviceTitle}</div>
                            <div className="text-[11px] text-slate-500 uppercase">{p.serviceId}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-mono font-bold text-white text-sm">
                              ₹{p.totalAmountINR.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              (Base ₹{p.baseAmountINR.toLocaleString('en-IN')} + 18% GST)
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase">
                              {p.paymentMethod.replace('_', ' ')}
                            </span>
                            {p.upiTransactionRef && (
                              <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-amber-300">
                                <span>UTR: {p.upiTransactionRef}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(p.upiTransactionRef!, p.id)}
                                  className="text-slate-400 hover:text-white"
                                  title="Copy UTR"
                                >
                                  {copiedUtr === p.id ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3.5">
                            {p.status === 'paid' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified Paid</span>
                              </span>
                            )}
                            {p.status === 'pending_verification' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Pending Verification</span>
                              </span>
                            )}
                            {p.status === 'created' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                                <span>Initiated</span>
                              </span>
                            )}
                            {p.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-500/40">
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
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                                  title="Confirm funds credited in current account"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Verify Paid</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectPayment(p.id)}
                                  className="px-2 py-1 rounded bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                                  title="Reject if no bank record matches"
                                >
                                  <Ban className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}
                            {p.status === 'paid' && (
                              <div className="text-[11px] text-slate-400">
                                <span>Receipt: </span>
                                <span className="font-mono text-[#F3DC87]">{p.receiptNumber}</span>
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
          <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold font-display text-white">System Security & Audit Trail</h2>
                <p className="text-xs text-slate-400">Immutable chronological activity log of all admin operations.</p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#070B14] border border-slate-800 rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log</span>
              </button>
            </div>
            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No audit records found.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${log.success ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {log.action}
                        </span>
                        <span className="text-white font-sans">{log.resource}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
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

      {/* Lead Detail & Management Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B132B] border-l border-slate-800 w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{selectedLead.referenceNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>Received {new Date(selectedLead.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white mt-1">
                  {selectedLead.fullName}
                </h2>
                <div className="text-xs text-[#F3DC87]">
                  {selectedLead.businessName || 'Individual Enterprise'}
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#070B14] border border-slate-800 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#070B14] p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Phone / WhatsApp</span>
                <div className="font-mono text-white flex items-center gap-2 mt-0.5">
                  <span>{selectedLead.phone}</span>
                  <a
                    href={`https://wa.me/91${selectedLead.phone.replace(/[^\d]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 text-[11px]"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block">Email Address</span>
                <div className="text-white mt-0.5">
                  <a href={`mailto:${selectedLead.email}`} className="hover:text-[#F3DC87] transition-colors">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block">Required Service</span>
                <div className="text-slate-200 capitalize mt-0.5">
                  {selectedLead.requiredService.replace(/-/g, ' ')}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block">Budget Range</span>
                <div className="text-[#F3DC87] font-mono mt-0.5">
                  {selectedLead.budgetRange}
                </div>
              </div>
            </div>

            {/* Project Requirements Brief */}
            <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                Project Scope Description
              </span>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLead.projectDescription}
              </p>
            </div>

            {/* Operational Controls: Status, Follow-Up, Estimated Value */}
            <div className="bg-[#090F20] border border-[#D4AF37]/30 rounded-xl p-5 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-[#F3DC87]">
                Lead Status & Operations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pipeline Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full bg-[#070B14] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    value={selectedLead.followUpDate || ''}
                    onChange={(e) => handleFollowUpChange(selectedLead.id, e.target.value)}
                    className="w-full bg-[#070B14] border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Est. Deal Value (₹)</label>
                  <input
                    type="number"
                    defaultValue={selectedLead.internalEstimatedValueINR || ''}
                    onBlur={(e) => handleValueChange(selectedLead.id, e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#070B14] border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Internal Notes Timeline */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Internal Team Notes ({selectedLead.notes.length})
                </h3>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add note (e.g., Client discussed Razorpay integration, follow up next Tuesday)..."
                  className="flex-1 bg-[#070B14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={isUpdating || !newNoteText.trim()}
                  className="px-4 py-2 bg-[#E5C158] hover:bg-[#F3DC87] text-[#070B14] font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2 mt-2">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No internal notes yet.</p>
                ) : (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-[#070B14] rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-300">{note.authorName}</span>
                        <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-200">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity History Log for this Lead */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                Lifecycle Activity Stream
              </h3>
              <div className="space-y-1.5 font-mono text-[11px]">
                {selectedLead.activityHistory.map((act) => (
                  <div key={act.id} className="p-2 bg-[#070B14]/60 rounded border border-slate-800/80 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[#D4AF37] font-semibold">{act.performedBy}: </span>
                      <span className="text-slate-300 font-sans">{act.details}</span>
                    </div>
                    <span className="text-slate-500 whitespace-nowrap text-[10px]">
                      {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
