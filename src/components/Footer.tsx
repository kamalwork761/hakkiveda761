import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { SoundToggle } from './SoundToggle';
import { PaymentIcons } from './PaymentIcons';

const VERIFICATION_POINTS = [
  {
    id: 'brand',
    title: 'CHECK THE HAKKIVEDA BRAND NAME',
    description: 'Confirm authentic HAKKIVEDA branding before purchasing.',
  },
  {
    id: 'packaging',
    title: 'CHECK THE PACKAGING',
    description: 'Inspect the label, seal and product batch information.',
  },
  {
    id: 'channels',
    title: 'BUY FROM TRUSTED CHANNELS',
    description: 'Prefer HAKKIVEDA and our authorized sales channels.',
  },
  {
    id: 'unsure',
    title: 'UNSURE ABOUT A PRODUCT?',
    description: 'Contact HAKKIVEDA for verification assistance.',
  },
];

export const Footer: React.FC = () => {
  const { footerConfig, siteSettings, setIsQuizOpen, playSound } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cfg = footerConfig || {};

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    playSound?.('form_submit');
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const addressText =
    cfg.address ||
    siteSettings?.address ||
    'Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105';
  const phoneText = cfg.phone || siteSettings?.phone || '+91 76195 36831';
  const whatsappNum = cfg.whatsappNumber || siteSettings?.whatsappNumber || '917619536831';
  const emailText = cfg.email || siteSettings?.email || 'hakkiveda@gmail.com';
  const brandDesc =
    cfg.brandDescription ||
    siteSettings?.footerAbout ||
    'Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.';
  const currentYear = new Date().getFullYear();
  const copyrightStr =
    cfg.copyrightText ||
    siteSettings?.footerCopyright ||
    `© ${currentYear} HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.`;

  // Mobile & Shared Advisory Configurations
  const mobileCfg = cfg.mobileFooter || {};
  const showWarningSection = mobileCfg.showWarningSection !== false;
  const warningHeading = mobileCfg.warningHeading || 'BEWARE OF COUNTERFEIT PRODUCTS';
  const mobileSloganText = mobileCfg.sloganText || 'Blend of Hakki-Pikki Tribe & Ayurveda';
  const mobileCopyrightText = mobileCfg.copyrightText || `© ${currentYear} HAKKIVEDA`;

  const whatsappVerifyUrl = `https://wa.me/${whatsappNum.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(
    'Namaste HAKKIVEDA! I would like to verify the authenticity of my product.'
  )}`;

  return (
    <footer className="w-full bg-[#FAF7F2] font-sans" id="site-footer">
      {/* ========================================================================= */}
      {/* 1. AUTHENTICITY & CONSUMER NOTICE (SHARED LUXURY BANNER - NO SLOP/RED)     */}
      {/* ========================================================================= */}
      {showWarningSection && (
        <section
          id="authenticity-notice-section"
          className="w-full bg-[#FAF7F2] border-t border-[#E5D8B5] py-10 sm:py-14 select-none relative overflow-hidden"
          aria-label="Authenticity and Consumer Notice"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white border border-[#E5D8B5] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm space-y-6">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5D8B5] pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F2E22]/5 border border-[#8E7026]/30 text-[10px] sm:text-xs font-bold text-[#8E7026] tracking-[0.2em] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8E7026]" />
                    <span>BUY GENUINE. STAY INFORMED.</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-luxury font-bold text-[#0F2E22] tracking-tight">
                    {warningHeading}
                  </h3>
                </div>

                <a
                  href={whatsappVerifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2E22] hover:bg-[#1A4535] text-white hover:text-amber-200 border border-[#C5A059]/40 font-sans text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200 shadow-sm shrink-0 w-full sm:w-auto"
                >
                  <span>VERIFY A PRODUCT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </a>
              </div>

              {/* Supporting Copy */}
              <p className="text-xs sm:text-sm text-[#37463D] leading-relaxed font-sans max-w-3xl">
                Counterfeit and imitation products may be sold using similar &ldquo;Adivasi Hair Oil&rdquo; names,
                packaging or promotional content. For genuine HAKKIVEDA products, always check the brand name, packaging and
                seller before purchasing. Purchase through HAKKIVEDA or our authorized sales channels whenever possible. If you are
                unsure about a product, contact HAKKIVEDA before use.
              </p>

              {/* 4 Compact Verification Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {VERIFICATION_POINTS.map((point) => (
                  <div
                    key={point.id}
                    className="bg-[#FAF7F2] border border-[#E5D8B5] hover:border-[#C5A059]/60 rounded-xl p-3.5 transition-all duration-200 shadow-2xs flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0F2E22]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F2E22]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-[#0F2E22] font-sans uppercase tracking-wider">
                        {point.title}
                      </h4>
                      <p className="text-[11px] text-[#37463D] font-sans leading-snug mt-0.5">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. MINIMAL MOBILE FOOTER (CLEAN, COMPACT, ~100PX, ZERO OVERSIZED MENUS)   */}
      {/* ========================================================================= */}
      <div className="block md:hidden bg-[#0A2319] text-[#FAF7F2] text-center border-t border-[#D4AF37]/25 select-none">
        <div
          className="py-6 px-4 space-y-2 max-w-sm mx-auto"
          style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Brand Name / Slogan */}
          <div className="space-y-1">
            <h4 className="text-base font-serif-luxury font-bold tracking-[0.2em] text-[#C5A059]">
              HAKKIVEDA
            </h4>
            <p className="text-[11px] text-[#FAF7F2] font-serif tracking-wide font-normal">
              {mobileSloganText}
            </p>
          </div>

          {/* Dynamic Copyright Year */}
          <p className="text-[10px] text-[#E5D8B5] font-sans tracking-wider pt-1">
            {mobileCopyrightText}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DESKTOP FOOTER (UNTOUCHED - RETAINS ALL COLUMNS, LOGO, SHIPPING, ETC) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[var(--brand-primary-deeper)] text-slate-100 font-sans border-t border-[var(--brand-gold)]/30 pt-16 pb-12 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Brand Info */}
            {cfg.showBrandColumn !== false && (
              <div className="lg:col-span-4 space-y-4">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 group cursor-pointer w-fit"
                  title="Return to Homepage"
                >
                  {cfg.brandLogo ? (
                    <img
                      src={cfg.brandLogo}
                      alt={cfg.brandLogoText || 'Brand Logo'}
                      className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <span className="w-8 h-8 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center font-serif font-bold text-lg shrink-0 transition-transform duration-200 group-hover:scale-105">
                        {(cfg.brandLogoText || 'H')[0]}
                      </span>
                      <HakkivedaWordmark size="md" theme="dark-header" />
                    </>
                  )}
                </a>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {brandDesc}
                </p>

                <div className="pt-2 space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                    <span>{addressText}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <a
                      href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--brand-gold)] transition-colors"
                    >
                      {phoneText} (WhatsApp)
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <a href={`mailto:${emailText}`} className="hover:text-[var(--brand-gold)] transition-colors">
                      {emailText}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Navigation Columns */}
            {Array.isArray(cfg.columns) &&
              cfg.columns
                .filter((col) => col.enabled !== false)
                .map((col) => (
                  <div key={col.id} className="lg:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em]">
                      {col.title}
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {Array.isArray(col.links) &&
                        col.links.map((lnk) => (
                          <li key={lnk.id}>
                            {lnk.url === 'quiz' ? (
                              <button
                                onClick={() => setIsQuizOpen?.(true)}
                                className="text-[var(--brand-gold)] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{lnk.label}</span>
                              </button>
                            ) : (
                              <a
                                href={lnk.url}
                                target={lnk.isExternal ? '_blank' : '_self'}
                                rel={lnk.isExternal ? 'noreferrer' : undefined}
                                className="hover:text-[var(--brand-gold)] transition-colors inline-flex items-center gap-1.5"
                              >
                                <span>{lnk.label}</span>
                                {lnk.isBadge && lnk.badgeText && (
                                  <span className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                    {lnk.badgeText}
                                  </span>
                                )}
                              </a>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}

            {/* Worldwide Shipping Column */}
            {cfg.showShippingColumn !== false && (
              <div className="lg:col-span-3 space-y-3">
                <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <span>🌍 {cfg.shippingTitle || 'WORLDWIDE SHIPPING'}</span>
                </h4>

                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {Array.isArray(cfg.shippingItems) &&
                    cfg.shippingItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <span className="text-[var(--brand-gold)] font-bold">✓</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                </ul>

                <div className="pt-2 flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      alert(
                        cfg.shippingPolicyModalContent ||
                          'Shipping Policy:\n• Orders dispatched within 24-48 business hours.\n• Tracked shipping via DHL/FedEx/SpeedPost.\n• Free Express Shipping on orders over ₹1,999 (India) or $99 (Global).'
                      );
                    }}
                    className="text-xs font-bold text-[var(--brand-gold)] hover:text-white transition-colors inline-flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <span>{cfg.shippingPolicyButtonText || 'View Shipping Policy'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound?.('nav_click');
                      window.history.pushState({}, '', '/b2b-enquiry');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[11px] text-slate-300 hover:text-[var(--brand-gold)] underline font-medium text-left cursor-pointer"
                  >
                    {cfg.wholesaleLinkText || 'Wholesale & Export Enquiries →'}
                  </button>
                </div>
              </div>
            )}

            {/* Newsletter Subscription Column */}
            {cfg.showNewsletterColumn !== false && (
              <div className="lg:col-span-3 space-y-3">
                <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em]">
                  {cfg.newsletterHeading || 'Tribal Secrets Newsletter'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {cfg.newsletterSubtext ||
                    'Subscribe to receive ancestral scalp care tips, lunar harvesting calendars, and 10% off your first order.'}
                </p>

                {subscribed ? (
                  <p className="text-xs text-emerald-400 font-bold bg-emerald-950/60 p-2.5 rounded border border-emerald-500/30">
                    {cfg.newsletterSuccessMessage || '✓ Welcome! Check your inbox for code WELCOME10.'}
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder={cfg.newsletterPlaceholder || 'Enter email address'}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
                      />
                      <button
                        type="submit"
                        className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Secure Payments Section */}
          {cfg.showPaymentBadges !== false && <PaymentIcons />}

          {/* Footer Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>{copyrightStr}</p>

            <div className="flex items-center gap-4 flex-wrap">
              {cfg.showSoundToggle !== false && <SoundToggle variant="footer" />}

              {cfg.showBottomLinks !== false &&
                Array.isArray(cfg.bottomLinks) &&
                cfg.bottomLinks.map((lnk) => (
                  <React.Fragment key={lnk.id}>
                    <span>•</span>
                    <a href={lnk.url} className="hover:text-[var(--brand-gold)] transition-colors">
                      {lnk.label}
                    </a>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
