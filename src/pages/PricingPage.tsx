import React, { useState } from 'react';
import { PageRoute, RequiredService } from '../types';
import { PRICING_PACKAGES } from '../config/agencyConfig';
import { calculateStartingEstimate, formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const [selectedService, setSelectedService] = useState<RequiredService>('business-website');
  const [scopeSize, setScopeSize] = useState<'standard' | 'expanded'>('standard');

  const estimate = calculateStartingEstimate(selectedService, {
    scopeSize
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <span>{t.header.pricing}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {t.pricing.title}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 sm:p-5 bg-[#0B132B] border border-[#D4AF37]/35 rounded-xl text-xs sm:text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#E5C158] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">
              {language === 'ta' ? 'வெளிப்படையான தொடக்க விலை அறிவிப்பு:' : 'Important Pricing & Scope Transparency Notice:'}
            </span>
            <p className="text-slate-400 leading-relaxed text-xs">
              {t.pricing.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pricing Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="gold-card rounded-2xl p-6 flex flex-col justify-between gold-card-hover border border-slate-800"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {pkg.name}
              </div>
              <div className="mt-2 text-3xl font-bold font-display text-white gold-gradient-text tabular-nums">
                {pkg.startingPriceDisplay}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {t.pricing.startingAt}
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed min-h-[48px]">
                {pkg.summary}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {language === 'ta' ? 'அடிப்படை அம்சங்கள்:' : 'Included in Baseline:'}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {pkg.highlightedDeliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-400 font-medium">
                  {language === 'ta' ? 'வழக்கமான காலம்:' : 'Typical Timeline:'}
                </span>{' '}
                {pkg.timelineGuideline}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-2.5 px-3 text-xs font-bold text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
              >
                <span>{language === 'ta' ? 'ஆன்லைனில் கட்டணம் செலுத்துங்கள்' : 'Pay Online / Book Plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate(pkg.slug)}
                className="w-full py-2 px-3 text-xs text-slate-300 hover:text-white bg-[#070B14] border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'சேவை எல்லைகளைக் காண்க' : 'View Service Scope'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Starting Estimate Calculator */}
      <div className="bg-gradient-to-b from-[#090F20] to-[#050811] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-10">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.pricing.calculatorTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            {language === 'ta' ? 'தொடக்கநிலை மதிப்பீட்டை கணக்கிடுங்கள்' : 'Calculate an Indicative Starting Baseline'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.pricing.calculatorSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. {t.pricing.basePackage}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { value: 'business-website', label: t.form.servicesList.businessWebsite },
                  { value: 'ecommerce-store', label: t.form.servicesList.ecommerceStore },
                  { value: 'custom-crm', label: t.form.servicesList.customCrm },
                  { value: 'website-crm-integration', label: t.form.servicesList.websiteCrmIntegration },
                  { value: 'ai-workflow-automation', label: t.form.servicesList.aiWorkflowAutomation },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedService(s.value as RequiredService)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedService === s.value
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3DC87] font-semibold'
                        : 'bg-[#070B14] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. {t.pricing.scopeAddons}
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setScopeSize('standard')}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    scopeSize === 'standard'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3DC87] font-semibold'
                      : 'bg-[#070B14] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{language === 'ta' ? 'அடிப்படை கட்டமைப்பு' : 'Standard Foundation'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{language === 'ta' ? 'முக்கிய பக்கங்கள் & நிலையான அமைப்பு' : 'Core pages & standard integration'}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setScopeSize('expanded')}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    scopeSize === 'expanded'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3DC87] font-semibold'
                      : 'bg-[#070B14] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{language === 'ta' ? 'விரிவாக்கப்பட்ட அமைப்பு' : 'Expanded Enterprise'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{language === 'ta' ? 'கூடுதல் பக்கங்கள் & ஆட்டோமேஷன்' : 'Custom modules, high SKUs & workflows'}</div>
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-[#070B14] border border-[#D4AF37]/40 rounded-xl p-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E5C158]">
              {t.pricing.estimatedStartingInvestment}
            </span>

            <div className="text-3xl sm:text-4xl font-bold font-display text-white gold-gradient-text tabular-nums">
              {formatINR(estimate.estimatedStartingPrice)}+
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="font-semibold text-slate-300 block">
                {language === 'ta' ? 'திட்ட கூறுகள்:' : 'Scope Breakdown:'}
              </span>
              <ul className="space-y-1.5 text-slate-400">
                {estimate.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800/80 leading-normal">
              {estimate.disclaimer}
            </p>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-3 bg-[#E5C158] hover:bg-[#F3DC87] text-[#070B14] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <span>{t.pricing.getFormalProposal}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
