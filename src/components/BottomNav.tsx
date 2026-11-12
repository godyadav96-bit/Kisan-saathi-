import React from 'react';
import { Home, CloudSun, TrendingUp, FlaskConical, User } from 'lucide-react';
import { useApp, ActiveScreen } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, t } = useApp();

  const navItems: { id: ActiveScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'mausam', label: t.mausam, icon: CloudSun },
    { id: 'mandi', label: t.mandiBhav, icon: TrendingUp },
    { id: 'soilsense', label: t.soilSense, icon: FlaskConical },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40 pb-safe">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all select-none active:scale-95 ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-stone-500 hover:text-emerald-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100 text-emerald-800 scale-110 shadow-xs' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-emerald-800' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
