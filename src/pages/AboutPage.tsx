import React from 'react';
import { PageRoute } from '../types';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  MapPin,
  Code,
  ArrowRight,
  Database,
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative min-h-screen text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{t.about.title}</span>
            <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
            <span>{language === 'ta' ? 'கோயம்புத்தூர் & அகில இந்திய இயக்கம்' : 'Coimbatore & Pan-India Consultancy'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
            {t.about.philosophyTitle}
          </h1>
          <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            {t.about.philosophyDesc}
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl p-6 space-y-3 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.about.principles.codeOwnershipTitle}
            </h2>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {t.about.principles.codeOwnershipDesc}
            </p>
          </div>

          <div className="rounded-2xl p-6 space-y-3 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.about.principles.transparentPricingTitle}
            </h2>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {t.about.principles.transparentPricingDesc}
            </p>
          </div>

          <div className="rounded-2xl p-6 space-y-3 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.about.principles.regionalExcellenceTitle}
            </h2>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {t.about.principles.regionalExcellenceDesc}
            </p>
          </div>

          <div className="rounded-2xl p-6 space-y-3 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.about.principles.directEngineeringTitle}
            </h2>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {t.about.principles.directEngineeringDesc}
            </p>
          </div>
        </div>

        {/* Coimbatore Hub & Pan-India Scope */}
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>{t.about.coimbatoreHubTitle}</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] mt-1">
              {language === 'ta' ? 'காந்திபுரம், கோயம்புத்தூர் தலைமையகம்' : 'Headquartered in Gandhipuram, Coimbatore'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] mt-2 leading-relaxed">
              {t.about.coimbatoreHubDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {AGENCY_CONFIG.servingAreas.map((area, idx) => (
              <div key={idx} className="bg-[#F2F5F8] dark:bg-[#17263A] p-3 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] flex items-center gap-2 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
                <span className="font-mono">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Production CRM Pipeline Active */}
        <div className="rounded-3xl p-6 sm:p-10 space-y-4 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
            <Lock className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{language === 'ta' ? 'பாதுகாப்பான CRM கட்டமைப்பு' : 'Active Secure CRM Infrastructure'}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {language === 'ta' ? 'நிரந்தர தரவுத்தளம் மற்றும் அங்கீகரிக்கப்பட்ட CRM மேலாண்மை' : 'Persistent Database & Server-Enforced Lead Management'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            {language === 'ta'
              ? 'RUBI TECH PARK இணையதளத்தில் பெறப்படும் அனைத்து விசாரணைகளும் எங்களின் பாதுகாப்பான CRM தரவுத்தளத்தில் நேரடியாகப் பதிவு செய்யப்படுகின்றன. அங்கீகரிக்கப்பட்ட நிர்வாகிகள் மட்டுமே இந்தத் தரவுகளை அணுக முடியும்.'
              : 'All enquiries submitted on the RUBI TECH PARK platform are validated on the server and persisted directly into our secure CRM database with strict server-side session authentication, role-based access control, rate limiting, and auditable logging.'}
          </p>
        </div>

        {/* CTA Strip */}
        <div className="text-center max-w-2xl mx-auto pt-6 space-y-4">
          <h2 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {language === 'ta' ? 'நம்பகமான மென்பொருள் கூட்டாளருடன் பணியாற்ற தயாரா?' : 'Ready to Work with a Credible Engineering Partner?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4]">
            {language === 'ta' ? 'உங்கள் திட்ட தேவைகளை எங்களுடன் கலந்தாலோசியுங்கள்.' : 'Reach out today to discuss your digital presence or operational software requirements.'}
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold cyber-button-primary rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            <span>{t.about.contactCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
