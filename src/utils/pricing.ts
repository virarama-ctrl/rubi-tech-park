import { RequiredService } from '../types';
import { AGENCY_CONFIG } from '../config/agencyConfig';

/**
 * Formats a numeric Indian Rupee amount with commas and standard Indian currency conventions.
 * e.g. 5000 -> ₹5,000, 150000 -> ₹1,50,000
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export interface CostEstimationResult {
  estimatedStartingPrice: number;
  factors: string[];
  disclaimer: string;
}

/**
 * Calculates indicative starting cost estimates based on service choice and scope parameters.
 */
export function calculateStartingEstimate(
  service: RequiredService,
  options?: {
    scopeSize?: 'standard' | 'expanded' | 'enterprise';
    requiresPaymentGateway?: boolean;
    requiresDedicatedCRM?: boolean;
    requiresWorkflowAutomation?: boolean;
  }
): CostEstimationResult {
  let basePrice = AGENCY_CONFIG.startingPrices.businessWebsite;
  const factors: string[] = [];

  switch (service) {
    case 'business-website':
      basePrice = AGENCY_CONFIG.startingPrices.businessWebsite;
      factors.push('Base includes custom design, 5 core pages, mobile optimization & WhatsApp enquiry trigger');
      if (options?.scopeSize === 'expanded') {
        basePrice += 4000;
        factors.push('Expanded catalog/product showcase (+₹4,000)');
      }
      break;

    case 'ecommerce-store':
      basePrice = AGENCY_CONFIG.startingPrices.ecommerceWebsite;
      factors.push('Base includes product catalog, Razorpay/UPI gateway integration, cart, and order alerts');
      if (options?.scopeSize === 'expanded') {
        basePrice += 10000;
        factors.push('High-SKU variation management, shipping automation & customer portal (+₹10,000)');
      }
      break;

    case 'custom-crm':
      basePrice = AGENCY_CONFIG.startingPrices.customCRM;
      factors.push('Base includes customized sales pipeline, contact repository, notes timeline, and CSV export');
      if (options?.scopeSize === 'expanded') {
        basePrice += 15000;
        factors.push('Multi-role permissions, branch separation, and automated follow-up calendar (+₹15,000)');
      }
      break;

    case 'website-crm-integration':
      basePrice = AGENCY_CONFIG.startingPrices.websitePlusCRM;
      factors.push('Base includes custom corporate website connected to centralized CRM lead intake webhook');
      if (options?.scopeSize === 'expanded') {
        basePrice += 20000;
        factors.push('Two-way sync, WhatsApp automated dispatch, and advanced analytics attribution (+₹20,000)');
      }
      break;

    case 'ai-workflow-automation':
      basePrice = 25000;
      factors.push('Base includes customer inquiry triage, verified knowledge-base guardrails, and automated draft routing');
      if (options?.scopeSize === 'expanded') {
        basePrice += 15000;
        factors.push('Multi-agent workflow pipelines and custom document summarization (+₹15,000)');
      }
      break;

    case 'consultation':
      basePrice = 0;
      factors.push('Initial technical discovery and architecture scoping is provided at zero cost for qualified projects');
      break;
  }

  return {
    estimatedStartingPrice: basePrice,
    factors,
    disclaimer:
      'This calculation is an indicative starting baseline, not a binding quotation. Final investment depends on verified scope, third-party API fees, hosting requirements, and technical specifications.'
  };
}
