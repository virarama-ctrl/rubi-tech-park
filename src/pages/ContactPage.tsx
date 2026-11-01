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
    <div className="relative futuristic-mesh-bg min-h-screen text-slate-900 dark:text-white transition-colors">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4FF]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/30 text-xs font-mono text-[#0284C7] dark:text-[#00D4FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
            <span>{t.header.contact}</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-[#8292AA]">·</span>
            <span>{t.brand.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            {t.contact.title}
          </h1>
          <p className="text-base text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels & Verified Contacts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="saas-card rounded-2xl p-6 sm:p-7 space-y-5 bg-white dark:bg-[#0B1530]/80 backdrop-blur-xl border border-slate-200 dark:border-[#00D4FF]/25 shadow-md dark:shadow-xl">
              <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF]" />
                <span>{t.contact.directChannels}</span>
              </h2>

              <div className="space-y-4 text-xs text-slate-600 dark:text-[#CBD5E1]">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-[#00D4FF]/10 border border-cyan-200 dark:border-[#00D4FF]/30 flex items-center justify-center text-[#0284C7] dark:text-[#00D4FF] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8292AA] block text-[11px] font-mono">{t.contact.phoneLabel}</span>
                    <a
                      href={t.brand.phoneFormatted}
                      className="font-semibold text-slate-900 dark:text-white hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-sm"
                    >
                      {t.brand.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#356BFF]/10 border border-blue-200 dark:border-[#356BFF]/30 flex items-center justify-center text-blue-600 dark:text-[#356BFF] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8292AA] block text-[11px] font-mono">{t.contact.emailLabel}</span>
                    <a
                      href={`mailto:${t.brand.email}`}
                      className="font-semibold text-slate-900 dark:text-white hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-sm"
                    >
                      {t.brand.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#00E5A3]/10 border border-emerald-200 dark:border-[#00E5A3]/30 flex items-center justify-center text-emerald-600 dark:text-[#00E5A3] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8292AA] block text-[11px] font-mono">{t.contact.addressLabel}</span>
                    <span className="font-medium text-slate-900 dark:text-white leading-relaxed block">
                      {t.brand.fullLocation}
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[#8057FF]/10 border border-purple-200 dark:border-[#8057FF]/30 flex items-center justify-center text-purple-600 dark:text-[#8057FF] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8292AA] block text-[11px] font-mono">{language === 'ta' ? 'பணி நேரம்' : 'Working Hours'}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {language === 'ta' ? 'திங்கள் – சனி: காலை 9:30 – இரவு 7:30 IST' : 'Monday – Saturday: 9:30 AM – 7:30 PM IST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#00D4FF]/15">
                <a
                  href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-[#00E5A3] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.contact.openWhatsAppBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Turnaround Transparency Pill Box */}
            <div className="p-4 bg-slate-50 dark:bg-[#0B1530]/60 border border-slate-200 dark:border-[#00D4FF]/20 rounded-2xl text-xs text-slate-700 dark:text-[#CBD5E1] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF]" />
                <span>Response Time SLA: &lt; 2 Hours</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8292AA] leading-relaxed">
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
