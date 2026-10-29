import React from 'react';
import { PageRoute } from '../types';
import { SERVICES_DATA } from '../config/agencyConfig';
import { useLanguage } from '../context/LanguageContext';
import {
  Globe,
  ShoppingBag,
  Database,
  Layers,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface ServicesOverviewPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ServicesOverviewPage: React.FC<ServicesOverviewPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Globe className="w-6 h-6 text-[#D4AF37]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />;
      case 'crm':
        return <Database className="w-6 h-6 text-[#D4AF37]" />;
      case 'integration':
        return <Layers className="w-6 h-6 text-[#D4AF37]" />;
      case 'automation':
        return <Cpu className="w-6 h-6 text-[#D4AF37]" />;
      default:
        return <Zap className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <span>{t.header.services}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {t.services.overviewTitle}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {t.services.overviewSubtitle}
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        {SERVICES_DATA.map((service) => {
          const serviceKey = service.id === 'business-websites'
            ? 'businessWebsites'
            : service.id === 'ecommerce'
            ? 'ecommerce'
            : service.id === 'custom-crm'
            ? 'customCrm'
            : service.id === 'crm-integration'
            ? 'crmIntegration'
            : 'aiAutomation';

          const localized = t.services.items[serviceKey as keyof typeof t.services.items];

          return (
            <div
              key={service.id}
              className="gold-card rounded-2xl p-6 sm:p-10 border border-slate-800 hover:border-[#D4AF37]/40 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Title, Category, Summary, CTA */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-center">
                      {getServiceIcon(service.category)}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#F3DC87] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
                        {language === 'ta' ? 'தொடக்க விலை:' : 'Starting'} {localized.price}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                        {localized.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {localized.tagline}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => onNavigate(service.slug)}
                      className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#070B14] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>{language === 'ta' ? 'முழு விபரம் காண்க' : 'Dedicated Specification Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#070B14] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors cursor-pointer"
                    >
                      {language === 'ta' ? 'விலை விபரம் கேட்க' : 'Enquire Directly'}
                    </button>
                  </div>
                </div>

                {/* Middle Column: Who It Is For & Problems Solved */}
                <div className="lg:col-span-4 space-y-4 text-xs">
                  <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800">
                    <h3 className="font-semibold text-slate-200 mb-2 uppercase tracking-wider text-[11px] text-[#F3DC87]">
                      {t.services.whoItIsFor}
                    </h3>
                    <ul className="space-y-1.5 text-slate-300">
                      {service.whoItIsFor.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#D4AF37] mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800">
                    <h3 className="font-semibold text-slate-200 mb-2 uppercase tracking-wider text-[11px] text-red-300">
                      {t.services.problemsSolved}
                    </h3>
                    <ul className="space-y-1.5 text-slate-300">
                      {service.problemsItSolves.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Key Deliverables */}
                <div className="lg:col-span-3 bg-[#090F20] p-4 rounded-xl border border-slate-800/80 text-xs">
                  <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3 text-[#D4AF37]">
                    {t.services.deliverables}
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Starting Price Transparency Strip */}
      <div className="bg-[#070B14] border border-[#D4AF37]/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {language === 'ta' ? 'வெளிப்படையான தொடக்க விலை கொள்கை' : 'Transparent Starting Quotation Policy'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.pricing.disclaimer}
          </p>
        </div>
        <button
          onClick={() => onNavigate('pricing')}
          className="px-5 py-2.5 text-xs font-semibold text-[#070B14] bg-[#E5C158] hover:bg-[#F3DC87] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          {language === 'ta' ? 'முழு விலை விவரம்' : 'View Full Pricing Details'}
        </button>
      </div>
    </div>
  );
};
