import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  TRUSTED_PRICING_CATALOG,
  SUBSCRIPTION_CATALOG,
  ServicePricingItem,
  BUSINESS_UPI_ID,
  calculateGstBreakdown,
  calculateSubscriptionBreakdown
} from '../config/pricingCatalog';
import {
  PaymentRecord,
  PaymentMethodType,
  BillingCycle,
  CustomerSubscription
} from '../types/crm';
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
  ArrowLeft,
  Repeat,
  RefreshCw,
  Info,
  Lock
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, any>) => {
      open: () => void;
      on: (event: string, cb: (resp: any) => void) => void;
    };
  }
}

const ENV_RAZORPAY_KEY_ID = (import.meta.env.VITE_RAZORPAY_KEY_ID || '').trim();

interface CheckoutPageProps {
  onNavigate: (route: PageRoute) => void;
  preselectedPlanId?: string;
  initialMode?: 'one_time' | 'subscription';
  initialBillingCycle?: BillingCycle;
  leadId?: string;
}

function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function parseJsonSafe(res: Response): Promise<Record<string, any>> {
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const text = await res.text();

  if (!res.ok) {
    if (text && (contentType.includes('application/json') || text.trim().startsWith('{'))) {
      try {
        const parsed = JSON.parse(text) as Record<string, any>;
        return { success: false, ...parsed };
      } catch {
        // Fall through to structured HTTP status error below
      }
    }
    return {
      success: false,
      message: `Payment server returned HTTP ${res.status}${res.statusText ? ` (${res.statusText})` : ''}. Please try again or use UPI QR.`
    };
  }

  if (!text) return {};
  if (!contentType.includes('application/json') && !text.trim().startsWith('{')) {
    return {
      success: false,
      message: `Unexpected non-JSON response from server (HTTP ${res.status}).`
    };
  }
  try {
    return JSON.parse(text) as Record<string, any>;
  } catch {
    return {
      success: false,
      message: `Server returned malformed JSON (HTTP ${res.status}).`
    };
  }
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  preselectedPlanId = 'starter-web',
  initialMode = 'one_time',
  initialBillingCycle = 'monthly',
  leadId
}) => {
  const { language, t } = useLanguage();
  const isTa = language === 'ta';

  // Mode & Plan Selection
  const [checkoutMode, setCheckoutMode] = useState<'one_time' | 'subscription'>(initialMode);
  const [selectedOneTimeId, setSelectedOneTimeId] = useState<string>(
    TRUSTED_PRICING_CATALOG[preselectedPlanId] ? preselectedPlanId : 'starter-web'
  );
  const [selectedSubPlanId, setSelectedSubPlanId] = useState<string>(
    SUBSCRIPTION_CATALOG[preselectedPlanId] ? preselectedPlanId : 'kuralvaani-pro'
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialBillingCycle);
  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>('upi_qr');
  const [autoRenewConsent, setAutoRenewConsent] = useState<boolean>(false);

  // Sync incoming navigation presets
  useEffect(() => {
    if (initialMode === 'subscription' || SUBSCRIPTION_CATALOG[preselectedPlanId]) {
      setCheckoutMode('subscription');
      if (SUBSCRIPTION_CATALOG[preselectedPlanId]) {
        setSelectedSubPlanId(preselectedPlanId);
      }
      setBillingCycle(initialBillingCycle || 'monthly');
    } else if (TRUSTED_PRICING_CATALOG[preselectedPlanId]) {
      setCheckoutMode('one_time');
      setSelectedOneTimeId(preselectedPlanId);
    }
  }, [preselectedPlanId, initialMode, initialBillingCycle]);

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerBusiness, setCustomerBusiness] = useState('');

  // Server Payment Gateway Config (reads public VITE_RAZORPAY_KEY_ID first)
  const [gatewayConfigured, setGatewayConfigured] = useState(Boolean(ENV_RAZORPAY_KEY_ID));
  const [gatewayMode, setGatewayMode] = useState<'test' | 'live'>(
    ENV_RAZORPAY_KEY_ID.startsWith('rzp_live_') ? 'live' : 'test'
  );
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(ENV_RAZORPAY_KEY_ID || null);
  const [businessUpiId, setBusinessUpiId] = useState<string>(BUSINESS_UPI_ID);

  // Processing & Order States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentStatusNotice, setPaymentStatusNotice] = useState<string | null>(null);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PaymentRecord | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<CustomerSubscription | null>(null);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [upiIntentUri, setUpiIntentUri] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOrderRef, setCopiedOrderRef] = useState(false);

  // Manual UPI UTR Submission
  const [utrInput, setUtrInput] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

  // Fetch gateway config on mount (keeps public key in sync without ever exposing secrets)
  useEffect(() => {
    fetch('/api/payments/config')
      .then((res) => (res.ok ? parseJsonSafe(res) : null))
      .then((data) => {
        if (data && data.success) {
          setGatewayConfigured(Boolean(data.gatewayConfigured));
          setGatewayMode(data.mode === 'live' ? 'live' : 'test');
          setRazorpayKeyId(ENV_RAZORPAY_KEY_ID || data.razorpayKeyId || null);
          if (data.businessUpiId) setBusinessUpiId(data.businessUpiId);
        }
      })
      .catch(() => {
        // Fallback to default config state cleanly
      });
  }, []);

  // Derived Totals (Server still calculates & enforces authoritative amount)
  const selectedOneTimePlan: ServicePricingItem =
    TRUSTED_PRICING_CATALOG[selectedOneTimeId] || TRUSTED_PRICING_CATALOG['starter-web'];
  const subBreakdown = calculateSubscriptionBreakdown(selectedSubPlanId, billingCycle);
  const oneTimeBreakdown = calculateGstBreakdown(selectedOneTimePlan.basePrice);

  const activeTitle =
    checkoutMode === 'subscription' && subBreakdown
      ? `${isTa ? subBreakdown.plan.productNameTa : subBreakdown.plan.productName} (${
          billingCycle === 'yearly' ? (isTa ? 'வருடாந்திரம்' : 'Yearly') : isTa ? 'மாதாந்திரம்' : 'Monthly'
        })`
      : selectedOneTimePlan.name;

  const activeDescription =
    checkoutMode === 'subscription' && subBreakdown
      ? isTa
        ? subBreakdown.plan.taglineTa
        : subBreakdown.plan.tagline
      : selectedOneTimePlan.description;

  const activeExclusions =
    checkoutMode === 'subscription' && subBreakdown
      ? isTa
        ? subBreakdown.plan.exclusionsTa
        : subBreakdown.plan.exclusions
      : selectedOneTimePlan.exclusions;

  const activeDeliveryNote =
    checkoutMode === 'subscription' && subBreakdown
      ? isTa
        ? subBreakdown.plan.cancellationNoteTa
        : subBreakdown.plan.cancellationNote
      : selectedOneTimePlan.deliveryNote;

  const basePrice =
    checkoutMode === 'subscription' && subBreakdown
      ? subBreakdown.baseAmountINR
      : oneTimeBreakdown.baseAmountINR;
  const gstTax =
    checkoutMode === 'subscription' && subBreakdown
      ? subBreakdown.gstAmountINR
      : oneTimeBreakdown.taxAmountINR;
  const totalAmount =
    checkoutMode === 'subscription' && subBreakdown
      ? subBreakdown.totalAmountINR
      : oneTimeBreakdown.totalAmountINR;

  // Generate QR code whenever an order is active
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
          dark: '#0B1530',
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

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderRef(true);
    setTimeout(() => setCopiedOrderRef(false), 2500);
  };

  // Launch official Razorpay Standard Checkout Modal (only after backend order creation)
  const launchRazorpayCheckout = async (
    order: PaymentRecord,
    sub: CustomerSubscription | null,
    keyId: string
  ) => {
    setModalDismissed(false);
    setPaymentStatusNotice(null);

    const publicKeyId = ENV_RAZORPAY_KEY_ID || keyId;
    if (!publicKeyId) {
      setErrorMessage(
        isTa
          ? 'Razorpay பொது சாவி (VITE_RAZORPAY_KEY_ID) கட்டமைக்கப்படவில்லை. UPI QR மூலம் தொடரலாம்.'
          : 'Razorpay public Key ID is not configured. Please complete payment via Business UPI QR below.'
      );
      return;
    }

    const loaded = await loadRazorpayCheckoutScript();
    if (!loaded || !window.Razorpay) {
      setErrorMessage(
        isTa
          ? 'Razorpay கட்டண சாளரத்தை ஏற்ற முடியவில்லை. கீழே உள்ள UPI QR மூலம் தொடரலாம்.'
          : 'Unable to load Razorpay Checkout script right now. You may complete payment via verified Business UPI QR below.'
      );
      return;
    }

    const isSubMandate = Boolean(sub && sub.gatewaySubscriptionId);
    const rzpOptions: Record<string, any> = {
      key: publicKeyId,
      name: 'RUBI TECH PARK',
      description: order.serviceTitle,
      currency: order.currency || 'INR',
      prefill: {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.customerPhone
      },
      notes: {
        orderRef: order.orderRef,
        ...(order.leadId || leadId ? { leadId: order.leadId || leadId } : {}),
        ...(sub ? { subscriptionRef: sub.subscriptionRef } : {})
      },
      theme: {
        color: '#315D82'
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
          setModalDismissed(true);
          setPaymentStatusNotice(
            isTa
              ? 'கட்டண சாளரம் மூடப்பட்டது. உங்கள் ஆர்டர் இன்னும் செலுத்தப்படவில்லை (Unpaid). மீண்டும் முயற்சிக்கவும் அல்லது UPI QR மூலம் செலுத்தவும்.'
              : 'Razorpay checkout modal was dismissed before completion. Your order remains unpaid — click Pay via Razorpay below to retry or use UPI QR.'
          );
        }
      },
      handler: async (resp: {
        razorpay_payment_id: string;
        razorpay_order_id?: string;
        razorpay_subscription_id?: string;
        razorpay_signature: string;
      }) => {
        setIsSubmitting(true);
        setModalDismissed(false);
        setErrorMessage(null);
        setPaymentStatusNotice(
          isTa ? 'சேவையகத்தில் கட்டண கையொப்பம் சரிபார்க்கப்படுகிறது...' : 'Verifying payment signature securely on server...'
        );
        try {
          if (sub) {
            const verifyRes = await fetch('/api/subscriptions/verify-mandate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionRef: sub.subscriptionRef,
                orderRef: order.orderRef,
                gatewayPaymentId: resp.razorpay_payment_id,
                gatewaySubscriptionId: resp.razorpay_subscription_id || sub.gatewaySubscriptionId,
                gatewayOrderId: resp.razorpay_order_id || order.gatewayOrderId,
                gatewaySignature: resp.razorpay_signature
              })
            });
            const verifyData = await parseJsonSafe(verifyRes);
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Mandate signature verification failed.');
            }
            if (verifyData.subscription) setCurrentSubscription(verifyData.subscription);
            if (verifyData.payment) setCurrentOrder(verifyData.payment);
            setPaymentStatusNotice(null);
          } else {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderRef: order.orderRef,
                razorpay_order_id: resp.razorpay_order_id || order.gatewayOrderId,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                leadId: order.leadId || leadId
              })
            });
            const verifyData = await parseJsonSafe(verifyRes);
            if (!verifyRes.ok || !verifyData.success || verifyData.payment?.status !== 'paid') {
              throw new Error(verifyData.message || 'Payment signature verification failed.');
            }
            setCurrentOrder(verifyData.payment);
            setPaymentStatusNotice(null);
          }
        } catch (verifyErr: any) {
          setPaymentStatusNotice(null);
          setErrorMessage(verifyErr.message || 'Could not verify gateway signature.');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    if (isSubMandate && sub?.gatewaySubscriptionId) {
      rzpOptions.subscription_id = sub.gatewaySubscriptionId;
    } else if (order.gatewayOrderId && order.gatewayOrderId.startsWith('order_')) {
      rzpOptions.order_id = order.gatewayOrderId;
      rzpOptions.amount = order.amountPaise || Math.round(order.totalAmountINR * 100);
    } else {
      setErrorMessage(
        isTa
          ? 'Razorpay ஆர்டர் ஐடி உருவாக்கப்படவில்லை. UPI QR வழியாக கட்டணத்தைச் செலுத்தவும்.'
          : 'Gateway order token unavailable for this session. Please complete settlement via Business UPI QR below.'
      );
      return;
    }

    const instance = new window.Razorpay(rzpOptions);
    instance.on('payment.failed', (failureResp: any) => {
      setIsSubmitting(false);
      setPaymentStatusNotice(null);
      const reason =
        failureResp?.error?.description ||
        (isTa ? 'கட்டணம் ரத்து செய்யப்பட்டது அல்லது தோல்வியடைந்தது.' : 'Payment failed or declined by issuing bank.');
      setErrorMessage(reason);
    });
    instance.open();
  };

  // Step 1: Create Trusted Order or Subscription Order BEFORE opening checkout
  const handleInitiateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPaymentStatusNotice(null);
    setModalDismissed(false);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage(
        isTa
          ? 'தயவுசெய்து உங்கள் பெயர், மின்னஞ்சல் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.'
          : 'Please provide your full name, email, and phone number.'
      );
      return;
    }

    if (checkoutMode === 'subscription' && !autoRenewConsent) {
      setErrorMessage(
        isTa
          ? 'தொடர் சந்தா கட்டணத்திற்கு Auto-Renewal ஒப்புதல் பெட்டியைத் தேர்வு செய்யவும்.'
          : 'Please review and tick the explicit Auto-Renewal consent checkbox before starting a subscription.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (checkoutMode === 'subscription') {
        const res = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: selectedSubPlanId,
            billingCycle,
            customerName,
            customerEmail,
            customerPhone,
            customerBusiness,
            paymentMethod: activeMethod === 'upi_qr' || activeMethod === 'upi_intent' ? 'upi_mandate' : activeMethod,
            autoRenewConsent: true
          })
        });
        const data = await parseJsonSafe(res);
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Subscription creation failed.');
        }
        setCurrentSubscription(data.subscription);
        setCurrentOrder(data.order);
        if (data.businessUpiId) setBusinessUpiId(data.businessUpiId);
        if (typeof data.gatewayConfigured === 'boolean') setGatewayConfigured(data.gatewayConfigured);
        const effectiveKey = ENV_RAZORPAY_KEY_ID || data.razorpayKeyId || razorpayKeyId;
        if (effectiveKey) setRazorpayKeyId(effectiveKey);

        if (
          data.gatewayConfigured &&
          effectiveKey &&
          (activeMethod === 'card' || activeMethod === 'netbanking' || activeMethod === 'razorpay_checkout')
        ) {
          await launchRazorpayCheckout(data.order, data.subscription, effectiveKey);
        }
      } else {
        const useRazorpayStandard =
          gatewayConfigured &&
          (activeMethod === 'card' || activeMethod === 'netbanking' || activeMethod === 'razorpay_checkout');

        if (useRazorpayStandard) {
          const createRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planId: selectedOneTimeId,
              amount: Math.round(totalAmount * 100),
              currency: 'INR',
              customerName,
              customerEmail,
              customerPhone,
              customerBusiness,
              leadId,
              paymentMethod: activeMethod
            })
          });
          const data = await parseJsonSafe(createRes);
          if (!createRes.ok || !data.success || !data.orderId) {
            throw new Error(data.message || `Unable to create Razorpay checkout order (HTTP ${createRes.status}).`);
          }
          setCurrentSubscription(null);
          setCurrentOrder(data.order);
          const effectiveKey = ENV_RAZORPAY_KEY_ID || razorpayKeyId;
          if (effectiveKey) {
            await launchRazorpayCheckout(data.order, null, effectiveKey);
          }
        } else {
          const response = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planId: selectedOneTimeId,
              customerName,
              customerEmail,
              customerPhone,
              customerBusiness,
              leadId,
              paymentMethod: activeMethod
            })
          });
          const data = await parseJsonSafe(response);
          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Order creation failed.');
          }

          setCurrentSubscription(null);
          setCurrentOrder(data.order);
          if (data.businessUpiId) setBusinessUpiId(data.businessUpiId);
          if (typeof data.gatewayConfigured === 'boolean') setGatewayConfigured(data.gatewayConfigured);
          const effectiveKey = ENV_RAZORPAY_KEY_ID || data.razorpayKeyId || razorpayKeyId;
          if (effectiveKey) setRazorpayKeyId(effectiveKey);

          if (
            data.gatewayConfigured &&
            effectiveKey &&
            (activeMethod === 'card' || activeMethod === 'netbanking' || activeMethod === 'razorpay_checkout')
          ) {
            await launchRazorpayCheckout(data.order, null, effectiveKey);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit 12-digit UTR for Manual UPI verification
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;
    setErrorMessage(null);

    const cleanUtr = utrInput.trim();
    if (cleanUtr.length < 8) {
      setErrorMessage(
        isTa
          ? 'சரியான 8-24 எழுத்து UTR / வங்கி குறிப்பு எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 8-24 character UTR / Bank Reference number.'
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

      const data = await parseJsonSafe(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'UTR submission failed.');
      }

      setCurrentOrder(data.payment);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit UTR.');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // Recheck Order Status from Server
  const handleRecheckStatus = async () => {
    if (!currentOrder) return;
    setIsRechecking(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/payments/order/${encodeURIComponent(currentOrder.orderRef)}`);
      const data = await parseJsonSafe(res);
      if (res.ok && data.success && data.order) {
        setCurrentOrder(data.order);
      } else {
        throw new Error(data.message || 'Unable to fetch order status.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not refresh status.');
    } finally {
      setIsRechecking(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleResetCheckout = () => {
    setCurrentOrder(null);
    setCurrentSubscription(null);
    setUtrInput('');
    setErrorMessage(null);
    setPaymentStatusNotice(null);
    setModalDismissed(false);
  };

  // -------------------------------------------------------------
  // Render: Paid Receipt Screen
  // -------------------------------------------------------------
  if (currentOrder && currentOrder.status === 'paid') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-[#182638] dark:text-[#F1F5F9] transition-colors">
        <div className="printable-area rounded-2xl p-6 sm:p-10 border border-emerald-300 dark:border-emerald-700/60 bg-white dark:bg-[#1C2B40] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D5DEE8] dark:border-[#30445B] pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-700/50">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {t.checkout.paymentReceipt}
                </span>
                <h1 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                  {t.checkout.paymentSuccessful}
                </h1>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.orderReference}</div>
              <div className="font-mono text-sm font-bold text-[#315D82] dark:text-[#6F9FC5]">
                {currentOrder.orderRef}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">{t.checkout.serviceName}</span>
                <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">{currentOrder.serviceTitle}</span>
              </div>
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">{t.checkout.fullName}</span>
                <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">{currentOrder.customerName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">{t.checkout.email}</span>
                <span className="font-mono text-xs text-[#182638] dark:text-[#F1F5F9]">{currentOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">{t.checkout.phone}</span>
                <span className="font-mono text-xs text-[#182638] dark:text-[#F1F5F9]">{currentOrder.customerPhone}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">
                  {isTa ? 'ரசீது எண்' : 'Receipt No'}
                </span>
                <span className="font-mono text-sm font-semibold text-[#315D82] dark:text-[#6F9FC5]">
                  {currentOrder.receiptNumber || 'RTP-REC-VERIFIED'}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">
                  {isTa ? 'பரிவர்த்தனை / UTR ஐடி' : 'Payment ID / UTR Ref'}
                </span>
                <span className="font-mono text-xs text-[#182638] dark:text-[#F1F5F9]">
                  {currentOrder.gatewayPaymentId || currentOrder.upiTransactionRef || 'Verified'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
              <div>
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">
                  {isTa ? 'பணம் செலுத்திய தேதி' : 'Payment Date'}
                </span>
                <span className="text-xs text-[#182638] dark:text-[#F1F5F9]">
                  {new Date(currentOrder.updatedAt).toLocaleString(isTa ? 'ta-IN' : 'en-IN')}
                </span>
              </div>
              {(currentOrder.subscriptionRef || currentSubscription?.subscriptionRef) && (
                <div>
                  <span className="text-xs text-[#526477] dark:text-[#B8C5D4] block">
                    {isTa ? 'சந்தா குறிப்பு எண் (Subscription ID)' : 'Subscription Reference ID'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#315D82] dark:text-[#6F9FC5]">
                    {currentOrder.subscriptionRef || currentSubscription?.subscriptionRef}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-[#526477] dark:text-[#B8C5D4]">
                <span>{t.checkout.basePrice}</span>
                <span>₹{currentOrder.baseAmountINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#526477] dark:text-[#B8C5D4]">
                <span>{t.checkout.gstTax}</span>
                <span>₹{currentOrder.taxAmountINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#182638] dark:text-[#F1F5F9] pt-2 border-t border-[#D5DEE8] dark:border-[#30445B]">
                <span>{t.checkout.amountPayable}</span>
                <span className="text-[#315D82] dark:text-[#6F9FC5] text-lg font-mono">
                  ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <span>
                {isTa
                  ? 'கட்டணம் வெற்றிகரமாக உறுதி செய்யப்பட்டது. மேலதிக விவரங்களுக்கு எங்கள் குழு உங்களை விரைவில் தொடர்பு கொள்ளும்.'
                  : 'Payment verified and recorded for RUBI TECH PARK. Keep your Order ID and Receipt Number for billing records or subscription management.'}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 no-print border-t border-[#D5DEE8] dark:border-[#30445B] pt-6">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-sm font-semibold text-[#182638] dark:text-[#F1F5F9] cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.checkout.returnHome}</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {(currentOrder.subscriptionRef || currentSubscription) && (
                <button
                  type="button"
                  onClick={() => onNavigate('subscriptions')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#315D82] dark:border-[#6F9FC5] text-sm font-semibold text-[#315D82] dark:text-[#6F9FC5] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>{isTa ? 'சந்தா போர்ட்டல்' : 'Manage Subscription'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl cyber-button-primary text-sm font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.checkout.printReceipt}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Pending Verification Screen (When UTR submitted)
  // -------------------------------------------------------------
  if (currentOrder && currentOrder.status === 'pending_verification') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-[#182638] dark:text-[#F1F5F9] transition-colors">
        <div className="rounded-2xl p-6 sm:p-10 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#D5DEE8] dark:border-[#30445B] pb-6 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-700/50">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t.checkout.paymentPending}
              </span>
              <h1 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {t.checkout.paymentVerificationRequired}
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B]">
              <div className="flex justify-between items-center pb-2 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.orderReference}</span>
                <span className="font-mono font-bold text-[#315D82] dark:text-[#6F9FC5]">
                  {currentOrder.orderRef}
                </span>
              </div>
              {currentOrder.subscriptionRef && (
                <div className="flex justify-between items-center py-2 border-b border-[#D5DEE8] dark:border-[#30445B]">
                  <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">
                    {isTa ? 'சந்தா குறிப்பு எண்' : 'Subscription Ref'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#315D82] dark:text-[#6F9FC5]">
                    {currentOrder.subscriptionRef}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-[#D5DEE8] dark:border-[#30445B]">
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.transactionId}</span>
                <span className="font-mono text-xs font-semibold text-[#182638] dark:text-[#F1F5F9]">
                  {currentOrder.upiTransactionRef}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.amountPayable}</span>
                <span className="font-mono font-bold text-[#182638] dark:text-[#F1F5F9] text-base">
                  ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[#526477] dark:text-[#B8C5D4] text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-[#182638] dark:text-[#F1F5F9]">{t.checkout.manualVerificationNotice}</p>
              <p>
                {isTa
                  ? 'உங்கள் UTR குறிப்பு எண் கணினி பதிவில் வைக்கப்பட்டுள்ளது. வணிக நேரங்களில் 15-30 நிமிடங்களில் சரிபார்க்கப்படும். உடனடி உதவிக்கு வாட்ஸ்அப்பில் ஆர்டர் எண்ணைப் பகிரவும்.'
                  : 'Your bank transaction reference has been logged. Our accounts team reconciles UPI credits within 15-30 minutes during business hours. Once verified, you can refresh status below or view your printable receipt.'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D5DEE8] dark:border-[#30445B] pt-6">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-sm font-semibold text-[#182638] dark:text-[#F1F5F9] cursor-pointer"
            >
              {t.checkout.returnHome}
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRecheckStatus}
                disabled={isRechecking}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#315D82] dark:border-[#6F9FC5] text-[#315D82] dark:text-[#6F9FC5] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRechecking ? 'animate-spin' : ''}`} />
                <span>{isTa ? 'நிலையை மறுபரிசோதனை செய்' : 'Recheck Status'}</span>
              </button>
              <a
                href={`https://wa.me/918220550829?text=${encodeURIComponent(
                  isTa
                    ? `வணக்கம் ரூபி டெக் பார்க், நான் ஆர்டர் ${currentOrder.orderRef} க்கான கட்டணத்தை UPI மூலம் செலுத்திவிட்டேன் (UTR: ${currentOrder.upiTransactionRef}). தயவுசெய்து சரிபார்க்கவும்.`
                    : `Hello RUBI TECH PARK, I have made the payment for Order ${currentOrder.orderRef} via UPI (UTR: ${currentOrder.upiTransactionRef}). Please confirm verification.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <span>{isTa ? 'வாட்ஸ்அப்பில் உறுதி செய்க' : 'Verify via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Failed Screen
  // -------------------------------------------------------------
  if (currentOrder && currentOrder.status === 'failed') {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-[#182638] dark:text-[#F1F5F9] transition-colors">
        <div className="rounded-2xl p-6 sm:p-10 border border-rose-300 dark:border-rose-700/60 bg-white dark:bg-[#1C2B40] shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#D5DEE8] dark:border-[#30445B] pb-6 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-700/50">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {t.checkout.paymentFailed}
              </span>
              <h1 className="text-2xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
                {isTa ? 'பரிவர்த்தனை தோல்வியடைந்தது' : 'Transaction Could Not Be Completed'}
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#526477] dark:text-[#B8C5D4] mb-4">
            {isTa
              ? 'உங்கள் வங்கி அல்லது கட்டண முகமை மூலம் பரிவர்த்தனை நிராகரிக்கப்பட்டது. தொகை பிடித்தம் செய்யப்பட்டிருந்தால் 5-7 வேலை நாட்களில் தானாகத் திரும்பக் கிடைக்கும்.'
              : 'The transaction was not confirmed or was declined. No successful charge was recorded. Any temporary hold is automatically reversed by the bank within 5-7 working days.'}
          </p>
          {currentOrder.notes && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 mb-6 font-mono">
              {currentOrder.notes}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleResetCheckout}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl cyber-button-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.checkout.retryPayment}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-sm font-semibold text-[#182638] dark:text-[#F1F5F9] cursor-pointer"
            >
              {isTa ? 'உதவி பெறவும்' : 'Contact Support'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Main Checkout View (Step 1 Form or Step 2 Settlement)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#182638] dark:text-[#F1F5F9] transition-colors">
      {/* Header Breadcrumb / Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(checkoutMode === 'subscription' ? 'subscriptions' : 'pricing')}
            className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {checkoutMode === 'subscription'
                ? isTa
                  ? 'சந்தா திட்டங்களுக்குத் திரும்பு'
                  : 'Back to Subscriptions'
                : isTa
                ? 'விலைப்பட்டியலுக்குத் திரும்பு'
                : 'Back to Pricing'}
            </span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
            {t.checkout.checkoutHeading}
          </h1>
          <p className="mt-1 text-sm text-[#526477] dark:text-[#B8C5D4]">{t.checkout.pageSubtitle}</p>
        </div>

        {/* Gateway Readiness Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#526477] dark:text-[#B8C5D4] self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5]" />
          <span>
            {gatewayConfigured
              ? `Razorpay ${gatewayMode.toUpperCase()} + UPI Ready`
              : 'Business UPI Verified • Razorpay Compatible'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {paymentStatusNotice && !errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2.5">
          <Clock className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <span>{paymentStatusNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          {!currentOrder ? (
            <form
              onSubmit={handleInitiateOrder}
              className="rounded-2xl p-6 sm:p-8 space-y-6 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-xs"
            >
              {/* Mode Toggle: One-Time vs Subscription */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
                  {isTa ? 'கட்டண வகையைத் தேர்ந்தெடுக்கவும்' : 'Order Type'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B]">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('one_time')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      checkoutMode === 'one_time'
                        ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                        : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
                    }`}
                  >
                    {isTa ? 'ஒருமுறை சேவை / முன்பணம்' : 'One-Time Service / Deposit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('subscription')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      checkoutMode === 'subscription'
                        ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                        : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{isTa ? 'மென்பொருள் சந்தா (SaaS)' : 'Software Subscription'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Package / Plan Picker */}
              {checkoutMode === 'one_time' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5] mb-2">
                    1. {t.checkout.selectPackage}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(TRUSTED_PRICING_CATALOG).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedOneTimeId(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedOneTimeId === item.id
                            ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] ring-1 ring-[#315D82] dark:ring-[#6F9FC5]'
                            : 'border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8]/60 dark:bg-[#17263A]/60 hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-sm text-[#182638] dark:text-[#F1F5F9]">
                            {item.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                            ₹{item.basePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
                      1. {isTa ? 'சந்தா திட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Software Subscription'}
                    </label>
                    <div className="inline-flex rounded-lg border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                          billingCycle === 'monthly'
                            ? 'bg-[#315D82] dark:bg-[#416F98] text-white'
                            : 'text-[#526477] dark:text-[#B8C5D4]'
                        }`}
                      >
                        {isTa ? 'மாதாந்திரம்' : 'Monthly'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                          billingCycle === 'yearly'
                            ? 'bg-[#315D82] dark:bg-[#416F98] text-white'
                            : 'text-[#526477] dark:text-[#B8C5D4]'
                        }`}
                      >
                        {isTa ? 'வருடாந்திரம்' : 'Yearly'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {Object.values(SUBSCRIPTION_CATALOG).map((plan) => {
                      const amt = billingCycle === 'yearly' ? plan.yearlyBaseINR : plan.monthlyBaseINR;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedSubPlanId(plan.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedSubPlanId === plan.id
                              ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] ring-1 ring-[#315D82] dark:ring-[#6F9FC5]'
                              : 'border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8]/60 dark:bg-[#17263A]/60 hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-semibold text-sm text-[#182638] dark:text-[#F1F5F9] block">
                                {isTa ? plan.productNameTa : plan.productName}
                              </span>
                              <span className="text-[11px] text-[#315D82] dark:text-[#6F9FC5] font-mono">
                                {isTa ? plan.tierNameTa : plan.tierName}
                              </span>
                            </div>
                            <span className="font-mono text-sm font-bold text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                              ₹{amt.toLocaleString('en-IN')}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-1">
                            {isTa ? plan.taglineTa : plan.tagline}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Customer Details */}
              <div className="pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
                  2. {t.checkout.customerDetails}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#526477] dark:text-[#B8C5D4] mb-1">
                      {t.checkout.fullName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-[#526477] dark:text-[#8292AA]" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg pl-9 pr-3 py-2 text-sm text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#526477] dark:text-[#B8C5D4] mb-1">
                      {t.checkout.businessName}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#526477] dark:text-[#8292AA]" />
                      <input
                        type="text"
                        value={customerBusiness}
                        onChange={(e) => setCustomerBusiness(e.target.value)}
                        placeholder="e.g. Sri Krishna Enterprises"
                        className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg pl-9 pr-3 py-2 text-sm text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#526477] dark:text-[#B8C5D4] mb-1">
                      {t.checkout.email} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#526477] dark:text-[#8292AA]" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ramesh@company.in"
                        className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg pl-9 pr-3 py-2 text-sm text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#526477] dark:text-[#B8C5D4] mb-1">
                      {t.checkout.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-[#526477] dark:text-[#8292AA]" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg pl-9 pr-3 py-2 text-sm text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Preference */}
              <div className="pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5] mb-2">
                  3. {t.checkout.paymentMethod}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveMethod('upi_qr')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'upi_qr'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] font-semibold'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>{t.checkout.payWithUpi}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('upi_intent')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'upi_intent'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] font-semibold'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('card')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'card'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] font-semibold'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>{t.checkout.debitCard} / {t.checkout.creditCard}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMethod('netbanking')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMethod === 'netbanking'
                        ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] text-[#315D82] dark:text-[#6F9FC5] font-semibold'
                        : 'border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-[#526477] dark:text-[#B8C5D4] hover:border-[#315D82] dark:hover:border-[#6F9FC5]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>{t.checkout.netBanking}</span>
                  </button>
                </div>
              </div>

              {/* Subscription Mandate Explicit Consent Checkbox (Unchecked by Default) */}
              {checkoutMode === 'subscription' && (
                <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-[#182638] dark:text-[#F1F5F9]">
                    <input
                      type="checkbox"
                      checked={autoRenewConsent}
                      onChange={(e) => setAutoRenewConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#D5DEE8] dark:border-[#30445B] text-[#315D82] focus:ring-[#315D82] cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      {isTa
                        ? `இந்த ₹${totalAmount.toLocaleString('en-IN')} (${
                            billingCycle === 'yearly' ? 'வருடாந்திரம்' : 'மாதாந்திரம்'
                          }, 18% GST உட்பட) தொடர் சந்தா கட்டணத்திற்கும் தானியங்கி புதுப்பித்தலுக்கும் (Auto-Renewal Mandate) நான் வெளிப்படையாக ஒப்புக்கொள்கிறேன். அடுத்த சுழற்சிக்கு முன் எப்போது வேண்டுமானாலும் ரத்து செய்யலாம் என்பதை அறிவேன்.`
                        : `I explicitly authorize a recurring ${billingCycle} subscription mandate of ₹${totalAmount.toLocaleString(
                            'en-IN'
                          )} (incl. 18% GST). I understand auto-renewal applies until cancelled via the Subscriptions Portal prior to the next billing date.`}
                    </span>
                  </label>
                  <div className="pl-7 flex flex-wrap gap-3 text-[11px]">
                    <button
                      type="button"
                      onClick={() => onNavigate('subscription-policy')}
                      className="text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer"
                    >
                      {t.footer.subscriptionPolicy}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('refund-policy')}
                      className="text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer"
                    >
                      {t.footer.refundPolicy}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (checkoutMode === 'subscription' && !autoRenewConsent)}
                className="w-full py-3.5 rounded-xl cyber-button-primary font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? '...'
                    : checkoutMode === 'subscription'
                    ? isTa
                      ? 'சந்தா ஆர்டரை உருவாக்கி தொடரவும்'
                      : 'Create Subscription Order & Proceed'
                    : t.checkout.payNow}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Active Order Settlement Screen */
            <div className="space-y-6">
              {/* Active Order Banner */}
              <div className="rounded-2xl p-6 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8] dark:border-[#30445B]">
                  <div>
                    <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.orderReference}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-base font-bold text-[#315D82] dark:text-[#6F9FC5]">
                        {currentOrder.orderRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyRef(currentOrder.orderRef)}
                        className="p-1 rounded bg-[#F2F5F8] dark:bg-[#17263A] text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] cursor-pointer"
                        title="Copy Order Reference"
                      >
                        {copiedOrderRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {currentSubscription && (
                      <div className="text-xs font-mono text-[#526477] dark:text-[#B8C5D4] mt-1">
                        Subscription Ref:{' '}
                        <strong className="text-[#182638] dark:text-[#F1F5F9]">
                          {currentSubscription.subscriptionRef}
                        </strong>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.amountPayable}</span>
                    <div className="text-2xl font-bold font-mono text-[#182638] dark:text-[#F1F5F9]">
                      ₹{currentOrder.totalAmountINR.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                      <Clock className="w-3 h-3" />
                      <span>
                        {modalDismissed
                          ? isTa
                            ? 'சாளரம் மூடப்பட்டது • செலுத்தப்படவில்லை'
                            : 'Checkout Dismissed • Unpaid'
                          : isTa
                          ? 'கட்டணம் நிலுவையில் உள்ளது'
                          : 'Order Created • Awaiting Payment'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Method Tabs + Recheck */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMethod('upi_qr')}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                        activeMethod === 'upi_qr' || activeMethod === 'upi_intent'
                          ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#315D82]/10 dark:bg-[#6F9FC5]/20 text-[#315D82] dark:text-[#6F9FC5]'
                          : 'border-[#D5DEE8] dark:border-[#30445B] text-[#526477] dark:text-[#B8C5D4]'
                      }`}
                    >
                      {t.checkout.payWithUpi}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMethod('card')}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                        activeMethod === 'card' || activeMethod === 'netbanking' || activeMethod === 'razorpay_checkout'
                          ? 'border-[#315D82] dark:border-[#6F9FC5] bg-[#315D82]/10 dark:bg-[#6F9FC5]/20 text-[#315D82] dark:text-[#6F9FC5]'
                          : 'border-[#D5DEE8] dark:border-[#30445B] text-[#526477] dark:text-[#B8C5D4]'
                      }`}
                    >
                      {isTa ? 'Razorpay (கார்டு / நெட் பேங்கிங் / AutoPay)' : 'Razorpay Gateway (Cards / NetBanking / AutoPay)'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRecheckStatus}
                    disabled={isRechecking}
                    className="px-3 py-1.5 rounded-lg border border-[#D5DEE8] dark:border-[#30445B] bg-[#F2F5F8] dark:bg-[#17263A] text-[#182638] dark:text-[#F1F5F9] font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRechecking ? 'animate-spin' : ''}`} />
                    <span>{isTa ? 'நிலையைச் சரிபார்' : 'Recheck Status'}</span>
                  </button>
                </div>
              </div>

              {/* Razorpay Gateway Card / NetBanking / e-Mandate Panel (NO raw card number or CVV fields!) */}
              {(activeMethod === 'card' || activeMethod === 'netbanking' || activeMethod === 'razorpay_checkout') && (
                <div className="rounded-2xl p-6 sm:p-8 space-y-5 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex items-center justify-center text-[#315D82] dark:text-[#6F9FC5] shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#182638] dark:text-[#F1F5F9]">
                        {isTa
                          ? 'Razorpay PCI-DSS பாதுகாப்பான கட்டண முகப்பு'
                          : 'Razorpay Hosted PCI-DSS Checkout'}
                      </h3>
                      <p className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-1 leading-relaxed">
                        {isTa
                          ? 'பாதுகாப்பு காரணங்களுக்காக கார்டு எண் அல்லது CVV எங்கள் தளத்தில் சேமிக்கப்படுவதில்லை. அனைத்து கார்டு, நெட் பேங்கிங் மற்றும் e-Mandate பரிவர்த்தனைகளும் Razorpay பாதுகாப்பான சாளரத்தில் நடைபெறும்.'
                          : 'For full PCI-DSS security compliance, RUBI TECH PARK never collects or stores card numbers, expiry dates, or CVV numbers on this site. All card, netbanking, and AutoPay transactions occur directly inside Razorpay Checkout.'}
                      </p>
                    </div>
                  </div>

                  {gatewayConfigured && razorpayKeyId ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => launchRazorpayCheckout(currentOrder, currentSubscription, razorpayKeyId)}
                      className="w-full py-3.5 px-5 rounded-xl cyber-button-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? '...'
                          : isTa
                          ? `Razorpay மூலம் ₹${currentOrder.totalAmountINR.toLocaleString('en-IN')} செலுத்தவும்`
                          : `Pay ₹${currentOrder.totalAmountINR.toLocaleString('en-IN')} via Razorpay Checkout`}
                      </span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#182638] dark:text-[#F1F5F9]">
                        <Info className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                        <span>
                          {isTa
                            ? 'Razorpay API சாவிகள் (Keys) இன்னும் சேவையகத்தில் இணைக்கப்படவில்லை'
                            : 'Razorpay Hosted Gateway Pending Merchant Key Activation'}
                        </span>
                      </div>
                      <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                        {isTa
                          ? 'சேவையகத்தில் RAZORPAY_KEY_ID மற்றும் RAZORPAY_KEY_SECRET சேர்க்கப்பட்டவுடன் கார்டு / நெட் பேங்கிங் / AutoPay நேரடியாக இயங்கும். தற்போது கீழே உள்ள UPI QR மூலம் உங்கள் ஆர்டர் கட்டணத்தைச் செலுத்தலாம்.'
                          : 'Once RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured on the server, the live Razorpay Checkout modal will launch automatically here. Meanwhile, you can settle this exact order immediately via verified Business UPI QR below.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveMethod('upi_qr')}
                        className="px-4 py-2 rounded-lg cyber-button-primary text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isTa ? 'UPI QR கட்டணத்திற்குச் செல்' : 'Switch to Business UPI QR'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Direct Business UPI QR + Manual 12-digit UTR Settlement */}
              {(activeMethod === 'upi_qr' || activeMethod === 'upi_intent') && (
                <div className="rounded-2xl p-6 sm:p-8 space-y-6 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-xs">
                  <div className="text-center">
                    <span className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider block mb-1">
                      {t.checkout.scanQrCode}
                    </span>
                    <p className="text-xs text-[#526477] dark:text-[#B8C5D4] max-w-md mx-auto">
                      {t.checkout.upiInstructions}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 bg-white rounded-xl shadow-sm border-2 border-[#315D82]/30">
                      {upiQrDataUrl ? (
                        <img
                          src={upiQrDataUrl}
                          alt="RUBI TECH PARK UPI Payment QR Code"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-xs text-[#526477]">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs text-[#526477] dark:text-[#B8C5D4]">{t.checkout.businessUpiId}:</span>
                      <code className="text-xs font-mono font-bold text-[#315D82] dark:text-[#6F9FC5] bg-[#F2F5F8] dark:bg-[#17263A] px-2.5 py-1 rounded border border-[#D5DEE8] dark:border-[#30445B]">
                        {businessUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="p-1.5 rounded bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-[#182638] dark:text-[#F1F5F9] cursor-pointer"
                        title={t.checkout.copyUpiId}
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-1">
                    <a
                      href={upiIntentUri}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#315D82] dark:border-[#6F9FC5] text-xs font-bold text-[#315D82] dark:text-[#6F9FC5] hover:opacity-90 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.checkout.openInUpiApp}</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-[#D5DEE8] dark:border-[#30445B]">
                    <form onSubmit={handleSubmitUtr} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1">
                          {t.checkout.enterUtr} *
                        </label>
                        <input
                          type="text"
                          required
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          placeholder={t.checkout.utrPlaceholder}
                          className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-lg px-3 py-2 text-sm text-[#182638] dark:text-[#F1F5F9] font-mono focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingUtr}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingUtr ? '...' : t.checkout.submitUtr}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetCheckout}
                className="text-xs text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer font-semibold"
              >
                {isTa ? 'திட்டம் அல்லது விவரங்களை மாற்றவும்' : 'Change plan or billing details'}
              </button>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Order Summary Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="rounded-2xl p-6 space-y-4 border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] shadow-xs">
            <h2 className="text-base font-bold font-display text-[#182638] dark:text-[#F1F5F9] border-b border-[#D5DEE8] dark:border-[#30445B] pb-3">
              {isTa ? 'ஆர்டர் சுருக்கம்' : 'Order Summary'}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <span className="font-semibold text-[#182638] dark:text-[#F1F5F9] text-sm block">
                    {activeTitle}
                  </span>
                  <span className="text-[#526477] dark:text-[#B8C5D4] text-[11px] block mt-0.5 leading-relaxed">
                    {activeDescription}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#182638] dark:text-[#F1F5F9] text-sm shrink-0">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
              </div>

              {(activeDeliveryNote || activeExclusions) && (
                <div className="p-3 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-1.5 text-[11px] text-[#526477] dark:text-[#B8C5D4]">
                  {activeDeliveryNote && (
                    <div>
                      <strong className="text-[#182638] dark:text-[#F1F5F9]">
                        {isTa ? 'விநியோகம் / ரத்து: ' : 'Delivery / Cancellation: '}
                      </strong>
                      <span>{activeDeliveryNote}</span>
                    </div>
                  )}
                  {activeExclusions && (
                    <div>
                      <strong className="text-[#182638] dark:text-[#F1F5F9]">
                        {isTa ? 'விலக்குகள்: ' : 'Exclusions: '}
                      </strong>
                      <span>{activeExclusions}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-[#D5DEE8] dark:border-[#30445B] space-y-2">
                <div className="flex justify-between text-[#526477] dark:text-[#B8C5D4]">
                  <span>{t.checkout.basePrice}</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#526477] dark:text-[#B8C5D4]">
                  <span>{t.checkout.gstTax}</span>
                  <span>₹{gstTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#182638] dark:text-[#F1F5F9] pt-2 border-t border-[#D5DEE8] dark:border-[#30445B]">
                  <span>{t.checkout.amountPayable}</span>
                  <span className="text-lg font-mono text-[#315D82] dark:text-[#6F9FC5]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D5DEE8] dark:border-[#30445B] text-[11px] text-[#526477] dark:text-[#B8C5D4] space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isTa
                    ? 'HTTPS குறியாக்கம் & Razorpay PCI-DSS இணக்கமான செக்அவுட்'
                    : 'HTTPS Encrypted • Verified GST & Refund Disclosures'}
                </span>
              </div>
              <p>{t.checkout.secureNotice}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('refund-policy')}
                  className="text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer"
                >
                  {t.footer.refundPolicy}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('service-delivery-policy')}
                  className="text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer"
                >
                  {t.footer.deliveryPolicy}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="text-[#315D82] dark:text-[#6F9FC5] hover:underline cursor-pointer"
                >
                  {t.footer.terms}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
