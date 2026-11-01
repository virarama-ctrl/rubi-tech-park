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
    <div className="relative futuristic-mesh-bg min-h-screen text-slate-900 dark:text-white transition-colors">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/30 text-xs font-mono text-[#0284C7] dark:text-[#00D4FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
            <span>Services & Solutions</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-[#8292AA]">·</span>
            <span>{AGENCY_CONFIG.brandName}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Comprehensive Technology & Compliance Services
          </h1>
          <p className="text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            Explore our complete catalog of 38 specialized services across Software Engineering, Statutory & Regulatory Compliance, and Citizen Digital E-Services.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#00D4FF]/15 pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#356BFF] text-white shadow-md shadow-[#00D4FF]/20'
                : 'bg-white dark:bg-[#0B1530] text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#00D4FF]/20'
            }`}
          >
            All Services ({SERVICES_DATA.length})
          </button>

          <button
            onClick={() => setActiveCategory('software')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'software'
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#356BFF] text-white shadow-md shadow-[#00D4FF]/20'
                : 'bg-white dark:bg-[#0B1530] text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#00D4FF]/20'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF]" />
            Software & Digital ({SOFTWARE_SERVICES.length})
          </button>

          <button
            onClick={() => setActiveCategory('compliance')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'compliance'
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#356BFF] text-white shadow-md shadow-[#00D4FF]/20'
                : 'bg-white dark:bg-[#0B1530] text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#00D4FF]/20'
            }`}
          >
            <Shield className="w-4 h-4 text-blue-600 dark:text-[#356BFF]" />
            Statutory & Compliance ({COMPLIANCE_SERVICES.length})
          </button>

          <button
            onClick={() => setActiveCategory('eservices')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'eservices'
                ? 'bg-gradient-to-r from-[#00D4FF] to-[#356BFF] text-white shadow-md shadow-[#00D4FF]/20'
                : 'bg-white dark:bg-[#0B1530] text-slate-700 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#00D4FF]/20'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-[#00E5A3]" />
            E-Services ({E_SERVICES.length})
          </button>
        </div>

        {/* Category Overview Explainer Notice */}
        {activeCategory === 'eservices' && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#0B1530]/85 border border-emerald-300 dark:border-[#00E5A3]/30 text-xs text-slate-700 dark:text-[#CBD5E1] space-y-1.5 shadow-sm dark:shadow-lg">
            <div className="font-bold flex items-center gap-2 text-sm text-emerald-700 dark:text-[#00E5A3]">
              <Info className="w-4 h-4 text-emerald-600 dark:text-[#00E5A3]" />
              <span>Citizen E-Services Booking Payment Rule</span>
            </div>
            <p className="leading-relaxed">
              Book your e-service by paying <strong className="text-slate-900 dark:text-white">₹236 (₹200 base charge + 18% GST ₹36)</strong>. The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.
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
                className="saas-card rounded-2xl p-6 flex flex-col justify-between saas-card-hover bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/20 shadow-md dark:shadow-xl"
              >
                <div className="space-y-4">
                  {/* Header Tag & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                        isEService
                          ? 'bg-emerald-50 dark:bg-[#00E5A3]/10 text-emerald-700 dark:text-[#00E5A3] border-emerald-200 dark:border-[#00E5A3]/30'
                          : service.category === 'compliance'
                          ? 'bg-blue-50 dark:bg-[#356BFF]/10 text-blue-700 dark:text-[#356BFF] border-blue-200 dark:border-[#356BFF]/30'
                          : 'bg-cyan-50 dark:bg-[#00D4FF]/10 text-[#0284C7] dark:text-[#00D4FF] border-cyan-200 dark:border-[#00D4FF]/30'
                      }`}
                    >
                      {service.categoryTitle || service.category}
                    </span>

                    {isEService ? (
                      <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-[#00E5A3]">
                        ₹236 Initial Booking
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#8292AA]">
                        Work-Based Quote
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Detailed Scope bullet */}
                  {service.detailedScope && (
                    <div className="pt-2 border-t border-slate-200 dark:border-[#00D4FF]/10">
                      <p className="text-[11px] text-slate-500 dark:text-[#8292AA] line-clamp-2">
                        <strong className="text-slate-700 dark:text-[#CBD5E1]">Scope: </strong>
                        {service.detailedScope}
                      </p>
                    </div>
                  )}

                  {/* Compliance / Booking Notice if any */}
                  {service.complianceNotice && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070B18]/90 border border-slate-200 dark:border-[#00D4FF]/15 text-[10px] text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                      {service.complianceNotice}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-4 border-t border-slate-200 dark:border-[#00D4FF]/15 flex flex-col sm:flex-row gap-2">
                  <a
                    href={service.whatsappUrl || `https://wa.me/918220550829?text=${encodeURIComponent(service.whatsappMessage || service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-[#00E5A3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    onClick={() => handleEnquire(service)}
                    className="flex-1 py-2 px-3 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
        <div className="bg-white dark:bg-[#0B1530]/85 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/25 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md dark:shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Need custom enterprise architecture or a bundled software package?
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              Speak directly with our senior technology and compliance advisors on WhatsApp or submit your project specification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/918220550829?text=Hello%20RUBI%20TECH%20PARK%2C%20I%20would%20like%20to%20discuss%20a%20custom%20service%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-[#00E5A3] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="py-2.5 px-4 rounded-xl cyber-button-primary text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
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
