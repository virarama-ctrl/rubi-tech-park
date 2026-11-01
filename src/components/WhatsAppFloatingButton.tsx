import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { buildWhatsAppLink } from '../utils/validation';

export const WhatsAppFloatingButton: React.FC = () => {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const whatsAppNumber = t.brand.whatsAppNumber;
  const defaultMessage = t.whatsApp.prefilledMessage;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = buildWhatsAppLink(whatsAppNumber, defaultMessage);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center group">
        {/* Tooltip */}
        <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-md bg-[#070B18]/95 text-[#CBD5E1] text-xs font-mono font-medium border border-[#00D4FF]/30 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t.whatsApp.tooltip}
        </div>

        <button
          onClick={handleClick}
          aria-label={t.whatsApp.tooltip}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-emerald-400/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      </div>

      {/* Optional Direct Chat Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B1530] border border-[#00D4FF]/30 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  {t.whatsApp.modalTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  +91 82205 50829
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-300">
              <div className="p-3 bg-[#070B14] rounded-lg border border-slate-800">
                <span className="font-semibold text-white">{t.whatsApp.noticeTitle}</span>
                <p className="mt-1 text-slate-400 leading-relaxed">
                  {t.whatsApp.noticeText}
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">
                  {language === 'ta' ? 'முன்னமைக்கப்பட்ட செய்தி:' : 'Prefilled Message:'}
                </div>
                <div className="text-[11px] text-[#00D4FF] font-mono italic">"{defaultMessage}"</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close'}
                </button>
                <a
                  href={buildWhatsAppLink(whatsAppNumber, defaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.whatsApp.directChatAction}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
