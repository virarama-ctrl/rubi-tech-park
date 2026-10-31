import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBusinessWhatsAppNotification,
  generateBusinessWhatsAppLink,
  generateServiceWhatsAppLink,
  BUSINESS_WHATSAPP_NUMBER,
  BUSINESS_EMAIL
} from './notifications';
import { processCustomerChat } from './gemini';

test('formatBusinessWhatsAppNotification accurately formats lead details', () => {
  const dummyLead: any = {
    id: 'test_lead_01',
    referenceNumber: 'RTP-2026-7890',
    fullName: 'Anand Kumar',
    mobileNumber: '9840198401',
    email: 'anand@example.com',
    customerType: 'Startup',
    serviceCategory: 'Software Development & Digital Solutions',
    selectedService: 'E-commerce Website Development',
    customerRequirement: 'B2B Wholesale portal with custom payment gateway and WhatsApp triggers.',
    createdAt: '2026-10-31T10:00:00.000Z'
  };

  const notification = formatBusinessWhatsAppNotification(dummyLead);

  assert.ok(notification.includes('RUBI TECH PARK — NEW CUSTOMER ENQUIRY'));
  assert.ok(notification.includes('RTP-2026-7890'));
  assert.ok(notification.includes('Anand Kumar'));
  assert.ok(notification.includes('9840198401'));
  assert.ok(notification.includes('E-commerce Website Development'));
  assert.ok(notification.includes('Software Development & Digital Solutions'));
});

test('generateBusinessWhatsAppLink creates valid wa.me URL targeting 918220550829', () => {
  const dummyLead: any = {
    id: 'test_lead_02',
    referenceNumber: 'RTP-2026-1234',
    fullName: 'Priya Sundar',
    mobileNumber: '9820550829',
    email: 'priya@example.com',
    serviceCategory: 'E-Services (Citizen Services)',
    selectedService: 'PAN Card Application / Correction Assistance',
    customerRequirement: 'Name correction in existing PAN card',
    bookingAmount: 236,
    bookingPaymentStatus: 'Pending',
    createdAt: '2026-10-31T11:00:00.000Z'
  };

  const url = generateBusinessWhatsAppLink(dummyLead);
  assert.ok(url.startsWith(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`));
  assert.ok(url.includes('RTP-2026-1234'));
  assert.ok(url.includes('236'));
});

test('generateServiceWhatsAppLink builds customer enquiry message', () => {
  const link = generateServiceWhatsAppLink('GST Registration', 'Statutory & Compliance Services');
  assert.ok(link.includes(BUSINESS_WHATSAPP_NUMBER));
  assert.ok(link.includes('GST%20Registration'));
});

test('processCustomerChat explains the ₹236 E-Service rule accurately', async () => {
  const result = await processCustomerChat([], 'How much is the booking charge for PAN card or voter ID?');
  assert.ok(result.reply.includes('236'));
  assert.ok(result.reply.includes('200'));
  assert.ok(result.reply.includes('36'));
});
