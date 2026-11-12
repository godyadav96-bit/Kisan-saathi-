import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Filter, 
  RefreshCw, 
  Scale, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MandiPriceRecord, SellDecisionAdvice } from '../types';
import { RAJASTHAN_LOCATIONS } from '../data/mockData';

export const MandiDashboard: React.FC = () => {
  const { t, location, isDemoMode, refreshKey } = useApp();

  const [prices, setPrices] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceName, setSourceName] = useState('');
  const [isFromCache, setIsFromCache] = useState(false);
  const [cacheTime, setCacheTime] = useState<string | undefined>(undefined);

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>(location.district || 'Jaipur');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Intelligence: "आज बेचें या रुकें?"
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionCommodity, setDecisionCommodity] = useState('Mustard');
  const [decisionData, setDecisionData] = useState<SellDecisionAdvice | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Mandi Comparison state
  const [compareCommodity, setCompareCommodity] = useState<string>('Mustard');
  const [isCompareView, setIsCompareView] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMandiData() {
      setLoading(true);
      try {
        const res = await api.getMandiPrices(
          selectedDistrict,
          selectedCommodity,
          searchQuery,
          isDemoMode
        );
        if (isMounted) {
          setPrices(res.data);
          setSourceName(res.sourceName);
          setIsFromCache(res.isFromCache);
          setCacheTime(res.cacheTime);
        }
      } catch (err) {
        console.error('Mandi load failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMandiData();
    return () => {
      isMounted = false;
    };
  }, [selectedDistrict, selectedCommodity, searchQuery, isDemoMode, refreshKey]);

  // Load decision support
  const handleOpenDecision = async (commodity: string) => {
    setDecisionCommodity(commodity);
    setDecisionModalOpen(true);
    setDecisionLoading(true);
    try {
      const dec = await api.getMandiDecision(commodity, selectedDistrict);
      setDecisionData(dec);
    } catch (err) {
      console.error('Decision load failed:', err);
    } finally {
      setDecisionLoading(false);
    }
  };

  const currentDistricts = RAJASTHAN_LOCATIONS[0].districts;
  const commoditiesList = [
    { id: 'all', nameHi: 'सभी फसलें', nameEn: 'All Crops' },
    { id: 'Mustard', nameHi: 'सरसों', nameEn: 'Mustard' },
    { id: 'Wheat', nameHi: 'गेहूं', nameEn: 'Wheat' },
    { id: 'Bajra', nameHi: 'बाजरा', nameEn: 'Bajra' },
    { id: 'Gram', nameHi: 'चना', nameEn: 'Gram' },
    { id: 'Onion', nameHi: 'प्याज', nameEn: 'Onion' },
    { id: 'Potato', nameHi: 'आलू', nameEn: 'Potato' },
    { id: 'Tomato', nameHi: 'टमाटर', nameEn: 'Tomato' },
    { id: 'Maize', nameHi: 'मक्का', nameEn: 'Maize' },
  ];

  // Comparison filtered data across mandis
  const comparisonRecords = prices.filter(
    (p) => p.commodity.toLowerCase() === compareCommodity.toLowerCase()
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header with Source Info */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-2xl text-amber-800">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 font-serif">
                {t.mandiBhav}
              </h2>
              <p className="text-xs text-gray-500">
                राजस्थान कृषि विपणन बोर्ड एवं AGMARKNET
              </p>
            </div>
          </div>

          {/* Sell Decision Support Button */}
          <button
            onClick={() => handleOpenDecision('Mustard')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-900 font-extrabold px-3 py-2 rounded-xl text-xs shadow-md transition active:scale-95"
          >
            <Scale className="w-4 h-4 text-stone-900" />
            <span>{t.sellOrHold}</span>
          </button>
        </div>

        {/* Source and Transparency Card */}
        <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/60 text-[11px] text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div>
            <span className="font-bold">डेटा स्रोत:</span> {sourceName || 'AGMARKNET / e-NAM Official Rajasthan Portal'}
          </div>
          <div className="text-[10px] text-amber-900">
            {isFromCache ? `⚠️ ऑफ़लाइन रिकॉर्ड (${cacheTime})` : `ताजा रिकॉर्ड: ${new Date().toLocaleDateString('hi-IN')}`}
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
        {/* District Selector Tabs */}
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            जिला चुनें (Select District)
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {currentDistricts.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDistrict(d.name)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedDistrict.toLowerCase() === d.name.toLowerCase()
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d.nameHi} ({d.name})
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Selector Chips */}
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            फसल चुनें (Select Commodity)
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {commoditiesList.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommodity(c.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCommodity === c.id
                    ? 'bg-amber-400 text-stone-900 font-extrabold shadow-xs'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {c.nameHi}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Compare Toggle */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="मंडी या किस्म खोजें..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setIsCompareView(!isCompareView)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              isCompareView
                ? 'bg-emerald-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>मंडी तुलना</span>
          </button>
        </div>
      </div>

      {/* 3. Mandi Comparison Mode (Screen 16) */}
      {isCompareView && (
        <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold">आसपास की मंडियों में भाव तुलना</h3>
              <p className="text-[11px] text-emerald-200">
                जानिए किस मंडी में आपको बेहतर कीमत मिल सकती है
              </p>
            </div>
            <select
              value={compareCommodity}
              onChange={(e) => setCompareCommodity(e.target.value)}
              className="bg-emerald-950 border border-emerald-700 text-white text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="Mustard">सरसों (Mustard)</option>
              <option value="Wheat">गेहूं (Wheat)</option>
              <option value="Bajra">बाजरा (Bajra)</option>
              <option value="Onion">प्याज (Onion)</option>
              <option value="Gram">चना (Gram)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {prices
              .filter((p) => p.commodity.toLowerCase() === compareCommodity.toLowerCase())
              .map((rec) => (
                <div
                  key={rec.id}
                  className="bg-emerald-800/80 p-3 rounded-2xl border border-emerald-700 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{rec.mandiName}</h4>
                    <p className="text-[10px] text-emerald-300">किस्म: {rec.variety}</p>
                    <p className="text-[10px] text-emerald-300">आवक: {rec.arrivalQuantityQtl} क्विंटल</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300 block">
                      ₹{rec.modalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-300 block">
                      दायरा: ₹{rec.minPrice} - ₹{rec.maxPrice}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Mandi Price Records List (Screens 14 & 15) */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="py-12 bg-white rounded-3xl p-8 text-center text-xs text-gray-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
            <p>ताज़ा मंडी भाव डेटा प्राप्त किया जा रहा है...</p>
          </div>
        ) : prices.length > 0 ? (
          prices.map((record) => {
            const isUp = record.priceTrend === 'up';
            const isDown = record.priceTrend === 'down';

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-sm hover:border-emerald-300 transition space-y-3"
              >
                {/* Top: Commodity & Mandi */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-gray-900 font-serif">
                        {record.commodityHi}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        ({record.commodity} - {record.variety})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{record.mandiName}</span>
                    </p>
                  </div>

                  {/* Trend Indicator */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                      isUp
                        ? 'bg-emerald-50 text-emerald-700'
                        : isDown
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                    {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                    {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                    <span>{isUp ? `+₹${record.changeAmount}` : isDown ? `-₹${Math.abs(record.changeAmount || 0)}` : 'स्थिर'}</span>
                  </div>
                </div>

                {/* Price Matrix: Min, Modal, Max */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50/80 p-3 rounded-2xl border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 block">{t.minPrice}</span>
                    <span className="text-xs font-bold text-gray-700">
                      ₹{record.minPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="border-x border-gray-200">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">
                      {t.modalPrice}
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-900 block leading-tight">
                      ₹{record.modalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-gray-400">/क्विंटल</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">{t.maxPrice}</span>
                    <span className="text-xs font-bold text-gray-700">
                      ₹{record.maxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Bottom Meta & Decision Link */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span>आवक: <strong>{record.arrivalQuantityQtl} क्विंटल</strong></span>
                    <span>अपडेट: {record.lastUpdated}</span>
                  </div>
                  <button
                    onClick={() => handleOpenDecision(record.commodity)}
                    className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>आज बेचें?</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-gray-500 border border-gray-100 space-y-1">
            <p className="font-bold text-gray-700">कोई मंडी रिकॉर्ड नहीं मिला।</p>
            <p>कृपया अन्य जिला या फसल चुनकर देखें।</p>
          </div>
        )}
      </div>

      {/* 5. "आज बेचें या रुकें?" Decision Intelligence Modal */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-900 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-stone-900 text-amber-300 rounded-xl">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-950">आज बेचें या रुकें?</h3>
                  <p className="text-xs text-stone-800 font-medium">
                    {decisionCommodity} • {selectedDistrict}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="p-1 rounded-full text-stone-900 hover:bg-amber-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed">
              {decisionLoading ? (
                <div className="py-8 text-center text-gray-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
                  <p>मंडी आवक और ऐतिहासिक भाव का विश्लेषण किया जा रहा है...</p>
                </div>
              ) : decisionData ? (
                <>
                  {/* Verdict Card */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      decisionData.verdict === 'hold'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider">
                        बाजार संकेत: {decisionData.marketDirection}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold mt-1">
                      {decisionData.title}
                    </h4>
                  </div>

                  {/* Reasons */}
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1.5">महत्वपूर्ण कारक:</h5>
                    <ul className="space-y-1.5">
                      {decisionData.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-gray-50 p-2 rounded-xl text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checklist Before Selling */}
                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 mb-1.5">
                      मंडी ले जाने से पूर्व जांच सूची (Checklist):
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {decisionData.checklist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[10px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                    ⚠️ {decisionData.limitations}
                  </p>
                </>
              ) : null}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-900 transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
