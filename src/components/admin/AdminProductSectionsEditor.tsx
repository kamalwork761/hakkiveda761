import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Leaf,
  Compass,
  Users,
  Sliders,
  AlertTriangle,
  Archive,
  Truck,
  RotateCcw,
  Globe,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  HelpCircle,
} from 'lucide-react';
import { Product, ProductDetailAttribute } from '../../types/store';

interface AdminProductSectionsEditorProps {
  product: Product;
  onChange: (updates: Partial<Product>) => void;
  onShowToast?: (msg: string) => void;
}

export const AdminProductSectionsEditor: React.FC<AdminProductSectionsEditorProps> = ({
  product,
  onChange,
  onShowToast,
}) => {
  const [openSection, setOpenSection] = useState<string>('description');

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const toggleSection = (sec: string) => {
    setOpenSection((prev) => (prev === sec ? '' : sec));
  };

  // Helpers for list-based fields
  const handleAddListItem = (field: 'benefits' | 'ingredients' | 'howToUse' | 'whoItIsFor' | 'safetyPrecautions') => {
    const currentList = product[field] || [];
    const updated = [...currentList, ''];
    onChange({ [field]: updated });
  };

  const handleUpdateListItem = (
    field: 'benefits' | 'ingredients' | 'howToUse' | 'whoItIsFor' | 'safetyPrecautions',
    index: number,
    value: string
  ) => {
    const currentList = [...(product[field] || [])];
    currentList[index] = value;
    onChange({ [field]: currentList });
  };

  const handleDeleteListItem = (
    field: 'benefits' | 'ingredients' | 'howToUse' | 'whoItIsFor' | 'safetyPrecautions',
    index: number
  ) => {
    const currentList = (product[field] || []).filter((_, i) => i !== index);
    onChange({ [field]: currentList });
  };

  // Helpers for Product Details Attributes (Key-Value table)
  const handleAddAttribute = () => {
    const currentAttrs = product.productAttributes || [];
    const updated: ProductDetailAttribute[] = [...currentAttrs, { label: 'Attribute Name', value: 'Value' }];
    onChange({ productAttributes: updated });
  };

  const handleUpdateAttribute = (index: number, field: 'label' | 'value', value: string) => {
    const currentAttrs = [...(product.productAttributes || [])];
    currentAttrs[index] = { ...currentAttrs[index], [field]: value };
    onChange({ productAttributes: currentAttrs });
  };

  const handleDeleteAttribute = (index: number) => {
    const currentAttrs = (product.productAttributes || []).filter((_, i) => i !== index);
    onChange({ productAttributes: currentAttrs });
  };

  const handleApplyDefaultAttributes = () => {
    const defaults: ProductDetailAttribute[] = [
      { label: 'Formulation Type', value: '100% Cold-Pressed Ayurvedic Extraction' },
      { label: 'Shelf Life', value: '24 Months from Manufacturing Date' },
      { label: 'Aroma / Scent', value: 'Earthy Wild Jungle Herbs & Vetiver' },
      { label: 'Suitable For', value: 'All Hair & Scalp Types (Men & Women)' },
      { label: 'Texture', value: 'Silky, Non-Sticky Lightweight Botanical Oil' },
      { label: 'Chemicals & Sulphates', value: 'Zero Paraben, Zero Mineral Oil, Zero Silicones' },
      { label: 'Country of Origin', value: product.countryOfOrigin || 'India' },
    ];
    onChange({ productAttributes: defaults });
    notify('Loaded standard Ayurvedic specifications!');
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header Info */}
      <div className="border-b border-white/10 pb-3">
        <label className="text-slate-100 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--brand-gold)]" />
          <span>Product Detail Page Content & Rituals</span>
        </label>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Control every accordion and description section shown on the customer page. Empty sections are automatically hidden.
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. Descriptions & Subtitle */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[var(--brand-gold)]" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">Product Descriptions & Subtitle</h4>
                <span className="text-[10px] text-slate-400">Short intro hook and full heritage formulation story</span>
              </div>
            </div>
            {openSection === 'description' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'description' && (
            <div className="p-4 space-y-4 border-t border-white/10 animate-fadeIn">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Short Subtitle / Hook (Shown right below product title)
                </label>
                <input
                  type="text"
                  value={product.subtitle || ''}
                  onChange={(e) => onChange({ subtitle: e.target.value })}
                  placeholder="e.g. 100% Pure Hakki-Pikki Tribe Cold-Boiled Oil for Severe Hairfall & Rapid Regrowth"
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Short Description (Shown next to product images above variants)
                </label>
                <textarea
                  rows={3}
                  value={product.shortDescription || product.description || ''}
                  onChange={(e) => onChange({ shortDescription: e.target.value, description: e.target.value })}
                  placeholder="A concise 2-3 sentence overview highlighting the purity and core benefit..."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Full Description (Shown inside "Product Description" accordion with paragraphs)
                </label>
                <textarea
                  rows={5}
                  value={product.fullDescription || product.description || ''}
                  onChange={(e) => onChange({ fullDescription: e.target.value })}
                  placeholder="Comprehensive description of the sacred tribal process, herbs infusion, and clinical history. Use double newlines for separate paragraphs."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed font-sans focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Key Benefits */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('benefits')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  Key Benefits ({(product.benefits || []).length} items)
                </h4>
                <span className="text-[10px] text-slate-400">Bulleted advantages displayed with gold checkmarks</span>
              </div>
            </div>
            {openSection === 'benefits' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'benefits' && (
            <div className="p-4 space-y-3 border-t border-white/10 animate-fadeIn">
              {(product.benefits || []).map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => handleUpdateListItem('benefits', idx, e.target.value)}
                    placeholder="e.g. Reduces excessive shedding within 14 consecutive nights of application"
                    className="flex-1 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteListItem('benefits', idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddListItem('benefits')}
                className="bg-black/40 hover:bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Benefit</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Ingredients & Materials */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('ingredients')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  Ingredients & Botanicals ({(product.ingredients || []).length} items)
                </h4>
                <span className="text-[10px] text-slate-400">Authentic herbs and botanical ingredients breakdown</span>
              </div>
            </div>
            {openSection === 'ingredients' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'ingredients' && (
            <div className="p-4 space-y-3 border-t border-white/10 animate-fadeIn">
              {(product.ingredients || []).map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-mono text-[11px] w-5 text-right">🌿</span>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleUpdateListItem('ingredients', idx, e.target.value)}
                    placeholder="e.g. Bhringraj, Amla, Nilgiri Mountain Wood, Brahmi, Cold-Pressed Virgin Sesame"
                    className="flex-1 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteListItem('ingredients', idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddListItem('ingredients')}
                className="bg-black/40 hover:bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. How to Use (Ritual Steps) */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('howToUse')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  How to Use / Sacred Ritual ({(product.howToUse || []).length} steps)
                </h4>
                <span className="text-[10px] text-slate-400">Step-by-step application instructions</span>
              </div>
            </div>
            {openSection === 'howToUse' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'howToUse' && (
            <div className="p-4 space-y-3 border-t border-white/10 animate-fadeIn">
              {(product.howToUse || []).map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold text-[11px] w-14 shrink-0">Step {idx + 1}:</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdateListItem('howToUse', idx, e.target.value)}
                    placeholder="e.g. Dispense 5-10 ml into palm and warm gently between hands..."
                    className="flex-1 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteListItem('howToUse', idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddListItem('howToUse')}
                className="bg-black/40 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ritual Step</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Who It Is For */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('whoItIsFor')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-purple-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  Who It Is For ({(product.whoItIsFor || []).length} profiles)
                </h4>
                <span className="text-[10px] text-slate-400">Target customer concerns and hair/skin profiles</span>
              </div>
            </div>
            {openSection === 'whoItIsFor' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'whoItIsFor' && (
            <div className="p-4 space-y-3 border-t border-white/10 animate-fadeIn">
              {(product.whoItIsFor || []).map((prof, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-purple-400 font-mono text-[11px] w-5 text-right">🎯</span>
                  <input
                    type="text"
                    value={prof}
                    onChange={(e) => handleUpdateListItem('whoItIsFor', idx, e.target.value)}
                    placeholder="e.g. Individuals struggling with severe crown thinning, receding hairline, or stress-induced shedding"
                    className="flex-1 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteListItem('whoItIsFor', idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddListItem('whoItIsFor')}
                className="bg-black/40 hover:bg-purple-950/40 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Target Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* 6. Product Specifications & Details Table */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('attributes')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  Product Details & Specifications Table ({(product.productAttributes || []).length} rows)
                </h4>
                <span className="text-[10px] text-slate-400">Key-Value attributes displayed in clean 2-column table</span>
              </div>
            </div>
            {openSection === 'attributes' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'attributes' && (
            <div className="p-4 space-y-3 border-t border-white/10 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">Define specifications (e.g. Shelf Life, Aroma, Suitable For):</span>
                <button
                  type="button"
                  onClick={handleApplyDefaultAttributes}
                  className="text-[var(--brand-gold)] hover:underline text-[10px] font-bold"
                >
                  ⚡ Load Standard Ayurvedic Defaults
                </button>
              </div>

              {(product.productAttributes || []).map((attr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attr.label}
                    onChange={(e) => handleUpdateAttribute(idx, 'label', e.target.value)}
                    placeholder="Attribute Label (e.g. Shelf Life)"
                    className="w-1/3 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 font-bold focus:border-[var(--brand-gold)]"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleUpdateAttribute(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 24 Months from MFD)"
                    className="flex-1 bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAttribute(idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAttribute}
                className="bg-black/40 hover:bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Specification Row</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Safety, Storage, Shipping, Returns & Origin */}
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('policies')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/20 hover:bg-black/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs uppercase">
                  Safety, Storage, Shipping, Returns & Country of Origin
                </h4>
                <span className="text-[10px] text-slate-400">Policies, precautions, storage guide, and origin certificate</span>
              </div>
            </div>
            {openSection === 'policies' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'policies' && (
            <div className="p-4 space-y-4 border-t border-white/10 animate-fadeIn">
              {/* Country of Origin */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>Country of Origin *</span>
                </label>
                <input
                  type="text"
                  value={product.countryOfOrigin || 'India (Mysore & Nilgiri Mountain Reserves)'}
                  onChange={(e) => onChange({ countryOfOrigin: e.target.value })}
                  placeholder="e.g. India (Mysore & Nilgiri Mountain Reserves)"
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Safety & Precautions */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Safety / Precautions (One precaution per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={(product.safetyPrecautions || []).join('\n')}
                  onChange={(e) =>
                    onChange({
                      safetyPrecautions: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="• Perform patch test on inner wrist 24h prior to first application&#10;• For external use only. Avoid contact with eyes."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Storage Instructions */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-2">
                  <Archive className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Storage Instructions</span>
                </label>
                <input
                  type="text"
                  value={product.storageInstructions || ''}
                  onChange={(e) => onChange({ storageInstructions: e.target.value })}
                  placeholder="e.g. Store in a cool, dry place away from direct sunlight. Seal cap tightly."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Shipping Information */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shipping & Delivery Information</span>
                </label>
                <textarea
                  rows={2}
                  value={product.shippingAndDelivery || ''}
                  onChange={(e) => onChange({ shippingAndDelivery: e.target.value })}
                  placeholder="e.g. Dispatched within 24-48 hours via Shiprocket express air delivery. Free shipping across India."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Return Information */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Return & Exchange Policy</span>
                </label>
                <textarea
                  rows={2}
                  value={product.returnsPolicy || ''}
                  onChange={(e) => onChange({ returnsPolicy: e.target.value })}
                  placeholder="e.g. 7-day doorstep replacement guarantee if bottle arrives damaged or broken in transit."
                  className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
