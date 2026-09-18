import { HairAnalysisAnswers, HairProfileResult, RecommendedProductItem, RitualStep } from '../types/hairAnalysis';
import { Product } from '../types/store';

export function generateHairProfile(answers: HairAnalysisAnswers, storeProducts: Product[]): HairProfileResult {
  const insights: string[] = [];

  // 1. Stress Insight
  if (answers.stressLevel === 'High' || answers.stressLevel === 'Very high') {
    insights.push('Your answers suggest stress may be one factor worth addressing as part of your overall hair-care routine.');
  }

  // 2. Sleep Insight
  if (answers.sleepHours === 'Less than 5 hours' || answers.sleepHours === '5–7 hours' || answers.sleepHours === 'Irregular sleep') {
    insights.push('Consistent sleep may support overall wellness and a healthier hair-care routine.');
  }

  // 3. Scalp Insights
  const scalpLower = answers.scalpConditions.map((s) => s.toLowerCase());
  if (scalpLower.some((s) => s.includes('dandruff') || s.includes('flaky'))) {
    insights.push('Your scalp profile suggests that dandruff control should be one of your first priorities.');
  }
  if (scalpLower.some((s) => s.includes('dry') || s.includes('sensitive') || s.includes('itchy'))) {
    insights.push('Your scalp may benefit from a gentler cleansing and nourishment-focused routine.');
  }
  if (scalpLower.some((s) => s.includes('oily'))) {
    insights.push('Focus on keeping the scalp clean without excessive oil buildup.');
  }

  // 4. Family History
  if (['Father', 'Mother', 'Both parents', 'Sibling'].includes(answers.familyHistory)) {
    insights.push('Family history may be relevant to your hair-thinning pattern.');
  }

  // 5. Protein & Nutrition
  if (answers.proteinIntake === 'Rarely' || answers.proteinIntake === 'A few times per week') {
    insights.push('Incorporating regular protein-rich foods may provide beneficial building blocks for natural strand strength.');
  }

  // 6. Digestion
  const hasDigestion = answers.digestionIssues.some((d) => d !== 'None of these' && d !== 'None');
  if (hasDigestion) {
    insights.push('Ayurvedic tradition associates balanced digestive wellness with wholesome nourishment reaching hair roots.');
  }

  // 7. Heat / Chemical Treatments
  const hasChemical = answers.treatments.some((t) => t !== 'None');
  if (hasChemical) {
    insights.push('Gentle handling and minimizing harsh chemical or thermal exposure may help shield hair cuticles from stress.');
  }

  // If few insights triggered, provide a reassuring foundational note
  if (insights.length === 0) {
    insights.push('Your overall lifestyle appears balanced; focusing on regular root nourishment can help preserve scalp vitality.');
  }

  // Determine Dosha Type
  let doshaType = 'Pitta-Kapha';
  if (scalpLower.some((s) => s.includes('dry') || s.includes('flaky')) || answers.hairQualities.some((q) => q.toLowerCase().includes('brittle') || q.toLowerCase().includes('frizzy'))) {
    doshaType = 'Vata-Pitta';
  } else if (scalpLower.some((s) => s.includes('oily') || s.includes('dandruff'))) {
    doshaType = 'Kapha-Pitta';
  } else if (answers.hairLossPattern.includes('Crown') || answers.hairLossPattern.includes('recession')) {
    doshaType = 'Pitta-Dominant';
  }

  // Scalp Profile summary text
  const scalpProfile = answers.scalpConditions.length > 0 ? answers.scalpConditions.join(', ') : 'Balanced Scalp';

  // Hair Fall Level text
  const hairFallLevel = answers.severity || 'Moderate';

  // Lifestyle Factors list
  const lifestyleFactors: string[] = [];
  if (answers.stressLevel === 'High' || answers.stressLevel === 'Very high') lifestyleFactors.push(`Stress: ${answers.stressLevel}`);
  if (answers.sleepHours) lifestyleFactors.push(`Sleep: ${answers.sleepHours}`);
  if (answers.exerciseFrequency) lifestyleFactors.push(`Activity: ${answers.exerciseFrequency}`);
  if (answers.dietType) lifestyleFactors.push(`Diet: ${answers.dietType}`);
  if (hasDigestion) lifestyleFactors.push(`Digestive factors noted (${answers.digestionIssues.slice(0, 2).join(', ')})`);

  // Define 4 Ritual Steps
  const ritualSteps: RitualStep[] = [
    {
      stepNumber: 1,
      title: 'Scalp Nourishment',
      subtitle: 'Warm Botanical Oil Massage',
      description: 'Apply warmed 108 Mountain Herb Oil directly onto dry scalp roots. Massage in gentle circular motions for 8–10 minutes to support microcirculation and root hydration.',
      frequency: answers.oilingFrequency === 'Daily' || answers.oilingFrequency === 'Almost daily' ? 'Daily or 3x Weekly' : '2–3 Times Weekly',
    },
    {
      stepNumber: 2,
      title: 'Gentle Cleansing',
      subtitle: 'Herbal Foam Clarifying Wash',
      description: 'Cleanse with sulfate-free Mountain Herbs Shampoo to wash away oil and environmental residue while keeping the scalp moisture barrier intact.',
      frequency: answers.washFrequency || '2–3 Times Weekly',
    },
    {
      stepNumber: 3,
      title: 'Weekly Herbal Care',
      subtitle: answers.mainConcern.toLowerCase().includes('bald') || answers.hairLossPattern.includes('Crown') || answers.hairLossPattern.includes('Patchy')
        ? 'Adivasi Herbal Lepa Paste'
        : 'Follicle Root Density Drops',
      description: answers.mainConcern.toLowerCase().includes('bald') || answers.hairLossPattern.includes('Crown') || answers.hairLossPattern.includes('Patchy')
        ? 'Mix herbal lepa powder with fresh warm water or curd; apply over sparse scalp zones for 20 minutes before rinsing.'
        : 'Apply concentrated herbal follicle serum to clean, dry scalp areas where density support is desired.',
      frequency: '1–2 Times Weekly',
    },
    {
      stepNumber: 4,
      title: 'Lifestyle Consistency',
      subtitle: 'Daily Rest & Hydration',
      description: 'Maintain regular sleep hours, drink plenty of water, and allow 6–8 continuous weeks for traditional herbs to deeply replenish hair roots.',
      frequency: 'Daily Routine',
    },
  ];

  // Map Real Products from Store
  const isBaldnessOrThinning =
    answers.mainConcern.toLowerCase().includes('bald') ||
    answers.mainConcern.toLowerCase().includes('thinning') ||
    answers.mainConcern.toLowerCase().includes('receding') ||
    answers.hairLossPattern.includes('Crown') ||
    answers.hairLossPattern.includes('recession') ||
    answers.hairLossPattern.includes('Patchy');

  const isDandruffFocused =
    answers.mainConcern.toLowerCase().includes('dandruff') ||
    scalpLower.some((s) => s.includes('dandruff') || s.includes('flaky'));

  const findProduct = (id: string) => storeProducts.find((p) => p.id === id);

  const prod1 = findProduct('prod-1') || storeProducts[0]; // 108 Herbal Hair Oil
  const prod2 = findProduct('prod-2') || storeProducts[1]; // Clarifying Shampoo
  const prod3 = findProduct('prod-3'); // Follicle Serum
  const prod4 = findProduct('prod-4'); // Baldness Powder & Lepa
  const prod5 = findProduct('prod-5'); // Complete Baldness Kit

  const recommendedItems: RecommendedProductItem[] = [];
  const recommendedProductIds: string[] = [];

  if (isBaldnessOrThinning && prod4) {
    // If complete kit is available, highlight it as the full regimen
    if (prod5) {
      recommendedItems.push({
        id: prod5.id,
        name: prod5.name,
        category: prod5.category,
        image: prod5.image,
        priceINR: prod5.priceINR,
        originalPriceINR: prod5.originalPriceINR,
        reason: 'Complete 3-step traditional botanical bundle formulated specifically for intensive root support and sparse scalp areas.',
        ritualRole: 'Complete Regimen Bundle',
      });
      recommendedProductIds.push(prod5.id);
    }

    if (prod1) {
      recommendedItems.push({
        id: prod1.id,
        name: prod1.name,
        category: prod1.category,
        image: prod1.image,
        priceINR: prod1.priceINR,
        originalPriceINR: prod1.originalPriceINR,
        reason: 'Handcrafted with 108 wild forest herbs slow-brewed for 21 solar cycles to deeply revitalize dormant roots.',
        ritualRole: 'Step 1: Deep Scalp Oil',
      });
      recommendedProductIds.push(prod1.id);
    }

    if (prod4) {
      recommendedItems.push({
        id: prod4.id,
        name: prod4.name,
        category: prod4.category,
        image: prod4.image,
        priceINR: prod4.priceINR,
        originalPriceINR: prod4.originalPriceINR,
        reason: 'Traditional herbal mud powder infused with forest roots to soothe scalp tension and nourish follicles directly.',
        ritualRole: 'Step 3: Weekly Scalp Lepa',
      });
      recommendedProductIds.push(prod4.id);
    }

    if (prod2) {
      recommendedItems.push({
        id: prod2.id,
        name: prod2.name,
        category: prod2.category,
        image: prod2.image,
        priceINR: prod2.priceINR,
        originalPriceINR: prod2.originalPriceINR,
        reason: 'Sulfate-free mountain cleanser that washes away buildup without stripping natural scalp protective oils.',
        ritualRole: 'Step 2: Gentle Cleanser',
      });
      recommendedProductIds.push(prod2.id);
    }
  } else if (isDandruffFocused) {
    if (prod2) {
      recommendedItems.push({
        id: prod2.id,
        name: prod2.name,
        category: prod2.category,
        image: prod2.image,
        priceINR: prod2.priceINR,
        originalPriceINR: prod2.originalPriceINR,
        reason: 'Purifying mountain soapnut and shikakai formula that clarifies scalp flakes and soothes itchiness naturally.',
        ritualRole: 'Step 2: Scalp Clarifying Wash',
      });
      recommendedProductIds.push(prod2.id);
    }
    if (prod1) {
      recommendedItems.push({
        id: prod1.id,
        name: prod1.name,
        category: prod1.category,
        image: prod1.image,
        priceINR: prod1.priceINR,
        originalPriceINR: prod1.originalPriceINR,
        reason: 'Replenishes moisture to prevent dryness rebound and soothes inflamed scalp terrain with neem and devadaru resin.',
        ritualRole: 'Step 1: Scalp Nourishment Oil',
      });
      recommendedProductIds.push(prod1.id);
    }
    if (prod3) {
      recommendedItems.push({
        id: prod3.id,
        name: prod3.name,
        category: prod3.category,
        image: prod3.image,
        priceINR: prod3.priceINR,
        originalPriceINR: prod3.originalPriceINR,
        reason: 'Botanical tonic drops to invigorate roots and restore balanced hydration after washing.',
        ritualRole: 'Step 3: Root Vitality Drops',
      });
      recommendedProductIds.push(prod3.id);
    }
  } else {
    // General hair fall / growth / shine routine
    if (prod1) {
      recommendedItems.push({
        id: prod1.id,
        name: prod1.name,
        category: prod1.category,
        image: prod1.image,
        priceINR: prod1.priceINR,
        originalPriceINR: prod1.originalPriceINR,
        reason: 'Our flagship 108 mountain herbs formulation to reduce daily hair fall and restore healthy strand luster.',
        ritualRole: 'Step 1: Nourishing Scalp Oil',
      });
      recommendedProductIds.push(prod1.id);
    }
    if (prod2) {
      recommendedItems.push({
        id: prod2.id,
        name: prod2.name,
        category: prod2.category,
        image: prod2.image,
        priceINR: prod2.priceINR,
        originalPriceINR: prod2.originalPriceINR,
        reason: 'Gentle herbal cleanser that preserves natural strand moisture while clearing environmental pollution.',
        ritualRole: 'Step 2: Gentle Botanical Shampoo',
      });
      recommendedProductIds.push(prod2.id);
    }
    if (prod3) {
      recommendedItems.push({
        id: prod3.id,
        name: prod3.name,
        category: prod3.category,
        image: prod3.image,
        priceINR: prod3.priceINR,
        originalPriceINR: prod3.originalPriceINR,
        reason: 'Targeted scalp drops providing concentrated wild herbal actives directly to the root bulb.',
        ritualRole: 'Step 3: Root Density Booster',
      });
      recommendedProductIds.push(prod3.id);
    }
  }

  // Deduplicate products by id
  const seenIds = new Set<string>();
  const uniqueItems = recommendedItems.filter((item) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  const selectedStage = answers.hairStage || answers.hairLossPattern || 'Stage 1';
  const photoSupportedStage = answers.visualAssessment?.suggestedStage || selectedStage;
  const stageComparison = answers.visualAssessment?.comparisonNote || 'Your selected stage is consistent with the visible pattern in your photo.';

  if (answers.visualAssessment?.observations && answers.visualAssessment.observations.length > 0) {
    const firstObs = answers.visualAssessment.observations[0];
    if (firstObs && !insights.includes(firstObs)) {
      insights.unshift(`Photo assessment note: ${firstObs}`);
    }
  }

  return {
    mainConcern: answers.mainConcern || 'Hair Fall & Root Weakness',
    scalpProfile,
    hairFallLevel,
    lifestyleFactors,
    familyHistory: answers.familyHistory || 'None reported',
    hairGoal: answers.mainGoal || 'Reduce hair fall & strengthen roots',
    insights,
    doshaType,
    ritualSteps,
    recommendedProductIds: Array.from(seenIds),
    recommendedProducts: uniqueItems,
    visualAssessment: answers.visualAssessment,
    selectedStage,
    photoSupportedStage,
    stageComparison,
  };
}
