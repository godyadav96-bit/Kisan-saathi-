import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Settings, 
  Wheat, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  MapPin, 
  Activity, 
  Users, 
  Plus, 
  Save, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sliders,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CropInfo, FarmingArticle, MandiPriceRecord, AdminSettings } from '../types';

export const AdminDashboard: React.FC = () => {
  const { t, setActiveScreen, cropsList, setCropsList, articlesList, setArticlesList } = useApp();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kisan_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Sub-tabs (Screens 28-34)
  const [adminTab, setAdminTab] = useState<
    'analytics' | 'crops' | 'mandi' | 'content' | 'ai' | 'features' | 'settings'
  >('analytics');

  // Overview stats & settings
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Forms
  const [newCropNameHi, setNewCropNameHi] = useState('');
  const [newCropNameEn, setNewCropNameEn] = useState('');
  const [newCropCategory, setNewCropCategory] = useState<'rabi' | 'kharif' | 'zaid'>('rabi');
  const [newCropSeason, setNewCropSeason] = useState('रबी');
  const [newCropDuration, setNewCropDuration] = useState('110-120 दिन');
  const [newCropGuidance, setNewCropGuidance] = useState('');

  // New Article Form
  const [newArtTitleHi, setNewArtTitleHi] = useState('');
  const [newArtCategory, setNewArtCategory] = useState<any>('irrigation');
  const [newArtSummary, setNewArtSummary] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtSource, setNewArtSource] = useState('ICAR / KVK अनुसंधान');

  // Change PIN
  const [newOwnerPin, setNewOwnerPin] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadOverview();
    }
  }, [isAuthenticated]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOverview();
      setStats(data.stats);
      setSettings(data.settings);
      setAuditLogs(data.auditLogs || []);
    } catch (e) {
      console.error('Admin overview failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.adminLogin(pinInput);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('kisan_admin_auth', 'true');
      } else {
        setAuthError(res.error || 'अमान्य पिन दर्ज किया गया।');
      }
    } catch {
      setAuthError('सर्वर से संपर्क नहीं हो सका।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kisan_admin_auth');
  };

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropNameHi || !newCropNameEn) return;

    const newCrop: Partial<CropInfo> = {
      id: `crop_${Date.now()}`,
      nameHi: newCropNameHi,
      nameEn: newCropNameEn,
      category: newCropCategory,
      suitableSeason: newCropSeason,
      durationDays: newCropDuration,
      tempRange: '15°C - 28°C',
      soilRequirements: 'दोमट या बलुई दोमट मिट्टी',
      waterRequirements: 'मध्यम',
      sowingPeriod: 'अक्टूबर से नवंबर',
      irrigationStages: [{ stage: 'पहली सिंचाई', daysAfterSowing: '25 दिन', note: 'अति आवश्यक' }],
      pestsAndDiseases: [{ name: 'कीट', symptoms: 'पत्तियों का नुकसान', prevention: 'नीम तेल स्प्रे' }],
      harvestingInfo: 'फसल पकने पर कटाई करें।',
      generalGuidance: newCropGuidance || 'उन्नत बीजों का उपयोग करें।',
      iconName: 'Wheat',
      colorScheme: 'green',
      isActive: true,
    };

    const res = await api.saveCrop(newCrop);
    if (res.success) {
      setCropsList((prev) => [res.crop, ...prev]);
      setNewCropNameHi('');
      setNewCropNameEn('');
      setNewCropGuidance('');
      setSaveMessage('नई फसल सफलतापूर्वक जोड़ी गई!');
      setTimeout(() => setSaveMessage(''), 2500);
      loadOverview();
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitleHi || !newArtSummary) return;

    const newArt: Partial<FarmingArticle> = {
      id: `art_${Date.now()}`,
      titleHi: newArtTitleHi,
      titleEn: newArtTitleHi,
      category: newArtCategory,
      summary: newArtSummary,
      content: newArtContent,
      source: newArtSource,
      lastReviewed: new Date().toISOString().split('T')[0],
      tags: ['नवीन लेख', 'कृषि ज्ञान'],
      isVerified: true,
    };

    const res = await api.saveArticle(newArt);
    if (res.success) {
      setArticlesList((prev) => [res.article, ...prev]);
      setNewArtTitleHi('');
      setNewArtSummary('');
      setNewArtContent('');
      setSaveMessage('नया कृषि लेख सफलतापूर्वक प्रकाशित हुआ!');
      setTimeout(() => setSaveMessage(''), 2500);
      loadOverview();
    }
  };

  const handleUpdateSettings = async (updates: Partial<AdminSettings> & { newOwnerPin?: string }) => {
    const res = await api.updateAdminSettings(updates);
    if (res.success) {
      setSettings(res.settings);
      setSaveMessage('सेटिंग्स सफलतापूर्वक अपडेट की गईं!');
      setTimeout(() => setSaveMessage(''), 2500);
      loadOverview();
    }
  };

  // If Not Authenticated, show Owner Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl space-y-5 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-gray-900 font-serif">
              संस्थापक व मालिक नियंत्रण
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Kisan Saathi Admin Panel • केवल अधिकृत व्यक्ति हेतु
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                मालिक गुप्त पिन (Admin Security PIN)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="डिफ़ॉल्ट पिन: 123456"
                  className="w-full bg-gray-50 border border-gray-300 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-98"
            >
              डैशबोर्ड में प्रवेश करें (Unlock)
            </button>
          </form>

          <p className="text-[11px] text-gray-400">
            * पहली बार संस्थापक लॉगिन के लिए डिफ़ॉल्ट पिन <strong className="text-gray-700">123456</strong> का प्रयोग करें। भीतर जाकर आप पिन बदल सकते हैं।
          </p>

          <button
            onClick={() => setActiveScreen('home')}
            className="text-xs font-bold text-emerald-700 hover:underline block mx-auto"
          >
            ← किसान ऐप में वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Admin Top Nav */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-400 text-emerald-950 rounded-2xl font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-serif">
              मालिक नियंत्रण कक्ष (Owner Dashboard)
            </h2>
            <p className="text-xs text-emerald-200">
              Kisan Saathi Management & Real-time Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('home')}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
          >
            ऐप देखें
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
          >
            लॉगआउट
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 2. Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {[
          { id: 'analytics', label: '1. एनालिटिक्स व स्वास्थ्य' },
          { id: 'crops', label: '2. फसल प्रबंधन (Crops)' },
          { id: 'mandi', label: '3. मंडी व भाव प्रबंधन' },
          { id: 'content', label: '4. कृषि ज्ञान पुस्तकालय' },
          { id: 'ai', label: '5. AI व Gemini सेटिंग्स' },
          { id: 'features', label: '6. फीचर टॉगल (Modules)' },
          { id: 'settings', label: '7. सामान्य सेटिंग्स व पिन' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-3 py-2 rounded-2xl whitespace-nowrap transition ${
              adminTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-emerald-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SUB-SCREEN: ANALYTICS (Screen 28) */}
      {adminTab === 'analytics' && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">कुल किसान</span>
              <span className="text-2xl font-black text-emerald-900">{stats.totalUsers}</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">आज सक्रिय</span>
              <span className="text-2xl font-black text-amber-600">{stats.activeUsersToday}</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">कुल फसलें</span>
              <span className="text-2xl font-black text-emerald-800">{stats.totalCrops}</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">मंडी रिकॉर्ड्स</span>
              <span className="text-2xl font-black text-blue-700">{stats.totalMandiRecords}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm">एपीआई एवं सेवा स्वास्थ्य (API Health)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Gemini AI स्थिति</span>
                  <span className="text-[10px] text-emerald-700">{stats.geminiStatus}</span>
                </div>
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-950 block">मौसम प्रदाता</span>
                  <span className="text-[10px] text-blue-700">Open-Meteo Global Engine (सक्रिय)</span>
                </div>
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-2 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm">ऑडिट लॉग्स (System Audit Logs)</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-emerald-800">[{log.action}]</span> {log.details}
                  </div>
                  <span className="text-gray-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString('hi-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-SCREEN: CROP MANAGEMENT (Screen 29) */}
      {adminTab === 'crops' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>नई फसल जोड़ें (Add New Crop)</span>
            </h3>
            <form onSubmit={handleSaveCrop} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">फसल का नाम (हिंदी) *</label>
                  <input
                    type="text"
                    value={newCropNameHi}
                    onChange={(e) => setNewCropNameHi(e.target.value)}
                    placeholder="उदा. जीरा, इसबगोल"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Crop Name (English) *</label>
                  <input
                    type="text"
                    value={newCropNameEn}
                    onChange={(e) => setNewCropNameEn(e.target.value)}
                    placeholder="e.g. Cumin, Isabgol"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={newCropCategory}
                    onChange={(e) => setNewCropCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="rabi">रबी (Rabi)</option>
                    <option value="kharif">खरीफ (Kharif)</option>
                    <option value="zaid">जायद (Zaid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">सामान्य कृषि सलाह / उन्नत किस्में</label>
                <input
                  type="text"
                  value={newCropGuidance}
                  onChange={(e) => setNewCropGuidance(e.target.value)}
                  placeholder="उन्नत किस्में, बीजोपचार व खाद की जानकारी"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition active:scale-95"
              >
                फसल सुरक्षित करें
              </button>
            </form>
          </div>

          {/* Current Crops Table */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm">वर्तमान फसलें ({cropsList.length})</h3>
            <div className="space-y-2">
              {cropsList.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{c.nameHi} ({c.nameEn})</h4>
                    <p className="text-[10px] text-gray-500">{c.suitableSeason} • {c.durationDays}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    सक्रिय (Active)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-SCREEN: CONTENT / KNOWLEDGE MANAGEMENT (Screen 32) */}
      {adminTab === 'content' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>नया कृषि लेख प्रकाशित करें</span>
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">लेख शीर्षक *</label>
                <input
                  type="text"
                  value={newArtTitleHi}
                  onChange={(e) => setNewArtTitleHi(e.target.value)}
                  placeholder="उदा. पाला (Frost) से फसलों को बचाने के उपाय"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">श्रेणी</label>
                  <select
                    value={newArtCategory}
                    onChange={(e) => setNewArtCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="irrigation">सिंचाई</option>
                    <option value="pests">कीट व रोग</option>
                    <option value="soil">मिट्टी</option>
                    <option value="fertilizer">खाद व पोषण</option>
                    <option value="schemes">सरकारी योजना</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">अनुसंधान स्रोत</label>
                  <input
                    type="text"
                    value={newArtSource}
                    onChange={(e) => setNewArtSource(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">संक्षिप्त सारांश *</label>
                <input
                  type="text"
                  value={newArtSummary}
                  onChange={(e) => setNewArtSummary(e.target.value)}
                  placeholder="2 वाक्यों में मुख्य सलाह"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">विस्तृत विवरण</label>
                <textarea
                  rows={4}
                  value={newArtContent}
                  onChange={(e) => setNewArtContent(e.target.value)}
                  placeholder="कदम-दर-कदम वैज्ञानिक मार्गदर्शन..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition active:scale-95"
              >
                लेख प्रकाशित करें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. SUB-SCREEN: MANDI & WEATHER MANAGEMENT (Screen 31) */}
      {adminTab === 'mandi' && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-gray-900 text-sm">मंडी व मौसम स्रोत सेटिंग्स</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">मंडी डेटा प्रदाता</label>
              <select
                value={settings?.mandiDataSource || 'agmarknet'}
                onChange={(e) => handleUpdateSettings({ mandiDataSource: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="agmarknet">AGMARKNET (भारत सरकार कृषि मंत्रालय)</option>
                <option value="enam">e-NAM राष्ट्रीय कृषि बाजार</option>
                <option value="demo">डेमो डेटा इंजन</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">मौसम प्रदाता</label>
              <select
                value={settings?.weatherProvider || 'open_meteo'}
                onChange={(e) => handleUpdateSettings({ weatherProvider: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="open_meteo">Open-Meteo High Resolution API (Free / Live)</option>
                <option value="imd">IMD Mausam Portal (Aligned)</option>
                <option value="demo">डेमो मौसम डेटा</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 7. SUB-SCREEN: AI CONFIGURATION (Screen 33) */}
      {adminTab === 'ai' && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-gray-900 text-sm">Gemini AI कॉन्फ़िगरेशन</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-950 block">सक्रिय मॉडल:</span>
              <span className="text-emerald-800">gemini-3.8-flash (Recommended server-side)</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">प्रति उपयोगकर्ता दैनिक AI सीमा</label>
              <input
                type="number"
                value={settings?.aiDailyLimit || 25}
                onChange={(e) => handleUpdateSettings({ aiDailyLimit: parseInt(e.target.value) || 20 })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. SUB-SCREEN: FEATURE FLAGS (Screen 34) */}
      {adminTab === 'features' && settings && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-gray-900 text-sm">भावी मॉड्यूल्स एवं फीचर टॉगल</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">किसान बाजार (Marketplace)</h4>
                <p className="text-[10px] text-gray-500">किसानों और खरीदारों के बीच सीधा व्यापार</p>
              </div>
              <button
                onClick={() => handleUpdateSettings({ isMarketplaceEnabled: !settings.isMarketplaceEnabled })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                  settings.isMarketplaceEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.isMarketplaceEnabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">प्रीमियम सदस्यता (Subscription)</h4>
                <p className="text-[10px] text-gray-500">उन्नत मूल्य विश्लेषण व एसएमएस अलर्ट</p>
              </div>
              <button
                onClick={() => handleUpdateSettings({ isSubscriptionEnabled: !settings.isSubscriptionEnabled })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                  settings.isSubscriptionEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.isSubscriptionEnabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. SUB-SCREEN: SETTINGS & OWNER PIN CHANGE */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-gray-900 text-sm">मालिक गुप्त पिन बदलें (Change Owner PIN)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">नया 6-अंकीय पिन दर्ज करें</label>
              <input
                type="password"
                maxLength={6}
                value={newOwnerPin}
                onChange={(e) => setNewOwnerPin(e.target.value)}
                placeholder="उदा. 789456"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <button
              onClick={() => {
                if (newOwnerPin.length >= 4) {
                  handleUpdateSettings({ newOwnerPin });
                  setNewOwnerPin('');
                }
              }}
              disabled={newOwnerPin.length < 4}
              className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md"
            >
              पिन अपडेट करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
