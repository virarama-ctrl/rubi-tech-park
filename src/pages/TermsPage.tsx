import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider">
          <FileText className="w-4 h-4 text-[#00D4FF]" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          {t.footer.terms}
        </h1>
        <p className="text-xs text-slate-400">
          {language === 'ta'
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: அக்டோபர் 2026 · RUBI TECH PARK மென்பொருள் மேம்பாட்டு விதிமுறைகள்.'
            : 'Last revised: October 2026 · Standard terms governing technology development contracts with RUBI TECH PARK.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '1. வெளியிடப்பட்ட விலைகளின் தன்மை' : '1. Nature of Published Pricing'}
          </h2>
          <p>
            {language === 'ta'
              ? 'இந்த வலைத்தளத்தில் குறிப்பிடப்பட்டுள்ள அனைத்து விலைகளும் (வலைத்தளம் ₹5,000+, இ-காமர்ஸ் ₹15,000+, பிரத்யேக CRM ₹20,000+) தொடக்கநிலை உத்தேச மதிப்பீடுகளாகும். பக்கங்களின் எண்ணிக்கை, API தேவைகள் மற்றும் கூடுதல் அம்சங்களின் அடிப்படையில் இரு தரப்பினரும் கையொப்பமிடும் பணி ஒப்பந்தத்தில் இறுதி விலை உறுதி செய்யப்படும்.'
              : 'All price figures published on this website (including ₹5,000+ for business websites, ₹15,000+ for e-commerce, ₹20,000+ for custom CRM software, and ₹30,000+ for integrated solutions) are indicative starting baselines. Final binding project pricing is provided strictly through an itemized, written Scope of Work (SOW) agreement signed by both parties.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '2. வாடிக்கையாளர் குறியீடு உரிமை & ஒப்படைப்பு' : '2. Client Ownership & Deliverables Handover'}
          </h2>
          <p>
            {language === 'ta'
              ? 'திட்டத்தின் இறுதிக் கட்டணம் செலுத்தப்பட்டவுடன், மென்பொருளின் மூலக் குறியீடு (Source Code), தரவுத்தளம் மற்றும் டொமைன் நற்சான்றிதழ்கள் அனைத்தும் வாடிக்கையாளரிடம் முழுமையாக ஒப்படைக்கப்படும். எந்தவித தொடர் சந்தா கட்டணங்களும் இல்லை.'
              : 'Upon settlement of final project milestone payments, full intellectual property rights, source code repositories, deployment scripts, domain access, and operational documentation transfer entirely to the client. RUBI TECH PARK enforces zero recurring proprietary licensing fees for standard code deliverables.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '3. மூன்றாம் தரப்பு செலவுகள்' : '3. Third-Party Costs & Infrastructure'}
          </h2>
          <p>
            {language === 'ta'
              ? 'டொமைன் பெயர் பதிவு, கிளவுட் சர்வர் ஹோஸ்டிங், மற்றும் பணம் செலுத்தும் கேட்வே அல்லது வாட்ஸ்அப் வணிக API போன்ற மூன்றாம் தரப்பு கட்டணங்கள் வாடிக்கையாளரின் நேரடி பொறுப்பாகும்.'
              : 'Unless explicitly itemized as bundled within an approved SOW, client remains responsible for direct external costs: domain name registration, cloud hosting infrastructure, and paid third-party API consumption (WhatsApp Business API, payment gateway merchant fees).'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '4. மைல்கல் கட்டண முறை' : '4. Milestone Schedule & Payment Terms'}
          </h2>
          <p>
            {language === 'ta'
              ? 'திட்டங்களுக்கான கட்டணம் 3 மைல்கல் தவணைகளாகப் பிரிக்கப்படுகிறது: தொடக்க முன்பணம் 40%, ஸ்டேஜிங் ஒப்புதலின் போது 30%, மற்றும் இறுதி தயாரிப்பு வெளியீடு/டொமைன் ஒப்படைப்பின் போது 30%.'
              : 'Standard engagements are structured into milestones: Milestone 1 (40% Advance) for scope lock; Milestone 2 (30% Staging Approval) for working demo verification; Milestone 3 (30% Launch & Handover) for production deployment and code transfer.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '5. சட்டப்பூர்வ மற்றும் ஒழுங்குமுறை இணக்க சேவைகள் அறிவிப்பு' : '5. Statutory, Compliance & Regulatory Services Disclaimer'}
          </h2>
          <p>
            {language === 'ta'
              ? 'RUBI TECH PARK ஒரு தனியார் தொழில்நுட்ப மற்றும் ஆவண வசதி ஆலோசனை நிறுவனமாகும்; இது எந்தவொரு அரசு துறையையும் சாராதது. ஜிஎஸ்டி (GST), வருமான வரி (ITR), MSME, FSSAI, வர்த்தக முத்திரை (TM) மற்றும் பிற உரிமங்கள் தொடர்பான சேவைகள் வாடிக்கையாளரின் ஆவணங்களின் உண்மைத்தன்மை மற்றும் அரசின் விதிகளுக்கு உட்பட்டவை. ஒப்புதல் உத்தரவாதம் அளிக்கப்படாது. அரசு கட்டணங்கள் மற்றும் எங்கள் தொழில்முறை சேவை கட்டணங்கள் தனித்தனியானவை.'
              : 'RUBI TECH PARK operates as an independent private software consultancy and professional document facilitation agency. We are NOT a government department, ministry, or statutory authority. All statutory registrations (including GST, ITR, MSME/Udyam, FSSAI, Trademarks, Patents, and Trade Licences) are strictly subject to client eligibility, authentic documentation, and prevailing government regulations. Approval or grant of any licence is at the sole discretion of respective government authorities; no guaranteed approval is represented or implied. Official statutory fees levied by the government and professional facilitation fees are billed separately.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '6. குடிமக்கள் இ-சேவைகள் மற்றும் ₹236 முன்பதிவுக் கட்டண விதிமுறை' : '6. Citizen E-Services & ₹236 Initial Booking Deposit'}
          </h2>
          <p>
            {language === 'ta'
              ? 'அனைத்து குடிமக்கள் இ-சேவைகளுக்கும் (பான் கார்டு, வாக்காளர் அடையாள அட்டை, பாஸ்போர்ட், குடும்ப அட்டை, மின் இணைப்பு சேவைகள்), முன்பதிவு கட்டணமாக ₹236 (அடிப்படை கட்டணம் ₹200 + 18% ஜிஎஸ்டி ₹36) செலுத்த வேண்டும். மீதமுள்ள சேவை கட்டணங்கள் வாடிக்கையாளரின் தேவைகளை மதிப்பாய்வு செய்த பின்னர் தெரிவிக்கப்பட்டு பணி நிறைவடைந்த பின் வசூலிக்கப்படும்.'
              : 'For all citizen e-services (including PAN Card assistance, Voter ID, Passport application support, Ration Card assistance, and EB electricity connection support), the initial booking charge is ₹236 (₹200 base charge + 18% GST ₹36). The remaining service charges will be communicated after reviewing your specific requirements and collected strictly after completion of the work. Applicable statutory government fees and additional portal charges, if any, will be informed separately.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'ta' ? '7. சட்ட அதிகார வரம்பு' : '7. Jurisdiction & Dispute Resolution'}
          </h2>
          <p>
            {language === 'ta'
              ? 'RUBI TECH PARK உடன் மேற்கொள்ளப்படும் அனைத்து வணிக ஒப்பந்தங்களும் இந்திய குடியரசின் சட்டங்களுக்கு உட்பட்டவை. ஏதேனும் சட்ட சிக்கல்கள் ஏற்பட்டால் கோயம்புத்தூர், தமிழ்நாடு நீதிமன்றங்களின் பிரத்யேக அதிகார வரம்பிற்கு உட்பட்டது.'
              : 'Commercial agreements entered into with RUBI TECH PARK are governed by the laws of the Republic of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Coimbatore, Tamil Nadu.'}
          </p>
        </section>
      </div>
    </div>
  );
};
