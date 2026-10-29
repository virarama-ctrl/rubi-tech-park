import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidPhoneNumber,
  formatWhatsAppNumber,
  buildWhatsAppLink,
  validateLeadForm
} from './validation';

test('isValidEmail correctly identifies valid and invalid emails', () => {
  assert.equal(isValidEmail('contact@elloradigital.in'), true);
  assert.equal(isValidEmail('director@company.co.in'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('missing@domain'), false);
  assert.equal(isValidEmail(''), false);
});

test('isValidPhoneNumber validates standard Indian mobile formats', () => {
  // 10 digits starting with 6, 7, 8, or 9
  assert.equal(isValidPhoneNumber('9876543210'), true);
  assert.equal(isValidPhoneNumber('8123456789'), true);
  assert.equal(isValidPhoneNumber('7012345678'), true);
  assert.equal(isValidPhoneNumber('6398765432'), true);

  // Formatted with +91 or spaces
  assert.equal(isValidPhoneNumber('+91 98765 43210'), true);
  assert.equal(isValidPhoneNumber('+919876543210'), true);
  assert.equal(isValidPhoneNumber('09876543210'), true);

  // Invalid numbers
  assert.equal(isValidPhoneNumber('1234567890'), false); // starts with 1
  assert.equal(isValidPhoneNumber('987654'), false); // too short
  assert.equal(isValidPhoneNumber(''), false);
});

test('formatWhatsAppNumber prepends country code if 10 digits', () => {
  assert.equal(formatWhatsAppNumber('9876543210'), '919876543210');
  assert.equal(formatWhatsAppNumber('+91 98765 43210'), '919876543210');
});

test('buildWhatsAppLink generates valid wa.me URL', () => {
  const link = buildWhatsAppLink('9876543210', 'Hello Ellora');
  assert.equal(link, 'https://wa.me/919876543210?text=Hello%20Ellora');
});

test('validateLeadForm returns errors on empty submission', () => {
  const result = validateLeadForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.requiredService);
  assert.ok(result.errors.consentAgreed);
});

test('validateLeadForm accepts valid submission', () => {
  const validData = {
    fullName: 'Rajesh Sharma',
    businessName: 'Sharma Gems & Exports',
    email: 'rajesh@sharmagems.com',
    phone: '9876543210',
    businessType: 'retail-jewellery' as const,
    requiredService: 'ecommerce-store' as const,
    budgetRange: '₹15,000 - ₹35,000' as const,
    projectDescription: 'We need an e-commerce catalog for our silver and gold collections.',
    preferredContactMethod: 'WhatsApp' as const,
    consentAgreed: true
  };

  const result = validateLeadForm(validData);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});
