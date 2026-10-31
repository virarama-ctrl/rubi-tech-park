import React from 'react';
import { PageRoute, RequiredService } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, MessageSquare, Clock, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
  initialService?: RequiredService;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  initialService = 'business-website'
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] dark:bg-[#172038] border border-[#6654E8]/20 text-xs font-semibold text-[#6654E8] dark:text-[#9689FF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.header.contact}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#172033] dark:text-white tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-base text-[#647087] dark:text-slate-300 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Channels & Verified Contacts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="saas-card rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#121829]">
            <h2 className="text-base font-bold font-display text-[#172033] dark:text-white">
              {t.contact.directChannels}
            </h2>

            <div className="space-y-4 text-xs text-[#172033] dark:text-slate-300">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F3F0FF] dark:bg-[#6654E8]/20 flex items-center justify-center text-[#6654E8] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#647087] dark:text-slate-400 block text-[11px] font-medium">{t.contact.phoneLabel}</span>
                  <a
                    href={t.brand.phoneFormatted}
                    className="font-semibold text-[#172033] dark:text-white hover:text-[#6654E8] dark:hover:text-[#9689FF] transition-colors text-sm"
                  >
                    {t.brand.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] dark:bg-blue-950 flex items-center justify-center text-[#4388FF] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#647087] dark:text-slate-400 block text-[11px] font-medium">{t.contact.emailLabel}</span>
                  <a
                    href={`mailto:${t.brand.email}`}
                    className="font-semibold text-[#172033] dark:text-white hover:text-[#6654E8] dark:hover:text-[#9689FF] transition-colors text-sm"
                  >
                    {t.brand.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E5FAF7] dark:bg-emerald-950 flex items-center justify-center text-[#35C9B0] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#647087] dark:text-slate-400 block text-[11px] font-medium">{t.contact.addressLabel}</span>
                  <span className="font-medium text-[#172033] dark:text-white leading-relaxed block">
                    {t.brand.fullLocation}
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] dark:bg-purple-950 flex items-center justify-center text-[#6654E8] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#647087] dark:text-slate-400 block text-[11px] font-medium">{language === 'ta' ? 'பணி நேரம்' : 'Working Hours'}</span>
                  <span className="font-medium text-[#172033] dark:text-white">
                    {language === 'ta' ? 'திங்கள் – சனி: காலை 9:30 – இரவு 7:30 IST' : 'Monday – Saturday: 9:30 AM – 7:30 PM IST'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Box */}
          <div className="bg-[#E5FAF7] dark:bg-emerald-950/40 border border-[#35C9B0]/30 rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F766E] dark:text-emerald-300 font-semibold">
              <MessageSquare className="w-4 h-4 text-[#35C9B0]" />
              <span>{t.contact.whatsAppDirectLabel}</span>
            </div>
            <p className="text-[#0F766E] dark:text-emerald-300/80 leading-relaxed text-[11px]">
              {t.contact.whatsAppDirectDesc}
            </p>
            <a
              href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.contact.openWhatsAppBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Zero Spam Guarantee */}
          <div className="bg-white dark:bg-[#121829] border border-[#E5E9F2] dark:border-white/10 rounded-2xl p-5 text-xs text-[#647087] dark:text-slate-400 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6654E8] dark:text-[#9689FF] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#35C9B0]" />
              <span>{language === 'ta' ? 'பாதுகாப்பு & நம்பகத்தன்மை' : 'Zero-Spam Promise'}</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {language === 'ta'
                ? 'உங்கள் தொலைபேசி எண் மற்றும் மின்னஞ்சல் பாதுகாப்பாக பராமரிக்கப்படும். விளம்பர தொல்லைகள் இன்றி எங்கள் தொழில்நுட்ப வல்லுநர்களுடன் மட்டுமே நேரடியாக உரையாடுவீர்கள்.'
                : 'We do not share your contact information with external agencies or send unsolicited marketing emails. Every conversation is with a senior technology specialist.'}
            </p>
          </div>
        </div>

        {/* Right Column: Lead Capture Form */}
        <div className="lg:col-span-8">
          <LeadCaptureForm
            initialService={initialService}
            onNavigate={onNavigate}
            onNavigateToPrivacy={() => onNavigate('privacy-policy')}
          />
        </div>
      </div>
    </div>
  );
};
