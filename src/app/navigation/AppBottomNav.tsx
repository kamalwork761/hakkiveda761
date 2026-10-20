import React, { useEffect, useState } from 'react';
import { Home, ShoppingBag, Sparkles, Package, User } from 'lucide-react';

export type AppNavTab = 'home' | 'shop' | 'analysis' | 'orders' | 'account';

interface AppBottomNavProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Auto-rotating Hair Analysis badge; no carousel dots.
  const [badgeSlide, setBadgeSlide] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => setBadgeSlide((slide) => (slide + 1) % 2), 3200);
    return () => window.clearInterval(interval);
  }, []);

  const tabs: {
    id: AppNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'analysis', label: 'Hair Analysis', icon: Sparkles },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E382C] border-t border-[#C5A059]/25 shadow-2xl pb-[max(10px,env(safe-area-inset-bottom))] pt-1"
      aria-label="App Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isAnalysis = tab.id === 'analysis';
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center relative active:scale-95 transition-all ${
                isActive ? 'text-[#C5A059]' : 'text-emerald-100/70 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#C5A059]/20' : ''
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'stroke-[2.5] scale-110 text-[#C5A059]' : 'stroke-[1.8]'
                    }`}
                  />
                </div>

                {isAnalysis && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#FFF8D8] via-[#F4D466] to-[#D6A83F] border-[3px] border-[#E9C35A] shadow-[0_6px_20px_rgba(14,56,44,0.42)] overflow-hidden ring-2 ring-[#0E382C]/25">
                    <div className="relative flex h-full items-center justify-center overflow-hidden text-center" aria-label="Free AI Hair Analysis">
                      <span className={`absolute inset-0 flex items-center justify-center text-[15px] font-black tracking-wide text-[#0E382C] transition-all duration-500 ${badgeSlide === 0 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`} style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>FREE</span>
                      <span className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-[#0E382C] transition-all duration-500 ${badgeSlide === 1 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}><Sparkles className="h-5 w-5" /><span className="text-[10px] font-extrabold tracking-wide">AI SCAN</span></span>
                    </div>
                  </div>
                )}              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap transition-all ${
                  isActive ? 'font-bold text-[#FDF8EC]' : 'font-medium text-emerald-200/60'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
