import React from 'react';
import { PageRoute, RequiredService } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, MessageSquare, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <span>{t.header.contact}</span>
          <span aria-hidden="true">·</span>
          <span>{t.brand.name}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Channels & Verified Contacts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold font-display text-white">
              {t.contact.directChannels}
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{t.contact.phoneLabel}</span>
                  <a
                    href={t.brand.phoneFormatted}
                    className="font-medium text-white hover:text-[#F3DC87] transition-colors text-sm"
                  >
                    {t.brand.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{t.contact.emailLabel}</span>
                  <a
                    href={`mailto:${t.brand.email}`}
                    className="font-medium text-white hover:text-[#F3DC87] transition-colors"
                  >
                    {t.brand.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{t.contact.addressLabel}</span>
                  <span className="font-medium text-white leading-relaxed block">
                    {t.brand.fullLocation}
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block">{language === 'ta' ? 'பணி நேரம்' : 'Working Hours'}</span>
                  <span className="font-medium text-white">
                    {language === 'ta' ? 'திங்கள் – சனி: காலை 9:30 – இரவு 7:30 IST' : 'Monday – Saturday: 9:30 AM – 7:30 PM IST'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Box */}
          <div className="bg-[#070B14] border border-emerald-500/40 rounded-xl p-5 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <MessageSquare className="w-4 h-4" />
              <span>{t.contact.whatsAppDirectLabel}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {t.contact.whatsAppDirectDesc}
            </p>
            <a
              href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.contact.openWhatsAppBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Zero Spam Guarantee */}
          <div className="bg-[#070B14] border border-[#D4AF37]/25 rounded-xl p-5 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-[#E5C158] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ta' ? 'பாதுகாப்பு & நம்பகத்தன்மை' : 'Zero-Spam Promise'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
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
