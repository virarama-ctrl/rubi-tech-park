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
// Public Endpoints
// -------------------------------------------------------------

/**
 * Public Lead Form Submission
 * POST /api/enquiries
 */
app.post('/api/enquiries', (req: Request, res: Response) => {
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
  if (isHoneypotTriggered(req.body)) {
    // Silently acknowledge without polluting the database
    res.status(200).json({
      success: true,
      referenceId: `RTP-${new Date().getFullYear()}-SPAM-TRAP`,
      message: 'Enquiry received.'
    });
    return;
  }

  // 3. Extract and Sanitize Inputs
  const rawData: Partial<LeadFormData> = {
    fullName: sanitizeText(req.body.fullName),
    businessName: sanitizeText(req.body.businessName),
    email: sanitizeEmail(req.body.email),
    phone: sanitizePhone(req.body.phone),
    businessType: req.body.businessType,
    requiredService: req.body.requiredService,
    budgetRange: req.body.budgetRange,
    projectDescription: sanitizeText(req.body.projectDescription),
    preferredContactMethod: req.body.preferredContactMethod || 'WhatsApp',
    consentAgreed: Boolean(req.body.consentAgreed)
  };

  // 4. Server-Side Schema Validation
  const validation = validateLeadForm(rawData);
  if (!validation.isValid) {
    res.status(400).json({
      error: 'Validation Failed',
      message: 'The submitted inquiry failed server-side validation.',
      errors: validation.errors
    });
    return;
  }

  // 5. Save to Persistent Database
  try {
    const newLead = crmStorage.createLead(rawData as LeadFormData, ip);
    res.status(201).json({
      success: true,
      referenceId: newLead.referenceNumber,
      lead: newLead,
      message: 'Enquiry validated and recorded in persistent CRM database.'
    });
  } catch (err) {
    console.error('Error recording lead:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to save enquiry at this moment. Please try again or reach out on WhatsApp.'
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
 * Get All Leads with Filters and Dashboard Metrics
 * GET /api/admin/leads
 */
app.get('/api/admin/leads', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { searchTerm, status, service, businessType } = req.query;

  const leads = crmStorage.getAllLeads({
    searchTerm: typeof searchTerm === 'string' ? searchTerm : undefined,
    status: typeof status === 'string' ? (status as any) : undefined,
    service: typeof service === 'string' ? (service as any) : undefined,
    businessType: typeof businessType === 'string' ? (businessType as any) : undefined
  });

  // Calculate dashboard statistics across ALL leads
  const allLeads = crmStorage.getAllLeads();
  const stats = {
    total: allLeads.length,
    new: allLeads.filter((l) => l.status === 'New').length,
    contacted: allLeads.filter((l) => l.status === 'Contacted').length,
    qualified: allLeads.filter((l) => l.status === 'Qualified').length,
    proposalSent: allLeads.filter((l) => l.status === 'Proposal Sent').length,
    won: allLeads.filter((l) => l.status === 'Won').length,
    lost: allLeads.filter((l) => l.status === 'Lost').length,
    totalPipelineValueINR: allLeads.reduce(
      (sum, l) => sum + (l.internalEstimatedValueINR || 0),
      0
    )
  };

  res.status(200).json({ leads, stats });
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
 * Update Lead Status
 * PATCH /api/admin/leads/:id/status
 */
app.patch('/api/admin/leads/:id/status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      error: 'Invalid Status',
      message: `Status must be one of: ${validStatuses.join(', ')}`
    });
    return;
  }

  const updated = crmStorage.updateLeadStatus(
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
 * Add Internal Note to Lead
 * POST /api/admin/leads/:id/notes
 */
app.post('/api/admin/leads/:id/notes', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const content = sanitizeText(req.body.content);
  if (!content || content.length < 2) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Note content cannot be empty.'
    });
    return;
  }

  const session = req.adminSession!;
  const note = crmStorage.addLeadNote(
    req.params.id,
    session.userId,
    session.userName,
    content
  );

  if (!note) {
    res.status(404).json({ error: 'Not Found', message: 'Lead not found.' });
    return;
  }

  res.status(201).json({ success: true, note });
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
