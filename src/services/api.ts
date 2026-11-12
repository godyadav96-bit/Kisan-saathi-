import { WeatherData, MandiPriceRecord, SellDecisionAdvice, MausamSalah, SoilAIInterpretation, SoilReportValues, CropInfo, FarmingArticle, LocationInfo } from '../types';
import { cacheService } from './cacheService';

export const api = {
  // Weather with offline cache support
  async getWeather(lat: number, lon: number, district: string, isDemo: boolean = false): Promise<{ data: WeatherData; isFromCache: boolean; cacheTime?: string }> {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&district=${encodeURIComponent(district)}&demo=${isDemo}`);
      if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
      const data: WeatherData = await res.json();
      // Cache this fresh weather data
      cacheService.set(cacheService.KEYS.WEATHER, data, data.provider || 'Open-Meteo Live');
      return { data, isFromCache: false };
    } catch (err) {
      console.warn('Weather network request failed, checking offline cache...', err);
      const cached = cacheService.get<WeatherData>(cacheService.KEYS.WEATHER);
      if (cached) {
        return {
          data: {
            ...cached.data,
            provider: `${cached.data.provider} (ऑफ़लाइन सहेजा गया)`,
            current: {
              ...cached.data.current,
              isObserved: false,
              summary: `${cached.data.current.summary} [ऑफ़लाइन कैश्ड डेटा: ${cached.dateFormatted}]`,
            },
          },
          isFromCache: true,
          cacheTime: cached.dateFormatted,
        };
      }
      throw err;
    }
  },

  // Mandi prices with offline cache support
  async getMandiPrices(district?: string, commodity?: string, search?: string, isDemo: boolean = false): Promise<{ data: MandiPriceRecord[]; isFromCache: boolean; cacheTime?: string; sourceName: string }> {
    try {
      const params = new URLSearchParams();
      if (district) params.append('district', district);
      if (commodity) params.append('commodity', commodity);
      if (search) params.append('search', search);
      if (isDemo) params.append('demo', 'true');

      const res = await fetch(`/api/mandi?${params.toString()}`);
      if (!res.ok) throw new Error(`Mandi fetch failed: ${res.status}`);
      const json = await res.json();
      
      // Save full list to cache
      if (!district && !commodity && !search) {
        cacheService.set(cacheService.KEYS.MANDI, json.data, json.sourceName);
      }
      return { data: json.data, isFromCache: false, sourceName: json.sourceName };
    } catch (err) {
      console.warn('Mandi network request failed, checking offline cache...', err);
      const cached = cacheService.get<MandiPriceRecord[]>(cacheService.KEYS.MANDI);
      if (cached && cached.data) {
        let filtered = cached.data;
        if (district && district !== 'all') {
          filtered = filtered.filter(m => m.district.toLowerCase() === district.toLowerCase());
        }
        if (commodity && commodity !== 'all') {
          filtered = filtered.filter(m => m.commodity.toLowerCase() === commodity.toLowerCase() || m.commodityHi === commodity);
        }
        return {
          data: filtered,
          isFromCache: true,
          cacheTime: cached.dateFormatted,
          sourceName: `${cached.source} (ऑफ़लाइन रिकॉर्ड)`,
        };
      }
      throw err;
    }
  },

  // Mandi Decision Intelligence
  async getMandiDecision(commodity: string, district: string): Promise<SellDecisionAdvice> {
    const res = await fetch(`/api/mandi/decision?commodity=${encodeURIComponent(commodity)}&district=${encodeURIComponent(district)}`);
    if (!res.ok) throw new Error('Decision failed');
    return res.json();
  },

  // Weather-based AI Advisor (Kisan Saathi Mausam Salah)
  async getMausamSalah(payload: {
    location: LocationInfo;
    weather: any;
    crop: string;
    growthStage?: string;
    sowingDate?: string;
  }): Promise<MausamSalah> {
    const res = await fetch('/api/gemini/mausam-salah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Mausam Salah failed');
    return res.json();
  },

  // SoilSense AI Report Interpretation
  async interpretSoilReport(payload: Partial<SoilReportValues> & { imageBase64?: string }): Promise<SoilAIInterpretation> {
    const res = await fetch('/api/gemini/soil-interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Soil interpretation failed');
    return res.json();
  },

  // Conversational AI Assistant
  async sendChatMessage(message: string, location: LocationInfo, crop: string, conversationHistory?: any[]): Promise<{ reply: string; sources?: string[]; confidence?: string }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, location, crop, conversationHistory }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  },

  // Admin / Owner verification and data
  async adminLogin(pin: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    return res.json();
  },

  async getAdminOverview(): Promise<any> {
    const res = await fetch('/api/admin/overview');
    return res.json();
  },

  async updateAdminSettings(settings: any): Promise<any> {
    const res = await fetch('/api/admin/update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  async saveCrop(crop: Partial<CropInfo>): Promise<any> {
    const res = await fetch('/api/admin/crops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crop),
    });
    return res.json();
  },

  async saveArticle(article: Partial<FarmingArticle>): Promise<any> {
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    return res.json();
  },
};
