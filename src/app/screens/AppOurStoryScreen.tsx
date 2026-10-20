import React from 'react';
import { ArrowLeft, ArrowRight, Leaf, Sprout, HeartHandshake, MapPin, Sparkles } from 'lucide-react';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface Props {
  onBack: () => void;
  onShop: () => void;
  imageUrl?: string;
}

export const AppOurStoryScreen: React.FC<Props> = ({ onBack, onShop, imageUrl }) => (
  <div className="min-h-full bg-[#FAF7F2] pb-28 text-[#143B30]">
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#D6B65D]/30 bg-[#0B3D30] px-4 py-3">
      <button type="button" onClick={onBack} aria-label="Back to home" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E6C86B]">HAKKIVEDA Heritage</p>
        <h1 className="font-serif text-lg font-bold !text-[#FFF8E7]" style={{ color: "#FFF8E7", WebkitTextFillColor: "#FFF8E7" }}>Our Story</h1>
      </div>
    </header>

    {/* Canva banner includes its own typography: display it in full without cropping or overlays. */}
    <div className="w-full bg-[#F7E9C8]">
      <img
        src={resolveAssetUrl(imageUrl || '/images/hero_tribal_elders.jpg')}
        alt="HAKKIVEDA Our Story heritage banner"
        className="block h-auto w-full object-contain"
        loading="eager"
      />
    </div>

    <div className="space-y-5 px-4 pt-6">
      <section className="rounded-3xl border border-[#E7D9B4] bg-white p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AA853F]">Tribal Wisdom · Ayurvedic Inspiration</p>
        <h3 className="mt-2 font-serif text-xl font-bold">From Hunsur to Your Home</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          HAKKIVEDA is a herbal wellness brand based in Hunsur, Mysuru district, Karnataka.
          Our story draws inspiration from the traditional botanical knowledge and herbal-care
          practices associated with the Hakki-Pikki community.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          We aim to bring this heritage into everyday hair, skin and wellness routines through
          thoughtfully presented herbal products and a growing community of customers.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3">
        <section className="flex gap-4 rounded-2xl border border-[#E7D9B4] bg-[#FFFDF8] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E9F1E9]"><Sprout className="h-6 w-6 text-[#146348]" /></span>
          <div><h3 className="font-serif text-lg font-bold">Nature & Botanicals</h3><p className="mt-1 text-xs leading-6 text-slate-600">Inspired by herbs and botanical ingredients traditionally used in personal-care rituals.</p></div>
        </section>
        <section className="flex gap-4 rounded-2xl border border-[#E7D9B4] bg-[#FFFDF8] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8F0D9]"><Leaf className="h-6 w-6 text-[#9C7B35]" /></span>
          <div><h3 className="font-serif text-lg font-bold">Our Preparation Philosophy</h3><p className="mt-1 text-xs leading-6 text-slate-600">We value careful ingredient selection, thoughtful formulation and clear product information.</p></div>
        </section>
        <section className="flex gap-4 rounded-2xl border border-[#E7D9B4] bg-[#FFFDF8] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E9F1E9]"><HeartHandshake className="h-6 w-6 text-[#146348]" /></span>
          <div><h3 className="font-serif text-lg font-bold">People & Purpose</h3><p className="mt-1 text-xs leading-6 text-slate-600">Our mission is to respect the roots of traditional knowledge while making herbal self-care accessible to more people.</p></div>
        </section>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-[#0B3D30] to-[#146348] p-5 text-white">
        <div className="flex items-center gap-2 text-[#E7CD81]"><MapPin className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Our Roots</span></div>
        <h3 className="mt-2 font-serif text-xl font-bold !text-[#FFF8E7]" style={{ color: "#FFF8E7", WebkitTextFillColor: "#FFF8E7" }}>Hunsur, Mysuru, Karnataka</h3>
        <p className="mt-2 text-xs leading-6 text-emerald-50/85">From our home in Karnataka, HAKKIVEDA connects with customers and business partners in India and international markets.</p>
      </section>

      <section className="rounded-3xl border border-[#E7D9B4] bg-white p-5 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-[#B38D40]" />
        <h3 className="mt-2 font-serif text-xl font-bold">Discover HAKKIVEDA</h3>
        <p className="mt-2 text-xs leading-6 text-slate-600">Explore our collection of herbal hair, skin and wellness products.</p>
        <button type="button" onClick={onShop} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B3D30] px-5 py-3 text-sm font-bold text-[#F6E7BD]">
          Explore Our Products <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  </div>
);
