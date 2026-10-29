import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Phone, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#050811] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Regional Scope */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-sm bg-black shrink-0">
                <img
                  src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
                  alt="RUBI TECH PARK Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                RUBI <span className="gold-gradient-text font-semibold">TECH PARK</span>
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              {t.footer.description}
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{t.brand.fullLocation}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href={t.brand.phoneFormatted}
                  className="hover:text-[#F3DC87] transition-colors font-medium underline underline-offset-2"
                >
                  {t.brand.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href={`mailto:${t.brand.email}`}
                  className="hover:text-[#F3DC87] transition-colors underline underline-offset-2"
                >
                  {t.brand.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${t.brand.whatsAppNumber}?text=${encodeURIComponent(t.whatsApp.prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors underline underline-offset-2"
                >
                  {language === 'ta' ? 'வாட்ஸ்அப் நேரடி எண்: +91 82205 50829' : 'WhatsApp Direct: +91 82205 50829'}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">{t.footer.ownershipNote}</span>
              </div>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.solutionsHeading}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('service-business-websites')}
                  className="hover:text-[#F3DC87] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.businessWebsites.title} (₹5,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ecommerce')}
                  className="hover:text-[#F3DC87] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.ecommerce.title} (₹15,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-custom-crm')}
                  className="hover:text-[#F3DC87] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.customCrm.title} (₹20,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-crm-integration')}
                  className="hover:text-[#F3DC87] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.crmIntegration.title} (₹30,000+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ai-automation')}
                  className="hover:text-[#F3DC87] transition-colors text-left cursor-pointer"
                >
                  {t.services.items.aiAutomation.title} (₹25,000+)
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Agency Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.navHeading}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {language === 'ta' ? 'முகப்பு' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.header.services}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.header.pricing}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.header.work}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.header.about}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.header.contact}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checkout')} className="text-[#F3DC87] hover:underline transition-colors text-left cursor-pointer font-semibold flex items-center gap-1">
                  <span>{t.checkout.checkoutHeading}</span>
                  <span className="text-[10px] bg-[#D4AF37]/20 px-1.5 py-0.2 rounded border border-[#D4AF37]/40">UPI / Cards</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              {t.footer.legalHeading}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட திட்டங்கள்' : 'Verified Project Records'}</span>
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="hover:text-[#F3DC87] transition-colors text-left flex items-center gap-1 text-[11px] text-slate-400 pt-1 cursor-pointer"
                >
                  <span>{t.footer.adminCrm}</span>
                </button>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-emerald-400">{t.footer.crmActive}</span>
              <p className="mt-1 text-slate-400 leading-normal">
                {t.footer.crmActiveDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing disclaimer & copyright strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} RUBI TECH PARK. {t.footer.copyright}
          </p>
          <p className="text-slate-400 max-w-xl text-center md:text-right">
            {t.footer.pricingNote}
          </p>
        </div>
      </div>
    </footer>
  );
};
