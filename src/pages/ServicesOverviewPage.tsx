import React, { useState, useEffect } from 'react';
import { PageRoute, ServiceDetail } from '../types';
import {
  SOFTWARE_SERVICES,
  COMPLIANCE_SERVICES,
  E_SERVICES,
  SERVICES_DATA,
  AGENCY_CONFIG
} from '../config/agencyConfig';
import {
  ServiceReferenceImage,
  getServiceImageMetadata,
  FALLBACK_SERVICE_IMAGE
} from '../config/serviceImages';
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
  Cpu,
  Phone,
  Eye,
  Maximize2,
  X
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
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceDetail | null>(null);

  // Fetch any admin-configured custom image overrides from the database
  useEffect(() => {
    let isMounted = true;
    fetch('/api/services/images')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.images) {
          setCustomImages(data.images);
        }
      })
      .catch(() => {
        // Graceful fallback to default curated images
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
            className={`nav-tab-item px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 ${
              activeCategory === 'all'
                ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white border border-[#D5DEE8] dark:border-[#30445B]'
            }`}
          >
            All Services ({SERVICES_DATA.length})
          </button>

          <button
            onClick={() => setActiveCategory('software')}
            className={`nav-tab-item px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 ${
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
            className={`nav-tab-item px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 ${
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
            className={`nav-tab-item px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 ${
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
                className="interactive-card group rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm hover:border-[#315D82] dark:hover:border-[#6F9FC5] transition-all"
              >
                <div className="space-y-4">
                  {/* Relevant Professional Service Reference Image Thumbnail */}
                  <div
                    onClick={() => setSelectedServiceForDetail(service)}
                    className="cursor-pointer"
                    title="Click to view large reference image and full service specification"
                  >
                    <ServiceReferenceImage
                      serviceId={service.id}
                      serviceTitle={service.title}
                      customImages={customImages}
                      aspectRatioClass="aspect-16/9 sm:aspect-16/10"
                      showCaption={false}
                      onEnlarge={() => setSelectedServiceForDetail(service)}
                    />
                  </div>

                  {/* Header Tag & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
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

                  {/* Title (clickable to open details) */}
                  <h3
                    onClick={() => setSelectedServiceForDetail(service)}
                    className="text-lg font-bold font-display text-[#182638] dark:text-[#F1F5F9] leading-snug group-hover:text-[#315D82] dark:group-hover:text-[#6F9FC5] transition-colors cursor-pointer"
                  >
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

                  {/* Quick Detail Link */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedServiceForDetail(service)}
                      className="hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Reference Image & Scope</span>
                    </button>
                    <span className="text-[10px] text-[#526477] dark:text-[#B8C5D4]">RUBI Verified</span>
                  </div>

                  {/* Compliance / Booking Notice if any */}
                  {service.complianceNotice && (
                    <div className="p-2.5 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[10px] text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                      {service.complianceNotice}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-4 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:+918220550829"
                      className="call-now-button py-2 px-2.5 rounded-xl bg-[#F2F5F8] hover:bg-[#E9EEF3] dark:bg-[#17263A] dark:hover:bg-[#20324b] border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] hover:text-[#315D82] dark:hover:text-[#6F9FC5] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
                      title="Call RUBI TECH PARK directly at +91 82205 50829"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
                      <span>Call Now</span>
                    </a>

                    <a
                      href={service.whatsappUrl || `https://wa.me/918220550829?text=${encodeURIComponent(service.whatsappMessage || service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-button py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleEnquire(service)}
                    className="cyber-button-primary w-full py-2.5 px-3 rounded-xl bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
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
        <div className="interactive-card bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[#182638] dark:text-[#F1F5F9]">
              Need custom enterprise architecture or a bundled software package?
            </h4>
            <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
              Speak directly with our senior technology and compliance advisors on phone or WhatsApp or submit your project specification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="tel:+918220550829"
              className="call-now-button py-2.5 px-3.5 rounded-xl bg-[#F2F5F8] hover:bg-[#E9EEF3] dark:bg-[#17263A] dark:hover:bg-[#20324b] border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] hover:text-[#315D82] dark:hover:text-[#6F9FC5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
            >
              <Phone className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>Call Now</span>
            </a>

            <a
              href="https://wa.me/918220550829?text=Hello%20RUBI%20TECH%20PARK%2C%20I%20would%20like%20to%20discuss%20a%20custom%20service%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="cyber-button-primary py-2.5 px-4 rounded-xl bg-[#315D82] dark:bg-[#416F98] text-white hover:opacity-95 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
            >
              <span>Submit Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Service Details View Modal with Large Reference Image */}
      {selectedServiceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white dark:bg-[#142033] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D5DEE8] dark:border-[#30445B] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                    selectedServiceForDetail.isEService || selectedServiceForDetail.category === 'eservices'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] border-[#D5DEE8] dark:border-[#30445B]'
                  }`}
                >
                  {selectedServiceForDetail.categoryTitle || selectedServiceForDetail.category}
                </span>
                <span className="text-xs font-mono text-[#526477] dark:text-[#B8C5D4] hidden sm:inline">
                  RUBI Verified Specification
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedServiceForDetail(null)}
                className="p-1.5 text-slate-400 hover:text-black dark:hover:text-white rounded-lg cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large High-Fidelity Reference Image */}
            <div className="space-y-2">
              <ServiceReferenceImage
                serviceId={selectedServiceForDetail.id}
                serviceTitle={selectedServiceForDetail.title}
                customImages={customImages}
                aspectRatioClass="aspect-16/9 sm:aspect-21/9"
                showCaption={true}
                priority={true}
              />
            </div>

            {/* Title & Pricing Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                  {selectedServiceForDetail.title}
                </h3>
                <p className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-1">
                  RUBI TECH PARK · Coimbatore, Tamil Nadu
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                {selectedServiceForDetail.isEService || selectedServiceForDetail.category === 'eservices' ? (
                  <div className="inline-block px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    ₹236 Initial Booking (₹200 + 18% GST)
                  </div>
                ) : (
                  <div className="inline-block px-3 py-1 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono font-bold text-[#315D82] dark:text-[#6F9FC5]">
                    Transparent Work-Based Quote
                  </div>
                )}
              </div>
            </div>

            {/* Description & Detailed Scope */}
            <div className="space-y-3 text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              <p className="text-[#182638] dark:text-slate-200">
                {selectedServiceForDetail.shortDescription}
              </p>

              {selectedServiceForDetail.detailedScope && (
                <div className="p-3.5 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-1">
                  <div className="font-semibold text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
                    Detailed Scope & Implementation
                  </div>
                  <p className="text-xs text-[#182638] dark:text-[#F1F5F9]">
                    {selectedServiceForDetail.detailedScope}
                  </p>
                </div>
              )}

              {selectedServiceForDetail.complianceNotice && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
                  {selectedServiceForDetail.complianceNotice}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href="tel:+918220550829"
                  className="call-now-button py-2 px-3 rounded-xl bg-[#F2F5F8] hover:bg-[#E9EEF3] dark:bg-[#17263A] dark:hover:bg-[#20324b] border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
                  <span>Call +91 82205 50829</span>
                </a>

                <a
                  href={
                    selectedServiceForDetail.whatsappUrl ||
                    `https://wa.me/918220550829?text=${encodeURIComponent(
                      selectedServiceForDetail.whatsappMessage || selectedServiceForDetail.title
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedServiceForDetail(null)}
                  className="py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#182638] dark:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const svc = selectedServiceForDetail;
                    setSelectedServiceForDetail(null);
                    handleEnquire(svc);
                  }}
                  className="cyber-button-primary py-2 px-4 rounded-xl bg-[#315D82] dark:bg-[#416F98] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>
                    {selectedServiceForDetail.isEService || selectedServiceForDetail.category === 'eservices'
                      ? 'Proceed to Book (₹236)'
                      : 'Request Quotation'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
