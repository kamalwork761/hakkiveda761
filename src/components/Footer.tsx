import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { SoundToggle } from './SoundToggle';

export const Footer: React.FC = () => {
  const { currencies, currentCurrency, setCurrencyByCode, setIsB2BModalOpen, setIsQuizOpen, playSound } = useStore();
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
    <footer className="bg-[#041a13] text-slate-100 font-sans border-t border-[#C8A24A]/30 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#C8A24A] text-[#0B3D2E] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                H
              </span>
              <HakkivedaWordmark size="md" theme="dark-header" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A24A] shrink-0 mt-0.5" />
                <span>Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A24A] shrink-0" />
                <a href="https://wa.me/917619536831" target="_blank" rel="noreferrer" className="hover:text-[#C8A24A]">
                  +91 76195 36831 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A24A] shrink-0" />
                <a href="mailto:hakkiveda@gmail.com" className="hover:text-[#C8A24A]">
                  hakkiveda@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[#C8A24A] uppercase tracking-[0.2em]">
              Botanical Catalog
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#products" className="hover:text-[#C8A24A] transition-colors">Tribal Gold Oil</a></li>
              <li><a href="#products" className="hover:text-[#C8A24A] transition-colors">Density Serums</a></li>
              <li><a href="#products" className="hover:text-[#C8A24A] transition-colors">Soapnut Shampoos</a></li>
              <li><a href="#products" className="hover:text-[#C8A24A] transition-colors">Hair Masks & Lepas</a></li>
              <li><button onClick={() => setIsQuizOpen(true)} className="text-[#C8A24A] font-bold flex items-center gap-1 hover:underline"><Sparkles className="w-3 h-3" /> AI Hair Quiz</button></li>
            </ul>
          </div>

          {/* Global Shipping Countries */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[#C8A24A] uppercase tracking-[0.2em] flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Worldwide Shipping</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrencyByCode(curr.code)}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                    currentCurrency.code === curr.code
                      ? 'border-[#C8A24A] bg-[#C8A24A] text-[#0B3D2E] font-bold'
                      : 'border-white/10 text-slate-300 hover:border-[#C8A24A]'
                  }`}
                >
                  {curr.flag} {curr.country} ({curr.code})
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsB2BModalOpen(true)}
                className="text-xs text-[#C8A24A] font-bold underline hover:text-white"
              >
                Wholesale & Export Enquiries →
              </button>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-serif-luxury text-[#C8A24A] uppercase tracking-[0.2em]">
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
                    className="flex-1 bg-[#0B3D2E] border border-white/20 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#C8A24A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#C8A24A] text-[#0B3D2E] px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.</p>

          <div className="flex items-center gap-4 flex-wrap">
            <SoundToggle variant="footer" />
            <span>•</span>
            <a href="#brand-story" className="hover:text-[#C8A24A] transition-colors">Tribal Lore</a>
            <span>•</span>
            <a href="#products" className="hover:text-[#C8A24A] transition-colors">100% Organic Guarantee</a>
            <span>•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="hover:text-[#C8A24A] transition-colors text-slate-300 font-semibold"
            >
              🔐 Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
