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
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#070B18]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#00D4FF]/15 transition-colors shadow-xs dark:shadow-lg dark:shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Official RUBI TECH PARK Emblem Logo & Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group shrink-0 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40 rounded-xl p-1 transition-all cursor-pointer"
          aria-label="RUBI TECH PARK Home"
        >
          {/* Official Uploaded Emblem with Cybernetic Frame */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-blue-200 dark:border-[#00D4FF]/40 shadow-xs bg-white dark:bg-[#070B18] shrink-0 flex items-center justify-center group-hover:border-[#0284C7] dark:group-hover:border-[#00D4FF] group-hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-all">
            <img
              src="/assets/aistudio/Ruby_Tech_Park_Luxury_Emblem_3b5d2b3d.png"
              alt="RUBI TECH PARK Emblem"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          <div className="flex flex-col shrink-0">
            <span className="text-base sm:text-lg font-bold font-display tracking-tight text-[#0B1530] dark:text-white leading-none whitespace-nowrap">
              RUBI <span className="text-[#0284C7] dark:text-[#00D4FF] font-extrabold">TECH PARK</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#475569] dark:text-[#CBD5E1] font-semibold hidden sm:flex items-center gap-1.5 whitespace-nowrap mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] dark:bg-[#00D4FF] animate-pulse" />
              <span>{language === 'ta' ? 'அதிநவீன மென்பொருள் & கிளவுட்' : 'Advanced Software & Cloud Systems'}</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav 
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-7 text-sm font-medium shrink-0"
        >
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.route ||
              (link.route === 'services' && currentRoute.startsWith('service-'));
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer font-medium ${
                  isActive
                    ? 'text-[#0284C7] dark:text-[#00D4FF] border-[#0284C7] dark:border-[#00D4FF] font-semibold drop-shadow-[0_0_8px_rgba(2,132,199,0.2)] dark:drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0B1530] dark:hover:text-white hover:border-[#0284C7]/40 dark:hover:border-[#00D4FF]/40 border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bilingual Switcher, Theme Switcher & Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Bilingual Language Switcher */}
          <div 
            className="flex items-center bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/20 rounded-lg p-0.5 shadow-inner"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#2563EB] text-white shadow-xs'
                  : 'text-[#475569] dark:text-[#CBD5E1] hover:text-[#0B1530] dark:hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#2563EB] text-white shadow-xs'
                  : 'text-[#475569] dark:text-[#CBD5E1] hover:text-[#0B1530] dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-[#00D4FF]/20 bg-slate-100 dark:bg-[#0B1530] text-[#334155] dark:text-[#CBD5E1] hover:text-[#0284C7] dark:hover:text-[#00D4FF] hover:border-[#0284C7]/50 dark:hover:border-[#00D4FF]/50 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#2563EB]" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('contact')}
            className="px-4 py-2 text-xs font-semibold rounded-xl brand-gradient-button flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>{t.home.primaryCta}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls: Language & Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0B1530] border border-slate-200 dark:border-[#00D4FF]/20 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'ta'
                  ? 'bg-[#0284C7] dark:bg-[#00D4FF] text-white dark:text-[#070B18] font-bold'
                  : 'text-[#475569] dark:text-[#CBD5E1]'
              }`}
            >
              த
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                language === 'en'
                  ? 'bg-[#0284C7] dark:bg-[#00D4FF] text-white dark:text-[#070B18] font-bold'
                  : 'text-[#475569] dark:text-[#CBD5E1]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-slate-200 dark:border-[#00D4FF]/20 bg-slate-100 dark:bg-[#0B1530] text-[#334155] dark:text-[#CBD5E1]"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#2563EB]" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#334155] dark:text-[#CBD5E1] hover:text-[#0B1530] dark:hover:text-white border border-slate-200 dark:border-[#00D4FF]/20 bg-slate-100 dark:bg-[#0B1530]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0284C7] dark:text-[#00D4FF]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-[#070B18]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-[#00D4FF]/20 px-4 pt-3 pb-6 space-y-3 shadow-xl dark:shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.route ||
                (link.route === 'services' && currentRoute.startsWith('service-'));
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                    isActive
                      ? 'bg-blue-50 dark:bg-[#0B1530] text-[#0284C7] dark:text-[#00D4FF] border border-blue-200 dark:border-[#00D4FF]/30 font-semibold'
                      : 'text-[#334155] dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#0B1530]/50 hover:text-[#0B1530] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-200 dark:border-[#00D4FF]/15 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg brand-gradient-button flex items-center justify-center gap-2"
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
