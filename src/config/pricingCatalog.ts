export const BUSINESS_UPI_ID = 'rubienterprisesgst-1@okhdfcbank';
export const BUSINESS_NAME = 'RUBI TECH PARK';
export const GST_RATE = 0.18;

export interface ServicePricingItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  category?: 'software' | 'compliance' | 'eservices';
  exclusions?: string;
  deliveryNote?: string;
}

export interface SubscriptionPlanOption {
  id: string;
  productId: string;
  productName: string;
  productNameTa: string;
  tierName: string;
  tierNameTa: string;
  tagline: string;
  taglineTa: string;
  monthlyBaseINR: number;
  yearlyBaseINR: number;
  features: string[];
  featuresTa: string[];
  exclusions: string;
  exclusionsTa: string;
  trialPolicy: string;
  trialPolicyTa: string;
  cancellationNote: string;
  cancellationNoteTa: string;
  razorpayMonthlyPlanIdEnv?: string;
  razorpayYearlyPlanIdEnv?: string;
}

export const TRUSTED_PRICING_CATALOG: Record<string, ServicePricingItem> = {
  'starter-web': {
    id: 'starter-web',
    name: 'Business Website Development',
    basePrice: 5000,
    category: 'software',
    description: 'Up to 5 responsive pages, WhatsApp integration, SEO, and full code ownership',
    exclusions: 'Domain renewal, cloud hosting, and paid third-party APIs billed separately if opted.',
    deliveryNote: 'Delivered in 5 to 10 working days from asset and scope signoff.'
  },
  'growth-ecommerce': {
    id: 'growth-ecommerce',
    name: 'E-commerce Storefront',
    basePrice: 15000,
    category: 'software',
    description: 'Online store, shopping cart, UPI & card gateway setup, order management',
    exclusions: 'Payment gateway MDR, shipping courier charges, and domain/hosting are separate.',
    deliveryNote: 'Delivered in 12 to 20 working days upon product catalog readiness.'
  },
  'custom-software': {
    id: 'custom-software',
    name: 'Custom CRM System',
    basePrice: 20000,
    category: 'software',
    description: 'Dedicated lead pipeline, team RBAC, interaction notes, and CSV export',
    exclusions: 'Dedicated cloud server hosting and WhatsApp Business API template fees billed separately.',
    deliveryNote: 'Delivered in 15 to 25 working days in agreed milestones.'
  },
  'integrated-solution': {
    id: 'integrated-solution',
    name: 'Website + CRM Suite',
    basePrice: 30000,
    category: 'software',
    description: 'High-converting website tightly integrated with backend lead tracking',
    exclusions: 'External SMS/WhatsApp BSP messaging credits billed at actual carrier tariffs.',
    deliveryNote: 'Delivered in 18 to 30 working days across 3 staged milestones.'
  },
  'ai-automation-package': {
    id: 'ai-automation-package',
    name: 'AI and Workflow Automation',
    basePrice: 25000,
    category: 'software',
    description: 'Automated inquiry triaging, smart auto-replies, and dispatch logic',
    exclusions: 'Third-party AI API token consumption billed to client account or agreed cap.',
    deliveryNote: 'Delivered in 10 to 20 working days with testing signoff.'
  },
  'booking-deposit': {
    id: 'booking-deposit',
    name: 'Project Booking Advance Token',
    basePrice: 2500,
    category: 'software',
    description: 'Formal milestone kickoff advance deposit to lock your development timeline',
    exclusions: 'Adjusted against final approved project invoice upon SOW acceptance.',
    deliveryNote: 'Technical discovery call initiated within 1 business day.'
  },
  'eservice-booking': {
    id: 'eservice-booking',
    name: 'Citizen E-Service Initial Booking Deposit',
    basePrice: 200,
    category: 'eservices',
    description: 'Initial assessment & document review booking for Citizen E-Services (₹200 + 18% GST = ₹236). Remaining charges communicated after requirement review.',
    exclusions: 'Official statutory government fees, stamp duty, and third-party portal charges are extra and informed prior to filing.',
    deliveryNote: 'Document review starts within 1 working day; final processing depends on official authority timelines.'
  }
};

export const SUBSCRIPTION_CATALOG: Record<string, SubscriptionPlanOption> = {
  'kuralvaani-pro': {
    id: 'kuralvaani-pro',
    productId: 'kuralvaani',
    productName: 'Kuralvaani Voice Studio Pro',
    productNameTa: 'குரல்வாணி வாய்ஸ் ஸ்டுடியோ ப்ரோ',
    tierName: 'Commercial Creator & Business Plan',
    tierNameTa: 'வணிக & படைப்பாளர் திட்டம்',
    tagline: 'Tamil AI voice prompt narration, audio rendering, and commercial project workflows.',
    taglineTa: 'தமிழ் குரல் உரை-பேச்சு (TTS) மற்றும் வணிக ஆடியோ உருவாக்க தளம்.',
    monthlyBaseINR: 499,
    yearlyBaseINR: 4990,
    features: [
      'Up to 120 minutes/month Tamil & bilingual voice synthesis rendering',
      'WAV / MP3 commercial-ready audio download workflow',
      'Personal voice sample reference profiles & project history',
      'Email & WhatsApp technical support (+91 82205 50829)'
    ],
    featuresTa: [
      'மாதம் 120 நிமிடங்கள் வரை தமிழ் & இருமொழி குரல் உருவாக்கம்',
      'வணிக பயன்பாட்டிற்கு ஏற்ற WAV / MP3 ஆடியோ பதிவிறக்கம்',
      'தனிப்பட்ட குரல் மாதிரி சுயவிவரங்கள் & திட்ட வரலாறு',
      'மின்னஞ்சல் & வாட்ஸ்அப் தொழில்நுட்ப ஆதரவு (+91 82205 50829)'
    ],
    exclusions: 'Dedicated custom voice model training billed separately under custom engineering scope.',
    exclusionsTa: 'பிரத்யேக தனிப்பயன் குரல் மாதிரி பயிற்சி தனிப்பயன் பணி மதிப்பீட்டின் கீழ் வரும்.',
    trialPolicy: 'No automatic free trial — billing starts immediately upon explicit mandate authorization.',
    trialPolicyTa: 'தானியங்கி இலவச சோதனை இல்லை — ஒப்புதலுக்குப் பிறகே கட்டணம் தொடங்கும்.',
    cancellationNote: 'Cancel auto-renewal anytime before your next billing date with zero cancellation fee.',
    cancellationNoteTa: 'அடுத்த கட்டண தேதிக்கு முன் எப்போது வேண்டுமானாலும் கூடுதல் கட்டணமின்றி ரத்து செய்யலாம்.'
  },
  'bulkmate-business': {
    id: 'bulkmate-business',
    productId: 'bulkmate',
    productName: 'BulkMate Campaign Manager',
    productNameTa: 'பல்க்மேட் மெசேஜிங் மேனேஜர்',
    tierName: 'Growing Team Plan',
    tierNameTa: 'வளரும் வணிகக் குழு திட்டம்',
    tagline: 'Organized bulk messaging queues, contact segmentation, and campaign scheduling dashboard.',
    taglineTa: 'தொடர்பு குழு பிரிப்பு, திட்டமிட்ட பிரச்சார அனுப்புதல் & அறிக்கை டேஷ்போர்டு.',
    monthlyBaseINR: 999,
    yearlyBaseINR: 9990,
    features: [
      'Up to 10,000 queued campaign dispatches per month',
      'CSV contact import, segment tags & reusable message templates',
      'Scheduled dispatch queue & real-time delivery status tracking',
      'Up to 3 team operator logins with activity audit logs'
    ],
    featuresTa: [
      'மாதம் 10,000 வரையிலான பிரச்சார வரிசை மேலாண்மை',
      'CSV தொடர்பு பதிவேற்றம், பிரிவு குறியீடுகள் & செய்தி வார்ப்புருக்கள்',
      'நேர அட்டவணை அனுப்புதல் & நேரடி விநியோக நிலை கண்காணிப்பு',
      '3 குழு ஆபரேட்டர் உள்நுழைவுகள் & செயல்பாட்டுப் பதிவுகள்'
    ],
    exclusions: 'Official WhatsApp Business API / SMS BSP per-message carrier tariffs are separate.',
    exclusionsTa: 'அதிகாரப்பூர்வ வாட்ஸ்அப் API / SMS நெட்வொர்க் கட்டணங்கள் தனியாகப் பொருந்தும்.',
    trialPolicy: 'Guided live walkthrough available prior to purchase; no unrequested auto-charges.',
    trialPolicyTa: 'வாங்குவதற்கு முன் நேரடி டெமோ விளக்கம் உண்டு; தானியங்கி மறைமுகக் கட்டணம் இல்லை.',
    cancellationNote: 'Self-serve cancellation stops future renewals immediately; active cycle continues till period end.',
    cancellationNoteTa: 'ரத்து செய்தவுடன் அடுத்த சுழற்சி கட்டணம் நிற்கும்; நடப்பு காலம் முடியும் வரை சேவை தொடரும்.'
  },
  'rubi-crm-cloud': {
    id: 'rubi-crm-cloud',
    productId: 'rubi-crm',
    productName: 'RUBI Business CRM Cloud',
    productNameTa: 'ரூபி பிசினஸ் CRM கிளவுட்',
    tierName: 'SME Operations Edition',
    tierNameTa: 'SME நிறுவனப் பதிப்பு',
    tagline: 'Managed cloud CRM for lead pipelines, quotation tracking, payment reconciliation & team follow-ups.',
    taglineTa: 'லீட் பைப்லைன், விலை மதிப்பீடு & வாடிக்கையாளர் பின்தொடர்தலுக்கான கிளவுட் CRM.',
    monthlyBaseINR: 1499,
    yearlyBaseINR: 14990,
    features: [
      'Multi-stage lead pipeline with automated follow-up alerts',
      'Website & WhatsApp lead capture webhooks + Cloud Firestore persistence',
      'Payment & GST invoice tracking + CSV compliance export',
      'Up to 10 staff accounts with role-based access control'
    ],
    featuresTa: [
      'தானியங்கி நினைவூட்டல்களுடன் கூடிய பல-படிநிலை லீட் பைப்லைன்',
      'வலைத்தளம் & வாட்ஸ்அப் லீட் இணைப்பு + பாதுகாப்பான கிளவுட் சேமிப்பு',
      'பணம் செலுத்துதல் & GST ரசீது கண்காணிப்பு + CSV ஏற்றுமதி',
      'பங்கு அடிப்படையிலான அணுகலுடன் 10 பணியாளர் கணக்குகள் வரை'
    ],
    exclusions: 'Custom third-party ERP connectors scoped separately as one-time engineering work.',
    exclusionsTa: 'மூன்றாம் தரப்பு ERP இணைப்புகள் தனிப்பட்ட பொறியியல் பணியாக மதிப்பிடப்படும்.',
    trialPolicy: 'No automatic free trial — explicit customer consent required for recurring monthly/yearly billing.',
    trialPolicyTa: 'இலவச சோதனைக்குப் பின் தானியங்கி பிடித்தம் இல்லை — வெளிப்படையான ஒப்புதலுக்குப் பிறகே இயங்கும்.',
    cancellationNote: 'Export full CSV data anytime; cancel auto-renewal with one click before next billing date.',
    cancellationNoteTa: 'எப்போது வேண்டுமானாலும் CSV தரவைப் பதிவிறக்கலாம்; அடுத்த பில்லிங் தேதிக்கு முன் ரத்து செய்யலாம்.'
  }
};

export function calculateGstBreakdown(baseAmountINR: number): {
  baseAmountINR: number;
  taxAmountINR: number;
  totalAmountINR: number;
} {
  const cleanBase = Math.max(0, Math.round(baseAmountINR));
  const taxAmountINR = Math.round(cleanBase * GST_RATE);
  return {
    baseAmountINR: cleanBase,
    taxAmountINR,
    totalAmountINR: cleanBase + taxAmountINR
  };
}

export function calculateSubscriptionBreakdown(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): {
  plan: SubscriptionPlanOption;
  baseAmountINR: number;
  gstAmountINR: number;
  totalAmountINR: number;
} | null {
  const plan = SUBSCRIPTION_CATALOG[planId];
  if (!plan) return null;
  const baseAmountINR = billingCycle === 'yearly' ? plan.yearlyBaseINR : plan.monthlyBaseINR;
  const { taxAmountINR, totalAmountINR } = calculateGstBreakdown(baseAmountINR);
  return {
    plan,
    baseAmountINR,
    gstAmountINR: taxAmountINR,
    totalAmountINR
  };
}

