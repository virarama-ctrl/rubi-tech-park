import React, { useState } from 'react';
import {
  BusinessType,
  RequiredService,
  PageRoute
} from '../types';
import {
  SOFTWARE_SERVICES,
  COMPLIANCE_SERVICES,
  E_SERVICES,
  AGENCY_CONFIG
} from '../config/agencyConfig';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  RefreshCw,
  Copy,
  Check,
  Code2,
  Shield,
  FileText,
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';

export type FormCategory = 'general' | 'software' | 'compliance' | 'eservice';

interface LeadCaptureFormProps {
  initialCategory?: FormCategory;
  initialService?: string;
  onNavigateToPrivacy?: () => void;
  onNavigate?: (route: PageRoute) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  initialCategory = 'general',
  initialService,
  onNavigateToPrivacy,
  onNavigate
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<FormCategory>(initialCategory);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState('Business');
  const [selectedService, setSelectedService] = useState(initialService || '');
  const [requirement, setRequirement] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // UI / Status State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle Tab Switch
  const handleTabChange = (tab: FormCategory) => {
    setActiveTab(tab);
    setErrors({});
    if (tab === 'software') {
      setSelectedService(SOFTWARE_SERVICES[0].title);
    } else if (tab === 'compliance') {
      setSelectedService(COMPLIANCE_SERVICES[0].title);
    } else if (tab === 'eservice') {
      setSelectedService(E_SERVICES[0].title);
    } else {
      setSelectedService('General Business Enquiry');
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = language === 'ta' ? 'முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்).' : 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = language === 'ta' ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please provide a valid email address.';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6-9]\d{9}$/;
    if (!phone || !indianMobileRegex.test(digitsOnly)) {
      errs.phone = language === 'ta' ? 'சரியான 10-இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்.' : 'Please provide a valid 10-digit Indian mobile number.';
    }

    if (!consentAgreed) {
      errs.consentAgreed = language === 'ta' ? 'விதிமுறைகள் மற்றும் தனியுரிமை கொள்கையை ஏற்கவும்.' : 'Please agree to the privacy policy to submit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (honeypot) {
      setSubmittedSuccess(true);
      setReferenceId('RTP-' + Math.floor(100000 + Math.random() * 900000));
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    const isEService = activeTab === 'eservice';
    const categoryName =
      activeTab === 'software'
        ? 'Software Development & Digital Solutions'
        : activeTab === 'compliance'
        ? 'Statutory & Compliance Services'
        : activeTab === 'eservice'
        ? 'E-Services (Citizen Services)'
        : 'General Enquiry';

    const finalService = selectedService || (activeTab === 'general' ? 'General Enquiry' : 'General');
    const finalWhatsApp = sameAsPhone ? phone : (whatsappNumber || phone);

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsappNumber: finalWhatsApp.trim(),
      email: email.trim(),
      customerType,
      serviceCategory: categoryName,
      selectedService: finalService,
      projectDescription: requirement.trim(),
      source: `Website Form (${categoryName})`,
      consentAgreed: true,
      isEService,
      bookingAmount: isEService ? 236 : undefined,
      bookingPaymentStatus: isEService ? 'Pending' : undefined
    };

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to submit enquiry. Please try again.');
      }

      setReferenceId(data.referenceId || `RTP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setWhatsappUrl(data.whatsappNotificationUrl || `https://wa.me/918220550829`);
      setSubmittedSuccess(true);
      setErrors({});
    } catch (err: any) {
      setServerError(err.message || 'Network error occurred. Please contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSubmittedSuccess(false);
    setReferenceId('');
    setWhatsappUrl('');
    setFullName('');
    setPhone('');
    setWhatsappNumber('');
    setEmail('');
    setRequirement('');
    setConsentAgreed(false);
    setErrors({});
    setServerError('');
  };

  if (submittedSuccess) {
    return (
      <div className="bg-white dark:bg-[#121829] border border-[#35C9B0]/40 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto transition-colors">
        <div className="flex items-center gap-4 pb-5 border-b border-[#E5E9F2] dark:border-white/10">
          <div className="w-12 h-12 rounded-xl bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] shrink-0 border border-[#35C9B0]/30">
            <CheckCircle2 className="w-6 h-6 text-[#35C9B0]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-[#172033] dark:text-white">
              {activeTab === 'eservice' ? 'E-Service Booking Request Received' : 'Enquiry Successfully Registered'}
            </h3>
            <p className="text-xs text-[#647087] dark:text-slate-400">
              Reference ID: <span className="font-mono text-[#6654E8] dark:text-[#9689FF] font-semibold">{referenceId}</span>
            </p>
          </div>
        </div>

        <div className="py-6 space-y-4">
          {activeTab === 'eservice' ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Initial Booking Amount Breakdown</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 pt-1">
                <div>Base Booking Charge: <strong>₹200</strong></div>
                <div>18% GST: <strong>₹36</strong></div>
                <div className="col-span-2 pt-1 border-t border-amber-200 dark:border-amber-800 font-semibold text-amber-900 dark:text-amber-100">
                  Total Initial Booking Amount: ₹236 (Payment Status: Pending Verification)
                </div>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 pt-1 leading-relaxed">
                *The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.*
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#172033] dark:text-slate-200 leading-relaxed">
              Thank you, <strong>{fullName}</strong>. Your enquiry has been safely recorded in our database. Our specialist consultant will review your brief and contact you via WhatsApp / Phone shortly.
            </p>
          )}

          <div className="bg-[#FAFBFF] dark:bg-[#172038] rounded-xl p-4 border border-[#E5E9F2] dark:border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#647087] dark:text-slate-400">Reference Tracking Code:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#6654E8] dark:text-[#9689FF]">{referenceId}</span>
                <button
                  onClick={handleCopyReference}
                  className="p-1 rounded-md text-[#647087] hover:text-[#172033] dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647087] dark:text-slate-400">Selected Service:</span>
              <span className="font-medium text-[#172033] dark:text-white">{selectedService || 'General Inquiry'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647087] dark:text-slate-400">Direct Desk WhatsApp:</span>
              <span className="font-mono text-[#172033] dark:text-white">+91 82205 50829</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E9F2] dark:border-white/10">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forward to WhatsApp Desk (+91 82205 50829)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={handleReset}
            className="py-3 px-5 rounded-xl border border-[#E5E9F2] dark:border-white/10 hover:bg-[#FAFBFF] dark:hover:bg-white/5 text-[#172033] dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Submit Another Request</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl shadow-xs overflow-hidden transition-colors">
      {/* 4 Dedicated Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#F2F5F8] dark:bg-[#17263A] border-b border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono font-semibold">
        <button
          type="button"
          onClick={() => handleTabChange('general')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'general'
              ? 'border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40]'
              : 'border-transparent text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">General Discovery</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('software')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'software'
              ? 'border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40]'
              : 'border-transparent text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
          }`}
        >
          <Code2 className="w-4 h-4 shrink-0" />
          <span className="truncate">Software Architecture</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('compliance')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'compliance'
              ? 'border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40]'
              : 'border-transparent text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
          }`}
        >
          <Shield className="w-4 h-4 shrink-0" />
          <span className="truncate">Statutory / Compliance</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('eservice')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'eservice'
              ? 'border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] bg-white dark:bg-[#1C2B40]'
              : 'border-transparent text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="truncate">E-Services (₹236)</span>
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* Banner Explaining Selected Tab */}
        {activeTab === 'eservice' && (
          <div className="mb-6 p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#182638] dark:text-[#F1F5F9] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5]">
              <Info className="w-4 h-4" />
              <span>Mandatory Citizen E-Service Booking Deposit Rule</span>
            </div>
            <p className="leading-relaxed text-[#526477] dark:text-[#B8C5D4]">
              Book your e-service by paying <strong>₹236 (₹200 base charge + 18% GST ₹36)</strong>. The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.
            </p>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="mb-6 p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#182638] dark:text-[#F1F5F9] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5]">
              <Shield className="w-4 h-4" />
              <span>Statutory Compliance & Registration Guidance</span>
            </div>
            <p className="leading-relaxed text-[#526477] dark:text-[#B8C5D4]">
              Services are subject to eligibility, document verification, and applicable government rules. Government official fees and professional charges are separate, and customized work-based quotations are offered after initial document review.
            </p>
          </div>
        )}

        {activeTab === 'software' && (
          <div className="mb-6 p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#182638] dark:text-[#F1F5F9] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5]">
              <Code2 className="w-4 h-4" />
              <span>Custom Software & Digital Solutions Quotation</span>
            </div>
            <p className="leading-relaxed text-[#526477] dark:text-[#B8C5D4]">
              Pricing is work-based upon project complexity, technical deliverables, and agreed milestones. Share your brief below to receive an architectural scope estimate.
            </p>
          </div>
        )}

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot anti-spam */}
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Row 1: Full Name & Customer Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] placeholder-[#526477]/60 dark:placeholder-[#B8C5D4]/60 focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-rose-500 focus:ring-rose-500/20' : 'border-[#D5DEE8] dark:border-[#30445B] focus:ring-[#315D82]/20 focus:border-[#315D82]'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
                Customer Type
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82]/20 focus:border-[#315D82]"
              >
                <option value="Business">Registered Business / Company</option>
                <option value="Startup">Early-Stage Startup</option>
                <option value="Individual">Individual Citizen</option>
                <option value="Retail">Retail Shop / SME</option>
              </select>
            </div>
          </div>

          {/* Row 2: Mobile Number & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
                Mobile Number (Calling) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#526477] font-semibold">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] placeholder-[#526477]/60 dark:placeholder-[#B8C5D4]/60 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-rose-500 focus:ring-rose-500/20' : 'border-[#D5DEE8] dark:border-[#30445B] focus:ring-[#315D82]/20 focus:border-[#315D82]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] placeholder-[#526477]/60 dark:placeholder-[#B8C5D4]/60 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500/20' : 'border-[#D5DEE8] dark:border-[#30445B] focus:ring-[#315D82]/20 focus:border-[#315D82]'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Same WhatsApp Toggle */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="sameAsPhone"
              checked={sameAsPhone}
              onChange={(e) => setSameAsPhone(e.target.checked)}
              className="rounded text-[#315D82] focus:ring-[#315D82] cursor-pointer"
            />
            <label htmlFor="sameAsPhone" className="text-xs text-[#526477] dark:text-[#B8C5D4] cursor-pointer">
              WhatsApp number is the same as calling number (+91 {phone || '...' })
            </label>
          </div>

          {!sameAsPhone && (
            <div>
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
                WhatsApp Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#526477] font-semibold">+91</span>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82]/20 focus:border-[#315D82]"
                />
              </div>
            </div>
          )}

          {/* Row 3: Service Selection Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
              Select Specific Service *
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82]/20 focus:border-[#315D82]"
            >
              {activeTab === 'software' &&
                SOFTWARE_SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}

              {activeTab === 'compliance' &&
                COMPLIANCE_SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}

              {activeTab === 'eservice' &&
                E_SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title} (₹236 initial booking)
                  </option>
                ))}

              {activeTab === 'general' && (
                <>
                  <option value="General Software Inquiry">General Software Inquiry</option>
                  <option value="Statutory & Tax Compliance Inquiry">Statutory & Tax Compliance Inquiry</option>
                  <option value="Citizen E-Services Consultation">Citizen E-Services Consultation</option>
                  <option value="Partnership / Other Business Opportunity">Partnership / Other Opportunity</option>
                </>
              )}
            </select>
          </div>

          {/* Row 4: Requirement Textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1.5">
              Requirement Details / Scope Overview *
            </label>
            <textarea
              rows={3}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder={
                activeTab === 'software'
                  ? 'Describe features, target audience, preferred integrations (payment gateway, WhatsApp), timeline...'
                  : activeTab === 'compliance'
                  ? 'Describe your business turnover, state, current registration status, or licence required...'
                  : activeTab === 'eservice'
                  ? 'Mention existing document details or corrections needed for your application...'
                  : 'How can we help your business achieve digital excellence?'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] text-xs sm:text-sm bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] placeholder-[#526477]/60 dark:placeholder-[#B8C5D4]/60 focus:outline-none focus:ring-2 focus:ring-[#315D82]/20 focus:border-[#315D82]"
            />
          </div>

          {/* Consent Checkbox */}
          <div>
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-1 rounded text-[#315D82] focus:ring-[#315D82] cursor-pointer"
              />
              <label htmlFor="consentCheck" className="text-xs text-[#526477] dark:text-[#B8C5D4] leading-relaxed cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={onNavigateToPrivacy}
                  className="text-[#315D82] dark:text-[#6F9FC5] underline hover:no-underline font-medium"
                >
                  Privacy Policy
                </button>{' '}
                and understand that RUBI TECH PARK provides verified facilitation and development services.
              </label>
            </div>
            {errors.consentAgreed && <p className="text-[11px] text-rose-500 mt-1">{errors.consentAgreed}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl cyber-button-primary disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Recording in Database...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {activeTab === 'eservice'
                    ? 'Submit E-Service Booking Request (₹236)'
                    : activeTab === 'software'
                    ? 'Request Software Architecture Quotation'
                    : 'Submit Official Business Enquiry'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
