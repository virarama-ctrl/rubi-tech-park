import React, { useState } from 'react';
import { PageRoute, CaseStudy, ProjectStatus } from '../types';
import { CASE_STUDIES } from '../config/agencyConfig';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ArrowRight, Sparkles, Terminal } from 'lucide-react';

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
    <div className="relative futuristic-mesh-bg min-h-screen text-[#182638] dark:text-[#F1F5F9] transition-colors">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{t.header.work}</span>
            <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
            <span>{t.brand.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
            {t.portfolio.title}
          </h1>
          <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Portfolio Integrity Statement Box */}
        <div className="p-5 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl text-xs sm:text-sm text-[#182638] dark:text-[#F1F5F9] shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                {language === 'ta' ? 'எங்கள் போர்ட்ஃபோலியோ உண்மைத்தன்மைக் கொள்கை:' : 'Our Strict Engineering Integrity Policy:'}
              </span>
              <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed text-xs">
                {language === 'ta'
                  ? 'கீழே உள்ள ஒவ்வொரு திட்டமும் அதன் உண்மை நிலையுடன் துல்லியமாக குறிப்பிடப்பட்டுள்ளது: லைவ் (நேரலை), செயல்பாட்டில் உள்ளது அல்லது டெமோ. நாங்கள் ஒருபோதும் போலி வாடிக்கையாளர் பெயர்களையோ அல்லது புனையப்பட்ட 5-நட்சத்திர சான்றுகளையோ பயன்படுத்துவதில்லை.'
                  : 'Every project below is truthfully represented with its verified status: Live (deployed in production), In Progress (in active development milestone), or Demo (our internal reference architecture). We never fabricate client names, invent fake 5-star customer testimonials, or publish unverified vanity statistics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Filter Segmented Control */}
        <div className="flex items-center gap-2 pb-2 overflow-x-auto">
          <span className="text-xs font-mono text-[#526477] dark:text-[#B8C5D4] mr-2 shrink-0">
            {language === 'ta' ? 'நிலை வடிகட்டுதல்:' : 'Filter Pipeline:'}
          </span>
          {(['All', 'Live', 'In Progress', 'Demo'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`nav-tab-item px-4 py-2 text-xs font-mono font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 ${
                activeFilter === filter
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs'
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
        <div className="interactive-card bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xs">
          <h2 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {language === 'ta' ? 'இதுபோன்ற மென்பொருள் திட்டம் தேவையா?' : 'Have an Architecture Challenge in Mind?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed max-w-xl mx-auto">
            {language === 'ta'
              ? 'வாட்ஸ்அப் ஆட்டோமேஷன் கொண்ட டிஜிட்டல் கேட்டலாக், இ-காமர்ஸ் தளம் அல்லது பிரத்யேக CRM மென்பொருள் எதுவாக இருந்தாலும் உங்கள் வணிக செயல்பாட்டிற்கேற்ப எங்களால் கட்டமைக்க முடியும்.'
              : 'Whether you require an automated catalog, high-concurrency fintech valuation tool, e-commerce engine, or a secure private CRM, our engineering team can architect a solution tailored to your operational realities.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3 text-xs sm:text-sm font-semibold cyber-button-primary rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
            >
              <span>{t.home.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
