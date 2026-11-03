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
        <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C2B40] text-[#182638] dark:text-[#F1F5F9] text-xs font-mono font-medium border border-[#D5DEE8] dark:border-[#30445B] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t.whatsApp.tooltip}
        </div>

        <button
          onClick={handleClick}
          aria-label={t.whatsApp.tooltip}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 border-2 border-emerald-400/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 cursor-pointer"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      </div>

      {/* Optional Direct Chat Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-[#182638] dark:text-[#F1F5F9]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315D82] cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                  {t.whatsApp.modalTitle}
                </h3>
                <p className="text-xs text-[#526477] dark:text-[#B8C5D4] font-mono">
                  +91 82205 50829
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#526477] dark:text-[#B8C5D4]">
              <div className="p-3 bg-[#F2F5F8] dark:bg-[#17263A] rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">{t.whatsApp.noticeTitle}</span>
                <p className="mt-1 text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                  {t.whatsApp.noticeText}
                </p>
              </div>

              <div className="p-2.5 bg-[#F2F5F8] dark:bg-[#17263A] rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mb-1">
                  {language === 'ta' ? 'முன்னமைக்கப்பட்ட செய்தி:' : 'Prefilled Message:'}
                </div>
                <div className="text-[11px] text-[#315D82] dark:text-[#6F9FC5] font-mono italic">&ldquo;{defaultMessage}&rdquo;</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-white hover:bg-[#F2F5F8] dark:hover:bg-[#17263A] transition-colors cursor-pointer active:scale-95"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close'}
                </button>
                <a
                  href={buildWhatsAppLink(whatsAppNumber, defaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
