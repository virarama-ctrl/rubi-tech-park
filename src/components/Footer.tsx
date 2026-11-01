import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, ShieldCheck, ArrowRight, MessageSquare, CreditCard, Lock, Terminal, Activity, Cpu } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-slate-100 dark:bg-[#070B18] border-t border-slate-200 dark:border-[#00D4FF]/20 text-slate-600 dark:text-[#CBD5E1] text-sm transition-colors overflow-hidden">
      {/* Subtle Technical Grid Lines in Footer */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none -z-10" />

      {/* Top Ambient Glow */}
      <div 
        className="absolute top-0 left-1/3 w-96 h-32 bg-[#00D4FF]/10 blur-[100px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Regional Scope */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#0284C7]/30 dark:border-[#00D4FF]/40 shadow-sm bg-white dark:bg-[#070B18] shrink-0 flex items-center justify-center">
                <img
                  src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
                  alt="RUBI TECH PARK Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                RUBI <span className="text-[#0284C7] dark:text-[#00D4FF] font-extrabold">TECH PARK</span>
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-[#CBD5E1] leading-relaxed max-w-md text-xs sm:text-sm">
              {t.footer.description}
            </p>

            {/* System Status Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1530] border border-blue-200 dark:border-[#00D4FF]/20 text-xs font-mono text-[#0284C7] dark:text-[#00D4FF] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Mesh: Active · 99.99% Uptime</span>
            </div>

            <div className="pt-2 space-y-2.5 text-xs text-slate-600 dark:text-[#CBD5E1]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF] shrink-0 mt-0.5" />
                <span>{t.brand.fullLocation}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0284C7] dark:text-[#00D4FF] shrink-0" />
                <a 
                  href={t.brand.phoneFormatted}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors font-medium underline underline-offset-2"
                >
                  {t.brand.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00D4FF] shrink-0" />
                <a 
                  href={`mailto:${t.brand.email}`}
                  className="hover:text-[#00D4FF] transition-colors underline underline-offset-2"
                >
                  {t.brand.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#00E5A3] shrink-0" />
                <a
                  href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00E5A3] transition-colors underline underline-offset-2 font-medium"
                >
                  {language === 'ta' ? 'வாட்ஸ்அப் நேரடி எண்: +91 82205 50829' : 'WhatsApp Direct: +91 82205 50829'}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#00D4FF] shrink-0" />
                <span className="text-[#CBD5E1] font-medium">{t.footer.ownershipNote}</span>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00D4FF]" />
              <span>{t.footer.solutionsHeading}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#CBD5E1]">
              <li>
                <button
                  onClick={() => onNavigate('service-business-websites')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.businessWebsites.title} (₹5,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ecommerce')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.ecommerce.title} (₹15,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-custom-crm')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.customCrm.title} (₹20,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-crm-integration')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.crmIntegration.title} (₹10,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ai-automation')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.aiAutomation.title} (₹12,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors text-left cursor-pointer"
                >
                  {language === 'ta' ? 'தொழில்நுட்ப ஆலோசனை' : 'Technology Consultation'} (₹2,500+)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {t.footer.navHeading}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#CBD5E1]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'முகப்பு' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {t.header.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {t.header.pricing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {t.header.work}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {t.header.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
                >
                  {t.header.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer flex items-center gap-1.5 text-[#0284C7] dark:text-[#00D4FF] font-medium"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'மைல்கல் முன்பணம் செலுத்துங்கள்' : 'Milestone Advance Payment'}</span>
                </button>
              </li>
              {/* Discreet Admin Login Link */}
              <li className="pt-2 border-t border-slate-200 dark:border-[#00D4FF]/10">
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-xs text-slate-500 dark:text-[#8292AA] hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {t.footer.legalHeading}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#CBD5E1]">
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer text-left"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors cursor-pointer text-left"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 dark:text-[#8292AA] leading-relaxed">
                <span>{language === 'ta' ? 'அனைத்து வணிக விலைப்பட்டியல்களுக்கும் 18% ஜிஎஸ்டி மற்றும் வரி ரசீது பொருந்தும்.' : 'All commercial invoices are subject to 18% GST with official tax credit receipts.'}</span>
              </li>
              <li className="text-[11px] text-slate-500 dark:text-[#8292AA] leading-relaxed">
                <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட HDFC வணிகக் கணக்கு அல்லது அதிகாரப்பூர்வ UPI மூலம் மட்டுமே கொடுப்பனவுகள் ஏற்றுக்கொள்ளப்படும்.' : 'Settlements accepted strictly through authorized HDFC Bank corporate banking or verified UPI gateway.'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-14 pt-6 border-t border-slate-200 dark:border-[#00D4FF]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-[#8292AA] gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 RUBI TECH PARK. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#0284C7] dark:text-[#00D4FF]">Enterprise Software & Digital Infrastructure</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin-login')}
              className="hover:text-[#0284C7] dark:hover:text-[#00D4FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
            <span aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${t.brand.whatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-[#00E5A3] hover:underline"
            >
              Support: +91 82205 50829
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
