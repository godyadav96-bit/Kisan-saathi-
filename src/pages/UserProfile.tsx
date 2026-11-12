import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  MapPin, 
  Wheat, 
  ShieldCheck, 
  Globe, 
  LogOut, 
  Save, 
  Smartphone, 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  Bell,
  BellRing,
  CloudRain,
  TrendingUp,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cacheService } from '../services/cacheService';
import { notificationService } from '../services/notificationService';
import { NotificationPreferences } from '../types';

export const UserProfile: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    currentUser,
    setCurrentUser,
    location,
    setIsLocationModalOpen,
    isDemoMode,
    setIsDemoMode,
    setActiveScreen,
    triggerManualRefresh,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || 'रामेश्वर शर्मा');
  const [phone, setPhone] = useState(currentUser?.phone || '9876543210');
  const [landSize, setLandSize] = useState(currentUser?.landSizeBigha?.toString() || '8');
  const [cropsStr, setCropsStr] = useState((currentUser?.primaryCrops || ['सरसों', 'गेहूं', 'बाजरा']).join(', '));
  const [preferredMandi, setPreferredMandi] = useState(currentUser?.preferredMandi || 'Muhana Mandi');

  const [savedNotice, setSavedNotice] = useState(false);
  const [cacheClearedNotice, setCacheClearedNotice] = useState(false);

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(() => {
    return notificationService.getPreferences();
  });
  const [testPushSent, setTestPushSent] = useState(false);

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    notificationService.savePreferences(updated);
  };

  const handleEnableBrowserPush = async () => {
    const granted = await notificationService.requestPermission();
    setNotifPrefs(notificationService.getPreferences());
  };

  const handleSendTestPush = () => {
    notificationService.triggerNativeNotification({
      title: '🌾 किसान साथी अलर्ट सक्रिय!',
      message: 'मौसम, मंडी भाव और नई फसल सलाह के अलर्ट आपको सही समय पर प्राप्त होंगे।',
    });
    setTestPushSent(true);
    setTimeout(() => setTestPushSent(false), 2500);
  };

  const handleSaveProfile = () => {
    const updated = {
      ...(currentUser || {}),
      id: currentUser?.id || 'usr_saved',
      name,
      phone,
      state: location.state,
      district: location.district,
      tehsil: location.tehsil,
      village: location.village,
      landSizeBigha: parseFloat(landSize) || 0,
      primaryCrops: cropsStr.split(',').map((s: string) => s.trim()).filter(Boolean),
      preferredMandi,
      role: currentUser?.role || 'farmer',
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      isDemoUser: false,
    };
    setCurrentUser(updated as any);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleClearCache = () => {
    localStorage.clear();
    setCacheClearedNotice(true);
    triggerManualRefresh();
    setTimeout(() => {
      setCacheClearedNotice(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Profile Hero Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xl shadow-md font-serif">
            {name ? name.charAt(0) : 'क'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold">{name}</h2>
              <span className="bg-emerald-900/60 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                किसान
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              +91 {phone} • {location.village}, {location.district}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-600/40 text-xs">
          <div className="bg-emerald-900/40 p-2 rounded-xl">
            <span className="text-[10px] text-emerald-200 block">कुल कृषि भूमि</span>
            <span className="font-bold text-white text-sm">{landSize} बीघा</span>
          </div>
          <div className="bg-emerald-900/40 p-2 rounded-xl">
            <span className="text-[10px] text-emerald-200 block">पसंदीदा मंडी</span>
            <span className="font-bold text-white text-sm truncate block">{preferredMandi}</span>
          </div>
        </div>
      </div>

      {/* 2. Edit Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-600" />
          <span>मेरी किसान प्रोफाइल (Farmer Details)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              {t.farmerName} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              {t.mobileNumber} *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              जमीन (बीघा / एकड़)
            </label>
            <input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              पसंदीदा मंडी
            </label>
            <input
              type="text"
              value={preferredMandi}
              onChange={(e) => setPreferredMandi(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              मुख्य फसलें (कॉमा लगाकर लिखें)
            </label>
            <input
              type="text"
              value={cropsStr}
              onChange={(e) => setCropsStr(e.target.value)}
              placeholder="सरसों, गेहूं, बाजरा"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>प्रोफाइल सहेजें</span>
        </button>

        {savedNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>आपकी जानकारी सुरक्षित कर ली गई है।</span>
          </div>
        )}
      </div>

      {/* 3. Settings Card (Screen 27) */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>ऐप सेटिंग्स (App Settings)</span>
        </h3>

        {/* Operating Mode Selector */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">डेटा ऑपरेटिंग मोड</h4>
            <p className="text-[10px] text-gray-500">
              {isDemoMode ? 'वर्तमान में डेमो नमूना डेटा सक्रिय है' : 'वर्तमान में लाइव सरकारी व उपग्रह डेटा सक्रिय है'}
            </p>
          </div>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              isDemoMode
                ? 'bg-amber-400 text-amber-950 font-black'
                : 'bg-emerald-700 text-white font-bold'
            }`}
          >
            {isDemoMode ? 'डेमो मोड' : 'रियल मोड'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">भाषा (Language)</h4>
            <p className="text-[10px] text-gray-500">
              हिंदी (डिफ़ॉल्ट) या अंग्रेजी चुनें
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none"
          >
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English (अंग्रेजी)</option>
          </select>
        </div>

        {/* Offline Cache Reset */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <h4 className="font-bold text-gray-900 text-xs">ऑफ़लाइन कैशे (Offline Cache)</h4>
            <p className="text-[10px] text-gray-500">
              मौसम, भाव व लेखों का स्थानीय सहेजा गया डेटा साफ़ करें
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>कैशे हटाएं</span>
          </button>
        </div>

        {cacheClearedNotice && (
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900 font-bold text-xs">
            कैशे साफ़ कर दिया गया है। ऐप पुनः लोड हो रही है...
          </div>
        )}

        {/* Owner Dashboard Access */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{t.adminPanel}</span>
            </h4>
            <p className="text-[10px] text-emerald-800">
              संस्थापक व मालिक नियंत्रण कक्ष (फसलें, मंडियां, सेटिंग्स)
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('admin')}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition"
          >
            प्रवेश करें
          </button>
        </div>
      </div>

      {/* 4. Notification Preferences Card */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span>सूचना एवं अलर्ट प्राथमिकताएं (Alert Preferences)</span>
        </h3>

        <div className="space-y-2.5">
          {/* Weather Alerts Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">मौसम चेतावनी अलर्ट (Weather Updates)</h4>
                <p className="text-[10px] text-gray-500">बारिश, तेज आंधी, ओलावृष्टि व पाला पड़ने के अलर्ट</p>
              </div>
            </div>
            <button
              onClick={() => handleTogglePref('weatherAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                notifPrefs.weatherAlerts ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Mandi Alerts Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">मंडी भाव अलर्ट (Mandi Price Changes)</h4>
                <p className="text-[10px] text-gray-500">चुनी हुई फसलों में भाव तेजी या मंदी होने पर सूचना</p>
              </div>
            </div>
            <button
              onClick={() => handleTogglePref('mandiPriceAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                notifPrefs.mandiPriceAlerts ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Advisory Alerts Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Wheat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">नई कृषि सलाह (Crop Advisory & Schemes)</h4>
                <p className="text-[10px] text-gray-500">फसल विकास अवस्था, कीट नियंत्रण व सरकारी योजनाएं</p>
              </div>
            </div>
            <button
              onClick={() => handleTogglePref('cropAdvisoryAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                notifPrefs.cropAdvisoryAlerts ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Browser Push Permission Toggle */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-emerald-700" />
                <span>फोन / सिस्टम पुश नोटिफिकेशन</span>
              </h4>
              <p className="text-[10px] text-emerald-800">
                {notificationService.getPermissionStatus() === 'granted'
                  ? '✓ ब्राउज़र पुश नोटिफिकेशन सक्रिय है'
                  : 'पुश नोटिफिकेशन के लिए ब्राउज़र अनुमति आवश्यक है'}
              </p>
            </div>

            {notificationService.getPermissionStatus() === 'granted' ? (
              <button
                onClick={handleSendTestPush}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-emerald-800 transition active:scale-95"
              >
                <Send className="w-3 h-3" />
                <span>{testPushSent ? 'भेजा गया!' : 'टेस्ट करें'}</span>
              </button>
            ) : (
              <button
                onClick={handleEnableBrowserPush}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-xs shadow-xs transition active:scale-95"
              >
                अनुमति दें
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
