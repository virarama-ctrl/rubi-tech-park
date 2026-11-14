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
  Repeat
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectPlanForCheckout?: (planId: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onSelectPlanForCheckout
}) => {
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
              className="interactive-card p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all"
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
                  onClick={() =>
                    onSelectPlanForCheckout ? onSelectPlanForCheckout(pkg.id) : onNavigate('checkout')
                  }
                  className="w-full py-2.5 px-3 text-xs font-semibold cyber-button-primary rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5]"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'ஆன்லைனில் கட்டணம் செலுத்துங்கள்' : 'Pay Online / Book Plan'}</span>
                </button>
                <button
                  onClick={() => onNavigate(pkg.slug)}
                  className="w-full py-2 px-3 text-xs text-[#182638] dark:text-[#F1F5F9] hover:bg-[#F2F5F8] dark:hover:bg-[#17263A] bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5]"
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

        {/* Software Subscriptions & E-Service Booking Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase">
                <Repeat className="w-4 h-4" />
                <span>{language === 'ta' ? 'SaaS மென்பொருள் சந்தாக்கள்' : 'SaaS Software Subscriptions'}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {language === 'ta'
                  ? 'மாதாந்திர & வருடாந்திர சந்தா திட்டங்கள்'
                  : 'Monthly & Yearly Software Plans'}
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {language === 'ta'
                  ? 'Kuralvaani Voice Studio (₹499/மாதம்), BulkMate (₹999/மாதம்) மற்றும் RUBI CRM Cloud (₹1,499/மாதம்) ஆகியவற்றிற்கு வெளிப்படையான AutoPay சந்தாக்கள்.'
                  : 'Subscribe to Kuralvaani Voice Studio Pro (from ₹499/mo), BulkMate (from ₹999/mo), or RUBI CRM Cloud (from ₹1,499/mo) + 18% GST with anytime self-serve cancellation.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('subscriptions')}
              className="px-4 py-2.5 rounded-xl cyber-button-primary text-xs font-semibold inline-flex items-center justify-center gap-2 self-start cursor-pointer"
            >
              <span>{language === 'ta' ? 'சந்தா திட்டங்களைப் பார்க்க' : 'View Subscription Plans'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase">
                <CreditCard className="w-4 h-4" />
                <span>{language === 'ta' ? 'குடிமக்கள் இ-சேவைகள் முன்பதிவு' : 'Citizen E-Services Deposit'}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {language === 'ta'
                  ? 'இ-சேவை ஆரம்ப முன்பதிவு: ₹236 (₹200 + 18% GST)'
                  : 'E-Service Initial Booking: ₹236 (₹200 + 18% GST)'}
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {language === 'ta'
                  ? '₹236 செலுத்தி உங்கள் இ-சேவையை முன்பதிவு செய்யுங்கள். மீதமுள்ள சேவைக் கட்டணங்கள் தேவைகளை மதிப்பாய்வு செய்த பின் தெரிவிக்கப்பட்டு பணி நிறைவடைந்த பின் வசூலிக்கப்படும். அரசுக் கட்டணங்கள் தனித்தனியாகத் தெரிவிக்கப்படும்.'
                  : 'Book your e-service by paying ₹236 (₹200 + 18% GST). Remaining service charges are communicated after requirement review and collected after completion. Applicable government fees are informed separately.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onSelectPlanForCheckout ? onSelectPlanForCheckout('eservice-booking') : onNavigate('checkout')
              }
              className="px-4 py-2.5 rounded-xl border border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] hover:bg-[#315D82]/10 text-xs font-semibold inline-flex items-center justify-center gap-2 self-start cursor-pointer"
            >
              <span>{language === 'ta' ? '₹236 முன்பதிவு செய்க' : 'Book E-Service (₹236)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
