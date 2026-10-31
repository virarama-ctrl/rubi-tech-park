import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const apiKey = process.env.GEMINI_API_KEY;

// System Knowledge Base for RUBI Assistant
const RUBI_ASSISTANT_SYSTEM_INSTRUCTION = `
You are "RUBI Assistant", the professional, courteous, and efficient AI customer consultant for RUBI TECH PARK.
Location: Gandhipuram, Coimbatore, Tamil Nadu, India.
Contact WhatsApp: +91 82205 50829 | Email: rubienterprisesgst@gmail.com.

YOUR MISSION:
Help website visitors understand our services, guide them to the correct category, answer questions accurately, and collect customer lead details so our human team can follow up with exact quotes.

OUR THREE MAIN SERVICE CATEGORIES:

CATEGORY A: SOFTWARE DEVELOPMENT & DIGITAL SOLUTIONS
1. Website Design & Development (corporate, responsive, SEO-ready)
2. Business Websites (SME, industrial, catalog websites)
3. E-commerce Website Development (online storefronts, payment gateways, WhatsApp ordering)
4. Custom Software Development (bespoke business logic, web & desktop software)
5. CRM Development (sales pipeline, customer records, activity logs)
6. Billing & Business Management Software (GST invoicing, stock management)
7. Web Applications (cloud-based SaaS, customer portals)
8. Mobile Application Development (iOS & Android cross-platform solutions)
9. Business Automation (workflow automation, WhatsApp triggers, document generators)
10. Digital Transformation Solutions (modernizing legacy pen-and-paper processes)
11. Website Maintenance & Technical Support (updates, security, speed optimization)
12. Other Custom Digital Solutions (API integrations, specialized software)
Pricing Rule for Category A: All services are charged based on project requirements, complexity, and agreed scope. Never invent fixed prices. Offer a custom quotation after reviewing their brief.

CATEGORY B: STATUTORY & COMPLIANCE SERVICES
1. GST Registration
2. GST Return Filing (GSTR-1, GSTR-3B, Annual Returns)
3. GST Amendments & Cancellation
4. Income Tax Return (ITR) Assistance (Salaried, Business, Capital Gains)
5. PAN-related Services (New PAN, Corrections)
6. MSME / Udyam Registration
7. FSSAI Registration & Licensing Assistance (Food business operators)
8. BIS Certification Assistance
9. Trademark (TM) Registration Assistance (Brand protection, search, filing)
10. Patent Filing Assistance
11. Business Licences (Shop & Establishment, local municipal licences)
12. Trade Licence Assistance
13. Other Business Registrations (Partnership, LLP, Private Limited documentation)
14. Pharma and Medical Licence Assistance (Drug licence documentation)
15. Statutory Documentation & Compliance Support
Compliance Rules for Category B:
- Explicitly state that registrations are subject to eligibility, document verification, and applicable government rules.
- Government official fees and professional consultancy charges are separate.
- Do NOT promise guaranteed approval. We provide expert facilitation and documentation support.
- We are a professional service facilitator, NOT a government department.
- Pricing is work-based upon document review.

CATEGORY C: E-SERVICES (For Individuals & Public)
1. PAN Card Application / Correction Assistance
2. Voter ID Application / Correction Assistance
3. Passport Application Assistance
4. Passport Renewal Assistance
5. Address Change Assistance
6. Document Application Support
7. Online Form Filling
8. Certificate Application Assistance (Community, Income, Nativity guidance)
9. Other Eligible Online Government Services
10. Ration Card Application / Correction Assistance
11. EB New application / Correction Assistance
MANDATORY E-SERVICE BOOKING PAYMENT RULE:
- For EVERY e-service booking:
  * Initial booking charge: ₹200
  * GST at 18% on booking charge: ₹36
  * Total initial booking amount: ₹236
- You must explain this clearly:
  "Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately."
- Never claim ₹236 is the full price. It confirms the booking and initial intake.

CORE CONDUCT RULES:
- Never invent prices, government fees, approval guarantees, or legal advice.
- Never ask for passwords, OTPs, Aadhaar OTPs, bank account PINs, or sensitive financial secrets.
- Always provide human escalation via WhatsApp: +91 82205 50829.
- Maintain a warm, polished, professional, and trustworthy tone.
- When the customer provides details, gently ask for:
  1. Full Name
  2. Mobile Number (10 digits)
  3. WhatsApp Number (if different)
  4. Email Address
  5. Customer Type (Individual / Business / Startup)
  6. Requirement description
- When these details are clear, summarize the enquiry neatly and invite them to confirm.
`;

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  source: 'gemini' | 'fallback';
  modelUsed?: string;
  enquiryDraft?: {
    customerName?: string;
    mobileNumber?: string;
    email?: string;
    customerType?: string;
    serviceCategory?: string;
    selectedService?: string;
    requirement?: string;
    bookingAmount?: number;
    readyForSubmission?: boolean;
  };
}

/**
 * Handle incoming chat message with Gemini API and deterministic fallback
 */
export async function processCustomerChat(
  history: ChatMessage[],
  newMessage: string
): Promise<ChatResponse> {
  const trimmed = newMessage.trim();

  // If no Gemini client or API key is not present, use the intelligent business knowledge fallback
  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return generateSmartFallback(trimmed, history);
  }

  try {
    // Construct conversation contents
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${RUBI_ASSISTANT_SYSTEM_INSTRUCTION}\n\nHere is the ongoing conversation history with the user:` }]
      },
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: trimmed }]
      }
    ];

    const generatePromise = aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.3,
        maxOutputTokens: 600
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), 4000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const replyText = response.text || "Hello! I am RUBI Assistant. How can I help you today with Software Development, Statutory & Compliance, or E-Services?";

    return {
      reply: replyText,
      source: 'gemini',
      modelUsed: GEMINI_MODEL
    };
  } catch (err: any) {
    console.warn('[Gemini API Call Failed or timed out, falling back to rule-based engine]:', err.message);
    return generateSmartFallback(trimmed, history, err.message);
  }
}

/**
 * Rule-based fallback engine that ensures 100% uptime even if Gemini API quota or network fluctuates
 */
function generateSmartFallback(
  input: string,
  _history: ChatMessage[],
  _errorReason?: string
): ChatResponse {
  const lower = input.toLowerCase();

  // Category C: E-Services & ₹236 rule
  if (lower.includes('e-service') || lower.includes('eservice') || lower.includes('pan') || lower.includes('voter') || lower.includes('passport') || lower.includes('ration') || lower.includes('eb') || lower.includes('236')) {
    return {
      reply: `For all online E-Services (PAN, Voter ID, Passport, Ration Card, EB Services, etc.), our initial booking charge is ₹236 (₹200 + 18% GST ₹36).

Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.

Would you like to book an e-service now? Please share your Name, Mobile Number, and the specific service needed, or message our team on WhatsApp at +91 82205 50829!`,
      source: 'fallback'
    };
  }

  // Category B: Statutory & Compliance
  if (lower.includes('gst') || lower.includes('itr') || lower.includes('tax') || lower.includes('msme') || lower.includes('udyam') || lower.includes('fssai') || lower.includes('trademark') || lower.includes('patent') || lower.includes('licence') || lower.includes('license') || lower.includes('compliance')) {
    return {
      reply: `RUBI TECH PARK provides comprehensive Statutory & Compliance documentation assistance:
• GST Registration, Return Filing & Amendments
• Income Tax Returns (ITR)
• MSME / Udyam Registration
• FSSAI Food Business Licensing
• Trademark (TM) & Patent Filing Assistance
• Shop & Trade Licences

Important: Services are subject to eligibility, document verification, and applicable government rules. Government official fees and professional charges are separate, and work-based quotations are provided after reviewing your business details.

May I know your Business Name, Mobile Number, and the specific compliance service you need? You can also reach our experts directly on WhatsApp at +91 82205 50829.`,
      source: 'fallback'
    };
  }

  // Category A: Software Development
  if (lower.includes('software') || lower.includes('website') || lower.includes('web') || lower.includes('crm') || lower.includes('ecommerce') || lower.includes('app') || lower.includes('billing') || lower.includes('automation')) {
    return {
      reply: `RUBI TECH PARK builds world-class digital solutions:
1. Website Design & Business Websites
2. E-commerce Storefronts with Indian Payment Gateways & WhatsApp
3. Custom CRM & Pipeline Software
4. Billing & Inventory Management Systems
5. Web & Mobile Applications (iOS / Android)
6. Business Workflow Automation

All software services are quoted based on project complexity, scope, and technical deliverables.

Could you share:
1. Your Name & Business Name
2. Mobile Number & Email
3. Brief description of what you are planning to build?

Our senior technology consultant will connect with you with a detailed scope estimate!`,
      source: 'fallback'
    };
  }

  // General Welcome & Category selection
  return {
    reply: `Hello and welcome to RUBI TECH PARK! I am RUBI Assistant.

We specialize in three main service areas:
1. Software Development & Digital Solutions (Websites, E-Commerce, Custom CRM, Billing, Mobile Apps)
2. Statutory & Compliance Services (GST, ITR, MSME, FSSAI, Trademarks, Licences)
3. E-Services (PAN Card, Voter ID, Passport, Ration Card, EB Services — ₹236 initial booking deposit)

Which category of service are you looking for today? You can also message our support desk directly on WhatsApp at +91 82205 50829.`,
    source: 'fallback'
  };
}
