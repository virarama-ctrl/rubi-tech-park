import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SERVICES_DATA, PRICING_PACKAGES, WORK_PROCESS_STEPS } from '../config/agencyConfig';
import { HeroFuturisticVisual } from '../components/HeroFuturisticVisual';
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
  Server,
  Terminal,
  Activity,
  Workflow,
  ExternalLink,
  Calculator
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
        return <Globe className="w-5 h-5 text-[#00D4FF]" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-[#356BFF]" />;
      case 'crm':
        return <Database className="w-5 h-5 text-[#00E5A3]" />;
      case 'integration':
        return <Layers className="w-5 h-5 text-[#8057FF]" />;
      case 'automation':
        return <Cpu className="w-5 h-5 text-[#00D4FF]" />;
      default:
        return <Zap className="w-5 h-5 text-[#00D4FF]" />;
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
    <div className="space-y-20 sm:space-y-28 pb-20 futuristic-mesh-bg text-[#182638] dark:text-[#F1F5F9] transition-colors relative overflow-hidden">
      
      {/* 1. Hero Section with Corporate Architecture Visualization */}
      <section className="relative pt-10 sm:pt-16 pb-10 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Engineering Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
                <span className="font-semibold">RUBI TECH PARK</span>
                <span className="text-[#8A9CAE]">/</span>
                <span className="text-[#526477] dark:text-[#B8C5D4]">{language === 'ta' ? 'நவீன மென்பொருள் & கிளவுட் கட்டமைப்பு' : 'ENTERPRISE SOFTWARE & CLOUD ARCHITECTURE'}</span>
              </div>

              {/* Authoritative Hero Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight leading-[1.18] text-balance">
                {language === 'ta' ? (
                  <>
                    நவீன நிறுவன மென்பொருட்கள் &{' '}
                    <span className="text-[#315D82] dark:text-[#6F9FC5]">சர்வதேச கிளவுட் அமைப்புகள்</span>
                  </>
                ) : (
                  <>
                    Architecting Enterprise Software &{' '}
                    <span className="text-[#315D82] dark:text-[#6F9FC5]">Scalable Digital Infrastructure</span>
                  </>
                )}
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-[#526477] dark:text-[#B8C5D4] leading-relaxed max-w-2xl font-normal">
                {t.home.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-semibold cyber-button-primary flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t.home.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('pricing')}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-semibold cyber-button-secondary flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.home.secondaryCta}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                </button>
              </div>

              {/* Quantitative Trust Markers (Fixed for Tamil Natural Wrap & Mobile Responsiveness) */}
              <div className="pt-8 border-t border-[#D5DEE8] dark:border-[#30445B] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* Stat 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between min-h-[96px] h-auto">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums leading-tight">
                    {t.home.quickStats.pricingStart}
                  </div>
                  <div className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-2 font-normal leading-relaxed break-words">
                    {t.home.quickStats.pricingStartLabel}
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between min-h-[96px] h-auto">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#182638] dark:text-[#F1F5F9] tabular-nums leading-tight">
                    {t.home.quickStats.ownership}
                  </div>
                  <div className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-2 font-normal leading-relaxed break-words">
                    {t.home.quickStats.ownershipLabel}
                  </div>
                </div>

                {/* Stat 3 (Tamil City Value) */}
                <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between min-h-[96px] h-auto">
                  <div className="text-xl sm:text-2xl font-bold font-sans text-[#315D82] dark:text-[#6F9FC5] leading-tight break-words">
                    {t.home.quickStats.deployment}
                  </div>
                  <div className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-2 font-normal leading-relaxed break-words">
                    {t.home.quickStats.deploymentLabel}
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs flex flex-col justify-between min-h-[96px] h-auto">
                  <div className="text-xl sm:text-2xl font-bold font-sans text-[#182638] dark:text-[#F1F5F9] leading-tight break-words">
                    {t.home.quickStats.support}
                  </div>
                  <div className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-2 font-normal leading-relaxed break-words">
                    {t.home.quickStats.supportLabel}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Desktop Visual: Architecture Topology */}
            <div className="lg:col-span-5 w-full">
              <HeroFuturisticVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Three Core Pillars of RUBI TECH PARK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
            <span>Integrated Technology Platform</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            Three Core Divisions. Complete Digital Excellence.
          </h2>
          <p className="mt-2 text-sm text-[#526477] dark:text-[#B8C5D4]">
            From high-throughput software engineering to statutory regulatory compliance and citizen digital e-services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Software */}
          <div className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all group shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B] inline-block">
                12 Software Services
              </span>
              <h3 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                Software & Digital Engineering
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                Modern responsive websites, custom CRM platforms, billing software, mobile apps, and workflow automation. Transparent work-based quotations with zero vendor lock-in.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Software Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 2: Compliance */}
          <div className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all group shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B] inline-block">
                15 Statutory Services
              </span>
              <h3 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                Statutory & Compliance Services
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                GST registration, ITR filing, MSME/Udyam, FSSAI food licensing, trademark protection, and trade licences. Verified documentation support with full regulatory disclosures.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Compliance Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 3: E-Services */}
          <div className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all group shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B] inline-block">
                ₹236 Initial Booking Deposit
              </span>
              <h3 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                Citizen Digital E-Services
              </h3>
              <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                Online guidance for PAN cards, Voter ID, Passport, Ration Cards, and EB service connections. Clear ₹200 + 18% GST ₹36 booking fee with full transparency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book E-Service (₹236)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid: Capabilities & Technical Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'அதிநவீன மென்பொருள் கட்டமைப்பு' : 'Capabilities & Architecture'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.home.servicesSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {t.home.servicesSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>{t.home.viewAllServices}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Layout with Corporate Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Wide Featured Web Architecture (Spans 8 columns) */}
          <div className="lg:col-span-8 rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-3 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  {t.services.items.businessWebsites.price}
                </span>
              </div>

              <h3 className="mt-5 text-xl sm:text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.items.businessWebsites.title}
              </h3>
              <p className="mt-2 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed max-w-xl">
                {t.services.items.businessWebsites.tagline}
              </p>

              {/* Architecture Stack Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 8', 'Express Backend', 'Cloudflare CDN', 'Schema.org SEO'].map((badge) => (
                  <span
                    key={badge}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] font-mono shadow-xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-business-websites')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ta' ? 'அம்சங்களை விரிவாகப் பார்க்க' : 'Explore Architecture & Scope'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4]">
                Turnaround: 7 - 14 Days
              </span>
            </div>
          </div>

          {/* Bento Card 2: Custom CRM Software (Spans 4 columns) */}
          <div className="lg:col-span-4 rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-3 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  {t.services.items.customCrm.price}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.items.customCrm.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {t.services.items.customCrm.tagline}
              </p>

              {/* Key CRM Highlights */}
              <div className="mt-5 space-y-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                  <span>Zero per-user monthly SaaS subscription fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                  <span>Role-based access control (Admin, Sales, Dispatch)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                  <span>PostgreSQL / Cloud SQL server-enforced security</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-custom-crm')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ta' ? 'CRM விபரங்கள்' : 'View CRM Architecture'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: E-Commerce Store with WhatsApp & UPI (Spans 4 columns) */}
          <div className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-3 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  {t.services.items.ecommerce.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.items.ecommerce.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {t.services.items.ecommerce.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-ecommerce')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'ஸ்டோர் விபரங்கள்' : 'Explore Store Features'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: AI & Automated Workflows (Spans 4 columns) */}
          <div className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-3 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  {t.services.items.aiAutomation.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.items.aiAutomation.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {t.services.items.aiAutomation.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-ai-automation')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'ஆட்டோமேஷன் விபரங்கள்' : 'Explore AI Pipelines'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 5: CRM Integration & Payments (Spans 4 columns) */}
          <div className="lg:col-span-4 rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] border border-[#D5DEE8] dark:border-[#30445B]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-3 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  {t.services.items.crmIntegration.price}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.services.items.crmIntegration.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {t.services.items.crmIntegration.tagline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-crm-integration')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ta' ? 'இணைப்பு முறைகள்' : 'View Integrations'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Selected Client Platforms Showcase — Tamil Gold Buyer First */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <span>{language === 'ta' ? 'நிரூபிக்கப்பட்ட திட்டங்கள்' : 'Featured Production Platforms'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.home.projectsSectionTitle}
            </h2>
            <p className="mt-2 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {t.home.projectsSectionSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs sm:text-sm font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.home.viewAllProjects}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Showcase 1: Tamil Gold Buyer (Primary Featured) */}
          <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] font-bold text-sm tracking-wider">
                    <Calculator className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-wide text-[#182638] dark:text-[#F1F5F9]">
                      Tamil Gold Buyer
                    </div>
                    <div className="text-xs text-[#526477] dark:text-[#B8C5D4]">
                      Gold & Silver Valuation Platform
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B]">
                  Published Website
                </div>
              </div>

              {/* Live Valuation Mockup Preview */}
              <div className="mt-4 p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-lg border border-[#D5DEE8] dark:border-[#30445B]">
                    <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">24K Pure Gold</span>
                    <span className="font-mono font-bold text-[#182638] dark:text-[#F1F5F9] text-xs sm:text-sm">₹8,150/g</span>
                  </div>
                  <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-lg border border-[#D5DEE8] dark:border-[#30445B]">
                    <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">22K 916 Hallmark</span>
                    <span className="font-mono font-bold text-[#182638] dark:text-[#F1F5F9] text-xs sm:text-sm">₹7,470/g</span>
                  </div>
                  <div className="bg-white dark:bg-[#1C2B40] p-2 rounded-lg border border-[#D5DEE8] dark:border-[#30445B]">
                    <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4] block">Fine Silver 999</span>
                    <span className="font-mono font-bold text-[#315D82] dark:text-[#6F9FC5] text-xs sm:text-sm">₹105/g</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#526477] dark:text-[#B8C5D4]">Valuation Engine Calculator · Multi-item Purity</span>
                  <span className="font-mono text-[#315D82] dark:text-[#6F9FC5] font-semibold">Active Engine</span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                A specialised digital platform for gold and silver buyers, featuring valuation tools, real-time precious metal rate calculators, and online product catalog.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4]">
                Stack: React · TypeScript · Valuation Engine
              </span>
              <a
                href="https://goldandsilverbuyer.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl cyber-button-primary text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>View Live Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Showcase 2: Commercial Operations CRM */}
          <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] font-bold text-sm tracking-wider">
                    <Database className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-wide text-[#182638] dark:text-[#F1F5F9]">
                      Commercial Operations CRM
                    </div>
                    <div className="text-xs text-[#526477] dark:text-[#B8C5D4]">
                      Lead Pipeline & Dispatch Stream
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-1 rounded-full border border-[#D5DEE8] dark:border-[#30445B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
                  <span>Pipeline Active</span>
                </div>
              </div>

              {/* Pipeline Columns Preview */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[#F2F5F8] dark:bg-[#17263A] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                  <div className="flex items-center justify-between text-[#526477] dark:text-[#B8C5D4] mb-1.5">
                    <span className="text-[11px] font-semibold text-[#182638] dark:text-[#F1F5F9]">New Leads</span>
                    <span className="font-mono text-[#315D82] dark:text-[#6F9FC5] text-[10px] font-bold">4</span>
                  </div>
                  <div className="text-[10px] text-[#526477] dark:text-[#B8C5D4] bg-white dark:bg-[#1C2B40] p-1.5 rounded border border-[#D5DEE8] dark:border-[#30445B]">
                    Website Lead Form
                  </div>
                </div>

                <div className="bg-[#F2F5F8] dark:bg-[#17263A] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                  <div className="flex items-center justify-between text-[#526477] dark:text-[#B8C5D4] mb-1.5">
                    <span className="text-[11px] font-semibold text-[#182638] dark:text-[#F1F5F9]">Contacted</span>
                    <span className="font-mono text-[#315D82] dark:text-[#6F9FC5] text-[10px] font-bold">6</span>
                  </div>
                  <div className="text-[10px] text-[#526477] dark:text-[#B8C5D4] bg-white dark:bg-[#1C2B40] p-1.5 rounded border border-[#D5DEE8] dark:border-[#30445B]">
                    Discovery call done
                  </div>
                </div>

                <div className="bg-[#F2F5F8] dark:bg-[#17263A] p-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                  <div className="flex items-center justify-between text-[#526477] dark:text-[#B8C5D4] mb-1.5">
                    <span className="text-[11px] font-semibold text-[#182638] dark:text-[#F1F5F9]">Proposal</span>
                    <span className="font-mono text-[#315D82] dark:text-[#6F9FC5] text-[10px] font-bold">3</span>
                  </div>
                  <div className="text-[10px] text-[#526477] dark:text-[#B8C5D4] bg-white dark:bg-[#1C2B40] p-1.5 rounded border border-[#D5DEE8] dark:border-[#30445B]">
                    Custom ERP scope
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                Multi-stage customer relationship management architecture with automated lead capture, WhatsApp routing, role-based access control, and zero per-seat fees.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4]">
                Stack: TypeScript · PostgreSQL · Express
              </span>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Structured Engineering Methodology */}
      <section className="py-16 bg-[#F2F5F8] dark:bg-[#17263A] border-y border-[#D5DEE8] dark:border-[#30445B] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2">
              {language === 'ta' ? 'திட்டமிட்ட அணுகுமுறை' : 'Structured Engineering Methodology'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {t.home.processSectionTitle}
            </h2>
            <p className="mt-3 text-sm text-[#526477] dark:text-[#B8C5D4]">
              {t.home.processSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {WORK_PROCESS_STEPS.map((step) => {
              const stepNameTa = step.number === '01' ? 'கண்டறிதல்' : step.number === '02' ? 'திட்டமிடல்' : step.number === '03' ? 'உருவாக்கம்' : step.number === '04' ? 'சோதனை' : 'அறிமுகம்';
              return (
                <div
                  key={step.number}
                  className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-5 relative shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all"
                >
                  <div className="text-2xl font-bold font-mono text-[#315D82]/70 dark:text-[#6F9FC5]/70 mb-3">
                    {step.number}
                  </div>
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5] mb-1">
                    {language === 'ta' ? stepNameTa : step.name}
                  </div>
                  <h3 className="text-sm font-bold text-[#182638] dark:text-[#F1F5F9] mb-2 leading-snug">
                    {step.heading}
                  </h3>
                  <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Transparent Starting-Price Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2">
              {t.home.pricingSectionTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {language === 'ta' ? 'இந்திய வணிகங்களுக்கான தெளிவான தொடக்க முதலீடு' : 'Clear Starting Baselines for Indian Businesses'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {t.pricing.disclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#F2F5F8] dark:bg-[#17263A] rounded-2xl p-5 border border-[#D5DEE8] dark:border-[#30445B] flex flex-col justify-between hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all shadow-xs"
              >
                <div>
                  <div className="text-xs font-semibold text-[#526477] dark:text-[#B8C5D4] mb-1">{pkg.name}</div>
                  <div className="text-2xl font-bold font-mono text-[#315D82] dark:text-[#6F9FC5] tabular-nums">
                    {pkg.startingPriceDisplay}
                  </div>
                  <p className="mt-2 text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                    {pkg.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-1.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
                    {pkg.highlightedDeliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-col gap-2">
                  <button
                    onClick={() => onNavigate(pkg.slug)}
                    className="w-full py-2 text-xs font-semibold text-center text-[#315D82] dark:text-[#6F9FC5] hover:bg-white dark:hover:bg-[#1C2B40] rounded-xl transition-colors cursor-pointer border border-[#D5DEE8] dark:border-[#30445B]"
                  >
                    {language === 'ta' ? 'விபரங்களைக் காண்க' : 'View Scope Details'}
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    className="w-full py-2 text-xs font-semibold text-center text-[#182638] dark:text-[#F1F5F9] bg-white hover:bg-[#F2F5F8] dark:bg-[#1C2B40] dark:hover:bg-[#17263A] rounded-xl transition-colors cursor-pointer border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>{language === 'ta' ? 'மைல்கல் முன்பணம்' : 'Order Milestone'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#526477] dark:text-[#B8C5D4] gap-4 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
            <div>
              {language === 'ta' ? 'விரிவான திட்ட மதிப்பீடு தேவையா? விலை கால்குலேட்டரைப் பயன்படுத்துங்கள்.' : 'Need an itemized quotation? Explore our interactive cost estimator.'}
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{language === 'ta' ? 'விலை கால்குலேட்டரைத் திறக்க' : 'Open Pricing & Cost Calculator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'விளக்கங்கள் & தெளிவு' : 'Clarity & Engineering Governance'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {t.home.faqSectionTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4]">
            {t.home.faqSectionSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={openFaq === idx}
              >
                <span className="text-sm font-semibold text-[#182638] dark:text-[#F1F5F9]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed border-t border-[#D5DEE8] dark:border-[#30445B] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Final Enquiry CTA with Form Embed */}
      <section id="enquiry-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'நேரடி தொடர்பு' : 'Initiate Project Discovery'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {t.home.finalCtaTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4]">
            {t.home.finalCtaSubtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-3xl p-6 sm:p-10 shadow-xs">
          <LeadCaptureForm onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  );
};
