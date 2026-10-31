import React from 'react';
import { CaseStudy } from '../types';
import { ArrowUpRight, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

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
        return (
          <span className="text-xs font-semibold text-[#0F766E] dark:text-emerald-300 bg-[#E5FAF7] dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-[#35C9B0]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35C9B0]" />
            <span>Live Client Platform</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-2.5 py-0.5 rounded-full border border-[#6654E8]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6654E8]" />
            <span>Active Implementation</span>
          </span>
        );
      case 'Demo':
        return (
          <span className="text-xs font-semibold text-[#647087] dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Reference Architecture Demo</span>
          </span>
        );
    }
  };

  return (
    <article className="saas-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between saas-card-hover bg-white dark:bg-[#121829]">
      <div>
        {/* Anti-Slop Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E9F2] dark:border-white/10 text-xs text-[#647087] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033] dark:text-slate-300">{study.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{study.location}</span>
          </div>
          <div>{getStatusBadge(study.status)}</div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white leading-snug">
          {study.title}
        </h3>

        {/* Summary */}
        <p className="mt-3 text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
          {study.summary}
        </p>

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
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#647087] dark:text-slate-400">
          <span className="font-medium text-[#172033] dark:text-slate-300">Stack:</span>
          {study.technologies.map((tech, idx) => (
            <span key={idx} className="text-[#647087] dark:text-slate-400">
              {tech}
              {idx < study.technologies.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        {onRequestQuoteForSimilar && (
          <button
            onClick={() => onRequestQuoteForSimilar(study)}
            className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Request Scope for Similar Solution</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </article>
  );
};
