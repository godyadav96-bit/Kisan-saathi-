import React, { useState } from 'react';
import { 
  Wheat, 
  Search, 
  Sparkles, 
  Droplets, 
  Thermometer, 
  Clock, 
  Calendar, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CropInfo } from '../types';

export const CropLibrary: React.FC = () => {
  const { 
    t, 
    cropsList, 
    location, 
    selectedCropDetail, 
    setSelectedCropDetail, 
    setSelectedCrop 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'recommendation'>('catalog');
  const [seasonFilter, setSeasonFilter] = useState<'all' | 'rabi' | 'kharif' | 'zaid'>('all');
  const [search, setSearch] = useState('');

  // Recommendation Engine State (Screen 13)
  const [recSeason, setRecSeason] = useState('rabi');
  const [recWater, setRecWater] = useState<'low' | 'medium' | 'high'>('medium');
  const [recSoilType, setRecSoilType] = useState('loamy');
  const [recommendationResult, setRecommendationResult] = useState<{
    bestCrops: CropInfo[];
    reasons: string[];
    risks: string[];
    missingInfo: string[];
  } | null>(null);

  const filteredCrops = cropsList.filter((crop) => {
    const matchesSeason = seasonFilter === 'all' || crop.category === seasonFilter;
    const matchesSearch =
      crop.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      crop.nameHi.includes(search);
    return matchesSeason && matchesSearch;
  });

  const handleRunRecommendation = () => {
    // Agronomic logic for Rajasthan
    let matching = cropsList.filter((c) => {
      if (recSeason !== 'all' && c.category !== recSeason) return false;
      if (recWater === 'low' && (c.nameEn === 'Rice' || c.nameEn === 'Maize')) return false;
      return true;
    });

    const reasons = [
      `राजस्थान के ${location.district} जिले में ${recSeason === 'rabi' ? 'रबी मौसम' : 'चुने गए मौसम'} के तापमान व जलवायु के अनुकूल।`,
      recWater === 'low'
        ? 'कम पानी व नलकूप की सीमित उपलब्धता में सरसों, चना व जौ उत्कृष्ट उत्पादन देते हैं।'
        : 'मध्यम पानी की उपलब्धता में गेहूं और सरसों की वैज्ञानिक खेती लाभकारी रहेगी।',
      'स्थानीय मंडियों (जैसे मुहाना व सीकर) में इन फसलों की सतत मांग व उचित मॉडल भाव उपलब्ध हैं।',
    ];

    const risks = [
      'दिसंबर-जनवरी में पाला (Frost) पड़ने की संभावना पर शाम को हल्की सिंचाई आवश्यक होगी।',
      'चेपा या फली छेदक कीटों से बचाव हेतु समय पर निगरानी रखें।',
    ];

    const missingInfo = [
      'खेत की मिट्टी में जैविक कार्बन (OC) और सूक्ष्म पोषक तत्वों (जिंक/सल्फर) की सटीक जांच रिपोर्ट।',
      'खेत में सिंचाई के लिए बोरवेल के पानी की लवणता (TDS/EC) की जांच।',
    ];

    setRecommendationResult({
      bestCrops: matching.slice(0, 3),
      reasons,
      risks,
      missingInfo,
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-green-100 text-green-800 rounded-2xl">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 font-serif">
                {t.whichCropToGrow}
              </h2>
              <p className="text-xs text-gray-500">
                10 प्रमुख भारतीय फसलें एवं स्मार्ट अनुशंसा इंजन
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl text-xs font-bold text-gray-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'catalog' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-gray-900'
            }`}
          >
            फसल निर्देशिका (10 फसलें)
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'recommendation' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-gray-900'
            }`}
          >
            फसल अनुशंसा इंजन (Crop Advisor)
          </button>
        </div>
      </div>

      {/* 2. TAB: CATALOG (Screen 12) */}
      {activeTab === 'catalog' && (
        <div className="space-y-3">
          {/* Season Filter & Search */}
          <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'सभी फसलें' },
                { id: 'rabi', label: 'रबी (सर्दियां)' },
                { id: 'kharif', label: 'खरीफ (मानसून)' },
                { id: 'zaid', label: 'जायद (गर्मी)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeasonFilter(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    seasonFilter === s.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="फसल का नाम खोजें (उदा. गेहूं, सरसों, प्याज)..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCropDetail(crop)}
                className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-sm hover:border-emerald-300 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Wheat className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 font-serif">
                        {crop.nameHi} ({crop.nameEn})
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {crop.suitableSeason}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded-2xl text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[9px]">तापमान दायरा:</span>
                    <span className="font-bold text-gray-800">{crop.tempRange}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">फसल अवधि:</span>
                    <span className="font-bold text-gray-800">{crop.durationDays}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[9px]">बुवाई समय:</span>
                    <span className="font-medium text-gray-700">{crop.sowingPeriod}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-gray-500 truncate max-w-[200px]">
                    सिंचाई: {crop.waterRequirements}
                  </span>
                  <span className="text-emerald-700 font-bold hover:underline">
                    पूरी जानकारी →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: CROP RECOMMENDATION ENGINE (Screen 13) */}
      {activeTab === 'recommendation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  कृषि अनुशंसा इंजन (Recommendation Engine)
                </h3>
                <p className="text-[10px] text-gray-500">
                  आपके स्थान ({location.district}), मौसम और पानी के आधार पर उपयुक्त फसलों की सिफारिश
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  मौसम (Season)
                </label>
                <select
                  value={recSeason}
                  onChange={(e) => setRecSeason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="rabi">रबी (अक्टूबर - मार्च)</option>
                  <option value="kharif">खरीफ (जून - अक्टूबर)</option>
                  <option value="zaid">जायद (मार्च - जून)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  पानी की उपलब्धता (Water Availability)
                </label>
                <select
                  value={recWater}
                  onChange={(e) => setRecWater(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="low">कम (सीमित 1-2 सिंचाई / बारिश आधारित)</option>
                  <option value="medium">मध्यम (बोरवेल / नहर - 3-5 सिंचाई)</option>
                  <option value="high">प्रचुर (नियमित भरपूर पानी / ड्रिप)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  खेत की मिट्टी का प्रकार (Soil Type)
                </label>
                <select
                  value={recSoilType}
                  onChange={(e) => setRecSoilType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="loamy">दोमट / बलुई दोमट (उत्तम जलनिकास)</option>
                  <option value="sandy">रेतीली / हल्की मिट्टी (कम पानी रोकने वाली)</option>
                  <option value="clay">चिकनी / मटियार मिट्टी (भारी मिट्टी)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunRecommendation}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>वैज्ञानिक अनुशंसा देखें (Get Recommendation)</span>
            </button>
          </div>

          {/* Results Display */}
          {recommendationResult && (
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs leading-relaxed animate-in fade-in">
              <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>आपके खेत के लिए सर्वोत्तम संभावित फसलें:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {recommendationResult.bestCrops.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCrop(c.nameEn);
                      setSelectedCropDetail(c);
                    }}
                    className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100/70 transition"
                  >
                    <span className="font-extrabold text-sm text-emerald-950 block font-serif">
                      {c.nameHi} ({c.nameEn})
                    </span>
                    <span className="text-[10px] text-emerald-800 block mt-0.5">
                      अवधि: {c.durationDays}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                      सक्रिय फसल चुनें →
                    </span>
                  </div>
                ))}
              </div>

              {/* Reasons */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-1">
                <h4 className="font-bold text-gray-800 text-xs">यह फसलें क्यों उपयुक्त हैं?</h4>
                <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-[11px]">
                  {recommendationResult.reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>महत्वपूर्ण जोखिम व सावधानियां:</span>
                </h4>
                <ul className="list-disc list-inside space-y-0.5 text-amber-950 text-[11px]">
                  {recommendationResult.risks.map((rk, idx) => (
                    <li key={idx}>{rk}</li>
                  ))}
                </ul>
              </div>

              {/* Missing Information Notice */}
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                <h4 className="font-bold text-blue-950">अधिक सटीक सिफारिश के लिए आवश्यक जानकारी:</h4>
                <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                  {recommendationResult.missingInfo.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Crop Detail Modal (10 Comprehensive Agronomic Fields) */}
      {selectedCropDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Wheat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedCropDetail.nameHi} ({selectedCropDetail.nameEn})
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {selectedCropDetail.suitableSeason} • {selectedCropDetail.durationDays}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCropDetail(null)}
                className="p-1 rounded-full text-emerald-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 10 required agricultural points */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed">
              {/* 1 & 2: Season & Temp */}
              <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 p-3 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px]">1. उपयुक्त मौसम:</span>
                  <span className="font-bold text-emerald-950">{selectedCropDetail.suitableSeason}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">2. तापमान दायरा:</span>
                  <span className="font-bold text-emerald-950">{selectedCropDetail.tempRange}</span>
                </div>
              </div>

              {/* 3 & 4: Soil & Water */}
              <div className="space-y-1.5">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-800 block text-[11px]">3. मिट्टी की आवश्यकता:</span>
                  <p className="text-gray-700 mt-0.5">{selectedCropDetail.soilRequirements}</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-800 block text-[11px]">4. पानी की आवश्यकता:</span>
                  <p className="text-gray-700 mt-0.5">{selectedCropDetail.waterRequirements}</p>
                </div>
              </div>

              {/* 5 & 6: Sowing period & Duration */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-800 block text-[11px]">5. बुवाई का समय:</span>
                  <p className="text-gray-700">{selectedCropDetail.sowingPeriod}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-[11px]">6. फसल अवधि:</span>
                  <p className="text-gray-700">{selectedCropDetail.durationDays}</p>
                </div>
              </div>

              {/* 7: Irrigation Stages */}
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-blue-950 block text-xs flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>7. महत्वपूर्ण सिंचाई अवस्थाएं:</span>
                </span>
                <div className="space-y-1.5">
                  {selectedCropDetail.irrigationStages.map((stg, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-xl text-[11px] shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-gray-800">
                        <span>{stg.stage}</span>
                        <span className="text-blue-700 text-[10px]">{stg.daysAfterSowing}</span>
                      </div>
                      <p className="text-gray-500 text-[10px] mt-0.5">{stg.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8: Pests & Diseases */}
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-2">
                <span className="font-bold text-amber-950 block text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>8. प्रमुख कीट एवं रोग प्रबंधन:</span>
                </span>
                <div className="space-y-1.5">
                  {selectedCropDetail.pestsAndDiseases.map((pd, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-xl text-[11px] shadow-2xs space-y-0.5">
                      <span className="font-bold text-amber-950 block">{pd.name}</span>
                      <p className="text-gray-600 text-[10px]">
                        <strong>लक्षण:</strong> {pd.symptoms}
                      </p>
                      <p className="text-emerald-800 text-[10px]">
                        <strong>रोकथाम:</strong> {pd.prevention}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9 & 10: Harvesting & Cultivation Guidance */}
              <div className="space-y-2">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-800 block text-[11px]">9. कटाई व गहाई:</span>
                  <p className="text-gray-700 mt-0.5">{selectedCropDetail.harvestingInfo}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-950 block text-[11px]">10. सामान्य कृषि सुझाव:</span>
                  <p className="text-gray-700 mt-0.5">{selectedCropDetail.generalGuidance}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedCrop(selectedCropDetail.nameEn);
                  setSelectedCropDetail(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-stone-900 shadow-xs hover:bg-amber-500 transition"
              >
                इसे मेरी सक्रिय फसल बनाएं
              </button>
              <button
                onClick={() => setSelectedCropDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
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
