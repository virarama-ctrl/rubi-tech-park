import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Repeat, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SubscriptionPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const SubscriptionPolicyPage: React.FC<SubscriptionPolicyPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isTa = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-[#182638] dark:text-[#F1F5F9]">
      <button
        onClick={() => onNavigate('home')}
        className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isTa ? 'முகப்பு பக்கத்திற்கு திரும்புக' : 'Return to Home'}</span>
      </button>

      <div className="space-y-3 pb-6 border-b border-[#D5DEE8] dark:border-[#30445B]">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
          <Repeat className="w-4 h-4" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
          {t.footer.subscriptionPolicy}
        </h1>
        <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
          {isTa
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: நவம்பர் 2026 · மாதாந்திர மற்றும் வருடாந்திர SaaS மென்பொருள் சந்தாக்கள் மற்றும் தானியங்கி புதுப்பித்தல் (AutoPay Mandate) விதிமுறைகள்.'
            : 'Last revised: November 2026 · Policy governing Monthly & Yearly Software Subscriptions, Explicit Auto-Renewal Consent, and RBI e-Mandate Notifications.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '1. சந்தா திட்டங்கள் & பில்லிங் சுழற்சி' : '1. Covered SaaS Plans & Billing Cycles'}
          </h2>
          <p>
            {isTa
              ? 'ரூபி டெக் பார்க் வழங்கும் Kuralvaani Voice Studio Pro, BulkMate Campaign Manager மற்றும் RUBI Business CRM Cloud ஆகிய கிளவுட் மென்பொருள் தயாரிப்புகளுக்கு மாதாந்திர (Monthly) மற்றும் வருடாந்திர (Yearly) சந்தா திட்டங்கள் வழங்கப்படுகின்றன. காட்டப்படும் அடிப்படை விலையுடன் 18% GST தனித்தனியாகக் கணக்கிடப்பட்டு செக்அவுட்டில் தெளிவாகக் காண்பிக்கப்படும்.'
              : 'RUBI TECH PARK offers transparent Monthly and Yearly subscription plans for cloud software products including Kuralvaani Voice Studio Pro, BulkMate Campaign Manager, and RUBI Business CRM Cloud. Base plan rates and 18% GST are itemized explicitly prior to checkout.'}
          </p>
        </section>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
            <ShieldAlert className="w-4 h-4" />
            <span>{isTa ? '2. தானியங்கி இலவச சோதனைக் கட்டணம் இல்லை (No Hidden Auto-Trial Billing)' : '2. No Automatic Free-Trial Conversion'}</span>
          </div>
          <p className="text-xs">
            {isTa
              ? 'ரூபி டெக் பார்க் எந்தவொரு பயனரிடமும் மறைமுகமான இலவச சோதனை முடிந்தவுடன் தானாகக் கட்டணம் வசூலிக்காது. செக்அவுட் பக்கத்தில் வாடிக்கையாளர் வெளிப்படையாக "தானியங்கி புதுப்பித்தல் ஒப்புதல்" (Auto-Renewal Consent) பெட்டியை டிக் செய்த பிறகே e-Mandate / UPI AutoPay செயல்படுத்தப்படும்.'
              : 'RUBI TECH PARK never enrolls customers into silent free-trial-to-paid traps. Every subscription checkout requires your affirmative check-box consent authorizing recurring monthly or yearly billing via Razorpay UPI AutoPay / Card e-Mandate.'}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '3. RBI e-Mandate & முன்கூட்டியே கட்டண அறிவிப்பு' : '3. RBI e-Mandate Compliance & Pre-Debit Alerts'}
          </h2>
          <p>
            {isTa
              ? 'இந்திய ரிசர்வ் வங்கி (RBI) வழிகாட்டுதல்களின்படி, தொடர் கட்டணம் கழிக்கப்படுவதற்கு குறைந்தது 24 மணி நேரத்திற்கு முன்பாக உங்கள் வங்கி / Razorpay வழியாக SMS அல்லது மின்னஞ்சல் மூலம் முன்கூட்டியே அறிவிப்பு (Pre-Debit Notification) அனுப்பப்படும்.'
              : 'In compliance with Reserve Bank of India (RBI) recurring payment frameworks, you will receive an advance Pre-Debit Notification via SMS/email from your issuing bank or Razorpay at least 24 hours prior to each scheduled recurring charge, along with an option to pause or revoke the mandate.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '4. கட்டணம் தோல்வி, இடைநிறுத்தம் & மறுமுயற்சி' : '4. Subscription Statuses, Failed Renewals & Retries'}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Active:</strong>{' '}
              {isTa
                ? 'தற்போதைய பில்லிங் சுழற்சியில் கட்டணம் செலுத்தப்பட்டு சேவை இயங்கிக் கொண்டிருக்கிறது.'
                : 'Current billing period settled; full SaaS workspace active.'}
            </li>
            <li>
              <strong>Pending / Paused:</strong>{' '}
              {isTa
                ? 'AutoPay அங்கீகாரம் அல்லது வங்கி மறுமுயற்சி நிலுவையில் உள்ளது.'
                : 'Awaiting mandate confirmation, manual renewal settlement, or temporarily paused.'}
            </li>
            <li>
              <strong>Failed / Halted:</strong>{' '}
              {isTa
                ? 'தொடர் கட்டணம் தோல்வியடைந்தால், தற்காலிக மறுமுயற்சிக்குப் பின் அணுகல் நிறுத்தப்படும்; தரவுகள் 30 நாட்களுக்குப் பாதுகாக்கப்படும்.'
                : 'If recurring debit fails across gateway retry attempts, the subscription transitions to Failed/Halted while preserving customer workspace data for 30 days for manual recovery.'}
            </li>
            <li>
              <strong>Cancelled:</strong>{' '}
              {isTa
                ? 'எதிர்கால புதுப்பித்தல்கள் நிரந்தரமாக நிறுத்தப்பட்டன.'
                : 'Auto-renewal stopped; no future recurring charges will be initiated.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '5. சந்தாவை மாற்றுதல் & ரத்து செய்தல்' : '5. Plan Changes & Self-Serve Cancellation'}
          </h2>
          <p>
            {isTa
              ? 'நீங்கள் எப்போது வேண்டுமானாலும் எங்கள் சந்தா பக்கத்திற்குச் சென்று உங்கள் சந்தா ஐடி மற்றும் மின்னஞ்சல் மூலம் திட்டத்தை மாற்றியமைக்கவோ (Upgrade/Downgrade) அல்லது தானியங்கி புதுப்பித்தலை ரத்து செய்யவோ முடியும்.'
              : 'You can inspect your current plan, view GST payment receipts, request Monthly/Yearly cycle changes, or cancel auto-renewal directly inside the Subscription Management Portal without contacting customer support.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('subscriptions')}
              className="px-4 py-2 rounded-xl cyber-button-primary text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTa ? 'சந்தா மேலாண்மை பக்கத்தைத் திற' : 'Open Subscriptions & Billing Portal'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
