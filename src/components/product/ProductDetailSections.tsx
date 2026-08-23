import React, { useState } from 'react';
import {
  Sparkles,
  Leaf,
  Award,
  Users,
  FileText,
  AlertTriangle,
  Archive,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../../types/store';
import { ProductReviewsSection } from './ProductReviewsSection';

interface ProductDetailSectionsProps {
  product: Product;
}

export const ProductDetailSections: React.FC<ProductDetailSectionsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<string>('description');
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    benefits: true,
    ingredients: true,
    howToUse: true,
    whoItIsFor: true,
    productDetails: true,
    safety: true,
    storage: true,
    shipping: true,
    returns: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Section availability checks
  const displayDescription = product.fullDescription || product.description;
  const hasDescription = Boolean(displayDescription);
  const hasBenefits = Boolean(product.benefits && product.benefits.length > 0);
  const hasIngredients = Boolean(product.ingredients && product.ingredients.length > 0);
  const hasHowToUse = Boolean(
    (product.howToUse && product.howToUse.length > 0) || product.usageRitual
  );
  const hasWhoItIsFor = Boolean(product.whoItIsFor && product.whoItIsFor.length > 0);
  const hasProductAttributes = Boolean(
    (product.productAttributes && product.productAttributes.length > 0) ||
      product.volume ||
      product.sku
  );
  const hasSafety = Boolean(
    product.safetyPrecautions && product.safetyPrecautions.length > 0
  );
  const hasStorage = Boolean(product.storageInstructions);
  const hasShipping = Boolean(product.shippingAndDelivery);
  const hasReturns = Boolean(product.returnsPolicy);

  // Available tabs list
  const availableTabs = [
    hasDescription && { id: 'description', label: 'Description', icon: FileText },
    hasBenefits && { id: 'benefits', label: 'Key Benefits', icon: CheckCircle2 },
    hasIngredients && { id: 'ingredients', label: 'Ingredients', icon: Leaf },
    hasHowToUse && { id: 'howToUse', label: 'How to Use', icon: Award },
    hasWhoItIsFor && { id: 'whoItIsFor', label: 'Who It Is For', icon: Users },
    hasProductAttributes && { id: 'productDetails', label: 'Product Details', icon: Info },
    hasSafety && { id: 'safety', label: 'Safety & Precautions', icon: AlertTriangle },
    hasStorage && { id: 'storage', label: 'Storage', icon: Archive },
    hasShipping && { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    hasReturns && { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'reviews', label: `Reviews (${product.reviewsCount})`, icon: Star },
  ].filter(Boolean) as { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[];

  return (
    <div id="product-detail-sections" className="space-y-8 mb-16">
      {/* Tab Navigation Header (Desktop / Tablet) */}
      <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl shadow-sm p-2 overflow-x-auto scrollbar-none no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById(`section-${tab.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
                className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#123F2A] text-[var(--brand-gold)] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] shadow-md'
                    : 'text-[#37463D] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--brand-gold)] dark:text-[#0B2F20]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Product Description */}
          {hasDescription && (
            <div
              id="section-description"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion('description')}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[var(--brand-gold)] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                      Product Description
                    </h3>
                    <span className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                      Ancient Hakki-Pikki tribal heritage & extraction methodology
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openAccordions.description ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.description && (
                <div className="pt-5 mt-4 border-t border-[#E7E1D5] dark:border-white/10 space-y-4 font-sans text-xs sm:text-sm text-[#37463D] dark:text-slate-200 leading-relaxed">
                  {displayDescription.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                  {product.subtitle && product.subtitle !== displayDescription && (
                    <div className="p-4 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10 italic text-[var(--brand-gold)]">
                      "{product.subtitle}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. Key Benefits */}
          {hasBenefits && (
            <div
              id="section-benefits"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleAccordion('benefits')}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                      Key Benefits & Results
                    </h3>
                    <span className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                      Scientifically observed natural follicular rejuvenation
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openAccordions.benefits ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.benefits && (
                <div className="pt-5 mt-4 border-t border-[#E7E1D5] dark:border-white/10">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {product.benefits?.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#37463D] dark:text-slate-200 leading-relaxed font-medium">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 3. Ingredients / Materials */}
          {hasIngredients && (
            <div
              id="section-ingredients"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleAccordion('ingredients')}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[var(--brand-gold)] flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                      Ingredients & Materials
                    </h3>
                    <span className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                      100% Raw forest-harvested botanical actives
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openAccordions.ingredients ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.ingredients && (
                <div className="pt-5 mt-4 border-t border-[#E7E1D5] dark:border-white/10 space-y-4">
                  <p className="text-xs text-[#5F6B63] dark:text-slate-300">
                    Hand-harvested by Hakki-Pikki tribal clans deep within the Western Ghats forest biosphere:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.ingredients?.map((ing, i) => (
                      <div
                        key={i}
                        className="bg-[#FAF8F2] dark:bg-black/30 border border-[#E7E1D5] dark:border-white/15 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#123F2A] dark:text-slate-200 flex items-center gap-2.5 shadow-xs"
                      >
                        <Leaf className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. How to Use */}
          {hasHowToUse && (
            <div
              id="section-howToUse"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleAccordion('howToUse')}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                      How to Use (Step-by-Step Ritual)
                    </h3>
                    <span className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                      Authentic Ayurvedic application steps for maximum absorption
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openAccordions.howToUse ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.howToUse && (
                <div className="pt-5 mt-4 border-t border-[#E7E1D5] dark:border-white/10 space-y-4">
                  {product.howToUse && product.howToUse.length > 0 ? (
                    <ol className="space-y-3 font-sans">
                      {product.howToUse.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#123F2A] text-[var(--brand-gold)] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-[#37463D] dark:text-slate-200 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : product.usageRitual ? (
                    <div className="p-4 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10 text-xs sm:text-sm text-[#37463D] dark:text-slate-200 italic leading-relaxed">
                      "{product.usageRitual}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* 5. Who It Is For */}
          {hasWhoItIsFor && (
            <div
              id="section-whoItIsFor"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleAccordion('whoItIsFor')}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                      Who It Is For
                    </h3>
                    <span className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                      Ideal hair profiles, concerns, and scalp conditions
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openAccordions.whoItIsFor ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordions.whoItIsFor && (
                <div className="pt-5 mt-4 border-t border-[#E7E1D5] dark:border-white/10">
                  <ul className="space-y-2.5">
                    {product.whoItIsFor?.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#37463D] dark:text-slate-200 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 6. Customer Reviews */}
          <div id="section-reviews">
            <ProductReviewsSection product={product} />
          </div>
        </div>

        {/* Sidebar Specifications & Policies (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 7. Product Specifications & Details Table */}
          {hasProductAttributes && (
            <div
              id="section-productDetails"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#E7E1D5] dark:border-white/10">
                <Info className="w-4 h-4 text-[var(--brand-gold)]" />
                <h4 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Product Details & Specs
                </h4>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                {product.productAttributes && product.productAttributes.length > 0 ? (
                  product.productAttributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5 last:border-0"
                    >
                      <span className="text-[#5F6B63] dark:text-slate-400 font-medium">
                        {attr.label}
                      </span>
                      <span className="font-bold text-[#123F2A] dark:text-slate-100 text-right max-w-[55%]">
                        {attr.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-[#5F6B63] dark:text-slate-400 font-medium">Category</span>
                      <span className="font-bold text-[#123F2A] dark:text-slate-100">{product.category}</span>
                    </div>
                    {product.volume && (
                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                        <span className="text-[#5F6B63] dark:text-slate-400 font-medium">Net Quantity</span>
                        <span className="font-bold text-[#123F2A] dark:text-slate-100">{product.volume}</span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between py-1.5 border-b border-black/5 dark:border-white/5">
                        <span className="text-[#5F6B63] dark:text-slate-400 font-medium">SKU</span>
                        <span className="font-mono font-bold text-[#123F2A] dark:text-slate-100">{product.sku}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#5F6B63] dark:text-slate-400 font-medium">Country of Origin</span>
                      <span className="font-bold text-[#123F2A] dark:text-slate-100">{product.countryOfOrigin || 'India'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 8. Safety & Precautions */}
          {hasSafety && (
            <div
              id="section-safety"
              className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-3 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="font-serif-luxury font-bold text-base">Safety & Precautions</h4>
              </div>
              <ul className="space-y-2 text-xs text-[#37463D] dark:text-slate-200 font-sans">
                {product.safetyPrecautions?.map((sec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 9. Storage Instructions */}
          {hasStorage && (
            <div
              id="section-storage"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Archive className="w-4 h-4 text-[var(--brand-gold)]" />
                <h4 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Storage Instructions
                </h4>
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans">
                {product.storageInstructions}
              </p>
            </div>
          )}

          {/* 10. Shipping & Delivery */}
          {hasShipping && (
            <div
              id="section-shipping"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Shipping & Delivery
                </h4>
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans">
                {product.shippingAndDelivery}
              </p>
            </div>
          )}

          {/* 11. Returns Policy */}
          {hasReturns && (
            <div
              id="section-returns"
              className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Returns & Authenticity
                </h4>
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans">
                {product.returnsPolicy}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
