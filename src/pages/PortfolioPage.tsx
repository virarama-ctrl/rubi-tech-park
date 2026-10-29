import React, { useState } from 'react';
import { PageRoute, CaseStudy, ProjectStatus } from '../types';
import { CASE_STUDIES } from '../config/agencyConfig';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

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
      : CASE_STUDIES.filter((s) => s.status === activeFilter);

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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <span>{t.header.work}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {t.portfolio.title}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {t.portfolio.subtitle}
        </p>
      </div>

      {/* Portfolio Integrity Statement Box */}
      <div className="p-4 sm:p-5 bg-[#0B132B] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">
              {language === 'ta' ? 'எங்கள் போர்ட்ஃபோலியோ உண்மைத்தன்மைக் கொள்கை:' : 'Our Strict Portfolio Integrity Policy:'}
            </span>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === 'ta'
                ? 'கீழே உள்ள ஒவ்வொரு திட்டமும் அதன் உண்மை நிலையுடன் துல்லியமாக குறிப்பிடப்பட்டுள்ளது: லைவ் (நேரலை), செயல்பாட்டில் உள்ளது அல்லது டெமோ. நாங்கள் ஒருபோதும் போலி வாடிக்கையாளர் பெயர்களையோ அல்லது புனையப்பட்ட 5-நட்சத்திர சான்றுகளையோ பயன்படுத்துவதில்லை.'
                : 'Every project below is truthfully represented with its verified status: Live (deployed in production), In Progress (in active development milestone), or Demo (our internal reference architecture). We never fabricate client names, invent fake 5-star customer testimonials, or publish unverified vanity statistics.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Filter Segmented Control */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        <span className="text-xs text-slate-400 mr-2 shrink-0">
          {language === 'ta' ? 'நிலை வடிகட்டுதல்:' : 'Filter Status:'}
        </span>
        {(['All', 'Live', 'In Progress', 'Demo'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#D4AF37] text-[#070B14] font-semibold shadow-sm'
                : 'bg-[#0B132B] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
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
      <div className="bg-gradient-to-r from-[#0B132B] via-[#0E1A38] to-[#0B132B] border border-[#D4AF37]/30 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold font-display text-white">
          {language === 'ta' ? 'இதுபோன்ற மென்பொருள் திட்டம் தேவையா?' : 'Have a Similar Project in Mind?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          {language === 'ta'
            ? 'வாட்ஸ்அப் ஆட்டோமேஷன் கொண்ட டிஜிட்டல் கேட்டலாக், இ-காமர்ஸ் தளம் அல்லது பிரத்யேக CRM மென்பொருள் எதுவாக இருந்தாலும் உங்கள் வணிக செயல்பாட்டிற்கேற்ப எங்களால் கட்டமைக்க முடியும்.'
            : 'Whether you need a digital catalog with WhatsApp triggers, an e-commerce platform, or a private CRM, our team can architect a solution tailored to your operational realities.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] rounded-lg transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t.home.primaryCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
