import { ServiceDetail, CaseStudy, PricingPlan } from '../types';

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
  tagline: 'Digital Solutions That Help Your Business Grow',
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
  defaultWhatsAppMessage: 'Hello RUBI TECH PARK, I would like to enquire about your software development services.',
  defaultWhatsAppMessageTa: 'வணக்கம் RUBI TECH PARK, உங்கள் மென்பொருள் மேம்பாட்டுச் சேவைகள் குறித்து விவரங்கள் தெரிந்துகொள்ள விரும்புகிறேன்.',
  startingPrices: {
    businessWebsite: 5000,
    ecommerceWebsite: 15000,
    customCRM: 20000,
    websitePlusCRM: 30000
  }
};

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'business-websites',
    slug: 'service-business-websites',
    title: 'Business Website Development',
    category: 'web',
    shortDescription: 'High-conversion, fast-loading corporate websites that establish credibility and turn visitors into qualified enquiries.',
    whoItIsFor: [
      'Manufacturing units, industrial suppliers, and export houses needing digital catalogs',
      'Professional service firms (consultants, law offices, medical practices, agencies)',
      'Local service enterprises expanding visibility across Indian cities and Tier-1/2 markets',
      'Established businesses modernizing outdated websites to capture mobile and WhatsApp enquiries'
    ],
    problemsItSolves: [
      'Low enquiry volume and high bounce rates from slow, clunky legacy sites',
      'Lack of mobile responsiveness causing loss of more than 75% of Indian traffic',
      'Absence of direct WhatsApp and call integration for immediate lead engagement',
      'Poor search engine visibility when potential clients search locally in India'
    ],
    deliverables: [
      'Custom responsive design optimized for mobile, tablet, and desktop',
      'Search engine friendly structure (Semantic HTML, Schema.org metadata, sitemap)',
      'Instant WhatsApp enquiry trigger & lead capture forms',
      'Fast performance (sub-2 second load times on Indian 4G/5G networks)',
      'SSL security, DNS setup guidance, and standard contact routing'
    ],
    processSteps: [
      { title: '1. Discovery & Positioning', description: 'Reviewing your products, target customer profile, and primary business goals.' },
      { title: '2. Architecture & Wireframing', description: 'Structuring clear navigation, trust signals, and high-conversion enquiry funnels.' },
      { title: '3. Engineering & Polish', description: 'Developing clean, mobile-first code with dark navy and refined corporate aesthetics.' },
      { title: '4. Testing & Verification', description: 'Checking speed, cross-device responsiveness, and form reliability across browsers.' },
      { title: '5. Launch & Handover', description: 'Deploying to live domain, verifying DNS, and training your team on routine updates.' }
    ],
    startingPrice: AGENCY_CONFIG.startingPrices.businessWebsite,
    startingPriceLabel: '₹5,000+',
    quotationFactors: [
      'Total number of custom pages and product/service catalogs',
      'Content creation, photography, and technical copywriting requirements',
      'Multilingual Indian language support (e.g. Hindi, Tamil, Telugu, Marathi)',
      'Custom animations, calculators, or interactive cost estimators',
      'Third-party domain registration, specialized corporate hosting, and ongoing SLA maintenance'
    ]
  },
  {
    id: 'ecommerce',
    slug: 'service-ecommerce',
    title: 'E-commerce Development',
    category: 'ecommerce',
    shortDescription: 'Reliable, transaction-ready online storefronts equipped with Indian payment gateways, order management, and WhatsApp updates.',
    whoItIsFor: [
      'Jewellery, apparel, handicraft, and luxury retail brands selling across India and overseas',
      'Direct-to-consumer (D2C) manufacturers eliminating third-party marketplace commissions',
      'B2B wholesalers requiring password-protected bulk pricing and invoice generation',
      'Retail merchants transitioning from offline physical counters to omnichannel digital sales'
    ],
    problemsItSolves: [
      'High commission payouts (15%–35%) eating profit margins on third-party marketplaces',
      'Payment gateway drop-offs and failed UPI transactions during customer checkout',
      'Inventory mismatches between physical counter stock and online availability',
      'Inability to capture direct customer data for repeat marketing and retention'
    ],
    deliverables: [
      'Full product catalog with high-resolution imagery, filters, and variant support',
      'Seamless Indian payment gateway setup (Razorpay, Cashfree, UPI, Netbanking, Cards)',
      'Automated order confirmation emails and direct WhatsApp checkout trigger',
      'Inventory tracking, coupon engine, and shipping rate calculator',
      'Admin dashboard for products, categories, stock alerts, and customer records'
    ],
    processSteps: [
      { title: '1. Catalog & Payments Audit', description: 'Determining SKU volume, variant structures, taxes (GST), and payment gateway requirements.' },
      { title: '2. Shopping Experience Design', description: 'Designing frictionless category browsing, search, and 1-step checkout flows.' },
      { title: '3. Storefront Implementation', description: 'Building fast product pages, cart management, and secure payment webhooks.' },
      { title: '4. Security & Payment Testing', description: 'Conducting live test transactions, refunds, and order notification verification.' },
      { title: '5. Production Launch', description: 'Connecting live merchant accounts, configuring analytics, and providing staff training.' }
    ],
    startingPrice: AGENCY_CONFIG.startingPrices.ecommerceWebsite,
    startingPriceLabel: '₹15,000+',
    quotationFactors: [
      'Total volume of products and complexity of SKU variations (sizes, purities, weights)',
      'Custom logistics & courier integrations (Shiprocket, Delhivery, Bluedart APIs)',
      'Custom GST invoice generation & ERP sync requirements',
      'International currency switching and cross-border payment compliance',
      'Specialized security audits and dedicated cloud hosting infrastructure'
    ]
  },
  {
    id: 'custom-crm',
    slug: 'service-custom-crm',
    title: 'Custom CRM and Business Software',
    category: 'crm',
    shortDescription: 'Tailored operational software built around your exact business processes, eliminating messy spreadsheets and missed sales leads.',
    whoItIsFor: [
      'B2B sales teams managing multi-stage proposals, quotes, and follow-up pipelines',
      'Manufacturers, distributors, and dealers tracking purchase orders and dispatch workflows',
      'Service organizations requiring appointment scheduling, client intake, and status tracking',
      'Enterprises frustrated by expensive, bloated global software that does not fit Indian business realities'
    ],
    problemsItSolves: [
      'Leads slipping through the cracks when tracked in scattered WhatsApp chats or personal phones',
      'Zero visibility into sales executive activity, conversion rates, and pending proposals',
      'Excessive monthly per-user subscription fees for off-the-shelf software with features you never use',
      'Inability to customize fields, status stages, or internal approval hierarchies'
    ],
    deliverables: [
      'Dedicated lead pipeline with custom stages (New, Contacted, Qualified, Proposal, Won, Lost)',
      'Role-based access controls (Super Admin, Sales Manager, Executive)',
      'Activity timeline with timestamped notes, follow-up calendar, and call logs',
      'Filterable lead repository with instant search and CSV export capability',
      'Operational dashboards reflecting daily team performance and pending tasks'
    ],
    processSteps: [
      { title: '1. Process Mapping', description: 'Documenting your exact team roles, daily handoffs, and customer journey milestones.' },
      { title: '2. Database & Schema Design', description: 'Structuring relational data schemas, indexes, and role-based access rules.' },
      { title: '3. Module Development', description: 'Implementing pipeline views, lead detail workspaces, and reporting summaries.' },
      { title: '4. Security Hardening', description: 'Enforcing server-side validation, rate limiting, and encrypted access controls.' },
      { title: '5. Deployment & User Onboarding', description: 'Deploying to private server infrastructure and guiding your management team.' }
    ],
    startingPrice: AGENCY_CONFIG.startingPrices.customCRM,
    startingPriceLabel: '₹20,000+',
    quotationFactors: [
      'Number of custom entities (Leads, Deals, Inventory items, Invoices, Service Tickets)',
      'Role hierarchies, departmental permissions, and multi-branch management',
      'Data migration from legacy Excel sheets or older database software',
      'Automated SMS/WhatsApp API gateway integrations and webhook triggers',
      'Dedicated server setup, automated backups, and guaranteed uptime SLAs'
    ]
  },
  {
    id: 'crm-integration',
    slug: 'service-crm-integration',
    title: 'Website + CRM Integration',
    category: 'integration',
    shortDescription: 'Unite your public digital storefront with your internal management software for zero-latency lead dispatch and automated follow-ups.',
    whoItIsFor: [
      'Growing businesses where manual copy-pasting of website inquiries into spreadsheets causes delayed callbacks',
      'Marketing-driven firms running Google Ads or Meta Ads needing instant sales team dispatch',
      'Companies running both an online catalog and an offline back-office order processing desk'
    ],
    problemsItSolves: [
      'Hours of delay between a prospect submitting a form and the sales team making the first call',
      'Lost customer inquiries caused by inbox spam filters or missed personal notifications',
      'Duplicate entries and lack of attribution regarding which marketing campaign generated the lead',
      'Manual, error-prone data re-entry between independent software tools'
    ],
    deliverables: [
      'Direct API webhook connecting all website forms to your central CRM database',
      'Instant notification triggers (automated WhatsApp or email alert to assigned sales rep)',
      'Automatic lead source and campaign parameter (UTM) capture',
      'Two-way sync capabilities where customer status updates reflect across systems',
      'Failover queue handling so inquiries are never dropped during network fluctuations'
    ],
    processSteps: [
      { title: '1. Endpoint & Flow Audit', description: 'Evaluating existing website forms, CRM API capabilities, and team dispatch rules.' },
      { title: '2. Webhook & Middleware Setup', description: 'Building resilient API connectors with validation, deduplication, and payload mapping.' },
      { title: '3. Notification Dispatch Engine', description: 'Configuring instant alert triggers for sales managers and assigned agents.' },
      { title: '4. Load & Resilience Testing', description: 'Simulating burst traffic and network dropouts to verify zero message loss.' },
      { title: '5. Unified Go-Live', description: 'Activating production webhook routing and running live test inquiries.' }
    ],
    startingPrice: AGENCY_CONFIG.startingPrices.websitePlusCRM,
    startingPriceLabel: '₹30,000+',
    quotationFactors: [
      'Complexity of third-party APIs (custom in-house CRM vs. standard webhook targets)',
      'Volume of monthly inquiries and requirements for high-availability message queues',
      'Number of automated notification channels (WhatsApp Business API, Email, SMS)',
      'Bidirectional synchronization versus single-direction lead push',
      'Legacy website codebase compatibility and refactoring requirements'
    ]
  },
  {
    id: 'ai-automation',
    slug: 'service-ai-automation',
    title: 'AI and Workflow Automation',
    category: 'automation',
    shortDescription: 'Practical artificial intelligence and automated business logic that handles routine inquiries, summarizes data, and speeds up operations.',
    whoItIsFor: [
      'Customer support teams spending hours answering repetitive catalog and pricing inquiries',
      'Operations managers needing fast automated summarization of daily inquiries and reports',
      'E-commerce brands wanting smart search, auto-categorization, and automated draft replies'
    ],
    problemsItSolves: [
      'Customers inquiring late at night or on weekends receiving zero response until Monday morning',
      'Staff fatigue answering the exact same 10 product questions dozens of times every day',
      'Inconsistent sales answers given by junior representatives',
      'Bottlenecks in generating standard commercial proposals or product summaries'
    ],
    deliverables: [
      'Automated customer FAQ and inquiry triage assistance via verified business knowledge base',
      'Smart inquiry enrichment (auto-tagging high-intent prospects and estimated project scope)',
      'Workflow automations connecting forms, cloud storage, document generation, and CRM fields',
      'Strict guardrails preventing model hallucination or unauthorized commitments',
      'Executive dashboard summarizing inquiry trends and customer sentiment'
    ],
    processSteps: [
      { title: '1. Opportunity Identification', description: 'Pinpointing repetitive manual workflows that consume substantial team hours.' },
      { title: '2. Knowledge Base & Logic Guardrails', description: 'Curating verified business documentation, price limits, and escalation rules.' },
      { title: '3. Integration & Testing', description: 'Connecting LLM endpoints to internal systems with deterministic fallbacks.' },
      { title: '4. Pilot Sandbox Review', description: 'Auditing accuracy and response quality against historical customer interactions.' },
      { title: '5. Monitored Deployment', description: 'Rolling out with continuous human-in-the-loop oversight and activity telemetry.' }
    ],
    startingPrice: 25000,
    startingPriceLabel: '₹25,000+',
    quotationFactors: [
      'Knowledge base volume and complexity of business logic rules',
      'Integration points with third-party software (CRMs, Google Workspace, databases)',
      'Expected volume of automated transactions and third-party API token consumption',
      'Human-in-the-loop escalation workflows and review interfaces',
      'Custom fine-tuning and strict regulatory data compliance requirements'
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'rubi-gold-silver',
    title: 'RUBI Gold & Silver: Luxury Digital Catalog & B2B Inquiry Platform',
    clientName: 'RUBI Gold & Silver',
    industry: 'Fine Jewellery & Precious Metals',
    location: 'India',
    status: 'Live',
    summary: 'A bespoke high-end digital catalog and client inquiry portal engineered for an Indian jewellery enterprise, showcasing handcrafted ornaments with real-time purity attributes and direct customer inquiry routing.',
    challenge: 'The enterprise relied on physical showroom visits and compressed WhatsApp photo albums that degraded image clarity and resulted in unorganized customer inquiries without structured SKU details.',
    solution: 'Designed and deployed a mobile-first catalog platform with deep dark luxury aesthetics, category filtering by purity (22K/18K gold, 925 silver), high-resolution zoom views, and direct SKU-linked WhatsApp inquiry generation.',
    keyDeliverables: [
      'Mobile-optimized luxury jewelry digital catalog with zero distortion',
      'Direct SKU prefilled WhatsApp inquiry button for instantaneous sales response',
      'Purity and weight specification tables with clear disclaimers',
      'Fast CDN image delivery tailored for Indian cellular networks'
    ],
    technologies: ['React', 'Tailwind CSS', 'WhatsApp Business Deep-link Engine', 'Cloudflare CDN'],
    liveUrlPlaceholder: 'Verified client deployment active',
    isVerifiedReal: true
  },
  {
    id: 'apex-distribution-crm',
    title: 'Custom Wholesale Distribution & Order Management System',
    clientName: 'Industrial Hardware & Fasteners Supplier',
    industry: 'Industrial Distribution',
    location: 'Coimbatore / Tamil Nadu',
    status: 'In Progress',
    summary: 'Tailored back-office software streamlining multi-warehouse stock visibility, dealer credit limits, and purchase order tracking for a regional distributor.',
    challenge: 'Orders received over phone calls and WhatsApp were recorded in disjointed paper registers, causing frequent inventory stockouts and billing reconciliation errors.',
    solution: 'Constructing an integrated desktop-and-tablet web CRM with live inventory checks, multi-tier dealer price sheets, and PDF GST-compliant dispatch memos.',
    keyDeliverables: [
      'Multi-branch inventory lookup with safety-stock threshold warnings',
      'Dealer order intake portal with credit terms verification',
      'Automated dispatch note generator formatted for warehouse staff',
      'Sales rep activity dashboard with geographic route tracking'
    ],
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL Schema Design', 'Tailwind UI'],
    liveUrlPlaceholder: 'Milestone 3 deployment scheduled',
    isVerifiedReal: true
  },
  {
    id: 'leadflow-automation-hub',
    title: 'Multi-Channel Lead Capture & Instant Sales Dispatch Engine',
    clientName: 'RUBI TECH PARK Technology Lab',
    industry: 'Digital Operations & Workflow Automation',
    location: 'Coimbatore, Tamil Nadu',
    status: 'Demo',
    summary: 'A reference architecture demonstrator illustrating how inbound website leads are validated, enriched, and immediately dispatched to available sales representatives within 60 seconds.',
    challenge: 'Demonstrating zero-latency lead routing and failover queuing without relying on opaque, expensive proprietary middleware.',
    solution: 'Built a lightweight, auditable event-driven pipeline that catches form payloads, verifies telephone and email formats, assigns leads via round-robin, and prepares prefilled response templates.',
    keyDeliverables: [
      'Sub-second webhook response acknowledging lead receipt',
      'Indian mobile number sanitization (+91 10-digit validation)',
      'Sales representative availability status and dispatch queue',
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
    question: 'Are the prices listed on your website fixed or starting estimates?',
    answer: 'All prices shown (such as ₹5,000+ for a business website or ₹20,000+ for a custom CRM) are honest starting price indicators. The final investment depends strictly on your project scope, total number of pages or product SKUs, specific third-party API requirements, content readiness, and custom software logic. We provide a transparent, line-item formal proposal prior to any contract.'
  },
  {
    question: 'Do I own the source code, domain, and hosting?',
    answer: 'Yes, 100%. At RUBI TECH PARK, we do not believe in vendor lock-in. You retain full legal ownership of your code, domain credentials, and database assets upon project handover.'
  },
  {
    question: 'How do you integrate WhatsApp into our website or CRM?',
    answer: 'We provide two tiers: direct WhatsApp deep-links that open WhatsApp with a prefilled inquiry message on your customer\'s phone or desktop with zero recurring API costs; and official WhatsApp Business API integrations for automated transactional messaging and multi-agent dispatch.'
  },
  {
    question: 'Can you work with clients across different states in India?',
    answer: 'Yes. We serve businesses across Bangalore, Mumbai, Delhi-NCR, Hyderabad, Chennai, Pune, Ahmedabad, and Tier-2 manufacturing towns. Our discovery, planning, milestone demos, and handovers are conducted seamlessly via video calls and structured staging environments.'
  },
  {
    question: 'What is your payment structure for new projects?',
    answer: 'Standard projects follow transparent milestone-based payments: typically 40% project kickoff advance, 30% upon approval of the staging build, and 30% final balance upon production launch and complete domain handover.'
  },
  {
    question: 'How does your custom CRM compare to standard monthly SaaS products?',
    answer: 'Standard SaaS tools charge per user, per month in USD, which quickly becomes prohibitive for growing teams, and often force your business to adapt to their rigid software. Our custom CRM is built around your specific operations, gives you complete data privacy on your own server, and carries no monthly per-user licensing fees.'
  }
];

export const WORK_PROCESS_STEPS = [
  {
    number: '01',
    name: 'Discover',
    heading: 'Understanding Your Business & Market',
    description: 'We analyze your commercial model, key customer personas in India, competitive landscape, and the exact business outcome you want to achieve.'
  },
  {
    number: '02',
    name: 'Plan',
    heading: 'Architecture, Wireframing & Scope Lock',
    description: 'We structure the pages, data schemas, user journeys, and technical deliverables into a transparent, line-item proposal with fixed milestones.'
  },
  {
    number: '03',
    name: 'Build',
    heading: 'High-Performance Engineering',
    description: 'We craft your solution with modern code, responsive layouts, fast loading speeds, and our signature corporate dark navy and gold aesthetics.'
  },
  {
    number: '04',
    name: 'Test',
    heading: 'Rigorous Verification & Quality Checks',
    description: 'We verify device responsiveness, forms, payment gateways, WhatsApp triggers, and security headers across real mobile and desktop screens.'
  },
  {
    number: '05',
    name: 'Launch',
    heading: 'Deployment, DNS & Team Handover',
    description: 'We deploy to production, verify search indexing and analytics, and train your staff on managing inquiries and updating content.'
  }
];
