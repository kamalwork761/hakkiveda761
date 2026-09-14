import React, { useState } from 'react';
import {
  Globe,
  DollarSign,
  Percent,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
  Ban,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Product } from '../../types/store';
import { WORLD_COUNTRIES } from '../../data/countriesData';
import { getProductPriceINRForCountry } from '../../utils/productUtils';

interface AdminProductInternationalEditorProps {
  product: Product;
  onChange: (updated: Partial<Product>) => void;
  formatINR: (val: number) => string;
}

const REGION_PRESETS: { name: string; codes: string[] }[] = [
  {
    name: 'GCC Countries (Gulf)',
    codes: ['AE', 'SA', 'QA', 'KW', 'OM', 'BH'],
  },
  {
    name: 'North America',
    codes: ['US', 'CA', 'MX'],
  },
  {
    name: 'Southeast Asia',
    codes: ['SG', 'MY', 'ID', 'TH', 'VN', 'PH'],
  },
  {
    name: 'Europe & UK',
    codes: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'CH', 'SE', 'IE'],
  },
  {
    name: 'Oceania & Island Nations',
    codes: ['AU', 'NZ', 'FJ', 'MU'],
  },
  {
    name: 'Neighboring Countries',
    codes: ['NP', 'LK', 'BT', 'BD', 'MV'],
  },
];

export const AdminProductInternationalEditor: React.FC<AdminProductInternationalEditorProps> = ({
  product,
  onChange,
  formatINR,
}) => {
  const isIntlEnabled = product.internationalEnabled !== false;
  const pricingMode = product.internationalPricingMode || 'SAME_AS_INDIA';
  const fixedPriceINR = product.internationalPriceINR || product.priceINR;
  const markupPercent = product.internationalMarkupPercent || 0;

  const allowedCountries = product.internationalAllowedCountries || [];
  const blockedCountries = product.internationalBlockedCountries || [];

  const [selectedAddCountry, setSelectedAddCountry] = useState('');
  const [selectedBlockCountry, setSelectedBlockCountry] = useState('');

  // Sample conversions preview rates
  const effectiveIntlPriceINR = getProductPriceINRForCountry(product, 'US');

  const previewCurrencies = [
    { code: 'USD', symbol: '$', rate: 83.5, label: 'United States & Global' },
    { code: 'SGD', symbol: 'S$', rate: 62.5, label: 'Singapore' },
    { code: 'AED', symbol: 'د.إ', rate: 22.8, label: 'United Arab Emirates' },
    { code: 'SAR', symbol: '﷼', rate: 22.2, label: 'Saudi Arabia' },
    { code: 'MYR', symbol: 'RM', rate: 18.8, label: 'Malaysia' },
    { code: 'MUR', symbol: 'Rs', rate: 1.8, label: 'Mauritius' },
    { code: 'FJD', symbol: 'FJ$', rate: 37.2, label: 'Fiji' },
    { code: 'NPR', symbol: 'रु', rate: 0.625, label: 'Nepal' },
  ];

  const handleAddAllowedCountry = (code: string) => {
    if (!code) return;
    if (!allowedCountries.includes(code)) {
      const updated = [...allowedCountries, code];
      onChange({ internationalAllowedCountries: updated });
    }
    setSelectedAddCountry('');
  };

  const handleRemoveAllowedCountry = (code: string) => {
    const updated = allowedCountries.filter((c) => c !== code);
    onChange({ internationalAllowedCountries: updated });
  };

  const handleAddBlockedCountry = (code: string) => {
    if (!code) return;
    if (!blockedCountries.includes(code)) {
      const updated = [...blockedCountries, code];
      onChange({ internationalBlockedCountries: updated });
    }
    setSelectedBlockCountry('');
  };

  const handleRemoveBlockedCountry = (code: string) => {
    const updated = blockedCountries.filter((c) => c !== code);
    onChange({ internationalBlockedCountries: updated });
  };

  const handleApplyPreset = (target: 'allowed' | 'blocked', codes: string[]) => {
    if (target === 'allowed') {
      const merged = Array.from(new Set([...allowedCountries, ...codes]));
      onChange({ internationalAllowedCountries: merged });
    } else {
      const merged = Array.from(new Set([...blockedCountries, ...codes]));
      onChange({ internationalBlockedCountries: merged });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* 1. Global International Availability Toggle */}
      <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/15 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isIntlEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif-luxury text-white">
                  International Sales & Dispatch
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isIntlEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {isIntlEnabled ? 'Enabled Internationally' : 'Domestic (India Only)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                Allow or restrict international customers from viewing, adding to cart, and purchasing this formulation.
                Domestic India visibility remains completely unaffected.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isIntlEnabled}
              onChange={(e) => onChange({ internationalEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {isIntlEnabled && (
        <>
          {/* 2. International Pricing Mode */}
          <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/15 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-sm font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>International Pricing Strategy</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-sans">
                  Define how international prices are derived (base domestic price is ₹{product.priceINR.toLocaleString('en-IN')}).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: SAME_AS_INDIA */}
              <button
                type="button"
                onClick={() => onChange({ internationalPricingMode: 'SAME_AS_INDIA' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  pricingMode === 'SAME_AS_INDIA'
                    ? 'bg-[var(--brand-gold,#D4AF37)]/15 border-[var(--brand-gold,#D4AF37)] shadow-md'
                    : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Same as India Base</span>
                  <input
                    type="radio"
                    checked={pricingMode === 'SAME_AS_INDIA'}
                    onChange={() => onChange({ internationalPricingMode: 'SAME_AS_INDIA' })}
                    className="accent-[var(--brand-gold)]"
                  />
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-tight">
                  Uses base price ₹{product.priceINR.toLocaleString('en-IN')} converted at live market forex rates.
                </p>
                <span className="text-xs font-mono font-bold text-[var(--brand-gold)]">
                  ₹{product.priceINR.toLocaleString('en-IN')} base
                </span>
              </button>

              {/* Option 2: FIXED_INR */}
              <button
                type="button"
                onClick={() => onChange({ internationalPricingMode: 'FIXED_INR' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  pricingMode === 'FIXED_INR'
                    ? 'bg-[var(--brand-gold,#D4AF37)]/15 border-[var(--brand-gold,#D4AF37)] shadow-md'
                    : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Fixed International INR</span>
                  <input
                    type="radio"
                    checked={pricingMode === 'FIXED_INR'}
                    onChange={() => onChange({ internationalPricingMode: 'FIXED_INR' })}
                    className="accent-[var(--brand-gold)]"
                  />
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-tight">
                  Specify a custom fixed base INR price for all international markets.
                </p>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Fixed Custom INR
                </span>
              </button>

              {/* Option 3: MARKUP_PERCENT */}
              <button
                type="button"
                onClick={() => onChange({ internationalPricingMode: 'MARKUP_PERCENT' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  pricingMode === 'MARKUP_PERCENT'
                    ? 'bg-[var(--brand-gold,#D4AF37)]/15 border-[var(--brand-gold,#D4AF37)] shadow-md'
                    : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Percentage Markup</span>
                  <input
                    type="radio"
                    checked={pricingMode === 'MARKUP_PERCENT'}
                    onChange={() => onChange({ internationalPricingMode: 'MARKUP_PERCENT' })}
                    className="accent-[var(--brand-gold)]"
                  />
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-tight">
                  Applies automatic markup % over base price to offset overseas handling.
                </p>
                <span className="text-xs font-mono font-bold text-amber-400">
                  +%{markupPercent} Markup
                </span>
              </button>
            </div>

            {/* Sub-inputs based on mode */}
            {pricingMode === 'FIXED_INR' && (
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-emerald-400">
                  Fixed International Base Price (INR ₹) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={fixedPriceINR}
                    onChange={(e) => onChange({ internationalPriceINR: Number(e.target.value) || 0 })}
                    className="w-48 bg-[var(--brand-primary-deep,#07150E)] border border-emerald-500/50 p-2.5 rounded-xl text-emerald-400 font-bold font-mono text-sm focus:border-emerald-400"
                  />
                  <span className="text-xs text-slate-300">
                    Domestic price remains ₹{product.priceINR.toLocaleString('en-IN')}. International base price is ₹{fixedPriceINR.toLocaleString('en-IN')}.
                  </span>
                </div>
              </div>
            )}

            {pricingMode === 'MARKUP_PERCENT' && (
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-amber-300">
                  International Markup Percentage (%) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-40">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={markupPercent}
                      onChange={(e) => onChange({ internationalMarkupPercent: Number(e.target.value) || 0 })}
                      className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-amber-500/50 p-2.5 rounded-xl text-amber-300 font-bold font-mono text-sm focus:border-amber-300 pr-8"
                    />
                    <Percent className="w-4 h-4 text-amber-400 absolute right-3 top-3" />
                  </div>
                  <span className="text-xs text-slate-300">
                    Effective International Base: <strong className="text-amber-300 font-mono">₹{effectiveIntlPriceINR.toLocaleString('en-IN')}</strong> (₹{product.priceINR} + {markupPercent}%)
                  </span>
                </div>
              </div>
            )}

            {/* Live Pricing Matrix in Customer Currencies */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>Live International Customer Prices Preview</span>
                </span>
                <span className="text-[10px] text-slate-400">Effective Base: ₹{effectiveIntlPriceINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {previewCurrencies.map((c) => {
                  const converted = Math.round(effectiveIntlPriceINR / c.rate);
                  return (
                    <div
                      key={c.code}
                      className="bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-slate-400 truncate">{c.label}</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs font-bold text-[var(--brand-gold)] font-mono">
                          {c.symbol}{converted.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{c.code}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Country-Specific Allowlist / Blocklist Management */}
          <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/15 rounded-2xl p-5 space-y-5 shadow-lg">
            <div className="border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Country Availability & Geo-Restrictions</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-sans">
                Fine-tune which international destinations can purchase this specific product.
              </p>
            </div>

            {/* Quick Regional Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Quick Regional Allowlist Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {REGION_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset('allowed', preset.codes)}
                    className="text-xs bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg text-slate-200 font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{preset.name}</span>
                  </button>
                ))}
                {allowedCountries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange({ internationalAllowedCountries: [] })}
                    className="text-xs bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    Clear All (Allow All World)
                  </button>
                )}
              </div>
            </div>

            {/* Allowlist Section */}
            <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Specific Allowed Countries ({allowedCountries.length === 0 ? 'All International Countries Allowed' : `${allowedCountries.length} Specific Countries`})</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {allowedCountries.length === 0
                      ? 'When empty, all international countries are eligible for checkout (unless added to the blocklist below).'
                      : 'Only customers from these specific countries will be allowed to buy this formulation.'}
                  </p>
                </div>

                {/* Country dropdown selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAddCountry}
                    onChange={(e) => handleAddAllowedCountry(e.target.value)}
                    className="bg-[var(--brand-primary-deep,#07150E)] border border-emerald-500/40 text-xs text-slate-100 p-2 rounded-lg"
                  >
                    <option value="">+ Add Allowed Country...</option>
                    {WORLD_COUNTRIES.filter((c) => c.code !== 'IN').map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {allowedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {allowedCountries.map((code) => {
                    const countryInfo = WORLD_COUNTRIES.find((c) => c.code === code);
                    return (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        <span>{countryInfo?.flag || '🌐'}</span>
                        <span>{countryInfo?.name || code}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllowedCountry(code)}
                          className="hover:text-white p-0.5 rounded-full hover:bg-emerald-800 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blocklist Section */}
            <div className="bg-black/30 border border-rose-500/20 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Ban className="w-4 h-4" />
                    <span>Explicitly Blocked Countries ({blockedCountries.length})</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Customers in these countries will see "Restricted in your country" and cannot checkout this item.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedBlockCountry}
                    onChange={(e) => handleAddBlockedCountry(e.target.value)}
                    className="bg-[var(--brand-primary-deep,#07150E)] border border-rose-500/40 text-xs text-slate-100 p-2 rounded-lg"
                  >
                    <option value="">+ Add Blocked Country...</option>
                    {WORLD_COUNTRIES.filter((c) => c.code !== 'IN').map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {blockedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {blockedCountries.map((code) => {
                    const countryInfo = WORLD_COUNTRIES.find((c) => c.code === code);
                    return (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        <span>{countryInfo?.flag || '🌐'}</span>
                        <span>{countryInfo?.name || code}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBlockedCountry(code)}
                          className="hover:text-white p-0.5 rounded-full hover:bg-rose-800 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 4. Optional International Content Overrides */}
          <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/15 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Optional International Title & Customs Description</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-sans">
                Leave blank to automatically use standard domestic product title and description.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  International Product Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder={product.name}
                  value={product.internationalTitle || ''}
                  onChange={(e) => onChange({ internationalTitle: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 p-2.5 rounded-xl text-slate-100 text-xs focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  International Short Description / Customs Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder={product.shortDescription || product.description}
                  value={product.internationalDescription || ''}
                  onChange={(e) => onChange({ internationalDescription: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 p-2.5 rounded-xl text-slate-100 text-xs focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
