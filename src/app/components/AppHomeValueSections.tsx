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

          <div className="grid grid-cols-3 gap-2 mt-3">
            <a
              href="https://wa.me/917619536831"
              className="rounded-2xl bg-[#F6F8F5] p-3 flex flex-col items-center text-center"
            >
              <MessageCircle className="w-5 h-5 text-[#0E382C]" />
              <span className="text-[10px] font-bold mt-1.5">WhatsApp</span>
            </a>

            <a
              href="tel:+917619536831"
              className="rounded-2xl bg-[#F6F8F5] p-3 flex flex-col items-center text-center"
            >
              <Phone className="w-5 h-5 text-[#0E382C]" />
              <span className="text-[10px] font-bold mt-1.5">Call Us</span>
            </a>

            <a
              href="mailto:support@hakkiveda.com"
              className="rounded-2xl bg-[#F6F8F5] p-3 flex flex-col items-center text-center"
            >
              <Mail className="w-5 h-5 text-[#0E382C]" />
              <span className="text-[10px] font-bold mt-1.5">Email</span>
            </a>
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
