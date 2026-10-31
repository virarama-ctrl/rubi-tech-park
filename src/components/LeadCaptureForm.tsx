import React, { useState } from 'react';
import {
  BusinessType,
  RequiredService,
  BudgetRange,
  ContactMethod,
  LeadFormData,
  FormValidationErrors,
  PageRoute
} from '../types';
import { validateLeadForm, buildWhatsAppLink } from '../utils/validation';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, AlertCircle, Send, MessageSquare, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';

interface LeadCaptureFormProps {
  initialService?: RequiredService;
  onNavigateToPrivacy?: () => void;
  onNavigate?: (route: PageRoute) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  initialService = 'business-website',
  onNavigateToPrivacy,
  onNavigate
}) => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: 'retail-jewellery',
    requiredService: initialService,
    budgetRange: '₹15,000 - ₹35,000',
    projectDescription: '',
    preferredContactMethod: 'WhatsApp',
    consentAgreed: false
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');

  const businessTypes: { value: BusinessType; label: string }[] = [
    { value: 'retail-jewellery', label: t.form.businessTypes.retailJewellery },
    { value: 'manufacturing', label: t.form.businessTypes.manufacturing },
    { value: 'wholesale-distribution', label: t.form.businessTypes.wholesale },
    { value: 'professional-services', label: t.form.businessTypes.professional },
    { value: 'healthcare-clinic', label: t.form.businessTypes.healthcare },
    { value: 'education-training', label: t.form.businessTypes.education },
    { value: 'real-estate', label: t.form.businessTypes.realEstate },
    { value: 'other', label: t.form.businessTypes.other }
  ];

  const servicesList: { value: RequiredService; label: string }[] = [
    { value: 'business-website', label: t.form.servicesList.businessWebsite },
    { value: 'ecommerce-store', label: t.form.servicesList.ecommerceStore },
    { value: 'custom-crm', label: t.form.servicesList.customCrm },
    { value: 'website-crm-integration', label: t.form.servicesList.websiteCrmIntegration },
    { value: 'ai-workflow-automation', label: t.form.servicesList.aiWorkflowAutomation },
    { value: 'consultation', label: t.form.servicesList.consultation }
  ];

  const budgetRanges: BudgetRange[] = [
    '₹5,000 - ₹15,000',
    '₹15,000 - ₹35,000',
    '₹35,000 - ₹75,000',
    '₹75,000 - ₹1,50,000+',
    'Custom Enterprise'
  ];

  const contactMethods: { method: ContactMethod; label: string }[] = [
    { method: 'WhatsApp', label: t.form.contactMethods.whatsApp },
    { method: 'Phone Call', label: t.form.contactMethods.phoneCall },
    { method: 'Email', label: t.form.contactMethods.email }
  ];

  const handleChange = (
    field: keyof LeadFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as keyof FormValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (honeypot) {
      // Spam detected silently
      setSubmittedSuccess(true);
      setReferenceId('RTP-' + Math.floor(100000 + Math.random() * 900000));
      return;
    }

    const validationResult = validateLeadForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      const firstErrorField = Object.keys(validationResult.errors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          source: 'Website Lead Form',
          honeypot
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setReferenceId(data.lead?.referenceId || 'RTP-' + Math.floor(100000 + Math.random() * 900000));
      setSubmittedSuccess(true);
      setErrors({});
    } catch (err: any) {
      setServerError(err.message || 'Network error occurred. Please contact us via phone or WhatsApp.');
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
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      businessType: 'retail-jewellery',
      requiredService: 'business-website',
      budgetRange: '₹15,000 - ₹35,000',
      projectDescription: '',
      preferredContactMethod: 'WhatsApp',
      consentAgreed: false
    });
    setErrors({});
    setServerError('');
  };

  const handleSendViaWhatsApp = () => {
    const waUrl = buildWhatsAppLink(
      t.brand.whatsAppNumber,
      `Hello RUBI TECH PARK team, I just submitted an inquiry for my business "${formData.businessName || formData.fullName}" (Ref: ${referenceId}).\nService: ${formData.requiredService}\nBudget: ${formData.budgetRange}`
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (submittedSuccess) {
    return (
      <div className="bg-white dark:bg-[#0D1527] border border-[#35C9B0]/40 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto transition-colors">
        <div className="flex items-center gap-4 pb-5 border-b border-[#E5E9F2] dark:border-white/10">
          <div className="w-12 h-12 rounded-xl bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] shrink-0 border border-[#35C9B0]/30">
            <CheckCircle2 className="w-6 h-6 text-[#35C9B0]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-[#172033] dark:text-white">
              {t.form.successTitle}
            </h3>
            <p className="text-xs text-[#647087] dark:text-slate-400">
              {t.form.refCodeLabel} <span className="font-mono text-[#6654E8] dark:text-[#9689FF] font-semibold">{referenceId}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-[#172033] dark:text-slate-300">
          <div className="p-4 bg-[#FAFBFF] dark:bg-[#070B14] rounded-xl border border-[#E5E9F2] dark:border-white/10 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-[#647087] dark:text-slate-400 uppercase tracking-wider block">{t.form.prospectSummary}</span>
                <div className="font-semibold text-[#172033] dark:text-white mt-0.5">{formData.fullName} {formData.businessName ? `(${formData.businessName})` : ''}</div>
                <div className="text-xs text-[#647087] dark:text-slate-400 mt-0.5">{formData.email} · +91 {formData.phone}</div>
              </div>
              <button
                onClick={handleCopyReference}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 hover:bg-slate-50 text-[#172033] dark:text-slate-300 rounded-lg border border-[#E5E9F2] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Copy reference code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#35C9B0]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.form.copiedBtn : t.form.copyRefBtn}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#E5E9F2] dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#647087] dark:text-slate-400">{t.form.selectedService}</span>
                <div className="font-medium text-[#172033] dark:text-slate-200 capitalize">{formData.requiredService.replace(/-/g, ' ')}</div>
              </div>
              <div>
                <span className="text-[#647087] dark:text-slate-400">{t.form.budget}</span>
                <div className="font-semibold text-[#6654E8] dark:text-[#9689FF]">{formData.budgetRange}</div>
              </div>
            </div>
          </div>

          {/* Persistent Database Confirmation Notice */}
          <div className="p-3.5 bg-[#E5FAF7] dark:bg-emerald-950/40 rounded-xl border border-[#35C9B0]/30 text-xs text-[#0F766E] dark:text-emerald-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#35C9B0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#172033] dark:text-white">{t.form.dbConfirmed}</span>
                <p className="mt-1 leading-relaxed">
                  {t.form.dbConfirmedDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSendViaWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.form.sendViaWhatsAppBtn}</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 text-xs text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.form.submitAnotherBtn}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white dark:bg-[#0D1527] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto relative transition-colors"
    >
      {/* Hidden Spam Trap Honeypot */}
      <input
        type="text"
        name="website_trap"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      <div className="border-b border-[#E5E9F2] dark:border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#6654E8]" />
          <span className="text-xs font-semibold text-[#6654E8] uppercase tracking-wider">
            {language === 'ta' ? 'திட்ட மதிப்பீடு படிவம்' : 'Scope & Estimate Form'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-[#172033] dark:text-white">
          {t.contact.formTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[#647087] dark:text-slate-400 mt-1">
          {t.contact.formSubtitle}
        </p>

        {serverError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Row 1: Full Name & Business Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-fullName" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.fullName} <span className="text-[#6654E8]">*</span>
            </label>
            <input
              id="field-fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder={t.form.fullNamePlaceholder}
              className={`w-full bg-[#FAFBFF] dark:bg-[#070B14] border ${
                errors.fullName ? 'border-red-500' : 'border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8]'
              } rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white placeholder-slate-400 focus:outline-none transition-colors shadow-2xs`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{t.form.errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="field-businessName" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.businessName} <span className="text-[#647087] text-[11px]">({t.form.optional})</span>
            </label>
            <input
              id="field-businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder={t.form.businessNamePlaceholder}
              className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Row 2: Email & Phone/WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-email" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.email} <span className="text-[#6654E8]">*</span>
            </label>
            <input
              id="field-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t.form.emailPlaceholder}
              className={`w-full bg-[#FAFBFF] dark:bg-[#070B14] border ${
                errors.email ? 'border-red-500' : 'border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8]'
              } rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white placeholder-slate-400 focus:outline-none transition-colors shadow-2xs`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{t.form.errors.email}</p>}
          </div>

          <div>
            <label htmlFor="field-phone" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.phone} <span className="text-[#6654E8]">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#F3F0FF] dark:bg-slate-900 border border-r-0 border-[#E5E9F2] dark:border-slate-700 rounded-l-xl text-[#6654E8] dark:text-slate-400 text-xs font-mono font-semibold">
                +91
              </span>
              <input
                id="field-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t.form.phonePlaceholder}
                className={`w-full bg-[#FAFBFF] dark:bg-[#070B14] border ${
                  errors.phone ? 'border-red-500' : 'border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8]'
                } rounded-r-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white placeholder-slate-400 focus:outline-none transition-colors shadow-2xs`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{t.form.errors.phone}</p>}
          </div>
        </div>

        {/* Row 3: Business Type & Required Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-businessType" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.businessType} <span className="text-[#6654E8]">*</span>
            </label>
            <select
              id="field-businessType"
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value as BusinessType)}
              className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white focus:outline-none shadow-2xs"
            >
              {businessTypes.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {bt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="field-requiredService" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.requiredService} <span className="text-[#6654E8]">*</span>
            </label>
            <select
              id="field-requiredService"
              value={formData.requiredService}
              onChange={(e) => handleChange('requiredService', e.target.value as RequiredService)}
              className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white focus:outline-none shadow-2xs"
            >
              {servicesList.map((srv) => (
                <option key={srv.value} value={srv.value}>
                  {srv.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Budget Range & Preferred Contact Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-budgetRange" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.budgetRange} <span className="text-[#6654E8]">*</span>
            </label>
            <select
              id="field-budgetRange"
              value={formData.budgetRange}
              onChange={(e) => handleChange('budgetRange', e.target.value as BudgetRange)}
              className="w-full bg-[#FAFBFF] dark:bg-[#070B14] border border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8] rounded-xl px-3.5 py-2.5 text-sm text-[#172033] dark:text-white focus:outline-none shadow-2xs"
            >
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
              {t.form.preferredContact}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {contactMethods.map(({ method, label }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleChange('preferredContactMethod', method)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer text-center ${
                    formData.preferredContactMethod === method
                      ? 'bg-[#F3F0FF] dark:bg-[#6654E8]/20 border-[#6654E8] text-[#6654E8] dark:text-[#9689FF]'
                      : 'bg-[#FAFBFF] dark:bg-[#070B14] border-[#E5E9F2] dark:border-slate-800 text-[#647087] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="field-projectDescription" className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1.5">
            {t.form.projectDesc} <span className="text-[#6654E8]">*</span>
          </label>
          <textarea
            id="field-projectDescription"
            rows={4}
            value={formData.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            placeholder={t.form.projectDescPlaceholder}
            className={`w-full bg-[#FAFBFF] dark:bg-[#070B14] border ${
              errors.projectDescription ? 'border-red-500' : 'border-[#E5E9F2] dark:border-slate-700 focus:border-[#6654E8]'
            } rounded-xl p-3 text-sm text-[#172033] dark:text-white placeholder-slate-400 focus:outline-none transition-colors shadow-2xs`}
          />
          {errors.projectDescription && (
            <p className="text-red-500 text-xs mt-1">{t.form.errors.projectDesc}</p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#647087] dark:text-slate-300">
            <input
              id="field-consentAgreed"
              type="checkbox"
              checked={formData.consentAgreed}
              onChange={(e) => handleChange('consentAgreed', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#6654E8] focus:ring-[#6654E8] cursor-pointer"
            />
            <span>
              {t.form.consentText}{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToPrivacy) onNavigateToPrivacy();
                  else if (onNavigate) onNavigate('privacy-policy');
                }}
                className="text-[#6654E8] dark:text-[#9689FF] underline font-medium hover:underline inline cursor-pointer"
              >
                {t.form.privacyLink}
              </button>
              . {language === 'ta' ? 'விளம்பர தொந்தரவு மற்றும் மூன்றாம் தரப்பு பகிர்வு இல்லை.' : 'No spam or third-party sharing.'}
            </span>
          </label>
          {errors.consentAgreed && (
            <p className="text-red-500 text-xs mt-1 pl-6">{t.form.errors.consent}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm brand-gradient-button transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{t.form.submittingBtn}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>{t.form.submitBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
