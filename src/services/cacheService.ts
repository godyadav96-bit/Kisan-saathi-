export interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
  dateFormatted: string;
  isCached: boolean;
  source: string;
}

const CACHE_KEYS = {
  WEATHER: 'kisan_weather_cache',
  MANDI: 'kisan_mandi_cache',
  CROPS: 'kisan_crops_cache',
  ARTICLES: 'kisan_articles_cache',
  SOIL_REPORTS: 'kisan_soil_reports_cache',
  EXPENSES: 'kisan_expenses_cache',
  LOCATION: 'kisan_location_cache',
  USER_PROFILE: 'kisan_user_profile',
  LANGUAGE: 'kisan_language_pref',
  MODE: 'kisan_app_mode', // 'real' | 'demo'
  ACTIVE_CROP: 'kisan_active_crop',
};

export const cacheService = {
  KEYS: CACHE_KEYS,

  set<T>(key: string, data: T, source: string = 'Local Offline Cache'): void {
    try {
      const envelope: CacheEnvelope<T> = {
        data,
        timestamp: Date.now(),
        dateFormatted: new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' }),
        isCached: true,
        source,
      };
      localStorage.setItem(key, JSON.stringify(envelope));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  get<T>(key: string, maxAgeMs: number = 24 * 60 * 60 * 1000): CacheEnvelope<T> | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      const envelope: CacheEnvelope<T> = JSON.parse(itemStr);
      const isExpired = Date.now() - envelope.timestamp > maxAgeMs;
      return {
        ...envelope,
        isCached: true,
      };
    } catch (e) {
      return null;
    }
  },

  getRaw<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setRaw<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
