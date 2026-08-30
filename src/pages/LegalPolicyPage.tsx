import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  Ban,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe2,
  HeartHandshake,
  Sparkles,
  Send,
} from 'lucide-react';
import { HakkivedaWordmark } from '../components/HakkivedaWordmark';

export type LegalPolicyKey =
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'shipping-policy'
  | 'refund-policy'
  | 'cancellation-policy'
  | 'disclaimer'
  | 'contact';

interface LegalPolicyPageProps {
  initialPolicy?: LegalPolicyKey;
  onReturnHome?: () => void;
  onNavigatePolicy?: (policyKey: LegalPolicyKey) => void;
}

interface PolicyTabConfig {
  key: LegalPolicyKey;
  title: string;
  shortTitle: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const POLICY_TABS: PolicyTabConfig[] = [
  {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy',
    path: '/privacy-policy',
    icon: Lock,
    description: 'How we collect, protect, and handle your account and order information.',
  },
  {
    key: 'terms-and-conditions',
    title: 'Terms & Conditions',
    shortTitle: 'Terms',
    path: '/terms-and-conditions',
    icon: FileText,
    description: 'Guidelines, store terms, and commercial terms for using HAKKIVEDA.',
  },
  {
    key: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    shortTitle: 'Shipping',
    path: '/shipping-policy',
    icon: Truck,
    description: 'India & international delivery timelines, couriers, and customs duty information.',
  },
  {
    key: 'refund-policy',
    title: 'Return & Refund Policy',
    shortTitle: 'Refunds',
    path: '/refund-policy',
    icon: RotateCcw,
    description: 'Procedures for damaged, wrong, or missing items and hygiene guidelines.',
  },
  {
    key: 'cancellation-policy',
    title: 'Cancellation Policy',
    shortTitle: 'Cancellation',
    path: '/cancellation-policy',
    icon: Ban,
    description: 'Order modification and cancellation guidelines prior to dispatch.',
  },
  {
    key: 'disclaimer',
    title: 'Botanical & Product Disclaimer',
    shortTitle: 'Disclaimer',
    path: '/disclaimer',
    icon: AlertCircle,
    description: 'General informational purpose, Ayurvedic cosmetic nature, and allergy advice.',
  },
  {
    key: 'contact',
    title: 'Contact Us & Grievance Redressal',
    shortTitle: 'Contact',
    path: '/contact',
    icon: Mail,
    description: 'Business address, customer care phone, email, and support concierges.',
  },
];

export const LegalPolicyPage: React.FC<LegalPolicyPageProps> = ({
  initialPolicy = 'privacy-policy',
  onReturnHome,
  onNavigatePolicy,
}) => {
  const [activePolicy, setActivePolicy] = useState<LegalPolicyKey>(initialPolicy);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  useEffect(() => {
    setActivePolicy(initialPolicy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialPolicy]);

  const handleSelectPolicy = (key: LegalPolicyKey) => {
    setActivePolicy(key);
    const targetTab = POLICY_TABS.find((t) => t.key === key);
    if (targetTab) {
      if (onNavigatePolicy) {
        onNavigatePolicy(key);
      } else if (typeof window !== 'undefined') {
        window.history.pushState({}, '', targetTab.path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onReturnHome) {
      onReturnHome();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTab = POLICY_TABS.find((t) => t.key === activePolicy) || POLICY_TABS[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#0F2E22] min-h-screen font-sans selection:bg-[#C5A059] selection:text-[#0F2E22]">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER WITH FOREST GREEN & GOLD LUXURY THEME                     */}
      {/* ========================================================================= */}
      <header className="relative bg-[#0A2319] text-[#FAF7F2] border-b border-[#D4AF37]/30 pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2E22] via-[#0A2319] to-[#061811] opacity-90 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10 space-y-4">
          {/* Breadcrumbs & Home button */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#E5D8B5]">
              <a
                href="/"
                onClick={handleGoHome}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </a>
              <ChevronRight className="w-3 h-3 text-[#C5A059]/60" />
              <span className="text-[#C5A059] font-medium">Legal & Policies</span>
              <ChevronRight className="w-3 h-3 text-[#C5A059]/60" />
              <span className="text-white font-bold">{currentTab.shortTitle}</span>
            </nav>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/10 border border-[#C5A059]/30 text-[11px] text-[#E5D8B5] font-sans font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Verified HAKKIVEDA Official Policy</span>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-white tracking-tight">
              {currentTab.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#E5D8B5] max-w-3xl font-sans mt-1.5 leading-relaxed">
              {currentTab.description}
            </p>
          </div>

          {/* Last Updated Timestamp */}
          <div className="flex items-center gap-4 text-[11px] text-[#E5D8B5]/80 pt-1 font-sans">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C5A059]" />
              <span>Last Revised: August 2026</span>
            </span>
            <span>•</span>
            <span>Applies to hakkiveda.com</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN RESPONSIVE LAYOUT (SIDEBAR NAV + POLICY CONTENT)      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ------------------------------------------------------------- */}
          {/* SIDEBAR NAVIGATION (Desktop Sticky / Mobile Horizontal Scroll) */}
          {/* ------------------------------------------------------------- */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E5D8B5] rounded-2xl p-4 sm:p-5 shadow-xs lg:sticky lg:top-24">
              <h3 className="text-xs font-bold font-serif-luxury text-[#8E7026] uppercase tracking-[0.18em] mb-3 px-2">
                Legal & Customer Care Directory
              </h3>

              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-thin">
                {POLICY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.key === activePolicy;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleSelectPolicy(tab.key)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left font-sans text-xs sm:text-sm font-semibold transition-all duration-150 shrink-0 lg:w-full cursor-pointer ${
                        isActive
                          ? 'bg-[#0F2E22] text-[#FAF7F2] shadow-sm'
                          : 'text-[#37463D] hover:bg-[#FAF7F2] hover:text-[#0F2E22]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#C5A059]' : 'text-[#8E7026]'
                        }`}
                      />
                      <span className="truncate">{tab.title}</span>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block text-[#C5A059]" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Verified Business Info Card in Sidebar */}
              <div className="mt-6 pt-5 border-t border-[#E5D8B5] space-y-3 text-xs text-[#37463D]">
                <h4 className="text-[11px] font-bold text-[#0F2E22] font-sans uppercase tracking-wider">
                  Official Entity Contact
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8E7026] shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      <strong>HAKKIVEDA Herbal Enterprises</strong>
                      <br />
                      Door No. 574, V.P. Bore, Hunsur,
                      <br />
                      Mysore, Karnataka, India - 571105
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#8E7026] shrink-0" />
                    <a
                      href="tel:+917619536831"
                      className="hover:text-[#8E7026] transition-colors font-medium"
                    >
                      +91 76195 36831
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8E7026] shrink-0" />
                    <a
                      href="mailto:support@hakkiveda.com"
                      className="hover:text-[#8E7026] transition-colors font-medium"
                    >
                      support@hakkiveda.com
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/917619536831?text=Namaste%20HAKKIVEDA!%20I%20have%20an%20inquiry%20regarding%20store%20policies."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0F2E22]/5 hover:bg-[#0F2E22]/10 border border-[#8E7026]/30 text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#8E7026]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ------------------------------------------------------------- */}
          {/* POLICY CONTENT CANVAS                                         */}
          {/* ------------------------------------------------------------- */}
          <main className="lg:col-span-8 bg-white border border-[#E5D8B5] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* ========================================================================= */}
            {/* POLICY 1: PRIVACY POLICY                                                  */}
            {/* ========================================================================= */}
            {activePolicy === 'privacy-policy' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Privacy Policy
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    Effective Date: August 2026 | Scope: hakkiveda.com & associated services
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. Overview & Commitment to Customer Privacy
                  </h3>
                  <p>
                    HAKKIVEDA Herbal Enterprises (&ldquo;HAKKIVEDA&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to honoring and protecting the privacy of our website visitors, customers, and community members. This Privacy Policy details how we collect, handle, process, and safeguard information when you visit our website (<strong>https://hakkiveda.com</strong>), create a customer profile, place an order, or engage with our customer support and botanical tools.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    2. Information We Collect
                  </h3>
                  <p>
                    We collect only the information necessary to fulfill orders, maintain secure accounts, deliver accurate logistics, and provide attentive customer service:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Customer Account & Contact Information:</strong> Name, email address, telephone/mobile number, and account password hashes.
                    </li>
                    <li>
                      <strong>Shipping & Delivery Details:</strong> Physical delivery addresses, billing addresses, landmark notes, city, state, postal code/PIN code, and destination country.
                    </li>
                    <li>
                      <strong>Order & Transaction History:</strong> Records of purchased formulations, package sizes, quantities, order status, digital invoices, and AWB tracking identifiers.
                    </li>
                    <li>
                      <strong>Interactive AI Tool Inputs:</strong> Responses submitted to our AI Hair Quiz (e.g., self-reported hair density, scalp oiliness, hair concerns) and inquiries entered into the AI Botanical Chat Advisor, processed to provide tailored herbal routines.
                    </li>
                    <li>
                      <strong>Technical & Security Telemetry:</strong> IP addresses, browser user-agent signatures, device operating environment, and session timestamps utilized for rate limiting, CSRF protection, and platform fraud prevention.
                    </li>
                    <li>
                      <strong>Customer Support Communications:</strong> Inquiries, emails, ticket details, and direct messages sent to our customer care team.
                    </li>
                  </ul>
                </section>

                {/* DEDICATED COOKIE & LOCAL STORAGE SECTION */}
                <section className="space-y-3 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl p-5">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#8E7026]" />
                    <span>3. Cookies & Local Storage</span>
                  </h3>
                  <p className="text-xs sm:text-sm">
                    We use standard browser cookies and local storage exclusively for essential operational and functional purposes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Customer & Admin Authentication Cookies:</strong> Secure, HTTP-only authentication tokens (e.g. <code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_customer_token</code> and <code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_admin_token</code>) to keep you signed in securely and prevent session tampering.
                    </li>
                    <li>
                      <strong>Shopping Cart Storage:</strong> Browser local storage (<code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_cart</code>) to retain your selected herbal items across page refreshes.
                    </li>
                    <li>
                      <strong>Currency & Regional Preferences:</strong> Stored local preference keys (<code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_currency</code>) to preserve your chosen billing display currency.
                    </li>
                    <li>
                      <strong>Theme & Display Preferences:</strong> Stored local settings (<code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_theme</code>, <code className="text-[11px] bg-white px-1 py-0.5 rounded border border-[#E5D8B5]">hakkiveda_sound_enabled</code>).
                    </li>
                    <li>
                      <strong>Recently Viewed Items:</strong> Client-side storage of recently viewed formulations to assist your shopping navigation.
                    </li>
                  </ul>
                  <p className="text-xs text-[#6B7C72]">
                    These mechanisms are strictly functional and necessary for the site to operate securely and smoothly.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. Third-Party Payment Processing & Zero Card Storage
                  </h3>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F2E22] text-xs sm:text-sm space-y-2">
                    <p className="font-semibold flex items-center gap-1.5 text-[#0F2E22]">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Strict Payment Data Handling Disclosure</span>
                    </p>
                    <p>
                      <strong>HAKKIVEDA does NOT receive, process, or store raw credit/debit card numbers, CVVs, or bank account login passwords.</strong>
                    </p>
                    <p>
                      When you initiate an online prepaid checkout, payment processing is handled securely inside the encrypted checkout interface provided by our licensed payment gateway partner, <strong>Razorpay</strong> (PCI-DSS Level 1 certified). Razorpay securely transmits transaction authorization status, order IDs, and payment references (<code className="text-[11px] bg-white px-1 py-0.5 rounded">razorpay_payment_id</code>) back to our servers to confirm your order.
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    5. Logistics & Shipping Partners
                  </h3>
                  <p>
                    To fulfill and dispatch your orders, we share necessary shipping information (recipient name, contact telephone, delivery address, and PIN code) with our integrated logistics aggregation partner (<strong>Shiprocket</strong>) and contracted air/ground couriers (such as Delhivery, Bluedart, SpeedPost, DHL, or FedEx). These partners process your address solely to carry out delivery and generate real-time tracking updates.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    6. Data Security & Retention Principles
                  </h3>
                  <p>
                    We maintain technical, organizational, and procedural controls designed to safeguard your information against unauthorized access, loss, or alteration. All database communication, administrative access, and password hashing (utilizing salted bcrypt) follow current industry engineering standards. We retain your transaction and order data for the duration required to satisfy statutory tax, auditing, warranty, and customer care obligations.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    7. Customer Data Rights & Account Management
                  </h3>
                  <p>
                    Every customer registered on HAKKIVEDA is entitled to control their personal data directly:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Profile Correction:</strong> You can edit your name, contact phone, and saved delivery addresses anytime inside your Customer Portal.
                    </li>
                    <li>
                      <strong>Full Data Export:</strong> You can download a complete structured JSON copy of your personal dossier (including orders, addresses, and tickets) from the Customer Portal settings.
                    </li>
                    <li>
                      <strong>Account Deletion:</strong> You may request permanent deletion of your customer profile and account credentials directly from the Customer Portal.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    8. Privacy Inquiries & Grievance Contact
                  </h3>
                  <p>
                    For any questions, clarifications, or requests concerning this Privacy Policy or your personal information, please write to:
                  </p>
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl text-xs space-y-1">
                    <p className="font-bold text-[#0F2E22]">Privacy & Grievance Officer</p>
                    <p>HAKKIVEDA Herbal Enterprises</p>
                    <p>Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105</p>
                    <p>Email: <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline font-medium">support@hakkiveda.com</a> | Phone: +91 76195 36831</p>
                  </div>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 2: TERMS & CONDITIONS                                              */}
            {/* ========================================================================= */}
            {activePolicy === 'terms-and-conditions' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Terms & Conditions
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    Last Updated: August 2026 | Operating Domain: hakkiveda.com
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. Agreement to Terms
                  </h3>
                  <p>
                    These Terms and Conditions govern your access to and use of the website <strong>https://hakkiveda.com</strong> (the &ldquo;Site&rdquo;) and the purchase of any handcrafted herbal cosmetic products from <strong>HAKKIVEDA Herbal Enterprises</strong>. By accessing our Site or placing an order, you agree to be bound by these Terms and our accompanying Privacy, Shipping, and Refund Policies.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    2. Customer Accounts & Security
                  </h3>
                  <p>
                    When creating an account, you agree to provide accurate, complete, and current contact details. You are responsible for maintaining the confidentiality of your account password and for restricting unauthorized access to your device. You agree to notify HAKKIVEDA immediately upon discovering any unauthorized use of your account.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    3. Product Descriptions & Botanical Formulations
                  </h3>
                  <p>
                    HAKKIVEDA products are traditional Ayurvedic and herbal cosmetic preparations handcrafted using plant botanicals, forest herbs, and oils. We take reasonable care to display accurate ingredient lists, usage rituals, bottle volumes, and imagery. Because our formulations incorporate natural botanical harvests, minor seasonal variations in natural color, herbal scent, and viscosity may occur naturally between batches.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. Pricing, Currency & Taxes
                  </h3>
                  <p>
                    All product prices displayed in Indian Rupees (INR) for domestic orders are inclusive of applicable goods and services taxes (GST). For international orders, prices may be displayed in your selected local currency for convenience; actual settlement and billing details are presented clearly during checkout prior to payment authorization.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    5. Order Submission, Acceptance & Cancellation Rights
                  </h3>
                  <p>
                    Submitting an order constitutes an offer to purchase. An order is deemed accepted when we dispatch the package and issue an official invoice and shipping tracking number. HAKKIVEDA reserves the right to decline, hold, or cancel orders in circumstances involving:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>Unavailability of seasonal herbal inventory or packaging components;</li>
                    <li>Identifiable technical, typographical, or pricing calculation errors;</li>
                    <li>Incomplete, unverified, or non-serviceable delivery addresses;</li>
                    <li>Suspected fraudulent, high-risk, or unauthorized payment transactions.</li>
                  </ul>
                  <p className="text-xs sm:text-sm">
                    If an order is cancelled by HAKKIVEDA after payment has been completed, a full refund will be initiated to the original payment source.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    6. Payment Methods & Cash on Delivery (COD)
                  </h3>
                  <p>
                    We accept secure online prepaid payments via Razorpay (UPI, debit/credit cards, and netbanking). For eligible domestic shipments within India, Cash on Delivery (COD) is available subject to order value thresholds. All international shipments require online prepaid checkout.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    7. Shipping, Returns & Cancellations
                  </h3>
                  <p>
                    Shipping terms, transit timelines, and international customs considerations are governed by our dedicated <button onClick={() => handleSelectPolicy('shipping-policy')} className="text-[#8E7026] underline font-semibold cursor-pointer">Shipping & Delivery Policy</button>. Return procedures and hygiene guidelines are governed by our <button onClick={() => handleSelectPolicy('refund-policy')} className="text-[#8E7026] underline font-semibold cursor-pointer">Return & Refund Policy</button>. Cancellation rules are detailed in our <button onClick={() => handleSelectPolicy('cancellation-policy')} className="text-[#8E7026] underline font-semibold cursor-pointer">Cancellation Policy</button>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    8. Intellectual Property
                  </h3>
                  <p>
                    All content on this Site—including the HAKKIVEDA name, logos, trade dress, product names, botanical descriptions, photographs, graphics, videos, and software code—is the property of HAKKIVEDA Herbal Enterprises and is protected by applicable intellectual property and copyright laws. Unauthorized reproduction, scraping, reverse-engineering, or commercial exploitation is strictly prohibited.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    9. Prohibited Conduct
                  </h3>
                  <p>
                    You agree not to use the Site for any unlawful purpose, introduce malicious software or bots, execute automated load attacks, impersonate representatives of HAKKIVEDA, or attempt unauthorized access to server systems or user accounts.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    10. Limitation of Liability
                  </h3>
                  <p>
                    To the maximum extent permitted by applicable law, HAKKIVEDA Herbal Enterprises shall not be liable for indirect, incidental, or consequential damages arising out of your use of the Site or products. In any event, our total liability for any claim shall not exceed the actual purchase price paid by you for the specific product giving rise to the claim. Nothing in these Terms shall limit or exclude any statutory consumer rights that cannot be excluded under applicable law.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    11. Governing Law & Contact
                  </h3>
                  <p>
                    These Terms are governed by and construed in accordance with the laws of India. For any commercial or legal questions, please contact HAKKIVEDA Herbal Enterprises at <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline font-medium">support@hakkiveda.com</a>.
                  </p>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 3: SHIPPING POLICY                                                 */}
            {/* ========================================================================= */}
            {activePolicy === 'shipping-policy' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Shipping & Delivery Policy
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    Handcrafted in Mysore, Karnataka | Worldwide Express Dispatch
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. Operating Model & Coverage
                  </h3>
                  <p>
                    HAKKIVEDA delivers across all major regions in India and to international destinations worldwide (including the USA, United Kingdom, Canada, Australia, Singapore, Malaysia, UAE, Mauritius, Fiji, and other global markets).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl">
                      <p className="text-xs font-bold text-[#0F2E22] uppercase tracking-wider">
                        🇮🇳 Domestic India Orders
                      </p>
                      <p className="text-xs text-[#37463D] mt-1">
                        Eligible for Cash on Delivery (COD) or Online Prepaid payment via Razorpay. Free express shipping on eligible orders.
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl">
                      <p className="text-xs font-bold text-[#0F2E22] uppercase tracking-wider">
                        🌍 International Shipments
                      </p>
                      <p className="text-xs text-[#37463D] mt-1">
                        All overseas orders require 100% secure online prepaid checkout. Dispatched via international air express couriers.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    2. Order Processing & Dispatch Timelines
                  </h3>
                  <p>
                    Because each bottle of HAKKIVEDA formulation is handcrafted in small batches, orders are carefully inspected, bubble-wrapped in tamper-evident protective packaging, and handed over to courier logistics partners within <strong>24 to 48 business hours</strong> of order confirmation (excluding Sundays and national public holidays).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    3. Courier Partners & Real-Time Tracking
                  </h3>
                  <p>
                    We partner with established logistics carriers including Delhivery, Bluedart, SpeedPost, DHL, FedEx, and Shiprocket. Once your package is scanned at the fulfillment hub, an automated shipping confirmation containing your Air Waybill (AWB) number and direct live tracking link is sent to your registered email or phone number.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. Estimated Delivery Timelines
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526359] italic">
                    Note: Delivery timelines are estimates provided by courier networks and are not absolute guarantees.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Major Indian Metros (Bengaluru, Mumbai, Delhi, Chennai, Hyderabad):</strong> Estimated 2 to 4 business days post-dispatch.
                    </li>
                    <li>
                      <strong>Rest of India / Tier 2 & Tier 3 Cities:</strong> Estimated 3 to 6 business days post-dispatch.
                    </li>
                    <li>
                      <strong>Remote / North-East / Island Regions:</strong> Estimated 5 to 8 business days post-dispatch.
                    </li>
                    <li>
                      <strong>International Air Express (USA, UK, Europe, UAE, SEA):</strong> Estimated 4 to 10 business days post-dispatch (subject to international customs clearance).
                    </li>
                  </ul>
                </section>

                {/* CRITICAL INTERNATIONAL CUSTOMS & DUTY DISCLOSURE */}
                <section className="space-y-3 bg-amber-50 border border-amber-200 rounded-xl p-5 text-[#0F2E22]">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold flex items-center gap-2 text-[#0F2E22]">
                    <Globe2 className="w-4 h-4 text-[#8E7026]" />
                    <span>5. International Customs Duties, Import Taxes & Regulations</span>
                  </h3>
                  <p className="text-xs sm:text-sm">
                    For all international orders shipped outside of India:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Destination Customs & Taxes:</strong> Destination-country customs duties, import taxes, value-added taxes (VAT), and local clearance handling fees may apply upon arrival in the destination country. Unless specifically stated otherwise during checkout, <strong>these charges are the sole responsibility of the customer/recipient</strong>.
                    </li>
                    <li>
                      <strong>Customs Clearance Delays:</strong> International delivery estimates are subject to destination border customs inspection and agricultural/botanical clearance procedures, which may occasionally cause transit delays outside of HAKKIVEDA&rsquo;s control.
                    </li>
                    <li>
                      <strong>Import Permissibility:</strong> Customers are responsible for verifying whether personal care herbal formulations can be legally imported into their destination country under local customs regulations.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    6. Address Accuracy & Delivery Attempts
                  </h3>
                  <p>
                    Please ensure that complete address details (including street name, door/flat number, landmark, city, and correct postal code) and an active telephone number are provided. Courier partners generally make up to 2–3 delivery attempts before marking a shipment for Return-to-Origin (RTO).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    7. Shipping Inquiries
                  </h3>
                  <p>
                    For tracking assistance or address adjustments before dispatch, contact our logistics desk at <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline font-medium">support@hakkiveda.com</a> or WhatsApp <strong>+91 76195 36831</strong> with your Order ID.
                  </p>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 4: RETURN & REFUND POLICY (7-DAY STORE POLICY)                     */}
            {/* ========================================================================= */}
            {activePolicy === 'refund-policy' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Returns & Refunds Policy
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    Standard 7-Day Window | HAKKIVEDA Herbal Enterprises Customer Care
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. 7-Day Request Window & Core Eligibility
                  </h3>
                  <p>
                    At HAKKIVEDA, we stand behind the craftsmanship and purity of our traditional Hakki-Pikki herbal formulations. Any return, replacement, or refund request must normally be raised within <strong>7 days of delivery</strong> as recorded by the carrier delivery confirmation.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    2. Damaged, Defective, or Incorrect Items
                  </h3>
                  <p>
                    If your shipment arrives damaged in transit, defective, leaked, or contains an incorrect product/variant compared to your order, you are entitled to a prompt replacement or refund following reasonable verification by our customer care team.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    3. Unopened & Sealed Products
                  </h3>
                  <p>
                    Unopened products with original outer packaging, tamper-evident seals, and protective bottle caps fully intact may be considered for return or exchange within the 7-day window.
                  </p>
                </section>

                <section className="space-y-3 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl p-5">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. Opened or Used Products & Hygiene Guidelines
                  </h3>
                  <p className="text-xs sm:text-sm">
                    Because our formulations are topical herbal oils, scalp lepas, and personal-care cosmetics, <strong>opened or used products are generally non-returnable for health, safety, and hygiene reasons</strong>, unless the item is verified as damaged, defective, materially incorrect, or otherwise required by applicable consumer protection laws.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    5. How to Raise a Request
                  </h3>
                  <p>
                    To initiate a return, replacement, or refund claim, please contact our support team within 7 days of delivery via:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Email: <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline font-medium">support@hakkiveda.com</a></li>
                    <li>WhatsApp Customer Care: <a href="https://wa.me/917619536831" target="_blank" rel="noopener noreferrer" className="text-[#8E7026] underline font-medium">+91 76195 36831</a></li>
                    <li>Customer Portal: Submit a return ticket directly from your account order history.</li>
                  </ul>
                  <p className="text-xs sm:text-sm">
                    Please include your Order ID, contact telephone number, and a brief description of the issue.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    6. Supporting Evidence
                  </h3>
                  <p>
                    To verify transit damage, leakage, or incorrect fulfillment, our customer care team may ask for reasonable photographic or video evidence showing the outer parcel label, packaging box, and the condition of the received bottle/container.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    7. Reverse Shipping & Collection
                  </h3>
                  <p>
                    Where a physical return is required, our logistics team will schedule a reverse pickup via our courier partners (such as Delhivery or Shiprocket) where reverse pickup service is available for your PIN code. If reverse pickup is unavailable in your area, our support team will guide you on secure return courier dispatch.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    8. Refund Methods & Payment Sources
                  </h3>
                  <p>
                    For approved refunds on prepaid orders (UPI, Netbanking, Debit/Credit Card), the refund is processed directly back to the original payment method used during checkout via our payment gateway (Razorpay).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    9. Cash on Delivery (COD) Refunds
                  </h3>
                  <p>
                    COD refunds cannot be returned as physical cash through courier delivery agents. Approved refunds for COD orders will be processed via secure NEFT bank transfer or verified UPI transfer coordinated by our customer care team through authenticated support channels. Sensitive banking details are used solely for the disbursement and are never stored unnecessarily.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    10. International Returns & Cross-Border Orders
                  </h3>
                  <p>
                    International return requests must also be raised within 7 days of delivery where eligible. Because cross-border shipments involve customs duties, import tariffs, and high international freight costs, physical reverse shipping from overseas may not always be practical. Depending on circumstances, HAKKIVEDA may resolve eligible claims through replacement dispatch, partial/full refund, or return shipment. Free international reverse shipping is not provided in every case.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    11. Refund Processing & Bank Settlement Timeline
                  </h3>
                  <p>
                    Once a refund is approved and processed by HAKKIVEDA, the time taken for the amount to appear in the original payment method depends on the bank, card issuer, UPI provider, or payment gateway network.
                  </p>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 5: CANCELLATION POLICY (SAFE VERSION)                              */}
            {/* ========================================================================= */}
            {activePolicy === 'cancellation-policy' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Cancellation Policy
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    Order Modification & Cancellation Guidelines
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. Requesting an Order Cancellation
                  </h3>
                  <p>
                    We understand that circumstances may change. If you need to cancel or modify your order, please contact our customer care team as early as possible after placing your order.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    2. Cancellation Prior to Dispatch
                  </h3>
                  <p>
                    Orders can typically be cancelled smoothly before they are packed and handed over to courier logistics partners (prior to AWB generation and courier pickup). Once cancelled in our system:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Prepaid Orders:</strong> A 100% refund of the transaction total is initiated back to your original payment method via Razorpay.
                    </li>
                    <li>
                      <strong>Cash on Delivery (COD) Orders:</strong> The order is simply voided in our fulfillment queue with no financial transaction to reverse.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    3. Orders Already in Transit
                  </h3>
                  <p>
                    Once a parcel has been manifested and handed to the courier partner, cancellation is no longer possible while in flight. In such cases, standard delivery will proceed, and any subsequent return request will be handled in accordance with our <button onClick={() => handleSelectPolicy('refund-policy')} className="text-[#8E7026] underline font-semibold cursor-pointer">Return & Refund Policy</button>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. How to Request Cancellation
                  </h3>
                  <p>
                    To request a cancellation, please contact our support team immediately with your Order ID:
                  </p>
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#E5D8B5] rounded-xl text-xs space-y-1">
                    <p><strong>WhatsApp Care:</strong> <a href="https://wa.me/917619536831" target="_blank" rel="noopener noreferrer" className="text-[#8E7026] underline">+91 76195 36831</a> (Fastest response)</p>
                    <p><strong>Email Support:</strong> <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline">support@hakkiveda.com</a> (Subject: Urgent Cancellation - Order #...)</p>
                  </div>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 6: DISCLAIMER                                                      */}
            {/* ========================================================================= */}
            {activePolicy === 'disclaimer' && (
              <article className="space-y-6 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Botanical & Product Disclaimer
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    General Information & Ayurvedic Wellness Disclosures
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    1. General Informational Nature of Content
                  </h3>
                  <p>
                    The content published on this website (<strong>https://hakkiveda.com</strong>), including botanical descriptions, historical folklore of the Hakki-Pikki tribal traditions, Ayurvedic ingredient glossaries, blog articles, and AI advisor recommendations, is provided solely for general educational, cultural, and informational wellness purposes.
                  </p>
                </section>

                <section className="space-y-3 bg-amber-50 border border-amber-200 rounded-xl p-5 text-[#0F2E22]">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#8E7026]" />
                    <span>2. Not Medical Advice or Clinical Diagnosis</span>
                  </h3>
                  <p className="text-xs sm:text-sm">
                    <strong>HAKKIVEDA products are traditional Ayurvedic and herbal cosmetic preparations for external scalp and hair care. They are not pharmaceutical drugs and are not intended to diagnose, treat, cure, or prevent any medical condition, scalp infection, or clinical disease.</strong>
                  </p>
                  <p className="text-xs sm:text-sm">
                    Website content and AI-assisted questionnaires do not establish a doctor-patient relationship and should never replace qualified medical consultation with a dermatologist, trichologist, or healthcare professional.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    3. Individual Results May Vary
                  </h3>
                  <p>
                    Because human scalp biology is influenced by multiple intrinsic factors—including genetic profile, hormonal balance, dietary nutrition, stress levels, age, water quality, and environmental exposure—individual results obtained from traditional herbal preparations naturally vary from person to person.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    4. Patch Test Advisory & Natural Sensitivities
                  </h3>
                  <p>
                    Although our formulations are crafted from natural mountain botanicals and cold-pressed seed oils, rare individual plant sensitivities can occur. We strongly advise performing a <strong>24-hour patch test</strong> (applying a small drop behind the ear or on the inner elbow) before first regular use. If irritation, burning, or redness develops, discontinue use immediately and rinse thoroughly with clean water.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    5. Pregnancy, Nursing & Medical Conditions
                  </h3>
                  <p>
                    If you are pregnant, nursing, undergoing specialized dermatological or oncology treatments, or managing severe open scalp lesions, please consult your personal physician before introducing any new topical herbal products.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    6. External Services & Third-Party Platforms
                  </h3>
                  <p>
                    Our Site may link to third-party payment gateways, video platforms (such as YouTube), or courier tracking portals. HAKKIVEDA is not responsible for the independent content, availability, or operational policies of external websites.
                  </p>
                </section>
              </article>
            )}

            {/* ========================================================================= */}
            {/* POLICY 7: CONTACT US & GRIEVANCE REDRESSAL                                */}
            {/* ========================================================================= */}
            {activePolicy === 'contact' && (
              <article className="space-y-8 text-[#2C3831] leading-relaxed font-sans text-sm sm:text-base">
                <header className="border-b border-[#E5D8B5] pb-4">
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2E22]">
                    Contact Us & Customer Support
                  </h2>
                  <p className="text-xs text-[#6B7C72] mt-1 font-sans">
                    HAKKIVEDA Customer Concierge & Grievance Redressal Desk
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Verified Office Card */}
                  <div className="bg-[#FAF7F2] border border-[#E5D8B5] rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold font-serif-luxury text-[#0F2E22] uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8E7026]" />
                      <span>Registered Business Address</span>
                    </h3>
                    <div className="text-xs sm:text-sm text-[#37463D] space-y-1">
                      <p className="font-bold text-[#0F2E22]">HAKKIVEDA Herbal Enterprises</p>
                      <p>Door No. 574, V.P. Bore,</p>
                      <p>Hunsur, Mysore, Karnataka,</p>
                      <p>India - 571105</p>
                    </div>

                    <div className="pt-2 border-t border-[#E5D8B5] space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#8E7026]" />
                        <span><strong>Phone:</strong> +91 76195 36831</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#8E7026]" />
                        <span><strong>Email:</strong> support@hakkiveda.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8E7026]" />
                        <span><strong>Hours:</strong> Mon – Sat: 9:00 AM – 7:00 PM IST</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support Box */}
                  <div className="bg-[#0F2E22] text-[#FAF7F2] border border-[#C5A059]/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[10px] text-[#E5D8B5] font-bold tracking-wider uppercase">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span>Direct Tribal Concierge</span>
                      </div>
                      <h3 className="text-lg font-serif-luxury font-bold text-white">
                        Instant WhatsApp Assistance
                      </h3>
                      <p className="text-xs text-[#E5D8B5] leading-relaxed">
                        For rapid questions regarding orders, product authenticity verification, or hair regimen advice, connect directly with our Mysore herbal support team on WhatsApp.
                      </p>
                    </div>

                    <a
                      href="https://wa.me/917619536831?text=Namaste%20HAKKIVEDA!%20I%20would%20like%20to%20inquire%20about%20your%20products."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C5A059] hover:bg-white text-[#0F2E22] font-sans text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 text-[#0F2E22]" />
                      <span>Chat on WhatsApp (+91 76195 36831)</span>
                    </a>
                  </div>
                </div>

                {/* Interactive Public Contact Inquiry Form */}
                <div className="bg-[#FAF7F2] border border-[#E5D8B5] rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F2E22]">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs text-[#526359]">
                    Leave us a message below and our support team will respond via email or WhatsApp within 24 business hours.
                  </p>

                  {contactSubmitted ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-[#0F2E22]">
                        Thank You, {contactForm.name || 'Friend'}!
                      </h4>
                      <p className="text-xs sm:text-sm text-[#37463D] max-w-md mx-auto">
                        Your message has been received. Our customer care desk has been notified and will reply to <strong>{contactForm.email}</strong> shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                        }}
                        className="text-xs text-[#8E7026] hover:underline font-bold uppercase tracking-wider pt-2 cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#0F2E22]">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full bg-white border border-[#E5D8B5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F2E22] focus:outline-none focus:border-[#0F2E22]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#0F2E22]">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. ramesh@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full bg-white border border-[#E5D8B5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F2E22] focus:outline-none focus:border-[#0F2E22]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#0F2E22]">Phone / WhatsApp Number</label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full bg-white border border-[#E5D8B5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F2E22] focus:outline-none focus:border-[#0F2E22]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#0F2E22]">Inquiry Topic</label>
                          <select
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            className="w-full bg-white border border-[#E5D8B5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F2E22] focus:outline-none focus:border-[#0F2E22]"
                          >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                            <option value="Authenticity Verification">Authenticity Verification</option>
                            <option value="Product Usage Advice">Product Usage Advice</option>
                            <option value="B2B Wholesale / Export">B2B Wholesale / Export</option>
                            <option value="Return or Replacement">Return or Replacement</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#0F2E22]">Your Message *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Please provide order details or questions..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-white border border-[#E5D8B5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F2E22] focus:outline-none focus:border-[#0F2E22]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0F2E22] hover:bg-[#1A4535] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Submit Inquiry</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Grievance Officer statutory disclosure */}
                <section className="space-y-2 pt-2 border-t border-[#E5D8B5] text-xs text-[#526359]">
                  <h4 className="font-bold text-[#0F2E22] uppercase tracking-wider">
                    Statutory Grievance Redressal Mechanism
                  </h4>
                  <p>
                    In accordance with the Consumer Protection (E-Commerce) Rules and Information Technology Act, the designated Grievance Officer for HAKKIVEDA Herbal Enterprises is reachable at:
                  </p>
                  <p>
                    <strong>Grievance Desk:</strong> HAKKIVEDA Herbal Enterprises, Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka - 571105. Email: <a href="mailto:support@hakkiveda.com" className="text-[#8E7026] underline">support@hakkiveda.com</a> | Tel: +91 76195 36831.
                  </p>
                </section>
              </article>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
