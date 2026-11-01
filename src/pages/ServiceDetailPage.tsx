import React from 'react';
import { PageRoute, ServiceDetail } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface ServiceDetailPageProps {
  service: ServiceDetail;
  onNavigate: (route: PageRoute) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onNavigate }) => {
  const { t, language } = useLanguage();

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
    <div className="relative min-h-screen bg-[#E9EEF3] dark:bg-[#101B2C] text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 relative z-10">
        {/* Back button & Breadcrumb */}
        <div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அனைத்து சேவைகளுக்கும் திரும்புக' : 'Back to All Services'}</span>
          </button>

          {/* Hero Banner */}
          <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#315D82] dark:text-[#6F9FC5]">
                <span>{language === 'ta' ? 'RUBI TECH PARK சேவை விவரம்' : 'Enterprise Service Specification'}</span>
                <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
                <span>{language === 'ta' ? 'தொடக்க விலை:' : 'Starting from'} {localized.price}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight leading-tight">
                {localized.title}
              </h1>

              <p className="text-base sm:text-lg text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {localized.tagline}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="px-6 py-3 bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs inline-block cursor-pointer"
                >
                  {language === 'ta' ? 'இச்சேவைக்கான விலை மதிப்பீடு பெறுக' : `Request Quotation for ${localized.title}`}
                </a>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-5 py-3 text-xs sm:text-sm font-medium text-[#182638] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#17263A] bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'விலை வழிகாட்டி' : 'View Pricing Guidance'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Who It Is For vs Problems It Solves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Who It Is For */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <h2 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.whoItIsFor}
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {(service.whoItIsFor || [
                'Growing SMEs and businesses seeking verified digital operations',
                'Enterprises looking to modernize customer workflows',
                'Industrial and retail establishments in India'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problems It Solves */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <h2 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.problemsSolved}
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {(service.problemsItSolves || [
                'Disorganized inquiry tracking across phone calls and chat apps',
                'Slow loading speeds resulting in lost commercial sales',
                'Manual billing and paperwork errors leading to reconciliation bottlenecks'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="rounded-2xl p-6 sm:p-10 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
            <Cpu className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5]" />
            <h2 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.services.deliverables}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            {(service.deliverables || [
              'Production deployment on secure Cloudflare CDN edge',
              'Tailwind CSS v4 responsive mobile-first architecture',
              'Direct WhatsApp deep-link trigger with prefilled SKUs',
              'Schema.org SEO and social card integration',
              'Full source code handover with 100% IP ownership',
              '30-day post-launch warranty and bugfix guarantee'
            ]).map((item, idx) => (
              <div key={idx} className="bg-[#F2F5F8] dark:bg-[#17263A] p-4 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[#182638] dark:text-[#F1F5F9] leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Development Process */}
        <div>
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-1">
              {t.services.process}
            </span>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {language === 'ta' ? `${localized.title} உருவாக்கப் படிநிலைகள்` : `Our Engineering Process for ${localized.title}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(service.processSteps || [
              { title: 'Discovery', description: 'Detailed requirement analysis, technical scope mapping, and quotation signoff.' },
              { title: 'Architecture', description: 'System design, UI/UX wireframing, and database schema definition.' },
              { title: 'Development', description: 'Clean sprint engineering with continuous testing and client review.' },
              { title: 'QA & Staging', description: 'Performance tuning, security verification, and customer demo approval.' },
              { title: 'Launch', description: 'Production deployment, domain linking, and handover of code assets.' }
            ]).map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] p-5 rounded-2xl shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all">
                <div className="text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] font-semibold mb-2">
                  {language === 'ta' ? `படிநிலை ${idx + 1}` : `Phase 0${idx + 1}`}
                </div>
                <h3 className="text-sm font-bold text-[#182638] dark:text-[#F1F5F9] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Quotation Factors */}
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block">
                {t.services.pricingGuidance}
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums">
                {localized.price}
              </div>
              <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {language === 'ta'
                  ? 'இந்த அடிப்படை விலை நிலையான திட்டங்களுக்கான உண்மையான தொடக்கமாகும். மறைமுக கட்டணங்களோ அல்லது திட்டமிடாத கூடுதல் தொகைகளோ இல்லை.'
                  : 'This baseline represents an authentic starting point for standard engagements. We do not use hidden fee structures or bait-and-switch tactics.'}
              </p>

              <div className="p-3.5 bg-[#F2F5F8] dark:bg-[#17263A] rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#182638] dark:text-[#F1F5F9] space-y-1">
                <div className="font-semibold text-[#182638] dark:text-white">
                  {language === 'ta' ? 'நிலையான கட்டண முறைமை:' : 'Standard Payment Terms:'}
                </div>
                <div>• {language === 'ta' ? 'திட்ட தொடக்கத்திற்கு 40% முன்தொகை' : '40% Kickoff advance upon scope signoff'}</div>
                <div>• {language === 'ta' ? 'ஸ்டேஜிங் ஒப்புதலின் போது 30% மைல்கல் தொகை' : '30% Milestone upon staging build approval'}</div>
                <div>• {language === 'ta' ? 'தயாரிப்பு வெளியீடு மற்றும் டொமைன் ஒப்படைப்பின் போது 30%' : '30% Final release upon live deployment and domain handover'}</div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#F2F5F8] dark:bg-[#17263A] p-6 rounded-2xl border border-[#D5DEE8] dark:border-[#30445B] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
                {t.services.quotationFactors}
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] mb-3">
                {language === 'ta'
                  ? 'பின்வரும் திட்ட தேவைகள் இறுதி விலையை மாற்றியமைக்கும்:'
                  : 'The following scope variables will adjust the final quotation upwards or downwards:'}
              </p>
              <ul className="space-y-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
                {(service.quotationFactors || [
                  'Total number of custom workflows and database entities',
                  'Third-party API consumption and automated messaging triggers',
                  'Custom reporting, analytics, and CSV data export modules',
                  'Legacy data migration requirements and multi-role access levels'
                ]).map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#315D82] dark:text-[#6F9FC5] font-bold">›</span>
                    <span className="leading-relaxed">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enquiry Form anchor */}
        <div id="enquiry-form" className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#00D4FF] uppercase tracking-wider block mb-1">
              {language === 'ta' ? 'திட்ட மதிப்பீடு' : 'Project Scoping'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              {language === 'ta' ? `${localized.title} - உங்கள் திட்டத்தைப் பற்றி பேசுங்கள்` : `Discuss Your ${localized.title} Project`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] mt-1">
              {language === 'ta'
                ? 'உங்கள் தேவைகளை எங்களுக்குத் தெரிவியுங்கள். தொழில்நுட்ப மதிப்பீடு மற்றும் தொடக்க விலை அறிக்கையை நாங்கள் வழங்குகிறோம்.'
                : 'Tell us about your requirements for a comprehensive technical review and starting estimate.'}
            </p>
          </div>

          <LeadCaptureForm
            initialService={
              service.id === 'business-websites'
                ? 'business-website'
                : service.id === 'ecommerce'
                ? 'ecommerce-store'
                : service.id === 'custom-crm'
                ? 'custom-crm'
                : service.id === 'crm-integration'
                ? 'website-crm-integration'
                : 'ai-workflow-automation'
            }
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
