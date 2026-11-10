import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ArrowUpRight, Globe, Sun, Moon, CreditCard, Terminal } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 dark:bg-[#101B2C]/95 backdrop-blur-md border-b border-[#D5DEE8] dark:border-[#30445B] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Zone 1: Official RUBI TECH PARK Emblem Logo & Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2 sm:gap-3 text-left group shrink min-w-0 focus:outline-none focus:ring-2 focus:ring-[#315D82]/30 dark:focus:ring-[#6F9FC5]/30 rounded-xl p-0.5 sm:p-1 transition-all cursor-pointer"
          aria-label="RUBI TECH PARK Home"
        >
          {/* Official Emblem Frame */}
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden border border-[#D5DEE8] dark:border-[#30445B] shadow-xs bg-white dark:bg-[#17263A] shrink-0 flex items-center justify-center group-hover:border-[#315D82] dark:group-hover:border-[#6F9FC5] transition-all">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Emblem"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-lg font-bold font-display tracking-tight text-[#182638] dark:text-[#F1F5F9] leading-none truncate">
              {language === 'ta' ? (
                <>ரூபி <span className="text-[#315D82] dark:text-[#6F9FC5] font-extrabold">டெக் பார்க்</span></>
              ) : (
                <>RUBI <span className="text-[#315D82] dark:text-[#6F9FC5] font-extrabold">TECH PARK</span></>
              )}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#526477] dark:text-[#B8C5D4] font-medium hidden sm:flex items-center gap-1.5 whitespace-nowrap mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />
              <span>{language === 'ta' ? 'அதிநவீன மென்பொருள் & கிளவுட்' : 'Advanced Software & Cloud Systems'}</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav 
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-1 text-sm font-medium shrink-0"
        >
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.route ||
              (link.route === 'services' && currentRoute.startsWith('service-'));
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2 active:scale-95 group ${
                  isActive
                    ? 'text-[#315D82] dark:text-[#6F9FC5] bg-[#315D82]/10 dark:bg-[#6F9FC5]/15 font-semibold shadow-2xs'
                    : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9] hover:bg-[#315D82]/5 dark:hover:bg-[#6F9FC5]/10 font-medium'
                }`}
              >
                <span>{link.label}</span>
                {/* Refined Accent Underline Indicator */}
                {isActive ? (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5] shadow-[0_0_8px_rgba(111,159,197,0.6)]" />
                ) : (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#315D82]/40 dark:bg-[#6F9FC5]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bilingual Switcher, Theme Switcher & Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Bilingual Language Switcher */}
          <div 
            className="flex items-center bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg p-0.5 shadow-xs"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] ${
                language === 'ta'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                  : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9] hover:bg-[#315D82]/10 dark:hover:bg-[#6F9FC5]/10'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] ${
                language === 'en'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                  : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9] hover:bg-[#315D82]/10 dark:hover:bg-[#6F9FC5]/10'
              }`}
            >
              English
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-[#526477] dark:text-[#B8C5D4] hover:text-[#315D82] dark:hover:text-[#6F9FC5] hover:border-[#315D82]/50 dark:hover:border-[#6F9FC5]/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] dark:focus-visible:ring-[#6F9FC5] focus-visible:ring-offset-2"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#315D82] transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('contact')}
            className="px-4 py-2 text-xs font-semibold rounded-xl cyber-button-primary flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all group"
          >
            <span>{t.home.primaryCta}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Controls: Language & Menu Toggle */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded active:scale-95 transition-all ${
                language === 'ta'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white font-bold'
                  : 'text-[#526477] dark:text-[#B8C5D4]'
              }`}
            >
              த
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded active:scale-95 transition-all ${
                language === 'en'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white font-bold'
                  : 'text-[#526477] dark:text-[#B8C5D4]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-[#526477] dark:text-[#B8C5D4] active:scale-90 transition-transform"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#315D82]" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9] border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#101B2C] border-b border-[#D5DEE8] dark:border-[#30445B] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.route ||
                (link.route === 'services' && currentRoute.startsWith('service-'));
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 font-medium active:scale-98 flex items-center justify-between ${
                    isActive
                      ? 'bg-[#315D82]/10 dark:bg-[#6F9FC5]/15 text-[#315D82] dark:text-[#6F9FC5] border border-[#315D82]/20 dark:border-[#6F9FC5]/30 font-semibold shadow-2xs'
                      : 'text-[#526477] dark:text-[#B8C5D4] hover:bg-[#F2F5F8] dark:hover:bg-[#17263A] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#315D82] dark:bg-[#6F9FC5]" />}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#D5DEE8] dark:border-[#30445B] flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl cyber-button-primary flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
            >
              <span>{t.home.primaryCta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
