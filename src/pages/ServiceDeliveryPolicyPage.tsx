import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Truck, Clock, CheckCircle2 } from 'lucide-react';

interface ServiceDeliveryPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ServiceDeliveryPolicyPage: React.FC<ServiceDeliveryPolicyPageProps> = ({ onNavigate }) => {
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
          <Truck className="w-4 h-4" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
          {t.footer.deliveryPolicy}
        </h1>
        <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
          {isTa
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: நவம்பர் 2026 · ரூபி டெக் பார்க் டிஜிட்டல் சேவைகள், மென்பொருள் மற்றும் இணக்கப் பணிகளுக்கான சேவை வழங்கல் கொள்கை.'
            : 'Last revised: November 2026 · Digital Service Fulfillment & Delivery Policy for RUBI TECH PARK SaaS Subscriptions, Custom Software, and Compliance Facilitation.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {isTa
              ? 'ரூபி டெக் பார்க் 100% டிஜிட்டல் மென்பொருள் மற்றும் ஆன்லைன் ஆவண வசதி சேவைகளை மட்டுமே வழங்குகிறது. எந்தவொரு பௌதீக (Physical/Courier) பொருட்களும் அனுப்பப்படுவதில்லை; அனைத்து சேவைகளும் மின்னஞ்சல், கிளவுட் டேஷ்போர்டு அல்லது வாட்ஸ்அப் வழியாக டிஜிட்டல் முறையில் வழங்கப்படுகின்றன.'
              : 'RUBI TECH PARK delivers software systems, cloud subscriptions, and digital documentation facilitation exclusively through electronic channels (cloud dashboards, email credentials, source repositories, and digital filing receipts). No physical shipping or courier dispatch applies.'}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '1. SaaS மென்பொருள் சந்தா செயல்படுத்தும் நேரம்' : '1. SaaS & Software Subscription Activation Timelines'}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              {isTa
                ? 'ஆன்லைன் பேமெண்ட் கேட்வே (Razorpay / UPI AutoPay) மூலம் கட்டணம் உறுதி செய்யப்பட்ட 15 நிமிடங்கள் முதல் 2 மணி நேரத்திற்குள் சந்தா கணக்கு மற்றும் உரிம அணுகல் செயல்படுத்தப்படும்.'
                : 'Instant / Gateway Confirmed Payments: Subscription workspace access for Kuralvaani Voice Studio, BulkMate, and RUBI Business CRM Cloud is provisioned within 15 minutes to 2 business hours after payment confirmation.'}
            </li>
            <li>
              {isTa
                ? 'கைமுறை UPI (UTR) சமர்ப்பிப்புகளுக்கு, கணக்குத் துறை வங்கி வரவைச் சரிபார்த்த பின் வணிக நேரங்களில் 30 நிமிடங்கள் முதல் 4 மணி நேரத்திற்குள் செயல்படுத்தப்படும்.'
                : 'Manual UPI Verification: Access is activated within 30 minutes to 4 business hours once our finance desk verifies bank statement credit for the submitted UTR.'}
            </li>
            <li>
              {isTa
                ? 'செயல்படுத்தப்பட்டதும், சந்தா ஐடி, செல்லுபடியாகும் காலம் மற்றும் ரசீது உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சலுக்கு அனுப்பப்படும்.'
                : 'Billing Validity: Monthly plans remain active for 1 calendar month and annual plans for 12 calendar months from the date of activation, visible anytime in the Subscriptions Portal.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '2. தனிப்பயன் வலைத்தளம், இ-காமர்ஸ் & CRM வழங்கல்' : '2. Custom Website, E-Commerce & CRM Milestones'}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              {isTa
                ? 'வணிக வலைத்தளங்கள்: 5 முதல் 10 வேலை நாட்கள் (உள்ளடக்கம் & ஒப்புதல் கிடைத்த பின்).'
                : 'Business Websites: Delivered to staging within 5 to 10 working days after receipt of final content and brand assets.'}
            </li>
            <li>
              {isTa
                ? 'இ-காமர்ஸ் & பிரத்யேக CRM அமைப்புகள்: 12 முதல் 35 வேலை நாட்கள் (Scope of Work ஒப்பந்தத்திற்கு ஏற்ப).'
                : 'E-Commerce & Custom CRM Software: Delivered across agreed staging and production milestones over 12 to 35 working days as itemized in the signed Scope of Work.'}
            </li>
            <li>
              {isTa
                ? 'இறுதி மைல்கல் தொகை செலுத்தப்பட்டவுடன் 100% சோர்ஸ் கோட் மற்றும் டொமைன் அணுகல் ஒப்படைக்கப்படும்.'
                : 'Source code repository access, deployment documentation, and domain credentials are handed over upon final milestone acceptance.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '3. சட்டப்பூர்வ இணக்க சேவைகள் & குடிமக்கள் இ-சேவைகள்' : '3. Statutory Compliance & Citizen E-Services Fulfillment'}
          </h2>
          <p>
            {isTa
              ? '₹236 முன்பதிவு கட்டணம் அல்லது ஆவணங்கள் பெறப்பட்ட 24 வணிக மணி நேரத்திற்குள் எங்கள் குழுவினர் முதற்கட்ட சரிபார்ப்பைத் தொடங்குவர். விண்ணப்ப ஒப்புதல் மற்றும் சான்றிதழ் வழங்கல் கால அளவு சம்பந்தப்பட்ட அரசுத் துறை போர்ட்டல்களின் (GSTN, வருமான வரி, NSDL, பாஸ்போர்ட் சேவை, TNEGA, TANGEDCO) செயலாக்க வேகம் மற்றும் வாடிக்கையாளர் வழங்கும் சரியான ஆவணங்களைப் பொறுத்தது.'
              : 'Initial intake and document scrutiny commence within 24 business hours of receiving your confirmed ₹236 e-service booking or compliance retainer. Final processing turnaround and grant of certificates/registrations depend strictly on customer document readiness and official government authority queues (GSTN, Income Tax Portal, NSDL, Passport Seva, TNEGA, TANGEDCO, etc.).'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
            <span>{isTa ? '4. தாமதங்கள் & வாடிக்கையாளர் ஒத்துழைப்பு' : '4. Timelines, Customer Dependencies & Communication'}</span>
          </h2>
          <p>
            {isTa
              ? 'வாடிக்கையாளர் தரப்பில் தேவையான KYC ஆவணங்கள், OTP உறுதிப்படுத்தல்கள் அல்லது உள்ளடக்க ஒப்புதல்கள் தாமதமானால், திட்டக் கால அளவு அதற்கேற்ப நீட்டிக்கப்படும். அனைத்து நிலை மாற்றங்களும் மின்னஞ்சல் அல்லது வாட்ஸ்அப் (+91 82205 50829) மூலம் தெரிவிக்கப்படும்.'
              : 'Delivery timelines pause if required customer inputs, KYC records, domain DNS verification, or government portal OTP confirmations are pending. Progress updates and digital receipts are communicated promptly via registered email and WhatsApp (+91 82205 50829).'}
          </p>
        </section>
      </div>
    </div>
  );
};
