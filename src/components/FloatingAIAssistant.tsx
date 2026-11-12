import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingAIAssistant: React.FC = () => {
  const { setIsChatOpen, t } = useApp();

  return (
    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-900/30 active:scale-95 transition-all duration-300 border-2 border-amber-300 group"
      aria-label="Kisan Saathi AI Assistant"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
      </div>
      <div className="text-left">
        <span className="text-xs font-black tracking-wide block leading-none">
          {t.askAI}
        </span>
        <span className="text-[10px] text-amber-200 block font-medium leading-none mt-0.5">
          Kisan Saathi AI
        </span>
      </div>
    </button>
  );
};
