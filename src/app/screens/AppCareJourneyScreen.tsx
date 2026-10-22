import React from 'react';
import { ArrowLeft, ArrowRight, Droplets, Sparkles, HeartPulse, CheckCircle2 } from 'lucide-react';

type CareJourney = 'hair' | 'skin' | 'wellness';

interface AppCareJourneyScreenProps {
  journey: CareJourney;
  onBack: () => void;
  onShop: (categoryId?: string) => void;
}

const CONTENT = {
  hair: {
    eyebrow: 'HAIR CARE JOURNEY',
    title: 'Build a Better Hair-Care Routine',
    intro: 'A simple routine starts with a clean scalp, regular nourishment and consistent care. HAKKIVEDA hair products are designed to work together as part of that routine.',
    icon: Droplets,
    steps: [
      {
        title: '1. Clean the scalp gently',
        text: 'Use a herbal shampoo to remove excess oil, dirt and scalp buildup without making the routine feel harsh or complicated.',
      },
      {
        title: '2. Nourish with the 108-herb oil',
        text: 'Massage the scalp and hair with the herbal oil as directed. Regular massage helps distribute the oil evenly and supports softer, stronger-looking hair.',
      },
      {
        title: '3. Stay consistent',
        text: 'Hair-care results depend on regular use, scalp condition and individual factors. Follow the product directions and give your routine time.',
      },
    ],
    note: 'For dandruff, weak-feeling roots, dryness or visible thinning, choose products based on your scalp and hair needs. Cosmetic products support appearance and care; they do not diagnose or treat medical hair-loss conditions.',
    button: 'Shop Hair Care',
    categoryId: 'cat-1',
  },
  skin: {
    eyebrow: 'SKIN CARE JOURNEY',
    title: 'Keep Skin Care Simple & Consistent',
    intro: 'Choose gentle cleansing and targeted cosmetic care based on what you want to improve: dullness, uneven-looking tone, marks or everyday skin maintenance.',
    icon: Sparkles,
    steps: [
      {
        title: '1. Start with clean skin',
        text: 'Cleanse gently before applying creams, soaps or traditional herbal care products.',
      },
      {
        title: '2. Choose one clear goal',
        text: 'Use products suited to your cosmetic concern, such as brighter-looking skin, smoother texture or a more even-looking complexion.',
      },
      {
        title: '3. Protect your routine',
        text: 'Use products consistently as directed, patch test new cosmetics and use daytime sun protection when appropriate.',
      },
    ],
    note: 'Avoid promising instant or permanent skin-lightening results. HAKKIVEDA skin care is positioned for cosmetic appearance, cleansing and routine support.',
    button: 'Shop Skin Care',
    categoryId: 'cat-4',
  },
  wellness: {
    eyebrow: 'TRIBAL WELLNESS JOURNEY',
    title: 'Traditional Care for Everyday Rituals',
    intro: 'Explore HAKKIVEDA wellness and herbal-care products as simple additions to your everyday self-care routine.',
    icon: HeartPulse,
    steps: [
      {
        title: '1. Choose your ritual',
        text: 'Select a product based on the type of personal care or traditional wellness routine you want to follow.',
      },
      {
        title: '2. Follow the product directions',
        text: 'Use each product only for its intended purpose and follow the usage instructions provided on the label.',
      },
      {
        title: '3. Keep wellness claims realistic',
        text: 'These products are for general wellness and personal care unless a product is specifically registered and labelled for another purpose.',
      },
    ],
    note: 'For symptoms, medical conditions or ongoing health concerns, seek advice from a qualified healthcare professional rather than relying on a cosmetic or general-wellness product.',
    button: 'Shop Wellness Care',
    categoryId: 'cat-5',
  },
} satisfies Record<CareJourney, any>;

export const AppCareJourneyScreen: React.FC<AppCareJourneyScreenProps> = ({
  journey,
  onBack,
  onShop,
}) => {
  const content = CONTENT[journey];
  const Icon = content.icon;

  return (
    <div className="min-h-full bg-[#FAF7F2] pb-24">
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[12px] font-bold text-[#0E4B3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="px-4 pt-5">
        <div className="rounded-[28px] bg-gradient-to-br from-[#0B4A3A] via-[#0E5A47] to-[#0A7257] p-5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#F0CD68]/15 border border-[#F0CD68]/35 flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#F0CD68]" />
          </div>
          <p className="mt-5 text-[10px] tracking-[0.18em] font-black text-[#E8C85F]">
            {content.eyebrow}
          </p>
          <h1
            className="mt-2 text-[27px] leading-[1.12] font-black !text-[#FFF9EA]"
            style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif', color: '#FFF9EA', WebkitTextFillColor: '#FFF9EA' }}
          >
            {content.title}
          </h1>
          <p className="mt-3 text-[13px] leading-[1.65] text-emerald-50/85">
            {content.intro}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {content.steps.map((step: any) => (
            <div key={step.title} className="rounded-2xl bg-white border border-[#E4DDCF] p-4 shadow-sm flex items-start gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${journey === "hair" ? "bg-emerald-100 text-emerald-700" : journey === "skin" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}><CheckCircle2 className="h-6 w-6" /></div>
              <div className="min-w-0 flex-1"><h2
                className="text-[18px] leading-tight font-black text-[#0B4A3A]"
                style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
              >
                {step.title}
              </h2>
              <p className="mt-2 text-[13px] leading-[1.65] text-slate-600">
                {step.text}
              </p></div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-[#FFF5D8] border border-[#E9CE77]/55 p-4">
          <p className="text-[12px] leading-[1.6] font-medium text-slate-700">
            {content.note}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShop(content.categoryId)}
          className="mt-5 w-full rounded-2xl bg-[#0E382C] px-5 py-4 text-[#F0CD68] font-black text-[14px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
        >
          {content.button}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
