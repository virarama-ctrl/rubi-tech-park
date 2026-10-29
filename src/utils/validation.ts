import { LeadFormData, FormValidationErrors } from '../types';

/**
 * Validates an email address using standard regex pattern.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleanEmail);
}

/**
 * Validates Indian and international phone / WhatsApp numbers.
 * Supports:
 * - 10 digits: 9876543210
 * - +91 format: +919876543210, +91 98765 43210
 * - 0 prefix: 09876543210
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Strip spaces, dashes, parentheses
  const digitsOnly = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // If starts with +91, remove it
  const normalized = digitsOnly.startsWith('+91')
    ? digitsOnly.slice(3)
    : digitsOnly.startsWith('91') && digitsOnly.length === 12
    ? digitsOnly.slice(2)
    : digitsOnly.startsWith('0') && digitsOnly.length === 11
    ? digitsOnly.slice(1)
    : digitsOnly;

  // Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(normalized);
}

/**
 * Sanitizes phone number to pure digits with country code for WhatsApp deep link.
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/[^\d]/g, '');
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * Builds a direct WhatsApp web/app link with a prefilled message.
 */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  if (!formattedNumber) return '';
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${formattedNumber}?text=${encodedMsg}`;
}

/**
 * Pure validation function for client-side and future server-side validation.
 */
export function validateLeadForm(data: Partial<LeadFormData>): {
  isValid: boolean;
  errors: FormValidationErrors;
} {
  const errors: FormValidationErrors = {};

  // Full Name
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters.';
  }

  // Email
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please provide a valid business email address.';
  }

  // Phone
  if (!data.phone || !isValidPhoneNumber(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian phone or WhatsApp number.';
  }

  // Business Type
  if (!data.businessType) {
    errors.businessType = 'Please select your industry or business type.';
  }

  // Required Service
  if (!data.requiredService) {
    errors.requiredService = 'Please select the service your project requires.';
  }

  // Budget Range
  if (!data.budgetRange) {
    errors.budgetRange = 'Please select an estimated budget range.';
  }

  // Project Description
  if (!data.projectDescription || data.projectDescription.trim().length < 15) {
    errors.projectDescription = 'Please describe your project requirements in at least 15 characters.';
  }

  // Privacy Consent
  if (!data.consentAgreed) {
    errors.consentAgreed = 'You must acknowledge our privacy policy to submit an enquiry.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
