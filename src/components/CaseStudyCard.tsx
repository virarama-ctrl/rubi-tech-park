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
          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Live Client Platform</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="text-xs font-medium text-[#F3DC87] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Active Implementation</span>
          </span>
        );
      case 'Demo':
        return (
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Reference Architecture Demo</span>
          </span>
        );
    }
  };

  return (
    <article className="gold-card rounded-xl p-6 sm:p-8 flex flex-col justify-between gold-card-hover">
      <div>
        {/* Anti-Slop Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">{study.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{study.location}</span>
          </div>
          <div>{getStatusBadge(study.status)}</div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl sm:text-2xl font-bold font-display text-white leading-snug">
          {study.title}
        </h3>

        {/* Summary */}
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {study.summary}
        </p>

        {/* Challenge & Solution Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#070B14]/80 p-3.5 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-300 block mb-1">Commercial Challenge</span>
            <p className="text-slate-400 leading-relaxed">{study.challenge}</p>
          </div>
          <div className="bg-[#070B14]/80 p-3.5 rounded-lg border border-slate-800">
            <span className="font-semibold text-[#F3DC87] block mb-1">Engineered Solution</span>
            <p className="text-slate-400 leading-relaxed">{study.solution}</p>
          </div>
        </div>

        {/* Key Deliverables */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
            Key Verified Deliverables
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {study.keyDeliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Strip with Tech Stack & CTA */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-500">Stack:</span>
          {study.technologies.map((tech, idx) => (
            <span key={idx} className="text-slate-300">
              {tech}
              {idx < study.technologies.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        {onRequestQuoteForSimilar && (
          <button
            onClick={() => onRequestQuoteForSimilar(study)}
            className="text-xs font-semibold text-[#F3DC87] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Discuss Similar Architecture</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        )}
      </div>
    </article>
  );
};
