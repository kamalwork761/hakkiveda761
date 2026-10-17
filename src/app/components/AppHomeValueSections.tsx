import React from 'react';
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
}

export const AppHomeValueSections: React.FC<Props> = ({ onShop }) => {
  return (
    <>
      {/* WHY HAKKIVEDA */}
      <section className="px-4 py-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#B18A3C]">
              Our Promise
            </p>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Why Choose HAKKIVEDA
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              icon: Leaf,
              title: 'Herbal Formulations',
              text: 'Traditional botanical care for everyday hair & skin rituals.',
            },
            {
              icon: ShieldCheck,
              title: 'Authentic Products',
              text: 'Products supplied directly through HAKKIVEDA.',
            },
            {
              icon: PackageCheck,
              title: 'Secure Shopping',
              text: 'Simple ordering with trusted delivery support.',
            },
            {
              icon: Headphones,
              title: 'Customer Support',
              text: 'Get help before and after your purchase.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white border border-emerald-950/10 p-3 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0E382C]/8 flex items-center justify-center mb-2">
                <Icon className="w-4.5 h-4.5 text-[#0E382C]" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">{title}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{text}</p>
            </div>
          ))}
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
          <a href="/shipping-policy" className="hover:text-white">
            Shipping
          </a>
          <a href="/refund-policy" className="hover:text-white">
            Returns
          </a>
          <a href="/privacy-policy" className="hover:text-white">
            Privacy
          </a>
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
