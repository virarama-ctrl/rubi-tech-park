import React, { useState } from 'react';
import gstComplianceImg from '../assets/images/gst_compliance_1794314524148.jpg';
import panCardImg from '../assets/images/pan_card_service_1794314523379.jpg';

export interface ServiceImageMetadata {
  url: string;
  alt: string;
  caption: string;
  category: 'software' | 'compliance' | 'eservices';
}

/**
 * High-reliability fallback image representing RUBI TECH PARK enterprise infrastructure
 */
export const FALLBACK_SERVICE_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

/**
 * Standard Default Reference Images for all 38 Services
 * Each image is hand-curated to accurately represent the specific service domain
 * without repeating unrelated stock photos.
 */
export const DEFAULT_SERVICE_IMAGES: Record<string, ServiceImageMetadata> = {
  // -------------------------------------------------------------------------
  // CATEGORY A: SOFTWARE DEVELOPMENT & DIGITAL SOLUTIONS (12 Services)
  // -------------------------------------------------------------------------
  'website-design-development': {
    url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    alt: 'Website Design and Development UI/UX workstation',
    caption: 'Modern responsive web architecture & UI/UX design',
    category: 'software'
  },
  'business-websites': {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Corporate Business Website digital presence',
    caption: 'Enterprise corporate presence & credibility platforms',
    category: 'software'
  },
  'ecommerce-website-development': {
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    alt: 'E-commerce Website Development with online shopping cart',
    caption: 'Secure online store, shopping cart & instant payments',
    category: 'software'
  },
  'custom-software-development': {
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    alt: 'Custom Software Development code editor and engineering',
    caption: 'Bespoke enterprise software & business workflow engines',
    category: 'software'
  },
  'crm-development': {
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    alt: 'Custom CRM System and customer pipeline dashboard',
    caption: 'Centralized lead management, sales pipeline & team CRM',
    category: 'software'
  },
  'billing-business-management-software': {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    alt: 'Billing and Point of Sale accounting terminal',
    caption: 'POS billing, invoice generation & inventory tracking',
    category: 'software'
  },
  'web-applications': {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    alt: 'Cloud Web Application data analytics dashboard',
    caption: 'High-throughput web portals & SaaS applications',
    category: 'software'
  },
  'mobile-application-development': {
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    alt: 'Mobile Application Development iOS and Android interface',
    caption: 'Native and cross-platform mobile smartphone apps',
    category: 'software'
  },
  'business-automation': {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    alt: 'Business Workflow Automation and API integration',
    caption: 'Automated workflow pipelines & multi-channel routing',
    category: 'software'
  },
  'digital-transformation-solutions': {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    alt: 'Enterprise Digital Transformation and cloud infrastructure',
    caption: 'End-to-end cloud migration & digital modernization',
    category: 'software'
  },
  'website-maintenance-technical-support': {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    alt: 'Website Maintenance and Server Infrastructure Monitoring',
    caption: 'Server uptime monitoring, security patches & SLA support',
    category: 'software'
  },
  'other-custom-digital-solutions': {
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    alt: 'Custom Digital Solutions collaborative innovation',
    caption: 'Specialized enterprise technology consulting & builds',
    category: 'software'
  },

  // -------------------------------------------------------------------------
  // CATEGORY B: STATUTORY & REGULATORY COMPLIANCE (15 Services)
  // -------------------------------------------------------------------------
  'gst-registration': {
    url: gstComplianceImg,
    alt: 'GST Registration and Tax Compliance Documentation',
    caption: 'Goods and Services Tax business registration, compliance folder & tax invoices',
    category: 'compliance'
  },
  'gst-return-filing': {
    url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    alt: 'GST Return Filing accounting and monthly ledger audit',
    caption: 'Monthly & quarterly GSTR-1, GSTR-3B filings & reconciliation',
    category: 'compliance'
  },
  'gst-amendments': {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    alt: 'GST Amendments legal document modifications',
    caption: 'Core & non-core business GST modifications and updates',
    category: 'compliance'
  },
  'itr-assistance': {
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    alt: 'Income Tax Return ITR filing assessment and computation',
    caption: 'Individual & corporate income tax computation and e-filing',
    category: 'compliance'
  },
  'pan-services': {
    url: panCardImg,
    alt: 'PAN Services and Business Tax Identity Card Verification',
    caption: 'Official PAN card issuance, identity verification and compliance desk',
    category: 'compliance'
  },
  'msme-udyam-registration': {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    alt: 'MSME Udyam Registration manufacturing workshop and enterprise',
    caption: 'Udyam government portal certification for Indian enterprises',
    category: 'compliance'
  },
  'fssai-registration-licensing': {
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    alt: 'FSSAI Food Safety Registration and commercial kitchen standards',
    caption: 'Food safety licensing, central and state FSSAI permits',
    category: 'compliance'
  },
  'bis-certification-assistance': {
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    alt: 'Bureau of Indian Standards BIS Certification laboratory testing',
    caption: 'ISI mark, mandatory standard testing & BIS compliance',
    category: 'compliance'
  },
  'trademark-registration-assistance': {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    alt: 'Trademark Registration brand intellectual property protection',
    caption: 'Brand name, logo trademark filing & intellectual property protection',
    category: 'compliance'
  },
  'patent-filing-assistance': {
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    alt: 'Patent Filing Technical Schematics and innovation blueprints',
    caption: 'Provisional & non-provisional technical patent documentation',
    category: 'compliance'
  },
  'business-licences': {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    alt: 'Business Licences and Commercial Regulatory Authorizations',
    caption: 'Commercial licensing, municipal registrations & regulatory approvals',
    category: 'compliance'
  },
  'trade-licence-assistance': {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    alt: 'Trade Licence commercial shop and establishment permit',
    caption: 'City municipal corporation trade licences & commercial permits',
    category: 'compliance'
  },
  'other-business-registrations': {
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    alt: 'Business Registrations and Corporate Incorporation Papers',
    caption: 'Firm partnerships, company incorporation & compliance deeds',
    category: 'compliance'
  },
  'pharma-medical-licence-assistance': {
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    alt: 'Pharma and Medical Licence pharmacy dispensary verification',
    caption: 'Drug controller certifications, retail & wholesale pharmacy permits',
    category: 'compliance'
  },
  'statutory-documentation-compliance-support': {
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    alt: 'Statutory Documentation binders and legal governance records',
    caption: 'Annual corporate filings, board resolutions & statutory registers',
    category: 'compliance'
  },

  // -------------------------------------------------------------------------
  // CATEGORY C: CITIZEN DIGITAL E-SERVICES (11 Services)
  // -------------------------------------------------------------------------
  'pan-card-application-correction': {
    url: panCardImg,
    alt: 'PAN Card Application and Name Correction Citizen Verification',
    caption: 'Indian PAN card application, verification form & identity services',
    category: 'eservices'
  },
  'voter-id-application-correction': {
    url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
    alt: 'Voter ID Application and Electoral Roll Correction',
    caption: 'Form 6 new voter registration & Form 8 address/name changes',
    category: 'eservices'
  },
  'passport-application-assistance': {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    alt: 'Indian Passport Application and Seva Kendra Appointment booking',
    caption: 'Passport Seva Kendra appointment scheduling & document indexing',
    category: 'eservices'
  },
  'passport-renewal-assistance': {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    alt: 'Passport Renewal and Re-issue Assistance documentation',
    caption: 'Validity renewal, booklet replenishment & Tatkal processing',
    category: 'eservices'
  },
  'address-change-assistance': {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    alt: 'Address Change and Proof of Residence official documentation',
    caption: 'Address updates across official identification databases',
    category: 'eservices'
  },
  'document-application-support': {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    alt: 'Document Application Support and citizen record processing',
    caption: 'Government portal indexing, document scanning & submission',
    category: 'eservices'
  },
  'online-form-filling': {
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    alt: 'Online Form Filling at citizen digital computer terminal',
    caption: 'Error-free portal data entry for government and state applications',
    category: 'eservices'
  },
  'certificate-application-assistance': {
    url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
    alt: 'Revenue Certificate Application for Community and Income proofs',
    caption: 'Community, Income, Nativity & First Graduate certificate assistance',
    category: 'eservices'
  },
  'other-online-government-services': {
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    alt: 'Digital India e-governance citizen assistance kiosk',
    caption: 'State & central government portal verification & facilitation',
    category: 'eservices'
  },
  'ration-card-application-correction': {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    alt: 'Smart Ration Card Application and Family Member Correction',
    caption: 'TNEPDS Smart Family Card new issue, member addition & address change',
    category: 'eservices'
  },
  'eb-new-application-correction': {
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    alt: 'Electricity Board TNEB Power Connection and Meter Correction',
    caption: 'TANGEDCO new power connection, tariff change & name transfer',
    category: 'eservices'
  }
};

/**
 * Returns the effective image URL for any service ID,
 * prioritizing admin-configured overrides stored in the database.
 */
export function getServiceImageUrl(
  serviceId: string,
  customImages?: Record<string, string>
): string {
  if (customImages && customImages[serviceId]) {
    return customImages[serviceId];
  }
  const defaultItem = DEFAULT_SERVICE_IMAGES[serviceId];
  return defaultItem ? defaultItem.url : FALLBACK_SERVICE_IMAGE;
}

export function getServiceImageMetadata(
  serviceId: string,
  customImages?: Record<string, string>
): ServiceImageMetadata {
  const defaultMeta = DEFAULT_SERVICE_IMAGES[serviceId] || {
    url: FALLBACK_SERVICE_IMAGE,
    alt: 'RUBI TECH PARK Verified Enterprise Service',
    caption: 'Professional Technology & Compliance Solution',
    category: 'software' as const
  };

  if (customImages && customImages[serviceId]) {
    return {
      ...defaultMeta,
      url: customImages[serviceId]
    };
  }

  return defaultMeta;
}

/**
 * Reusable Service Reference Image Component
 * Ensures consistent aspect ratio, rounded corners, fallback on load failure,
 * and elegant hover transitions.
 */
interface ServiceReferenceImageProps {
  serviceId: string;
  serviceTitle: string;
  customImages?: Record<string, string>;
  className?: string;
  aspectRatioClass?: string;
  showCaption?: boolean;
  onEnlarge?: () => void;
  priority?: boolean;
}

export const ServiceReferenceImage: React.FC<ServiceReferenceImageProps> = ({
  serviceId,
  serviceTitle,
  customImages,
  className = '',
  aspectRatioClass = 'aspect-16/9 sm:aspect-16/10',
  showCaption = false,
  onEnlarge,
  priority = false
}) => {
  const meta = getServiceImageMetadata(serviceId, customImages);
  const [imgSrc, setImgSrc] = useState<string>(meta.url);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync if prop changes
  React.useEffect(() => {
    setImgSrc(meta.url);
    setHasError(false);
  }, [meta.url]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_SERVICE_IMAGE);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#142033] border border-[#D5DEE8] dark:border-[#30445B] group/img ${aspectRatioClass} ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-[#17263A] dark:via-[#20344E] dark:to-[#17263A] animate-pulse" />
      )}

      {/* Actual Reference Image */}
      <img
        src={imgSrc}
        alt={meta.alt || serviceTitle}
        loading={priority ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-60 group-hover/img:opacity-40 transition-opacity" />

      {/* Category Indicator Tag */}
      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase backdrop-blur-md shadow-xs ${
            meta.category === 'eservices'
              ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30'
              : meta.category === 'compliance'
              ? 'bg-[#1C2B40]/80 text-[#88B4D8] border border-[#30445B]/50'
              : 'bg-[#101B2C]/80 text-[#96C0E6] border border-[#30445B]/50'
          }`}
        >
          {meta.category === 'eservices'
            ? 'E-Service'
            : meta.category === 'compliance'
            ? 'Compliance'
            : 'Software'}
        </span>
      </div>

      {/* Enlarge / View Details Button Overlay if onEnlarge provided */}
      {onEnlarge && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnlarge();
          }}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer border border-white/20 text-xs flex items-center gap-1"
          title="View larger reference image and details"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
          </svg>
          <span className="text-[10px] font-mono pr-0.5">Enlarge</span>
        </button>
      )}

      {/* Caption strip if enabled */}
      {showCaption && (
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/85 to-transparent z-10">
          <p className="text-[11px] text-white/95 font-medium truncate drop-shadow-xs">
            {meta.caption}
          </p>
        </div>
      )}
    </div>
  );
};
