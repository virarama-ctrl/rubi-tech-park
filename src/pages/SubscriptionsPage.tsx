import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BillingCycle, CustomerSubscription, PaymentRecord } from '../types/crm';
import {
  SUBSCRIPTION_CATALOG,
  calculateSubscriptionBreakdown
} from '../config/pricingCatalog';
import { useLanguage } from '../context/LanguageContext';
import {
  Repeat,
  CheckCircle2,
  ShieldCheck,
  Search,
  AlertCircle,
  ArrowRight,
  Calendar,
  CreditCard,
  XCircle,
  ArrowUpDown,
  Clock,
  Info
} from 'lucide-react';

interface SubscriptionsPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectSubscriptionCheckout: (planId: string, billingCycle: BillingCycle) => void;
}

export const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({
  onNavigate,
  onSelectSubscriptionCheckout
}) => {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  // Customer Portal Lookup State
  const [lookupRef, setLookupRef] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<CustomerSubscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  // Cancel & Change Plan UI State (Inline confirmations — no window.alert/confirm)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  const [targetPlanId, setTargetPlanId] = useState<string>('kuralvaani-pro');
  const [targetCycle, setTargetCycle] = useState<BillingCycle>('yearly');

  const plans = Object.values(SUBSCRIPTION_CATALOG);

  const handleLookupSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setActionSuccessMsg(null);
    setActionErrorMsg(null);

    if (!lookupRef.trim() || !lookupEmail.trim()) {
      setLookupError(
        isTa
          ? 'சந்தா குறிப்பு எண் (Subscription ID) மற்றும் பதிவு செய்யப்பட்ட மின்னஞ்சலை உள்ளிடவும்.'
          : 'Please enter both your Subscription Reference ID and registered email address.'
      );
      return;
    }

    setLookupLoading(true);
    try {
      const params = new URLSearchParams({
        subscriptionRef: lookupRef.trim(),
        email: lookupEmail.trim()
      });
      const res = await fetch(`/api/subscriptions/lookup?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubscription(null);
        setPaymentHistory([]);
        setLookupError(
          data.message ||
            (isTa
              ? 'இந்த சந்தா விவரம் கிடைக்கவில்லை. சந்தா ஐடி மற்றும் மின்னஞ்சலைச் சரிபார்க்கவும்.'
              : 'No matching subscription found for this Subscription ID and email.')
        );
        return;
      }

      setSubscription(data.subscription);
      setPaymentHistory(data.payments || []);
      setTargetPlanId(data.subscription.planId);
      setTargetCycle(data.subscription.billingCycle === 'monthly' ? 'yearly' : 'monthly');
    } catch {
      setLookupError(
        isTa
          ? 'சந்தா விவரங்களைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
          : 'Unable to fetch subscription status right now. Please try again.'
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelAutoRenewal = async () => {
    if (!subscription) return;
    setActionLoading(true);
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    try {
      const res = await fetch(`/api/subscriptions/${encodeURIComponent(subscription.subscriptionRef)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscription.customerEmail,
          reason: cancelReason.trim() || 'Customer requested self-serve auto-renewal cancellation'
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Cancellation request failed.');
      }

      setSubscription(data.subscription);
      setShowCancelConfirm(false);
      setCancelReason('');
      setActionSuccessMsg(
        isTa
          ? 'தானியங்கி புதுப்பித்தல் வெற்றிகரமாக ரத்து செய்யப்பட்டது. இனி அடுத்த கட்டண சுழற்சியில் தொகை வசூலிக்கப்படாது.'
          : 'Auto-renewal has been cancelled. No future recurring debits will be charged.'
      );
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Could not cancel subscription.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestPlanChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription) return;
    setActionLoading(true);
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    try {
      const res = await fetch(
        `/api/subscriptions/${encodeURIComponent(subscription.subscriptionRef)}/change-plan`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: subscription.customerEmail,
            newPlanId: targetPlanId,
            newBillingCycle: targetCycle
          })
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Plan update request failed.');
      }

      setSubscription(data.subscription);
      setActionSuccessMsg(
        data.message ||
          (isTa
            ? 'திட்ட மாற்றக் கோரிக்கை பதிவு செய்யப்பட்டது. அடுத்த பில்லிங் சுழற்சிக்கு முன்னதாக புதுப்பிக்கப்படும்.'
            : 'Plan/cycle change preference recorded for your subscription.')
      );
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Could not submit plan change.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderStatusBadge = (status: CustomerSubscription['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <span>Paused</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/50">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen text-[#182638] dark:text-[#F1F5F9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs font-mono text-[#315D82] dark:text-[#6F9FC5] shadow-xs">
              <Repeat className="w-3.5 h-3.5" />
              <span>{isTa ? 'மென்பொருள் சந்தாக்கள் & தொடர் கட்டணம்' : 'SaaS Subscriptions & Recurring Billing'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] tracking-tight">
              {isTa ? 'மாதாந்திர & வருடாந்திர மென்பொருள் சந்தா திட்டங்கள்' : 'Monthly & Yearly Software Subscriptions'}
            </h1>
            <p className="text-base text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
              {isTa
                ? 'Kuralvaani Voice Studio, BulkMate மற்றும் RUBI CRM கிளவுட் மென்பொருட்களுக்கான வெளிப்படையான GST விலைப்பட்டியல் மற்றும் முழு வாடிக்கையாளர் கட்டுப்பாட்டுடன் கூடிய சந்தா திட்டங்கள்.'
                : 'Transparent INR pricing (+18% GST) for hosted RUBI TECH PARK software products, with explicit AutoPay mandate consent, zero hidden trials, and one-click cancellation.'}
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] shadow-xs self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                  : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
              }`}
            >
              {isTa ? 'மாதாந்திரம் (Monthly)' : 'Monthly Billing'}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#315D82] dark:bg-[#416F98] text-white shadow-xs'
                  : 'text-[#526477] dark:text-[#B8C5D4] hover:text-[#182638] dark:hover:text-[#F1F5F9]'
              }`}
            >
              <span>{isTa ? 'வருடாந்திரம் (Yearly)' : 'Yearly Billing'}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono">
                {isTa ? '2 மாத சேமிப்பு' : 'Save 17%'}
              </span>
            </button>
          </div>
        </div>

        {/* Subscription Compliance Disclosure Strip */}
        <div className="p-5 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[#182638] dark:text-[#F1F5F9]">
                {isTa
                  ? 'தெளிவான சந்தா விதிமுறை: தானியங்கி இலவச சோதனைக் கட்டணம் இல்லை'
                  : 'RBI Auto-Pay & Clear Consent Guarantee: No Automatic Trial Charges'}
              </div>
              <p className="text-[#526477] dark:text-[#B8C5D4] leading-relaxed">
                {isTa
                  ? 'வாடிக்கையாளர் செக்அவுட்டில் வெளிப்படையாக AutoPay ஒப்புதல் அளித்தால் மட்டுமே தொடர் பில்லிங் செயல்படுத்தப்படும். எப்போது வேண்டுமானாலும் கீழே உள்ள போர்ட்டலில் ரத்து செய்யலாம்.'
                  : 'Recurring billing is only activated after explicit checkbox consent at checkout. Pre-debit alerts apply per RBI e-Mandate rules, and you can cancel future renewals anytime below.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('subscription-policy')}
            className="text-xs font-semibold text-[#315D82] dark:text-[#6F9FC5] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isTa ? 'சந்தா கொள்கையைப் படிக்க →' : 'Read Subscription Policy →'}
          </button>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const breakdown = calculateSubscriptionBreakdown(plan.id, billingCycle);
            if (!breakdown) return null;

            const featureList = isTa ? plan.featuresTa : plan.features;
            const exclusions = isTa ? plan.exclusionsTa : plan.exclusions;
            const trialPolicy = isTa ? plan.trialPolicyTa : plan.trialPolicy;
            const cancelNote = isTa ? plan.cancellationNoteTa : plan.cancellationNote;

            return (
              <div
                key={plan.id}
                className="interactive-card rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] flex flex-col justify-between shadow-xs hover:border-[#315D82] dark:hover:border-[#6F9FC5]"
              >
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#315D82] dark:text-[#6F9FC5]">
                      {isTa ? plan.tierNameTa : plan.tierName}
                    </div>
                    <h2 className="text-xl font-bold font-display text-[#182638] dark:text-[#F1F5F9] mt-1">
                      {isTa ? plan.productNameTa : plan.productName}
                    </h2>
                    <p className="text-xs text-[#526477] dark:text-[#B8C5D4] mt-1.5 leading-relaxed">
                      {isTa ? plan.taglineTa : plan.tagline}
                    </p>
                  </div>

                  {/* Transparent Price + GST Box */}
                  <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-bold font-mono text-[#182638] dark:text-[#F1F5F9] tabular-nums">
                          ₹{breakdown.baseAmountINR.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#526477] dark:text-[#B8C5D4] ml-1">
                          /{billingCycle === 'yearly' ? (isTa ? 'ஆண்டு' : 'year') : isTa ? 'மாதம்' : 'month'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] font-semibold">
                        + 18% GST
                      </span>
                    </div>
                    <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] flex justify-between pt-1 border-t border-[#D5DEE8] dark:border-[#30445B]">
                      <span>{isTa ? 'GST உட்பட மொத்தம்:' : 'Total incl. 18% GST:'}</span>
                      <span className="font-mono font-bold text-[#315D82] dark:text-[#6F9FC5]">
                        ₹{breakdown.totalAmountINR.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#182638] dark:text-[#F1F5F9] block">
                      {isTa ? 'திட்டத்தில் உள்ளடங்கியவை:' : 'Included Features:'}
                    </span>
                    <ul className="space-y-2 text-xs text-[#526477] dark:text-[#B8C5D4]">
                      {featureList.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions, Trial & Cancel Disclosures */}
                  <div className="space-y-2 pt-3 border-t border-[#D5DEE8] dark:border-[#30445B] text-[11px] text-[#526477] dark:text-[#B8C5D4]">
                    <div>
                      <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                        {isTa ? 'விலக்குகள்: ' : 'Exclusions: '}
                      </span>
                      <span>{exclusions}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                        {isTa ? 'சோதனைக் கொள்கை: ' : 'Trial Policy: '}
                      </span>
                      <span>{trialPolicy}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#182638] dark:text-[#F1F5F9]">
                        {isTa ? 'ரத்து விதி: ' : 'Cancellation: '}
                      </span>
                      <span>{cancelNote}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
                  <button
                    type="button"
                    onClick={() => onSelectSubscriptionCheckout(plan.id, billingCycle)}
                    className="w-full py-3 px-4 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {isTa ? 'சந்தாவைத் தொடங்குக (Checkout)' : 'Subscribe & Authorize Mandate'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Self-Serve Subscription Management Portal */}
        <section className="rounded-3xl bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#315D82] dark:text-[#6F9FC5] uppercase tracking-wider">
              <Search className="w-4 h-4" />
              <span>{isTa ? 'வாடிக்கையாளர் சந்தா மேலாண்மை போர்ட்டல்' : 'Customer Subscription Management Portal'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#182638] dark:text-[#F1F5F9]">
              {isTa ? 'உங்கள் சந்தா நிலை, ரசீதுகள் & ரத்து செய்தல்' : 'Manage Active Subscription, Receipts & Auto-Renewal'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526477] dark:text-[#B8C5D4]">
              {isTa
                ? 'உங்கள் சந்தா குறிப்பு எண் (எ.கா. RTP-SUB-2026-...) மற்றும் பதிவு செய்த மின்னஞ்சலை உள்ளிட்டு நடப்பு திட்டம், அடுத்த பில்லிங் தேதி மற்றும் ரசீதுகளைப் பார்க்கலாம்.'
                : 'Look up your subscription using your Subscription Reference ID (e.g. RTP-SUB-2026-...) and registered email address to view billing status, invoices, plan changes, or cancel auto-renewal.'}
            </p>
          </div>

          <form onSubmit={handleLookupSubscription} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1">
                {isTa ? 'சந்தா குறிப்பு எண் (Subscription ID)' : 'Subscription Reference ID'}
              </label>
              <input
                type="text"
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value)}
                placeholder="RTP-SUB-2026-XXXXXX"
                className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1">
                {isTa ? 'பதிவு செய்த மின்னஞ்சல்' : 'Registered Email Address'}
              </label>
              <input
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="name@company.in"
                className="w-full bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl px-3.5 py-2.5 text-sm text-[#182638] dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#315D82] dark:focus:ring-[#6F9FC5]"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full py-2.5 px-4 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{lookupLoading ? '...' : isTa ? 'தேடு' : 'Lookup'}</span>
              </button>
            </div>
          </form>

          {lookupError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-700/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{lookupError}</span>
            </div>
          )}

          {actionSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {actionErrorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-700/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionErrorMsg}</span>
            </div>
          )}

          {subscription && (
            <div className="space-y-6 pt-4 border-t border-[#D5DEE8] dark:border-[#30445B]">
              {/* Subscription Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B]">
                <div>
                  <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4] block">
                    {isTa ? 'சந்தா எண் & திட்டம்' : 'Subscription & Plan'}
                  </span>
                  <div className="font-mono text-xs font-bold text-[#315D82] dark:text-[#6F9FC5] mt-0.5">
                    {subscription.subscriptionRef}
                  </div>
                  <div className="text-sm font-bold text-[#182638] dark:text-[#F1F5F9] mt-0.5">
                    {subscription.planName}
                  </div>
                  <div className="text-xs text-[#526477] dark:text-[#B8C5D4] capitalize">
                    {subscription.billingCycle} · ₹{subscription.totalAmountINR.toLocaleString('en-IN')} incl. GST
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4] block mb-1.5">
                    {isTa ? 'தற்போதைய நிலை' : 'Subscription Status'}
                  </span>
                  {renderStatusBadge(subscription.status)}
                  <div className="text-[11px] text-[#526477] dark:text-[#B8C5D4] mt-1.5">
                    {subscription.autoRenew
                      ? isTa
                        ? 'தானியங்கி புதுப்பித்தல்: இயங்குகிறது'
                        : 'Auto-Renewal: Enabled'
                      : isTa
                      ? 'தானியங்கி புதுப்பித்தல்: நிறுத்தப்பட்டது'
                      : 'Auto-Renewal: Stopped'}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#526477] dark:text-[#B8C5D4] block">
                    {isTa ? 'அடுத்த கட்டண தேதி' : 'Next Billing / Renewal Date'}
                  </span>
                  <div className="text-sm font-semibold text-[#182638] dark:text-[#F1F5F9] mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5]" />
                    <span>
                      {subscription.nextBillingAt
                        ? new Date(subscription.nextBillingAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : '—'}
                    </span>
                  </div>
                  {subscription.pendingPlanChange && (
                    <div className="text-[11px] font-mono text-[#315D82] dark:text-[#6F9FC5] mt-1">
                      Scheduled change: {subscription.pendingPlanChange.newPlanName} (
                      {subscription.pendingPlanChange.newBillingCycle})
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-2">
                  {subscription.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm((v) => !v)}
                      className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isTa ? 'தானியங்கி புதுப்பித்தலை ரத்து செய்' : 'Cancel Auto-Renewal'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Cancellation Confirmation */}
              {showCancelConfirm && subscription.status !== 'cancelled' && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-700/50 space-y-3">
                  <div className="text-xs font-bold text-rose-800 dark:text-rose-200">
                    {isTa
                      ? 'தானியங்கி புதுப்பித்தலை ரத்து செய்ய உறுதிப்படுத்தவும்'
                      : 'Confirm Auto-Renewal Cancellation'}
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    {isTa
                      ? 'ரத்து செய்த பின் எதிர்கால கட்டணங்கள் வசூலிக்கப்படாது. நடப்பு பில்லிங் காலம் முடியும் வரை சேவை அணுகல் தொடரும்.'
                      : 'Stopping auto-renewal immediately cancels future recurring debits. You retain access through the end of the already-paid cycle.'}
                  </p>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder={isTa ? 'விருப்பக் காரணம் (Optional)' : 'Optional reason for cancelling'}
                    className="w-full bg-white dark:bg-[#17263A] border border-rose-200 dark:border-rose-700/50 rounded-lg px-3 py-2 text-xs text-[#182638] dark:text-[#F1F5F9]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleCancelAutoRenewal}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading
                        ? '...'
                        : isTa
                        ? 'ஆம், சந்தாவை ரத்து செய்'
                        : 'Confirm Cancellation'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-4 py-2 rounded-lg border border-[#D5DEE8] dark:border-[#30445B] bg-white dark:bg-[#1C2B40] text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] cursor-pointer"
                    >
                      {isTa ? 'பின்வாங்கு' : 'Keep Subscription'}
                    </button>
                  </div>
                </div>
              )}

              {/* Upgrade / Downgrade Cycle Form */}
              {subscription.status !== 'cancelled' && (
                <form
                  onSubmit={handleRequestPlanChange}
                  className="p-5 rounded-2xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] flex flex-col sm:flex-row sm:items-end gap-3"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1">
                      {isTa ? 'திட்டத்தை மேம்படுத்து / மாற்று' : 'Upgrade or Switch Plan'}
                    </label>
                    <select
                      value={targetPlanId}
                      onChange={(e) => setTargetPlanId(e.target.value)}
                      className="w-full bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl px-3 py-2 text-xs text-[#182638] dark:text-[#F1F5F9]"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {isTa ? p.productNameTa : p.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:w-44">
                    <label className="block text-xs font-semibold text-[#182638] dark:text-[#F1F5F9] mb-1">
                      {isTa ? 'பில்லிங் சுழற்சி' : 'Billing Cycle'}
                    </label>
                    <select
                      value={targetCycle}
                      onChange={(e) => setTargetCycle(e.target.value as BillingCycle)}
                      className="w-full bg-white dark:bg-[#1C2B40] border border-[#D5DEE8] dark:border-[#30445B] rounded-xl px-3 py-2 text-xs text-[#182638] dark:text-[#F1F5F9]"
                    >
                      <option value="monthly">{isTa ? 'மாதாந்திரம்' : 'Monthly'}</option>
                      <option value="yearly">{isTa ? 'வருடாந்திரம்' : 'Yearly'}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl cyber-button-primary text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{isTa ? 'மாற்றத்தைப் பதிவு செய்' : 'Request Plan Change'}</span>
                  </button>
                </form>
              )}

              {/* Payment History Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#182638] dark:text-[#F1F5F9]">
                  {isTa ? 'கட்டண & ரசீது வரலாறு' : 'Subscription Payment & Receipt History'}
                </h3>
                {paymentHistory.length === 0 ? (
                  <p className="text-xs text-[#526477] dark:text-[#B8C5D4]">
                    {isTa ? 'இன்னும் கட்டணப் பதிவுகள் இல்லை.' : 'No recorded payment transactions yet for this subscription.'}
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-[#D5DEE8] dark:border-[#30445B]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F2F5F8] dark:bg-[#17263A] text-[#526477] dark:text-[#B8C5D4] uppercase text-[10px]">
                        <tr>
                          <th className="px-4 py-2.5">Order ID</th>
                          <th className="px-4 py-2.5">Payment / UTR ID</th>
                          <th className="px-4 py-2.5">Amount (INR)</th>
                          <th className="px-4 py-2.5">Status</th>
                          <th className="px-4 py-2.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D5DEE8] dark:divide-[#30445B]">
                        {paymentHistory.map((p) => (
                          <tr key={p.id} className="bg-white dark:bg-[#1C2B40]">
                            <td className="px-4 py-2.5 font-mono font-semibold text-[#182638] dark:text-[#F1F5F9]">
                              {p.orderRef}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[#526477] dark:text-[#B8C5D4]">
                              {p.gatewayPaymentId || p.upiTransactionRef || 'Pending'}
                            </td>
                            <td className="px-4 py-2.5 font-mono font-bold text-[#315D82] dark:text-[#6F9FC5]">
                              ₹{p.totalAmountINR.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-2.5 capitalize">{p.status.replace(/_/g, ' ')}</td>
                            <td className="px-4 py-2.5 text-[#526477] dark:text-[#B8C5D4]">
                              {new Date(p.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {!subscription && !lookupError && (
            <div className="p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#17263A] border border-[#D5DEE8] dark:border-[#30445B] text-xs text-[#526477] dark:text-[#B8C5D4] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#315D82] dark:text-[#6F9FC5] shrink-0 mt-0.5" />
              <span>
                {isTa
                  ? 'சந்தா பதிவு செய்ததும் உங்கள் மின்னஞ்சல்/ரசீதில் RTP-SUB-2026-... என்ற சந்தா ஐடி வழங்கப்படும். அதைப் பயன்படுத்தி இங்கே உங்கள் சந்தாவை எப்போது வேண்டுமானாலும் நிர்வகிக்கலாம்.'
                  : 'Upon initiating a subscription at checkout, you receive a unique RTP-SUB-2026-... reference ID. Enter it above with your email anytime to inspect renewal dates, invoices, or cancel auto-renewal.'}
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
