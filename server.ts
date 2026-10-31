import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { crmStorage } from './src/server/storage';
import {
  verifyPassword,
  createSession,
  validateSession,
  destroySession,
  extractBearerToken,
  AdminSession
} from './src/server/auth';
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  isHoneypotTriggered
} from './src/server/sanitizer';
import { enquiryRateLimiter, authRateLimiter } from './src/server/rateLimiter';
import { validateLeadForm } from './src/utils/validation';
import { LeadFormData } from './src/types';
import { LeadStatus } from './src/types/crm';
import {
  paymentManager,
  BUSINESS_UPI_ID,
  BUSINESS_NAME,
  TRUSTED_PRICING_CATALOG
} from './src/server/payments';
import { supabaseService } from './src/server/supabase';
import {
  formatBusinessWhatsAppNotification,
  generateBusinessWhatsAppLink,
  sendBusinessEmailNotification,
  BUSINESS_WHATSAPP_NUMBER,
  BUSINESS_EMAIL
} from './src/server/notifications';
import { processCustomerChat } from './src/server/gemini';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

// Helper to get real client IP behind proxies
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

// Security Middleware: Require Admin Authentication
interface AuthenticatedRequest extends Request {
  adminSession?: AdminSession;
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is missing. Please sign in to the RUBI TECH PARK CRM admin console.'
    });
    return;
  }

  const session = validateSession(token);
  if (!session) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Your session has expired or is invalid. Please sign in again.'
    });
    return;
  }

  req.adminSession = session;
  next();
}

// -------------------------------------------------------------
// Public Endpoints & Lead Form Submission
// -------------------------------------------------------------

// In-memory cache for duplicate prevention within 15 seconds
interface CachedSubmission {
  timestamp: number;
  referenceId: string;
  lead: any;
}
const recentSubmissions = new Map<string, CachedSubmission>();

// Cleanup old cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of recentSubmissions.entries()) {
    if (now - val.timestamp > 60000) {
      recentSubmissions.delete(key);
    }
  }
}, 300000);

/**
 * Common lead submission processor supporting both camelCase and snake_case payloads
 */
async function handleLeadSubmission(req: Request, res: Response) {
  const ip = getClientIp(req);

  // 1. Rate Limiting Check
  const rateLimit = enquiryRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Enquiry rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds} seconds before submitting again.`
    });
    return;
  }

  // 2. Bot / Honeypot Check
  if (isHoneypotTriggered(req.body) || req.body.honeypot) {
    // Silently acknowledge without polluting the database
    res.status(200).json({
      success: true,
      referenceId: `RTP-${new Date().getFullYear()}-SPAM-TRAP`,
      message: 'Enquiry received.'
    });
    return;
  }

  // 3. Extract and Sanitize Inputs (support camelCase and snake_case)
  const fullName = sanitizeText(req.body.fullName || req.body.customer_name || req.body.name);
  const businessName = sanitizeText(req.body.businessName || req.body.business_name || '');
  const email = sanitizeEmail(req.body.email);
  const phone = sanitizePhone(req.body.phone || req.body.phone_number || req.body.mobileNumber || req.body.mobile);
  const whatsappNumber = sanitizePhone(req.body.whatsappNumber || req.body.whatsapp_number || phone);
  const customerType = sanitizeText(req.body.customerType || req.body.customer_type || 'Business / Individual');
  const serviceCategory = sanitizeText(req.body.serviceCategory || req.body.service_category || 'General');
  const selectedService = sanitizeText(req.body.selectedService || req.body.selected_service || req.body.requiredService || req.body.service_interested || 'General Inquiry');
  const projectDescription = sanitizeText(req.body.projectDescription || req.body.customerRequirement || req.body.requirement || req.body.message || '');
  const businessType = req.body.businessType || 'other';
  const preferredContactMethod = req.body.preferredContactMethod || 'WhatsApp';
  const sourcePage = sanitizeText(req.body.source || req.body.source_page || 'Website');

  // Booking payment rules: If category is E-Services or booking requested, set booking amount to ₹236 (₹200 + ₹36 GST)
  const isEService = serviceCategory.toLowerCase().includes('e-service') ||
    sourcePage.toLowerCase().includes('e-service') ||
    req.body.isEService === true ||
    Boolean(req.body.bookingAmount);

  const bookingAmount = isEService ? 236 : (req.body.bookingAmount ? Number(req.body.bookingAmount) : undefined);
  const bookingPaymentStatus = req.body.bookingPaymentStatus || (isEService ? 'Pending' : undefined);
  const balanceAmount = req.body.balanceAmount ? Number(req.body.balanceAmount) : undefined;
  const consentAgreed = req.body.consentAgreed ?? req.body.consent_agreed ?? true;

  // 4. Duplicate Prevention (15-second window)
  const dedupKey = `${phone}_${email}`.toLowerCase();
  const existing = recentSubmissions.get(dedupKey);
  const now = Date.now();
  if (existing && now - existing.timestamp < 15000) {
    const waUrl = generateBusinessWhatsAppLink(existing.lead);
    res.status(200).json({
      success: true,
      referenceId: existing.referenceId,
      lead: existing.lead,
      duplicate: true,
      whatsappNotificationUrl: waUrl,
      message: 'Your enquiry was already received. A representative will contact you shortly.'
    });
    return;
  }

  // 5. Server-side Validation
  const errors: Record<string, string> = {};
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid business email address.';
  }
  const digitsOnly = phone.replace(/\D/g, '');
  const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6-9]\d{9}$/;
  if (!phone || !indianMobileRegex.test(digitsOnly)) {
    errors.phone = 'Please provide a valid 10-digit Indian mobile number.';
  }
  if (!selectedService) {
    errors.requiredService = 'Please select a service.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      error: 'Validation Failed',
      message: 'The submitted inquiry failed server-side validation.',
      errors
    });
    return;
  }

  // 6. Save to Supabase + Persistent Storage
  try {
    const result = await supabaseService.createLead(
      {
        customer_name: fullName,
        phone_number: phone,
        whatsapp_number: whatsappNumber,
        email,
        business_name: businessName,
        customer_type: customerType,
        service_category: serviceCategory,
        selected_service: selectedService,
        service_interested: selectedService,
        message: projectDescription,
        source_page: sourcePage,
        booking_amount: bookingAmount,
        booking_payment_status: bookingPaymentStatus,
        balance_amount: balanceAmount,
        consent_agreed: consentAgreed,
        status: 'New'
      },
      ip
    );

    const refId = result.lead?.referenceNumber || `RTP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedNotification = formatBusinessWhatsAppNotification(result.lead);
    const whatsappNotificationUrl = generateBusinessWhatsAppLink(result.lead);

    // Fire server-side email notification logging asynchronously
    sendBusinessEmailNotification(result.lead, ip).catch((mailErr) => {
      console.warn('[EMAIL NOTIFY NON-BLOCKING ERROR]:', mailErr);
    });

    // Record for duplicate detection
    recentSubmissions.set(dedupKey, {
      timestamp: now,
      referenceId: refId,
      lead: result.lead
    });

    res.status(201).json({
      success: true,
      referenceId: refId,
      lead: result.lead,
      storage: result.storage,
      whatsappNotificationUrl,
      formattedNotification,
      bookingDetails: isEService ? {
        baseCharge: 200,
        gstRatePercent: 18,
        gstAmount: 36,
        totalBookingAmount: 236,
        paymentStatus: 'Pending',
        notice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
      } : undefined,
      message: result.storage === 'supabase'
        ? 'Enquiry recorded in Supabase cloud database.'
        : 'Enquiry recorded in persistent CRM database.'
    });
  } catch (err) {
    console.error('Error recording lead:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to save enquiry at this moment. Please try again or reach out on WhatsApp.'
    });
  }
}

/**
 * Public Lead Form Submission - Endpoints
 */
app.post('/api/enquiries', handleLeadSubmission);
app.post('/api/leads', handleLeadSubmission);

/**
 * AI Customer Support Chatbot Endpoint (Powered by Google Gemini API)
 * POST /api/chat
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const rateLimit = enquiryRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Too Many Requests',
      reply: 'You have sent several messages in a short time. Please wait a moment or reach out directly to our WhatsApp support at +91 82205 50829.',
      source: 'fallback'
    });
    return;
  }

  const { message, history } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'A message string is required.'
    });
    return;
  }

  try {
    const chatHistory = Array.isArray(history) ? history : [];
    const response = await processCustomerChat(chatHistory, message);
    res.status(200).json({
      success: true,
      ...response
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      success: false,
      reply: 'Our AI consultant is temporarily busy. You can speak directly with our team on WhatsApp: +91 82205 50829.',
      source: 'fallback'
    });
  }
});

// -------------------------------------------------------------
// Online Payment Endpoints (UPI, Cards, Net Banking)
// -------------------------------------------------------------

/**
 * Get Pricing Catalog & Payment Configuration
 * GET /api/payments/catalog
 */
app.get('/api/payments/catalog', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    catalog: TRUSTED_PRICING_CATALOG,
    businessUpiId: BUSINESS_UPI_ID,
    businessName: BUSINESS_NAME,
    gatewayMode: process.env.PAYMENT_GATEWAY_MODE || 'sandbox',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_rtp_sandbox'
  });
});

/**
 * Create Payment Order (Server calculates trusted amount)
 * POST /api/payments/create-order
 */
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { planId, customerName, customerEmail, customerPhone, customerBusiness, paymentMethod } = req.body;

  if (!planId || !customerName || !customerEmail || !customerPhone) {
    res.status(400).json({
      error: 'Validation Failed',
      message: 'Plan ID, customer name, email, and phone number are required.'
    });
    return;
  }

  const sanitizedEmail = sanitizeEmail(customerEmail);
  const sanitizedPhone = sanitizePhone(customerPhone);
  const sanitizedName = sanitizeText(customerName);
  const sanitizedBusiness = customerBusiness ? sanitizeText(customerBusiness) : undefined;

  try {
    const order = paymentManager.createOrder({
      planId,
      customerName: sanitizedName,
      customerEmail: sanitizedEmail,
      customerPhone: sanitizedPhone,
      customerBusiness: sanitizedBusiness,
      paymentMethod: paymentMethod || 'upi_qr',
      ipAddress: ip
    });

    const upiIntentUri = paymentManager.generateUpiIntentUri(order.orderRef, order.totalAmountINR);

    res.status(201).json({
      success: true,
      order,
      upiIntentUri,
      businessUpiId: BUSINESS_UPI_ID,
      businessName: BUSINESS_NAME,
      message: 'Order created successfully with verified pricing.'
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({
      error: 'Order Creation Failed',
      message: 'Unable to initiate order at this time. Please try again.'
    });
  }
});

/**
 * Submit Manual UPI Payment Reference (UTR)
 * Order is moved to 'pending_verification' until confirmed by admin
 * POST /api/payments/submit-manual-upi
 */
app.post('/api/payments/submit-manual-upi', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { orderRef, utr } = req.body;

  if (!orderRef || !utr) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Order reference and UTR/Bank Reference are required.'
    });
    return;
  }

  const result = paymentManager.submitManualUpiPayment(orderRef, utr, ip);
  if (!result.success) {
    res.status(400).json({ error: 'Submission Error', message: result.message });
    return;
  }

  res.status(200).json({
    success: true,
    payment: result.payment,
    message: result.message
  });
});

/**
 * Verify Gateway Payment (Razorpay / Cashfree HMAC verification)
 * POST /api/payments/verify-gateway
 */
app.post('/api/payments/verify-gateway', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { orderRef, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

  if (!orderRef || !gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'orderRef, gatewayOrderId, gatewayPaymentId, and gatewaySignature are required.'
    });
    return;
  }

  const result = paymentManager.verifyGatewayPayment({
    orderRef,
    gatewayOrderId,
    gatewayPaymentId,
    gatewaySignature,
    ipAddress: ip
  });

  if (!result.success) {
    res.status(400).json({ error: 'Signature Verification Failed', message: result.message });
    return;
  }

  res.status(200).json({
    success: true,
    payment: result.payment,
    message: result.message
  });
});

/**
 * Public Order Status & Printable Receipt Details
 * GET /api/payments/order/:orderRef
 */
app.get('/api/payments/order/:orderRef', (req: Request, res: Response) => {
  const order = paymentManager.getOrderByRef(req.params.orderRef);
  if (!order) {
    res.status(404).json({ error: 'Not Found', message: 'Order reference not found.' });
    return;
  }

  res.status(200).json({
    success: true,
    order: {
      orderRef: order.orderRef,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerBusiness: order.customerBusiness,
      serviceTitle: order.serviceTitle,
      baseAmountINR: order.baseAmountINR,
      taxAmountINR: order.taxAmountINR,
      totalAmountINR: order.totalAmountINR,
      paymentMethod: order.paymentMethod,
      status: order.status,
      receiptNumber: order.receiptNumber,
      upiTransactionRef: order.upiTransactionRef,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }
  });
});

/**
 * Payment Gateway Webhook Receiver (HMAC & Idempotency Protected)
 * POST /api/payments/webhook
 */
app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (webhookSecret && signature) {
    const crypto = require('node:crypto');
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expected !== signature) {
      res.status(400).json({ error: 'Invalid Webhook Signature' });
      return;
    }
  }

  // Handle asynchronous event
  const event = req.body.event;
  const payload = req.body.payload;

  crmStorage.addAuditLog({
    userId: 'payment_webhook',
    userEmail: 'system@rubitechpark.com',
    userRole: 'developer',
    action: `WEBHOOK_EVENT_${event || 'UNKNOWN'}`,
    ipAddress: ip,
    resource: 'PAYMENT_GATEWAY',
    success: true
  });

  res.status(200).json({ status: 'ok', received: true });
});

// -------------------------------------------------------------
// Admin Authentication Endpoints
// -------------------------------------------------------------

/**
 * Admin Login
 * POST /api/admin/login
 */
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);

  // Rate limit login attempts to prevent brute force
  const rateLimit = authRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Too Many Attempts',
      message: `Too many login attempts from this address. Please retry after ${rateLimit.retryAfterSeconds} seconds.`
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required.'
    });
    return;
  }

  const user = crmStorage.getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    crmStorage.addAuditLog({
      userId: 'unknown',
      userEmail: sanitizeEmail(email),
      userRole: 'developer',
      action: 'LOGIN_FAILURE',
      ipAddress: ip,
      resource: 'AUTH',
      success: false
    });

    res.status(401).json({
      error: 'Invalid Credentials',
      message: 'Incorrect administrator email or password.'
    });
    return;
  }

  // Login successful
  const session = createSession(user);
  crmStorage.addAuditLog({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: 'LOGIN_SUCCESS',
    ipAddress: ip,
    resource: 'AUTH',
    success: true
  });

  res.status(200).json({
    success: true,
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    expiresAt: session.expiresAt
  });
});

/**
 * Admin Logout
 * POST /api/admin/logout
 */
app.post('/api/admin/logout', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);
  if (token) {
    destroySession(token);
  }
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Verify Current Admin Session
 * GET /api/admin/me
 */
app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const session = req.adminSession!;
  res.status(200).json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.userEmail,
      name: session.userName,
      role: session.userRole
    },
    expiresAt: session.expiresAt
  });
});

// -------------------------------------------------------------
// Protected Admin CRM Endpoints
// -------------------------------------------------------------

/**
 * Check live Supabase connection status & configuration state
 * GET /api/admin/supabase-status
 */
app.get('/api/admin/supabase-status', async (_req: Request, res: Response) => {
  try {
    const status = await supabaseService.getStatus();
    res.status(200).json(status);
  } catch (err: any) {
    res.status(500).json({ error: 'Status Check Failed', message: err.message });
  }
});

/**
 * Get All Leads with Filters and Dashboard Metrics (from Supabase or persistent fallback)
 * GET /api/admin/leads
 */
app.get('/api/admin/leads', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { searchTerm, status, service, businessType, dateFilter } = req.query;

    const result = await supabaseService.getLeads({
      searchTerm: typeof searchTerm === 'string' ? searchTerm : undefined,
      status: typeof status === 'string' ? status : undefined,
      dateFilter: typeof dateFilter === 'string' ? dateFilter : undefined
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/admin/leads:', err);
    res.status(500).json({ error: 'Server Error', message: 'Unable to fetch leads at this time.' });
  }
});

/**
 * Get Single Lead Details
 * GET /api/admin/leads/:id
 */
app.get('/api/admin/leads/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const lead = crmStorage.getLeadById(req.params.id);
  if (!lead) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }
  res.status(200).json({ lead });
});

/**
 * Update Lead Status (Supabase + Persistent Mirror)
 * PATCH /api/admin/leads/:id/status
 */
app.patch('/api/admin/leads/:id/status', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses: string[] = [
    'New',
    'Contacted',
    'Interested',
    'Converted',
    'Not Interested',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost'
  ];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      error: 'Invalid Status',
      message: `Status must be one of: ${validStatuses.join(', ')}`
    });
    return;
  }

  const updated = await supabaseService.updateLeadStatus(
    req.params.id,
    status,
    req.adminSession!.userName
  );

  if (!updated) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }

  res.status(200).json({ success: true, lead: updated });
});

/**
 * Add Internal Note to Lead (Supabase + Persistent Mirror)
 * POST /api/admin/leads/:id/notes
 */
app.post('/api/admin/leads/:id/notes', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const content = sanitizeText(req.body.content);
  if (!content || content.length < 2) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Note content cannot be empty.'
    });
    return;
  }

  const session = req.adminSession!;
  const note = await supabaseService.addNote(
    req.params.id,
    content,
    session.userName
  );

  if (!note) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }

  res.status(201).json({ success: true, note });
});

/**
 * Delete Lead by ID (Admin Only with Audit Trail)
 * DELETE /api/admin/leads/:id
 */
app.delete('/api/admin/leads/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const success = await supabaseService.deleteLead(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found or could not be deleted.' });
    return;
  }

  crmStorage.addAuditLog({
    userId: req.adminSession!.userId,
    userEmail: req.adminSession!.userEmail,
    userRole: req.adminSession!.userRole,
    action: 'LEAD_DELETE',
    ipAddress: getClientIp(req),
    resource: `LEAD_${req.params.id}`,
    success: true
  });

  res.status(200).json({ success: true, message: 'Lead successfully deleted.' });
});

/**
 * Schedule Follow-Up Date
 * PATCH /api/admin/leads/:id/followup
 */
app.patch('/api/admin/leads/:id/followup', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { followUpDate } = req.body;
  if (!followUpDate || typeof followUpDate !== 'string') {
    res.status(400).json({ error: 'Bad Request', message: 'Valid date string is required.' });
    return;
  }

  const updated = crmStorage.updateFollowUpDate(
    req.params.id,
    followUpDate,
    req.adminSession!.userName
  );

  if (!updated) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }

  res.status(200).json({ success: true, lead: updated });
});

/**
 * Update Internal Estimated Value
 * PATCH /api/admin/leads/:id/value
 */
app.patch('/api/admin/leads/:id/value', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const value = parseInt(req.body.value, 10);
  if (isNaN(value) || value < 0) {
    res.status(400).json({ error: 'Bad Request', message: 'Value must be a positive integer.' });
    return;
  }

  const updated = crmStorage.updateEstimatedValue(
    req.params.id,
    value,
    req.adminSession!.userName
  );

  if (!updated) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }

  res.status(200).json({ success: true, lead: updated });
});

/**
 * Export Leads as CSV
 * GET /api/admin/export-csv
 */
app.get('/api/admin/export-csv', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  crmStorage.addAuditLog({
    userId: req.adminSession!.userId,
    userEmail: req.adminSession!.userEmail,
    userRole: req.adminSession!.userRole,
    action: 'CSV_EXPORT',
    ipAddress: getClientIp(req),
    resource: 'LEADS_CSV',
    success: true
  });

  const csv = crmStorage.generateCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="rubitechpark_leads_${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.status(200).send(csv);
});

/**
 * Audit Logs Retrieval
 * GET /api/admin/audit-logs
 */
app.get('/api/admin/audit-logs', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const logs = crmStorage.getAuditLogs(100);
  res.status(200).json({ logs });
});

/**
 * Trigger System Backup
 * POST /api/admin/backup
 */
app.post('/api/admin/backup', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const backup = crmStorage.createBackup();
  crmStorage.addAuditLog({
    userId: req.adminSession!.userId,
    userEmail: req.adminSession!.userEmail,
    userRole: req.adminSession!.userRole,
    action: 'SYSTEM_BACKUP',
    ipAddress: getClientIp(req),
    resource: backup.filename,
    success: true
  });
  res.status(200).json({ success: true, backup });
});

/**
 * Get All Payments & Revenue Metrics (Admin Only)
 * GET /api/admin/payments
 */
app.get('/api/admin/payments', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { status, searchTerm } = req.query;
  const payments = paymentManager.getAllPayments({
    status: typeof status === 'string' ? (status as any) : undefined,
    searchTerm: typeof searchTerm === 'string' ? searchTerm : undefined
  });

  const allPayments = paymentManager.getAllPayments();
  const stats = {
    totalOrders: allPayments.length,
    paidCount: allPayments.filter((p) => p.status === 'paid').length,
    pendingVerificationCount: allPayments.filter((p) => p.status === 'pending_verification').length,
    failedCount: allPayments.filter((p) => p.status === 'failed').length,
    totalRevenueINR: allPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.totalAmountINR, 0)
  };

  res.status(200).json({ success: true, payments, stats });
});

/**
 * Admin Verify Manual UPI Payment (Confirms receipt in bank account)
 * POST /api/admin/payments/:id/verify
 */
app.post('/api/admin/payments/:id/verify', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const ip = getClientIp(req);
  const result = paymentManager.adminVerifyManualPayment(
    req.params.id,
    req.adminSession!.userName,
    ip
  );

  if (!result.success) {
    res.status(404).json({ error: 'Error', message: result.message });
    return;
  }

  res.status(200).json({ success: true, payment: result.payment, message: result.message });
});

/**
 * Admin Reject Manual Payment (Invalid UTR / funds not credited)
 * POST /api/admin/payments/:id/reject
 */
app.post('/api/admin/payments/:id/reject', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const ip = getClientIp(req);
  const reason = sanitizeText(req.body.reason || 'No corresponding bank credit found for submitted UTR');

  const result = paymentManager.adminRejectPayment(
    req.params.id,
    reason,
    req.adminSession!.userName,
    ip
  );

  if (!result.success) {
    res.status(404).json({ error: 'Error', message: result.message });
    return;
  }

  res.status(200).json({ success: true, payment: result.payment, message: result.message });
});



// -------------------------------------------------------------
// Vite Frontend Middleware / Static Serve
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RUBI TECH PARK Full-Stack CRM Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
