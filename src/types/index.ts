export type PageRoute =
  | 'home'
  | 'services'
  | 'service-business-websites'
  | 'service-ecommerce'
  | 'service-custom-crm'
  | 'service-crm-integration'
  | 'service-ai-automation'
  | 'pricing'
  | 'portfolio'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'checkout'
  | 'admin-login'
  | 'admin-dashboard'
  | 'not-found';

export type ServiceCategoryType = 'software' | 'compliance' | 'eservices';

export interface ServiceDetail {
  id: string;
  slug: PageRoute | string;
  title: string;
  category: ServiceCategoryType;
  categoryTitle: string;
  shortDescription: string;
  detailedScope?: string;
  whoItIsFor?: string[];
  problemsItSolves?: string[];
  deliverables?: string[];
  processSteps?: { title: string; description: string }[];
  startingPrice?: number;
  startingPriceLabel?: string;
  quotationFactors?: string[];
  whatsappMessage: string;
  whatsappUrl?: string;
  isWorkBasedPricing: boolean;
  isEService?: boolean;
  bookingAmount?: number;
  bookingBase?: number;
  bookingGst?: number;
  complianceNotice?: string;
}

export type ProjectStatus = 'Live' | 'In Progress' | 'Demo' | 'Development / Enhancement' | 'Published Website' | 'Development / Commercial Preparation';

export interface CaseStudy {
  id: string;
  title: string;
  projectName?: string;
  clientName: string;
  industry: string;
  categoryTag?: string;
  location: string;
  status: ProjectStatus;
  summary: string;
  challenge: string;
  solution: string;
  keyDeliverables: string[];
  keyFeatures?: string[];
  technologies: string[];
  liveUrlPlaceholder?: string;
  liveUrl?: string;
  isVerifiedReal: boolean;
  thumbnailUrl?: string;
  isFeatured?: boolean;
  featured?: boolean;
}

export type BusinessType =
  | 'retail-jewellery'
  | 'manufacturing'
  | 'wholesale-distribution'
  | 'professional-services'
  | 'healthcare-clinic'
  | 'education-training'
  | 'real-estate'
  | 'other';

export type RequiredService =
  | 'business-website'
  | 'ecommerce-store'
  | 'custom-crm'
  | 'website-crm-integration'
  | 'ai-workflow-automation'
  | 'consultation';

export type BudgetRange =
  | '₹5,000 - ₹15,000'
  | '₹15,000 - ₹35,000'
  | '₹35,000 - ₹75,000'
  | '₹75,000 - ₹1,50,000+'
  | 'Custom Enterprise';

export type ContactMethod = 'WhatsApp' | 'Phone Call' | 'Email';

export interface LeadFormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  requiredService: RequiredService;
  budgetRange: BudgetRange;
  projectDescription: string;
  preferredContactMethod: ContactMethod;
  consentAgreed: boolean;
}

export interface FormValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  requiredService?: string;
  budgetRange?: string;
  projectDescription?: string;
  consentAgreed?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  startingPrice: number;
  startingPriceDisplay: string;
  summary: string;
  targetAudience: string;
  highlightedDeliverables: string[];
  timelineGuideline: string;
  slug: PageRoute;
}
