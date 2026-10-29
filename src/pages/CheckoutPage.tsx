import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { TRUSTED_PRICING_CATALOG, ServicePricingItem, BUSINESS_UPI_ID } from '../config/pricingCatalog';
import { PaymentRecord, PaymentStatus, PaymentMethodType } from '../types/crm';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Copy,
  Check,
  ArrowRight,
  Printer,
  RotateCcw,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  User,
  ArrowLeft
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: PageRoute) => void;
  preselectedPlanId?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  preselectedPlanId = 'starter-web'
}) => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();

  // Pricing & Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string>(preselectedPlanId);
  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>('upi_qr');

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerBusiness, setCustomerBusiness] = useState('');

  // Processing & Order States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<PaymentRecord | null>(null);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [upiIntentUri, setUpiIntentUri] = useState<string>('');
  const [businessUpiId, setBusinessUpiId] = useState<string>('rubienterprisesgst-1@okhdfcbank');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Manual UPI UTR Submission
  const [utrInput, setUtrInput] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [utrSuccessMsg, setUtrSuccessMsg] = useState<string | null>(null);

  // Mock / Sandbox Gateway simulation for Card / Net Banking testing
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const selectedPlan: ServicePricingItem =
    TRUSTED_PRICING_CATALOG[selectedPlanId] || TRUSTED_PRICING_CATALOG['starter-web'];

  const basePrice = selectedPlan.basePrice;
  const gstTax = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstTax;

  // Generate QR code whenever an order is initiated or plan changes
  useEffect(() => {
    if (currentOrder) {
      const uri = `upi://pay?pa=${businessUpiId}&pn=RUBI+TECH+PARK&am=${currentOrder.totalAmountINR.toFixed(
        2
      )}&tn=Order+${currentOrder.orderRef}&cu=INR`;
      setUpiIntentUri(uri);

      QRCode.toDataURL(uri, {
        width: 240,
        margin: 2,
        color: {
          dark: '#070B14',
          light: '#FFFFFF'
        }
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [currentOrder, businessUpiId]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(businessUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Step 1: Initiate Trusted Server Order
  const handleInitiateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் பெயர், மின்னஞ்சல் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.'
          : 'Please provide your full name, email, and phone number.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          customerName,
          customerEmail,
          customerPhone,
          customerBusiness,
          paymentMethod: activeMethod
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Order creation failed.');
      }

      setCurrentOrder(data.order);
      if (data.businessUpiId) setBusinessUpiId(data.businessUpiId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Customer submits 12-digit UTR for Manual UPI verification
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;
    setErrorMessage(null);

    const cleanUtr = utrInput.trim();
    if (cleanUtr.length < 8) {
      setErrorMessage(
        language === 'ta'
          ? 'சரியான 12-இலக்க UTR / வங்கி குறிப்பு எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 8-22 digit UTR / Bank Reference number.'
      );
      return;
    }

    setIsSubmittingUtr(true);

    try {
      const response = await fetch('/api/payments/submit-manual-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: currentOrder.orderRef,
          utr: cleanUtr
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'UTR submission failed.');
      }

      setCurrentOrder(data.payment);
      setUtrSuccessMsg(
        language === 'ta'
          ? 'உங்கள் UTR எண் பதிவு செய்யப்பட்டது. எங்கள் கணக்கு மேலாளர் வங்கி வரவைச் சரிபார்த்து உறுதி செய்வார்.'
          : 'Your UTR reference is recorded. The payment is in Pending Verification status until confirmed.'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit UTR.');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // Step 3: Gateway Sandbox Card / Net Banking Verification
  const handleSimulateGatewayPayment = async (statusToSimulate: 'paid' | 'failed') => {
    if (!currentOrder) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    if (statusToSimulate === 'failed') {
      setCurrentOrder({
        ...currentOrder,
        status: 'failed',
        notes: 'Card payment transaction declined by issuing bank (Sandbox test)'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const mockPaymentId = `pay_${Date.now()}_sim`;
      const mockSignature = `sig_${Date.now()}_test_verified`;

      const response = await fetch('/api/payments/verify-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: currentOrder.orderRef,
          gatewayOrderId: currentOrder.gatewayOrderId || `ord_${Date.now()}`,
          gatewayPaymentId: mockPaymentId,
          gatewaySignature: mockSignature
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Signature verification failed.');
      }

      setCurrentOrder(data.payment);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gateway verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleResetCheckout = () => {
    setCurrentOrder(null);
    setUtrInput('');
    setUtrSuccessMsg(null);
    setErrorMessage(null);
  };

  // -------------------------------------------------------------
  // Render: Payment Status Screens (Success, Verification Required, Failed)
  // -------------------------------------------------------------
  if (currentOrder && currentOrder.status === 'paid') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="printable-area gold-card rounded-2xl p-6 sm:p-10 border border-emerald-500/30">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {t.checkout.paymentReceipt}
                </span>
                <h1 className="text-2xl font-bold font-display text-white">
                  {t.checkout.paymentSuccessful}
                </h1>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">{t.checkout.orderReference}</div>
              <div className="font-mono text-sm font-bold text-[#F3DC87]">
                {currentOrder.orderRef}
              </div>
            </div>
          </div>

          {/* Receipt Breakdown Table */}
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">{t.checkout.serviceName}</span>
                <span className="font-semibold text-white">{currentOrder.serviceTitle}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">{t.checkout.fullName}</span>
                <span className="font-semibold text-white">{currentOrder.customerName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">{t.checkout.email}</span>
                <span className="font-mono text-xs text-slate-300">{currentOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">{t.checkout.phone}</span>
                <span className="font-mono text-xs text-slate-300">{currentOrder.customerPhone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">
                  {language === 'ta' ? 'ரசீது எண்' : 'Receipt No'}
                </span>
                <span className="font-mono text-sm text-[#F3DC87]">
                  {currentOrder.receiptNumber || 'RTP-REC-VERIFIED'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">
                  {language === 'ta' ? 'பணம் செலுத்திய தேதி' : 'Payment Date'}
                </span>
                <span className="text-xs text-slate-300">
                  {new Date(currentOrder.updatedAt).toLocaleString(
                    language === 'ta' ? 'ta-IN' : 'en-IN'
                  )}
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>{t.checkout.basePrice}</span>
                <span>₹{currentOrder.baseAmountINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t.checkout.gstTax}</span>
                <span>₹{currentOrder.taxAmountINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>{t.checkout.amountPayable}</span>
                <span className="text-[#F3DC87] text-lg font-mono">
                  ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Verification Note */}
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                {language === 'ta'
                  ? 'கட்டணம் வெற்றிகரமாக உறுதி செய்யப்பட்டு RUBI TECH PARK கணக்கில் வரவு வைக்கப்பட்டுள்ளது. உங்கள் திட்ட துவக்கப் பணிகள் உடனடியாகத் தொடங்கப்படுகின்றன.'
                  : 'Payment verified and credited to RUBI TECH PARK current account. Project kickoff details have been dispatched to your email.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 no-print border-t border-slate-800 pt-6">
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.checkout.returnHome}</span>
            </button>
            <button
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] text-[#070B14] font-semibold text-sm shadow hover:from-[#FFF0BD] cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>{t.checkout.printReceipt}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending Verification Screen (When UTR submitted)
  if (currentOrder && currentOrder.status === 'pending_verification') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="gold-card rounded-2xl p-6 sm:p-10 border border-amber-500/30">
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-6 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {t.checkout.paymentPending}
              </span>
              <h1 className="text-2xl font-bold font-display text-white">
                {t.checkout.paymentVerificationRequired}
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-[#0B132B] border border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">{t.checkout.orderReference}</span>
                <span className="font-mono font-bold text-[#F3DC87]">
                  {currentOrder.orderRef}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">{t.checkout.transactionId}</span>
                <span className="font-mono text-amber-300 font-semibold">
                  {currentOrder.upiTransactionRef}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">{t.checkout.amountPayable}</span>
                <span className="font-mono font-bold text-white text-base">
                  ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-2">
              <p className="font-semibold">{t.checkout.manualVerificationNotice}</p>
              <p>
                {language === 'ta'
                  ? 'உங்கள் UTR குறிப்பு எண் கணினி பதிவில் வைக்கப்பட்டுள்ளது. வணிக நேரங்களில் 15-30 நிமிடங்களில் சரிபார்க்கப்படும். உதவி தேவைப்பட்டால் உங்கள் ஆர்டர் குறிப்பு எண்ணுடன் எங்கள் வாட்ஸ்அப் எண்ணிற்குச் செய்தி அனுப்பலாம்.'
                  : 'Your bank transaction reference has been logged. Our accounts team will verify the bank statement within 15-30 minutes during business hours. For immediate assistance, contact us on WhatsApp with your Order Reference.'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white"
            >
              {t.checkout.returnHome}
            </button>
            <a
              href={`https://wa.me/918220550829?text=${encodeURIComponent(
                language === 'ta'
                  ? `வணக்கம் RUBI TECH PARK, நான் ஆர்டர் ${currentOrder.orderRef} க்கான கட்டணத்தை UPI மூலம் செலுத்திவிட்டேன் (UTR: ${currentOrder.upiTransactionRef}). தயவுசெய்து சரிபார்க்கவும்.`
                  : `Hello RUBI TECH PARK, I have made the payment for Order ${currentOrder.orderRef} via UPI (UTR: ${currentOrder.upiTransactionRef}). Please confirm verification.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow flex items-center justify-center gap-2"
            >
              <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் உறுதி செய்க' : 'Verify via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Failed Screen
  if (currentOrder && currentOrder.status === 'failed') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="gold-card rounded-2xl p-6 sm:p-10 border border-rose-500/30">
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-6 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                {t.checkout.paymentFailed}
              </span>
              <h1 className="text-2xl font-bold font-display text-white">
                {language === 'ta' ? 'பரிவர்த்தனை தோல்வியடைந்தது' : 'Transaction Could Not Be Completed'}
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6">
            {language === 'ta'
              ? 'உங்கள் வங்கி அல்லது கட்டண முகமை மூலம் பரிவர்த்தனை நிராகரிக்கப்பட்டது. உங்கள் கணக்கில் தொகை பிடித்தம் செய்யப்படவில்லை என்பதை உறுதி செய்து மீண்டும் முயற்சிக்கவும்.'
              : 'The transaction was declined by the payment gateway or bank. Please verify your payment details and retry.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleResetCheckout}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] text-[#070B14] font-semibold text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.checkout.retryPayment}</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white"
            >
              {language === 'ta' ? 'உதவி பெறவும்' : 'Get Help'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Main Checkout View
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Breadcrumb / Title */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('pricing')}
          className="text-xs font-semibold text-[#F3DC87] hover:underline flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'விலைப்பட்டியலுக்குத் திரும்பு' : 'Back to Pricing'}</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          {t.checkout.checkoutHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{t.checkout.pageSubtitle}</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Left Column (Package Selection & Order Initiation or Payment) | Right Column (Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Step 1 Form or Step 2 Payment UI */}
        <div className="lg:col-span-7 space-y-6">
          {!currentOrder ? (
            /* STEP 1: Plan Selection & Customer Billing Details */
            <form onSubmit={handleInitiateOrder} className="gold-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3DC87] mb-2">
                  1. {t.checkout.selectPackage}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(TRUSTED_PRICING_CATALOG).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPlanId(item.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPlanId === item.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]'
                          : 'border-slate-800 bg-[#070B14] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm text-white">{item.name}</span>
                        <span className="font-mono text-xs font-bold text-[#F3DC87]">
                          ₹{item.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3DC87]">
                  2. {t.checkout.customerDetails}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.checkout.fullName} *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.checkout.businessName}</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={customerBusiness}
                        onChange={(e) => setCustomerBusiness(e.target.value)}
                        placeholder="e.g. Sri Krishna Enterprises"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.checkout.email} *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ramesh@company.in"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.checkout.phone} *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F3DC87] mb-2">
                  3. {t.checkout.paymentMethod}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveMethod('upi_qr')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'upi_qr'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3DC87] font-semibold'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-[#F3DC87]" />
                    <span>{t.checkout.payWithUpi}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('card')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'card'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3DC87] font-semibold'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#F3DC87]" />
                    <span>{t.checkout.debitCard} / {t.checkout.creditCard}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('netbanking')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'netbanking'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3DC87] font-semibold'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-[#F3DC87]" />
                    <span>{t.checkout.netBanking}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('upi_intent')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'upi_intent'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3DC87] font-semibold'
                        : 'border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#F3DC87]" />
                    <span>GPay / PhonePe</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F3DC87] via-[#E5C158] to-[#D4AF37] text-[#070B14] font-bold text-sm shadow-md hover:from-[#FFF0BD] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? '...' : t.checkout.payNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Active Order Settlement Screen */
            <div className="space-y-6">
              {/* Active Order Banner */}
              <div className="gold-card rounded-2xl p-6 border border-[#D4AF37]/40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">{t.checkout.orderReference}</span>
                    <div className="font-mono text-base font-bold text-[#F3DC87]">
                      {currentOrder.orderRef}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">{t.checkout.amountPayable}</span>
                    <div className="text-xl font-bold font-mono text-white">
                      ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Method Tabs */}
                <div className="flex gap-2 mt-4 text-xs">
                  <button
                    onClick={() => setActiveMethod('upi_qr')}
                    className={`px-3 py-1.5 rounded-lg border font-semibold ${
                      activeMethod === 'upi_qr' || activeMethod === 'upi_intent'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3DC87]'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {t.checkout.payWithUpi}
                  </button>
                  <button
                    onClick={() => setActiveMethod('card')}
                    className={`px-3 py-1.5 rounded-lg border font-semibold ${
                      activeMethod === 'card'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3DC87]'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {t.checkout.debitCard} / {t.checkout.creditCard}
                  </button>
                  <button
                    onClick={() => setActiveMethod('netbanking')}
                    className={`px-3 py-1.5 rounded-lg border font-semibold ${
                      activeMethod === 'netbanking'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3DC87]'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {t.checkout.netBanking}
                  </button>
                </div>
              </div>

              {/* METHOD 1: Direct UPI QR Code & Business UPI ID */}
              {(activeMethod === 'upi_qr' || activeMethod === 'upi_intent') && (
                <div className="gold-card rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-semibold text-[#F3DC87] uppercase tracking-wider block mb-1">
                      {t.checkout.scanQrCode}
                    </span>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {t.checkout.upiInstructions}
                    </p>
                  </div>

                  {/* QR Code Card */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-[#D4AF37]/50">
                      {upiQrDataUrl ? (
                        <img
                          src={upiQrDataUrl}
                          alt="UPI Payment QR Code"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-400">{t.checkout.businessUpiId}:</span>
                      <code className="text-xs font-mono font-bold text-[#F3DC87] bg-black/60 px-2.5 py-1 rounded border border-slate-800">
                        {businessUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="p-1.5 rounded bg-slate-800 text-slate-200 hover:text-white cursor-pointer"
                        title={t.checkout.copyUpiId}
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Deep-Link Trigger */}
                  <div className="text-center pt-2">
                    <a
                      href={upiIntentUri}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] border border-[#D4AF37]/60 text-xs font-bold text-[#F3DC87] hover:bg-[#D4AF37]/15"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.checkout.openInUpiApp}</span>
                    </a>
                  </div>

                  {/* Manual UTR Reference Input Form */}
                  <div className="pt-6 border-t border-slate-800">
                    <form onSubmit={handleSubmitUtr} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t.checkout.enterUtr} *
                        </label>
                        <input
                          type="text"
                          required
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          placeholder={t.checkout.utrPlaceholder}
                          className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingUtr}
                        className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingUtr ? '...' : t.checkout.submitUtr}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* METHOD 2: Cards Gateway */}
              {activeMethod === 'card' && (
                <div className="gold-card rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                    <span>{t.checkout.debitCard} / {t.checkout.creditCard}</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name on card"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Card Number (Visa, RuPay, MasterCard)</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Expiry</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleSimulateGatewayPayment('paid')}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] text-[#070B14] font-bold text-xs shadow cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? '...' : `Pay ₹${currentOrder.totalAmountINR.toLocaleString('en-IN')}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateGatewayPayment('failed')}
                      className="px-4 py-3 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-rose-400"
                    >
                      Simulate Fail
                    </button>
                  </div>
                </div>
              )}

              {/* METHOD 3: Net Banking */}
              {activeMethod === 'netbanking' && (
                <div className="gold-card rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{t.checkout.netBanking}</span>
                  </h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#070B14] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Canara Bank">Canara Bank</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulateGatewayPayment('paid')}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F3DC87] to-[#D4AF37] text-[#070B14] font-bold text-xs shadow cursor-pointer"
                  >
                    Proceed to {selectedBank} Portal
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetCheckout}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                {language === 'ta' ? 'திட்டம் அல்லது விவரங்களை மாற்றவும்' : 'Change plan or billing details'}
              </button>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Order Summary Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="gold-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold font-display text-white border-b border-slate-800 pb-3">
              {language === 'ta' ? 'ஆர்டர் சுருக்கம்' : 'Order Summary'}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-white text-sm block">
                    {selectedPlan.name}
                  </span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    {selectedPlan.description}
                  </span>
                </div>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>{t.checkout.basePrice}</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.checkout.gstTax}</span>
                  <span>₹{gstTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>{t.checkout.amountPayable}</span>
                  <span className="text-lg font-mono text-[#F3DC87]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Marker */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <p>{t.checkout.secureNotice}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
