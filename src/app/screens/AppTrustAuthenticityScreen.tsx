import React from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Beaker,
  Building2,
  FileCheck2,
  Globe2,
  Leaf,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const AppTrustAuthenticityScreen: React.FC<Props> = ({ onBack }) => {
  const trustItems = [
    {
      icon: Leaf,
      title: 'Hakki-Pikki Herbal Heritage',
      text: 'Rooted in traditional Hakki-Pikki herbal knowledge from the Mysuru region of Karnataka.',
      style: 'from-emerald-500 to-emerald-700',
    },
    {
      icon: QrCode,
      title: 'Verify Authentic Products',
      text: 'Check the HAKKIVEDA brand, manufacturer details, packaging and product information before purchase.',
      style: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Beaker,
      title: 'Quality & Lab Documentation',
      text: 'View available product testing and quality documents supplied for HAKKIVEDA products.',
      style: 'from-violet-500 to-purple-700',
    },
    {
      icon: Building2,
      title: 'Registered Indian Business',
      text: 'HAKKIVEDA Herbal Enterprises operates from Mysuru, Karnataka with applicable business registrations.',
      style: 'from-amber-500 to-orange-600',
    },
    {
      icon: FileCheck2,
      title: 'Trademark Protection',
      text: 'The HAKKIVEDA trademark application has been filed in India to protect brand identity and authenticity.',
      style: 'from-rose-500 to-red-600',
    },
    {
      icon: Globe2,
      title: 'Export Ready',
      text: 'International supply support with export documentation for eligible wholesale and distributor orders.',
      style: 'from-cyan-500 to-teal-700',
    },
  ];

  return (
    <div className="min-h-full bg-[#FAF7F2] pb-24">
      <div className="sticky top-0 z-20 bg-[#0B3D30] px-4 py-3 border-b border-[#D6B65D]/25">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D6B65D]">
              Trust Centre
            </p>
            <h1 className="font-serif text-lg font-bold text-white">
              Why Choose HAKKIVEDA
            </h1>
          </div>
        </div>
      </div>

      <section className="px-4 pt-5">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0E382C] to-[#174D3D] p-5 shadow-lg relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#D6B65D]/10" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B65D]/15 border border-[#D6B65D]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#E5C86F]" />
            </div>

            <h2 className="font-serif text-xl font-bold text-[#FFF8E7] mt-3">
              Authenticity Starts With Origin
            </h2>

            <p className="text-[11px] leading-relaxed text-emerald-100/80 mt-2">
              HAKKIVEDA combines traditional herbal knowledge with modern product
              manufacturing, business documentation and customer support.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-5">
        <div className="grid grid-cols-2 gap-3">
          {trustItems.map(({ icon: Icon, title, text, style }) => (
            <div
              key={title}
              className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm"
            >
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${style} flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="mt-3 text-[12px] font-black leading-tight text-[#123F34]">
                {title}
              </h3>

              <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-5">
        <div className="rounded-3xl border border-[#D6B65D]/40 bg-[#FFF8E7] p-4">
          <div className="flex gap-3">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#0E382C] flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-[#E5C86F]" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-black text-[#A37E35]">
                Buy With Confidence
              </p>

              <h3 className="font-serif text-[15px] font-bold text-[#123F34] mt-0.5">
                Verify before you buy
              </h3>

              <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                Products marketed using terms such as “Adivasi Hair Oil” can come
                from different sellers. Check the HAKKIVEDA brand name, manufacturer
                information and authorised sales channel when you want an original
                HAKKIVEDA product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="rounded-3xl bg-white border border-emerald-950/10 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B58B35]" />
            <h3 className="font-serif text-base font-bold text-[#123F34]">
              Documents & Certificates
            </h3>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            Review selected business registrations and quality documentation for HAKKIVEDA.
          </p>

          <div className="mt-4 space-y-2.5">
            {[
              {
                title: 'Udyam Registration',
                subtitle: 'MSME / Micro Enterprise • Manufacturing',
                href: 'https://hakkiveda.com/documents/udyam-registration.pdf',
              },
              {
                title: 'GST Registration',
                subtitle: 'Hakkiveda Herbal Enterprises • Karnataka',
                href: 'https://hakkiveda.com/documents/gst-registration.pdf',
              },
              {
                title: 'HAKKIVEDA Trademark Application',
                subtitle: 'Trademark application filed in India',
                href: 'https://hakkiveda.com/documents/hakkiveda-trademark-application.pdf',
              },
              {
                title: 'Hair Oil Test Report',
                subtitle: 'FARE Labs quality test report • Natural Adivasi Herbal Oil',
                href: 'https://hakkiveda.com/documents/hair-oil-test-report.pdf',
              },
            ].map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#D6B65D]/25 bg-[#FFFDF8] p-3 active:scale-[0.99] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0E382C] flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5 text-[#E5C86F]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-[#123F34]">
                    {doc.title}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">
                    {doc.subtitle}
                  </p>
                </div>

                <span className="text-[9px] font-black text-[#A37E35] whitespace-nowrap">
                  View PDF →
                </span>
              </a>
            ))}
          </div>

          <p className="text-[8px] text-slate-400 leading-relaxed mt-3">
            Test reports relate only to the tested sample and are provided as quality documentation.
          </p>
        </div>
      </section>
    </div>
  );
};
