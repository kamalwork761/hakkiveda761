import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppHairAnalysisScreenProps {
  onOpenProductDetail: (productId: string) => void;
}

export const AppHairAnalysisScreen: React.FC<AppHairAnalysisScreenProps> = ({
  onOpenProductDetail,
}) => {
  const { products, addToCart, playSound } = useStore();

  const [step, setStep] = useState(1);
  const [scalpType, setScalpType] = useState('dry');
  const [concern, setConcern] = useState('hair-fall');
  const [duration, setDuration] = useState('3-6-months');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [addedRegimen, setAddedRegimen] = useState(false);

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/hair-analysis/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          scalpType,
          concern,
          duration,
          source: 'android_app',
        }),
      }).catch(() => {});
    } catch {}

    setIsSubmitting(false);
    setIsCompleted(true);
    try {
      playSound('success');
    } catch {}
  };

  const handleReset = () => {
    setStep(1);
    setIsCompleted(false);
    setAddedRegimen(false);
  };

  // Determine recommended bundle
  const recommendedProduct1 = products.find((p) => p.id === 'prod-1') || products[0];
  const recommendedProduct2 =
    concern === 'baldness'
      ? products.find((p) => p.id === 'prod-4') || products[1]
      : products.find((p) => p.id === 'prod-2') || products[1];

  const handleAddAllRegimen = () => {
    if (recommendedProduct1) addToCart(recommendedProduct1, 1);
    if (recommendedProduct2) addToCart(recommendedProduct2, 1);
    try {
      playSound('success');
    } catch {}
    setAddedRegimen(true);
  };

  return (
    <div className="w-full pb-24 px-4 pt-3">
      {/* Screen Title */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
          <span className="text-[10px] font-bold text-[#0E382C] uppercase tracking-wider">
            Ayurvedic Root Diagnosis
          </span>
        </div>
        <h1 className="font-serif text-xl font-bold text-slate-900 leading-tight">
          Hair Root Cause Analysis
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Based on 500-year-old Hakki-Pikki tribal botany and modern follicular science
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-5 border border-emerald-950/10 shadow-sm">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#0E382C]">Step {step} of 4</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'w-6 bg-[#0E382C]' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: SCALP TYPE */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-sm font-bold text-slate-900 mb-1">
                How does your scalp feel 24 hours after washing?
              </h2>
              <p className="text-[11px] text-slate-500 mb-3">
                Determines whether your follicular issue is Vata (dryness) or Pitta (excess heat).
              </p>

              <div className="space-y-2">
                {[
                  { id: 'dry', title: 'Dry, tight, or itchy', desc: 'Prone to dry white flakes and rough roots' },
                  { id: 'oily', title: 'Oily, greasy, and heavy', desc: 'Sebum buildup clogs pores by evening' },
                  { id: 'dandruff', title: 'Sticky yellowish dandruff', desc: 'Persistent fungal dandruff and itching' },
                  { id: 'normal', title: 'Normal & balanced', desc: 'Moderate texture, minimal scalp discomfort' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScalpType(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      scalpType === item.id
                        ? 'border-[#0E382C] bg-[#FAF7F2] shadow-xs ring-1 ring-[#0E382C]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {scalpType === item.id && (
                      <div className="w-5 h-5 rounded-full bg-[#0E382C] text-[#C5A059] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-5 w-full py-2.5 rounded-2xl bg-[#0E382C] text-[#FDF8EC] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* STEP 2: PRIMARY CONCERN */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-sm font-bold text-slate-900 mb-1">
                What is your most urgent hair concern right now?
              </h2>
              <p className="text-[11px] text-slate-500 mb-3">
                Identifies which of the 108 botanical extracts needs primary concentration.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'hair-fall', title: 'Excessive Daily Shedding', desc: 'Bunch of hair in shower, comb, or pillow' },
                  { id: 'baldness', title: 'Receding Hairline or Crown Bald Spot', desc: 'Visible scalp thinning, widening parting' },
                  { id: 'slow-growth', title: 'Slow Hair Growth / Stunted Length', desc: 'Hair remains at same length for months' },
                  { id: 'thinning', title: 'Diffuse Thinning & Weak Strands', desc: 'Loss of volume and strand thickness' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConcern(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      concern === item.id
                        ? 'border-[#0E382C] bg-[#FAF7F2] shadow-xs ring-1 ring-[#0E382C]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {concern === item.id && (
                      <div className="w-5 h-5 rounded-full bg-[#0E382C] text-[#C5A059] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#0E382C] text-[#FDF8EC] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DURATION */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-sm font-bold text-slate-900 mb-1">
                How long have you been experiencing this issue?
              </h2>
              <p className="text-[11px] text-slate-500 mb-3">
                Helps determine whether dormant follicles require intensive Lepa stimulation.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'under-3-months', title: 'Recently (< 3 months)', desc: 'Acute stage, fastest response to forest oil' },
                  { id: '3-6-months', title: 'Moderate (3 - 6 months)', desc: 'Follicles are weakening, needs 30-day treatment' },
                  { id: 'over-1-year', title: 'Long-term (1+ years)', desc: 'Dormant roots require oil + tribal herbal lepa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDuration(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      duration === item.id
                        ? 'border-[#0E382C] bg-[#FAF7F2] shadow-xs ring-1 ring-[#0E382C]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {duration === item.id && (
                      <div className="w-5 h-5 rounded-full bg-[#0E382C] text-[#C5A059] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#0E382C] text-[#FDF8EC] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & REVEAL */}
          {step === 4 && (
            <form onSubmit={handleSubmitQuiz}>
              <h2 className="font-serif text-sm font-bold text-slate-900 mb-1">
                Where should we save your customized regimen?
              </h2>
              <p className="text-[11px] text-slate-500 mb-3">
                Receive your free report and WhatsApp consultation link with our senior Vaidya.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0E382C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0E382C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-2xl bg-[#0E382C] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Diagnosing...</span>
                  ) : (
                    <>
                      <span>Reveal My Custom Regimen</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* COMPLETED STATE: CUSTOM REGIMEN REVEAL */
        <div className="space-y-4">
          <div className="rounded-3xl p-5 bg-gradient-to-br from-[#0E382C] to-[#07241C] text-white shadow-md border border-[#C5A059]/40 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
              Diagnostic Complete
            </span>
            <h2 className="font-serif text-lg font-bold text-[#FDF8EC] mt-0.5">
              Personalized Regimen for {name}
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xs mx-auto leading-relaxed">
              Your profile indicates follicular stress caused by scalp heat and mineral deficiency. Here is the verified Hakki-Pikki tribal formula:
            </p>
          </div>

          {/* Recommended Products */}
          <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Prescribed 30-Day Forest Regimen:
            </h3>

            {recommendedProduct1 && (
              <div
                onClick={() => onOpenProductDetail(recommendedProduct1.id)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-emerald-950/5 cursor-pointer active:scale-98 transition-all"
              >
                <img
                  src={resolveAssetUrl(recommendedProduct1.image)}
                  alt={recommendedProduct1.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-[#C5A059] uppercase tracking-wider">
                    Primary Tonic
                  </div>
                  <h4 className="font-serif text-xs font-bold text-slate-900 leading-tight">
                    {recommendedProduct1.name}
                  </h4>
                  <div className="text-xs font-bold text-[#0E382C] mt-0.5">
                    ₹{recommendedProduct1.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            {recommendedProduct2 && (
              <div
                onClick={() => onOpenProductDetail(recommendedProduct2.id)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-emerald-950/5 cursor-pointer active:scale-98 transition-all"
              >
                <img
                  src={resolveAssetUrl(recommendedProduct2.image)}
                  alt={recommendedProduct2.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-[#C5A059] uppercase tracking-wider">
                    Follicle Activator
                  </div>
                  <h4 className="font-serif text-xs font-bold text-slate-900 leading-tight">
                    {recommendedProduct2.name}
                  </h4>
                  <div className="text-xs font-bold text-[#0E382C] mt-0.5">
                    ₹{recommendedProduct2.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddAllRegimen}
              disabled={addedRegimen}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                addedRegimen
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#0E382C] text-[#C5A059] hover:bg-[#134E3F] active:scale-98'
              }`}
            >
              {addedRegimen ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Regimen Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Regimen to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-1 text-center text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retake Scalp Analysis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
