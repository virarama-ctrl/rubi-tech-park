import React, { useState } from 'react';
import { PageRoute, ServiceDetail } from '../types';
import {
  SOFTWARE_SERVICES,
  COMPLIANCE_SERVICES,
  E_SERVICES,
  SERVICES_DATA,
  AGENCY_CONFIG
} from '../config/agencyConfig';
import { useLanguage } from '../context/LanguageContext';
import {
  Code2,
  Shield,
  FileText,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';

interface ServicesOverviewPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectServiceForQuote?: (serviceTitle: string, category: string) => void;
}

type CategoryFilter = 'all' | 'software' | 'compliance' | 'eservices';

export const ServicesOverviewPage: React.FC<ServicesOverviewPageProps> = ({
  onNavigate,
  onSelectServiceForQuote
}) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES_DATA
      : activeCategory === 'software'
      ? SOFTWARE_SERVICES
      : activeCategory === 'compliance'
      ? COMPLIANCE_SERVICES
      : E_SERVICES;

  const handleEnquire = (service: ServiceDetail) => {
    if (onSelectServiceForQuote) {
      onSelectServiceForQuote(service.title, service.category);
    }
    onNavigate('contact');
  };

  return (
    <div className="relative min-h-screen bg-[#E9EEF3] dark:bg-[#101B2C] text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>Services & Solutions</span>
            <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
            <span>{AGENCY_CONFIG.brandName}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
            Comprehensive Technology & Compliance Services
          </h1>
          <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            Explore our complete catalog of 38 specialized services across Software Engineering, Statutory & Regulatory Compliance, and Citizen Digital E-Services.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D5DEE8] dark:border-[#30445B] pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white border border-[#D5DEE8] dark:border-[#30445B]'
            }`}
          >
            All Services ({SERVICES_DATA.length})
          </button>

          <button
            onClick={() => setActiveCategory('software')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'software'
                ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white border border-[#D5DEE8] dark:border-[#30445B]'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
            Software & Digital ({SOFTWARE_SERVICES.length})
          </button>

          <button
            onClick={() => setActiveCategory('compliance')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'compliance'
                ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white border border-[#D5DEE8] dark:border-[#30445B]'
            }`}
          >
            <Shield className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
            Statutory & Compliance ({COMPLIANCE_SERVICES.length})
          </button>

          <button
            onClick={() => setActiveCategory('eservices')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'eservices'
                ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white border border-[#D5DEE8] dark:border-[#30445B]'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            E-Services ({E_SERVICES.length})
          </button>
        </div>

        {/* Category Overview Explainer Notice */}
        {activeCategory === 'eservices' && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 text-xs text-[#182638] dark:text-[#F1F5F9] space-y-1.5 shadow-xs">
            <div className="font-bold flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Citizen E-Services Booking Payment Rule</span>
            </div>
            <p className="leading-relaxed text-[#526477] dark:text-[#B8C5D4]">
              Book your e-service by paying <strong className="text-[#182638] dark:text-white">₹236 (₹200 base charge + 18% GST ₹36)</strong>. The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.
            </p>
          </div>
        )}

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isEService = service.isEService || service.category === 'eservices';

            return (
              <div
                key={service.id}
                className="rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all"
              >
                <div className="space-y-4">
                  {/* Header Tag & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                        isEService
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : service.category === 'compliance'
                          ? 'bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border-[#D5DEE8] dark:border-[#30445B]'
                          : 'bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border-[#D5DEE8] dark:border-[#30445B]'
                      }`}
                    >
                      {service.categoryTitle || service.category}
                    </span>

                    {isEService ? (
                      <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                        ₹236 Initial Booking
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-semibold text-[#526477] dark:text-[#B8C5D4]">
                        Work-Based Quote
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9] leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Detailed Scope bullet */}
                  {service.detailedScope && (
                    <div className="pt-2 border-t border-[#D5DEE8] dark:border-[#30445B]">
                      <p className="text-[11px] text-[#526477] dark:text-[#B8C5D4] line-clamp-2">
                        <strong className="text-[#182638] dark:text-[#F1F5F9]">Scope: </strong>
                        {service.detailedScope}
                      </p>
                    </div>
                  )}

                  {/* Compliance / Booking Notice if any */}
                  {service.complianceNotice && (
                    <div className="p-2.5 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[10px] text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                      {service.complianceNotice}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-col sm:flex-row gap-2">
                  <a
                    href={service.whatsappUrl || `https://wa.me/918220550829?text=${encodeURIComponent(service.whatsappMessage || service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    onClick={() => handleEnquire(service)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isEService ? 'Book (₹236)' : 'Get Quote'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Guidance Strip */}
        <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[#182638] dark:text-[#F1F5F9]">
              Need custom enterprise architecture or a bundled software package?
            </h4>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
              Speak directly with our senior technology and compliance advisors on WhatsApp or submit your project specification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/918220550829?text=Hello%20RUBI%20TECH%20PARK%2C%20I%20would%20like%20to%20discuss%20a%20custom%20service%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="py-2.5 px-4 rounded-xl bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Submit Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
