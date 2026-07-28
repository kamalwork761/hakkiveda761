import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { SoundToggle } from './SoundToggle';
import { PaymentIcons } from './PaymentIcons';

export const Footer: React.FC = () => {
  const { setIsB2BModalOpen, setIsQuizOpen, playSound } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    playSound('form_submit');
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[var(--brand-primary-deeper)] text-slate-100 font-sans border-t border-[var(--brand-gold)]/30 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                H
              </span>
              <HakkivedaWordmark size="md" theme="dark-header" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                <span>Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                <a href="https://wa.me/917619536831" target="_blank" rel="noreferrer" className="hover:text-[var(--brand-gold)]">
                  +91 76195 36831 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                <a href="mailto:hakkiveda@gmail.com" className="hover:text-[var(--brand-gold)]">
                  hakkiveda@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em]">
              Botanical Catalog
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#products" className="hover:text-[var(--brand-gold)] transition-colors">Tribal Gold Oil</a></li>
              <li><a href="#products" className="hover:text-[var(--brand-gold)] transition-colors">Density Serums</a></li>
              <li><a href="#products" className="hover:text-[var(--brand-gold)] transition-colors">Soapnut Shampoos</a></li>
              <li><a href="#products" className="hover:text-[var(--brand-gold)] transition-colors">Hair Masks & Lepas</a></li>
              <li><button onClick={() => setIsQuizOpen(true)} className="text-[var(--brand-gold)] font-bold flex items-center gap-1 hover:underline"><Sparkles className="w-3 h-3" /> AI Hair Quiz</button></li>
            </ul>
          </div>

          {/* Worldwide Shipping Section */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em] flex items-center gap-1.5">
              <span>🌍 WORLDWIDE SHIPPING</span>
            </h4>

            <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Ships Worldwide</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Express International Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Secure Packaging</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Real-Time Order Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Customs Assistance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand-gold)] font-bold">✓</span>
                <span>Delivery in 3–12 Business Days*</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  alert('Shipping Policy:\n• Orders dispatched within 24-48 business hours.\n• Tracked shipping via DHL/FedEx/SpeedPost.\n• Free Express Shipping on orders over ₹1,999 (India) or $99 (Global).');
                }}
                className="text-xs font-bold text-[var(--brand-gold)] hover:text-white transition-colors inline-flex items-center gap-1 group text-left"
              >
                <span>View Shipping Policy</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => setIsB2BModalOpen(true)}
                className="text-[11px] text-slate-300 hover:text-[var(--brand-gold)] underline font-medium text-left"
              >
                Wholesale & Export Enquiries →
              </button>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em]">
              Tribal Secrets Newsletter
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Subscribe to receive ancestral scalp care tips, lunar harvesting calendars, and 10% off your first order.
            </p>

            {subscribed ? (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-950/60 p-2.5 rounded border border-emerald-500/30">
                ✓ Welcome! Check your inbox for code WELCOME10.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Secure Payments Section */}
        <PaymentIcons />

        {/* Footer Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.</p>

          <div className="flex items-center gap-4 flex-wrap">
            <SoundToggle variant="footer" />
            <span>•</span>
            <a href="#brand-story" className="hover:text-[var(--brand-gold)] transition-colors">Tribal Lore</a>
            <span>•</span>
            <a href="#products" className="hover:text-[var(--brand-gold)] transition-colors">100% Organic Guarantee</a>
            <span>•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="hover:text-[var(--brand-gold)] transition-colors text-slate-300 font-semibold"
            >
              🔐 Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
