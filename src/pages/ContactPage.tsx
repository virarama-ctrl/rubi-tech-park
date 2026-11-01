import React from 'react';
import { PageRoute, RequiredService } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, MessageSquare, Clock, ShieldCheck, ArrowUpRight, Sparkles, Terminal } from 'lucide-react';

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
    <div className="relative min-h-screen bg-[#E9EEF3] dark:bg-[#101B2C] text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{t.header.contact}</span>
            <span aria-hidden="true" className="text-[#526477] dark:text-[#B8C5D4]">·</span>
            <span>{t.brand.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
            {t.contact.title}
          </h1>
          <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels & Verified Contacts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-sm">
              <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                <span>{t.contact.directChannels}</span>
              </h2>

              <div className="space-y-4 text-xs text-[#526477] dark:text-[#B8C5D4]">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#526477] dark:text-[#B8C5D4] block text-[11px] font-mono">{t.contact.phoneLabel}</span>
                    <a
                      href={t.brand.phoneFormatted}
                      className="font-semibold text-[#182638] dark:text-[#F1F5F9] hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-sm"
                    >
                      {t.brand.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#526477] dark:text-[#B8C5D4] block text-[11px] font-mono">{t.contact.emailLabel}</span>
                    <a
                      href={`mailto:${t.brand.email}`}
                      className="font-semibold text-[#182638] dark:text-[#F1F5F9] hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-sm"
                    >
                      {t.brand.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#526477] dark:text-[#B8C5D4] block text-[11px] font-mono">{t.contact.addressLabel}</span>
                    <span className="font-medium text-[#182638] dark:text-[#F1F5F9] leading-relaxed block">
                      {t.brand.fullLocation}
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#526477] dark:text-[#B8C5D4] block text-[11px] font-mono">{language === 'ta' ? 'பணி நேரம்' : 'Working Hours'}</span>
                    <span className="font-medium text-[#182638] dark:text-[#F1F5F9]">
                      {language === 'ta' ? 'திங்கள் – சனி: காலை 9:30 – இரவு 7:30 IST' : 'Monday – Saturday: 9:30 AM – 7:30 PM IST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
                <a
                  href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.contact.openWhatsAppBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Turnaround Transparency Pill Box */}
            <div className="p-4 bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl text-xs text-[#182638] dark:text-[#F1F5F9] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#182638] dark:text-[#F1F5F9]">
                <ShieldCheck className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                <span>Response Time SLA: &lt; 2 Hours</span>
              </div>
              <p className="text-[11px] text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {language === 'ta'
                  ? 'அனைத்து வணிக வினவல்களும் எங்கள் முதன்மை மென்பொருள் பொறியாளர்களால் மதிப்பாய்வு செய்யப்பட்டு 2 வணிக மணிநேரத்திற்குள் பதிலளிக்கப்படும்.'
                  : 'All architectural inquiries and compliance requests are triaged directly by senior engineering leads within 2 business hours.'}
              </p>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-8">
            <LeadCaptureForm
              initialCategory="general"
              onNavigateToPrivacy={() => onNavigate('privacy-policy')}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
