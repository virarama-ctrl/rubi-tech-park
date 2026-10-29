export const BUSINESS_UPI_ID = 'rubienterprisesgst-1@okhdfcbank';
export const BUSINESS_NAME = 'RUBI TECH PARK';

export interface ServicePricingItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

export const TRUSTED_PRICING_CATALOG: Record<string, ServicePricingItem> = {
  'starter-web': {
    id: 'starter-web',
    name: 'Business Website Development',
    basePrice: 5000,
    description: 'Up to 5 responsive pages, WhatsApp integration, SEO, and full code ownership'
  },
  'growth-ecommerce': {
    id: 'growth-ecommerce',
    name: 'E-commerce Storefront',
    basePrice: 15000,
    description: 'Online store, shopping cart, UPI & card gateway setup, order management'
  },
  'custom-software': {
    id: 'custom-software',
    name: 'Custom CRM System',
    basePrice: 20000,
    description: 'Dedicated lead pipeline, team RBAC, interaction notes, and CSV export'
  },
  'integrated-solution': {
    id: 'integrated-solution',
    name: 'Website + CRM Suite',
    basePrice: 30000,
    description: 'High-converting website tightly integrated with backend lead tracking'
  },
  'ai-automation-package': {
    id: 'ai-automation-package',
    name: 'AI and Workflow Automation',
    basePrice: 25000,
    description: 'Automated inquiry triaging, smart auto-replies, and dispatch logic'
  },
  'booking-deposit': {
    id: 'booking-deposit',
    name: 'Project Booking Advance Token',
    basePrice: 2500,
    description: 'Formal milestone kickoff advance deposit to lock your development timeline'
  }
};
