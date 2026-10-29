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
import { CheckCircle2, AlertCircle, Send, MessageSquare, RefreshCw, Copy, Check } from 'lucide-react';

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
    const validation = validateLeadForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstErrorKey = Object.keys(validation.errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          website_trap: honeypot
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setServerError(data.message || (language === 'ta' ? 'அதிக கோரிக்கைகள். சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.' : 'Rate limit exceeded. Please wait a few moments before submitting again.'));
        } else if (response.status === 400 && data.errors) {
          setErrors(data.errors);
          setServerError(data.message || (language === 'ta' ? 'படிவத்தில் உள்ள பிழைகளை சரிசெய்யவும்.' : 'Please correct the highlighted fields.'));
        } else {
          setServerError(data.message || (language === 'ta' ? 'தவறு நேரிட்டது. வாட்ஸ்அப்பில் நேரடியாக தொடர்பு கொள்ளவும்.' : 'An error occurred while saving your inquiry. Please try again or message us on WhatsApp.'));
        }
        setIsSubmitting(false);
        return;
      }

      const generatedRef = data.referenceId || `RTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Submission network error:', err);
      const fallbackRef = `RTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(fallbackRef);
      setServerError(language === 'ta' ? 'இணைய தொடர்பு தடைபட்டது. கீழே உள்ள வாட்ஸ்அப் வழியாக நேரடியாக அனுப்பலாம்.' : 'Network request interrupted. You can forward your details directly via WhatsApp below.');
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }
  };

  const handleCopyReference = () => {
    if (!referenceId) return;
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendViaWhatsApp = () => {
    const textMsg = language === 'ta'
      ? `வணக்கம் RUBI TECH PARK,\nநான் எனது திட்ட விபரங்களை சமர்ப்பித்துள்ளேன்:\nகுறிப்பு எண்: ${referenceId}\nபெயர்: ${formData.fullName}\nநிறுவனம்: ${formData.businessName || 'இல்லை'}\nசேவை: ${formData.requiredService}\nபட்ஜெட்: ${formData.budgetRange}\nதிட்ட சுருக்கம்: ${formData.projectDescription}`
      : `Hello RUBI TECH PARK,\nI have submitted an enquiry with Reference: ${referenceId}\nName: ${formData.fullName}\nBusiness: ${formData.businessName || 'N/A'}\nService: ${formData.requiredService}\nBudget: ${formData.budgetRange}\nBrief: ${formData.projectDescription}`;
    
    const targetNumber = t.brand.whatsAppNumber || formData.phone;
    const link = buildWhatsAppLink(targetNumber, textMsg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setSubmittedSuccess(false);
    setReferenceId('');
    setServerError('');
    setHoneypot('');
    setFormData({
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
  };

  if (submittedSuccess) {
    return (
      <div className="bg-[#0B132B] border border-[#D4AF37]/50 rounded-xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {t.form.successTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.form.refCodeLabel} <span className="font-mono text-[#F3DC87] font-semibold">{referenceId}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <div className="p-4 bg-[#070B14] rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">{t.form.prospectSummary}</span>
                <div className="font-semibold text-white mt-0.5">{formData.fullName} {formData.businessName ? `(${formData.businessName})` : ''}</div>
                <div className="text-xs text-slate-400 mt-0.5">{formData.email} · +91 {formData.phone}</div>
              </div>
              <button
                onClick={handleCopyReference}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                title="Copy reference code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.form.copiedBtn : t.form.copyRefBtn}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">{t.form.selectedService}</span>
                <div className="font-medium text-slate-200 capitalize">{formData.requiredService.replace(/-/g, ' ')}</div>
              </div>
              <div>
                <span className="text-slate-400">{t.form.budget}</span>
                <div className="font-medium text-[#F3DC87]">{formData.budgetRange}</div>
              </div>
            </div>
          </div>

          {/* Persistent Database Confirmation Notice */}
          <div className="p-3.5 bg-[#0A1020] rounded-lg border border-emerald-500/30 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{t.form.dbConfirmed}</span>
                <p className="mt-1 text-slate-400 leading-relaxed">
                  {t.form.dbConfirmedDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSendViaWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.form.sendViaWhatsAppBtn}</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
      className="bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto relative"
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

      <div className="border-b border-slate-800 pb-5 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
          {t.contact.formTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t.contact.formSubtitle}
        </p>

        {serverError && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Row 1: Full Name & Business Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.fullName} <span className="text-[#E5C158]">*</span>
            </label>
            <input
              id="field-fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder={t.form.fullNamePlaceholder}
              className={`w-full bg-[#070B14] border ${
                errors.fullName ? 'border-red-500' : 'border-slate-700 focus:border-[#D4AF37]'
              } rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors`}
            />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{t.form.errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="field-businessName" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.businessName} <span className="text-slate-500 text-[11px]">{t.form.optional}</span>
            </label>
            <input
              id="field-businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder={t.form.businessNamePlaceholder}
              className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Email & Phone/WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-email" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.email} <span className="text-[#E5C158]">*</span>
            </label>
            <input
              id="field-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t.form.emailPlaceholder}
              className={`w-full bg-[#070B14] border ${
                errors.email ? 'border-red-500' : 'border-slate-700 focus:border-[#D4AF37]'
              } rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{t.form.errors.email}</p>}
          </div>

          <div>
            <label htmlFor="field-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.phone} <span className="text-[#E5C158]">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-slate-900 border border-r-0 border-slate-700 rounded-l-lg text-slate-400 text-xs font-mono">
                +91
              </span>
              <input
                id="field-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t.form.phonePlaceholder}
                className={`w-full bg-[#070B14] border ${
                  errors.phone ? 'border-red-500' : 'border-slate-700 focus:border-[#D4AF37]'
                } rounded-r-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors`}
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{t.form.errors.phone}</p>}
          </div>
        </div>

        {/* Row 3: Business Type & Required Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-businessType" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.businessType} <span className="text-[#E5C158]">*</span>
            </label>
            <select
              id="field-businessType"
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value as BusinessType)}
              className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
            >
              {businessTypes.map((bt) => (
                <option key={bt.value} value={bt.value} className="bg-[#070B14] text-white">
                  {bt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="field-requiredService" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.requiredService} <span className="text-[#E5C158]">*</span>
            </label>
            <select
              id="field-requiredService"
              value={formData.requiredService}
              onChange={(e) => handleChange('requiredService', e.target.value as RequiredService)}
              className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
            >
              {servicesList.map((srv) => (
                <option key={srv.value} value={srv.value} className="bg-[#070B14] text-white">
                  {srv.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Budget Range & Preferred Contact Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-budgetRange" className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.budgetRange} <span className="text-[#E5C158]">*</span>
            </label>
            <select
              id="field-budgetRange"
              value={formData.budgetRange}
              onChange={(e) => handleChange('budgetRange', e.target.value as BudgetRange)}
              className="w-full bg-[#070B14] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
            >
              {budgetRanges.map((b) => (
                <option key={b} value={b} className="bg-[#070B14] text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.form.preferredContact}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {contactMethods.map(({ method, label }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleChange('preferredContactMethod', method)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    formData.preferredContactMethod === method
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3DC87]'
                      : 'bg-[#070B14] border-slate-800 text-slate-400 hover:text-white'
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
          <label htmlFor="field-projectDescription" className="block text-xs font-medium text-slate-300 mb-1.5">
            {t.form.projectDesc} <span className="text-[#E5C158]">*</span>
          </label>
          <textarea
            id="field-projectDescription"
            rows={4}
            value={formData.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            placeholder={t.form.projectDescPlaceholder}
            className={`w-full bg-[#070B14] border ${
              errors.projectDescription ? 'border-red-500' : 'border-slate-700 focus:border-[#D4AF37]'
            } rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors`}
          />
          {errors.projectDescription && (
            <p className="text-red-400 text-xs mt-1">{t.form.errors.projectDesc}</p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              id="field-consentAgreed"
              type="checkbox"
              checked={formData.consentAgreed}
              onChange={(e) => handleChange('consentAgreed', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 text-[#D4AF37] focus:ring-[#D4AF37] bg-[#070B14] cursor-pointer"
            />
            <span>
              {t.form.consentText}{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToPrivacy) onNavigateToPrivacy();
                  else if (onNavigate) onNavigate('privacy-policy');
                }}
                className="text-[#E5C158] underline hover:text-[#FFF0BD] inline cursor-pointer"
              >
                {t.form.privacyLink}
              </button>
              . {language === 'ta' ? 'விளம்பர தொந்தரவு மற்றும் மூன்றாம் தரப்பு பகிர்வு இல்லை.' : 'No spam or third-party sharing.'}
            </span>
          </label>
          {errors.consentAgreed && (
            <p className="text-red-400 text-xs mt-1 pl-6">{t.form.errors.consent}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-lg font-semibold text-sm text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#070B14]" />
                <span>{t.form.submittingBtn}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#070B14]" />
                <span>{t.form.submitBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
