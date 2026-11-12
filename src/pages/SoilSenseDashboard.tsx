import React, { useState } from 'react';
import { 
  FlaskConical, 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Camera, 
  Droplet, 
  History, 
  Plus, 
  Leaf 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SoilReportValues, SoilAIInterpretation } from '../types';
import { cacheService } from '../services/cacheService';

export const SoilSenseDashboard: React.FC = () => {
  const { t, location, currentUser } = useApp();

  // Mode: 'overview' | 'upload' | 'manual' | 'history'
  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'history'>('overview');

  // Form State
  const [plotName, setPlotName] = useState('खेत नंबर 1 (उत्तर दिशा)');
  const [ph, setPh] = useState('7.4');
  const [nitrogen, setNitrogen] = useState('240');
  const [phosphorus, setPhosphorus] = useState('18');
  const [potassium, setPotassium] = useState('290');
  const [organicCarbon, setOrganicCarbon] = useState('0.48');
  const [electricalConductivity, setElectricalConductivity] = useState('0.6');
  const [moisture, setMoisture] = useState<'dry' | 'low' | 'normal' | 'wet' | 'unknown'>('normal');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Interpretation Result State
  const [interpretation, setInterpretation] = useState<SoilAIInterpretation | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Report History from cache
  const [savedReports, setSavedReports] = useState<SoilReportValues[]>(() => {
    return cacheService.getRaw<SoilReportValues[]>(cacheService.KEYS.SOIL_REPORTS, [
      {
        id: 'sr_1',
        plotName: 'मुख्य खेत (बोरवेल वाला)',
        testDate: '2026-09-15',
        labName: 'जिला मृदा परीक्षण प्रयोगशाला, जयपुर',
        ph: 7.6,
        nitrogenKgHa: 220,
        phosphorusKgHa: 16,
        potassiumKgHa: 310,
        organicCarbonPercent: 0.42,
        electricalConductivityDsM: 0.7,
        moistureStatus: 'normal',
        sourceType: 'lab_report',
        verifiedByFarmer: true,
        createdAt: '2026-09-15T10:00:00Z',
      },
    ]);
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const payload: Partial<SoilReportValues> & { imageBase64?: string } = {
        plotName,
        ph: parseFloat(ph) || 7.0,
        nitrogenKgHa: parseFloat(nitrogen) || 250,
        phosphorusKgHa: parseFloat(phosphorus) || 15,
        potassiumKgHa: parseFloat(potassium) || 280,
        organicCarbonPercent: parseFloat(organicCarbon) || 0.5,
        electricalConductivityDsM: parseFloat(electricalConductivity) || 0.6,
        moistureStatus: moisture,
        sourceType: selectedFile ? 'lab_report' : 'manual_entry',
        imageBase64: filePreview || undefined,
      };

      const result = await api.interpretSoilReport(payload);
      setInterpretation(result);

      // Save to report history
      const newReport: SoilReportValues = {
        id: `sr_${Date.now()}`,
        farmerName: currentUser?.name || 'किसान',
        plotName,
        testDate: new Date().toISOString().split('T')[0],
        ph: parseFloat(ph),
        nitrogenKgHa: parseFloat(nitrogen),
        phosphorusKgHa: parseFloat(phosphorus),
        potassiumKgHa: parseFloat(potassium),
        organicCarbonPercent: parseFloat(organicCarbon),
        electricalConductivityDsM: parseFloat(electricalConductivity),
        moistureStatus: moisture,
        sourceType: selectedFile ? 'lab_report' : 'manual_entry',
        verifiedByFarmer: true,
        createdAt: new Date().toISOString(),
      };
      const updated = [newReport, ...savedReports];
      setSavedReports(updated);
      cacheService.setRaw(cacheService.KEYS.SOIL_REPORTS, updated);
      setActiveTab('overview');
    } catch (err) {
      console.error('Soil analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header with Scientific Principle Notice */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-800">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 font-serif">
                {t.soilSense} (SoilSense AI)
              </h2>
              <p className="text-xs text-gray-500">
                मृदा स्वास्थ्य कार्ड एवं प्रयोगशाला रिपोर्ट विश्लेषण
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'input' ? 'overview' : 'input')}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md transition active:scale-95"
          >
            {activeTab === 'input' ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{activeTab === 'input' ? 'रिपोर्ट देखें' : 'नई रिपोर्ट जोड़ें'}</span>
          </button>
        </div>

        {/* Scientific Rule Notice Banner (Mandatory as per prompt) */}
        <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>महत्वपूर्ण वैज्ञानिक नियम:</strong> मिट्टी की साधारण फोटो से NPK, pH या नमी की वास्तविक माप नहीं हो सकती। सही विश्लेषण के लिए सरकारी या अधिकृत मृदा परीक्षण प्रयोगशाला (Soil Lab) की रिपोर्ट अपलोड करें या उसके मान दर्ज करें।
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl text-xs font-bold text-gray-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-gray-900'
            }`}
          >
            स्वास्थ्य कार्ड सारांश
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'input' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-gray-900'
            }`}
          >
            रिपोर्ट दर्ज / अपलोड
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'history' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-gray-900'
            }`}
          >
            पिछली रिपोर्ट्स ({savedReports.length})
          </button>
        </div>
      </div>

      {/* 2. TAB: INPUT / UPLOAD (Screens 18, 20, 21) */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900">
            मृदा परीक्षण रिपोर्ट अपलोड या दर्ज करें
          </h3>

          {/* Plot Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              खेत / प्लाट का नाम (Farm Plot)
            </label>
            <input
              type="text"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              placeholder="उदा. बोरवेल वाला खेत, सड़क किनारे वाला खेत"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Upload Photo/PDF */}
          <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-4 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition cursor-pointer relative">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-emerald-900">
                {selectedFile ? selectedFile.name : 'लैब रिपोर्ट की फोटो या PDF चुनें'}
              </p>
              <p className="text-[10px] text-gray-500">
                Gemini AI रिपोर्ट से pH व NPK मान स्वतः पढ़ेगा और पुष्टि हेतु दिखाएगा।
              </p>
            </div>
          </div>

          {/* Farmer-Reported Soil Moisture Check (Mandatory Screen 21) */}
          <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-2">
            <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-blue-600" />
              <span>{t.soilMoistureQuestion}</span>
            </label>
            <p className="text-[10px] text-blue-800">
              यह केवल आपका प्रत्यक्ष अवलोकन (Observation) है, वैज्ञानिक लैब माप नहीं।
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
              {[
                { id: 'dry', label: 'बहुत सूखी' },
                { id: 'low', label: 'थोड़ी नमी' },
                { id: 'normal', label: 'सामान्य नमी' },
                { id: 'wet', label: 'बहुत गीली' },
                { id: 'unknown', label: 'पता नहीं' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMoisture(m.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                    moisture === m.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-blue-200 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fields (Screen 20) */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              प्रयोगशाला मान (Laboratory Values)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  pH मान (6.5 - 7.5 उत्तम)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  उपलब्ध नाइट्रोजन (N) kg/ha
                </label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  placeholder="उदा. 240"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  उपलब्ध फास्फोरस (P) kg/ha
                </label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  placeholder="उदा. 18"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  उपलब्ध पोटाश (K) kg/ha
                </label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  placeholder="उदा. 290"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  जैविक कार्बन (OC) %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(e.target.value)}
                  placeholder="उदा. 0.48"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  EC लवणता (dS/m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={electricalConductivity}
                  onChange={(e) => setElectricalConductivity(e.target.value)}
                  placeholder="उदा. 0.6"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>मृदा परीक्षण रिपोर्ट का विश्लेषण हो रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.analyzeReport} (SoilSense AI)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. TAB: OVERVIEW & AI INTERPRETATION (Screens 17 & 19) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Soil Health Score Hero Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                  वर्तमान मृदा स्वास्थ्य
                </span>
                <h3 className="text-xl font-extrabold font-serif mt-0.5">
                  {plotName}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  परीक्षण दिनांक: {new Date().toLocaleDateString('hi-IN')}
                </p>
              </div>

              <div className="text-right bg-emerald-950/50 p-3 rounded-2xl border border-emerald-600/40">
                <span className="text-[10px] text-emerald-300 block">स्वास्थ्य स्कोर</span>
                <span className="text-3xl font-black text-amber-300">
                  {interpretation?.soilHealthScore || 74}/100
                </span>
              </div>
            </div>

            {/* Quick Indicators Matrix */}
            <div className="mt-4 pt-4 border-t border-emerald-600/40 grid grid-cols-4 gap-1.5 text-center text-xs">
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-200 block">pH मान</span>
                <span className="font-extrabold text-white text-sm">{ph}</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-200 block">नाइट्रोजन</span>
                <span className="font-extrabold text-amber-300 text-sm">मध्यम</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-200 block">फास्फोरस</span>
                <span className="font-extrabold text-white text-sm">पर्याप्त</span>
              </div>
              <div className="bg-emerald-900/40 p-2 rounded-xl">
                <span className="text-[9px] text-emerald-200 block">जैविक कार्बन</span>
                <span className="font-extrabold text-amber-300 text-sm">{organicCarbon}%</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Detailed Explanation (Screen 19) */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3.5 text-xs leading-relaxed">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-gray-900">
                  SoilSense AI रिपोर्ट विश्लेषण
                </h4>
                <p className="text-[10px] text-gray-500">
                  ICAR एवं मृदा विज्ञान मानकों पर आधारित व्याख्या
                </p>
              </div>
            </div>

            {/* pH Summary */}
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
              <h5 className="font-bold text-emerald-900 text-xs">
                1. pH मान का क्या अर्थ है?
              </h5>
              <p className="mt-1 text-gray-700">
                {interpretation?.phSummary ||
                  `आपकी मिट्टी का pH ${ph} है। यह उदासीन से हल्का क्षारीय दायरा है, जिसमें सरसों, गेहूं, चना और बाजरा की फसलें अच्छा उत्पादन दे सकती हैं।`}
              </p>
            </div>

            {/* Suitable Crops */}
            <div className="bg-green-50/70 p-3 rounded-2xl border border-green-100">
              <h5 className="font-bold text-green-900 text-xs flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>2. इस मिट्टी के लिए उपयुक्त फसलें</span>
              </h5>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {(interpretation?.recommendedCrops || ['सरसों (Mustard)', 'गेहूं (Wheat)', 'चना (Gram)', 'बाजरा (Bajra)']).map(
                  (c, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-2.5 py-1 rounded-xl border border-green-200 text-green-800 font-bold text-xs shadow-xs"
                    >
                      {c}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Soil Improvement Tips */}
            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 space-y-1.5">
              <h5 className="font-bold text-amber-950 text-xs">
                3. जमीन सुधारने व उपजाऊ बनाने के उपाय:
              </h5>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {(interpretation?.soilImprovementTips || [
                  'प्रति बीघा 2-3 ट्रॉली अच्छी तरह सड़ी हुई गोबर की खाद (FYM) या वर्मीकम्पोस्ट डालें ताकि जैविक कार्बन (OC) बढ़े।',
                  'गर्मियों में गहरी जुताई करें ताकि सूर्य की तेज किरणों से मिट्टी के कीट और हानिकारक फंगस नष्ट हों।',
                  'लगातार एक ही फसल लेने के बजाय फसल चक्र में दलहनी फसलें (जैसे चना या मूंग) अवश्य लगाएं ताकि प्राकृतिक नाइट्रोजन स्थिर हो सके।',
                ]).map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Questions for KVK Expert */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-1.5">
              <h5 className="font-bold text-gray-800 text-xs flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. कृषि वैज्ञानिक से मिलने पर यह सवाल अवश्य पूछें:</span>
              </h5>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                {(interpretation?.questionsForKVKExpert || [
                  'क्या मेरी मिट्टी में सल्फर या जिंक की कमी को पूरा करने के लिए अलग से जिप्सम या जिंक सल्फेट डालना चाहिए?',
                  'मेरी चुनी हुई फसल के लिए डीएपी और यूरिया की संतुलित वैज्ञानिक खुराक क्या होगी?',
                ]).map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Mandatory Disclaimer */}
            <p className="text-[10px] text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200 font-medium">
              ⚠️ {interpretation?.disclaimer || t.disclaimerText}
            </p>
          </div>
        </div>
      )}

      {/* 4. TAB: HISTORY (Screen 17 sub-feature) */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900">
            सहेजी गई मृदा रिपोर्ट इतिहास
          </h3>
          {savedReports.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900">{r.plotName}</h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {r.testDate}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {r.labName || 'जिला मृदा परीक्षण प्रयोगशाला'}
              </p>
              <div className="grid grid-cols-4 gap-1.5 bg-gray-50 p-2 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-gray-400 block">pH</span>
                  <span className="font-bold text-gray-800">{r.ph}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">N</span>
                  <span className="font-bold text-gray-800">{r.nitrogenKgHa}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">P</span>
                  <span className="font-bold text-gray-800">{r.phosphorusKgHa}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">K</span>
                  <span className="font-bold text-gray-800">{r.potassiumKgHa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
