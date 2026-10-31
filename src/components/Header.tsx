import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ArrowUpRight, Globe, Sun, Moon, CreditCard } from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: t.header.services, route: 'services' },
    { label: t.header.pricing, route: 'pricing' },
    { label: t.header.work, route: 'portfolio' },
    { label: t.header.about, route: 'about' },
    { label: t.header.contact, route: 'contact' },
  ];

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#E5E9F2] dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Official RUBI TECH PARK Emblem Logo & Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6654E8]/40 rounded-xl p-1 transition-all"
          aria-label="RUBI TECH PARK Home"
        >
          {/* Exact Official Uploaded Emblem */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md bg-black shrink-0 flex items-center justify-center group-hover:border-[#6654E8] transition-colors">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Emblem"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          <div className="flex flex-col shrink-0">
            <span className="text-base sm:text-lg font-bold font-display tracking-tight text-[#172033] dark:text-white leading-none whitespace-nowrap">
              RUBI <span className="text-[#6654E8] dark:text-[#9689FF] font-extrabold">TECH PARK</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#647087] dark:text-slate-400 font-semibold hidden sm:block whitespace-nowrap mt-1">
              {language === 'ta' ? 'மென்பொருள் & கிளவுட் தீர்வுகள்' : 'Enterprise Software & Cloud'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav 
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium shrink-0"
        >
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.route ||
              (link.route === 'services' && currentRoute.startsWith('service-'));
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer font-medium ${
                  isActive
                    ? 'text-[#6654E8] dark:text-[#9689FF] border-[#6654E8] dark:border-[#9689FF] font-semibold'
                    : 'text-[#647087] hover:text-[#172033] dark:text-slate-300 dark:hover:text-white border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bilingual Switcher, Theme Switcher & Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Prominent Bilingual Language Switcher */}
          <div 
            className="flex items-center bg-[#F3F0FF] dark:bg-[#172038] border border-[#E5E9F2] dark:border-white/10 rounded-lg p-0.5 shadow-xs"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-[#6654E8] text-white shadow-xs'
                  : 'text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white'
              }`}
              aria-pressed={language === 'ta'}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#6654E8] text-white shadow-xs'
                  : 'text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white'
              }`}
              aria-pressed={language === 'en'}
            >
              English
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#E5E9F2] dark:border-white/10 bg-white dark:bg-[#172038] text-[#647087] dark:text-slate-300 hover:text-[#6654E8] dark:hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#6654E8]" />
            )}
          </button>

          {/* Online Payments / Checkout CTA */}
          <button
            onClick={() => handleLinkClick('checkout')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              currentRoute === 'checkout'
                ? 'border-[#6654E8] text-[#6654E8] bg-[#F3F0FF] dark:bg-[#6654E8]/20'
                : 'border-[#E5E9F2] dark:border-white/10 text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:border-[#6654E8]/40 bg-white dark:bg-[#172038]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#35C9B0]" />
            <span>{t.checkout.checkoutHeading}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('contact')}
            className="px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg brand-gradient-button whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.header.ctaButton}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls (Language Switcher, Theme Switcher & Hamburger) */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-[#F3F0FF] dark:bg-[#172038] border border-[#E5E9F2] dark:border-white/10 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'ta'
                  ? 'bg-[#6654E8] text-white'
                  : 'text-[#647087] dark:text-slate-300'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'en'
                  ? 'bg-[#6654E8] text-white'
                  : 'text-[#647087] dark:text-slate-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-[#E5E9F2] dark:border-white/10 bg-white dark:bg-[#172038] text-[#647087] dark:text-slate-300"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#6654E8]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#647087] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white border border-[#E5E9F2] dark:border-white/10 bg-white dark:bg-[#172038]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-[#0B0F19]/98 border-b border-[#E5E9F2] dark:border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentRoute === link.route
                    ? 'bg-[#F3F0FF] dark:bg-[#6654E8]/20 text-[#6654E8] dark:text-[#9689FF] font-semibold'
                    : 'text-[#647087] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#E5E9F2] dark:border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('checkout')}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg border border-[#E5E9F2] dark:border-white/10 text-[#172033] dark:text-white flex items-center justify-center gap-2 bg-[#FAFBFF] dark:bg-[#121829]"
            >
              <CreditCard className="w-4 h-4 text-[#35C9B0]" />
              <span>{t.checkout.checkoutHeading} (UPI / Cards / Net Banking)</span>
            </button>

            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg brand-gradient-button flex items-center justify-center gap-2"
            >
              <span>{t.header.ctaButton}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
