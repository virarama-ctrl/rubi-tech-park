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
          <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-0.5 rounded-full border border-[#D5DEE8] dark:border-[#30445B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
            <span>{status === 'Published Website' ? 'Published Website' : 'Live Platform'}</span>
          </span>
        );
      case 'In Progress':
      case 'Development / Enhancement':
      case 'Development / Commercial Preparation':
        return (
          <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-0.5 rounded-full border border-[#D5DEE8] dark:border-[#30445B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
            <span>{status}</span>
          </span>
        );
      case 'Demo':
      default:
        return (
          <span className="text-xs font-mono font-semibold text-[#526477] dark:text-[#B8C5D4] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-0.5 rounded-full border border-[#D5DEE8] dark:border-[#30445B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#526477] dark:bg-[#B8C5D4]" />
            <span>Reference Architecture</span>
          </span>
        );
    }
  };

  // Render project-specific visual mockup screenshots
  const renderProjectScreenshotMockup = () => {
    if (study.id === 'tamil-gold-buyer') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] p-4 sm:p-5 shadow-xs relative">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <span className="text-xs font-mono font-bold text-[#182638] dark:text-[#F1F5F9]">
                Tamil Gold Buyer · Valuation Engine & Rates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40] px-2 py-0.5 rounded-md border border-[#D5DEE8] dark:border-[#30445B]">
                https://goldandsilverbuyer.live
              </span>
            </div>
          </div>

          {/* Live Rate Ticker */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="bg-white dark:bg-[#1C2B40] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] font-mono block">24K Pure Gold</span>
              <span className="text-sm font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">₹8,150 / g</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] font-mono block">22K 916 Hallmark</span>
              <span className="text-sm font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">₹7,470 / g</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] font-mono block">18K Jewellery</span>
              <span className="text-sm font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">₹6,115 / g</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] font-mono block">Fine Silver 999</span>
              <span className="text-sm font-bold font-mono text-[#315D82] dark:text-[#6F9FC5]">₹105 / g</span>
            </div>
          </div>

          {/* Valuation Calculator Mockup */}
          <div className="mt-3 bg-white dark:bg-[#1C2B40] p-3.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#182638] dark:text-[#F1F5F9] block">Precious Metal Valuation Engine</span>
                <span className="text-[#526477] dark:text-[#B8C5D4] text-[11px]">Item: 22K Hallmarked Gold · 42.50g</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] font-mono uppercase tracking-wider block">Estimated Payout</span>
              <span className="text-base font-bold font-mono text-[#315D82] dark:text-[#6F9FC5]">₹3,17,475</span>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'kuralvaani') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
              <span className="text-xs font-mono font-bold text-[#182638] dark:text-[#F1F5F9]">
                Kuralvaani · Tamil Voice Prompt Narration Studio
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40] px-2 py-0.5 rounded-md border border-[#D5DEE8] dark:border-[#30445B]">
              Speech Synthesis Pipeline
            </span>
          </div>

          <div className="mt-3.5 space-y-3 text-xs">
            <div className="bg-white dark:bg-[#1C2B40] p-3 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] font-mono text-[#526477] dark:text-[#B8C5D4] block mb-1">Tamil Text Input Prompt:</span>
              <p className="font-sans text-xs text-[#182638] dark:text-[#F1F5F9] leading-relaxed italic">
                &ldquo;வணக்கம்! ரூபி டெக் பார்க் உங்களை அன்புடன் வரவேற்கிறது. உங்கள் வணிக வளர்ச்சிக்கான அதிநவீன மென்பொருள் சேவைகள்...&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#1C2B40] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                <span className="text-[11px] font-medium text-[#182638] dark:text-[#F1F5F9]">Voice: Tamil Native Studio Female (Madurai)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#315D82] dark:text-[#6F9FC5]">
                <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
                <span>Audio Render: 24-bit 48kHz</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (study.id === 'bulkmate') {
      return (
        <div className="mt-6 rounded-2xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
              <span className="text-xs font-mono font-bold text-[#182638] dark:text-[#F1F5F9]">
                BulkMate · Bulk Messaging Management Software
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40] px-2 py-0.5 rounded-md border border-[#D5DEE8] dark:border-[#30445B]">
              High-Throughput Queue
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">Total Messages</span>
              <span className="text-sm font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">4,520</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">Delivered</span>
              <span className="text-sm font-bold font-mono text-[#315D82] dark:text-[#6F9FC5]">4,448 (98.4%)</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">Contact Groups</span>
              <span className="text-sm font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">12 Segments</span>
            </div>
            <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
              <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">Queue Status</span>
              <span className="text-sm font-bold font-mono text-[#315D82] dark:text-[#6F9FC5]">Active Dispatch</span>
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
      className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all bg-white dark:bg-[#1C2B40] ${
        isPrimaryFeatured
          ? 'border-2 border-[#315D82] dark:border-[#6F9FC5] shadow-xs relative'
          : 'border border-[#D5DEE8] dark:border-[#30445B] shadow-xs'
      }`}
    >
      <div>
        {/* Primary Featured Project Highlight Banner */}
        {isPrimaryFeatured && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[#315D82] dark:text-[#6F9FC5] text-xs font-mono font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>PRIMARY FEATURED PROJECT</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5]">
              Flagship Client Platform
            </span>
          </div>
        )}

        {/* Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#526477] dark:text-[#B8C5D4]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">{study.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{study.location}</span>
          </div>
          <div>{getStatusBadge(study.status)}</div>
        </div>

        {/* Project Name & Title */}
        <div className="mt-4">
          {study.projectName && (
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5] mb-1">
              Project: {study.projectName}
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] leading-snug">
            {study.title}
          </h3>
        </div>

        {/* Summary Description */}
        <p className="mt-3 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
          {study.summary}
        </p>

        {/* Screenshot / Platform Mockup */}
        {renderProjectScreenshotMockup()}

        {/* Challenge & Solution Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#F2F5F8] dark:bg-[#17263A] p-4 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
            <span className="font-semibold text-[#182638] dark:text-[#F1F5F9] block mb-1">Commercial Challenge</span>
            <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed">{study.challenge}</p>
          </div>
          <div className="bg-[#F2F5F8] dark:bg-[#17263A] p-4 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
            <span className="font-semibold text-[#315D82] dark:text-[#6F9FC5] block mb-1">Engineered Solution</span>
            <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed">{study.solution}</p>
          </div>
        </div>

        {/* Key Features (if provided) */}
        {study.keyFeatures && study.keyFeatures.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider mb-2.5">
              Core Platform Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
              {study.keyFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Deliverables */}
        <div className="mt-6">
          <h4 className="text-xs font-mono font-semibold text-[#182638] dark:text-[#F1F5F9] uppercase tracking-wider mb-2.5">
            Key Verified Deliverables
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
            {study.keyDeliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Strip with Tech Stack & CTA */}
      <div className="mt-8 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
          {study.categoryTag && (
            <span className="px-2 py-0.5 rounded-md bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] font-semibold text-[11px] border border-[#D5DEE8] dark:border-[#30445B]">
              {study.categoryTag}
            </span>
          )}
          <span className="font-medium text-[#182638] dark:text-[#F1F5F9]">Stack:</span>
          {study.technologies.map((tech, idx) => (
            <span key={idx} className="text-[#526477] dark:text-[#B8C5D4] font-mono">
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
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl cyber-button-primary text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>View Live Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {onRequestQuoteForSimilar && (
            <button
              onClick={() => onRequestQuoteForSimilar(study)}
              className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1 cursor-pointer"
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
