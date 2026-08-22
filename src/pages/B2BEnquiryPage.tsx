import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Truck,
  FileCheck,
  Award,
  Layers,
  Users,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface B2BEnquiryPageProps {
  onReturnHome?: () => void;
}

const BUSINESS_TYPE_OPTIONS = [
  'Distributor',
  'Wholesaler',
  'Retailer',
  'Salon / Spa',
  'Importer',
  'Online Seller',
  'Private Label Buyer',
  'Other',
];

const ESTIMATED_QUANTITY_OPTIONS = [
  '100 - 500 Units / Month',
  '500 - 1,000 Units / Month',
  '1,000 - 5,000 Units / Month',
  '5,000+ Bulk Drums (25L - 200L)',
  'Custom Pilot Order',
];

const PRODUCT_INTEREST_OPTIONS = [
  'Adivasi Herbal Hair Growth Oil (Original 42-Herb)',
  'Adivasi Anti-Dandruff & Scalp Healing Oil',
  'Herbal Scalp Cleansing & Strengthening Shampoo',
  'Tribal Herbal Hair Rejuvenating Mask',
  'Bulk Raw Oil Formulation (25L - 200L Drums)',
  'Private Label / White Label Custom Packaging',
  'Complete Brand Catalog / All Products',
];

export const B2BEnquiryPage: React.FC<B2BEnquiryPageProps> = ({ onReturnHome }) => {
  const { addB2BLead, selectedCountry, siteSettings, playSound } = useStore();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState(selectedCountry?.name || 'India');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Distributor');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    'Adivasi Herbal Hair Growth Oil (Original 42-Herb)',
  ]);
  const [customProducts, setCustomProducts] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('500 - 1,000 Units / Month');
  const [targetMarket, setTargetMarket] = useState(selectedCountry?.name || 'India');
  const [message, setMessage] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'B2B Wholesale & Export Enquiry | HAKKIVEDA';
  }, []);

  const handleProductToggle = (prod: string) => {
    setSelectedProducts((prev) =>
      prev.includes(prod) ? prev.filter((p) => p !== prod) : [...prev, prod]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !companyName.trim() || !email.trim() || !phone.trim() || !country.trim()) {
      setErrorMsg('Please complete all required fields (*)');
      return;
    }

    setSubmitting(true);

    const productsInterestedStr = [
      ...selectedProducts,
      customProducts.trim() ? `Custom: ${customProducts.trim()}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    addB2BLead({
      contactName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      businessType,
      productsInterested: productsInterestedStr || 'All Catalog',
      estimatedVolume: estimatedQuantity,
      targetMarket: targetMarket.trim() || country.trim(),
      preferredContactMethod,
      message: message.trim(),
    });

    playSound?.('form_submit');
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppContact = () => {
    playSound?.('nav_click');
    const rawPhone = siteSettings?.whatsappNumber || siteSettings?.supportWhatsapp || '917619536831';
    const cleanPhone = rawPhone.replace(/\D/g, '') || '917619536831';
    const text = encodeURIComponent(
      `Hello HAKKIVEDA B2B Team,\n\nI have submitted a wholesale/export enquiry.\n\n• Company: ${companyName || 'Business Partner'}\n• Contact Person: ${fullName}\n• Country: ${country}\n• Business Type: ${businessType}\n• Volume: ${estimatedQuantity}\n\nPlease share wholesale catalog and export details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setCustomProducts('');
  };

  const handleBack = () => {
    playSound?.('nav_click');
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#37463D] font-sans pb-24">
      {/* Top Breadcrumb / Return Bar */}
      <div className="bg-white border-b border-[#E5D8B5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123F2A] hover:text-[#C9A84E] transition-colors cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-[#FAF8F2]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#5F6B63]">
            <span>HAKKIVEDA Enterprise</span>
            <span className="text-[#C9A84E]">•</span>
            <span className="text-[#123F2A] font-bold">Wholesale & Export</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-white border-b border-[#E5D8B5] py-10 sm:py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#123F2A]/10 text-[#123F2A] border border-[#123F2A]/20">
            <Building2 className="w-3.5 h-3.5 text-[#C9A84E]" />
            Official B2B & Export Desk
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#123F2A] leading-tight">
            Partner With HAKKIVEDA
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#123F2A] max-w-2xl mx-auto">
            Wholesale, Distribution & Global Export Partnerships
          </p>

          <p className="text-xs sm:text-sm text-[#37463D] max-w-2xl mx-auto leading-relaxed">
            Direct factory supply for distributors, retailers, wellness spas, salons, and international herbal importers.
            We provide full documentation, batch certification, phytosanitary clearance, and custom bulk supply.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {submitted ? (
          /* Confirmation State */
          <div className="bg-white border border-[#E5D8B5] rounded-3xl p-6 sm:p-12 shadow-lg text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#123F2A]/10 border-2 border-[#123F2A] flex items-center justify-center text-[#123F2A]">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#123F2A]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A]">
                Enquiry Received Successfully
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#123F2A]">
                Thank you. Our B2B team will contact you shortly.
              </p>
              <p className="text-xs sm:text-sm text-[#5F6B63] max-w-lg mx-auto leading-relaxed">
                Your partnership enquiry for <strong className="text-[#123F2A]">{companyName}</strong> has been logged in our export command system. Our export director will review your requirements and connect with you via {preferredContactMethod}.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full sm:w-auto flex-1 bg-[#123F2A] hover:bg-[#0B2F20] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A84E]" />
                <span>Contact on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto py-3.5 px-6 bg-[#FAF8F2] hover:bg-[#EDE8DC] text-[#123F2A] border border-[#E5D8B5] rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>

            <div className="pt-6 border-t border-[#E5D8B5] text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5F6B63]">
              <div className="flex items-start gap-2.5">
                <FileCheck className="w-4 h-4 text-[#123F2A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#123F2A] block font-bold">COA & MSDS Ready</strong>
                  <span>Lab analysis reports provided with all shipments.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#123F2A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#123F2A] block font-bold">Air & Sea Freight</strong>
                  <span>Door-to-door express delivery with customs clearance.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#123F2A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#123F2A] block font-bold">Factory Guarantee</strong>
                  <span>100% genuine Pakka Adivasi traditional herbs.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main B2B Enquiry Form */
          <div className="space-y-8">
            {/* Value Props Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#E5D8B5] rounded-2xl p-3.5 text-center shadow-xs">
                <Layers className="w-5 h-5 text-[#123F2A] mx-auto mb-1.5" />
                <span className="block text-xs font-bold text-[#123F2A]">Bulk & Drums</span>
                <span className="text-[10px] text-[#5F6B63]">25L to 200L Supply</span>
              </div>
              <div className="bg-white border border-[#E5D8B5] rounded-2xl p-3.5 text-center shadow-xs">
                <Award className="w-5 h-5 text-[#123F2A] mx-auto mb-1.5" />
                <span className="block text-xs font-bold text-[#123F2A]">Private Label</span>
                <span className="text-[10px] text-[#5F6B63]">Custom Branding</span>
              </div>
              <div className="bg-white border border-[#E5D8B5] rounded-2xl p-3.5 text-center shadow-xs">
                <Globe className="w-5 h-5 text-[#123F2A] mx-auto mb-1.5" />
                <span className="block text-xs font-bold text-[#123F2A]">Export Compliant</span>
                <span className="text-[10px] text-[#5F6B63]">Phytosanitary & COA</span>
              </div>
              <div className="bg-white border border-[#E5D8B5] rounded-2xl p-3.5 text-center shadow-xs">
                <Users className="w-5 h-5 text-[#123F2A] mx-auto mb-1.5" />
                <span className="block text-xs font-bold text-[#123F2A]">Dedicated Lead</span>
                <span className="text-[10px] text-[#5F6B63]">Direct B2B Desk</span>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-[#E5D8B5] rounded-3xl p-6 sm:p-10 shadow-lg">
              <div className="border-b border-[#E5D8B5] pb-5 mb-6">
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2A]">
                  Commercial Partnership Application
                </h2>
                <p className="text-xs text-[#5F6B63] mt-1">
                  Please submit your business profile. Commercial pricing, minimum order quantities, and sample kits will be shared directly.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Contact & Company Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123F2A] border-b border-[#FAF8F2] pb-1">
                    1. Business Identification
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Full Name (Contact Person) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra / Marcus Lim"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Company / Enterprise Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Vedic Naturals Pte Ltd / Royal Spa Chain"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Country of Operation <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. India, Singapore, UAE, United States"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Business Type <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] outline-none transition-all shadow-2xs cursor-pointer font-medium"
                      >
                        {BUSINESS_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Phone / WhatsApp Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210 or +65 9123 4567"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Business Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. purchase@vedicenterprise.com"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Products & Volume */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123F2A] border-b border-[#FAF8F2] pb-1">
                    2. Requirements & Volume
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] mb-2">
                      Products of Interest
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PRODUCT_INTEREST_OPTIONS.map((prod) => {
                        const isSelected = selectedProducts.includes(prod);
                        return (
                          <button
                            type="button"
                            key={prod}
                            onClick={() => handleProductToggle(prod)}
                            className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#FAF8F2] border-[#C9A84E] text-[#123F2A] shadow-2xs font-bold'
                                : 'bg-white border-[#E5D8B5] text-[#37463D] hover:bg-[#FAF8F2]'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-md shrink-0 mt-0.5 flex items-center justify-center text-[10px] ${
                                isSelected
                                  ? 'bg-[#123F2A] text-white font-bold'
                                  : 'border border-[#D8D2C4] bg-white'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="leading-snug">{prod}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Estimated Order Volume
                      </label>
                      <select
                        value={estimatedQuantity}
                        onChange={(e) => setEstimatedQuantity(e.target.value)}
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] outline-none transition-all shadow-2xs cursor-pointer font-medium"
                      >
                        {ESTIMATED_QUANTITY_OPTIONS.map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                        Target Market / Distribution Territory
                      </label>
                      <input
                        type="text"
                        value={targetMarket}
                        onChange={(e) => setTargetMarket(e.target.value)}
                        placeholder="e.g. GCC / UAE, North America, Domestic India, SEA"
                        className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123F2A] mb-1.5">
                      Specific Requirements / Custom Message
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details regarding your retail chain, salon network, private label bottle specifications, certification needs, or freight timeline..."
                      className="w-full bg-[#FAF8F2] border border-[#D8D2C4] focus:border-[#C9A84E] focus:bg-white rounded-xl p-3 text-xs text-[#123F2A] placeholder-[#8A958E] outline-none transition-all shadow-2xs resize-y"
                    ></textarea>
                  </div>
                </div>

                {/* 3. Preferred Contact Channel */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#123F2A] mb-2">
                    Preferred Communication Channel
                  </label>
                  <div className="max-w-xs">
                    <button
                      type="button"
                      onClick={() => setPreferredContactMethod('WhatsApp')}
                      className="w-full p-3 rounded-xl border bg-[#123F2A] text-white border-[#123F2A] text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#C9A84E]" />
                      <span>WhatsApp (Priority Channel)</span>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#E5D8B5]">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#123F2A] hover:bg-[#0B2F20] text-white py-4 px-8 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#C9A84E]" />
                    <span>{submitting ? 'Submitting Application...' : 'Submit B2B Enquiry'}</span>
                  </button>

                  <p className="text-[11px] text-[#5F6B63] text-center mt-3">
                    Commercial terms and tiered pricing catalogs are provided upon verification. No upfront commitment required.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
