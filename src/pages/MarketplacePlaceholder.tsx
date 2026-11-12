import React from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MarketplacePlaceholder: React.FC = () => {
  const { t, setActiveScreen } = useApp();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      <button
        onClick={() => setActiveScreen('home')}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>होम पर वापस जाएं</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8 text-amber-700" />
        </div>

        <div className="space-y-1">
          <span className="bg-amber-100 text-amber-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            भविष्य की सुविधा (Coming Soon)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-serif pt-2">
            {t.futureMarketplace}
          </h2>
          <p className="text-sm font-bold text-emerald-700">
            {t.comingSoon}
          </p>
        </div>

        <div className="max-w-md mx-auto text-xs text-gray-600 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-left space-y-2">
          <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>इस मॉड्यूल में क्या सुविधाएं जुड़ेंगी?</span>
          </h4>
          <ul className="space-y-1.5 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>किसान सीधे अपनी कटी हुई फसल (अनाज, सरसों, सब्जियां) की लिस्टिंग बना सकेंगे।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>सत्यापित खरीदार (FPO, मिल मालिक, व्यापारी) सीधे बोली लगा सकेंगे।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>बिना बिचौलियों के उचित मूल्य व सुरक्षित डिजिटल भुगतान का विकल्प।</span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-gray-400">
          संस्थापक / मालिक एडमिन पैनल के &apos;फीचर टॉगल&apos; से इस सुविधा को चालू कर सकते हैं।
        </p>
      </div>
    </div>
  );
};
