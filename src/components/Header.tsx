import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ArrowUpRight, Globe, Sun, Moon } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#070B14]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Official RUBI TECH PARK Emblem Logo & Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-lg p-1 transition-all"
          aria-label="RUBI TECH PARK Home"
        >
          {/* Exact Official Uploaded Emblem */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-md shadow-amber-950/20 bg-black shrink-0 flex items-center justify-center group-hover:border-[#E5C158] transition-colors">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Emblem"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-white group-hover:text-[#F3DC87] transition-colors leading-tight">
              RUBI <span className="gold-gradient-text font-semibold">TECH PARK</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium hidden sm:block">
              {language === 'ta' ? 'கோயம்புத்தூர்' : 'Coimbatore, India'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav 
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.route ||
              (link.route === 'services' && currentRoute.startsWith('service-'));
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-[#F3DC87] border-[#D4AF37] font-semibold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bilingual Switcher, Theme Switcher & CTA */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Prominent Bilingual Language Switcher */}
          <div 
            className="flex items-center bg-[#0B132B] border border-[#D4AF37]/40 rounded-lg p-0.5 shadow-sm"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] text-[#070B14] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              aria-pressed={language === 'ta'}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] text-[#070B14] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
            className="p-2 rounded-lg border border-[#D4AF37]/40 bg-[#0B132B] text-slate-300 hover:text-[#F3DC87] hover:border-[#D4AF37] transition-all cursor-pointer flex items-center justify-center shadow-sm"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#F3DC87]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* Quick Pay / Checkout Link */}
          <button
            onClick={() => handleLinkClick('checkout')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              currentRoute === 'checkout'
                ? 'border-[#D4AF37] text-[#F3DC87] bg-[#D4AF37]/10'
                : 'border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            {t.checkout.checkoutHeading}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('contact')}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#070B14] bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] hover:from-[#FFF0BD] hover:to-[#E5C158] rounded-lg shadow-sm transition-all gold-border-focus whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>{t.header.ctaButton}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls (Language Switcher, Theme Switcher & Hamburger) */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-[#0B132B] border border-[#D4AF37]/40 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'ta'
                  ? 'bg-[#E5C158] text-[#070B14]'
                  : 'text-slate-300'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'en'
                  ? 'bg-[#E5C158] text-[#070B14]'
                  : 'text-slate-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-[#D4AF37]/40 bg-[#0B132B] text-slate-300 hover:text-white"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-[#F3DC87]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1020] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Mobile Language Toggle Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#E5C158]" />
              <span>{language === 'ta' ? 'மொழி தேர்வு / Language:' : 'Language / மொழி தேர்வு:'}</span>
            </span>
            <div className="flex items-center bg-[#070B14] border border-[#D4AF37]/50 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-3 py-1 font-semibold rounded text-xs ${
                  language === 'ta'
                    ? 'bg-[#E5C158] text-[#070B14]'
                    : 'text-slate-300'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 font-semibold rounded text-xs ${
                  language === 'en'
                    ? 'bg-[#E5C158] text-[#070B14]'
                    : 'text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#E5C158]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? t.theme.darkMode : t.theme.lightMode}</span>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 font-semibold rounded text-xs bg-[#070B14] border border-[#D4AF37]/50 text-[#F3DC87] flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.theme.switchToLight}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#F3DC87]" />
                  <span>{t.theme.switchToDark}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className="text-left py-2.5 px-3 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-[#101935]"
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Checkout Nav Link */}
            <button
              onClick={() => handleLinkClick('checkout')}
              className="text-left py-2.5 px-3 rounded-md text-base font-medium text-[#F3DC87] hover:bg-[#101935]"
            >
              {t.checkout.checkoutHeading}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full py-3 text-center text-sm font-semibold text-[#070B14] bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
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
