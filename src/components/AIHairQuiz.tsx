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
  const [hairGoal, setHairGoal] = useState('Nourish Scalp & Improve Hair Density');
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
      hairGoal.toLowerCase().includes('bald') ||
      hairGoal.toLowerCase().includes('density');

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
              ? 'HAKKIVEDA 3-Step Baldness & Intensive Scalp Care Kit'
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
          summary: `For bald spots and scalp thinning, our traditional wisdom recommends the 3-step intensive ritual: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder + HAKKIVEDA Clarifying Shampoo for deep root nourishment.`,
          doshaType: 'Vata-Pitta Imbalance',
          recommendationTitle: 'HAKKIVEDA 3-Step Baldness & Intensive Scalp Care System',
          recommendedProductIds: ['prod-1', 'prod-4', 'prod-2', 'prod-5'],
          recommendedRoutine: [
            'Massage HAKKIVEDA Herbal Hair Oil 3x weekly onto scalp and roots',
            'Apply HAKKIVEDA Herbal Baldness Care Powder paste directly on sparse scalp areas 2x weekly',
            'Cleanse thoroughly with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo',
          ],
          keyHerbs: ['Gunja Seed Elixir', 'Wild Bhringraj', 'Devadaru Bark', 'Wild Neem', 'Amla'],
          estimatedResultsWeeks: 8,
        });
      } else if (isLongHair) {
        setQuizResult({
          summary: `To support long, thick, and healthy hair, HAKKIVEDA Herbal Hair Oil combined with HAKKIVEDA Clarifying Shampoo provides optimal root strength, elasticity, and strand luster.`,
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
          summary: `Your hair concerns are mild and manageable. Using HAKKIVEDA Herbal Hair Oil paired with HAKKIVEDA Clarifying Shampoo is more than enough to nourish hair roots and reduce daily hair shedding.`,
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
    setIsQuizOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-2xl shadow-2xl p-6 sm:p-8 my-6 text-[#123F2B] font-sans animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsQuizOpen(false)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#123F2B] text-white hover:bg-[#173A25] hover:border-[#D4AF37] transition-all flex items-center justify-center border-2 border-[#D4AF37]/50 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4 text-[#123F2B]">
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin" />
          <span className="text-xs sm:text-sm uppercase font-bold tracking-[0.2em] text-[#123F2B]">
            HAKKIVEDA AI Tribal Hair Assessment
          </span>
        </div>

        {step < 7 && (
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-[#D9D9D9] h-2.5 rounded-full mb-6 overflow-hidden border border-[#D4AF37]/30">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>

            {/* Question 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 1: What is your natural hair texture?
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Select the option that best describes your unstyled, natural hair strand structure.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'Straight / Fine',
                    'Wavy / Medium Density',
                    'Curly / Coarse',
                    'Coily / Very Thick',
                  ].map((option) => {
                    const isSelected = hairType === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setHairType(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 2: How would you describe your scalp condition?
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Understanding your scalp sebum level helps determine the ideal herbal infusion potency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'Dry / Flaky / Itchy',
                    'Excessively Oily',
                    'Combination / Sensitive',
                    'Normal / Balanced',
                  ].map((option) => {
                    const isSelected = scalpCondition === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setScalpCondition(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 3: What is your primary hair concern?
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Select your primary concern to customize your tribal Vaidya botanical formulation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'Advanced Baldness & Thin Patches',
                    'Severe Hair Fall & Root Breakage',
                    'Slow Regrowth / Want Long Hair',
                    'Flaky Dandruff & Itchiness',
                  ].map((option) => {
                    const isSelected = primaryConcern === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPrimaryConcern(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 4: What is your current hair loss level?
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Helps calculate estimated transformation timelines and required herbal density.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'Visible Bald Patches / Receding Hairline',
                    'Noticeable Crown Thinning',
                    'Moderate Hair Fall (< 100 strands/day)',
                    'Normal / Mild Hair Loss',
                  ].map((option) => {
                    const isSelected = hairLossLevel === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setHairLossLevel(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 5 */}
            {step === 5 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 5: What is your main target goal?
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Specify what outcome matters most for your personal hair transformation journey.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'Nourish Scalp & Improve Hair Density',
                    'Grow Long & Thick Hair',
                    'Stop Hair Fall & Strengthen Roots',
                    'Scalp Health & Anti-Dandruff',
                  ].map((option) => {
                    const isSelected = hairGoal === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setHairGoal(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 6 */}
            {step === 6 && (
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2B]">
                  Step 6: Describe your daily lifestyle and environment.
                </h3>
                <p className="text-xs sm:text-sm text-[#405B4A]">
                  Environmental stressors heavily impact follicular health and absorption speed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'High Stress / Urban Pollution / Hard Water',
                    'Frequent Heat Styling / Color Treated',
                    'Post-partum or Hormonal Changes',
                    'Active Sports / Outdoor Sun Exposure',
                  ].map((option) => {
                    const isSelected = lifestyle === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setLifestyle(option)}
                        className={`p-4 rounded-xl border text-left transition-all font-bold text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          isSelected
                            ? 'border-2 border-[#D4AF37] bg-[#123F2B] text-[#FFFFFF] shadow-md'
                            : 'border border-[#D4AF37] bg-[#F5F4EF] text-[#123F2B] hover:bg-[#EFE7CF]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#D4AF37]/30 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#405B4A] hover:text-[#123F2B] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4AF37] p-2 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-[#D4AF37] text-[#123F2B] px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#B8891E] hover:text-white transition-all flex items-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#123F2B]"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="bg-[#D4AF37] text-[#123F2B] px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#B8891E] hover:text-white transition-all flex items-center gap-2 shadow-lg disabled:bg-[#E4E4E4] disabled:text-[#6A6A6A] disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#123F2B]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Herbal Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Hair Assessment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Assessment Results */}
        {step === 7 && quizResult && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Overview Header */}
            <div className="bg-[#123F2B] text-white border-2 border-[#D4AF37] p-5 sm:p-6 rounded-2xl space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                    Ayurvedic Herbal Hair Assessment
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white">
                    Classification: <span className="text-[#D4AF37]">{quizResult.doshaType}</span>
                  </h3>
                </div>
                <span className="self-start sm:self-auto bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full">
                  Recommended Ritual Duration: {quizResult.estimatedResultsWeeks} Weeks
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#F5F4EF] leading-relaxed italic font-sans">
                "{quizResult.summary}"
              </p>
            </div>

            {/* Recommended Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8891E]">
                    Tribal Vaidya Recommended Ritual
                  </span>
                  <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-[#123F2B]">
                    {quizResult.recommendationTitle || 'Recommended HAKKIVEDA Hair Products'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllRecommended}
                  className="bg-[#D4AF37] text-[#123F2B] px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#B8891E] hover:text-white transition-all flex items-center gap-1.5 shadow-md shrink-0 focus:outline-none focus:ring-2 focus:ring-[#123F2B]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add All To Bag</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {getRecommendedProducts().map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#F5F4EF] border border-[#D4AF37] rounded-xl p-3.5 flex gap-3 items-center hover:shadow-md transition-all group"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-[#D4AF37]/40 shrink-0 bg-white p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs sm:text-sm text-[#123F2B] truncate group-hover:text-[#B8891E] transition-colors">
                        {prod.name}
                      </h5>
                      <p className="text-[11px] text-[#405B4A] truncate">{prod.subtitle}</p>
                      <div className="text-xs font-bold text-[#B8891E] mt-1">
                        {formatPrice(prod.priceINR)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSingleProduct(prod)}
                        className={`mt-2 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                          addedIds.includes(prod.id)
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#123F2B] border border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-[#123F2B]'
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
            <div className="space-y-3 bg-[#F5F4EF] p-4 sm:p-5 rounded-xl border border-[#D4AF37]/40">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#123F2B]">
                Recommended Usage Routine
              </h4>
              <ul className="space-y-2">
                {quizResult.recommendedRoutine.map((stepItem, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#405B4A]">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{stepItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selected Forest Botanicals */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#123F2B] flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Selected Forest Botanicals</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {quizResult.keyHerbs.map((herb, i) => (
                  <span
                    key={i}
                    className="bg-[#F5F4EF] border border-[#D4AF37] text-[#123F2B] text-[11px] px-3 py-1 rounded-full font-bold"
                  >
                    🌿 {herb}
                  </span>
                ))}
              </div>
            </div>

            {/* Result CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllRecommended}
                className="w-full sm:w-auto flex-1 bg-[#D4AF37] text-[#123F2B] py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#B8891E] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#123F2B]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Recommended Hair Care System To Bag</span>
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="text-xs text-[#405B4A] hover:text-[#123F2B] underline font-bold transition-colors p-2"
              >
                Retake Hair Assessment
              </button>
            </div>
          </div>
        )}

        {/* Quiz Wellness Notice */}
        <div className="mt-5 pt-3 border-t border-[#D4AF37]/30 text-[10px] text-[#556B5D] leading-relaxed">
          <p>
            <strong>Wellness Notice:</strong> This AI hair assessment provides cosmetic and traditional botanical hair-care recommendations based on Hakki-Pikki tribal wisdom. It is not a medical diagnosis and is not intended to treat clinical scalp conditions or medical alopecia. Individual results vary.
          </p>
        </div>
      </div>
    </div>
  );
};
