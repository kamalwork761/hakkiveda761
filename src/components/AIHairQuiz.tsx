import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, RefreshCw, CheckCircle2, Leaf, ShoppingBag, PlusCircle, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { QuizResultData, Product } from '../types/store';

export const AIHairQuiz: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, products, addToCart, formatPrice, setIsCartOpen, playSound } = useStore();

  const [step, setStep] = useState(1);
  const [hairType, setHairType] = useState('Straight / Fine');
  const [scalpCondition, setScalpCondition] = useState('Dry / Flaky / Itchy');
  const [primaryConcern, setPrimaryConcern] = useState('Advanced Baldness & Thin Patches');
  const [hairLossLevel, setHairLossLevel] = useState('Visible Bald Patches / Receding Hairline');
  const [hairGoal, setHairGoal] = useState('Reverse Baldness & Fill Thin Patches');
  const [lifestyle, setLifestyle] = useState('High Stress / Urban Pollution / Hard Water');

  const [isLoading, setIsLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (!isQuizOpen) return null;

  const handleAnalyze = async () => {
    setIsLoading(true);

    const isBaldness =
      primaryConcern.toLowerCase().includes('bald') ||
      hairLossLevel.toLowerCase().includes('bald') ||
      hairLossLevel.toLowerCase().includes('receding') ||
      hairLossLevel.toLowerCase().includes('visible') ||
      hairGoal.toLowerCase().includes('bald');

    const isLongHair =
      hairGoal.toLowerCase().includes('long') ||
      hairGoal.toLowerCase().includes('growth') ||
      primaryConcern.toLowerCase().includes('short') ||
      primaryConcern.toLowerCase().includes('regrowth');

    try {
      const res = await fetch('/api/hair-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hairType,
          scalpCondition,
          primaryConcern,
          hairLossLevel,
          hairGoal,
          lifestyle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuizResult({
          summary: data.summary,
          doshaType: data.doshaType || 'Vata-Pitta Imbalance',
          recommendationTitle:
            data.recommendationTitle ||
            (isBaldness
              ? 'HAKKIVEDA 3-Step Baldness & Intensive Follicle Care Kit'
              : isLongHair
              ? 'HAKKIVEDA Long Hair Growth & Root Strength System'
              : 'HAKKIVEDA Essential Hair Oil & Shampoo Routine'),
          recommendedProductIds:
            data.recommendedProductIds ||
            (isBaldness ? ['prod-1', 'prod-4', 'prod-2', 'prod-5'] : ['prod-1', 'prod-2']),
          recommendedRoutine: data.recommendedRoutine || [],
          keyHerbs: data.keyHerbs || ['Wild Amla', 'Bhringraj', 'Gunja Seed Elixir', 'Shikakai', 'Devadaru Tree Resin'],
          estimatedResultsWeeks: data.estimatedResultsWeeks || (isBaldness ? 8 : 6),
        });
      } else {
        throw new Error('API request unsuccessful');
      }
    } catch (e) {
      if (isBaldness) {
        setQuizResult({
          summary: `For advanced baldness and scalp thinning, our Master Vaidya prescribes the 3-step intensive regimen: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder + HAKKIVEDA Clarifying Shampoo for deep root activation.`,
          doshaType: 'Vata-Pitta Imbalance',
          recommendationTitle: 'HAKKIVEDA 3-Step Baldness & Intensive Follicle Care System',
          recommendedProductIds: ['prod-1', 'prod-4', 'prod-2', 'prod-5'],
          recommendedRoutine: [
            'Massage HAKKIVEDA Herbal Hair Oil 3x weekly onto scalp and roots',
            'Apply HAKKIVEDA Herbal Baldness Care Powder paste directly on bald patches 2x weekly',
            'Cleanse thoroughly with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo',
          ],
          keyHerbs: ['Gunja Seed Elixir', 'Wild Bhringraj', 'Devadaru Bark', 'Wild Neem', 'Amla'],
          estimatedResultsWeeks: 8,
        });
      } else if (isLongHair) {
        setQuizResult({
          summary: `To grow long, thick, healthy hair, HAKKIVEDA Herbal Hair Oil combined with HAKKIVEDA Clarifying Shampoo provides optimal root strength, elasticity, and fast strand growth.`,
          doshaType: 'Pitta-Vata Imbalance',
          recommendationTitle: 'HAKKIVEDA Long Hair Growth & Root Strength System',
          recommendedProductIds: ['prod-1', 'prod-2'],
          recommendedRoutine: [
            'Apply HAKKIVEDA Herbal Hair Oil to scalp and full hair length 3x weekly',
            'Wash with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to prevent breakage and split ends',
          ],
          keyHerbs: ['Bhringraj Juice', 'Fresh Amla', 'Reetha Fruit', 'Hibiscus Nectar', 'Gotu Kola'],
          estimatedResultsWeeks: 6,
        });
      } else {
        setQuizResult({
          summary: `Your hair concerns are mild and manageable. Using HAKKIVEDA Herbal Hair Oil paired with HAKKIVEDA Clarifying Shampoo is more than enough to nourish hair roots and stop daily hair fall.`,
          doshaType: 'Pitta-Kapha',
          recommendationTitle: 'HAKKIVEDA Essential Hair Oil & Shampoo Routine',
          recommendedProductIds: ['prod-1', 'prod-2'],
          recommendedRoutine: [
            'Apply HAKKIVEDA Herbal Hair Oil 2-3x weekly before sleep',
            'Cleanse with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to maintain scalp health',
          ],
          keyHerbs: ['Wild Amla', 'Bhringraj', 'Shikakai', 'Jatamansi', 'Vetiver'],
          estimatedResultsWeeks: 4,
        });
      }
    } finally {
      setIsLoading(false);
      playSound('form_submit');
      setStep(7);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setQuizResult(null);
    setAddedIds([]);
  };

  const getRecommendedProducts = (): Product[] => {
    if (!quizResult?.recommendedProductIds) {
      return products.filter((p) => p.id === 'prod-1' || p.id === 'prod-2');
    }
    const recs = quizResult.recommendedProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);

    if (recs.length === 0) {
      return products.filter((p) => p.id === 'prod-1' || p.id === 'prod-2');
    }
    return recs;
  };

  const handleAddSingleProduct = (product: Product) => {
    addToCart(product, 1);
    if (!addedIds.includes(product.id)) {
      setAddedIds((prev) => [...prev, product.id]);
    }
  };

  const handleAddAllRecommended = () => {
    const recs = getRecommendedProducts();
    const combo = recs.find((p) => p.id === 'prod-5');
    if (combo) {
      addToCart(combo, 1);
    } else {
      recs.forEach((p) => addToCart(p, 1));
    }
    setIsCartOpen(true);
    setIsQuizOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#072a20] border border-[#C8A24A]/50 rounded-2xl shadow-2xl p-5 sm:p-8 my-6 text-slate-100 font-sans animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsQuizOpen(false)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center border border-[#C8A24A]/30"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4 text-[#C8A24A]">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.2em]">
            HAKKIVEDA AI Trichology Diagnostic
          </span>
        </div>

        {step < 7 && (
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-black/40 h-2 rounded-full mb-6 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-[#C8A24A] to-[#E5C880] h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>

            {/* Question 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 1: What is your natural hair texture?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Straight / Fine',
                    'Wavy / Medium Density',
                    'Curly / Coarse',
                    'Coily / Very Thick',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setHairType(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        hairType === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 2: How would you describe your scalp condition?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Dry / Flaky / Itchy',
                    'Excessively Oily',
                    'Combination / Sensitive',
                    'Normal / Balanced',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setScalpCondition(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        scalpCondition === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 3: What is your primary hair concern?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Advanced Baldness & Thin Patches',
                    'Severe Hair Fall & Root Breakage',
                    'Slow Regrowth / Want Long Hair',
                    'Flaky Dandruff & Itchiness',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPrimaryConcern(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        primaryConcern === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 4: What is your current hair loss level?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Visible Bald Patches / Receding Hairline',
                    'Noticeable Crown Thinning',
                    'Moderate Hair Fall (< 100 strands/day)',
                    'Normal / Mild Hair Loss',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setHairLossLevel(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        hairLossLevel === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 5 */}
            {step === 5 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 5: What is your main target goal?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Reverse Baldness & Fill Thin Patches',
                    'Grow Long & Thick Hair',
                    'Stop Hair Fall & Strengthen Roots',
                    'Scalp Health & Anti-Dandruff',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setHairGoal(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        hairGoal === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 6 */}
            {step === 6 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
                  Step 6: Describe your daily lifestyle and environment.
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'High Stress / Urban Pollution / Hard Water',
                    'Frequent Heat Styling / Color Treated',
                    'Post-partum or Hormonal Changes',
                    'Active Sports / Outdoor Sun Exposure',
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setLifestyle(option)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-semibold text-xs sm:text-sm ${
                        lifestyle === option
                          ? 'border-[#C8A24A] bg-[#0B3D2E] text-[#C8A24A] shadow-[0_0_15px_rgba(200,162,74,0.3)]'
                          : 'border-white/10 bg-black/30 text-slate-200 hover:border-[#C8A24A]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#C8A24A] uppercase tracking-wider"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-[#C8A24A] text-[#0B3D2E] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#C8A24A] to-[#E5C880] text-[#0B3D2E] px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Herbal Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Tribal Diagnosis</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Diagnostic Results */}
        {step === 7 && quizResult && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Diagnosis Overview Header */}
            <div className="bg-[#0B3D2E] border border-[#C8A24A]/40 p-5 sm:p-6 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C8A24A] tracking-widest block">
                    Ayurvedic Trichology Assessment
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-slate-100">
                    Classification: <span className="text-[#C8A24A]">{quizResult.doshaType}</span>
                  </h3>
                </div>
                <span className="self-start sm:self-auto bg-[#C8A24A]/20 border border-[#C8A24A] text-[#C8A24A] text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full">
                  Expected Transformation: {quizResult.estimatedResultsWeeks} Weeks
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-sans">
                "{quizResult.summary}"
              </p>
            </div>

            {/* Recommended Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C8A24A]">
                    Master Vaidya Prescription
                  </span>
                  <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-white">
                    {quizResult.recommendationTitle || 'Recommended HAKKIVEDA Hair Products'}
                  </h4>
                </div>
                <button
                  onClick={handleAddAllRecommended}
                  className="bg-[#C8A24A] text-[#0B3D2E] px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add All To Bag</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getRecommendedProducts().map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-black/40 border border-[#C8A24A]/30 rounded-xl p-3 flex gap-3 items-center hover:border-[#C8A24A] transition-all group"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#C8A24A] transition-colors">
                        {prod.name}
                      </h5>
                      <p className="text-[10px] text-slate-300 truncate">{prod.subtitle}</p>
                      <div className="text-xs font-bold text-[#C8A24A] mt-1">
                        {formatPrice(prod.priceINR)}
                      </div>
                      <button
                        onClick={() => handleAddSingleProduct(prod)}
                        className={`mt-2 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                          addedIds.includes(prod.id)
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#C8A24A]/20 border border-[#C8A24A] text-[#C8A24A] hover:bg-[#C8A24A] hover:text-[#0B3D2E]'
                        }`}
                      >
                        {addedIds.includes(prod.id) ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3 h-3" />
                            <span>Add Product</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Usage Routine */}
            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/10">
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-100">
                Recommended Usage Routine
              </h4>
              <ul className="space-y-2">
                {quizResult.recommendedRoutine.map((stepItem, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A24A] shrink-0 mt-0.5" />
                    <span>{stepItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selected Forest Botanicals */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#C8A24A] flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Selected Forest Botanicals</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {quizResult.keyHerbs.map((herb, i) => (
                  <span
                    key={i}
                    className="bg-black/40 border border-[#C8A24A]/30 text-slate-200 text-[11px] px-2.5 py-1 rounded-full font-semibold"
                  >
                    🌿 {herb}
                  </span>
                ))}
              </div>
            </div>

            {/* Result CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddAllRecommended}
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#C8A24A] to-[#E5C880] text-[#0B3D2E] py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Recommended Hair Care System To Bag</span>
              </button>
              <button
                onClick={resetQuiz}
                className="text-xs text-slate-300 hover:text-[#C8A24A] underline font-medium"
              >
                Retake Hair Diagnostic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
