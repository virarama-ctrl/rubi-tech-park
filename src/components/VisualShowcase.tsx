import React, { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Globe,
  Layers,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
  ShoppingBag
} from 'lucide-react';

export const Hero3DDashboardShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'payments'>('overview');

  return (
    <div className="relative w-full max-w-5xl mx-auto perspective-1200 py-6">
      {/* Background ambient glow orbs */}
      <div 
        className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-[#F3F0FF] dark:bg-[#6654E8]/20 blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/2 -right-12 w-80 h-80 rounded-full bg-[#E5FAF7] dark:bg-[#35C9B0]/15 blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-8 left-1/3 w-64 h-64 rounded-full bg-[#EAF3FF] dark:bg-[#4388FF]/15 blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Main 3D Tilted Dashboard Window */}
      <div className="relative rounded-2xl border border-[#E5E9F2] dark:border-white/10 bg-white/90 dark:bg-[#121829]/95 backdrop-blur-xl shadow-2xl shadow-indigo-950/10 dark:shadow-black/70 overflow-hidden transform-3d transition-transform duration-500 hover:rotate-0">
        
        {/* Window Chrome / Titlebar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E5E9F2] dark:border-white/10 bg-[#FAFBFF] dark:bg-[#0D1322]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
            <span className="ml-2 hidden sm:inline-block text-xs font-mono text-[#647087] dark:text-slate-400">
              rubitechpark.internal/console/cloud-mesh
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E5FAF7] dark:bg-emerald-950/50 text-[#0F766E] dark:text-emerald-300 font-medium border border-[#35C9B0]/30">
              <span className="w-2 h-2 rounded-full bg-[#35C9B0] animate-pulse-mint" />
              <span>Production Mesh v4.8 Active</span>
            </div>
            <div className="text-[11px] font-mono text-[#647087] dark:text-slate-400">
              ap-south-1 · 12ms
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Subsystem Navigation & System Health */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#647087] dark:text-slate-400">
              Active Engines
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  activeTab === 'overview'
                    ? 'bg-[#F3F0FF] dark:bg-[#6654E8]/20 text-[#6654E8] dark:text-[#9689FF] font-semibold border border-[#6654E8]/20'
                    : 'text-[#647087] dark:text-slate-300 hover:bg-[#FAFBFF] dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#6654E8]" />
                  <span>Pipeline Mesh</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#35C9B0]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  activeTab === 'leads'
                    ? 'bg-[#F3F0FF] dark:bg-[#6654E8]/20 text-[#6654E8] dark:text-[#9689FF] font-semibold border border-[#6654E8]/20'
                    : 'text-[#647087] dark:text-slate-300 hover:bg-[#FAFBFF] dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#4388FF]" />
                  <span>Lead Engine CRM</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EAF3FF] dark:bg-blue-950 text-[#4388FF]">
                  12 New
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  activeTab === 'payments'
                    ? 'bg-[#F3F0FF] dark:bg-[#6654E8]/20 text-[#6654E8] dark:text-[#9689FF] font-semibold border border-[#6654E8]/20'
                    : 'text-[#647087] dark:text-slate-300 hover:bg-[#FAFBFF] dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-[#35C9B0]" />
                  <span>UPI Settlements</span>
                </div>
                <span className="text-[10px] font-mono text-[#35C9B0]">100%</span>
              </button>
            </div>

            {/* Quick Specs Box */}
            <div className="p-3.5 rounded-xl bg-[#FAFBFF] dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/5 space-y-2">
              <div className="text-[11px] font-semibold text-[#172033] dark:text-white flex items-center justify-between">
                <span>Enterprise SLA</span>
                <span className="text-[#35C9B0] font-mono">99.98%</span>
              </div>
              <div className="w-full bg-[#E5E9F2] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#6654E8] via-[#4388FF] to-[#35C9B0] h-full w-[98%]" />
              </div>
              <p className="text-[10px] text-[#647087] dark:text-slate-400">
                Zero vendor lock-in. Full PostgreSQL/Node source ownership.
              </p>
            </div>
          </div>

          {/* Center Column: Live Metrics & Velocity Chart */}
          <div className="lg:col-span-9 space-y-5">
            {/* 3 Key Metric Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FAFBFF] dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/5">
                <div className="text-[11px] text-[#647087] dark:text-slate-400 flex items-center justify-between">
                  <span>Gross Pipeline Value</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#35C9B0]" />
                </div>
                <div className="mt-1 text-xl font-bold font-display text-[#172033] dark:text-white">
                  ₹24,80,000
                </div>
                <div className="text-[10px] text-[#35C9B0] font-medium mt-0.5">
                  +38% vs prev quarter
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFF] dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/5">
                <div className="text-[11px] text-[#647087] dark:text-slate-400 flex items-center justify-between">
                  <span>Enquiry Lead Velocity</span>
                  <Activity className="w-3.5 h-3.5 text-[#6654E8]" />
                </div>
                <div className="mt-1 text-xl font-bold font-display text-[#172033] dark:text-white">
                  184 Leads
                </div>
                <div className="text-[10px] text-[#6654E8] dark:text-[#9689FF] font-medium mt-0.5">
                  Avg response 2.4 mins
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAFBFF] dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/5">
                <div className="text-[11px] text-[#647087] dark:text-slate-400 flex items-center justify-between">
                  <span>Client Code Retention</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4388FF]" />
                </div>
                <div className="mt-1 text-xl font-bold font-display text-[#172033] dark:text-white">
                  100% Legal
                </div>
                <div className="text-[10px] text-[#4388FF] font-medium mt-0.5">
                  Full IP & Domain Handover
                </div>
              </div>
            </div>

            {/* Interactive Visual Stream */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAFBFF] dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/5">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#E5E9F2] dark:border-white/5 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6654E8]" />
                  <span className="text-xs font-semibold text-[#172033] dark:text-white">
                    Live System Throughput & Event Logs
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#647087] dark:text-slate-400">
                  Real-time sync · Coimbatore Hub
                </span>
              </div>

              {/* Vector Chart Representation */}
              <div className="h-28 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6654E8" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#4388FF" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#35C9B0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#E5E9F2" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#E5E9F2" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#E5E9F2" strokeDasharray="3 3" opacity="0.6" />

                  {/* Gradient Area Fill */}
                  <path
                    d="M0,100 Q60,85 120,70 T240,55 T360,40 T480,25 T600,10 L600,120 L0,120 Z"
                    fill="url(#chartGradient)"
                  />
                  {/* Smooth Primary Line */}
                  <path
                    d="M0,100 Q60,85 120,70 T240,55 T360,40 T480,25 T600,10"
                    fill="none"
                    stroke="#6654E8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Active Point Indicator */}
                  <circle cx="480" cy="25" r="4" fill="#35C9B0" />
                  <circle cx="480" cy="25" r="8" fill="#35C9B0" opacity="0.3" className="animate-ping" />
                  <circle cx="600" cy="10" r="5" fill="#6654E8" />
                </svg>
              </div>

              {/* Event Ticker Below Chart */}
              <div className="mt-3 pt-3 border-t border-[#E5E9F2] dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-[#647087] dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35C9B0]" />
                  <span className="font-mono text-[#172033] dark:text-white font-medium">10:42 AM:</span>
                  <span>UPI Payment verified for Project Milestone (₹15,000)</span>
                </div>
                <div className="flex items-center gap-2 text-[#647087] dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4388FF]" />
                  <span className="font-mono text-[#172033] dark:text-white font-medium">10:45 AM:</span>
                  <span>New inquiry from Gandhipuram received via WhatsApp bot</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Floating 3D Glass Accent Cards for Layered Depth */}
      <div className="hidden lg:block">
        {/* Floating Card 1: Live Lead Inflow (Top Right) */}
        <div className="absolute -top-6 -right-6 z-20 w-64 p-3.5 rounded-xl saas-card-glass border border-[#E5E9F2] dark:border-white/10 shadow-xl animate-float-subtle">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E9F2] dark:border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6654E8] dark:text-[#9689FF]">
              Qualified Lead
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E5FAF7] text-[#0F766E] font-medium">
              Verified
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#172033] dark:text-white">
            Apex Fasteners · Coimbatore
          </div>
          <div className="text-[11px] text-[#647087] dark:text-slate-400">
            Scope: Custom ERP + WhatsApp API
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#35C9B0]">
            <span>Milestone: ₹75,000</span>
            <span className="text-slate-400 text-[10px]">Just now</span>
          </div>
        </div>

        {/* Floating Card 2: UPI & Banking Settlement (Bottom Left) */}
        <div 
          className="absolute -bottom-6 -left-6 z-20 w-72 p-3.5 rounded-xl saas-card-glass border border-[#E5E9F2] dark:border-white/10 shadow-xl animate-float-subtle"
          style={{ animationDelay: '-3s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] shrink-0 border border-[#35C9B0]/30">
              <CheckCircle2 className="w-5 h-5 text-[#35C9B0]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-[#172033] dark:text-white truncate">
                Direct HDFC UPI Handshake
              </div>
              <div className="text-[10px] font-mono text-[#647087] dark:text-slate-400 truncate">
                rubienterprisesgst-1@okhdfcbank
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-[#647087] dark:text-slate-400">18% GST Tax Receipt</span>
            <span className="font-semibold text-[#35C9B0]">Automated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RubiJewelleryShowcase: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E9F2] dark:border-white/10 bg-white dark:bg-[#0D1527] p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] dark:bg-[#6654E8]/20 flex items-center justify-center text-[#6654E8] font-bold text-sm tracking-wider border border-[#6654E8]/20">
            R
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-[#172033] dark:text-white">
              RUBI Gold & Silver
            </div>
            <div className="text-xs text-[#647087] dark:text-slate-400">
              Digital Catalog & Inquiry Architecture
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-[#6654E8] dark:text-[#9689FF] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-2.5 py-1 rounded-full border border-[#6654E8]/20">
          Live Client Platform
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Item 1 */}
        <div className="rounded-xl bg-[#FAFBFF] dark:bg-[#121A30] border border-[#E5E9F2] dark:border-white/5 p-4 hover:border-[#6654E8]/40 transition-colors">
          <div className="h-28 rounded-lg bg-gradient-to-b from-[#FFF0F5] to-[#FAFBFF] dark:from-slate-900 dark:to-[#0D1322] relative flex items-center justify-center overflow-hidden border border-[#E5E9F2] dark:border-white/5">
            <svg className="w-20 h-20 text-[#B8860B] dark:text-[#D4AF37]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M20,30 Q50,75 80,30" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30,35 Q50,70 70,35" strokeWidth="1.5" strokeDasharray="2 3" />
              <circle cx="50" cy="72" r="5" fill="#D4AF37" />
              <circle cx="40" cy="62" r="3" fill="#B8860B" />
              <circle cx="60" cy="62" r="3" fill="#B8860B" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#B8860B] dark:text-[#E5C158] bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded-full border border-[#B8860B]/20">
              22K Gold
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#172033] dark:text-slate-200">
            Heritage Temple Choker
          </div>
          <div className="text-[11px] text-[#647087] dark:text-slate-400">
            Net: 42.6g · Handcrafted
          </div>
        </div>

        {/* Item 2 */}
        <div className="rounded-xl bg-[#FAFBFF] dark:bg-[#121A30] border border-[#E5E9F2] dark:border-white/5 p-4 hover:border-[#6654E8]/40 transition-colors">
          <div className="h-28 rounded-lg bg-gradient-to-b from-[#EAF3FF] to-[#FAFBFF] dark:from-slate-900 dark:to-[#0D1322] relative flex items-center justify-center overflow-hidden border border-[#E5E9F2] dark:border-white/5">
            <svg className="w-20 h-20 text-slate-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <ellipse cx="45" cy="50" rx="26" ry="18" strokeWidth="2" stroke="#94A3B8" />
              <ellipse cx="55" cy="50" rx="26" ry="18" strokeWidth="2" stroke="#64748B" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded-full border border-slate-300">
              925 Silver
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#172033] dark:text-slate-200">
            Filigree Kada Pair
          </div>
          <div className="text-[11px] text-[#647087] dark:text-slate-400">
            Net: 64.2g · Hallmark Certified
          </div>
        </div>

        {/* Item 3 */}
        <div className="rounded-xl bg-[#FAFBFF] dark:bg-[#121A30] border border-[#E5E9F2] dark:border-white/5 p-4 hover:border-[#6654E8]/40 transition-colors">
          <div className="h-28 rounded-lg bg-gradient-to-b from-[#E5FAF7] to-[#FAFBFF] dark:from-slate-900 dark:to-[#0D1322] relative flex items-center justify-center overflow-hidden border border-[#E5E9F2] dark:border-white/5">
            <svg className="w-20 h-20 text-[#35C9B0]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="55" r="18" strokeWidth="2.5" />
              <polygon points="50,28 58,40 42,40" fill="#35C9B0" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#0F766E] dark:text-[#35C9B0] bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded-full border border-[#35C9B0]/30">
              18K Solitaire
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#172033] dark:text-slate-200">
            Bespoke Diamond Band
          </div>
          <div className="text-[11px] text-[#647087] dark:text-slate-400">
            VVS-EF · Certified Mount
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E9F2] dark:border-white/10 flex flex-wrap items-center justify-between text-xs text-[#647087] dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[#6654E8]" />
          <span>Real-time SKU prefilled WhatsApp inquiry</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-[#35C9B0]" />
          <span>99.2% mobile traffic performance</span>
        </div>
      </div>
    </div>
  );
};

export const CustomCRMDashboardShowcase: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E9F2] dark:border-white/10 bg-white dark:bg-[#0D1527] p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
        <div>
          <div className="text-sm font-semibold tracking-wide text-[#172033] dark:text-white">
            Commercial Operations CRM
          </div>
          <div className="text-xs text-[#647087] dark:text-slate-400">
            Lead Pipeline & Dispatch Stream
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#647087] dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#35C9B0] animate-pulse-mint" />
          <span>Pipeline: Active</span>
        </div>
      </div>

      {/* Visual Pipeline Columns */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#FAFBFF] dark:bg-[#121A30] rounded-xl p-3 border border-[#E5E9F2] dark:border-white/5">
          <div className="flex items-center justify-between text-[#647087] dark:text-slate-400 mb-2">
            <span className="font-semibold text-[#172033] dark:text-slate-200">New Inquiries</span>
            <span className="font-mono text-[#6654E8] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-2 py-0.5 rounded-full font-bold">4</span>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#E5E9F2] dark:border-white/5 mb-2 shadow-xs">
            <div className="font-medium text-[#172033] dark:text-slate-200">Mahalaxmi Metals</div>
            <div className="text-[10px] text-[#647087] dark:text-slate-400">Website + CRM · ₹35k+</div>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#E5E9F2] dark:border-white/5 shadow-xs">
            <div className="font-medium text-[#172033] dark:text-slate-200">Shri Krishna Tex</div>
            <div className="text-[10px] text-[#647087] dark:text-slate-400">E-com Store · ₹20k</div>
          </div>
        </div>

        <div className="bg-[#FAFBFF] dark:bg-[#121A30] rounded-xl p-3 border border-[#E5E9F2] dark:border-white/5">
          <div className="flex items-center justify-between text-[#647087] dark:text-slate-400 mb-2">
            <span className="font-semibold text-[#172033] dark:text-slate-200">Contacted</span>
            <span className="font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">6</span>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#E5E9F2] dark:border-white/5 mb-2 shadow-xs">
            <div className="font-medium text-[#172033] dark:text-slate-200">Nova Clinical Labs</div>
            <div className="text-[10px] text-[#647087] dark:text-slate-400">Discovery call completed</div>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#E5E9F2] dark:border-white/5 shadow-xs">
            <div className="font-medium text-[#172033] dark:text-slate-200">Prasad Logistics</div>
            <div className="text-[10px] text-[#647087] dark:text-slate-400">Scope sheet dispatched</div>
          </div>
        </div>

        <div className="bg-[#FAFBFF] dark:bg-[#121A30] rounded-xl p-3 border border-[#E5E9F2] dark:border-white/5">
          <div className="flex items-center justify-between text-[#647087] dark:text-slate-400 mb-2">
            <span className="font-semibold text-[#172033] dark:text-slate-200">Proposal Sent</span>
            <span className="font-mono text-[#4388FF] bg-[#EAF3FF] dark:bg-blue-950 px-2 py-0.5 rounded-full font-bold">3</span>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#4388FF]/30 mb-2 shadow-xs">
            <div className="font-medium text-[#4388FF]">Apex Fasteners</div>
            <div className="text-[10px] text-[#647087] dark:text-slate-300">Custom ERP · ₹75,000</div>
          </div>
        </div>

        <div className="bg-[#FAFBFF] dark:bg-[#121A30] rounded-xl p-3 border border-[#E5E9F2] dark:border-white/5">
          <div className="flex items-center justify-between text-[#647087] dark:text-slate-400 mb-2">
            <span className="font-semibold text-[#35C9B0]">Won / In Build</span>
            <span className="font-mono text-[#35C9B0] bg-[#E5FAF7] dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold">5</span>
          </div>
          <div className="bg-white dark:bg-[#0D1527] p-2.5 rounded-lg border border-[#35C9B0]/40 mb-2 shadow-xs">
            <div className="font-medium text-[#172033] dark:text-slate-200">RUBI Gold & Silver</div>
            <div className="text-[10px] text-[#35C9B0] font-medium">Phase 1 Handed Over</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between text-xs text-[#647087] dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#6654E8]" />
          <span>Server-side persistence & role-based permissions</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35C9B0]" />
          <span>Encrypted data ownership</span>
        </div>
      </div>
    </div>
  );
};
