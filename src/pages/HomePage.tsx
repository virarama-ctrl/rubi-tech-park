import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SERVICES_DATA, PRICING_PACKAGES, WORK_PROCESS_STEPS } from '../config/agencyConfig';
import { RubiJewelleryShowcase, CustomCRMDashboardShowcase } from '../components/VisualShowcase';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Globe,
  ShoppingBag,
  Database,
  Cpu,
  Zap,
  MapPin,
  MessageSquare
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Globe className="w-5 h-5 text-[#D4AF37]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />;
      case 'crm':
        return <Database className="w-5 h-5 text-[#D4AF37]" />;
      case 'integration':
        return <Layers className="w-5 h-5 text-[#D4AF37]" />;
      case 'automation':
        return <Cpu className="w-5 h-5 text-[#D4AF37]" />;
      default:
        return <Zap className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const faqsList = [
    {
      q: language === 'ta'
        ? 'வலைத்தளத்தில் காட்டப்பட்டுள்ள விலைகள் இறுதியானவையா அல்லது தொடக்கநிலை மதிப்பீடுகளா?'
        : 'Are the prices listed on your website fixed or starting estimates?',
      a: language === 'ta'
        ? 'எங்கள் தளத்தில் குறிப்பிடப்பட்டுள்ள அனைத்து விலைகளும் (வலைத்தளம் ₹5,000+, இ-காமர்ஸ் ₹15,000+, தனிப்பயன் CRM ₹20,000+) நேர்மையான தொடக்கநிலை உத்தேச விலைகளாகும். திட்டத்தின் பக்கங்களின் எண்ணிக்கை, API தேவைகள் மற்றும் தனிப்பயன் அம்சங்களுக்கேற்ப விரிவான மதிப்பீடு வழங்கப்படும்.'
        : 'All prices shown (such as ₹5,000+ for a business website or ₹20,000+ for a custom CRM) are honest starting price indicators. The final investment depends strictly on your project scope, total number of pages or product SKUs, specific third-party API requirements, content readiness, and custom software logic.'
    },
    {
      q: language === 'ta'
        ? 'மென்பொருள் சோர்ஸ் கோட், டொமைன் மற்றும் ஹோஸ்டிங் யாருக்குச் சொந்தமாகும்?'
        : 'Do I own the source code, domain, and hosting?',
      a: language === 'ta'
        ? 'முழுமையாக 100% உங்களுக்கே சொந்தம். RUBI TECH PARK-ல் வெண்டார் லாக்-இன் கிடையாது. திட்டம் நிறைவடைந்தவுடன் அனைத்து மூலக் குறியீடுகள், டொமைன் நற்சான்றிதழ்கள் மற்றும் தரவுத்தள உரிமைகள் உங்களிடம் ஒப்படைக்கப்படும்.'
        : 'Yes, 100%. At RUBI TECH PARK, we do not believe in vendor lock-in. You retain full legal ownership of your code, domain credentials, and database assets upon project handover.'
    },
    {
      q: language === 'ta'
        ? 'வாட்ஸ்அப் எவ்வாறு எங்கள் வலைத்தளம் அல்லது CRM உடன் இணைக்கப்படுகிறது?'
        : 'How do you integrate WhatsApp into our website or CRM?',
      a: language === 'ta'
        ? 'நாங்கள் இரு முறைகளில் வாட்ஸ்அப்பை இணைக்கிறோம்: ஒன்று கூடுதல் கட்டணமின்றி நேரடி வாடிக்கையாளர் எண் வழியே தொடர்பு கொள்ளும் டைரக்ட் டீப்-லிங்க், மற்றொன்று தானியங்கி ஆர்டர் மற்றும் அறிவிப்புகளுக்கான அதிகாரப்பூர்வ வாட்ஸ்அப் பிசினஸ் API.'
        : 'We provide two tiers: direct WhatsApp deep-links that open WhatsApp with a prefilled inquiry message on your customer\'s phone or desktop with zero recurring API costs; and official WhatsApp Business API integrations for automated transactional messaging and multi-agent dispatch.'
    },
    {
      q: language === 'ta'
        ? 'தமிழ்நாடு மற்றும் பிற இந்திய மாநிலங்களில் உள்ள நிறுவனங்களுடன் நீங்கள் பணியாற்றுகிறீர்களா?'
        : 'Can you work with clients across different states in India?',
      a: language === 'ta'
        ? 'ஆம். கோயம்புத்தூர், சென்னை, பெங்களூரு, மும்பை, ஹைதராபாத் மற்றும் தமிழ்நாடு உட்பட இந்தியா முழுவதும் உள்ள நிறுவனங்களுக்கு நாங்கள் வெற்றிகரமாக மென்பொருட்களை வழங்கி வருகிறோம். வீடியோ அழைப்புகள் மற்றும் ஆன்லைன் டெமோக்கள் மூலம் எளிதாகப் பணியாற்றலாம்.'
        : 'Yes. We serve businesses across Coimbatore, Chennai, Bangalore, Mumbai, Hyderabad, and industrial hubs across India. Our discovery, planning, milestone demos, and handovers are conducted seamlessly via video calls and structured staging environments.'
    },
    {
      q: language === 'ta'
        ? 'புதிய திட்டங்களுக்கான கட்டண நடைமுறை என்ன?'
        : 'What is your payment structure for new projects?',
      a: language === 'ta'
        ? 'வெளிப்படையான மைல்கல் அடிப்படையிலான கட்டணம்: திட்ட தொடக்கத்திற்கு 40%, ஸ்டேஜிங் ஒப்புதலின் போது 30%, மற்றும் இறுதியாக தயாரிப்பு வெளியீடு மற்றும் டொமைன் ஒப்படைப்பின் போது 30%.'
        : 'Standard projects follow transparent milestone-based payments: typically 40% project kickoff advance, 30% upon approval of the staging build, and 30% final balance upon production launch and complete domain handover.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Subtle radial dark gold glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Trust Kicker with Location Badge */}
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-[#F3DC87] font-semibold">{t.brand.name}</span>
              <span aria-hidden="true">·</span>
              <span>{t.home.heroBadge}</span>
            </div>

            {/* Hero Headline (Exact requirement) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.15] text-balance">
              {t.home.heroHeadline}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {t.home.heroSubtitle}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-semibold text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] transition-all flex items-center justify-center gap-2 shadow-xl gold-border-focus cursor-pointer"
              >
                <span>{t.home.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('portfolio')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-semibold text-slate-200 hover:text-white bg-[#0B132B] hover:bg-[#101935] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.home.secondaryCta}</span>
              </button>
            </div>

            {/* Quantitative Trust Markers */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
                  {t.home.quickStats.pricingStart}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.home.quickStats.pricingStartLabel}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
                  {t.home.quickStats.ownership}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.home.quickStats.ownershipLabel}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.home.quickStats.deployment}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.home.quickStats.deploymentLabel}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t.home.quickStats.support}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{t.home.quickStats.supportLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'எங்கள் சேவைகள்' : 'Our Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              {t.home.servicesSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {t.home.servicesSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-semibold text-[#F3DC87] hover:text-white transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>{t.home.viewAllServices}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="gold-card rounded-xl p-6 flex flex-col justify-between gold-card-hover group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-[#070B14] border border-slate-800 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors">
                      {getServiceIcon(service.category)}
                    </div>
                    <span className="text-xs font-mono text-[#F3DC87] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
                      {localized.price}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold font-display text-white group-hover:text-[#F3DC87] transition-colors">
                    {localized.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {localized.tagline}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(service.slug)}
                    className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'முழு விபரங்களைப் பார்க்க' : 'Explore Deliverables & Scope'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Our Proven Process Section */}
      <section className="bg-[#050811] py-16 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'திட்டமிட்ட அணுகுமுறை' : 'Structured Methodology'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              {t.home.processSectionTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {t.home.processSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {WORK_PROCESS_STEPS.map((step) => {
              const stepNameTa = step.number === '01' ? 'கண்டறிதல்' : step.number === '02' ? 'திட்டமிடல்' : step.number === '03' ? 'உருவாக்கம்' : step.number === '04' ? 'சோதனை' : 'அறிமுகம்';
              return (
                <div
                  key={step.number}
                  className="bg-[#090F20] border border-slate-800/80 rounded-xl p-5 relative"
                >
                  <div className="text-2xl font-bold font-mono text-[#D4AF37]/50 mb-3">
                    {step.number}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#F3DC87] mb-1">
                    {language === 'ta' ? stepNameTa : step.name}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {step.heading}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Selected Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'நிரூபிக்கப்பட்ட வெற்றிகள்' : 'Verified Work'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              {t.home.projectsSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {t.home.projectsSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs sm:text-sm font-semibold text-[#F3DC87] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.home.viewAllProjects}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Showcase 1: RUBI Gold & Silver */}
          <div className="flex flex-col justify-between">
            <RubiJewelleryShowcase />
            <div className="mt-4 px-2">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {language === 'ta' ? 'துறை:' : 'Industry:'}
                </span>{' '}
                {language === 'ta' ? 'தங்க நகை & வெள்ளி ஆபரணங்கள்' : 'Fine Jewellery & Precious Metals'} ·{' '}
                <span className="font-semibold text-slate-200">
                  {language === 'ta' ? 'முடிவு:' : 'Key Outcome:'}
                </span>{' '}
                {language === 'ta' ? 'நேரடி வாட்ஸ்அப் ஆர்டர் அட்டவணை மூலம் உடனடி விற்பனை வினவல்கள்.' : 'Direct SKU-linked WhatsApp inquiry catalog eliminating showroom congestion.'}
              </div>
            </div>
          </div>

          {/* Showcase 2: Custom CRM Software */}
          <div className="flex flex-col justify-between">
            <CustomCRMDashboardShowcase />
            <div className="mt-4 px-2">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {language === 'ta' ? 'துறை:' : 'Industry:'}
                </span>{' '}
                {language === 'ta' ? 'தொழில்துறை மொத்த விநியோகம்' : 'Wholesale & B2B Distribution'} ·{' '}
                <span className="font-semibold text-slate-200">
                  {language === 'ta' ? 'முடிவு:' : 'Key Outcome:'}
                </span>{' '}
                {language === 'ta' ? 'மாதாந்திர சந்தா இன்றி பல கிளை சரக்கு மற்றும் விற்பனை மேலாண்மை.' : 'Multi-stage sales pipeline with role-based permissions and zero per-seat software fees.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Transparent Starting-Price Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#0B132B] to-[#070B14] border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
              {t.home.pricingSectionTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {language === 'ta' ? 'இந்திய வணிகங்களுக்கான தெளிவான தொடக்க முதலீடு' : 'Clear Starting Baselines for Indian Businesses'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.pricing.disclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#070B14] rounded-xl p-5 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">{pkg.name}</div>
                  <div className="text-2xl font-bold font-display text-white gold-gradient-text tabular-nums">
                    {pkg.startingPriceDisplay}
                  </div>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {pkg.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    {pkg.highlightedDeliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onNavigate(pkg.slug)}
                    className="w-full py-2 text-xs font-semibold text-center text-[#F3DC87] hover:text-white bg-[#0E1A38] hover:bg-[#162347] rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'விபரங்களைக் காண்க' : 'View Scope Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 pt-4 border-t border-slate-800/60">
            <div>
              {language === 'ta' ? 'விரிவான திட்ட மதிப்பீடு தேவையா? விலை கால்குலேட்டரைப் பயன்படுத்துங்கள்.' : 'Need an itemized quotation? Explore our interactive cost estimator.'}
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-xs font-semibold text-[#F3DC87] hover:text-white underline cursor-pointer"
            >
              {language === 'ta' ? 'விலை கால்குலேட்டரைத் திறக்க →' : 'Open Pricing & Cost Calculator →'}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'விளக்கங்கள் & தெளிவு' : 'Clarity & Expectations'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {t.home.faqSectionTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {t.home.faqSectionSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0B132B] border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={openFaq === idx}
              >
                <span className="text-sm font-semibold text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final Enquiry CTA with Form Embed */}
      <section id="enquiry-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#E5C158] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'நேரடி தொடர்பு' : 'Get In Touch'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            {t.home.finalCtaTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {t.home.finalCtaSubtitle}
          </p>
        </div>

        <LeadCaptureForm onNavigate={onNavigate} />
      </section>
    </div>
  );
};
