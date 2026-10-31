import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SERVICES_DATA, PRICING_PACKAGES, WORK_PROCESS_STEPS } from '../config/agencyConfig';
import { Hero3DDashboardShowcase, RubiJewelleryShowcase, CustomCRMDashboardShowcase } from '../components/VisualShowcase';
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
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Code2,
  Sparkles,
  Server
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'retail' | 'mfg' | 'b2b' | 'health'>('retail');

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Globe className="w-5 h-5 text-[#6654E8]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-[#4388FF]" />;
      case 'crm':
        return <Database className="w-5 h-5 text-[#35C9B0]" />;
      case 'integration':
        return <Layers className="w-5 h-5 text-[#6654E8]" />;
      case 'automation':
        return <Cpu className="w-5 h-5 text-[#4388FF]" />;
      default:
        return <Zap className="w-5 h-5 text-[#35C9B0]" />;
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
    <div className="space-y-24 sm:space-y-32 pb-24 ambient-mesh-light transition-colors">
      
      {/* 1. Hero Section with 3D Dashboard Showcase */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Trust Pill / Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F0FF] dark:bg-[#172038] border border-[#6654E8]/20 text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#35C9B0] animate-pulse-mint" />
              <span>{t.brand.name}</span>
              <span className="text-[#647087] dark:text-slate-400">·</span>
              <span>{t.home.heroBadge}</span>
            </div>

            {/* Confident Hero Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-[#172033] dark:text-white tracking-tight leading-[1.12] text-balance">
              {language === 'ta' ? (
                <>
                  உங்கள் வணிக வளர்ச்சிக்கான{' '}
                  <span className="brand-gradient-text">அதிநவீன டிஜிட்டல் தீர்வுகள்</span>
                </>
              ) : (
                <>
                  Modern Enterprise Software &{' '}
                  <span className="brand-gradient-text">AI Systems Built for Scale</span>
                </>
              )}
            </h1>

            {/* Supporting Hero Subtitle */}
            <p className="text-base sm:text-lg text-[#647087] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {t.home.heroSubtitle}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold brand-gradient-button transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>{t.home.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('pricing')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-[#172033] dark:text-white bg-white/90 dark:bg-[#121829] hover:bg-white dark:hover:bg-[#1A2238] border border-[#E5E9F2] dark:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{t.home.secondaryCta}</span>
              </button>
            </div>

            {/* Quantitative Trust Markers */}
            <div className="pt-8 border-t border-[#E5E9F2] dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 rounded-xl bg-white/60 dark:bg-[#121829]/60 border border-[#E5E9F2] dark:border-white/5">
                <div className="text-xl sm:text-2xl font-bold font-display text-[#6654E8] dark:text-[#9689FF] tabular-nums">
                  {t.home.quickStats.pricingStart}
                </div>
                <div className="text-xs text-[#647087] dark:text-slate-400 mt-0.5 font-medium">
                  {t.home.quickStats.pricingStartLabel}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/60 dark:bg-[#121829]/60 border border-[#E5E9F2] dark:border-white/5">
                <div className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white tabular-nums">
                  {t.home.quickStats.ownership}
                </div>
                <div className="text-xs text-[#647087] dark:text-slate-400 mt-0.5 font-medium">
                  {t.home.quickStats.ownershipLabel}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/60 dark:bg-[#121829]/60 border border-[#E5E9F2] dark:border-white/5">
                <div className="text-xl sm:text-2xl font-bold font-display text-[#4388FF] dark:text-[#60A5FA]">
                  {t.home.quickStats.deployment}
                </div>
                <div className="text-xs text-[#647087] dark:text-slate-400 mt-0.5 font-medium">
                  {t.home.quickStats.deploymentLabel}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/60 dark:bg-[#121829]/60 border border-[#E5E9F2] dark:border-white/5">
                <div className="text-xl sm:text-2xl font-bold font-display text-[#35C9B0]">
                  {t.home.quickStats.support}
                </div>
                <div className="text-xs text-[#647087] dark:text-slate-400 mt-0.5 font-medium">
                  {t.home.quickStats.supportLabel}
                </div>
              </div>
            </div>

          </div>

          {/* Interactive 3D Software Dashboard Illustration */}
          <div className="mt-12">
            <Hero3DDashboardShowcase />
          </div>
        </div>
      </section>

      {/* 2. Bento Grid: Capabilities & Technical Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'அதிநவீன மென்பொருள் கட்டமைப்பு' : 'Capabilities & Architecture'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#172033] dark:text-white">
              {t.home.servicesSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-[#647087] dark:text-slate-400">
              {t.home.servicesSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>{t.home.viewAllServices}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Layout with Varied Card Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Wide Featured Web Architecture (Spans 8 columns) */}
          <div className="lg:col-span-8 saas-card p-6 sm:p-8 saas-card-hover flex flex-col justify-between bg-gradient-to-br from-white via-[#FAFBFF] to-[#F3F0FF] dark:from-[#121829] dark:via-[#121829] dark:to-[#172038]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] dark:bg-[#6654E8]/20 flex items-center justify-center text-[#6654E8] border border-[#6654E8]/20">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#6654E8] bg-[#F3F0FF] dark:bg-[#6654E8]/20 px-3 py-1 rounded-full border border-[#6654E8]/20">
                  {t.services.items.businessWebsites.price}
                </span>
              </div>

              <h3 className="mt-5 text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
                {t.services.items.businessWebsites.title}
              </h3>
              <p className="mt-2 text-sm text-[#647087] dark:text-slate-300 leading-relaxed max-w-xl">
                {t.services.items.businessWebsites.tagline}
              </p>

              {/* Architecture Stack Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 8', 'Express Backend', 'Cloudflare CDN', 'Schema.org SEO'].map((badge) => (
                  <span
                    key={badge}
                    className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 text-[#172033] dark:text-slate-300 font-medium shadow-2xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-business-websites')}
                className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ta' ? 'அம்சங்களை விரிவாகப் பார்க்க' : 'Explore Architecture & Scope'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-[#647087] dark:text-slate-400">
                Turnaround: 7 - 14 Days
              </span>
            </div>
          </div>

          {/* Bento Card 2: Vertical CRM Highlight (Spans 4 columns) */}
          <div className="lg:col-span-4 saas-card p-6 sm:p-8 saas-card-hover flex flex-col justify-between bg-gradient-to-br from-white via-[#FAFBFF] to-[#E5FAF7] dark:from-[#121829] dark:via-[#121829] dark:to-[#0F2B2E]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] border border-[#35C9B0]/30">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#0F766E] dark:text-[#35C9B0] bg-[#E5FAF7] dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-[#35C9B0]/30">
                  {t.services.items.customCrm.price}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold font-display text-[#172033] dark:text-white">
                {t.services.items.customCrm.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
                {t.services.items.customCrm.tagline}
              </p>

              {/* Key CRM Highlights */}
              <div className="mt-5 space-y-2 text-xs text-[#172033] dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35C9B0] shrink-0 mt-0.5" />
                  <span>Zero per-user monthly SaaS subscription fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35C9B0] shrink-0 mt-0.5" />
                  <span>Role-based access control (Admin, Sales, Dispatch)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35C9B0] shrink-0 mt-0.5" />
                  <span>PostgreSQL / SQLite server-enforced security</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-custom-crm')}
                className="text-xs font-semibold text-[#35C9B0] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ta' ? 'CRM விபரங்கள்' : 'View CRM Architecture'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: E-Commerce Store with WhatsApp & UPI (Spans 4 columns) */}
          <div className="lg:col-span-4 saas-card p-6 saas-card-hover flex flex-col justify-between bg-gradient-to-br from-white to-[#EAF3FF] dark:from-[#121829] dark:to-[#162444]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] dark:bg-blue-950 flex items-center justify-center text-[#4388FF] border border-[#4388FF]/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#4388FF] bg-[#EAF3FF] dark:bg-blue-950 px-3 py-1 rounded-full border border-[#4388FF]/30">
                  {t.services.items.ecommerce.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#172033] dark:text-white">
                {t.services.items.ecommerce.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
                {t.services.items.ecommerce.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-ecommerce')}
                className="text-xs font-semibold text-[#4388FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'ஸ்டோர் விபரங்கள்' : 'Explore Store Features'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: AI & Automated Workflows (Spans 4 columns) */}
          <div className="lg:col-span-4 saas-card p-6 saas-card-hover flex flex-col justify-between bg-gradient-to-br from-white to-[#FFF0F5] dark:from-[#121829] dark:to-[#24142B]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] dark:bg-purple-950 flex items-center justify-center text-[#6654E8] border border-[#6654E8]/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#6654E8] bg-[#FFF0F5] dark:bg-purple-950 px-3 py-1 rounded-full border border-[#6654E8]/20">
                  {t.services.items.aiAutomation.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#172033] dark:text-white">
                {t.services.items.aiAutomation.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
                {t.services.items.aiAutomation.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-ai-automation')}
                className="text-xs font-semibold text-[#6654E8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'ஆட்டோமேஷன் விபரங்கள்' : 'Explore AI Pipelines'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 5: CRM Integration & Payments (Spans 4 columns) */}
          <div className="lg:col-span-4 saas-card p-6 saas-card-hover flex flex-col justify-between bg-gradient-to-br from-white to-[#F3F0FF] dark:from-[#121829] dark:to-[#172038]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F2] dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] dark:bg-indigo-950 flex items-center justify-center text-[#6654E8] border border-[#6654E8]/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#6654E8] bg-[#F3F0FF] dark:bg-indigo-950 px-3 py-1 rounded-full border border-[#6654E8]/20">
                  {t.services.items.crmIntegration.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#172033] dark:text-white">
                {t.services.items.crmIntegration.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed">
                {t.services.items.crmIntegration.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E9F2] dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-crm-integration')}
                className="text-xs font-semibold text-[#6654E8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'இணைப்பு முறைகள்' : 'View Integrations'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Selected Client Platforms Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'நிரூபிக்கப்பட்ட வெற்றிகள்' : 'Verified Work'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#172033] dark:text-white">
              {t.home.projectsSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-[#647087] dark:text-slate-400">
              {t.home.projectsSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs sm:text-sm font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.home.viewAllProjects}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Showcase 1: RUBI Gold & Silver */}
          <div className="flex flex-col justify-between">
            <RubiJewelleryShowcase />
            <div className="mt-4 px-2">
              <div className="text-xs text-[#647087] dark:text-slate-400">
                <span className="font-semibold text-[#172033] dark:text-slate-200">
                  {language === 'ta' ? 'துறை:' : 'Industry:'}
                </span>{' '}
                {language === 'ta' ? 'தங்க நகை & வெள்ளி ஆபரணங்கள்' : 'Fine Jewellery & Precious Metals'} ·{' '}
                <span className="font-semibold text-[#172033] dark:text-slate-200">
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
              <div className="text-xs text-[#647087] dark:text-slate-400">
                <span className="font-semibold text-[#172033] dark:text-slate-200">
                  {language === 'ta' ? 'துறை:' : 'Industry:'}
                </span>{' '}
                {language === 'ta' ? 'தொழில்துறை மொத்த விநியோகம்' : 'Wholesale & B2B Distribution'} ·{' '}
                <span className="font-semibold text-[#172033] dark:text-slate-200">
                  {language === 'ta' ? 'முடிவு:' : 'Key Outcome:'}
                </span>{' '}
                {language === 'ta' ? 'மாதாந்திர சந்தா இன்றி பல கிளை சரக்கு மற்றும் விற்பனை மேலாண்மை.' : 'Multi-stage sales pipeline with role-based permissions and zero per-seat software fees.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Structured Engineering Methodology */}
      <section className="py-16 bg-[#F3F0FF]/50 dark:bg-[#070B14] border-y border-[#E5E9F2] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'திட்டமிட்ட அணுகுமுறை' : 'Structured Methodology'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#172033] dark:text-white">
              {t.home.processSectionTitle}
            </h2>
            <p className="mt-3 text-sm text-[#647087] dark:text-slate-400">
              {t.home.processSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {WORK_PROCESS_STEPS.map((step) => {
              const stepNameTa = step.number === '01' ? 'கண்டறிதல்' : step.number === '02' ? 'திட்டமிடல்' : step.number === '03' ? 'உருவாக்கம்' : step.number === '04' ? 'சோதனை' : 'அறிமுகம்';
              return (
                <div
                  key={step.number}
                  className="bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-5 relative shadow-xs"
                >
                  <div className="text-2xl font-bold font-mono text-[#6654E8]/40 dark:text-[#9689FF]/40 mb-3">
                    {step.number}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6654E8] dark:text-[#9689FF] mb-1">
                    {language === 'ta' ? stepNameTa : step.name}
                  </div>
                  <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-2 leading-snug">
                    {step.heading}
                  </h3>
                  <p className="text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Transparent Starting-Price Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
              {t.home.pricingSectionTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#172033] dark:text-white">
              {language === 'ta' ? 'இந்திய வணிகங்களுக்கான தெளிவான தொடக்க முதலீடு' : 'Clear Starting Baselines for Indian Businesses'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-400 leading-relaxed">
              {t.pricing.disclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#FAFBFF] dark:bg-[#121829] rounded-2xl p-5 border border-[#E5E9F2] dark:border-white/5 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs font-semibold text-[#647087] dark:text-slate-400 mb-1">{pkg.name}</div>
                  <div className="text-2xl font-bold font-display text-[#6654E8] dark:text-[#9689FF] tabular-nums">
                    {pkg.startingPriceDisplay}
                  </div>
                  <p className="mt-2 text-xs text-[#647087] dark:text-slate-400 leading-relaxed">
                    {pkg.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E5E9F2] dark:border-white/10 space-y-1.5 text-xs text-[#172033] dark:text-slate-300">
                    {pkg.highlightedDeliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#35C9B0] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E9F2] dark:border-white/10 flex flex-col gap-2">
                  <button
                    onClick={() => onNavigate(pkg.slug)}
                    className="w-full py-2 text-xs font-semibold text-center text-[#6654E8] dark:text-[#9689FF] hover:bg-[#F3F0FF] dark:hover:bg-[#1A2238] rounded-xl transition-colors cursor-pointer border border-[#6654E8]/20"
                  >
                    {language === 'ta' ? 'விபரங்களைக் காண்க' : 'View Scope Details'}
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    className="w-full py-2 text-xs font-semibold text-center text-[#172033] dark:text-white bg-white dark:bg-[#0D1527] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-[#E5E9F2] dark:border-white/10 flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#35C9B0]" />
                    <span>{language === 'ta' ? 'மைல்கல் முன்பணம்' : 'Order Milestone'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#647087] dark:text-slate-400 gap-4 pt-4 border-t border-[#E5E9F2] dark:border-white/10">
            <div>
              {language === 'ta' ? 'விரிவான திட்ட மதிப்பீடு தேவையா? விலை கால்குலேட்டரைப் பயன்படுத்துங்கள்.' : 'Need an itemized quotation? Explore our interactive cost estimator.'}
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-xs font-semibold text-[#6654E8] dark:text-[#9689FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{language === 'ta' ? 'விலை கால்குலேட்டரைத் திறக்க' : 'Open Pricing & Cost Calculator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'விளக்கங்கள் & தெளிவு' : 'Clarity & Expectations'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#172033] dark:text-white">
            {t.home.faqSectionTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-400">
            {t.home.faqSectionSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={openFaq === idx}
              >
                <span className="text-sm font-semibold text-[#172033] dark:text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6654E8] shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#647087] dark:text-slate-300 leading-relaxed border-t border-[#E5E9F2] dark:border-white/10 pt-3">
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
          <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'நேரடி தொடர்பு' : 'Get In Touch'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#172033] dark:text-white">
            {t.home.finalCtaTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#647087] dark:text-slate-400">
            {t.home.finalCtaSubtitle}
          </p>
        </div>

        <LeadCaptureForm onNavigate={onNavigate} />
      </section>
    </div>
  );
};
