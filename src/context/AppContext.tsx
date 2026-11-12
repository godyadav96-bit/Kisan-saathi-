import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationInfo, UserProfile, CropInfo, FarmingArticle, NotificationItem } from '../types';
import { INITIAL_LOCATION, INITIAL_CROPS, INITIAL_ARTICLES } from '../data/mockData';
import { translations, SupportedLanguage, TranslationDictionary } from '../i18n/translations';
import { cacheService } from '../services/cacheService';
import { notificationService } from '../services/notificationService';

export type ActiveScreen = 
  | 'home' 
  | 'mausam' 
  | 'mandi' 
  | 'soilsense' 
  | 'profile' 
  | 'crops' 
  | 'calculator' 
  | 'library' 
  | 'admin' 
  | 'marketplace';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedArticle: FarmingArticle | null;
  setSelectedArticle: (art: FarmingArticle | null) => void;
  selectedCropDetail: CropInfo | null;
  setSelectedCropDetail: (crop: CropInfo | null) => void;
  isOnline: boolean;
  refreshKey: number;
  triggerManualRefresh: () => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  cropsList: CropInfo[];
  setCropsList: React.Dispatch<React.SetStateAction<CropInfo[]>>;
  articlesList: FarmingArticle[];
  setArticlesList: React.Dispatch<React.SetStateAction<FarmingArticle[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  unreadNotificationCount: number;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language initialization (default 'hi')
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return cacheService.getRaw<SupportedLanguage>(cacheService.KEYS.LANGUAGE, 'hi');
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    cacheService.setRaw(cacheService.KEYS.LANGUAGE, lang);
  };

  const t = translations[language] || translations.hi;

  // Location initialization
  const [location, setLocationState] = useState<LocationInfo>(() => {
    return cacheService.getRaw<LocationInfo>(cacheService.KEYS.LOCATION, INITIAL_LOCATION);
  });

  const setLocation = (loc: LocationInfo) => {
    setLocationState(loc);
    cacheService.setRaw(cacheService.KEYS.LOCATION, loc);
  };

  // Demo mode toggle
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    return cacheService.getRaw<boolean>(cacheService.KEYS.MODE, false);
  });

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    cacheService.setRaw(cacheService.KEYS.MODE, val);
  };

  // Active crop for advisory
  const [selectedCrop, setSelectedCropState] = useState<string>(() => {
    return cacheService.getRaw<string>(cacheService.KEYS.ACTIVE_CROP, 'Mustard');
  });

  const setSelectedCrop = (crop: string) => {
    setSelectedCropState(crop);
    cacheService.setRaw(cacheService.KEYS.ACTIVE_CROP, crop);
  };

  // User Profile
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const saved = cacheService.getRaw<UserProfile | null>(cacheService.KEYS.USER_PROFILE, null);
    if (saved) return saved;
    // Default initial guest farmer
    return {
      id: 'farmer_default',
      name: 'रामेश्वर शर्मा',
      phone: '9876543210',
      state: 'Rajasthan',
      district: 'Jaipur',
      tehsil: 'Sanganer',
      village: 'Muhana',
      landSizeBigha: 8,
      primaryCrops: ['सरसों', 'गेहूं', 'बाजरा'],
      preferredMandi: 'Muhana Mandi',
      role: 'farmer',
      createdAt: new Date().toISOString(),
      isDemoUser: true,
    };
  });

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    cacheService.setRaw(cacheService.KEYS.USER_PROFILE, user);
  };

  // Navigation state
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedArticle, setSelectedArticle] = useState<FarmingArticle | null>(null);
  const [selectedCropDetail, setSelectedCropDetail] = useState<CropInfo | null>(null);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return notificationService.getNotifications();
  });

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Master Lists (with offline cache fallback)
  const [cropsList, setCropsList] = useState<CropInfo[]>(() => {
    const cached = cacheService.getRaw<CropInfo[]>(cacheService.KEYS.CROPS, INITIAL_CROPS);
    return cached.length > 0 ? cached : INITIAL_CROPS;
  });

  const [articlesList, setArticlesList] = useState<FarmingArticle[]>(() => {
    const cached = cacheService.getRaw<FarmingArticle[]>(cacheService.KEYS.ARTICLES, INITIAL_ARTICLES);
    return cached.length > 0 ? cached : INITIAL_ARTICLES;
  });

  // Online / Offline tracking
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Manual refresh trigger
  const [refreshKey, setRefreshKey] = useState(1);
  const triggerManualRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setNotifications(notificationService.getNotifications());
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        location,
        setLocation,
        isDemoMode,
        setIsDemoMode,
        selectedCrop,
        setSelectedCrop,
        currentUser,
        setCurrentUser,
        activeScreen,
        setActiveScreen,
        selectedArticle,
        setSelectedArticle,
        selectedCropDetail,
        setSelectedCropDetail,
        isOnline,
        refreshKey,
        triggerManualRefresh,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isChatOpen,
        setIsChatOpen,
        cropsList,
        setCropsList,
        articlesList,
        setArticlesList,
        notifications,
        setNotifications,
        unreadNotificationCount,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
