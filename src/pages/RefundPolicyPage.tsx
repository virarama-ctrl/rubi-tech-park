import React from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, RefreshCw, ShieldCheck, Mail, Phone } from 'lucide-react';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
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
          <RefreshCw className="w-4 h-4" />
          <span>{t.footer.legalHeading}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
          {t.footer.refundPolicy}
        </h1>
        <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
          {isTa
            ? 'கடைசியாக புதுப்பிக்கப்பட்டது: நவம்பர் 2026 · ரூபி டெக் பார்க் (RUBI TECH PARK) — மென்பொருள், இணக்க சேவைகள், இ-சேவைகள் மற்றும் சந்தா திட்டங்களுக்கான பணத்தைத் திரும்பப் பெறும் கொள்கை.'
            : 'Last revised: November 2026 · Cancellation & Refund Policy governing Software Development, Compliance Facilitation, E-Services, and SaaS Subscriptions at RUBI TECH PARK.'}
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '1. மென்பொருள் மேம்பாடு & தனிப்பயன் திட்டங்கள்' : '1. Custom Software & Website Development Services'}
          </h2>
          <p>
            {isTa
              ? 'மென்பொருள் மேம்பாட்டுப் பணிகள் எழுத்துப்பூர்வ பணி வரம்பின் (Scope of Work) அடிப்படையில் மைல்கல் தவணைகளாக மேற்கொள்ளப்படுகின்றன:'
              : 'Custom website, e-commerce, and CRM development contracts operate under agreed milestone Scope of Work (SOW) terms:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              {isTa
                ? 'வடிவமைப்பு அல்லது நிரலாக்கப் பணி தொடங்குவதற்கு முன்பு (பணம் செலுத்திய 24 மணி நேரத்திற்குள்) ரத்து செய்தால், கட்டண கேட்வே செயலாக்கக் கட்டணங்களைக் கழித்து 100% தொகை திரும்பப் பெறத் தகுதியுடையது.'
                : 'Cancellation Before Work Commences: If cancelled within 24 hours of advance payment before design, architecture setup, or coding begins, up to 100% of the advance is eligible for refund after deducting applicable third-party payment gateway or domain procurement costs.'}
            </li>
            <li>
              {isTa
                ? 'வளர்ச்சிப் பணி மற்றும் ஸ்டேஜிங் டெமோ தொடங்கிய பின்பு, ஏற்கனவே நிறைவடைந்த மைல்கல் கட்டங்களுக்குப் பணம் திரும்ப அளிக்கப்படாது.'
                : 'After Commencement of Milestones: Amounts corresponding to completed engineering hours, staging deployments, or third-party infrastructure purchases are non-refundable. Any unutilized future milestone balance may be refunded on a pro-rata basis upon mutual written cancellation.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '2. குடிமக்கள் இ-சேவைகள் (₹236 முன்பதிவுக் கட்டணம்)' : '2. Citizen E-Services & ₹236 Initial Booking Deposit'}
          </h2>
          <p>
            {isTa
              ? 'அனைத்து குடிமக்கள் இ-சேவைகளுக்கும் ஆரம்ப முன்பதிவு மற்றும் ஆவண ஆய்வுக் கட்டணமாக ₹236 (₹200 + 18% GST ₹36) வசூலிக்கப்படுகிறது.'
              : 'All citizen e-service applications carry an initial booking and preliminary eligibility assessment fee of ₹236 (₹200 base + 18% GST ₹36).'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              {isTa
                ? 'ஆவண சரிபார்ப்பு அல்லது போர்டல் விண்ணப்பப் பணி தொடங்கும் முன் தொழில்நுட்பக் காரணங்களால் சேவையைத் தொடர முடியாவிட்டால், ₹236 முன்பதிவுத் தொகை முழுமையாகத் திரும்பப் பெறப்படும்.'
                : 'Before Application Intake Begins: If RUBI TECH PARK determines prior to filing or verification that the service cannot be processed, or if you cancel before document verification begins, the ₹236 booking deposit is refundable.'}
            </li>
            <li>
              {isTa
                ? 'ஆவண ஆய்வு மற்றும் போர்டல் சமர்ப்பிப்பு தொடங்கிய பின், ஆரம்ப ஆய்வுக் கட்டணம் (₹236) மற்றும் அரசு போர்ட்டலுக்குச் செலுத்தப்பட்ட கட்டணங்கள் திரும்பப் பெறப்பட மாட்டாது. அரசு அதிகாரப்பூர்வ கட்டணங்கள் மற்றும் மீதமுள்ள சேவைக் கட்டணங்கள் பணி நிறைவுக்குப் பின் தனித்தனியாகத் தெரிவிக்கப்படும்.'
                : 'After Verification / Filing Begins: Once document scrutiny, form preparation, or portal filing has been initiated, the ₹236 initial booking charge and any statutory fees remitted to government portals are non-refundable.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '3. சட்டப்பூர்வ & வணிக இணக்கச் சேவைகள்' : '3. Statutory & Business Compliance Facilitation'}
          </h2>
          <p>
            {isTa
              ? 'GST, ITR, MSME, FSSAI, வர்த்தக முத்திரை (Trademark) மற்றும் பிற உரிமச் சேவைகளுக்கு, விண்ணப்பம் அரசு போர்ட்டலில் சமர்ப்பிக்கப்பட்ட பின் அல்லது அரசு கட்டணம் செலுத்தப்பட்ட பின் அரசுக் கட்டணங்கள் திரும்பப் பெறப்படாது. முழுமையற்ற அல்லது தவறான வாடிக்கையாளர் ஆவணங்களால் ஏற்படும் தாமதம் அல்லது நிராகரிப்புகளுக்கு கட்டணம் திரும்ப அளிக்கப்படாது.'
              : 'For GST, ITR, MSME/Udyam, FSSAI, BIS, Trademark, and Licence filings: once statutory applications are drafted and submitted or official government fees are remitted, those government fees and completed filing charges are non-refundable. Approvals depend strictly on statutory eligibility and government authority discretion.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '4. மென்பொருள் சந்தாக்கள் & தானியங்கி புதுப்பித்தல் ரத்து' : '4. Software Subscriptions & Auto-Renewal Cancellation'}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              {isTa
                ? 'மாதாந்திர அல்லது வருடாந்திர சந்தா திட்டங்களை எங்கள் சந்தா மேலாண்மைப் பக்கம் வழியாகவோ அல்லது மின்னஞ்சல்/வாட்ஸ்அப் மூலமாகவோ எப்போது வேண்டுமானாலும் ரத்து செய்யலாம்.'
                : 'Anytime Cancellation: You may cancel future auto-renewals anytime via the Subscriptions Management Portal or by contacting support before your next billing date. No cancellation penalty is charged.'}
            </li>
            <li>
              {isTa
                ? 'ரத்து செய்த பிறகு, நடப்பு பில்லிங் காலம் முடியும் வரை உங்கள் மென்பொருள் அணுகல் தொடரும்; அடுத்த கட்டண சுழற்சியில் தொகை வசூலிக்கப்படாது.'
                : 'Current Cycle Access: Upon cancellation of an active subscription, access continues through the end of the already-paid billing cycle, and no subsequent recurring charge will be debited.'}
            </li>
            <li>
              {isTa
                ? 'தவறுதலாக இரட்டிப்பு கட்டணம் வசூலிக்கப்பட்டாலோ அல்லது தொழில்நுட்பப் பிழையால் சேவை செயல்படுத்தப்படாவிட்டாலோ, 7 நாட்களுக்குள் புகார் அளித்தால் 100% தொகை திரும்பப் பெறப்படும்.'
                : 'Duplicate or Billing Errors: Verified duplicate charges or accidental post-cancellation debits reported within 7 calendar days are eligible for a full refund to the original payment source.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#182638] dark:text-[#F1F5F9] font-display">
            {isTa ? '5. தோல்வியடைந்த பரிவர்த்தனைகள் & பணம் திரும்பும் கால அளவு' : '5. Failed Transactions & Refund Processing Timeline'}
          </h2>
          <p>
            {isTa
              ? 'UPI, கார்டு அல்லது நெட் பேங்கிங் பரிவர்த்தனை தோல்வியடைந்து உங்கள் வங்கிக் கணக்கிலிருந்து தொகை கழிக்கப்பட்டிருந்தால், Razorpay மற்றும் உங்கள் வங்கி வழியாக 5 முதல் 7 வேலை நாட்களுக்குள் (5–7 working days) அசல் வங்கிக் கணக்கிற்கே தானாகத் திரும்பச் செலுத்தப்படும். அங்கீகரிக்கப்பட்ட ரீஃபண்ட் கோரிக்கைகளும் 5–7 வேலை நாட்களில் செயல்படுத்தப்படும்.'
              : 'If funds are debited from your bank account during a failed or timed-out Razorpay/UPI transaction, or upon approval of an eligible refund request, the amount is credited back strictly to the original payment source within 5 to 7 working days (subject to issuing bank settlement timelines). Cash refunds are never issued.'}
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
            <ShieldCheck className="w-4 h-4" />
            <span>{isTa ? 'ரத்து & ரீஃபண்ட் உதவி தொடர்பு' : 'Cancellation & Refund Support Desk'}</span>
          </div>
          <p className="text-xs">
            {isTa
              ? 'பணம் திரும்பப் பெறுதல் அல்லது கட்டணத் தகராறுகளுக்கு உங்கள் ஆர்டர் குறிப்பு எண் (Order ID) மற்றும் பரிவர்த்தனை எண்ணுடன் கீழ்க்காணும் முகவரியில் தொடர்பு கொள்ளவும்:'
              : 'To request a cancellation, report a failed debit, or check refund status, please include your Order Reference ID and Transaction/UTR ID:'}
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-[#182638] dark:text-[#F1F5F9]">
            <a href={`mailto:${t.brand.email}`} className="inline-flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5] hover:underline">
              <Mail className="w-3.5 h-3.5" />
              <span>{t.brand.email}</span>
            </a>
            <a href={t.brand.phoneFormatted} className="inline-flex items-center gap-1.5 text-[#315D82] dark:text-[#6F9FC5] hover:underline">
              <Phone className="w-3.5 h-3.5" />
              <span>{t.brand.phone}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
