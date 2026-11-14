import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
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
          <Shield className="w-4 h-4" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
          {t.footer.privacy}
        </h1>
        <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
          {isTa
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: நவம்பர் 2026 · தகவல் தொழில்நுட்ப சட்டம் 2000 & இந்திய டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம் (DPDPA) இணக்கம்.'
            : 'Last updated: November 2026 · Compliant with the Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDPA), 2023 (India).'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '1. நாங்கள் சேகரிக்கும் தகவல்கள்' : '1. Information We Collect'}
          </h2>
          <p>
            {isTa
              ? 'ரூபி டெக் பார்க் வலைத்தளத்தில் நீங்கள் திட்ட விசாரணையைச் சமர்ப்பிக்கும்போது அல்லது ஆன்லைன் கட்டணம்/சந்தா பதிவு செய்யும்போது நீங்கள் வெளிப்படையாக வழங்கும் தகவல்களை நாங்கள் சேகரிக்கிறோம்:'
              : 'When you submit a service enquiry, book an e-service, or checkout for a software plan on RUBI TECH PARK, we collect personal and business information you explicitly provide:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>{isTa ? 'உங்கள் முழுப் பெயர் மற்றும் வணிகம் / நிறுவனத்தின் பெயர்' : 'Your full name and business or company name'}</li>
            <li>{isTa ? 'மின்னஞ்சல் முகவரி மற்றும் 10 இலக்க இந்திய தொலைபேசி / வாட்ஸ்அப் எண்' : 'Your contact email address and 10-digit Indian telephone or WhatsApp number'}</li>
            <li>{isTa ? 'தேர்ந்தெடுக்கப்பட்ட சேவை, திட்டத் தேவைகள் மற்றும் சந்தா சுழற்சி' : 'Selected service, project scope requirements, or chosen SaaS subscription plan'}</li>
            <li>{isTa ? 'வரி ரசீது & கணக்குத் தணிக்கைக்கான கட்டண ஆர்டர் குறிப்பு எண், Razorpay பேமெண்ட் ஐடி மற்றும் UTR எண்' : 'Order Reference IDs, Razorpay Payment/Subscription IDs, or bank UTR references strictly for GST invoicing and reconciliation'}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '2. கட்டணப் பாதுகாப்பு & Razorpay செயலாக்கம்' : '2. Payment Gateway Security & Non-Storage of Card Secrets'}
          </h2>
          <p>
            {isTa
              ? 'அனைத்து ஆன்லைன் கார்டு, நெட் பேங்கிங் மற்றும் UPI பரிவர்த்தனைகளும் RBI விதிகளுக்குட்பட்ட Razorpay போன்ற பாதுகாப்பான பேமெண்ட் கேட்வேக்கள் வழியாகச் செயல்படுத்தப்படுகின்றன. ரூபி டெக் பார்க் உங்கள் டெபிட்/கிரெடிட் கார்டு எண், CVV, OTP அல்லது UPI PIN ஆகியவற்றை ஒருபோதும் எங்கள் சர்வர்களில் சேமிப்பதில்லை.'
              : 'Online Card, NetBanking, UPI, and e-Mandate payments are processed securely through PCI-DSS compliant Indian payment gateway infrastructure (Razorpay). RUBI TECH PARK does NOT collect, process, or store your full card numbers, CVV, banking passwords, OTPs, or UPI PINs on our application servers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '3. தகவலைப் பயன்படுத்துவதன் நோக்கம் & மூன்றாம் தரப்பு கொள்கை' : '3. Purpose of Processing & Zero Data Selling Policy'}
          </h2>
          <p>
            {isTa
              ? 'உங்கள் தகவல்கள் சேவை மதிப்பீடு, கட்டண ரசீது உருவாக்கம், சந்தா மேலாண்மை மற்றும் வாடிக்கையாளர் ஆதரவுக்காக மட்டுமே பயன்படுத்தப்படுகின்றன. உங்கள் தரவுகளை விளம்பரதாரர்களுக்கோ தரகர்களுக்கோ ஒருபோதும் விற்பனை செய்வதில்லை.'
              : 'Your data is used strictly for service delivery, quotation preparation, GST billing, subscription lifecycle management, and requested WhatsApp/email support. RUBI TECH PARK never sells, rents, or trades customer data to advertisers, data brokers, or unrelated third parties.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '4. தரவு பாதுகாப்பு & CRM சேமிப்பு' : '4. Data Security & Encrypted Storage'}
          </h2>
          <p>
            {isTa
              ? 'அனைத்து விசாரணைகள் மற்றும் கட்டணப் பதிவுகள் Google Cloud Firestore மற்றும் பாதுகாப்பான சர்வர் தரவுத்தளங்களில் பங்கு அடிப்படையிலான அணுகல் கட்டுப்பாட்டுடன் (RBAC) சேமிக்கப்படுகின்றன.'
              : 'Customer inquiries, orders, and subscription logs are persisted in Google Cloud Firestore and server-side audit storage protected by strict role-based authentication and HTTPS/TLS encryption.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '5. தரவு அணுகல், திருத்தம் & நீக்கம்' : '5. Your Rights, Data Erasure & Grievance Contact'}
          </h2>
          <p>
            {isTa
              ? 'உங்கள் தனிப்பட்ட தகவல்களைப் பார்க்க, திருத்த அல்லது நீக்கக் கோர எங்கள் அதிகாரப்பூர்வ மின்னஞ்சலுக்கு எழுதவும்: '
              : 'You may request access, correction, or deletion of your personal records (subject to statutory tax/invoice retention requirements under Indian law) by emailing '}
            <a href={`mailto:${t.brand.email}`} className="text-[#315D82] dark:text-[#6F9FC5] font-semibold underline">
              {t.brand.email}
            </a>
            {isTa ? ' அல்லது +91 82205 50829 என்ற எண்ணில் தொடர்பு கொள்ளவும். 72 வணிக மணி நேரத்திற்குள் பதிலளிக்கப்படும்.' : ' or calling +91 82205 50829. Requests are processed within 72 business hours.'}
          </p>
        </section>
      </div>
    </div>
  );
};
