import { ServiceDetail, CaseStudy, PricingPlan, ServiceCategoryType } from '../types';

export interface AgencyConfiguration {
  brandName: string;
  tagline: string;
  primaryLocation: string;
  servingAreas: string[];
  contactEmail: string;
  whatsappNumber: string;
  phone: string;
  defaultWhatsAppMessage: string;
  defaultWhatsAppMessageTa: string;
  startingPrices: {
    businessWebsite: number;
    ecommerceWebsite: number;
    customCRM: number;
    websitePlusCRM: number;
  };
}

export const AGENCY_CONFIG: AgencyConfiguration = {
  brandName: 'RUBI TECH PARK',
  tagline: 'Technology, Compliance & Digital Services — All Under One Roof',
  primaryLocation: 'Gandhipuram, Coimbatore, Tamil Nadu, India',
  servingAreas: [
    'Coimbatore',
    'Chennai',
    'Bengaluru',
    'Mumbai',
    'Hyderabad',
    'Tier-2 Industrial Hubs Across Tamil Nadu & India'
  ],
  contactEmail: 'rubienterprisesgst@gmail.com',
  whatsappNumber: '918220550829',
  phone: '+91 82205 50829',
  defaultWhatsAppMessage: 'Hello RUBI TECH PARK, I would like to enquire about your software and digital services.',
  defaultWhatsAppMessageTa: 'வணக்கம் RUBI TECH PARK, உங்கள் மென்பொருள் மற்றும் டிஜிட்டல் சேவைகள் குறித்து விவரங்கள் தெரிந்துகொள்ள விரும்புகிறேன்.',
  startingPrices: {
    businessWebsite: 5000,
    ecommerceWebsite: 15000,
    customCRM: 20000,
    websitePlusCRM: 30000
  }
};

/**
 * Helper to build verified wa.me link with encoded prefilled message
 */
export function buildServiceWhatsAppUrl(message: string): string {
  return `https://wa.me/918220550829?text=${encodeURIComponent(message)}`;
}

// -------------------------------------------------------------------
// CATEGORY A: SOFTWARE DEVELOPMENT & DIGITAL SOLUTIONS (12 Services)
// -------------------------------------------------------------------
export const SOFTWARE_SERVICES: ServiceDetail[] = [
  {
    id: 'website-design-development',
    slug: 'service-business-websites',
    title: 'Website Design & Development',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Modern, high-conversion responsive corporate websites built with high visual appeal, SEO fundamentals, and mobile-first speed.',
    detailedScope: 'Custom UX/UI architecture, mobile responsiveness, semantic HTML5, Schema.org structured data, and direct WhatsApp lead capture.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Website Design & Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Website Design & Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'business-websites',
    slug: 'service-business-websites',
    title: 'Business Websites',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Credibility-building digital homes for companies, factories, retail shops, and professional service consultants.',
    detailedScope: 'Company profile, product and service showcase, location maps, SSL encryption, and direct click-to-call / WhatsApp funnels.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Business Website Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Business Website Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'ecommerce-website-development',
    slug: 'service-ecommerce',
    title: 'E-commerce Website Development',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Transaction-ready online storefronts equipped with Indian payment gateways (UPI, Cards, Netbanking), inventory management, and WhatsApp updates.',
    detailedScope: 'Product catalog with variants, shopping cart, GST invoice generator, order notifications, and courier tracking hooks.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in E-commerce Website Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in E-commerce Website Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'custom-software-development',
    slug: 'service-custom-crm',
    title: 'Custom Software Development',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Tailored operational software built around your exact commercial workflows, eliminating messy spreadsheets and manual errors.',
    detailedScope: 'Requirement analysis, schema modeling, role-based authorization, automated document generation, and secure cloud deployment.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Custom Software Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Custom Software Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'crm-development',
    slug: 'service-custom-crm',
    title: 'CRM Development',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Specialized lead and customer relationship management systems featuring multi-stage pipelines, follow-up calendars, and activity trails.',
    detailedScope: 'Lead intake, stage transitions, agent assignment, notes timelines, CSV data export, and executive summary dashboards.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in CRM Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in CRM Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'billing-business-management-software',
    slug: 'service-custom-crm',
    title: 'Billing & Business Management Software',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Integrated billing, invoicing, and inventory tracking software tailored for Indian retail, wholesale, and distributor realities.',
    detailedScope: 'GST invoice creation, barcode and SKU lookup, multi-counter billing, customer ledger records, and daily sales reports.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Billing & Business Management Software. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Billing & Business Management Software. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'web-applications',
    slug: 'service-custom-crm',
    title: 'Web Applications',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'High-performance interactive web portals, client dashboards, and cloud web applications engineered with React and TypeScript.',
    detailedScope: 'Full-stack engineering, responsive UI, REST APIs, real-time database persistence, and automated backup snapshots.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Web Applications Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Web Applications Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'mobile-application-development',
    slug: 'service-custom-crm',
    title: 'Mobile Application Development',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Cross-platform Android and iOS mobile applications with push notifications, offline capability, and smooth animations.',
    detailedScope: 'Native performance, Progressive Web Apps (PWA), app store preparation, authentication, and backend API integration.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Mobile Application Development. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Mobile Application Development. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'business-automation',
    slug: 'service-ai-automation',
    title: 'Business Automation',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Smart workflow automation connecting website forms, WhatsApp notifications, Google Workspace, and internal backends.',
    detailedScope: 'Automated inquiry dispatch, trigger-based status notifications, CRM synchronization, and repetitive task elimination.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Business Automation. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Business Automation. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'digital-transformation-solutions',
    slug: 'service-crm-integration',
    title: 'Digital Transformation Solutions',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'End-to-end modernization converting legacy paper-based operations into streamlined digital systems for Indian enterprises.',
    detailedScope: 'Process mapping, legacy data migration, cloud infrastructure setup, employee onboarding, and operational monitoring.',
    whatsappMessage: 'Hello RUBI TECH PARK, I am interested in Digital Transformation Solutions. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I am interested in Digital Transformation Solutions. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'website-maintenance-technical-support',
    slug: 'service-business-websites',
    title: 'Website Maintenance & Technical Support',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Continuous technical monitoring, speed optimization, security updates, uptime maintenance, and content changes.',
    detailedScope: 'Monthly backup snapshots, SSL renewals, DNS management, bug fixes, performance audits, and SLA-backed engineer support.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need Website Maintenance & Technical Support. Please share the details and quotation.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need Website Maintenance & Technical Support. Please share the details and quotation.'),
    isWorkBasedPricing: true
  },
  {
    id: 'other-custom-digital-solutions',
    slug: 'service-custom-crm',
    title: 'Other Custom Digital Solutions',
    category: 'software',
    categoryTitle: 'Software Development & Digital Solutions',
    shortDescription: 'Specialized bespoke digital tools, API bridges, QR code utilities, custom calculators, and proprietary software modules.',
    detailedScope: 'Custom scoping, architectural review, rapid prototyping, and private deployment to client cloud accounts.',
    whatsappMessage: 'Hello RUBI TECH PARK, I have an inquiry for a Custom Digital Solution. Please connect with me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I have an inquiry for a Custom Digital Solution. Please connect with me.'),
    isWorkBasedPricing: true
  }
];

// -------------------------------------------------------------------
// CATEGORY B: STATUTORY & COMPLIANCE SERVICES (15 Services)
// -------------------------------------------------------------------
export const COMPLIANCE_SERVICES: ServiceDetail[] = [
  {
    id: 'gst-registration',
    slug: 'services',
    title: 'GST Registration',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Complete filing and documentation assistance for obtaining Goods & Services Tax (GSTIN) registration for new or existing enterprises.',
    detailedScope: 'Document review, portal application preparation, ARN tracking, query resolution, and GST certificate delivery.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with GST Registration. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with GST Registration. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Subject to eligibility, document verification, and applicable government rules. Government official fees and professional charges are separate. No guaranteed approval.'
  },
  {
    id: 'gst-return-filing',
    slug: 'services',
    title: 'GST Return Filing',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Timely and accurate monthly or quarterly filing assistance for GSTR-1, GSTR-3B, CMP-08, and Annual Returns (GSTR-9).',
    detailedScope: 'Sales and purchase invoice reconciliation, ITC verification, computation of tax liabilities, and return filing receipts.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with GST Return Filing. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with GST Return Filing. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Timely filing prevents late fees. Accurate invoice matching ensures proper Input Tax Credit (ITC).'
  },
  {
    id: 'gst-amendments',
    slug: 'services',
    title: 'GST Amendments',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Assistance in updating core and non-core fields in your existing GST registration, including address change, partner/director addition, or cancellation.',
    detailedScope: 'Drafting amendment letters, uploading proof documents, filing rectification forms, and following up on jurisdictional approval.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with GST Amendments. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with GST Amendments. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Requires verified supporting documents such as rental agreements, electricity bills, or board resolutions.'
  },
  {
    id: 'itr-assistance',
    slug: 'services',
    title: 'Income Tax Return (ITR) Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Professional preparation and electronic filing support for ITR-1, ITR-2, ITR-3, and ITR-4 for salaried, professionals, and business owners.',
    detailedScope: 'Form 16/26AS/AIS verification, income categorization, deduction optimization under eligible sections, and e-verification guidance.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Income Tax Return (ITR) Filing. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Income Tax Return (ITR) Filing. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Subject to verified income disclosures and applicable Income Tax Department guidelines.'
  },
  {
    id: 'pan-services',
    slug: 'services',
    title: 'PAN-related Services',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Assistance with enterprise and individual Permanent Account Number applications, name/DOB corrections, and Aadhaar-PAN linking.',
    detailedScope: 'Application form submission, supporting identity and address documentation scrutiny, and tracking acknowledgement.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with PAN Card Services. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with PAN Card Services. Please contact me.'),
    isWorkBasedPricing: true
  },
  {
    id: 'msme-udyam-registration',
    slug: 'services',
    title: 'MSME / Udyam Registration',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Official Udyam registration assistance for micro, small, and medium manufacturing and service enterprises to unlock government subsidies.',
    detailedScope: 'NIC code classification, enterprise categorization, Aadhaar validation, and instant Udyam Registration Certificate retrieval.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with MSME/Udyam Registration.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with MSME/Udyam Registration.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Government official registration is free; professional documentation assistance fee is charged separately.'
  },
  {
    id: 'fssai-registration-licensing',
    slug: 'services',
    title: 'FSSAI Registration & Licensing Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Food Safety and Standards Authority of India (FSSAI) Basic Registration, State Licence, and Central Licence application assistance.',
    detailedScope: 'Food business operator (FBO) category selection, document compilation, premises plan upload, and FosCos portal management.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with FSSAI Registration.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with FSSAI Registration.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Statutory government fees depend on the business turnover and licence tier (Basic vs State vs Central).'
  },
  {
    id: 'bis-certification-assistance',
    slug: 'services',
    title: 'BIS Certification Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Documentation and application coordination for Bureau of Indian Standards (BIS) conformity certification and ISI mark compliance.',
    detailedScope: 'Standard identification (IS code), factory inspection documentation guidance, lab test report compilation, and portal submission.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with BIS Certification. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with BIS Certification. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Subject to independent lab testing, factory inspection audits, and BIS department regulations.'
  },
  {
    id: 'trademark-registration-assistance',
    slug: 'services',
    title: 'Trademark (TM) Registration Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Brand name, logo, and slogan intellectual property protection assistance under the Indian Trademarks Act.',
    detailedScope: 'Trademark class search, distinctiveness assessment, Form TM-A drafting and electronic filing, and examination tracking.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Trademark Registration.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Trademark Registration.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Government fees are set by the Controller General of Patents, Designs and Trade Marks (separate for individual vs body corporate).'
  },
  {
    id: 'patent-filing-assistance',
    slug: 'services',
    title: 'Patent Filing Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Preliminary documentation, prior art search coordination, and provisional/complete patent application submission support.',
    detailedScope: 'Invention disclosure review, technical specification alignment, Form 1 and Form 2 preparation, and patent office docketing.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Patent Filing. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Patent Filing. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Patentability is determined solely by the Indian Patent Office after substantive examination.'
  },
  {
    id: 'business-licences',
    slug: 'services',
    title: 'Business Licences',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'General business compliance guidance for Shops & Commercial Establishments registration and local enterprise approvals.',
    detailedScope: 'Local jurisdictional rules review, documentation packaging, online municipal portal submission, and licence renewal tracking.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Business Licences. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Business Licences. Please contact me.'),
    isWorkBasedPricing: true
  },
  {
    id: 'trade-licence-assistance',
    slug: 'services',
    title: 'Trade Licence Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Municipal corporation trade licence application and renewal assistance for retail shops, manufacturing sheds, and commercial spaces.',
    detailedScope: 'Property tax receipt verification, zoning compliance check, safety clearance paperwork, and corporation application filing.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Trade Licence. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Trade Licence. Please contact me.'),
    isWorkBasedPricing: true
  },
  {
    id: 'other-business-registrations',
    slug: 'services',
    title: 'Other Business Registrations',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Sole proprietorship declarations, partnership deed drafting facilitation, Import-Export Code (IEC), and specialized business IDs.',
    detailedScope: 'Notary coordination, DGFT portal IEC registration, bank account resolution certificates, and statutory records.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Business Registrations. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Business Registrations. Please contact me.'),
    isWorkBasedPricing: true
  },
  {
    id: 'pharma-medical-licence-assistance',
    slug: 'services',
    title: 'Pharma and Medical Licence Assistance',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Retail and wholesale drug licence documentation assistance under the Drugs & Cosmetics Act for pharmacies and healthcare distributors.',
    detailedScope: 'Pharmacist registration verification, premises layout compliance guidance, cold storage declarations, and drug control portal filing.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Pharma and Medical Licence. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Pharma and Medical Licence. Please contact me.'),
    isWorkBasedPricing: true,
    complianceNotice: 'Requires qualified registered pharmacist and drug inspector premises inspection.'
  },
  {
    id: 'statutory-documentation-compliance-support',
    slug: 'services',
    title: 'Statutory Documentation & Compliance Support',
    category: 'compliance',
    categoryTitle: 'Statutory & Compliance Services',
    shortDescription: 'Ongoing annual compliance maintenance, register maintenance, corporate filings assistance, and legal notice response support.',
    detailedScope: 'Statutory calendar management, periodic audit checklist, compliance health check, and professional document drafting.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need Statutory Documentation & Compliance Support. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need Statutory Documentation & Compliance Support. Please contact me.'),
    isWorkBasedPricing: true
  }
];

// -------------------------------------------------------------------
// CATEGORY C: E-SERVICES (11 Services with Mandatory ₹236 Booking Rule)
// -------------------------------------------------------------------
export const E_SERVICES: ServiceDetail[] = [
  {
    id: 'pan-card-application-correction',
    slug: 'services',
    title: 'PAN Card Application / Correction Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Assistance with new Instant e-PAN, physical PAN card applications, surname/father name changes, and date of birth corrections.',
    detailedScope: 'Application form submission, document scrutiny, acknowledgement receipt generation, and tracking status on NSDL/UTIITSL.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with PAN Card Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with PAN Card Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'voter-id-application-correction',
    slug: 'services',
    title: 'Voter ID Application / Correction Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Voter Service Portal (Form 6 new enrollment, Form 8 correction, shifting of residence) digital application assistance.',
    detailedScope: 'EPIC number search, address verification proof upload, reference tracking, and Booth Level Officer (BLO) verification guidance.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Voter ID Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Voter ID Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'passport-application-assistance',
    slug: 'services',
    title: 'Passport Application Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Passport Seva portal profile creation, fresh ordinary passport application filling, and Passport Seva Kendra (PSK) appointment booking.',
    detailedScope: 'Document eligibility audit, appointment calendar slot selection, fee payment assistance, and document checklist dispatch.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Passport Application Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Passport Application Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'passport-renewal-assistance',
    slug: 'services',
    title: 'Passport Renewal Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Re-issue of expired or expiring Indian passports, exhaustion of pages, or change in personal particulars.',
    detailedScope: 'Previous passport verification, Tatkaal vs Normal assessment, appointment rescheduling, and verification guidance.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Passport Renewal Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Passport Renewal Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'address-change-assistance',
    slug: 'services',
    title: 'Address Change Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Guidance and document upload assistance for updating current residential address across eligible government identity documents.',
    detailedScope: 'Valid supporting document checklist (gazette, utility bills, tenancy agreement) and online portal form completion.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Address Change Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Address Change Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'document-application-support',
    slug: 'services',
    title: 'Document Application Support',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Scrutiny, resizing, PDF compression, and digital signature attachment assistance for official online applications.',
    detailedScope: 'Resolution and format adjustment according to specific department requirements and error-free submission verification.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need Document Application Support. Please contact me.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need Document Application Support. Please contact me.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'online-form-filling',
    slug: 'services',
    title: 'Online Form Filling',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Accurate form completion assistance for entrance exams, employment applications, public welfare schemes, and scholarships.',
    detailedScope: 'Field-by-field verification, preview confirmation with applicant before submission, and receipt printout generation.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need Online Form Filling Assistance.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need Online Form Filling Assistance.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'certificate-application-assistance',
    slug: 'services',
    title: 'Certificate Application Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Application guidance through e-Sevai / Revenue portals for Community, Nativity, Income, First Graduate, and Legal Heir certificates.',
    detailedScope: 'VAO/Revenue Inspector document checklist, CAN number creation, electronic application submission, and CAN status tracking.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need Certificate Application Assistance.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need Certificate Application Assistance.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'other-online-government-services',
    slug: 'services',
    title: 'Other Eligible Online Government Services',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'Assistance navigating digital government portals and public utility e-services available online.',
    detailedScope: 'Portal account creation, service discovery, requirement verification, application submission, and tracking.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with an Online Government Service.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with an Online Government Service.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'ration-card-application-correction',
    slug: 'services',
    title: 'Ration Card Application / Correction Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'TNPDS Smart Card new family card application, addition/removal of family member, address change, and card surrender assistance.',
    detailedScope: 'Family head Aadhaar linking, LPG connection details entry, address proof upload, and TSO approval status tracking.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Ration Card / Smart Card Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Ration Card / Smart Card Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  },
  {
    id: 'eb-new-application-correction',
    slug: 'services',
    title: 'EB New Application / Correction Assistance',
    category: 'eservices',
    categoryTitle: 'E-Services (Citizen & Online Services)',
    shortDescription: 'TANGEDCO / State Electricity Board new domestic or commercial service connection application, name transfer, and tariff change support.',
    detailedScope: 'Property ownership / tenancy deed verification, wiring contractor completion form coordination, and e-application submission.',
    whatsappMessage: 'Hello RUBI TECH PARK, I need assistance with Electricity Board (EB) Services.',
    whatsappUrl: buildServiceWhatsAppUrl('Hello RUBI TECH PARK, I need assistance with Electricity Board (EB) Services.'),
    isWorkBasedPricing: false,
    isEService: true,
    bookingBase: 200,
    bookingGst: 36,
    bookingAmount: 236,
    complianceNotice: 'Book your e-service by paying ₹236 (₹200 + 18% GST). The remaining service charges will be communicated after reviewing your requirements and collected after completion of the work. Applicable government fees and additional charges, if any, will be informed separately.'
  }
];

// Combined full list of services
export const SERVICES_DATA: ServiceDetail[] = [
  ...SOFTWARE_SERVICES,
  ...COMPLIANCE_SERVICES,
  ...E_SERVICES
];

// -------------------------------------------------------------------
// PORTFOLIO / CASE STUDIES: PRESERVE REAL PROJECTS & ADD 3 SHOWCASES
// -------------------------------------------------------------------
export const CASE_STUDIES: CaseStudy[] = [
  // Showcase 1: Kuralvaani
  {
    id: 'kuralvaani',
    projectName: 'Kuralvaani',
    title: 'Kuralvaani – Tamil Voice Prompt Narration Studio',
    clientName: 'Developed by RUBI TECH PARK',
    industry: 'Voice AI & Speech Technology',
    categoryTag: 'AI & Voice Technology',
    location: 'Tamil Nadu, India',
    status: 'Development / Enhancement',
    summary: 'A Tamil-focused AI-powered voice narration platform designed to convert written text into natural audio. The platform includes user authentication, voice generation workflows and premium subscription functionality.',
    challenge: 'High-quality, emotionally natural Tamil text-to-speech models have historically been underserved by global providers, making content creation in Tamil slow and cost-prohibitive.',
    solution: 'Engineered an intuitive narration studio featuring speech synthesis pipelines, personal voice sample uploads, subscription tiers, and audio asset export.',
    keyDeliverables: [
      'Tamil text-to-speech experience',
      'AI voice narration workflow',
      'User authentication and profile system',
      'Premium subscription architecture',
      'Personal voice sample workflow',
      'Responsive application interface'
    ],
    keyFeatures: [
      'Tamil text-to-speech experience',
      'AI voice narration workflow',
      'User authentication',
      'Premium subscription system',
      'Personal voice sample workflow',
      'Responsive application interface'
    ],
    technologies: ['TypeScript', 'Tamil TTS Pipeline', 'Gemini Audio Synthesis', 'Tailwind CSS', 'User Auth'],
    liveUrl: 'https://ai.studio/apps/f1e3cb9e-f4ba-4a33-a642-0d746bf6cec1?fullscreenApplet=true',
    isVerifiedReal: true
  },
  // Showcase 2: Tamil Gold Buyer
  {
    id: 'tamil-gold-buyer',
    projectName: 'Tamil Gold Buyer',
    title: 'Tamil Gold Buyer – Gold & Silver Valuation Platform',
    clientName: 'Developed by RUBI TECH PARK',
    industry: 'Precious Metals & FinTech',
    categoryTag: 'E-Commerce / FinTech Solutions',
    location: 'Tamil Nadu, India',
    status: 'Published Website',
    summary: 'A specialised digital platform for gold and silver buyers, featuring valuation tools, gold and silver rate information, and online precious metal product sales.',
    challenge: 'Retail and scrap gold and silver sellers needed transparent, real-time rate calculators accounting for various karat purities (24K, 22K, 18K) and live precious metal market prices.',
    solution: 'Built a comprehensive valuation web portal with real-time rate APIs, multi-item calculation breakdown, purity estimation tools, and coin/bar e-commerce catalog.',
    keyDeliverables: [
      'Gold valuation calculator',
      'Silver valuation calculator',
      'Multiple gold and silver item entries',
      'Custom weight and purity calculation options',
      'Gold and silver rate integration',
      'Gold and silver coin and bar product showcase',
      'Online purchase workflow',
      'Customer-friendly interface'
    ],
    keyFeatures: [
      'Gold valuation calculator',
      'Silver valuation calculator',
      'Multiple gold and silver item entries',
      'Custom weight and purity calculation options',
      'Gold and silver rate integration',
      'Gold and silver coin and bar product showcase',
      'Online purchase workflow',
      'Customer-friendly interface'
    ],
    technologies: ['React', 'TypeScript', 'Valuation Engine', 'Indian Precious Metal APIs', 'Tailwind CSS'],
    liveUrl: 'https://www.goldandsilverbuyer.live/',
    isVerifiedReal: true
  },
  // Showcase 3: Bulkmate
  {
    id: 'bulkmate',
    projectName: 'Bulkmate',
    title: 'Bulkmate – Bulk Messaging Management Software',
    clientName: 'Developed by RUBI TECH PARK',
    industry: 'Enterprise Messaging & Communications',
    categoryTag: 'Business Software',
    location: 'India',
    status: 'Development / Commercial Preparation',
    summary: 'A business-oriented bulk messaging management platform designed to organise messaging campaigns and simplify customer communication workflows.',
    challenge: 'Commercial enterprises struggled with chaotic contact lists, lack of message delivery tracking, and disorganized campaign dispatch across marketing channels.',
    solution: 'Designed a high-throughput messaging dashboard featuring contact grouping, message template managers, scheduled dispatch, and real-time delivery telemetry.',
    keyDeliverables: [
      'Bulk messaging management interface',
      'Campaign management and scheduling',
      'Contact management and CSV segmentation',
      'Messaging activity dashboard',
      'Commercial software-oriented interface',
      'Subscription and billing architecture planned for future expansion'
    ],
    keyFeatures: [
      'Bulk messaging management interface',
      'Campaign management',
      'Contact management workflows',
      'Messaging activity dashboard',
      'Commercial software-oriented interface',
      'Subscription and billing architecture planned for future expansion'
    ],
    technologies: ['TypeScript', 'Node.js', 'Messaging Queue Architecture', 'Campaign Scheduler', 'Tailwind UI'],
    liveUrl: 'https://ai.studio/apps/f7fd26dd-b697-41f1-8a40-7d60744916a7',
    isVerifiedReal: true
  },
  // Existing Project 4: RUBI Gold & Silver
  {
    id: 'rubi-gold-silver',
    projectName: 'RUBI Gold & Silver',
    title: 'RUBI Gold & Silver: Luxury Digital Catalog & B2B Inquiry Platform',
    clientName: 'RUBI Gold & Silver',
    industry: 'Fine Jewellery & Precious Metals',
    categoryTag: 'E-Commerce / FinTech Solutions',
    location: 'Coimbatore, India',
    status: 'Live',
    summary: 'A bespoke high-end digital catalog and client inquiry portal engineered for an Indian jewellery enterprise, showcasing handcrafted ornaments with real-time purity attributes and direct customer inquiry routing.',
    challenge: 'Showroom depended on scattered WhatsApp photo albums that degraded image clarity and caused untracked lead leakages.',
    solution: 'Constructed an ultra-sharp mobile-first catalog with 22K/18K purity filters, high-resolution zoom, and direct SKU-linked WhatsApp triggers.',
    keyDeliverables: [
      'Mobile-optimized luxury jewelry digital catalog',
      'Direct SKU prefilled WhatsApp inquiry button',
      'Purity and weight specification tables',
      'Fast CDN image delivery'
    ],
    technologies: ['React', 'Tailwind CSS', 'WhatsApp Business Deep-link Engine', 'Cloudflare CDN'],
    liveUrlPlaceholder: 'Verified client deployment active',
    isVerifiedReal: true
  },
  // Existing Project 5: Apex Industrial Fasteners CRM
  {
    id: 'apex-distribution-crm',
    projectName: 'Apex Distribution CRM',
    title: 'Custom Wholesale Distribution & Order Management System',
    clientName: 'Industrial Hardware & Fasteners Supplier',
    industry: 'Industrial Distribution',
    categoryTag: 'Business Software',
    location: 'Coimbatore / Tamil Nadu',
    status: 'In Progress',
    summary: 'Tailored back-office software streamlining multi-warehouse stock visibility, dealer credit limits, and purchase order tracking for a regional distributor.',
    challenge: 'Orders received over phone calls were recorded in disjointed paper registers, causing frequent stockouts and billing errors.',
    solution: 'Constructed an integrated desktop-and-tablet web CRM with live inventory checks, multi-tier dealer price sheets, and GST-compliant dispatch memos.',
    keyDeliverables: [
      'Multi-branch inventory lookup with safety-stock warnings',
      'Dealer order intake portal with credit terms verification',
      'Automated dispatch note generator for warehouse staff',
      'Sales rep activity dashboard with route tracking'
    ],
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL Schema Design', 'Tailwind UI'],
    liveUrlPlaceholder: 'Milestone 3 deployment scheduled',
    isVerifiedReal: true
  },
  // Existing Project 6: LeadFlow Automation Hub
  {
    id: 'leadflow-automation-hub',
    projectName: 'LeadFlow Automation',
    title: 'Multi-Channel Lead Capture & Instant Sales Dispatch Engine',
    clientName: 'RUBI TECH PARK Technology Lab',
    industry: 'Digital Operations & Workflow Automation',
    categoryTag: 'AI & Voice Technology',
    location: 'Coimbatore, Tamil Nadu',
    status: 'Demo',
    summary: 'A reference architecture demonstrator illustrating how inbound website leads are validated, enriched, and immediately dispatched to available sales representatives within 60 seconds.',
    challenge: 'Demonstrating zero-latency lead routing and failover queuing without relying on opaque proprietary middleware.',
    solution: 'Built an event-driven pipeline that catches form payloads, sanitizes telephone formats, assigns leads via round-robin, and triggers alerts.',
    keyDeliverables: [
      'Sub-second webhook response acknowledging lead receipt',
      'Indian mobile number sanitization (+91 10-digit validation)',
      'Sales representative availability status queue',
      'Audit log of every lifecycle state transition'
    ],
    technologies: ['TypeScript', 'Express Webhooks', 'Event Driven Dispatch', 'Tailwind UI'],
    liveUrlPlaceholder: 'Interactive reference architecture available for client review',
    isVerifiedReal: true
  }
];

export const PRICING_PACKAGES: PricingPlan[] = [
  {
    id: 'starter-web',
    name: 'Business Website',
    startingPrice: AGENCY_CONFIG.startingPrices.businessWebsite,
    startingPriceDisplay: '₹5,000+',
    summary: 'Essential digital presence for growing Indian service businesses and manufacturing firms.',
    targetAudience: 'Local service providers, manufacturers, legal/medical practices, and consultants.',
    highlightedDeliverables: [
      'Up to 5 custom-designed responsive pages',
      'Mobile-first layout & fast loading speed',
      'Direct WhatsApp and click-to-call buttons',
      'Validated contact and lead inquiry form',
      'Basic on-page SEO & Google Maps embed'
    ],
    timelineGuideline: '5 to 10 working days',
    slug: 'service-business-websites'
  },
  {
    id: 'growth-ecommerce',
    name: 'E-commerce Storefront',
    startingPrice: AGENCY_CONFIG.startingPrices.ecommerceWebsite,
    startingPriceDisplay: '₹15,000+',
    summary: 'Full-featured online shop with Indian payment gateways and mobile-friendly shopping cart.',
    targetAudience: 'D2C brands, jewellery sellers, apparel boutiques, and specialty retailers.',
    highlightedDeliverables: [
      'Custom product catalog & category navigation',
      'Indian payment gateway integration (Razorpay/UPI)',
      'Order notifications via Email & WhatsApp trigger',
      'Customer account portal & order tracking',
      'GST tax rule configuration & shipping setup'
    ],
    timelineGuideline: '12 to 20 working days',
    slug: 'service-ecommerce'
  },
  {
    id: 'custom-software',
    name: 'Custom CRM System',
    startingPrice: AGENCY_CONFIG.startingPrices.customCRM,
    startingPriceDisplay: '₹20,000+',
    summary: 'Purpose-built software to organize leads, sales pipelines, and daily team tasks without recurring per-seat penalties.',
    targetAudience: 'B2B companies, agencies, distributors, and growing sales organizations.',
    highlightedDeliverables: [
      'Multi-stage visual sales pipeline',
      'Customer interaction logs & follow-up scheduler',
      'Role-based permissions (Admin, Manager, Rep)',
      'Lead search, filtering, and CSV export',
      'High-security server-side architecture'
    ],
    timelineGuideline: '15 to 25 working days',
    slug: 'service-custom-crm'
  },
  {
    id: 'integrated-solution',
    name: 'Website + CRM Suite',
    startingPrice: AGENCY_CONFIG.startingPrices.websitePlusCRM,
    startingPriceDisplay: '₹30,000+',
    summary: 'A unified digital engine combining a high-converting website with an integrated backend lead management platform.',
    targetAudience: 'Established enterprises demanding end-to-end automation from initial visitor click to closed deal.',
    highlightedDeliverables: [
      'Complete custom corporate website',
      'Integrated private CRM pipeline',
      'Instant webhook lead dispatch to sales reps',
      'WhatsApp notification trigger on new leads',
      'Unified analytics & conversion tracking'
    ],
    timelineGuideline: '20 to 35 working days',
    slug: 'service-crm-integration'
  }
];

export const FAQS = [
  {
    question: 'How are your software and compliance services priced?',
    answer: 'All Software Development and Statutory & Compliance services are quoted based strictly on your verified project requirements, document complexity, and agreed scope. We provide a transparent, line-item proposal before commencing work.'
  },
  {
    question: 'What is the booking fee for E-Services?',
    answer: 'Every citizen e-service requires an initial booking charge of ₹236 (₹200 + 18% GST ₹36). The remaining service charges will be communicated after reviewing your specific application requirements and collected after completion of the work. Applicable government fees, if any, will be informed separately.'
  },
  {
    question: 'Are you an official government department or representative?',
    answer: 'No. RUBI TECH PARK is a professional technology consultancy, compliance facilitator, and digital solutions agency. We assist citizens and businesses in preparing, reviewing, and filing documentation in accordance with statutory guidelines. We do not represent government departments, nor do we promise guaranteed approvals.'
  },
  {
    question: 'How do you handle customer inquiries via WhatsApp?',
    answer: 'Every service on our website features a direct prefilled WhatsApp inquiry button linked to +91 82205 50829. Additionally, when you submit an inquiry form, an official business notification is generated so our team can follow up immediately.'
  },
  {
    question: 'Do I own the source code and software developed for my company?',
    answer: 'Yes, 100%. For custom software and web development, you retain complete ownership of your code repository, databases, and deployment credentials upon milestone completion.'
  }
];

export const WORK_PROCESS_STEPS = [
  {
    number: '01',
    name: 'Discovery',
    heading: 'Scope & Requirement Intake',
    description: 'We listen to your specific business need, review eligibility and technical specifications, and establish a clear roadmap.'
  },
  {
    number: '02',
    name: 'Quotation',
    heading: 'Transparent Work-Based Pricing',
    description: 'For software and compliance, we provide an honest, line-item quotation with no hidden charges. For e-services, you confirm booking with ₹236.'
  },
  {
    number: '03',
    name: 'Execution',
    heading: 'Engineering & Documentation',
    description: 'Our specialized software engineers or documentation officers execute the work adhering to industry best practices and government guidelines.'
  },
  {
    number: '04',
    name: 'Verification',
    heading: 'Quality Checks & Review',
    description: 'We test application functionality across devices or verify document accuracy against official department portals.'
  },
  {
    number: '05',
    name: 'Delivery',
    heading: 'Handover & Ongoing Support',
    description: 'We hand over the live application, deliver certified filings, collect remaining agreed balances, and provide technical assistance.'
  }
];
