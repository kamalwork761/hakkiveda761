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
  const analysisMessages = ['FREE', 'Hair Analysis', 'Try Now', 'Get Discount'];
  const [analysisMessageIndex, setAnalysisMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnalysisMessageIndex((current) => (current + 1) % analysisMessages.length);
    }, 2000);

    return () => window.clearInterval(timer);
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
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#FFF5C7] via-[#F5D778] to-[#C99732] border-[3px] border-[#F3D681] shadow-[0_5px_18px_rgba(0,0,0,0.4)] overflow-hidden ring-2 ring-[#0E382C]/20">
                    <div
                      className="flex h-full transition-transform duration-500 ease-in-out"
                      style={{
                        width: `${analysisMessages.length * 100}%`,
                        transform: `translateX(-${analysisMessageIndex * (100 / analysisMessages.length)}%)`,
                      }}
                    >
                      {analysisMessages.map((message) => (
                        <div
                          key={message}
                          className="h-full shrink-0 flex items-center justify-center text-center px-1.5"
                          style={{ width: `${100 / analysisMessages.length}%` }}
                        >
                          <span className="text-[10px] leading-[12px] font-black text-[#0B2E25] drop-shadow-sm">
                            {message}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                      {analysisMessages.map((_, index) => (
                        <span
                          key={index}
                          className={`block rounded-full transition-all ${
                            index === analysisMessageIndex
                              ? 'w-2.5 h-1 bg-[#0B2E25]'
                              : 'w-1 h-1 bg-[#0B2E25]/35'
                          }`}
                        />
                      ))}
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
