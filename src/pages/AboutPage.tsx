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
  Building2
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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <span>{t.about.title}</span>
          <span aria-hidden="true">·</span>
          <span>{language === 'ta' ? 'கோயம்புத்தூர் & அகில இந்திய இயக்கம்' : 'Coimbatore & Pan-India Technology Consultancy'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {t.about.philosophyTitle}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {t.about.philosophyDesc}
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="gold-card rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#070B14] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-white">
            {t.about.principles.codeOwnershipTitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.principles.codeOwnershipDesc}
          </p>
        </div>

        <div className="gold-card rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#070B14] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-white">
            {t.about.principles.transparentPricingTitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.principles.transparentPricingDesc}
          </p>
        </div>

        <div className="gold-card rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#070B14] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-white">
            {t.about.principles.regionalExcellenceTitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.principles.regionalExcellenceDesc}
          </p>
        </div>

        <div className="gold-card rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#070B14] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-display text-white">
            {t.about.principles.directEngineeringTitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.about.principles.directEngineeringDesc}
          </p>
        </div>
      </div>

      {/* Coimbatore Hub & Pan-India Scope */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.about.coimbatoreHubTitle}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white mt-1">
            {language === 'ta' ? 'காந்திபுரம், கோயம்புத்தூர் தலைமையகம்' : 'Headquartered in Gandhipuram, Coimbatore'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {t.about.coimbatoreHubDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {AGENCY_CONFIG.servingAreas.map((area, idx) => (
            <div key={idx} className="bg-[#070B14] p-3 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Production CRM Pipeline Active */}
      <div className="gold-card rounded-2xl p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#F3DC87] uppercase tracking-wider">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ta' ? 'பாதுகாப்பான CRM கட்டமைப்பு' : 'Active Secure CRM Infrastructure'}</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">
          {language === 'ta' ? 'நிரந்தர தரவுத்தளம் மற்றும் அங்கீகரிக்கப்பட்ட CRM மேலாண்மை' : 'Persistent Database & Server-Enforced Lead Management'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {language === 'ta'
            ? 'RUBI TECH PARK இணையதளத்தில் பெறப்படும் அனைத்து விசாரணைகளும் எங்களின் பாதுகாப்பான CRM தரவுத்தளத்தில் நேரடியாகப் பதிவு செய்யப்படுகின்றன. அங்கீகரிக்கப்பட்ட நிர்வாகிகள் மட்டுமே இந்தத் தரவுகளை அணுக முடியும்.'
            : 'All enquiries submitted on the RUBI TECH PARK platform are validated on the server and persisted directly into our secure CRM database with strict server-side session authentication, role-based access control, rate limiting, and auditable logging.'}
        </p>
      </div>

      {/* CTA Strip */}
      <div className="text-center max-w-2xl mx-auto pt-6 space-y-4">
        <h2 className="text-2xl font-bold font-display text-white">
          {language === 'ta' ? 'நம்பகமான மென்பொருள் கூட்டாளருடன் பணியாற்ற தயாரா?' : 'Ready to Work with a Credible Engineering Partner?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {language === 'ta' ? 'உங்கள் திட்ட தேவைகளை எங்களுடன் கலந்தாலோசியுங்கள்.' : 'Reach out today to discuss your digital presence or operational software requirements.'}
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 text-xs sm:text-sm font-semibold text-[#070B14] bg-[#E5C158] hover:bg-[#F3DC87] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 shadow"
        >
          <span>{t.about.contactCta}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
