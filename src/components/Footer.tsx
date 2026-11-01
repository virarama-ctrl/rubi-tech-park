import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, ShieldCheck, CreditCard, Lock, Cpu } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-[#F2F5F8] dark:bg-[#101B2C] border-t border-[#D5DEE8] dark:border-[#30445B] text-[#526477] dark:text-[#B8C5D4] text-sm transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Regional Scope */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] shadow-xs bg-white dark:bg-[#1C2B40] shrink-0 flex items-center justify-center">
                <img
                  src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
                  alt="RUBI TECH PARK Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
                RUBI <span className="text-[#315D82] dark:text-[#6F9FC5] font-extrabold">TECH PARK</span>
              </span>
            </div>
            
            <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed max-w-md text-xs sm:text-sm">
              {t.footer.description}
            </p>

            {/* System Status Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <span>Production Mesh: Active · 99.99% Uptime</span>
            </div>

            <div className="pt-2 space-y-2.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                <span>{t.brand.fullLocation}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0" />
                <a 
                  href={t.brand.phoneFormatted}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors font-medium underline underline-offset-2"
                >
                  {t.brand.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0" />
                <a 
                  href={`mailto:${t.brand.email}`}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors underline underline-offset-2"
                >
                  {t.brand.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0 font-bold text-xs">
                  WA
                </div>
                <a
                  href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors underline underline-offset-2 font-medium"
                >
                  {language === 'ta' ? 'வாட்ஸ்அப் நேரடி எண்: +91 82205 50829' : 'WhatsApp Direct: +91 82205 50829'}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0" />
                <span className="text-[#526477] dark:text-[#B8C5D4] font-medium">{t.footer.ownershipNote}</span>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-bold text-[#182638] dark:text-[#F1F5F9] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
              <span>{t.footer.solutionsHeading}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
              <li>
                <button
                  onClick={() => onNavigate('service-business-websites')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.businessWebsites.title} (₹5,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ecommerce')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.ecommerce.title} (₹15,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-custom-crm')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.customCrm.title} (₹20,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-crm-integration')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.crmIntegration.title} (₹10,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ai-automation')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.aiAutomation.title} (₹12,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors text-left cursor-pointer"
                >
                  {language === 'ta' ? 'தொழில்நுட்ப ஆலோசனை' : 'Technology Consultation'} (₹2,500+)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold text-[#182638] dark:text-[#F1F5F9] uppercase tracking-wider mb-4">
              {t.footer.navHeading}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'முகப்பு' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {t.header.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {t.header.pricing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {t.header.work}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {t.header.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer"
                >
                  {t.header.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5] font-medium"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'மைல்கல் முன்பணம் செலுத்துங்கள்' : 'Milestone Advance Payment'}</span>
                </button>
              </li>
              {/* Discreet Admin Login Link */}
              <li className="pt-2 border-t border-[#D5DEE8] dark:border-[#30445B]">
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-xs text-[#526477] dark:text-[#B8C5D4] hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance Column */}
          <div>
            <h4 className="text-xs font-bold text-[#182638] dark:text-[#F1F5F9] uppercase tracking-wider mb-4">
              {t.footer.legalHeading}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#526477] dark:text-[#B8C5D4]">
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer text-left"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors cursor-pointer text-left"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li className="pt-2 text-[11px] text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                <span>{language === 'ta' ? 'அனைத்து வணிக விலைப்பட்டியல்களுக்கும் 18% ஜிஎஸ்டி மற்றும் வரி ரசீது பொருந்தும்.' : 'All commercial invoices are subject to 18% GST with official tax credit receipts.'}</span>
              </li>
              <li className="text-[11px] text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட HDFC வணிகக் கணக்கு அல்லது அதிகாரப்பூர்வ UPI மூலம் மட்டுமே கொடுப்பனவுகள் ஏற்றுக்கொள்ளப்படும்.' : 'Settlements accepted strictly through authorized HDFC Bank corporate banking or verified UPI gateway.'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-14 pt-6 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#526477] dark:text-[#B8C5D4] gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 RUBI TECH PARK. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#315D82] dark:text-[#6F9FC5]">Enterprise Software & Digital Infrastructure</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin-login')}
              className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
            <span aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${t.brand.whatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#315D82] dark:hover:text-[#6F9FC5] underline"
            >
              Support: +91 82205 50829
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
