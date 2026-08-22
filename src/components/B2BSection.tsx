import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Send,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  X,
  Package,
  FileCheck,
  Tag,
  Truck,
  Headphones,
  Award,
  Sparkles,
  Star,
  Lock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const renderIcon = (iconName: string, customColor?: string) => {
  const style = customColor ? { color: customColor } : undefined;
  const cls = "w-5 h-5 shrink-0";
  switch (iconName) {
    case 'Package':
      return <Package className={cls} style={style} />;
    case 'FileCheck':
      return <FileCheck className={cls} style={style} />;
    case 'Tag':
      return <Tag className={cls} style={style} />;
    case 'Truck':
      return <Truck className={cls} style={style} />;
    case 'ShieldCheck':
      return <ShieldCheck className={cls} style={style} />;
    case 'Headphones':
      return <Headphones className={cls} style={style} />;
    case 'Building2':
      return <Building2 className={cls} style={style} />;
    case 'Globe':
      return <Globe className={cls} style={style} />;
    case 'Award':
      return <Award className={cls} style={style} />;
    case 'Sparkles':
      return <Sparkles className={cls} style={style} />;
    case 'Star':
      return <Star className={cls} style={style} />;
    case 'Lock':
      return <Lock className={cls} style={style} />;
    default:
      return <CheckCircle2 className={cls} style={style} />;
  }
};

export const B2BSection: React.FC = () => {
  const {
    isB2BModalOpen,
    setIsB2BModalOpen,
    addB2BLead,
    b2bSectionConfig,
    products,
    formatPrice,
    openQuickView,
    selectedCountry,
    brandIdentity,
  } = useStore();

  const isLight =
    brandIdentity?.themeMode === 'light' ||
    (!brandIdentity?.themeMode &&
      (brandIdentity?.backgroundColor === '#FFFFFF' ||
        brandIdentity?.backgroundColor === '#FAF8F2' ||
        !brandIdentity?.backgroundColor));

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(selectedCountry?.name || 'India');
  const [estimatedVolume, setEstimatedVolume] = useState('500 - 1,000 Bottles / Month');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedCountry?.name) {
      setCountry(selectedCountry.name);
    }
  }, [selectedCountry?.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email) return;

    addB2BLead({
      companyName,
      contactName,
      email,
      phone,
      country,
      estimatedVolume,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsB2BModalOpen(false);
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 2500);
  };

  const config = b2bSectionConfig;
  const rawTheme = config?.theme;
  const theme = {
    backgroundColor: isLight ? '#FFFFFF' : (rawTheme?.backgroundColor || '#0d1a10'),
    overlayColor: rawTheme?.overlayColor || '#000000',
    overlayOpacity: rawTheme?.overlayOpacity ?? 35,
    textColor: isLight ? '#123F2A' : (rawTheme?.textColor || '#f8fafc'),
    buttonColor: isLight ? '#123F2A' : (rawTheme?.buttonColor || '#d4af37'),
  };

  // Filter selected products for showcase
  const selectedProducts = products.filter((p) =>
    config?.selectedProductIds?.includes(p.id)
  );

  const sortedFeatures = [...(config?.features || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <>
      {/* On-page B2B Banner Section */}
      {config?.enabled && (
        <section
          id="b2b"
          className="py-16 sm:py-20 relative overflow-hidden border-t border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10 scroll-mt-12 bg-white dark:bg-[var(--brand-primary-deep,#0B1D13)]"
        >
          <div id="b2b-export" className="absolute -top-12 left-0" />
          {/* Background Image & Overlay */}
          {config.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${config.backgroundImage})` }}
            >
              <div
                className="image-overlay"
                style={{
                  backgroundColor: theme.overlayColor || '#000000',
                  opacity: (theme.overlayOpacity ?? 35) / 100,
                }}
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">
            {/* Main B2B Box */}
            <div
              className="bg-gradient-to-br from-[#FAF8F2] to-white dark:from-[var(--brand-primary-deep)]/90 dark:to-black/80 backdrop-blur-md border border-[var(--brand-gold)]/40 rounded-3xl p-6 sm:p-12 shadow-xl overflow-hidden banner-content overlay-card text-[#123F2A] dark:text-slate-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-5">
                  {config.badgeText && (
                    <span className="inline-block bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)] text-[#0B2F20] dark:text-[var(--brand-gold)] text-[10px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full shadow-sm accent">
                      {config.badgeText}
                    </span>
                  )}

                  {config.heading && (
                    <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold leading-tight text-[#123F2A] dark:text-slate-100">
                      {config.heading}
                    </h2>
                  )}

                  {config.subheading && (
                    <h3 className="text-sm sm:text-base font-semibold text-[#0B2F20] dark:text-[var(--brand-gold)] accent">
                      {config.subheading}
                    </h3>
                  )}

                  {config.description && (
                    <p className="text-xs sm:text-sm font-sans leading-relaxed max-w-2xl text-[#37463D] dark:text-slate-300">
                      {config.description}
                    </p>
                  )}

                  {/* Features Badges */}
                  {sortedFeatures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {sortedFeatures.map((feat) => (
                        <div
                          key={feat.id}
                          className="flex items-start gap-2.5 bg-white dark:bg-black/40 border border-[#E7E1D5] dark:border-white/10 rounded-xl p-2.5 backdrop-blur-sm overlay-card shadow-sm"
                        >
                          <div className="mt-0.5 text-[#123F2A] dark:text-[var(--brand-gold)]">
                            {renderIcon(feat.icon, isLight ? '#123F2A' : theme.buttonColor)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#123F2A] dark:text-slate-100">{feat.title}</h4>
                            {feat.description && (
                              <p className="text-[11px] text-[#37463D] dark:text-slate-300 mt-0.5 leading-snug">
                                {feat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Country Coverage Badges */}
                  {config.supportedCountries && config.supportedCountries.length > 0 && (
                    <div className="pt-2 border-t border-[#E7E1D5] dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-3.5 h-3.5 text-[#123F2A] dark:text-[var(--brand-gold)]" />
                        <span className="text-[11px] uppercase tracking-wider text-[#123F2A] dark:text-[var(--brand-gold)] font-bold">
                          Global Export Destinations:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {config.supportedCountries.map((c, i) => (
                          <span
                            key={i}
                            className="bg-[#FAF8F2] dark:bg-black/50 border border-[#E7E1D5] dark:border-white/15 text-[#123F2A] dark:text-slate-200 text-[10px] font-sans px-2.5 py-0.5 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Visual Banner / CTA Box */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
                  {config.bannerImage && (
                    <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[var(--brand-gold)]/40 shadow-2xl relative group">
                      <img
                        src={config.bannerImage}
                        alt="B2B Wholesale Banner"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-gold)]">
                          <Award className="w-4 h-4" />
                          <span>100% Certified Export Standard Formulation</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (config.ctaUrl === '#b2b' || !config.ctaUrl) {
                        setIsB2BModalOpen(true);
                      } else {
                        window.location.href = config.ctaUrl;
                      }
                    }}
                    className="w-full bg-[#123F2A] hover:bg-[#0B2F20] text-white dark:bg-[var(--brand-gold)] dark:text-[#0B1D13] px-8 py-4 rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:brightness-110 active:scale-98 transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{config.ctaText || 'Submit Export Enquiry'}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Showcase (if selected) */}
            {selectedProducts.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="text-center space-y-2">
                  <span className="text-[var(--brand-gold)] text-[10px] font-bold uppercase tracking-[0.25em]">
                    WHOLESALE CATALOG
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
                    {config.showcaseTitle || 'Featured Wholesale & Export Products'}
                  </h3>
                  {config.showcaseSubtitle && (
                    <p className="text-xs text-[#37463D] dark:text-slate-300 max-w-xl mx-auto font-sans">
                      {config.showcaseSubtitle}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white dark:bg-black/40 border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-4 hover:border-[var(--brand-gold)]/60 transition-all flex flex-col justify-between group shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="relative h-48 rounded-xl overflow-hidden bg-[#FAF8F2] dark:bg-black/60 p-2 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 bg-[#123F2A] text-[var(--brand-gold)] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[var(--brand-gold)]/30">
                            Bulk Export Ready
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-[var(--brand-gold)] font-bold">
                            {prod.category}
                          </span>
                          <h4 className="text-base font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100 line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-[#37463D] dark:text-slate-300 line-clamp-2 mt-1">
                            {prod.subtitle || prod.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E7E1D5] dark:border-white/10 mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#5F6B63] dark:text-slate-400 block">Unit Retail Price</span>
                          <span className="text-sm font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">
                            {formatPrice(prod.priceINR)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (openQuickView) {
                              openQuickView(prod);
                            } else {
                              setIsB2BModalOpen(true);
                            }
                          }}
                          className="bg-[#FAF8F2] dark:bg-white/10 hover:bg-[#123F2A] hover:text-white dark:hover:bg-[var(--brand-gold)] dark:hover:text-[#0B1D13] text-[#123F2A] dark:text-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-[#E7E1D5] dark:border-transparent"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>View Product</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* B2B Modal Form */}
      {isB2BModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-[#123F2A] dark:text-slate-100 font-sans">
            <button
              onClick={() => setIsB2BModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FAF8F2] dark:bg-black/40 text-[#123F2A] dark:text-white hover:bg-[var(--brand-gold)] hover:text-[#0B2F20] transition-all flex items-center justify-center cursor-pointer border border-[#E7E1D5] dark:border-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[var(--brand-gold)] mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">Enquiry Received</h3>
                <p className="text-xs text-[#37463D] dark:text-slate-300">
                  Thank you for contacting HAKKIVEDA Herbal Enterprises. Our export director will review your enquiry and respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[var(--brand-gold)] text-[10px] font-bold uppercase tracking-widest block mb-1">
                    Wholesale & Distributor Application
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
                    B2B Commercial Enquiry
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Pure Spa Singapore Pte Ltd"
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Marcus Lim"
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@purespa.sg"
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Target Country / Region</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Singapore, Malaysia, UAE"
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Estimated Monthly Order Volume</label>
                    <select
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    >
                      <option>100 - 500 Bottles / Month</option>
                      <option>500 - 1,000 Bottles / Month</option>
                      <option>1,000 - 5,000 Bottles / Month</option>
                      <option>5,000+ Bulk Drums / OEM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-300 mb-1">Specific Requirements / Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your distribution channel, salon network, or required certifications..."
                    className="w-full bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E7E1D5] dark:border-white/20 rounded-lg p-2.5 text-xs text-[#123F2A] dark:text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#123F2A] hover:bg-[#0B2F20] text-white dark:bg-[var(--brand-gold)] dark:text-[#0B1D13] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Wholesale Proposal</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
