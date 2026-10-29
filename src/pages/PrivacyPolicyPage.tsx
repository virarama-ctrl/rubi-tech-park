import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <button
        onClick={() => onNavigate('home')}
        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{language === 'ta' ? 'முகப்பு பக்கத்திற்கு திரும்புக' : 'Return to Home'}</span>
      </button>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          {t.footer.privacy}
        </h1>
        <p className="text-xs text-slate-400">
          {language === 'ta'
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: அக்டோபர் 2026 · தகவல் தொழில்நுட்ப சட்டம் 2000 & இந்திய தனிநபர் தரவு பாதுகாப்பு சட்டம் (DPDPA) இணக்கம்.'
            : 'Last updated: October 2026 · Compliant with the Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDPA), India.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '1. நாங்கள் சேகரிக்கும் தகவல்கள்' : '1. Information We Collect'}
          </h2>
          <p>
            {language === 'ta'
              ? 'RUBI TECH PARK வலைத்தளத்தில் நீங்கள் திட்ட விசாரணையைச் சமர்ப்பிக்கும்போது, வணிக மதிப்பீட்டு நோக்கங்களுக்காக நீங்கள் வெளிப்படையாக வழங்கும் தகவல்களை நாங்கள் சேகரிக்கிறோம்:'
              : 'When you submit an inquiry through the RUBI TECH PARK portal, we collect personal and commercial information you explicitly provide:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>{language === 'ta' ? 'உங்கள் முழுப் பெயர் மற்றும் நிறுவனத்தின் பெயர்' : 'Your full name and business/company identity'}</li>
            <li>{language === 'ta' ? 'மின்னஞ்சல் முகவரி மற்றும் 10 இலக்க இந்திய தொலைபேசி / வாட்ஸ்அப் எண்' : 'Your contact email address and 10-digit Indian telephone or WhatsApp number'}</li>
            <li>{language === 'ta' ? 'வணிகத் துறை, உத்தேச பட்ஜெட் வரம்பு மற்றும் திட்டத் தேவைகள்' : 'Your commercial sector, estimated budget range, and project scope requirements'}</li>
            <li>{language === 'ta' ? 'தொடர்புகொள்ள விரும்பும் முறை' : 'Preferred communication channel and optional inquiry notes'}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '2. தகவலைப் பயன்படுத்துவதன் நோக்கம்' : '2. Purpose of Data Processing'}
          </h2>
          <p>
            {language === 'ta'
              ? 'உங்கள் திட்டத்தின் சாத்தியக்கூறுகளை ஆய்வு செய்யவும், துல்லியமான மதிப்பீட்டு அறிக்கையைத் தயாரிக்கவும், வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் நேரடி தொடர்பை ஏற்படுத்தவும் மட்டுமே இந்தத் தகவல்கள் பயன்படுத்தப்படுகின்றன.'
              : 'We process your information exclusively for legitimate commercial evaluation purposes: to evaluate project feasibility, prepare a customized line-item quotation, and coordinate direct technical discussions.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '3. மூன்றாம் தரப்பினருக்கு விற்காத கொள்கை' : '3. Zero Third-Party Selling Policy'}
          </h2>
          <p>
            {language === 'ta'
              ? 'RUBI TECH PARK உங்கள் தொடர்பு தகவல்களையோ அல்லது திட்ட விபரங்களையோ விளம்பரதாரர்களுக்கோ அல்லது மூன்றாம் தரப்பு நிறுவனங்களுக்கோ ஒருபோதும் விற்பனை செய்வதோ, வாடகைக்கு விடுவதோ இல்லை.'
              : 'RUBI TECH PARK does not sell, rent, lease, trade, or monetize your contact information or project specifications to external advertisers, lead brokers, or marketing syndicates.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '4. தரவு பாதுகாப்பு & CRM சேமிப்பு' : '4. Data Security & CRM Storage'}
          </h2>
          <p>
            {language === 'ta'
              ? 'அனைத்து விசாரணைகளும் சர்வர் பக்க சரிபார்ப்புக்கு உட்படுத்தப்பட்டு, எங்களின் பாதுகாப்பான CRM தரவுத்தளத்தில் குறியாக்கம் செய்யப்பட்டு சேமிக்கப்படுகின்றன. அங்கீகரிக்கப்பட்ட நிர்வாகிகள் மட்டுமே இந்தத் தரவுகளை அணுக முடியும்.'
              : 'All inquiries are validated and stored in encrypted persistent database structures with server-enforced role-based access control, session authentication, and audit trails.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '5. தரவு நீக்கம் & தொடர்புக்கு' : '5. Data Retention & Contact'}
          </h2>
          <p>
            {language === 'ta'
              ? 'உங்கள் தகவல்களை நீக்கக் கோர விரும்பினால், எங்கள் அதிகாரப்பூர்வ மின்னஞ்சலுக்கு எழுதவும்: '
              : 'You have the right to request access to or deletion of your contact records at any time. To request data erasure, email us at '}
            <a href={`mailto:${t.brand.email}`} className="text-[#F3DC87] underline">
              {t.brand.email}
            </a>
            {language === 'ta' ? '. 72 மணி நேரத்திற்குள் கோரிக்கை நிறைவேற்றப்படும்.' : '. We will process your request within 72 business hours.'}
          </p>
        </section>
      </div>
    </div>
  );
};
