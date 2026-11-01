import React from 'react';
import { CaseStudy } from '../types';
import {
  ArrowUpRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Calculator,
  Mic,
  Volume2,
  Send,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal
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
          <span className="text-xs font-mono font-semibold text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-full border border-[#00D4FF]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span>{status === 'Published Website' ? 'Published Website' : 'Live Platform'}</span>
          </span>
        );
      case 'In Progress':
      case 'Development / Enhancement':
      case 'Development / Commercial Preparation':
        return (
          <span className="text-xs font-mono font-semibold text-[#356BFF] bg-[#356BFF]/10 px-2.5 py-0.5 rounded-full border border-[#356BFF]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#356BFF]" />
            <span>{status}</span>
          </span>
        );
      case 'Demo':
      default:
        return (
          <span className="text-xs font-mono font-semibold text-[#CBD5E1] bg-[#070B18] px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8292AA]" />
            <span>Reference Architecture</span>
          </span>
        );
    }
  };

  // Render project-specific visual mockup screenshots
  const renderProjectScreenshotMockup = () => {
    if (study.id === 'tamil-gold-buyer') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#00D4FF]/30 bg-slate-50 dark:bg-[#070B18]/90 p-4 sm:p-5 shadow-xs dark:shadow-inner relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D4FF]/10 blur-[60px] pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#00D4FF]/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] dark:bg-[#00D4FF] animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                Tamil Gold Buyer · Valuation Engine & Rates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#0284C7] dark:text-[#00D4FF] bg-cyan-50 dark:bg-[#00D4FF]/10 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-[#00D4FF]/25">
                https://goldandsilverbuyer.live
              </span>
            </div>
          </div>

          {/* Live Rate Ticker */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="bg-white dark:bg-[#0B1530] p-2.5 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] font-mono block">24K Pure Gold</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">₹8,150 / g</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2.5 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] font-mono block">22K 916 Hallmark</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">₹7,470 / g</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2.5 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] font-mono block">18K Jewellery</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">₹6,115 / g</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2.5 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] font-mono block">Fine Silver 999</span>
              <span className="text-sm font-bold font-mono text-[#0284C7] dark:text-[#00D4FF]">₹105 / g</span>
            </div>
          </div>

          {/* Valuation Calculator Mockup */}
          <div className="mt-3 bg-white dark:bg-[#0B1530]/90 p-3.5 rounded-xl border border-slate-200 dark:border-[#00D4FF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-[#00D4FF]/10 border border-cyan-200 dark:border-[#00D4FF]/30 flex items-center justify-center text-[#0284C7] dark:text-[#00D4FF] shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Precious Metal Valuation Engine</span>
                <span className="text-slate-600 dark:text-[#CBD5E1] text-[11px]">Item: 22K Hallmarked Gold · 42.50g</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] font-mono uppercase tracking-wider block">Estimated Payout</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-[#00E5A3]">₹3,17,475</span>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'kuralvaani') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#356BFF]/25 bg-slate-50 dark:bg-[#070B18]/90 p-4 sm:p-5 shadow-xs dark:shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#356BFF]/15">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600 dark:text-[#356BFF]" />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                Kuralvaani · Tamil Voice Prompt Narration Studio
              </span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-[#356BFF] bg-blue-50 dark:bg-[#356BFF]/10 px-2 py-0.5 rounded-md border border-blue-200 dark:border-[#356BFF]/25">
              Speech Synthesis Pipeline
            </span>
          </div>

          <div className="mt-3.5 space-y-3 text-xs">
            <div className="bg-white dark:bg-[#0B1530] p-3 rounded-xl border border-slate-200 dark:border-[#356BFF]/15">
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#8292AA] block mb-1">Tamil Text Input Prompt:</span>
              <p className="font-mono text-xs text-slate-700 dark:text-[#CBD5E1] leading-relaxed italic">
                &ldquo;வணக்கம்! ரூபி டெக் பார்க் உங்களை அன்புடன் வரவேற்கிறது. உங்கள் வணிக வளர்ச்சிக்கான அதிநவீன மென்பொருள் சேவைகள்...&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#0B1530]/70 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-[#356BFF]" />
                <span className="text-[11px] font-medium text-slate-700 dark:text-[#CBD5E1]">Voice: Tamil Native Studio Female (Madurai)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-[#00E5A3]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00E5A3] animate-pulse" />
                <span>Audio Render: 24-bit 48kHz</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'bulkmate') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#8057FF]/25 bg-slate-50 dark:bg-[#070B18]/90 p-4 sm:p-5 shadow-xs dark:shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#8057FF]/15">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600 dark:text-[#8057FF]" />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                BulkMate · Bulk Messaging Management Software
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-700 dark:text-[#8057FF] bg-purple-50 dark:bg-[#8057FF]/10 px-2 py-0.5 rounded-md border border-purple-200 dark:border-[#8057FF]/25">
              High-Throughput Queue
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white dark:bg-[#0B1530] p-2 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] block">Total Messages</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">4,520</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] block">Delivered</span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-[#00E5A3]">4,448 (98.4%)</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] block">Contact Groups</span>
              <span className="text-sm font-bold font-mono text-blue-600 dark:text-[#356BFF]">12 Segments</span>
            </div>
            <div className="bg-white dark:bg-[#0B1530] p-2 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-[#8292AA] block">Queue Status</span>
              <span className="text-sm font-bold font-mono text-purple-600 dark:text-[#8057FF]">Active Dispatch</span>
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
      className={`saas-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between saas-card-hover transition-all bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl ${
        isPrimaryFeatured
          ? 'border-2 border-[#0284C7]/50 dark:border-[#00D4FF]/45 shadow-xl shadow-blue-500/10 dark:shadow-2xl dark:shadow-[#00D4FF]/10 relative'
          : 'border border-slate-200 dark:border-[#00D4FF]/15 shadow-sm dark:shadow-none'
      }`}
    >
      <div>
        {/* Primary Featured Project Highlight Banner */}
        {isPrimaryFeatured && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#00D4FF]/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-[#00D4FF]/10 border border-cyan-200 dark:border-[#00D4FF]/30 text-[#0284C7] dark:text-[#00D4FF] text-xs font-mono font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF] animate-pulse" />
              <span>PRIMARY FEATURED PROJECT</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#00D4FF]">
              Flagship Client Platform
            </span>
          </div>
        )}

        {/* Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#00D4FF]/15 text-xs text-slate-600 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">{study.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{study.location}</span>
          </div>
          <div>{getStatusBadge(study.status)}</div>
        </div>

        {/* Project Name & Title */}
        <div className="mt-4">
          {study.projectName && (
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0284C7] dark:text-[#00D4FF] mb-1">
              Project: {study.projectName}
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white leading-snug">
            {study.title}
          </h3>
        </div>

        {/* Summary Description */}
        <p className="mt-3 text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
          {study.summary}
        </p>

        {/* Screenshot / Platform Mockup */}
        {renderProjectScreenshotMockup()}

        {/* Challenge & Solution Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-[#070B18]/80 p-4 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">Commercial Challenge</span>
            <p className="text-slate-600 dark:text-[#CBD5E1] leading-relaxed">{study.challenge}</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#070B18]/80 p-4 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15">
            <span className="font-semibold text-[#0284C7] dark:text-[#00D4FF] block mb-1">Engineered Solution</span>
            <p className="text-slate-600 dark:text-[#CBD5E1] leading-relaxed">{study.solution}</p>
          </div>
        </div>

        {/* Key Features (if provided) */}
        {study.keyFeatures && study.keyFeatures.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#00D4FF] uppercase tracking-wider mb-2.5">
              Core Platform Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-[#CBD5E1]">
              {study.keyFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Deliverables */}
        <div className="mt-6">
          <h4 className="text-xs font-mono font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
            Key Verified Deliverables
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-[#CBD5E1]">
            {study.keyDeliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5A3] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Strip with Tech Stack & CTA */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-[#00D4FF]/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-[#CBD5E1]">
          {study.categoryTag && (
            <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-[#00D4FF]/10 text-[#0284C7] dark:text-[#00D4FF] font-semibold text-[11px] border border-cyan-200 dark:border-[#00D4FF]/20">
              {study.categoryTag}
            </span>
          )}
          <span className="font-medium text-slate-900 dark:text-white">Stack:</span>
          {study.technologies.map((tech, idx) => (
            <span key={idx} className="text-slate-600 dark:text-[#CBD5E1] font-mono">
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
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl cyber-button-primary text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>View Live Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {onRequestQuoteForSimilar && (
            <button
              onClick={() => onRequestQuoteForSimilar(study)}
              className="text-xs font-semibold text-[#0284C7] dark:text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
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
