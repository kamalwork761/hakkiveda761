import React from 'react';
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
  const tabs: {
    id: AppNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'analysis', label: 'Hair Analysis', icon: Sparkles, badge: 'FREE' },
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

                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#C5A059] text-[#0E382C] text-[8px] font-black px-1 py-0.2 rounded-full uppercase tracking-tighter shadow-sm border border-[#0E382C]">
                    {tab.badge}
                  </span>
                )}
              </div>

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
