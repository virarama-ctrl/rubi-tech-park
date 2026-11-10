import React, { useState, useEffect } from 'react';
import { PageRoute, ServiceDetail } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedService } from '../utils/serviceLocalization';
import { SERVICES_UI_STRINGS } from '../i18n/serviceTranslations';
import { ServiceReferenceImage } from '../config/serviceImages';
import {
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight,
  Phone,
  FileCheck,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

interface ServiceDetailPageProps {
  service: ServiceDetail;
  onNavigate: (route: PageRoute) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onNavigate }) => {
  const { t, language } = useLanguage();
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    fetch('/api/services/images')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.images) {
          setCustomImages(data.images);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const localizedService = getLocalizedService(service, language);
  const ui = SERVICES_UI_STRINGS[language] || SERVICES_UI_STRINGS.en;

  const isEService = localizedService.isEService || localizedService.category === 'eservices';

  const displayPrice = isEService
    ? (language === 'ta' ? '₹236 முன்பதிவு (₹200 + 18% ஜிஎஸ்டி)' : '₹236 Initial Booking (₹200 + 18% GST)')
    : localizedService.isWorkBasedPricing
    ? (language === 'ta' ? 'திட்டம் சார்ந்த வெளிப்படையான விலை' : 'Work-Based Transparent Quote')
    : (language === 'ta' ? '₹5,000+' : '₹5,000+');

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

          {/* Hero Banner with Large Reference Image */}
          <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Details & Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#315D82] dark:text-[#6F9FC5]">
                  <span>{language === 'ta' ? 'ரூபி டெக் பார்க் சேவை விவரம்' : 'Enterprise Service Specification'}</span>
                  <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
                  <span>{language === 'ta' ? 'கட்டணம் / விலை:' : 'Pricing:'} {displayPrice}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight leading-tight">
                  {localizedService.title}
                </h1>

                <p className="text-base sm:text-lg text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                  {localizedService.shortDescription}
                </p>

                {localizedService.detailedScope && (
                  <div className="p-3.5 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs leading-relaxed">
                    <strong className="text-[#182638] dark:text-[#F1F5F9]">{ui.scopeLabel}: </strong>
                    <span className="text-[#526477] dark:text-[#B8C5D4]">{localizedService.detailedScope}</span>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#enquiry-form"
                    className="px-6 py-3 bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs inline-block cursor-pointer"
                  >
                    {isEService
                      ? (language === 'ta' ? 'இ-சேவை முன்பதிவு செய்க (₹236)' : 'Book E-Service (₹236)')
                      : (language === 'ta' ? 'இச்சேவைக்கான விலை மதிப்பீடு பெறுக' : `Request Quotation for ${localizedService.title}`)}
                  </a>
                  <a
                    href="tel:+918220550829"
                    className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#182638] dark:text-[#F1F5F9] hover:text-[#315D82] dark:hover:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>{ui.callNow}</span>
                  </a>
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-5 py-3 text-xs sm:text-sm font-medium text-[#182638] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#17263A] bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'விலை வழிகாட்டி' : 'View Pricing Guidance'}
                  </button>
                </div>
              </div>

              {/* Right Column: Prominent Reference Image */}
              <div className="lg:col-span-5 w-full">
                <div className="shadow-lg rounded-2xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B]">
                  <ServiceReferenceImage
                    serviceId={localizedService.id}
                    serviceTitle={localizedService.title}
                    customImages={customImages}
                    aspectRatioClass="aspect-16/10 sm:aspect-16/9 lg:aspect-4/3"
                    showCaption={true}
                    priority={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents & Eligibility (Especially critical for Compliance & E-services) */}
        {((localizedService.requiredDocuments && localizedService.requiredDocuments.length > 0) || localizedService.eligibility) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {localizedService.requiredDocuments && localizedService.requiredDocuments.length > 0 && (
              <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
                  <FileCheck className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5]" />
                  <h2 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                    {ui.requiredDocuments}
                  </h2>
                </div>
                <ul className="space-y-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
                  {localizedService.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {localizedService.eligibility && (
              <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
                    <ShieldCheck className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5]" />
                    <h2 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                      {ui.eligibility}
                    </h2>
                  </div>
                  <p className="text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                    {localizedService.eligibility}
                  </p>
                </div>

                {localizedService.complianceNotice && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
                    {localizedService.complianceNotice}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2-Column: Who It Is For vs Problems It Solves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Who It Is For */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <h2 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {language === 'ta' ? 'யாருக்கான சேவை' : 'Who This Is For'}
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {(localizedService.whoItIsFor || [
                language === 'ta'
                  ? 'வளர்ந்து வரும் குறு, சிறு மற்றும் நடுத்தர வணிகங்கள்'
                  : 'Growing SMEs and businesses seeking verified digital operations',
                language === 'ta'
                  ? 'வாடிக்கையாளர் செயல்முறைகளை நவீனப்படுத்த விரும்பும் நிறுவனங்கள்'
                  : 'Enterprises looking to modernize customer workflows',
                language === 'ta'
                  ? 'இந்தியாவில் உள்ள தொழில் மற்றும் சில்லறை வணிக நிறுவனங்கள்'
                  : 'Industrial and retail establishments in India'
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
                {language === 'ta' ? 'தீர்க்கப்படும் வணிக சவால்கள்' : 'Problems It Solves'}
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {(localizedService.problemsItSolves || [
                language === 'ta'
                  ? 'முறையான தொழில்நுட்பக் கட்டமைப்பு இல்லாததால் ஏற்படும் காலதாமதம்'
                  : 'Disorganized inquiry tracking across phone calls and chat apps',
                language === 'ta'
                  ? 'கைமுறை ஆவணப் பணிகளால் ஏற்படும் பிழைகள் மற்றும் வேலைச்சுமை'
                  : 'Slow loading speeds resulting in lost commercial sales',
                language === 'ta'
                  ? 'சட்டப்பூர்வ வழிகாட்டுதல் இல்லாததால் ஏற்படும் அரசு அபராத அபாயங்கள்'
                  : 'Manual billing and paperwork errors leading to reconciliation bottlenecks'
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
              {language === 'ta' ? 'வழங்கப்படும் முக்கிய நன்மைகள் & தீர்வுகள்' : 'Deliverables & Key Outputs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            {(localizedService.deliverables || [
              language === 'ta'
                ? 'பாதுகாப்பான கிளவுட் சர்வரில் அதிகாரப்பூர்வ நிலைநிறுத்தம்'
                : 'Production deployment on secure Cloudflare CDN edge',
              language === 'ta'
                ? 'மொபைல் மற்றும் கணினிக்கு ஏற்ற நவீன வடிவமைப்பு'
                : 'Tailwind CSS v4 responsive mobile-first architecture',
              language === 'ta'
                ? 'நேரடி வாட்ஸ்அப் இணைப்பு மற்றும் எளிதான தொடர்பு பொத்தான்கள்'
                : 'Direct WhatsApp deep-link trigger with prefilled SKUs',
              language === 'ta'
                ? 'கூகிள் தேடல் உகப்பாக்கம் (SEO) மற்றும் சமூக வலைத்தள கார்டுகள்'
                : 'Schema.org SEO and social card integration',
              language === 'ta'
                ? 'முழு மூல குறியீடு மற்றும் 100% அறிவுசார் சொத்துரிமை ஒப்படைப்பு'
                : 'Full source code handover with 100% IP ownership',
              language === 'ta'
                ? 'வெளியீட்டிற்குப் பிந்தைய ஆதரவு மற்றும் வழிகாட்டுதல்'
                : '30-day post-launch warranty and bugfix guarantee'
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
              {ui.process}
            </span>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {language === 'ta' ? `${localizedService.title} - சேவை படிநிலைகள்` : `Execution Process for ${localizedService.title}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(localizedService.processSteps || [
              {
                title: language === 'ta' ? 'தேவை ஆய்வு' : 'Discovery',
                description: language === 'ta'
                  ? 'விரிவான தேவைகள் ஆய்வு, தொழில்நுட்ப வரம்பு மற்றும் விலை மதிப்பீடு ஒப்புதல்.'
                  : 'Detailed requirement analysis, technical scope mapping, and quotation signoff.'
              },
              {
                title: language === 'ta' ? 'கட்டமைப்பு' : 'Architecture',
                description: language === 'ta'
                  ? 'கணினி வடிவமைப்பு, இடைமுக வரைபடம் மற்றும் தரவுத்தள திட்டம்.'
                  : 'System design, UI/UX wireframing, and database schema definition.'
              },
              {
                title: language === 'ta' ? 'உருவாக்கம்' : 'Development',
                description: language === 'ta'
                  ? 'தொடர் சோதனை மற்றும் வாடிக்கையாளர் மதிப்புரையுடன் நேர்த்தியான மென்பொருள் உருவாக்கம்.'
                  : 'Clean sprint engineering with continuous testing and client review.'
              },
              {
                title: language === 'ta' ? 'தர சோதனை' : 'QA & Staging',
                description: language === 'ta'
                  ? 'வேகத் திறன் சோதனை, பாதுகாப்பு சரிபார்ப்பு மற்றும் செயல்முறை மாதிரி ஒப்புதல்.'
                  : 'Performance tuning, security verification, and customer demo approval.'
              },
              {
                title: language === 'ta' ? 'வெளியீடு' : 'Launch',
                description: language === 'ta'
                  ? 'நேரடி தயாரிப்பு பயன்பாட்டிற்கு கொண்டுவருதல் மற்றும் முழுமையான ஒப்படைப்பு.'
                  : 'Production deployment, domain linking, and handover of code assets.'
              }
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

        {/* Pricing & Terms */}
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block">
                {ui.pricingGuidance}
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums">
                {displayPrice}
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
                {ui.quotationFactors}
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] mb-3">
                {language === 'ta'
                  ? 'பின்வரும் திட்ட தேவைகள் இறுதி விலையை மாற்றியமைக்கும்:'
                  : 'The following scope variables will adjust the final quotation upwards or downwards:'}
              </p>
              <ul className="space-y-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
                {(service.quotationFactors || [
                  language === 'ta'
                    ? 'தனிப்பயன் பணிப்பாய்வுகள் மற்றும் தரவுத்தள அட்டவணைகளின் எண்ணிக்கை'
                    : 'Total number of custom workflows and database entities',
                  language === 'ta'
                    ? 'மூன்றாம் தரப்பு API இணைப்புகள் மற்றும் தானியங்கி செய்தி அறிவிப்புகள்'
                    : 'Third-party API consumption and automated messaging triggers',
                  language === 'ta'
                    ? 'தனிப்பயன் அறிக்கைகள் மற்றும் தரவு ஏற்றுமதி தொகுதிகள்'
                    : 'Custom reporting, analytics, and CSV data export modules',
                  language === 'ta'
                    ? 'பழைய தரவு பரிமாற்றம் மற்றும் பல பயனர் அனுமதி நிலைகள்'
                    : 'Legacy data migration requirements and multi-role access levels'
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
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-1">
              {language === 'ta' ? 'திட்ட மதிப்பீடு' : 'Project Scoping'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {language === 'ta' ? `${localizedService.title} - உங்கள் திட்டத்தைப் பற்றி பேசுங்கள்` : `Discuss Your ${localizedService.title} Project`}
            </h2>
            <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] mt-1">
              {language === 'ta'
                ? 'உங்கள் தேவைகளை எங்களுக்குத் தெரிவியுங்கள். தொழில்நுட்ப மதிப்பீடு மற்றும் தொடக்க விலை அறிக்கையை நாங்கள் வழங்குகிறோம்.'
                : 'Tell us about your requirements for a comprehensive technical review and starting estimate.'}
            </p>
          </div>

          <LeadCaptureForm
            initialCategory={
              isEService
                ? 'eservice'
                : localizedService.category === 'compliance'
                ? 'compliance'
                : 'software'
            }
            initialService={localizedService.title}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
