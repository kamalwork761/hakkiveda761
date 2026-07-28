import React, { useState } from 'react';
import { MessageCircle, X, PhoneCall, Sparkles } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '917619536831';
  const displayPhone = '+91 76195 36831';
  const defaultMessage = 'Namaste HAKKIVEDA! I have a question about your 42-herb tribal hair oil and products.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 sm:right-8 z-50 font-sans">
      {/* Expanded Tooltip / Quick Card */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 w-72 sm:w-80 bg-[#082b20] border border-[#25D366]/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-[#128C7E] p-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#128C7E] flex items-center justify-center font-bold text-xs shadow-sm">
                HV
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">HAKKIVEDA Tribal Support</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Mysore Live Experts Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body message */}
          <div className="p-3.5 space-y-3 bg-[var(--brand-primary-dark)]/90 text-xs">
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-3 text-slate-200 shadow-inner space-y-1.5">
              <p className="text-[11px] leading-relaxed">
                🙏 <strong>Namaste!</strong> Need assistance with your hair care routine or order status? Chat live with our Hakki-Pikki tribal herbal team:
              </p>
              <div className="text-[11px] text-[var(--brand-gold)] font-semibold flex items-center gap-1.5 pt-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{displayPhone}</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1fbd59] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/50 transition-all text-xs uppercase tracking-wider"
              id="whatsapp-direct-link-card"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Start Live WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <div className="relative group flex items-center">
        {/* Pulsing Aura Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-50 animate-ping pointer-events-none"></span>

        {/* Hover Text Banner for Desktop */}
        <div className="hidden sm:flex absolute right-full mr-3 bg-[var(--brand-primary-deep)]/90 backdrop-blur-md text-slate-100 text-xs px-3.5 py-2 rounded-xl border border-[#25D366]/40 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none items-center gap-2 font-medium transform translate-x-2 group-hover:translate-x-0">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>Chat with Herbal Expert ({displayPhone})</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setShowTooltip(!showTooltip)}
          className="relative bg-[#25D366] hover:bg-[#1fbd59] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white/30 group-hover:border-white shadow-emerald-950/80"
          id="whatsapp-floating-button"
          aria-label="Contact on WhatsApp +91 76195 36831"
        >
          {/* Official WhatsApp SVG Logo */}
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          
          {/* Active notification badge */}
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--brand-primary-dark)] shadow-md animate-bounce">
            1
          </span>
        </a>
      </div>
    </div>
  );
};

