import React, { useState } from 'react';
import { MapPin, Globe, RefreshCw, ShieldCheck, Sparkles, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { SupportedLanguage } from '../i18n/translations';

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    location,
    setIsLocationModalOpen,
    isDemoMode,
    setIsDemoMode,
    triggerManualRefresh,
    setActiveScreen,
    currentUser,
    setIsAuthModalOpen,
    setIsNotificationModalOpen,
    unreadNotificationCount,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerManualRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-40">
      {/* Top Utility Bar: Mode Badge & Quick Info */}
      <div className="bg-emerald-950/70 px-3 py-1 text-[11px] flex items-center justify-between border-b border-emerald-700/40">
        <div className="flex items-center gap-2">
          {/* Mode Badge & Switcher */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition ${
              isDemoMode
                ? 'bg-amber-500 text-amber-950 font-bold'
                : 'bg-emerald-600/80 text-emerald-100 hover:bg-emerald-600'
            }`}
            title="क्लिक करके मोड बदलें"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-950' : 'bg-emerald-300'}`} />
            {isDemoMode ? t.demoMode : t.realMode}
          </button>
          {isDemoMode && (
            <span className="text-amber-300 hidden sm:inline text-[10px]">
              (नमूना डेटा सक्रिय)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Install Trigger */}
          <PWAInstallButton />

          {/* Owner / Admin Shortcut */}
          <button
            onClick={() => setActiveScreen('admin')}
            className="flex items-center gap-1 text-emerald-200 hover:text-white px-2 py-0.5 rounded transition"
            title="मालिक डैशबोर्ड"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and App Title */}
        <div
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 flex items-center justify-center shadow-md p-1 group-hover:scale-105 transition-transform">
            <img src="/icon.svg" alt="Kisan Saathi" className="w-8 h-8 drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-white font-serif">
                {t.appName}
              </h1>
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.2 rounded-sm shadow-xs uppercase">
                AI
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium hidden xs:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right actions: Location, Refresh, Language, Profile */}
        <div className="flex items-center gap-1.5">
          {/* Location Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-600 transition active:scale-95 max-w-[130px] sm:max-w-none truncate"
            title={t.changeLocation}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">
              {location.village ? `${location.village}, ` : ''}{location.district}
            </span>
          </button>

          {/* Notification Center Trigger */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="p-1.5 bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg transition relative border border-emerald-600 active:scale-95"
            title="सूचनाएं (Notifications)"
            aria-label="कृषि सूचनाएं"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Refresh Data */}
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg transition"
            title={t.refreshData}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg text-xs font-bold border border-emerald-600 transition"
              title={t.languageSelect}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'हिं' : 'EN'}</span>
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 z-40 py-1.5 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t.languageSelect}
                  </div>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'hi' ? 'text-emerald-700 font-bold bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>{t.hindi}</span>
                    {language === 'hi' && <span className="text-emerald-600">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'en' ? 'text-emerald-700 font-bold bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>{t.english}</span>
                    {language === 'en' && <span className="text-emerald-600">✓</span>}
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    disabled
                    className="w-full text-left px-3 py-1.5 text-gray-400 italic text-[11px] cursor-not-allowed flex items-center justify-between"
                  >
                    <span>राजस्थानी (शीघ्र)</span>
                    <span className="text-[10px] bg-gray-100 px-1 rounded">Soon</span>
                  </button>
                  <button
                    disabled
                    className="w-full text-left px-3 py-1.5 text-gray-400 italic text-[11px] cursor-not-allowed flex items-center justify-between"
                  >
                    <span>ਪੰਜਾਬੀ (ਜਲਦੀ)</span>
                    <span className="text-[10px] bg-gray-100 px-1 rounded">Soon</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
