import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-3 py-1.5 text-xs font-bold shadow-sm transition active:scale-95"
        title="फोन में ऐप इंस्टॉल करें"
      >
        <Download className="w-3.5 h-3.5" />
        <span>ऐप इंस्टॉल करें</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/90 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition"
        >
          <Smartphone className="w-3 h-3 text-emerald-600" />
          <span>iOS पर चलाएं</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  iPhone / iPad पर इंस्टॉल करें
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs text-gray-700 leading-relaxed">
                <p>1. सफारी (Safari) ब्राउज़र में नीचे दिए गए <strong>Share (शेयर)</strong> बटन पर टैप करें।</p>
                <p>2. नीचे स्क्रॉल करें और <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong> चुनें।</p>
                <p>3. ऊपर कोने में <strong>Add</strong> पर क्लिक करें। ऐप आपके फोन की होम स्क्रीन पर आ जाएगी।</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                समझ गया (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
