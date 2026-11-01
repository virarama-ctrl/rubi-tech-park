import React, { useState } from 'react';
import { PageRoute, RequiredService } from '../types';
import { PRICING_PACKAGES } from '../config/agencyConfig';
import { calculateStartingEstimate, formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator,
  CreditCard,
  Sparkles,
  Terminal,
  ShieldCheck
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
    <div className="relative futuristic-mesh-bg min-h-screen text-slate-900 dark:text-white transition-colors">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/30 text-xs font-mono text-[#0284C7] dark:text-[#00D4FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
            <span>{t.header.pricing}</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-[#8292AA]">·</span>
            <span>{t.brand.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            {t.pricing.title}
          </h1>
          <p className="text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Mandatory Disclaimer Box */}
        <div className="p-5 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] shadow-md dark:shadow-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#0284C7] dark:text-[#00D4FF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === 'ta' ? 'வெளிப்படையான தொடக்க விலை அறிவிப்பு:' : 'Important Pricing & Scope Transparency Notice:'}
              </span>
              <p className="text-slate-600 dark:text-[#CBD5E1] leading-relaxed text-xs">
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
              className="saas-card p-6 flex flex-col justify-between saas-card-hover bg-white dark:bg-[#0B1530]/85 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 shadow-md dark:shadow-xl"
            >
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1]">
                  {pkg.name}
                </div>
                <div className="mt-2 text-3xl font-bold font-mono text-[#0284C7] dark:text-[#00D4FF] tabular-nums">
                  {pkg.startingPriceDisplay}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#8292AA] font-mono mt-0.5">
                  {t.pricing.startingAt}
                </div>

                <p className="mt-4 text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed min-h-[48px]">
                  {pkg.summary}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#00D4FF]/15 space-y-2">
                  <span className="text-[11px] font-mono font-semibold text-slate-900 dark:text-white uppercase tracking-wider block">
                    {language === 'ta' ? 'அடிப்படை அம்சங்கள்:' : 'Included in Baseline:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#CBD5E1]">
                    {pkg.highlightedDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5A3] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#00D4FF]/15 text-[11px] text-slate-500 dark:text-[#8292AA]">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {language === 'ta' ? 'வழக்கமான காலம்:' : 'Typical Timeline:'}
                  </span>{' '}
                  {pkg.timelineGuideline}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#00D4FF]/15 space-y-2">
                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-2.5 px-3 text-xs font-semibold cyber-button-primary rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'ஆன்லைனில் கட்டணம் செலுத்துங்கள்' : 'Pay Online / Book Plan'}</span>
                </button>
                <button
                  onClick={() => onNavigate(pkg.slug)}
                  className="w-full py-2 px-3 text-xs text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#070B18] border border-slate-200 dark:border-[#00D4FF]/20 hover:border-slate-300 dark:hover:border-[#00D4FF]/50 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'சேவை எல்லைகளைக் காண்க' : 'View Service Scope'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Starting Estimate Calculator */}
        <div className="bg-white dark:bg-[#0B1530]/85 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/25 rounded-3xl p-6 sm:p-10 shadow-lg dark:shadow-2xl">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#0284C7] dark:text-[#00D4FF] uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF]" />
              <span>{t.pricing.calculatorTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              {language === 'ta' ? 'தொடக்கநிலை மதிப்பீட்டை கணக்கிடுங்கள்' : 'Calculate an Indicative Starting Baseline'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] mt-1">
              {t.pricing.calculatorSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  Select Architectural Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'business-website', label: 'Business Website', price: '₹5,000+' },
                    { id: 'ecommerce-store', label: 'E-Commerce Store', price: '₹15,000+' },
                    { id: 'custom-crm', label: 'Custom CRM System', price: '₹20,000+' },
                    { id: 'ai-workflow-automation', label: 'AI & Workflow Engine', price: '₹12,000+' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedService(s.id as RequiredService)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService === s.id
                          ? 'border-[#0284C7] dark:border-[#00D4FF] bg-blue-50/70 dark:bg-[#00D4FF]/10 text-slate-900 dark:text-white shadow-xs'
                          : 'border-slate-200 dark:border-[#00D4FF]/15 bg-slate-50 dark:bg-[#070B18]/70 text-slate-700 dark:text-[#CBD5E1] hover:border-blue-300 dark:hover:border-[#00D4FF]/40'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">{s.label}</div>
                      <div className="text-[11px] font-mono text-[#0284C7] dark:text-[#00D4FF] mt-0.5">{s.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  Scope Complexity Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScopeSize('standard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeSize === 'standard'
                        ? 'border-[#0284C7] dark:border-[#00D4FF] bg-blue-50/70 dark:bg-[#00D4FF]/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-[#00D4FF]/15 bg-slate-50 dark:bg-[#070B18]/70 text-slate-700 dark:text-[#CBD5E1]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">Standard Baseline</div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8292AA] mt-0.5">Core production features</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopeSize('expanded')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeSize === 'expanded'
                        ? 'border-[#0284C7] dark:border-[#00D4FF] bg-blue-50/70 dark:bg-[#00D4FF]/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-[#00D4FF]/15 bg-slate-50 dark:bg-[#070B18]/70 text-slate-700 dark:text-[#CBD5E1]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">Expanded Scale</div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8292AA] mt-0.5">Multi-tier custom logic</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Estimate Readout Card */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#070B18]/90 border border-slate-200 dark:border-[#00D4FF]/25 rounded-2xl p-6 shadow-md dark:shadow-xl space-y-4">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8292AA] uppercase tracking-wider block">
                Indicative Project Baseline
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0284C7] dark:text-[#00D4FF] tabular-nums">
                {formatINR(estimate.estimatedStartingPrice)}
              </div>
              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                Estimate includes architecture design, staging deployment, source code transfer, and 30-day post-launch warranty.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 px-4 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Request Written Scope Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
