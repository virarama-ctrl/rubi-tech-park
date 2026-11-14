import React, { useState, useEffect } from 'react';
import { PageRoute, RequiredService, CaseStudy } from './types';
import { BillingCycle } from './types/crm';
import { SERVICES_DATA } from './config/agencyConfig';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { RubiAssistantChatbot } from './components/RubiAssistantChatbot';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

import { HomePage } from './pages/HomePage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PricingPage } from './pages/PricingPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ServiceDeliveryPolicyPage } from './pages/ServiceDeliveryPolicyPage';
import { SubscriptionPolicyPage } from './pages/SubscriptionPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<RequiredService>('business-website');
  const [checkoutConfig, setCheckoutConfig] = useState<{
    planId: string;
    mode: 'one_time' | 'subscription';
    billingCycle: BillingCycle;
    leadId?: string;
  }>({
    planId: 'starter-web',
    mode: 'one_time',
    billingCycle: 'monthly'
  });
  const { language } = useLanguage();

  // Sync route with window.location.hash and window.location.pathname for deep linking
  useEffect(() => {
    const handleRouteChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      const rawPath = window.location.pathname.replace(/^\//, '');
      const rawTarget = rawHash || rawPath;
      const [target, queryStr] = rawTarget.split('?');

      if (!target) {
        setCurrentRoute('home');
        return;
      }

      if (target === 'checkout' && queryStr) {
        const params = new URLSearchParams(queryStr);
        const qPlan = params.get('plan');
        const qMode = params.get('mode') === 'subscription' ? 'subscription' : 'one_time';
        const qCycle = params.get('cycle') === 'yearly' ? 'yearly' : 'monthly';
        const qLeadId = params.get('leadId') || params.get('bookingId') || undefined;
        setCheckoutConfig((prev) => ({
          planId: qPlan || prev.planId,
          mode: qMode,
          billingCycle: qCycle,
          leadId: qLeadId
        }));
      }

      // Map friendly aliases
      if (target === 'admin' || target === 'admin/dashboard') {
        const token = sessionStorage.getItem('rtp_admin_token') || sessionStorage.getItem('edh_admin_token');
        if (!token) {
          setCurrentRoute('admin-login');
        } else {
          setCurrentRoute('admin-dashboard');
        }
        return;
      }

      if (target === 'admin/login') {
        setCurrentRoute('admin-login');
        return;
      }

      const validRoutes: PageRoute[] = [
        'home',
        'services',
        'service-business-websites',
        'service-ecommerce',
        'service-custom-crm',
        'service-crm-integration',
        'service-ai-automation',
        'pricing',
        'subscriptions',
        'portfolio',
        'about',
        'contact',
        'privacy-policy',
        'terms',
        'refund-policy',
        'service-delivery-policy',
        'subscription-policy',
        'checkout',
        'admin-login',
        'admin-dashboard'
      ];

      if (validRoutes.includes(target as PageRoute)) {
        setCurrentRoute(target as PageRoute);
      } else {
        setCurrentRoute('not-found');
      }
    };

    // Initialize from current location
    handleRouteChange();

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Update Page Title and Meta Description dynamically based on route and language
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let pageTitle = language === 'ta'
      ? 'ரூபி டெக் பார்க் – உங்கள் வணிக வளர்ச்சிக்கான டிஜிட்டல் தீர்வுகள்'
      : 'RUBI TECH PARK – Digital Solutions That Help Your Business Grow';

    let metaDescription = language === 'ta'
      ? 'நவீன வணிக வலைத்தளங்கள், இ-காமர்ஸ் தளங்கள், பிரத்யேக CRM மென்பொருள் மற்றும் வணிக ஆட்டோமேஷன் சேவைகள். காந்திபுரம், கோயம்புத்தூர், தமிழ்நாடு.'
      : 'Professional business websites, e-commerce platforms, custom CRM systems, and AI-assisted workflow automation for enterprises across India. Gandhipuram, Coimbatore.';

    switch (currentRoute) {
      case 'home':
        pageTitle = language === 'ta'
          ? 'ரூபி டெக் பார்க் – உங்கள் வணிக வளர்ச்சிக்கான டிஜிட்டல் தீர்வுகள்'
          : 'RUBI TECH PARK – Digital Solutions That Help Your Business Grow';
        break;
      case 'services':
        pageTitle = language === 'ta'
          ? 'சேவைகள் – வணிக வலைத்தளங்கள், இ-காமர்ஸ், CRM | ரூபி டெக் பார்க்'
          : 'Services Overview – Business Websites, E-Commerce, Custom CRM | RUBI TECH PARK';
        break;
      case 'service-business-websites':
        pageTitle = language === 'ta'
          ? 'வணிக வலைத்தள உருவாக்கம் (₹5,000+) | ரூபி டெக் பார்க்'
          : 'Business Website Development (₹5,000+) | RUBI TECH PARK';
        break;
      case 'service-ecommerce':
        pageTitle = language === 'ta'
          ? 'இ-காமர்ஸ் தளங்கள் (₹15,000+) | ரூபி டெக் பார்க்'
          : 'E-commerce Development (₹15,000+) | RUBI TECH PARK';
        break;
      case 'service-custom-crm':
        pageTitle = language === 'ta'
          ? 'பிரத்யேக CRM மற்றும் வணிக மென்பொருள் (₹20,000+) | ரூபி டெக் பார்க்'
          : 'Custom CRM & Business Software (₹20,000+) | RUBI TECH PARK';
        break;
      case 'service-crm-integration':
        pageTitle = language === 'ta'
          ? 'வலைத்தளம் + CRM ஒருங்கிணைப்பு (₹30,000+) | ரூபி டெக் பார்க்'
          : 'Website + CRM Integration (₹30,000+) | RUBI TECH PARK';
        break;
      case 'service-ai-automation':
        pageTitle = language === 'ta'
          ? 'AI & பணிப்பாய்வு ஆட்டோமேஷன் (₹25,000+) | ரூபி டெக் பார்க்'
          : 'AI & Workflow Automation (₹25,000+) | RUBI TECH PARK';
        break;
      case 'pricing':
        pageTitle = language === 'ta'
          ? 'வெளிப்படையான தொடக்க விலை & திட்ட கால்குலேட்டர் | ரூபி டெக் பார்க்'
          : 'Transparent Starting Pricing & Cost Estimator | RUBI TECH PARK';
        break;
      case 'subscriptions':
        pageTitle = language === 'ta'
          ? 'மென்பொருள் சந்தா திட்டங்கள் & மேலாண்மை | ரூபி டெக் பார்க்'
          : 'Software Subscriptions & Billing Portal | RUBI TECH PARK';
        break;
      case 'portfolio':
        pageTitle = language === 'ta'
          ? 'திட்டங்கள் & வழக்கு ஆய்வுகள் | ரூபி டெக் பார்க்'
          : 'Case Studies & Verified Deployments | RUBI TECH PARK';
        break;
      case 'about':
        pageTitle = language === 'ta'
          ? 'எங்களைப்பற்றி – கோயம்புத்தூர் மென்பொருள் ஆலோசனை | ரூபி டெக் பார்க்'
          : 'About Us – Credible Engineering for Indian Business | RUBI TECH PARK';
        break;
      case 'contact':
        pageTitle = language === 'ta'
          ? 'உங்கள் திட்டத்தைப் பற்றி பேசுங்கள் | ரூபி டெக் பார்க்'
          : 'Discuss Your Project – Commercial Enquiries | RUBI TECH PARK';
        break;
      case 'privacy-policy':
        pageTitle = language === 'ta' ? 'தனியுரிமைக் கொள்கை | ரூபி டெக் பார்க்' : 'Privacy Policy | RUBI TECH PARK';
        break;
      case 'terms':
        pageTitle = language === 'ta' ? 'விதிமுறைகள் மற்றும் நிபந்தனைகள் | ரூபி டெக் பார்க்' : 'Terms & Conditions of Service | RUBI TECH PARK';
        break;
      case 'refund-policy':
        pageTitle = language === 'ta' ? 'ரத்து & பணத்தைத் திரும்பப் பெறும் கொள்கை | ரூபி டெக் பார்க்' : 'Cancellation & Refund Policy | RUBI TECH PARK';
        break;
      case 'service-delivery-policy':
        pageTitle = language === 'ta' ? 'சேவை விநியோகக் கொள்கை | ரூபி டெக் பார்க்' : 'Service Delivery & Activation Policy | RUBI TECH PARK';
        break;
      case 'subscription-policy':
        pageTitle = language === 'ta' ? 'சந்தா & தானியங்கி புதுப்பித்தல் கொள்கை | ரூபி டெக் பார்க்' : 'Subscription & Auto-Renewal Policy | RUBI TECH PARK';
        break;
      case 'checkout':
        pageTitle = language === 'ta' ? 'கட்டணம் செலுத்துங்கள் – ஆன்லைன் கட்டண தளம் | ரூபி டெக் பார்க்' : 'Checkout & Online Payments – RUBI TECH PARK';
        metaDescription = language === 'ta'
          ? 'ரூபி டெக் பார்க் மென்பொருள் சேவைகளுக்கான UPI மற்றும் Razorpay பாதுகாப்பான ஆன்லைன் கட்டணம்.'
          : 'Secure encrypted online payments for RUBI TECH PARK software development, subscriptions, and e-services booking via UPI and Razorpay.';
        break;
      case 'admin-login':
        pageTitle = 'Admin CRM Login | RUBI TECH PARK';
        break;
      case 'admin-dashboard':
        pageTitle = 'Lead Management CRM Dashboard | RUBI TECH PARK';
        break;
      case 'not-found':
        pageTitle = language === 'ta' ? 'பக்கம் கிடைக்கவில்லை (404) | ரூபி டெக் பார்க்' : 'Page Not Found (404) | RUBI TECH PARK';
        break;
    }

    document.title = pageTitle;
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDescription);
    }
  }, [currentRoute, language]);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '';
    } else if (route === 'admin-dashboard') {
      window.location.hash = '#/admin';
    } else if (route === 'admin-login') {
      window.location.hash = '#/admin/login';
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  const handleSelectCaseStudyForQuote = (study: CaseStudy) => {
    if (study.id === 'kuralvaani') {
      setSelectedServiceForQuote('ai-workflow-automation');
    } else if (study.id === 'apex-distribution-crm' || study.id === 'rubi-leads-crm') {
      setSelectedServiceForQuote('custom-crm');
    } else {
      setSelectedServiceForQuote('website-crm-integration');
    }
    navigateTo('contact');
  };

  const handleSelectOneTimeCheckout = (planId: string) => {
    setCheckoutConfig({
      planId,
      mode: 'one_time',
      billingCycle: 'monthly'
    });
    navigateTo('checkout');
  };

  const handleSelectSubscriptionCheckout = (planId: string, billingCycle: BillingCycle) => {
    setCheckoutConfig({
      planId,
      mode: 'subscription',
      billingCycle
    });
    navigateTo('checkout');
  };

  // Render current page component
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'services':
        return <ServicesOverviewPage onNavigate={navigateTo} />;
      case 'service-business-websites':
      case 'service-ecommerce':
      case 'service-custom-crm':
      case 'service-crm-integration':
      case 'service-ai-automation': {
        const found = SERVICES_DATA.find((s) => s.slug === currentRoute);
        if (found) {
          return <ServiceDetailPage service={found} onNavigate={navigateTo} />;
        }
        return <NotFoundPage onNavigate={navigateTo} />;
      }
      case 'pricing':
        return (
          <PricingPage
            onNavigate={navigateTo}
            onSelectPlanForCheckout={handleSelectOneTimeCheckout}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionsPage
            onNavigate={navigateTo}
            onSelectSubscriptionCheckout={handleSelectSubscriptionCheckout}
          />
        );
      case 'portfolio':
        return (
          <PortfolioPage
            onNavigate={navigateTo}
            onSelectProjectForQuote={handleSelectCaseStudyForQuote}
          />
        );
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'contact':
        return (
          <ContactPage
            onNavigate={navigateTo}
            initialService={selectedServiceForQuote}
          />
        );
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={navigateTo} />;
      case 'terms':
        return <TermsPage onNavigate={navigateTo} />;
      case 'refund-policy':
        return <RefundPolicyPage onNavigate={navigateTo} />;
      case 'service-delivery-policy':
        return <ServiceDeliveryPolicyPage onNavigate={navigateTo} />;
      case 'subscription-policy':
        return <SubscriptionPolicyPage onNavigate={navigateTo} />;
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={navigateTo}
            preselectedPlanId={checkoutConfig.planId}
            initialMode={checkoutConfig.mode}
            initialBillingCycle={checkoutConfig.billingCycle}
            leadId={checkoutConfig.leadId}
          />
        );
      case 'admin-login':
        return (
          <AdminLoginPage
            onNavigate={navigateTo}
            onLoginSuccess={() => navigateTo('admin-dashboard')}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardPage
            onNavigate={navigateTo}
            onLogout={() => navigateTo('home')}
          />
        );
      case 'not-found':
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  const isAdminDashboard = currentRoute === 'admin-dashboard';

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] flex flex-col font-sans selection:bg-[#00D4FF]/30 selection:text-white transition-colors duration-200">
      {/* Top Header with official logo, language switcher, and theme toggle */}
      {!isAdminDashboard && <Header currentRoute={currentRoute} onNavigate={navigateTo} />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      {!isAdminDashboard && <Footer onNavigate={navigateTo} />}

      {/* Floating WhatsApp Action Button */}
      {!isAdminDashboard && <WhatsAppFloatingButton />}

      {/* Floating AI Assistant Chatbot (Gemini Powered) */}
      {!isAdminDashboard && <RubiAssistantChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

