import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  TrendingUp, 
  FlaskConical, 
  HelpCircle, 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  Droplets, 
  Wind, 
  Wheat, 
  ChevronRight, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WeatherData, MandiPriceRecord, FarmingArticle } from '../types';
import { notificationService } from '../services/notificationService';

export const HomeDashboard: React.FC = () => {
  const {
    t,
    location,
    selectedCrop,
    setSelectedCrop,
    currentUser,
    setActiveScreen,
    isDemoMode,
    refreshKey,
    setIsChatOpen,
    setSelectedArticle,
    cropsList,
  } = useApp();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>([]);
  const [mandiLoading, setMandiLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<FarmingArticle[]>([]);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setWeatherLoading(true);
      setMandiLoading(true);

      try {
        const wRes = await api.getWeather(
          location.latitude,
          location.longitude,
          location.district,
          isDemoMode
        );
        if (isMounted) {
          setWeather(wRes.data);
          setIsFromCache(wRes.isFromCache);
          notificationService.evaluateWeatherAlerts(wRes.data.current, location.district);
        }
      } catch (err) {
        console.error('Weather load error:', err);
      } finally {
        if (isMounted) setWeatherLoading(false);
      }

      try {
        const mRes = await api.getMandiPrices(location.district, undefined, undefined, isDemoMode);
        if (isMounted) {
          setMandiPrices(mRes.data.slice(0, 4));
          notificationService.evaluateMandiPriceAlerts(mRes.data, selectedCrop);
        }
      } catch (err) {
        console.error('Mandi load error:', err);
      } finally {
        if (isMounted) setMandiLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [location, isDemoMode, refreshKey]);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Welcome Card with Farmer Greeting */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background art elements */}
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4 pointer-events-none">
          <Wheat className="w-48 h-48 text-amber-300" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-amber-400 text-emerald-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {location.village ? `${location.village}, ` : ''}{location.district}
            </span>
            <span className="text-[11px] text-emerald-200">
              {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
            राम-राम, {currentUser?.name || 'किसान साथी'}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-sm">
            आपकी चुनी हुई फसल: <strong className="text-amber-300 underline underline-offset-2">{selectedCrop}</strong>। 
            आज का मौसम और मंडी भाव नीचे देखें।
          </p>
        </div>
      </div>

      {/* 2. Weather Quick Card */}
      <div 
        onClick={() => setActiveScreen('mausam')}
        className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-md cursor-pointer hover:border-emerald-300 transition group relative"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-2xl text-amber-700 group-hover:scale-105 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t.todayWeather}
              </h3>
              <p className="text-sm font-extrabold text-emerald-900">
                {location.district} ({location.village || 'केंद्रीय'})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold group-hover:translate-x-1 transition-transform">
            <span>विस्तार से देखें</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {weatherLoading ? (
          <div className="py-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>मौसम डेटा लोड हो रहा है...</span>
          </div>
        ) : weather ? (
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    {weather.current.temperature}°
                  </span>
                  <span className="text-sm font-bold text-gray-500">C</span>
                </div>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">
                  {weather.current.condition}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-right text-xs">
                <div className="bg-emerald-50/80 px-2.5 py-1 rounded-xl">
                  <span className="text-[10px] text-gray-500 block">बारिश संभावना</span>
                  <span className="font-extrabold text-emerald-900 flex items-center justify-end gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    {weather.current.rainProbability}%
                  </span>
                </div>
                <div className="bg-emerald-50/80 px-2.5 py-1 rounded-xl">
                  <span className="text-[10px] text-gray-500 block">अधिकतम/न्यूनतम</span>
                  <span className="font-extrabold text-gray-800">
                    {weather.current.tempMax}° / {weather.current.tempMin}°
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold shrink-0">कृषि सलाह:</span>
              <span>{weather.current.summary}</span>
            </p>

            {isFromCache && (
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                * ऑफ़लाइन कैश्ड मौसम
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* 3. Six Quick Actions (Large Touch Targets as specified) */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 px-1">
          त्वरित सुविधाएँ (Quick Actions)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Action 1: Mausam */}
          <button
            onClick={() => setActiveScreen('mausam')}
            className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {t.viewMausam}
              </h4>
              <p className="text-[10px] text-gray-500">पूर्वानुमान व चेतावनी</p>
            </div>
          </button>

          {/* Action 2: Mandi Bhav */}
          <button
            onClick={() => setActiveScreen('mandi')}
            className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {t.viewMandi}
              </h4>
              <p className="text-[10px] text-gray-500">ताजा भाव व आवक</p>
            </div>
          </button>

          {/* Action 3: SoilSense */}
          <button
            onClick={() => setActiveScreen('soilsense')}
            className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {t.soilReport}
              </h4>
              <p className="text-[10px] text-gray-500">NPK व pH जांच</p>
            </div>
          </button>

          {/* Action 4: Crop Recommendation */}
          <button
            onClick={() => setActiveScreen('crops')}
            className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {t.whichCropToGrow}
              </h4>
              <p className="text-[10px] text-gray-500">मौसम व मिट्टी अनुसार</p>
            </div>
          </button>

          {/* Action 5: Kheti Calculator */}
          <button
            onClick={() => setActiveScreen('calculator')}
            className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {t.khetiExpense}
              </h4>
              <p className="text-[10px] text-gray-500">लागत व मुनाफा गणना</p>
            </div>
          </button>

          {/* Action 6: Kisan AI */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-emerald-50 p-3.5 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition active:scale-97 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 leading-tight">
                {t.askAIQuestions}
              </h4>
              <p className="text-[10px] text-emerald-800">24×7 कृषि सहायक</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Mandi Bhav Ticker / Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-xl text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                {location.district} मंडी भाव
              </h3>
              <p className="text-[10px] text-gray-500">स्रोत: AGMARKNET / e-NAM</p>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('mandi')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {mandiLoading ? (
          <div className="py-4 text-center text-xs text-gray-400">
            मंडी भाव प्राप्त किए जा रहे हैं...
          </div>
        ) : mandiPrices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mandiPrices.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setActiveScreen('mandi')}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 transition cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span>{rec.commodityHi}</span>
                    <span className="text-[10px] font-normal text-gray-500">({rec.variety})</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">{rec.mandiName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-800">
                    ₹{rec.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-gray-400 block">/क्विंटल</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">इस जिले के लिए ताजा मंडी भाव लोड नहीं हो सके।</p>
        )}
      </div>

      {/* 5. Farming Knowledge Section Link */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
              {t.khetiLibrary}
            </h3>
          </div>
          <p className="text-xs text-emerald-800 font-medium">
            रबी, खरीफ, खाद प्रबंधन, सिंचाई और सरकारी योजनाओं की प्रामाणिक जानकारी पढ़ें।
          </p>
        </div>
        <button
          onClick={() => setActiveScreen('library')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-3 py-2 text-xs font-bold shrink-0 shadow-xs transition active:scale-95 flex items-center gap-1"
        >
          <span>पढ़ें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
