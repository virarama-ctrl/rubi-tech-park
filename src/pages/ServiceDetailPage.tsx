import React from 'react';
import { PageRoute, ServiceDetail } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  CheckCircle2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Back button & Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('services')}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'அனைத்து சேவைகளுக்கும் திரும்புக' : 'Back to All Services'}</span>
        </button>

        {/* Hero Banner */}
        <div className="bg-gradient-to-b from-[#0B132B] to-[#070B14] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F3DC87]">
              <span>{language === 'ta' ? 'RUBI TECH PARK சேவை விவரம்' : 'Enterprise Service Specification'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'ta' ? 'தொடக்க விலை:' : 'Starting from'} {localized.price}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-tight">
              {localized.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {localized.tagline}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#enquiry-form"
                className="px-6 py-3 bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] text-[#070B14] font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-md"
              >
                {language === 'ta' ? 'இச்சேவைக்கான விலை மதிப்பீடு பெறுக' : `Request Quotation for ${localized.title}`}
              </a>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-5 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-[#070B14] border border-slate-700 hover:border-slate-500 rounded-lg transition-colors cursor-pointer"
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
        <div className="gold-card rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h2 className="text-lg font-bold font-display text-white">
              {t.services.whoItIsFor}
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {(service.whoItIsFor || [
              'Growing SMEs and businesses seeking verified digital operations',
              'Enterprises looking to modernize customer workflows',
              'Industrial and retail establishments in India'
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Problems It Solves */}
        <div className="gold-card rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <h2 className="text-lg font-bold font-display text-white">
              {t.services.problemsSolved}
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {(service.problemsItSolves || [
              'Manual paperwork bottlenecks and unorganized follow-ups',
              'Lack of mobile responsiveness and sluggish web experience',
              'Lost customer leads due to missing WhatsApp automation'
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="gold-card rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block">
              {language === 'ta' ? 'திட்ட பணிகள்' : 'Scope of Work'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
              {t.services.deliverables}
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            {t.brand.ownershipGuarantee}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          {(service.deliverables || [
            'Requirement architecture and wireframe specification',
            'Full mobile-responsive engineering and optimization',
            'Database schema and backend API integration',
            'Security audit and penetration testing verification',
            'Deployment to high-performance cloud infrastructure',
            'Complete source code ownership and technical handover'
          ]).map((item, idx) => (
            <div key={idx} className="bg-[#070B14] p-4 rounded-lg border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Development Process */}
      <div>
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-1">
            {t.services.process}
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-white">
            {language === 'ta' ? `${localized.title} உருவாக்கப் படிநிலைகள்` : `Our Development Process for ${localized.title}`}
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
            <div key={idx} className="bg-[#090F20] border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-mono text-[#D4AF37] font-semibold mb-2">
                {language === 'ta' ? `படிநிலை ${idx + 1}` : `Phase ${idx + 1}`}
              </div>
              <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Quotation Factors */}
      <div className="bg-[#050811] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block">
              {t.services.pricingGuidance}
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white gold-gradient-text tabular-nums">
              {localized.price}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ta'
                ? 'இந்த அடிப்படை விலை நிலையான திட்டங்களுக்கான உண்மையான தொடக்கமாகும். மறைமுக கட்டணங்களோ அல்லது திட்டமிடாத கூடுதல் தொகைகளோ இல்லை.'
                : 'This baseline represents an authentic starting point for standard engagements. We do not use hidden fee structures or bait-and-switch tactics.'}
            </p>

            <div className="p-3.5 bg-[#0A1020] rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">
                {language === 'ta' ? 'நிலையான கட்டண முறைமை:' : 'Standard Payment Terms:'}
              </div>
              <div>• {language === 'ta' ? 'திட்ட தொடக்கத்திற்கு 40% முன்தொகை' : '40% Kickoff advance upon scope signoff'}</div>
              <div>• {language === 'ta' ? 'ஸ்டேஜிங் ஒப்புதலின் போது 30% மைல்கல் தொகை' : '30% Milestone upon staging build approval'}</div>
              <div>• {language === 'ta' ? 'தயாரிப்பு வெளியீடு மற்றும் டொமைன் ஒப்படைப்பின் போது 30%' : '30% Final release upon live deployment and domain handover'}</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#070B14] p-6 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#F3DC87]">
              {t.services.quotationFactors}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'ta'
                ? 'பின்வரும் திட்ட தேவைகள் இறுதி விலையை மாற்றியமைக்கும்:'
                : 'The following scope variables will adjust the final quotation upwards or downwards:'}
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              {(service.quotationFactors || [
                'Total number of custom workflows and database entities',
                'Third-party API consumption and automated messaging triggers',
                'Custom reporting, analytics, and CSV data export modules',
                'Legacy data migration requirements and multi-role access levels'
              ]).map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#D4AF37] font-bold">›</span>
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
          <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-1">
            {language === 'ta' ? 'திட்ட மதிப்பீடு' : 'Project Scoping'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {language === 'ta' ? `${localized.title} - உங்கள் திட்டத்தைப் பற்றி பேசுங்கள்` : `Discuss Your ${localized.title} Project`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
  );
};
