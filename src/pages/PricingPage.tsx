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
  Sparkles
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
    <div className="relative min-h-screen text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{t.header.pricing}</span>
            <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
            <span>{t.brand.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
            {t.pricing.title}
          </h1>
          <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Mandatory Disclaimer Box */}
        <div className="p-5 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl text-xs sm:text-sm text-[#182638] dark:text-[#F1F5F9] shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                {language === 'ta' ? 'வெளிப்படையான தொடக்க விலை அறிவிப்பு:' : 'Important Pricing & Scope Transparency Notice:'}
              </span>
              <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed text-xs">
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
              className="p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all"
            >
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#526477] dark:text-[#B8C5D4]">
                  {pkg.name}
                </div>
                <div className="mt-2 text-3xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums">
                  {pkg.startingPriceDisplay}
                </div>
                <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] font-mono mt-0.5">
                  {t.pricing.startingAt}
                </div>

                <p className="mt-4 text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed min-h-[48px]">
                  {pkg.summary}
                </p>

                <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-2">
                  <span className="text-[11px] font-mono font-semibold text-[#182638] dark:text-[#F1F5F9] uppercase tracking-wider block">
                    {language === 'ta' ? 'அடிப்படை அம்சங்கள்:' : 'Included in Baseline:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
                    {pkg.highlightedDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D5DEE8] dark:border-[#30445B] text-[11px] text-[#526477] dark:text-[#B8C5D4]">
                  <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                    {language === 'ta' ? 'வழக்கமான காலம்:' : 'Typical Timeline:'}
                  </span>{' '}
                  {pkg.timelineGuideline}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-2">
                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-2.5 px-3 text-xs font-semibold cyber-button-primary rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'ஆன்லைனில் கட்டணம் செலுத்துங்கள்' : 'Pay Online / Book Plan'}</span>
                </button>
                <button
                  onClick={() => onNavigate(pkg.slug)}
                  className="w-full py-2 px-3 text-xs text-[#182638] dark:text-[#F1F5F9] hover:bg-[#F2F5F8] dark:hover:bg-[#17263A] bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'சேவை எல்லைகளைக் காண்க' : 'View Service Scope'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Starting Estimate Calculator */}
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>{t.pricing.calculatorTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] mt-1">
              {language === 'ta' ? 'தொடக்கநிலை மதிப்பீட்டை கணக்கிடுங்கள்' : 'Calculate an Indicative Starting Baseline'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] mt-1">
              {t.pricing.calculatorSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-2">
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
                          ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] shadow-xs'
                          : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#182638] dark:text-[#F1F5F9]">{s.label}</div>
                      <div className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] mt-0.5">{s.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-2">
                  Scope Complexity Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScopeSize('standard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeSize === 'standard'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9]'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#182638] dark:text-[#F1F5F9]">Standard Baseline</div>
                    <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-0.5">Core production features</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopeSize('expanded')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeSize === 'expanded'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9]'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#182638] dark:text-[#F1F5F9]">Expanded Scale</div>
                    <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-0.5">Multi-tier custom logic</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Estimate Readout Card */}
            <div className="lg:col-span-5 bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 shadow-xs space-y-4">
              <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4] uppercase tracking-wider block">
                Indicative Project Baseline
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums">
                {formatINR(estimate.estimatedStartingPrice)}
              </div>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                Estimate includes architecture design, staging deployment, source code transfer, and 30-day post-launch warranty.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 px-4 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
