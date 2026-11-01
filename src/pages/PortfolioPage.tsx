import React, { useState } from 'react';
import { PageRoute, CaseStudy, ProjectStatus } from '../types';
import { CASE_STUDIES } from '../config/agencyConfig';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectProjectForQuote?: (study: CaseStudy) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onSelectProjectForQuote
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectStatus>('All');

  const filteredStudies =
    activeFilter === 'All'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((s) => {
          if (activeFilter === 'Live') {
            return s.status === 'Live' || s.status === 'Published Website';
          }
          if (activeFilter === 'In Progress') {
            return (
              s.status === 'In Progress' ||
              s.status === 'Development / Enhancement' ||
              s.status === 'Development / Commercial Preparation'
            );
          }
          return s.status === activeFilter;
        });

  const handleRequestQuote = (study: CaseStudy) => {
    if (onSelectProjectForQuote) {
      onSelectProjectForQuote(study);
    }
    onNavigate('contact');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] dark:bg-[#172038] border border-[#6654E8]/20 text-xs font-semibold text-[#6654E8] dark:text-[#9689FF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.header.work}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#172033] dark:text-white tracking-tight">
          {t.portfolio.title}
        </h1>
        <p className="text-base text-[#647087] dark:text-slate-300 leading-relaxed">
          {t.portfolio.subtitle}
        </p>
      </div>

      {/* Portfolio Integrity Statement Box */}
      <div className="p-5 bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-2xl text-xs sm:text-sm text-[#172033] dark:text-slate-300 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#35C9B0] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#172033] dark:text-white">
              {language === 'ta' ? 'எங்கள் போர்ட்ஃபோலியோ உண்மைத்தன்மைக் கொள்கை:' : 'Our Strict Portfolio Integrity Policy:'}
            </span>
            <p className="text-[#647087] dark:text-slate-400 leading-relaxed text-xs">
              {language === 'ta'
                ? 'கீழே உள்ள ஒவ்வொரு திட்டமும் அதன் உண்மை நிலையுடன் துல்லியமாக குறிப்பிடப்பட்டுள்ளது: லைவ் (நேரலை), செயல்பாட்டில் உள்ளது அல்லது டெமோ. நாங்கள் ஒருபோதும் போலி வாடிக்கையாளர் பெயர்களையோ அல்லது புனையப்பட்ட 5-நட்சத்திர சான்றுகளையோ பயன்படுத்துவதில்லை.'
                : 'Every project below is truthfully represented with its verified status: Live (deployed in production), In Progress (in active development milestone), or Demo (our internal reference architecture). We never fabricate client names, invent fake 5-star customer testimonials, or publish unverified vanity statistics.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Filter Segmented Control */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        <span className="text-xs text-[#647087] dark:text-slate-400 mr-2 shrink-0">
          {language === 'ta' ? 'நிலை வடிகட்டுதல்:' : 'Filter Status:'}
        </span>
        {(['All', 'Live', 'In Progress', 'Demo'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#6654E8] text-white shadow-xs'
                : 'bg-white dark:bg-[#121829] text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10'
            }`}
          >
            {filter === 'All' ? t.portfolio.filterAll : filter}
          </button>
        ))}
      </div>

      {/* Project Cards List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredStudies.map((study) => (
          <CaseStudyCard
            key={study.id}
            study={study}
            onRequestQuoteForSimilar={handleRequestQuote}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold font-display text-[#172033] dark:text-white">
          {language === 'ta' ? 'இதுபோன்ற மென்பொருள் திட்டம் தேவையா?' : 'Have a Similar Project in Mind?'}
        </h2>
        <p className="text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
          {language === 'ta'
            ? 'வாட்ஸ்அப் ஆட்டோமேஷன் கொண்ட டிஜிட்டல் கேட்டலாக், இ-காமர்ஸ் தளம் அல்லது பிரத்யேக CRM மென்பொருள் எதுவாக இருந்தாலும் உங்கள் வணிக செயல்பாட்டிற்கேற்ப எங்களால் கட்டமைக்க முடியும்.'
            : 'Whether you need a digital catalog with WhatsApp triggers, an e-commerce platform, or a private CRM, our team can architect a solution tailored to your operational realities.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold brand-gradient-button rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t.home.primaryCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
