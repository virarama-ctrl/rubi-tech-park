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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] dark:bg-[#172038] border border-[#6654E8]/20 text-xs font-semibold text-[#6654E8] dark:text-[#9689FF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.about.title}</span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ta' ? 'கோயம்புத்தூர் & அகில இந்திய இயக்கம்' : 'Coimbatore & Pan-India Consultancy'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#172033] dark:text-white tracking-tight">
          {t.about.philosophyTitle}
        </h1>
        <p className="text-base text-[#647087] dark:text-slate-300 leading-relaxed">
          {t.about.philosophyDesc}
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#121829] saas-card-hover">
          <div className="w-10 h-10 rounded-xl bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] border border-[#35C9B0]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">
            {t.about.principles.codeOwnershipTitle}
          </h2>
          <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
            {t.about.principles.codeOwnershipDesc}
          </p>
        </div>

        <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#121829] saas-card-hover">
          <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] dark:bg-[#6654E8]/20 flex items-center justify-center text-[#6654E8] border border-[#6654E8]/20">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">
            {t.about.principles.transparentPricingTitle}
          </h2>
          <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
            {t.about.principles.transparentPricingDesc}
          </p>
        </div>

        <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#121829] saas-card-hover">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] dark:bg-blue-950 flex items-center justify-center text-[#4388FF] border border-[#4388FF]/30">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">
            {t.about.principles.regionalExcellenceTitle}
          </h2>
          <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
            {t.about.principles.regionalExcellenceDesc}
          </p>
        </div>

        <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#121829] saas-card-hover">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] dark:bg-purple-950 flex items-center justify-center text-[#6654E8] border border-[#6654E8]/20">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">
            {t.about.principles.directEngineeringTitle}
          </h2>
          <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
            {t.about.principles.directEngineeringDesc}
          </p>
        </div>
      </div>

      {/* Coimbatore Hub & Pan-India Scope */}
      <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6654E8] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#6654E8]" />
            <span>{t.about.coimbatoreHubTitle}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-[#172033] dark:text-white mt-1">
            {language === 'ta' ? 'காந்திபுரம், கோயம்புத்தூர் தலைமையகம்' : 'Headquartered in Gandhipuram, Coimbatore'}
          </h2>
          <p className="text-xs sm:text-sm text-[#647087] dark:text-slate-400 mt-2 leading-relaxed">
            {t.about.coimbatoreHubDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {AGENCY_CONFIG.servingAreas.map((area, idx) => (
            <div key={idx} className="bg-[#FAFBFF] dark:bg-[#070B14] p-3 rounded-xl border border-[#E5E9F2] dark:border-slate-800 text-[#172033] dark:text-slate-300 flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6654E8]" />
              <span className="font-medium">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Production CRM Pipeline Active */}
      <div className="saas-card rounded-3xl p-6 sm:p-10 space-y-4 bg-white dark:bg-[#121829]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#35C9B0] uppercase tracking-wider">
          <Lock className="w-4 h-4 text-[#35C9B0]" />
          <span>{language === 'ta' ? 'பாதுகாப்பான CRM கட்டமைப்பு' : 'Active Secure CRM Infrastructure'}</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-[#172033] dark:text-white">
          {language === 'ta' ? 'நிரந்தர தரவுத்தளம் மற்றும் அங்கீகரிக்கப்பட்ட CRM மேலாண்மை' : 'Persistent Database & Server-Enforced Lead Management'}
        </h2>
        <p className="text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
          {language === 'ta'
            ? 'RUBI TECH PARK இணையதளத்தில் பெறப்படும் அனைத்து விசாரணைகளும் எங்களின் பாதுகாப்பான CRM தரவுத்தளத்தில் நேரடியாகப் பதிவு செய்யப்படுகின்றன. அங்கீகரிக்கப்பட்ட நிர்வாகிகள் மட்டுமே இந்தத் தரவுகளை அணுக முடியும்.'
            : 'All enquiries submitted on the RUBI TECH PARK platform are validated on the server and persisted directly into our secure CRM database with strict server-side session authentication, role-based access control, rate limiting, and auditable logging.'}
        </p>
      </div>

      {/* CTA Strip */}
      <div className="text-center max-w-2xl mx-auto pt-6 space-y-4">
        <h2 className="text-2xl font-bold font-display text-[#172033] dark:text-white">
          {language === 'ta' ? 'நம்பகமான மென்பொருள் கூட்டாளருடன் பணியாற்ற தயாரா?' : 'Ready to Work with a Credible Engineering Partner?'}
        </h2>
        <p className="text-xs sm:text-sm text-[#647087] dark:text-slate-400">
          {language === 'ta' ? 'உங்கள் திட்ட தேவைகளை எங்களுடன் கலந்தாலோசியுங்கள்.' : 'Reach out today to discuss your digital presence or operational software requirements.'}
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 text-xs sm:text-sm font-semibold brand-gradient-button rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow"
        >
          <span>{t.about.contactCta}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
