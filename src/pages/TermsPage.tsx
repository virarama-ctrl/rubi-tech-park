import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
          <FileText className="w-4 h-4" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
          {t.footer.terms}
        </h1>
        <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
          {isTa
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: நவம்பர் 2026 · ரூபி டெக் பார்க் (RUBI TECH PARK) சேவைகள் மற்றும் ஆன்லைன் கட்டணங்களுக்கான விதிமுறைகள்.'
            : 'Last revised: November 2026 · Standard terms governing technology services, digital compliance, software subscriptions, and online payments with RUBI TECH PARK.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '1. வெளியிடப்பட்ட விலைகளின் தன்மை' : '1. Nature of Published Pricing'}
          </h2>
          <p>
            {isTa
              ? 'இந்த வலைத்தளத்தில் குறிப்பிடப்பட்டுள்ள அனைத்து தனிப்பயன் திட்ட விலைகளும் (வலைத்தளம் ₹5,000+, இ-காமர்ஸ் ₹15,000+, பிரத்யேக CRM ₹20,000+) தொடக்கநிலை உத்தேச மதிப்பீடுகளாகும். பக்கங்களின் எண்ணிக்கை, API தேவைகள் மற்றும் கூடுதல் அம்சங்களின் அடிப்படையில் இரு தரப்பினரும் ஒப்புக்கொள்ளும் பணி ஒப்பந்தத்தில் இறுதி விலை உறுதி செய்யப்படும். அனைத்து வர்த்தகக் கட்டணங்களுக்கும் 18% GST பொருந்தும்.'
              : 'All custom development prices published on this website (including ₹5,000+ for business websites, ₹15,000+ for e-commerce, ₹20,000+ for custom CRM software, and ₹30,000+ for integrated solutions) are indicative starting baselines. Final binding project pricing is agreed through an itemized written Scope of Work (SOW). SaaS subscription plans carry fixed monthly/yearly rates plus 18% GST as itemized at checkout.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '2. வாடிக்கையாளர் குறியீடு உரிமை & ஒப்படைப்பு' : '2. Client Ownership & Deliverables Handover'}
          </h2>
          <p>
            {isTa
              ? 'தனிப்பயன் திட்டத்தின் இறுதிக் கட்டணம் செலுத்தப்பட்டவுடன், மென்பொருளின் மூலக் குறியீடு (Source Code), தரவுத்தளம் மற்றும் டொமைன் நற்சான்றிதழ்கள் அனைத்தும் வாடிக்கையாளரிடம் முழுமையாக ஒப்படைக்கப்படும்.'
              : 'Upon settlement of final custom project milestone payments, full intellectual property rights, source code repositories, deployment scripts, and domain credentials transfer entirely to the client. Recurring licensing fees apply only if the customer explicitly subscribes to hosted RUBI TECH PARK SaaS software products.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '3. மூன்றாம் தரப்பு செலவுகள் & கட்டண முறை' : '3. Third-Party Costs & Authorized Payment Channels'}
          </h2>
          <p>
            {isTa
              ? 'டொமைன் பெயர் பதிவு, கிளவுட் சர்வர் ஹோஸ்டிங் மற்றும் மூன்றாம் தரப்பு API கட்டணங்கள் பணி ஒப்பந்தத்தில் சேர்க்கப்பட்டாலன்றி வாடிக்கையாளரின் பொறுப்பாகும். அனைத்து ஆன்லைன் கட்டணங்களும் அங்கீகரிக்கப்பட்ட Razorpay பேமெண்ட் கேட்வே அல்லது அதிகாரப்பூர்வ வணிக UPI முகவரி (rubienterprisesgst-1@okhdfcbank) வழியாக மட்டுமே செலுத்தப்பட வேண்டும்.'
              : 'Unless explicitly bundled in an approved SOW, clients remain responsible for domain registration, third-party cloud hosting, and external API usage costs. Online settlements are accepted strictly through our authorized Razorpay gateway checkout or verified HDFC business UPI handle.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '4. மைல்கல் கட்டண முறை & SaaS சந்தா' : '4. Milestone Payments & SaaS Subscriptions'}
          </h2>
          <p>
            {isTa
              ? 'தனிப்பயன் மென்பொருள் திட்டங்களுக்கான கட்டணம் மைல்கல் தவணைகளாகப் பிரிக்கப்படுகிறது: தொடக்க முன்பணம் 40%, ஸ்டேஜிங் ஒப்புதலின் போது 30%, மற்றும் இறுதி வெளியீட்டின் போது 30%. SaaS சந்தா திட்டங்கள் வாடிக்கையாளரின் வெளிப்படையான AutoPay ஒப்புதலுடன் மாதாந்திர அல்லது வருடாந்திர சுழற்சியில் செயல்படும்.'
              : 'Custom engagements are structured into milestones: Milestone 1 (40% Advance), Milestone 2 (30% Staging Approval), and Milestone 3 (30% Production Launch). Hosted SaaS subscriptions are governed by the Subscription & Auto-Renewal Policy and require explicit customer consent prior to mandate activation.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '5. சட்டப்பூர்வ & ஒழுங்குமுறை இணக்க சேவைகள் அறிவிப்பு' : '5. Statutory, Compliance & Regulatory Services Disclaimer'}
          </h2>
          <p>
            {isTa
              ? 'ரூபி டெக் பார்க் ஒரு தனியார் தொழில்நுட்ப மற்றும் ஆவண வசதி ஆலோசனை நிறுவனமாகும்; இது எந்தவொரு அரசு துறையையும் சாராதது. ஜிஎஸ்டி (GST), வருமான வரி (ITR), MSME, FSSAI, வர்த்தக முத்திரை (TM) மற்றும் பிற உரிமங்கள் வாடிக்கையாளரின் ஆவண உண்மைத்தன்மை மற்றும் அரசு விதிகளுக்கு உட்பட்டவை. ஒப்புதல் உத்தரவாதம் அளிக்கப்படாது. அரசு கட்டணங்கள் மற்றும் சேவைக் கட்டணங்கள் தனித்தனியானவை.'
              : 'RUBI TECH PARK operates as an independent private software consultancy and document facilitation agency. We are NOT a government department, ministry, or statutory authority. All statutory registrations (GST, ITR, MSME/Udyam, FSSAI, BIS, Trademarks, Patents, and Trade Licences) depend on applicant eligibility, authentic documentation, and prevailing government rules. Official approval is at the sole discretion of respective authorities; no guaranteed approval is represented. Government fees and facilitation charges are billed separately.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '6. குடிமக்கள் இ-சேவைகள் & ₹236 முன்பதிவுக் கட்டணம்' : '6. Citizen E-Services & ₹236 Initial Booking Deposit'}
          </h2>
          <p>
            {isTa
              ? 'அனைத்து குடிமக்கள் இ-சேவைகளுக்கும் (பான் கார்டு, வாக்காளர் அட்டை, பாஸ்போர்ட், குடும்ப அட்டை, மின் இணைப்பு), ஆரம்ப முன்பதிவுக் கட்டணம் ₹236 (₹200 + 18% GST ₹36) ஆகும். மீதமுள்ள சேவைக் கட்டணங்கள் தேவைகளை மதிப்பாய்வு செய்த பின் தெரிவிக்கப்பட்டு பணி நிறைவடைந்த பின் வசூலிக்கப்படும். பொருந்தக்கூடிய அரசு கட்டணங்கள் தனித்தனியாகத் தெரிவிக்கப்படும்.'
              : 'For all citizen e-services (PAN Card assistance, Voter ID, Passport assistance, Ration Card assistance, and EB services), the initial booking charge is ₹236 (₹200 base charge + 18% GST ₹36). The remaining service charges will be communicated after reviewing your specific requirements and collected after completion of the work. Applicable government fees and portal charges, if any, will be informed separately.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '7. தொடர்புடைய கொள்கைகள் & சட்ட அதிகார வரம்பு' : '7. Related Policies & Jurisdiction'}
          </h2>
          <p>
            {isTa
              ? 'இவ்விதிமுறைகள் ரத்து & பணத்தைத் திரும்பப் பெறும் கொள்கை, சேவை வழங்கல் கொள்கை மற்றும் சந்தா கொள்கையுடன் இணைந்து செயல்படுகின்றன. அனைத்து வணிக ஒப்பந்தங்களும் இந்திய சட்டங்களுக்கு உட்பட்டவை; சட்ட சிக்கல்கள் கோயம்புத்தூர், தமிழ்நாடு நீதிமன்றங்களின் பிரத்யேக அதிகார வரம்பிற்கு உட்பட்டது.'
              : 'These Terms incorporate our Privacy Policy, Cancellation & Refund Policy, Service Delivery Policy, and Subscription & Auto-Renewal Policy. Agreements with RUBI TECH PARK are governed by the laws of the Republic of India, subject to the exclusive jurisdiction of competent courts in Coimbatore, Tamil Nadu.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            <button onClick={() => onNavigate('refund-policy')} className="text-[#315D82] dark:text-[#6F9FC5] font-semibold hover:underline cursor-pointer">
              {t.footer.refundPolicy}
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('service-delivery-policy')} className="text-[#315D82] dark:text-[#6F9FC5] font-semibold hover:underline cursor-pointer">
              {t.footer.deliveryPolicy}
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('subscription-policy')} className="text-[#315D82] dark:text-[#6F9FC5] font-semibold hover:underline cursor-pointer">
              {t.footer.subscriptionPolicy}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
