import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Home, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0B1530] border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] mx-auto shadow-[0_0_25px_rgba(0,212,255,0.15)]">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider">
          {language === 'ta' ? 'பிழை 404 · பக்கம் கிடைக்கவில்லை' : 'Error 404 · Page Not Found'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          {language === 'ta' ? 'கோரப்பட்ட பக்கம் கிடைக்கவில்லை' : 'The Requested Resource Does Not Exist'}
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {language === 'ta'
            ? 'நீங்கள் அணுக முயன்ற பக்கம் மாற்றப்பட்டிருக்கலாம் அல்லது கிடைக்கவில்லை. முகப்புப் பக்கத்திற்குத் திரும்ப கீழே உள்ள பொத்தானைப் பயன்படுத்தவும்.'
            : 'The page or route you followed could not be found. Please check the URL or use the navigation below to return to verified sections.'}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="cyber-button-primary px-6 py-3 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer text-white"
        >
          <Home className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்பு பக்கத்திற்கு செல்ல' : 'Return to Home'}</span>
        </button>

        <button
          onClick={() => onNavigate('services')}
          className="cyber-button-secondary px-5 py-3 text-xs font-medium text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          {t.header.services}
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="cyber-button-secondary px-5 py-3 text-xs font-medium text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          {t.header.contact}
        </button>
      </div>
    </div>
  );
};
