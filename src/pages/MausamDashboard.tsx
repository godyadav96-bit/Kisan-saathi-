import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Compass, 
  Thermometer, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WeatherData, MausamSalah } from '../types';

export const MausamDashboard: React.FC = () => {
  const {
    t,
    location,
    selectedCrop,
    setSelectedCrop,
    isDemoMode,
    refreshKey,
    setIsLocationModalOpen,
    cropsList,
    triggerManualRefresh,
  } = useApp();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [cacheTime, setCacheTime] = useState<string | undefined>(undefined);

  // Weather Salah state
  const [growthStage, setGrowthStage] = useState('शाखाएं व कल्ले फूटने की अवस्था (Vegetative)');
  const [sowingDate, setSowingDate] = useState('25 दिन पहले');
  const [salah, setSalah] = useState<MausamSalah | null>(null);
  const [salahLoading, setSalahLoading] = useState(false);

  // Forecast Tab View: 'hourly' | '3day' | '7day'
  const [forecastTab, setForecastTab] = useState<'hourly' | '3day' | '7day'>('7day');

  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getWeather(
          location.latitude,
          location.longitude,
          location.district,
          isDemoMode
        );
        if (isMounted) {
          setWeather(res.data);
          setIsFromCache(res.isFromCache);
          setCacheTime(res.cacheTime);
        }
      } catch (err) {
        console.warn('Weather unavailable:', err);
        if (isMounted) {
          setWeather(null);
          setError('लाइव मौसम सेवा अभी उपलब्ध नहीं है। कृपया कनेक्शन जांचें या थोड़ी देर बाद पुनः प्रयास करें।');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [location, isDemoMode, refreshKey]);

  // Request AI Advisory
  const handleGetSalah = async () => {
    if (!weather) return;
    setSalahLoading(true);
    try {
      const result = await api.getMausamSalah({
        location,
        weather: weather.current,
        crop: selectedCrop,
        growthStage,
        sowingDate,
      });
      setSalah(result);
    } catch (err) {
      console.error('Salah fetch failed:', err);
    } finally {
      setSalahLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header with Location and Source Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-2xl text-emerald-800">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 font-serif">
                {t.mausam} ({location.district})
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{location.village ? `${location.village}, ` : ''}{location.tehsil}, {location.state}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
          >
            {t.changeLocation}
          </button>
        </div>

        {/* Source and Transparency Banner (as requested in prompt) */}
        {weather && (
          <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span>डेटा स्रोत: {weather.provider}</span>
              <span className="bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {weather.current.isObserved ? 'निरीक्षित (Observed)' : 'पूर्वानुमान (Forecast)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-500 text-[10px]">
              <span>अंतिम अपडेट: {weather.current.lastUpdated}</span>
              <span>समय क्षेत्र: Asia/Kolkata</span>
            </div>
            {isFromCache && (
              <div className="text-amber-800 font-medium text-[10px] bg-amber-100/70 px-2 py-0.5 rounded">
                ⚠️ ऑफ़लाइन कैश्ड डेटा: {cacheTime}
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 bg-white rounded-3xl border border-emerald-100 p-8 text-center text-xs text-gray-500 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p>ताज़ा मौसम उपग्रह डेटा प्राप्त किया जा रहा है...</p>
        </div>
      ) : weather ? (
        <>
          {/* 2. Current Weather Hero Card */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-200 tracking-wider uppercase block">
                  आज का तापमान
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-5xl font-black">{weather.current.temperature}°</span>
                  <span className="text-xl font-bold text-emerald-200">C</span>
                </div>
                <p className="text-sm font-bold text-amber-300 mt-1">
                  {weather.current.condition}
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  महसूस (Feels Like): {weather.current.feelsLike}°C
                </p>
              </div>

              <div className="text-right space-y-1.5">
                <div className="bg-emerald-950/40 p-2 rounded-2xl border border-emerald-600/30">
                  <span className="text-[10px] text-emerald-200 block">अधिकतम / न्यूनतम</span>
                  <span className="text-sm font-extrabold text-white">
                    {weather.current.tempMax}°C / {weather.current.tempMin}°C
                  </span>
                </div>
                <div className="bg-emerald-950/40 p-2 rounded-2xl border border-emerald-600/30">
                  <span className="text-[10px] text-emerald-200 block">बारिश की संभावना</span>
                  <span className="text-sm font-extrabold text-amber-300 flex items-center justify-end gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    {weather.current.rainProbability}%
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="mt-4 pt-4 border-t border-emerald-600/50 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[10px] text-emerald-200 block">आर्द्रता (Humidity)</span>
                <span className="font-bold text-white text-sm">{weather.current.humidity}%</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[10px] text-emerald-200 block">हवा की गति</span>
                <span className="font-bold text-white text-sm flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-300" />
                  {weather.current.windSpeed} km/h
                </span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[10px] text-emerald-200 block">हवा की दिशा</span>
                <span className="font-bold text-white text-sm flex items-center justify-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  {weather.current.windDirection}
                </span>
              </div>
            </div>

            {/* Weather Warnings if any */}
            {weather.current.warnings && weather.current.warnings.length > 0 && (
              <div className="mt-3 bg-amber-500/90 text-amber-950 p-2.5 rounded-2xl text-xs font-bold flex items-start gap-2 shadow-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-950 mt-0.5" />
                <div>
                  {weather.current.warnings.map((w, idx) => (
                    <p key={idx}>{w}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Forecast Section with Tabs: Hourly, 3-Day, 7-Day */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>पूर्वानुमान (Weather Forecast)</span>
              </h3>
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs">
                <button
                  onClick={() => setForecastTab('hourly')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    forecastTab === 'hourly'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  घंटेवार
                </button>
                <button
                  onClick={() => setForecastTab('3day')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    forecastTab === '3day'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  3 दिन
                </button>
                <button
                  onClick={() => setForecastTab('7day')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    forecastTab === '7day'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  7 दिन
                </button>
              </div>
            </div>

            {/* Forecast Content */}
            {forecastTab === 'hourly' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
                {weather.hourly.length > 0 ? (
                  weather.hourly.map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-2.5 min-w-[76px] text-center shrink-0 space-y-1"
                    >
                      <span className="text-[11px] font-bold text-gray-500 block">{h.hour}</span>
                      <span className="text-base font-extrabold text-gray-900 block">{h.temp}°</span>
                      <span className="text-[10px] text-blue-600 font-bold flex items-center justify-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" />
                        {h.rainProb}%
                      </span>
                      <span className="text-[10px] text-gray-600 block truncate">{h.condition}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">घंटेवार पूर्वानुमान उपलब्ध नहीं</p>
                )}
              </div>
            )}

            {(forecastTab === '3day' || forecastTab === '7day') && (
              <div className="space-y-2">
                {(forecastTab === '3day' ? weather.daily.slice(0, 3) : weather.daily).map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs"
                  >
                    <div className="w-20">
                      <span className="font-bold text-gray-900 block">{d.dayName}</span>
                      <span className="text-[10px] text-gray-400 block">{d.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-1 px-2">
                      <span className="font-medium text-gray-700 truncate">{d.condition}</span>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        {d.rainProb}%
                      </span>
                      <span className="font-extrabold text-gray-800">
                        {d.tempMax}° / {d.tempMin}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. WEATHER-BASED AI ADVISOR: Kisan Saathi Mausam Salah */}
          <div className="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-3xl p-5 border border-amber-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950">
                    {t.mausamSalahTitle}
                  </h3>
                  <p className="text-[10px] text-emerald-800">
                    Gemini AI मौसम-आधारित फसल सलाह
                  </p>
                </div>
              </div>
            </div>

            {/* Crop & Stage Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  फसल चुनें (Selected Crop)
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {cropsList.map((c) => (
                    <option key={c.id} value={c.nameEn}>
                      {c.nameHi} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  फसल की अवस्था (Growth Stage)
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="बुवाई / अंकुरण (Sowing / Germination)">बुवाई / अंकुरण (Germination)</option>
                  <option value="कल्ले व शाखाएं फूटने की अवस्था (Vegetative)">कल्ले व शाखाएं (Vegetative)</option>
                  <option value="फूल व फलियां आने की अवस्था (Flowering)">फूल व फलियां (Flowering)</option>
                  <option value="दाना भराव अवस्था (Grain Filling)">दाना भराव (Grain Filling)</option>
                  <option value="कटाई के करीब (Near Harvest)">कटाई के करीब (Near Harvest)</option>
                </select>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGetSalah}
              disabled={salahLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              {salahLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>मौसम और फसल का विश्लेषण हो रहा है...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{selectedCrop} के लिए मौसम सलाह प्राप्त करें</span>
                </>
              )}
            </button>

            {/* Salah Results Display */}
            {salah && (
              <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3 text-xs leading-relaxed animate-in fade-in">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <h4 className="font-extrabold text-emerald-900 text-xs flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>मौसम सारांश व अनुकूलता</span>
                  </h4>
                  <p className="mt-1 text-gray-700 font-medium">{salah.summary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <h5 className="font-bold text-blue-900 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.irrigationAdvice}</span>
                    </h5>
                    <p className="mt-1 text-gray-700 text-[11px]">{salah.irrigationAdvice}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.pestAdvice}</span>
                    </h5>
                    <p className="mt-1 text-gray-700 text-[11px]">{salah.pestWarning}</p>
                  </div>
                </div>

                {salah.sowingAdvice && (
                  <div className="p-2.5 rounded-xl bg-green-50/70 border border-green-100">
                    <span className="font-bold text-green-900 block">{t.sowingAdvice}</span>
                    <p className="mt-1 text-gray-700 text-[11px]">{salah.sowingAdvice}</p>
                  </div>
                )}

                {salah.precautions && salah.precautions.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-bold text-gray-800 block text-[11px]">
                      सावधानियां व कृषि सुझाव:
                    </span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700 text-[11px]">
                      {salah.precautions.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[10px] text-amber-800 italic pt-1 border-t border-gray-100">
                  ⚠️ {salah.disclaimer}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-gray-900">
              मौसम डेटा लोड नहीं हो सका
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              {error || 'लाइव मौसम जानकारी अभी उपलब्ध नहीं है।'}
            </p>
          </div>
          <button
            type="button"
            onClick={triggerManualRefresh}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुनः प्रयास करें</span>
          </button>
        </div>
      )}
    </div>
  );
};
