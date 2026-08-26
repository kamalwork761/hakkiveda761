import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { SoundToggle } from './SoundToggle';
import { PaymentIcons } from './PaymentIcons';

export const Footer: React.FC = () => {
  const { footerConfig, siteSettings, setIsB2BModalOpen, setIsQuizOpen, playSound } = useStore();
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

  const addressText = cfg.address || siteSettings?.address || 'Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105';
  const phoneText = cfg.phone || siteSettings?.phone || '+91 76195 36831';
  const whatsappNum = cfg.whatsappNumber || siteSettings?.whatsappNumber || '917619536831';
  const emailText = cfg.email || siteSettings?.email || 'hakkiveda@gmail.com';
  const brandDesc = cfg.brandDescription || siteSettings?.footerAbout || 'Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.';
  const copyrightStr = cfg.copyrightText || siteSettings?.footerCopyright || `© ${new Date().getFullYear()} HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.`;

  // Mobile Footer Configurations
  const mobileCfg = cfg.mobileFooter || {};
  const showMobileWarning = mobileCfg.showWarningSection !== false;
  const mobileWarningHeading = mobileCfg.warningHeading || 'BEWARE OF FAKE & DUPLICATE ADIVASI HAIR OILS';
  const defaultMobileWarningLines = [
    'Beware of scammers and duplicate Adivasi hair oils.',
    'Authentic HAKKIVEDA products carry our official branding.',
    'Our formulations are rooted in Hakki-Pikki tribal knowledge from Mysuru.',
    'Always check the HAKKIVEDA name and product label before purchasing.',
    'Avoid sellers using copied images or misleading tribal claims.',
    'Never share OTPs, banking passwords or card PINs with anyone.',
    'HAKKIVEDA will never ask for confidential banking credentials.',
    'Purchase only through our official website or authorised sellers.',
    'Check product packaging, batch information and authenticity details.',
    'Report suspicious sellers or fake HAKKIVEDA products to our support team.',
    'Protect your purchase. Choose authentic HAKKIVEDA.',
    'Traditional wisdom deserves genuine products.',
  ];
  const mobileWarningLines = Array.isArray(mobileCfg.warningLines) && mobileCfg.warningLines.length > 0
    ? mobileCfg.warningLines
    : defaultMobileWarningLines;
  const mobileCopyrightText = mobileCfg.copyrightText || '© 2026 HAKKIVEDA';
  const mobileSloganText = mobileCfg.sloganText || 'Blend of Hakki-Pikki Tribe & Ayurveda';

  return (
    <footer className="w-full">
      {/* ========================================================================= */}
      {/* 1. DESKTOP FOOTER (UNTOUCHED - RETAINS ALL COLUMNS, LOGO, SHIPPING, ETC) */}
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
                    <img src={cfg.brandLogo} alt={cfg.brandLogoText || 'Brand Logo'} className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
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
                  {cfg.newsletterSubtext || 'Subscribe to receive ancestral scalp care tips, lunar harvesting calendars, and 10% off your first order.'}
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

      {/* ========================================================================= */}
      {/* 2. COMPACT MOBILE FOOTER (ANTI-FRAUD TRUST ADVISORY + COMPACT COPYRIGHT)   */}
      {/* ========================================================================= */}
      <div className="block md:hidden font-sans">
        {/* Mobile Trust / Anti-Fraud Section */}
        {showMobileWarning && (
          <section
            id="mobile-anti-fraud-trust-section"
            className="bg-[#FAF7F2] text-[#0F2E22] py-8 px-5 border-t border-[#D8CDAF] text-center relative overflow-hidden"
          >
            <div className="max-w-sm mx-auto space-y-4">
              {/* Gold Security Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F2E22]/5 border border-[#8E7026]/30 text-[10px] font-bold text-[#8E7026] tracking-[0.2em] uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-[#8E7026]" />
                <span>OFFICIAL CONSUMER ADVISORY</span>
              </div>

              {/* Warning Heading */}
              <h3 className="text-sm font-serif font-bold text-[#0F2E22] tracking-wider uppercase leading-snug px-2">
                {mobileWarningHeading}
              </h3>

              {/* Subtle Botanical Divider Motif */}
              <div className="flex items-center justify-center gap-2 py-0.5">
                <div className="h-[1px] w-10 bg-[#8E7026]/30"></div>
                <div className="w-1.5 h-1.5 rotate-45 bg-[#8E7026]"></div>
                <div className="h-[1px] w-10 bg-[#8E7026]/30"></div>
              </div>

              {/* 10-12 Readable Short Lines */}
              <div className="space-y-2 text-[11px] sm:text-xs text-[#0F2E22]/85 font-normal leading-relaxed">
                {mobileWarningLines.map((line, idx) => (
                  <p key={idx} className="tracking-wide">
                    {line}
                  </p>
                ))}
              </div>

              {/* Tribal Wisdom Sign-off */}
              <div className="pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E7026]">
                🌿 HAKKI-PIKKI TRIBAL WISDOM • MYSURU
              </div>
            </div>
          </section>
        )}

        {/* Compact Mobile Copyright & Slogan Footer */}
        <div
          id="mobile-compact-copyright-footer"
          className="bg-[#0A2319] text-[#FAF7F2] py-4 px-4 text-center border-t border-[#D4AF37]/25 space-y-1"
        >
          <p className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
            {mobileCopyrightText}
          </p>
          <p className="text-[10px] text-[var(--brand-gold)] font-serif tracking-wide font-medium">
            {mobileSloganText}
          </p>
        </div>
      </div>
    </footer>
  );
};

