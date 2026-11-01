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
  Sparkles,
  Terminal,
  Cpu
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative futuristic-mesh-bg min-h-screen text-slate-900 dark:text-white transition-colors">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00D4FF]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/30 text-xs font-mono text-[#0284C7] dark:text-[#00D4FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
            <span>{t.about.title}</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-[#8292AA]">·</span>
            <span>{language === 'ta' ? 'கோயம்புத்தூர் & அகில இந்திய இயக்கம்' : 'Coimbatore & Pan-India Consultancy'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            {t.about.philosophyTitle}
          </h1>
          <p className="text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            {t.about.philosophyDesc}
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 saas-card-hover shadow-md dark:shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#00E5A3]/10 flex items-center justify-center text-emerald-600 dark:text-[#00E5A3] border border-emerald-200 dark:border-[#00E5A3]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {t.about.principles.codeOwnershipTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {t.about.principles.codeOwnershipDesc}
            </p>
          </div>

          <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 saas-card-hover shadow-md dark:shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-[#00D4FF]/10 flex items-center justify-center text-[#0284C7] dark:text-[#00D4FF] border border-cyan-200 dark:border-[#00D4FF]/30">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {t.about.principles.transparentPricingTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {t.about.principles.transparentPricingDesc}
            </p>
          </div>

          <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 saas-card-hover shadow-md dark:shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#356BFF]/10 flex items-center justify-center text-blue-600 dark:text-[#356BFF] border border-blue-200 dark:border-[#356BFF]/30">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {t.about.principles.regionalExcellenceTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {t.about.principles.regionalExcellenceDesc}
            </p>
          </div>

          <div className="saas-card rounded-2xl p-6 space-y-3 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 saas-card-hover shadow-md dark:shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#8057FF]/10 flex items-center justify-center text-purple-600 dark:text-[#8057FF] border border-purple-200 dark:border-[#8057FF]/30">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {t.about.principles.directEngineeringTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {t.about.principles.directEngineeringDesc}
            </p>
          </div>
        </div>

        {/* Coimbatore Hub & Pan-India Scope */}
        <div className="bg-white dark:bg-[#0B1530]/85 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/25 rounded-3xl p-6 sm:p-10 space-y-6 shadow-lg dark:shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#0284C7] dark:text-[#00D4FF] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF]" />
              <span>{t.about.coimbatoreHubTitle}</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
              {language === 'ta' ? 'காந்திபுரம், கோயம்புத்தூர் தலைமையகம்' : 'Headquartered in Gandhipuram, Coimbatore'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] mt-2 leading-relaxed">
              {t.about.coimbatoreHubDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {AGENCY_CONFIG.servingAreas.map((area, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#070B18]/90 p-3 rounded-xl border border-slate-200 dark:border-[#00D4FF]/15 text-slate-700 dark:text-[#CBD5E1] flex items-center gap-2 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] dark:bg-[#00D4FF]" />
                <span className="font-mono">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Production CRM Pipeline Active */}
        <div className="saas-card rounded-3xl p-6 sm:p-10 space-y-4 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/25 shadow-md dark:shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-[#00E5A3] uppercase tracking-wider">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-[#00E5A3]" />
            <span>{language === 'ta' ? 'பாதுகாப்பான CRM கட்டமைப்பு' : 'Active Secure CRM Infrastructure'}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {language === 'ta' ? 'நிரந்தர தரவுத்தளம் மற்றும் அங்கீகரிக்கப்பட்ட CRM மேலாண்மை' : 'Persistent Database & Server-Enforced Lead Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            {language === 'ta'
              ? 'RUBI TECH PARK இணையதளத்தில் பெறப்படும் அனைத்து விசாரணைகளும் எங்களின் பாதுகாப்பான CRM தரவுத்தளத்தில் நேரடியாகப் பதிவு செய்யப்படுகின்றன. அங்கீகரிக்கப்பட்ட நிர்வாகிகள் மட்டுமே இந்தத் தரவுகளை அணுக முடியும்.'
              : 'All enquiries submitted on the RUBI TECH PARK platform are validated on the server and persisted directly into our secure CRM database with strict server-side session authentication, role-based access control, rate limiting, and auditable logging.'}
          </p>
        </div>

        {/* CTA Strip */}
        <div className="text-center max-w-2xl mx-auto pt-6 space-y-4">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {language === 'ta' ? 'நம்பகமான மென்பொருள் கூட்டாளருடன் பணியாற்ற தயாரா?' : 'Ready to Work with a Credible Engineering Partner?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1]">
            {language === 'ta' ? 'உங்கள் திட்ட தேவைகளை எங்களுடன் கலந்தாலோசியுங்கள்.' : 'Reach out today to discuss your digital presence or operational software requirements.'}
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold cyber-button-primary rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg"
          >
            <span>{t.about.contactCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
