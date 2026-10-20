import React from 'react';
import { resolveAssetUrl } from '../utils/nativeUrl';
import {
  ShieldCheck,
  Leaf,
  PackageCheck,
  Headphones,
  Droplets,
  Sparkles,
  Moon,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  Instagram,
  Youtube,
  Facebook,
} from 'lucide-react';

interface Props {
  onShop: () => void;
  onOpenTrust: () => void;
  onOpenB2B: () => void;
  onOpenPolicy: (policy: 'shipping' | 'returns' | 'privacy') => void;
  b2bImageUrl?: string;
}

export const AppHomeValueSections: React.FC<Props> = ({
  onShop,
  onOpenTrust,
  onOpenB2B,
  onOpenPolicy,
  b2bImageUrl,
}) => {
  return (
    <>
      {/* WHY HAKKIVEDA */}
      <section className="px-4 py-4">
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#B18A3C]">
            Trust & Authenticity
          </p>

          <h2 className="font-serif text-lg font-bold text-slate-900">
            Why Choose HAKKIVEDA
          </h2>

          <p className="text-[10px] text-slate-500 mt-1">
            Know where your products come from, how to verify them and why authenticity matters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              icon: Leaf,
              title: 'Tribal Heritage',
              text: 'Traditional Hakki-Pikki herbal knowledge from Mysuru.',
              style: 'from-emerald-500 to-emerald-700',
            },
            {
              icon: ShieldCheck,
              title: 'Authentic Products',
              text: 'Learn how to identify genuine HAKKIVEDA products.',
              style: 'from-blue-500 to-indigo-600',
            },
            {
              icon: PackageCheck,
              title: 'Quality & Documents',
              text: 'Lab reports, registrations and product documentation.',
              style: 'from-violet-500 to-purple-700',
            },
            {
              icon: Headphones,
              title: 'Customer Support',
              text: 'Direct help before and after your purchase.',
              style: 'from-amber-500 to-orange-600',
            },
          ].map(({ icon: Icon, title, text, style }) => (
            <button
              key={title}
              type="button"
              onClick={onOpenTrust}
              className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-sm text-left active:scale-[0.98] transition-all"
            >
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${style} flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-[12px] font-black text-[#123F34] mt-3">
                {title}
              </h3>

              <p className="text-[9px] text-slate-500 leading-relaxed mt-1">
                {text}
              </p>

              <div className="mt-2 flex items-center text-[9px] font-bold text-[#0E6A54]">
                View Details
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenTrust}
          className="mt-3 w-full rounded-2xl bg-[#FFF7DF] border border-[#D6B65D]/40 p-3 flex items-center justify-between text-left active:scale-[0.99]"
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#A37E35]">
              Verify Before You Buy
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Check authenticity, registrations and available certificates.
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-[#A37E35]" />
        </button>
      </section>

      {/* B2B promotional artwork is managed through Mobile App Promo Banners. */}
      <section className="px-4 py-3">
        <div className="relative overflow-hidden rounded-[26px] border-[2px] border-[#754609] bg-[#4F300A] p-[4px] shadow-[0_7px_22px_rgba(105,62,8,0.32)]">
          <div aria-hidden="true" className="hv-gold-orbit pointer-events-none absolute -inset-[110%] bg-[conic-gradient(from_0deg,#4A2803_0%,#A56A12_20%,#FFFBE0_27%,#FFD34B_33%,#593203_42%,#B57A19_65%,#FFF2A1_72%,#5A3307_82%,#4A2803_100%)]" style={{ animation: "hvGoldOrbit 5s linear infinite" }} />
          <button type="button" onClick={onOpenB2B} className="relative z-10 block w-full overflow-hidden rounded-[20px] bg-[#0B4939] active:scale-[0.99] transition-transform text-left" aria-label="Explore B2B and private label opportunities">
          {b2bImageUrl ? (
            <img src={resolveAssetUrl(b2bImageUrl)} alt="HAKKIVEDA B2B & Private Label" className="block w-full h-auto" loading="lazy" />
          ) : (
            <div className="flex items-center justify-between gap-4 bg-[#0B4939] px-5 py-6 text-[#FFF8E8]">
              <div><p className="text-[10px] uppercase tracking-widest text-[#E6C86B]">Business Opportunities</p><h2 className="font-serif text-xl font-bold mt-1 !text-[#FFF8E8]" style={{ color: "#FFF8E8", WebkitTextFillColor: "#FFF8E8" }}>B2B & Private Label</h2><p className="text-xs mt-2 text-emerald-100">Wholesale · Private Label · Distributors</p></div>
              <ChevronRight className="w-6 h-6 shrink-0 text-[#E6C86B]" />
            </div>
          )}
          </button>
        </div>
      </section>

      {/* HAIR CARE ROUTINE */}
      <section className="px-4 py-4">
        <div className="rounded-3xl bg-[#F6F1E7] border border-[#C5A059]/25 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#A37E35]">
            Simple Ritual
          </p>
          <h2 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
            Your Hair Care Routine
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Build a simple weekly routine with products suited to your concern.
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                icon: Droplets,
                step: '01',
                title: 'Oil & Massage',
                text: 'Massage scalp gently and allow the oil to nourish the roots.',
              },
              {
                icon: Sparkles,
                step: '02',
                title: 'Cleanse',
                text: 'Wash with a gentle herbal shampoo suited to your scalp.',
              },
              {
                icon: Moon,
                step: '03',
                title: 'Repeat Consistently',
                text: 'Follow your routine regularly and track how your hair feels.',
              },
            ].map(({ icon: Icon, step, title, text }) => (
              <div key={step} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#0E382C] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#D5B36A]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#A37E35]">{step}</span>
                    <h3 className="text-xs font-bold text-slate-900">{title}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onShop}
            className="mt-4 w-full rounded-xl bg-[#0E382C] text-[#F6E7BD] py-2.5 text-xs font-bold flex items-center justify-center gap-1"
          >
            Shop Hair Care
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="px-4 py-4">
        <div className="rounded-3xl bg-white border border-emerald-950/10 p-4 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#A37E35]">
            Need Help?
          </p>
          <h2 className="font-serif text-lg font-bold text-slate-900">
            We’re Here for You
          </h2>

          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <a
              href="https://wa.me/917619536831"
              className="rounded-2xl bg-white p-3.5 flex flex-col items-center text-center shadow-md border border-[#25D366]/20 active:scale-95 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white stroke-[2.4]" />
              </div>
              <span className="text-[11px] font-black mt-2 text-slate-900">WhatsApp</span>
              <span className="text-[8px] text-slate-500 mt-0.5">Chat Now</span>
            </a>

            <a
              href="tel:+917619536831"
              className="rounded-2xl bg-white p-3.5 flex flex-col items-center text-center shadow-md border border-blue-500/20 active:scale-95 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] flex items-center justify-center shadow-lg">
                <Phone className="w-7 h-7 text-white stroke-[2.4]" />
              </div>
              <span className="text-[11px] font-black mt-2 text-slate-900">Call Us</span>
              <span className="text-[8px] text-slate-500 mt-0.5">Talk to Us</span>
            </a>

            <a
              href="mailto:support@hakkiveda.com"
              className="rounded-2xl bg-white p-3.5 flex flex-col items-center text-center shadow-md border border-orange-500/20 active:scale-95 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FBBF24] via-[#F97316] to-[#EF4444] flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-white stroke-[2.4]" />
              </div>
              <span className="text-[11px] font-black mt-2 text-slate-900">Email</span>
              <span className="text-[8px] text-slate-500 mt-0.5">Write to Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="px-4 py-4">
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2E25] via-[#0E382C] to-[#164C3B] border border-[#C5A059]/35 p-4 shadow-lg overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#C5A059]/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#D7B66A]">
              Stay Connected
            </p>

            <h2
              className="font-serif text-xl font-bold mt-0.5 dark-heading"
              style={{ color: '#FFF6DE' }}
            >
              Follow Us & Watch Real Results
            </h2>

            <p className="text-[10px] text-emerald-100/75 leading-relaxed mt-1.5">
              For more details, product demonstrations, customer results, and how-to-use guidance,
              please follow our social pages and watch our videos.
            </p>

            <div className="space-y-2.5 mt-4">
              <a
                href="https://www.instagram.com/hakkiveda?obrf=dXpkaHF0b25idHV0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-white/95 border border-[#D7B66A]/30 p-3.5 flex items-center gap-3 shadow-md active:scale-[0.98] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] flex items-center justify-center shrink-0 shadow-lg">
                  <Instagram className="w-8 h-8 text-white stroke-[2.4]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-slate-900">Join us on Instagram</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Daily updates, customer stories & herbal care tips.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C5A059]" />
              </a>

              <a
                href="https://www.youtube.com/@hakkiveda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-white/95 border border-[#D7B66A]/30 p-3.5 flex items-center gap-3 shadow-md active:scale-[0.98] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FF0000] flex items-center justify-center shrink-0 shadow-lg">
                  <Youtube className="w-8 h-8 text-white stroke-[2.4]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-slate-900">Watch on YouTube</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Product demos, usage guides & detailed remedy videos.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C5A059]" />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=100086777450158"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-white/95 border border-[#D7B66A]/30 p-3.5 flex items-center gap-3 shadow-md active:scale-[0.98] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center shrink-0 shadow-lg">
                  <Facebook className="w-8 h-8 text-white stroke-[2.4]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-slate-900">Follow us on Facebook</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Offers, launches, reviews & community updates.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C5A059]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* APP FOOTER */}
      <footer className="mt-3 bg-[#0B2E25] px-5 pt-6 pb-8 text-center">
        <div className="text-[#D7B66A] font-serif text-xl font-bold tracking-[0.12em]">
          HAKKIVEDA
        </div>
        <p className="text-[10px] text-emerald-100/70 mt-1">
          Hakki-Pikki Tribal Wisdom • Ayurvedic Care
        </p>

        <div className="flex justify-center gap-4 mt-4 text-[10px] text-emerald-100/80">
          <button type="button" onClick={() => onOpenPolicy("shipping")} className="hover:text-white">
            Shipping
          </button>
          <button type="button" onClick={() => onOpenPolicy("returns")} className="hover:text-white">
            Returns
          </button>
          <button type="button" onClick={() => onOpenPolicy("privacy")} className="hover:text-white">
            Privacy Policy
          </button>
          <a
            href="https://wa.me/917619536831"
            className="hover:text-white"
          >
            Support
          </a>
        </div>

        <div className="border-t border-white/10 mt-4 pt-3">
          <p className="text-[9px] text-emerald-100/50">
            HAKKIVEDA Herbal Enterprises • Mysore, Karnataka, India
          </p>
          <p className="text-[9px] text-emerald-100/40 mt-1">
            © 2026 HAKKIVEDA • Version 1.0.0
          </p>
        </div>
      </footer>
    </>
  );
};
