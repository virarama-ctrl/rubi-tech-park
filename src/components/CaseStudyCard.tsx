import React from 'react';
import { CaseStudy } from '../types';
import {
  ArrowUpRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Calculator,
  Coins,
  Mic,
  Volume2,
  Send,
  Users,
  BarChart2,
  ShieldCheck,
  TrendingUp,
  Layers
} from 'lucide-react';

interface CaseStudyCardProps {
  study: CaseStudy;
  onSelectProject?: (study: CaseStudy) => void;
  onRequestQuoteForSimilar?: (study: CaseStudy) => void;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  study,
  onRequestQuoteForSimilar
}) => {
  const getStatusBadge = (status: CaseStudy['status']) => {
    switch (status) {
      case 'Live':
      case 'Published Website':
        return (
          <span className="text-xs font-semibold text-[#0F766E] dark:text-emerald-300 bg-[#E5FAF7] dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-[#35C9B0]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35C9B0] animate-pulse" />
            <span>{status === 'Published Website' ? 'Published Website' : 'Live Platform'}</span>
          </span>
        );
      case 'In Progress':
      case 'Development / Enhancement':
      case 'Development / Commercial Preparation':
        return (
          <span className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-2.5 py-0.5 rounded-full border border-[#6654E8]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6654E8]" />
            <span>{status}</span>
          </span>
        );
      case 'Demo':
      default:
        return (
          <span className="text-xs font-semibold text-[#647087] dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Reference Architecture</span>
          </span>
        );
    }
  };

  // Render project-specific visual mockup screenshots
  const renderProjectScreenshotMockup = () => {
    if (study.id === 'tamil-gold-buyer') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-amber-300/60 dark:border-amber-500/30 bg-gradient-to-br from-[#FFFDF9] via-[#FFF9EB] to-[#FFF4D6] dark:from-[#16140E] dark:via-[#1A1811] dark:to-[#14120B] p-4 sm:p-5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-200/70 dark:border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-300">
                Tamil Gold Buyer · Valuation Engine & Rates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                https://goldandsilverbuyer.live
              </span>
            </div>
          </div>

          {/* Live Rate Ticker */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="bg-white/80 dark:bg-[#1E1B12] p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block">24K Pure Gold</span>
              <span className="text-sm font-bold font-mono text-[#172033] dark:text-amber-200">₹8,150 / g</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1E1B12] p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block">22K 916 Hallmark</span>
              <span className="text-sm font-bold font-mono text-[#172033] dark:text-amber-200">₹7,470 / g</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1E1B12] p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block">18K Jewellery</span>
              <span className="text-sm font-bold font-mono text-[#172033] dark:text-amber-200">₹6,115 / g</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1E1B12] p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold block">Fine Silver 999</span>
              <span className="text-sm font-bold font-mono text-[#172033] dark:text-slate-200">₹105 / g</span>
            </div>
          </div>

          {/* Valuation Calculator Mockup */}
          <div className="mt-3 bg-white/90 dark:bg-[#1A1813] p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#172033] dark:text-amber-200 block">Instant Precious Metal Calculator</span>
                <span className="text-[#647087] dark:text-slate-400 text-[11px]">Item: 22K Hallmarked Gold · 42.50g</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider block">Estimated Payout</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">₹3,17,475</span>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'kuralvaani') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#E5E9F2] dark:border-white/10 bg-gradient-to-br from-[#FAFBFF] via-[#F3F0FF] to-[#EDE9FE] dark:from-[#101222] dark:via-[#14152B] dark:to-[#171329] p-4 sm:p-5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E9F2] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#6654E8]" />
              <span className="text-xs font-mono font-bold text-[#172033] dark:text-white">
                Kuralvaani · Tamil Voice Prompt Narration Studio
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#6654E8] dark:text-[#9689FF] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-2 py-0.5 rounded-md">
              Speech Synthesis Pipeline
            </span>
          </div>

          <div className="mt-3.5 space-y-3 text-xs">
            <div className="bg-white/80 dark:bg-[#16182B] p-3 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <span className="text-[10px] font-semibold text-[#647087] dark:text-slate-400 block mb-1">Tamil Text Input Prompt:</span>
              <p className="font-mono text-xs text-[#172033] dark:text-slate-200 leading-relaxed italic">
                &ldquo;வணக்கம்! ரூபி டெக் பார்க் உங்களை அன்புடன் வரவேற்கிறது. உங்கள் வணிக வளர்ச்சிக்கான அதிநவீன மென்பொருள் சேவைகள்...&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/60 dark:bg-[#16182B] p-2.5 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#6654E8]" />
                <span className="text-[11px] font-medium text-[#172033] dark:text-slate-300">Voice: Tamil Native Studio Female (Madurai)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Audio Render: 24-bit 48kHz</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'bulkmate') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#E5E9F2] dark:border-white/10 bg-gradient-to-br from-[#FAFBFF] via-[#EAF3FF] to-[#E0E7FF] dark:from-[#0E1526] dark:via-[#111C33] dark:to-[#14203D] p-4 sm:p-5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E9F2] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#4388FF]" />
              <span className="text-xs font-mono font-bold text-[#172033] dark:text-white">
                BulkMate · Bulk Messaging Management Software
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#4388FF] dark:text-blue-400 bg-[#EAF3FF] dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
              High-Throughput Queue
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white/80 dark:bg-[#131E38] p-2 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <span className="text-[10px] text-[#647087] dark:text-slate-400 block">Total Messages</span>
              <span className="text-sm font-bold font-mono text-[#172033] dark:text-white">4,520</span>
            </div>
            <div className="bg-white/80 dark:bg-[#131E38] p-2 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <span className="text-[10px] text-[#647087] dark:text-slate-400 block">Delivered</span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">4,448 (98.4%)</span>
            </div>
            <div className="bg-white/80 dark:bg-[#131E38] p-2 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <span className="text-[10px] text-[#647087] dark:text-slate-400 block">Contact Groups</span>
              <span className="text-sm font-bold font-mono text-[#4388FF]">12 Segments</span>
            </div>
            <div className="bg-white/80 dark:bg-[#131E38] p-2 rounded-xl border border-[#E5E9F2] dark:border-white/5">
              <span className="text-[10px] text-[#647087] dark:text-slate-400 block">Queue Status</span>
              <span className="text-sm font-bold font-mono text-[#6654E8] dark:text-[#9689FF]">Active Dispatch</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const isPrimaryFeatured = study.isFeatured || study.featured;

  return (
    <article
      className={`saas-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between saas-card-hover transition-all ${
        isPrimaryFeatured
          ? 'border-2 border-amber-400/60 dark:border-amber-500/40 shadow-xl shadow-amber-500/5 bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF9EE] dark:from-[#121829] dark:via-[#151B2E] dark:to-[#1B1810]'
          : 'bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10'
      }`}
    >
      <div>
        {/* Primary Featured Project Highlight Banner */}
        {isPrimaryFeatured && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-200/80 dark:border-amber-500/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 dark:from-amber-400/20 dark:to-yellow-400/10 border border-amber-400/40 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>PRIMARY FEATURED PROJECT</span>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
              Flagship Client Platform
            </span>
          </div>
        )}

        {/* Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E9F2] dark:border-white/10 text-xs text-[#647087] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033] dark:text-slate-300">{study.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{study.location}</span>
          </div>
          <div>{getStatusBadge(study.status)}</div>
        </div>

        {/* Project Name & Title */}
        <div className="mt-4">
          {study.projectName && (
            <div className="text-xs font-bold uppercase tracking-wider text-[#6654E8] dark:text-[#9689FF] mb-1">
              Project: {study.projectName}
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white leading-snug">
            {study.title}
          </h3>
        </div>

        {/* Summary Description */}
        <p className="mt-3 text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
          {study.summary}
        </p>

        {/* Screenshot / Platform Mockup */}
        {renderProjectScreenshotMockup()}

        {/* Challenge & Solution Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#FAFBFF] dark:bg-[#070B14] p-4 rounded-xl border border-[#E5E9F2] dark:border-white/5">
            <span className="font-semibold text-[#172033] dark:text-slate-200 block mb-1">Commercial Challenge</span>
            <p className="text-[#647087] dark:text-slate-400 leading-relaxed">{study.challenge}</p>
          </div>
          <div className="bg-[#FAFBFF] dark:bg-[#070B14] p-4 rounded-xl border border-[#E5E9F2] dark:border-white/5">
            <span className="font-semibold text-[#6654E8] dark:text-[#9689FF] block mb-1">Engineered Solution</span>
            <p className="text-[#647087] dark:text-slate-400 leading-relaxed">{study.solution}</p>
          </div>
        </div>

        {/* Key Features (if provided) */}
        {study.keyFeatures && study.keyFeatures.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-[#172033] dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Core Platform Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172033] dark:text-slate-300">
              {study.keyFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Deliverables */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-[#172033] dark:text-slate-200 uppercase tracking-wider mb-2.5">
            Key Verified Deliverables
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172033] dark:text-slate-300">
            {study.keyDeliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#35C9B0] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Strip with Tech Stack & CTA */}
      <div className="mt-8 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#647087] dark:text-slate-400">
          {study.categoryTag && (
            <span className="px-2 py-0.5 rounded-md bg-[#6654E8]/10 text-[#6654E8] dark:text-[#9689FF] font-semibold text-[11px]">
              {study.categoryTag}
            </span>
          )}
          <span className="font-medium text-[#172033] dark:text-slate-300">Stack:</span>
          {study.technologies.map((tech, idx) => (
            <span key={idx} className="text-[#647087] dark:text-slate-400">
              {tech}
              {idx < study.technologies.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* View Live Platform Button: ONLY rendered if study.liveUrl is present */}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>View Live Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {onRequestQuoteForSimilar && (
            <button
              onClick={() => onRequestQuoteForSimilar(study)}
              className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Request Scope</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
