import React from 'react';
import { Database, ShieldCheck, Zap, Globe, Smartphone, ShoppingBag } from 'lucide-react';

export const RubiJewelleryShowcase: React.FC = () => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-b from-[#0B132B] via-[#080D1D] to-[#050811] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#947820] to-[#E5C158] flex items-center justify-center text-[#070B14] font-bold text-sm tracking-wider">
            R
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">RUBI Gold & Silver</div>
            <div className="text-xs text-slate-400">Digital Catalog & Inquiry Architecture</div>
          </div>
        </div>
        <div className="text-xs font-mono text-[#E5C158] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/30">
          Live Client Platform
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Item 1 */}
        <div className="rounded-lg bg-[#0E1A38]/70 border border-slate-800 p-3.5 hover:border-[#D4AF37]/40 transition-colors">
          <div className="h-28 rounded bg-gradient-to-b from-slate-900 to-black relative flex items-center justify-center overflow-hidden border border-slate-800">
            {/* Artistic gold necklace vector representation */}
            <svg className="w-20 h-20 text-[#D4AF37]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M20,30 Q50,75 80,30" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30,35 Q50,70 70,35" strokeWidth="1.5" strokeDasharray="2 3" />
              <circle cx="50" cy="72" r="5" fill="#D4AF37" />
              <circle cx="40" cy="62" r="3" fill="#E5C158" />
              <circle cx="60" cy="62" r="3" fill="#E5C158" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#E5C158] bg-black/60 px-1.5 py-0.5 rounded">22K Gold</span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-200">Heritage Temple Choker</div>
          <div className="text-[11px] text-slate-400">Net: 42.6g · Handcrafted</div>
        </div>

        {/* Item 2 */}
        <div className="rounded-lg bg-[#0E1A38]/70 border border-slate-800 p-3.5 hover:border-[#D4AF37]/40 transition-colors">
          <div className="h-28 rounded bg-gradient-to-b from-slate-900 to-black relative flex items-center justify-center overflow-hidden border border-slate-800">
            {/* Artistic bangle pair vector */}
            <svg className="w-20 h-20 text-slate-300" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <ellipse cx="45" cy="50" rx="26" ry="18" strokeWidth="2" stroke="#E2E8F0" />
              <ellipse cx="55" cy="50" rx="26" ry="18" strokeWidth="2" stroke="#D4AF37" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-slate-200 bg-black/60 px-1.5 py-0.5 rounded">925 Silver</span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-200">Filigree Kada Pair</div>
          <div className="text-[11px] text-slate-400">Net: 64.2g · Hallmark Certified</div>
        </div>

        {/* Item 3 */}
        <div className="rounded-lg bg-[#0E1A38]/70 border border-slate-800 p-3.5 hover:border-[#D4AF37]/40 transition-colors">
          <div className="h-28 rounded bg-gradient-to-b from-slate-900 to-black relative flex items-center justify-center overflow-hidden border border-slate-800">
            {/* Artistic ring vector */}
            <svg className="w-20 h-20 text-[#E5C158]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="55" r="18" strokeWidth="2.5" />
              <polygon points="50,28 58,40 42,40" fill="#D4AF37" />
            </svg>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#E5C158] bg-black/60 px-1.5 py-0.5 rounded">18K Solitaire</span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-200">Bespoke Diamond Band</div>
          <div className="text-[11px] text-slate-400">VVS-EF · Certified Mount</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Real-time SKU prefilled WhatsApp inquiry</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>99.2% mobile traffic performance</span>
        </div>
      </div>
    </div>
  );
};

export const CustomCRMDashboardShowcase: React.FC = () => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#D4AF37]/25 bg-[#090F20] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="text-sm font-semibold tracking-wide text-white">Commercial Operations CRM</div>
          <div className="text-xs text-slate-400">Lead Pipeline & Dispatch Stream</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>Pipeline: Active</span>
        </div>
      </div>

      {/* Visual Pipeline Columns */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#0D162E] rounded-lg p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">New Inquiries</span>
            <span className="font-mono text-[#E5C158] bg-[#D4AF37]/10 px-1.5 rounded">4</span>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-slate-800 mb-2">
            <div className="font-medium text-slate-200">Mahalaxmi Metals</div>
            <div className="text-[10px] text-slate-400">Website + CRM · ₹35k+</div>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-slate-800">
            <div className="font-medium text-slate-200">Shri Krishna Tex</div>
            <div className="text-[10px] text-slate-400">E-com Store · ₹20k</div>
          </div>
        </div>

        <div className="bg-[#0D162E] rounded-lg p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Contacted</span>
            <span className="font-mono text-slate-400 bg-slate-800 px-1.5 rounded">6</span>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-slate-800 mb-2">
            <div className="font-medium text-slate-200">Nova Clinical Labs</div>
            <div className="text-[10px] text-slate-400">Discovery call completed</div>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-slate-800">
            <div className="font-medium text-slate-200">Prasad Logistics</div>
            <div className="text-[10px] text-slate-400">Scope sheet dispatched</div>
          </div>
        </div>

        <div className="bg-[#0D162E] rounded-lg p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Proposal Sent</span>
            <span className="font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 rounded">3</span>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-[#D4AF37]/30 mb-2">
            <div className="font-medium text-[#F3DC87]">Apex Fasteners</div>
            <div className="text-[10px] text-slate-300">Custom ERP · ₹75,000</div>
          </div>
        </div>

        <div className="bg-[#0D162E] rounded-lg p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400">Won / In Build</span>
            <span className="font-mono text-emerald-400 bg-emerald-950/60 px-1.5 rounded">5</span>
          </div>
          <div className="bg-[#121E3E] p-2.5 rounded border border-emerald-900/40 mb-2">
            <div className="font-medium text-slate-200">RUBI Gold & Silver</div>
            <div className="text-[10px] text-emerald-400/90">Phase 1 Handed Over</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Server-side persistence & role-based permissions</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted data ownership</span>
        </div>
      </div>
    </div>
  );
};
