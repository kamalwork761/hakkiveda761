import React, { useState } from 'react';
import { Building2, Globe, Send, CheckCircle2, ShieldCheck, Mail, Phone, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const B2BSection: React.FC = () => {
  const { isB2BModalOpen, setIsB2BModalOpen, addB2BLead } = useStore();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Singapore');
  const [estimatedVolume, setEstimatedVolume] = useState('500 - 1,000 Bottles / Month');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <>
      {/* On-page B2B Banner Section */}
      <section className="py-20 bg-[#0B3D2E] relative overflow-hidden border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 bg-gradient-to-br from-[#072a20] to-[#041a13] border border-[#C8A24A]/40 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-[#C8A24A]/20 border border-[#C8A24A] text-[#C8A24A] text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 rounded-full">
                Global B2B & Export Partnerships
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-100 leading-tight">
                Partner with HAKKIVEDA for Bulk Distribution & Spa Supply
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                We export authentic 42-herb Ayurvedic hair care formulations to luxury wellness spas, salon chains, and herbal distributors across India, Singapore, Malaysia, Fiji, Mauritius, UAE, and North America.
              </p>

              <div className="flex flex-wrap gap-6 pt-2 text-xs text-slate-200 font-sans font-semibold">
                <span className="flex items-center gap-2 text-[#C8A24A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Custom OEM / Bulk Drums</span>
                </span>
                <span className="flex items-center gap-2 text-[#C8A24A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Customs & Phytosanitary Docs</span>
                </span>
                <span className="flex items-center gap-2 text-[#C8A24A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tiered Wholesale Pricing</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end">
              <button
                onClick={() => setIsB2BModalOpen(true)}
                className="w-full lg:w-auto bg-[#C8A24A] text-[#0B3D2E] px-8 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Submit Export Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Modal Form */}
      {isB2BModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#072a20] border border-[#C8A24A]/50 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-slate-100 font-sans">
            <button
              onClick={() => setIsB2BModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#C8A24A] mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif-luxury font-bold text-slate-100">Enquiry Received</h3>
                <p className="text-xs text-slate-300">
                  Thank you for contacting HAKKIVEDA Herbal Enterprises. Our export director will review your enquiry and respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[#C8A24A] text-[10px] font-bold uppercase tracking-widest block mb-1">
                    Wholesale & Distributor Application
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-bold text-slate-100">
                    B2B Commercial Enquiry
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Pure Spa Singapore Pte Ltd"
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Marcus Lim"
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@purespa.sg"
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Target Country / Region</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Singapore, Malaysia, UAE"
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Monthly Order Volume</label>
                    <select
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                    >
                      <option>100 - 500 Bottles / Month</option>
                      <option>500 - 1,000 Bottles / Month</option>
                      <option>1,000 - 5,000 Bottles / Month</option>
                      <option>5,000+ Bulk Drums / OEM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Specific Requirements / Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your distribution channel, salon network, or required certifications..."
                    className="w-full bg-[#0B3D2E] border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C8A24A] text-[#0B3D2E] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
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
