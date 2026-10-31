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
  ChevronRight
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] dark:bg-[#172038] border border-[#6654E8]/20 text-xs font-semibold text-[#6654E8] dark:text-[#9689FF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services & Solutions</span>
          <span aria-hidden="true">·</span>
          <span>{AGENCY_CONFIG.brandName}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#172033] dark:text-white tracking-tight">
          Comprehensive Technology & Compliance Services
        </h1>
        <p className="text-base text-[#647087] dark:text-slate-300 leading-relaxed">
          Explore our complete catalog of 38 specialized services across Software Engineering, Statutory & Regulatory Compliance, and Citizen E-Services.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E9F2] dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#6654E8] text-white shadow-xs'
              : 'bg-white dark:bg-[#121829] text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10'
          }`}
        >
          All Services ({SERVICES_DATA.length})
        </button>

        <button
          onClick={() => setActiveCategory('software')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === 'software'
              ? 'bg-[#6654E8] text-white shadow-xs'
              : 'bg-white dark:bg-[#121829] text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Software & Digital ({SOFTWARE_SERVICES.length})
        </button>

        <button
          onClick={() => setActiveCategory('compliance')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === 'compliance'
              ? 'bg-[#6654E8] text-white shadow-xs'
              : 'bg-white dark:bg-[#121829] text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10'
          }`}
        >
          <Shield className="w-4 h-4" />
          Statutory & Compliance ({COMPLIANCE_SERVICES.length})
        </button>

        <button
          onClick={() => setActiveCategory('eservices')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeCategory === 'eservices'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#121829] text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          E-Services ({E_SERVICES.length})
        </button>
      </div>

      {/* Category Overview Explainer Notice */}
      {activeCategory === 'eservices' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 shadow-xs">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Citizen E-Services Booking Payment Rule</span>
          </div>
          <p className="leading-relaxed">
            Book your e-service by paying <strong>₹236 (₹200 base charge + 18% GST ₹36)</strong>. The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.
          </p>
        </div>
      )}

      {activeCategory === 'compliance' && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 space-y-1.5 shadow-xs">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Statutory Compliance Disclosures</span>
          </div>
          <p className="leading-relaxed">
            Statutory registrations, filings, and certifications are subject to eligibility, document verification, and applicable government rules. Government official fees and professional charges are separate, and customized work-based quotations are offered after initial document review.
          </p>
        </div>
      )}

      {activeCategory === 'software' && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5 shadow-xs">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Software Development & Digital Solutions</span>
          </div>
          <p className="leading-relaxed">
            All software and custom web engineering services are quoted based on project complexity, deliverables, integrations, and milestones. Never pay for unnecessary bloated packages; get a verified scope breakdown.
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
              className="saas-card rounded-2xl p-6 flex flex-col justify-between saas-card-hover bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10"
            >
              <div className="space-y-4">
                {/* Header Tag & Category */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      isEService
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : service.category === 'compliance'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    {service.categoryTitle || service.category}
                  </span>

                  {isEService ? (
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹236 Initial Booking
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-semibold text-[#647087] dark:text-slate-400">
                      Work-Based Quote
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-display text-[#172033] dark:text-white leading-snug">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#647087] dark:text-slate-300 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Detailed Scope bullet */}
                {service.detailedScope && (
                  <div className="pt-2 border-t border-[#E5E9F2]/60 dark:border-white/5">
                    <p className="text-[11px] text-[#647087] dark:text-slate-400 line-clamp-2">
                      <strong className="text-slate-700 dark:text-slate-200">Scope: </strong>
                      {service.detailedScope}
                    </p>
                  </div>
                )}

                {/* Compliance / Booking Notice if any */}
                {service.complianceNotice && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-[10px] text-amber-800 dark:text-amber-200 leading-relaxed">
                    {service.complianceNotice}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-[#E5E9F2] dark:border-white/10 flex flex-col sm:flex-row gap-2">
                <a
                  href={service.whatsappUrl || `https://wa.me/918220550829?text=${encodeURIComponent(service.whatsappMessage || service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  onClick={() => handleEnquire(service)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#6654E8] hover:bg-[#5542E5] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
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
      <div className="bg-[#FAFBFF] dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-[#172033] dark:text-white">
            Need a custom consultation or bundled service package?
          </h4>
          <p className="text-xs text-[#647087] dark:text-slate-400">
            Speak directly with our senior technology and compliance advisors on WhatsApp or book a consultation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/918220550829?text=Hello%20RUBI%20TECH%20PARK%2C%20I%20would%20like%20to%20discuss%20a%20custom%20service%20requirement."
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={() => onNavigate('contact')}
            className="py-2.5 px-4 rounded-xl bg-[#6654E8] hover:bg-[#5542E5] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Submit Brief</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
