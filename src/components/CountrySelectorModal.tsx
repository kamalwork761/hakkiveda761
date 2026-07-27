import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { WORLD_COUNTRIES, CountryItem, DEFAULT_COUNTRY } from '../data/countriesData';
import { useStore } from '../context/StoreContext';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({ isOpen, onClose }) => {
  const { selectedCountry, selectCountry } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter countries based on search input
  const filteredCountries = WORLD_COUNTRIES.filter((country) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      country.name.toLowerCase().includes(q) ||
      country.code.toLowerCase().includes(q) ||
      country.currencyCode.toLowerCase().includes(q)
    );
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Auto-focus search input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset highlight index when query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (filteredCountries.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < filteredCountries.length - 1 ? prev + 1 : 0;
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : filteredCountries.length - 1;
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = filteredCountries[highlightedIndex] || filteredCountries[0];
        if (target) {
          handleSelect(target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCountries, highlightedIndex]);

  if (!isOpen) return null;

  const handleSelect = (country: CountryItem) => {
    selectCountry(country);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg h-[88vh] sm:h-[620px] max-h-[90vh] bg-[#072a20] border border-[#C8A24A]/40 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Select Country and Currency"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0B3D2E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C8A24A]/10 border border-[#C8A24A]/30 flex items-center justify-center text-[#C8A24A]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#C8A24A] tracking-wide uppercase">
                Select Country & Region
              </h3>
              <p className="text-[11px] text-slate-300">
                Currency adjusts automatically based on your location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/10"
            aria-label="Close country selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#072a20] shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-[#C8A24A]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country name, code (e.g. India, USA, SG)..."
              className="w-full pl-9 pr-9 py-2.5 bg-[#041a13] border border-[#C8A24A]/30 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C8A24A] focus:ring-1 focus:ring-[#C8A24A] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white p-1 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Showing {filteredCountries.length} countries</span>
            <span>Use ↑ ↓ keys or scroll</span>
          </div>
        </div>

        {/* Scrollable Country List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto min-h-0 divide-y divide-white/5 p-2 touch-pan-y overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredCountries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#C8A24A]" />
              <p className="font-semibold">No countries matching "{searchQuery}"</p>
              <p className="text-[11px] mt-1 text-slate-500">Try searching for full country name or code</p>
            </div>
          ) : (
            filteredCountries.map((country, index) => {
              const isSelected = selectedCountry?.code === country.code;
              const isHighlighted = highlightedIndex === index;

              return (
                <button
                  key={country.code}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => handleSelect(country)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-all duration-150 min-h-[50px] ${
                    isSelected
                      ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold shadow-md'
                      : isHighlighted
                      ? 'bg-[#0B3D2E] text-white border border-[#C8A24A]/30'
                      : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="text-2xl leading-none shrink-0" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {country.name}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 tracking-wider font-mono ${
                          isSelected ? 'text-[#0B3D2E]/80 font-bold' : 'text-slate-400'
                        }`}
                      >
                        ISO: {country.code}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
                        isSelected
                          ? 'bg-[#0B3D2E] text-[#C8A24A] border-transparent'
                          : 'bg-[#041a13] text-[#C8A24A] border-[#C8A24A]/20'
                      }`}
                    >
                      {country.currencyCode}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#0B3D2E] stroke-[3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#041a13] border-t border-white/10 text-center text-[11px] text-slate-400 shrink-0">
          Selected: <strong className="text-[#C8A24A]">{selectedCountry.flag} {selectedCountry.name}</strong> ({selectedCountry.currencyCode})
        </div>
      </div>
    </div>
  );
};
