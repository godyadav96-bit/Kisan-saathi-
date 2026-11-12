export type Language = 'hi' | 'en';

export interface LocationInfo {
  state: string;
  district: string;
  tehsil: string;
  village: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  lastUpdated: string;
}

export interface WeatherCurrent {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainProbability: number;
  expectedRainfallMm: number;
  condition: string;
  conditionCode: number;
  conditionIcon: string;
  summary: string;
  source: string;
  lastUpdated: string;
  isObserved: boolean;
  warnings?: string[];
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temp: number;
  rainProb: number;
  condition: string;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  rainProb: number;
  rainfallMm: number;
  condition: string;
  summary: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: string;
  provider: string;
  isDemo?: boolean;
}

export interface MausamSalah {
  summary: string;
  sowingAdvice: string;
  irrigationAdvice: string;
  pestWarning: string;
  harvestingAdvice: string;
  precautions: string[];
  confidence: string;
  disclaimer: string;
}

export interface MandiPriceRecord {
  id: string;
  state: string;
  district: string;
  mandiName: string;
  commodity: string;
  commodityHi: string;
  variety: string;
  arrivalQuantityQtl: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  lastUpdated: string;
  source: string;
  isLive: boolean;
  priceTrend?: 'up' | 'down' | 'stable';
  changeAmount?: number;
}

export interface SellDecisionAdvice {
  verdict: 'sell' | 'hold' | 'watch';
  title: string;
  reasons: string[];
  limitations: string;
  checklist: string[];
  marketDirection: string;
}

export interface SoilReportValues {
  id?: string;
  farmerName?: string;
  plotName: string;
  testDate: string;
  labName?: string;
  ph: number;
  nitrogenKgHa: number; // Low < 280, Medium 280-560, High > 560
  phosphorusKgHa: number; // Low < 10, Medium 10-25, High > 25
  potassiumKgHa: number; // Low < 110, Medium 110-280, High > 280
  organicCarbonPercent: number; // Low < 0.5%, Medium 0.5-0.75%, High > 0.75%
  electricalConductivityDsM?: number; // Normal < 1.0
  moistureStatus?: 'dry' | 'low' | 'normal' | 'wet' | 'unknown';
  micronutrients?: {
    zincPpm?: number;
    ironPpm?: number;
    copperPpm?: number;
    manganesePpm?: number;
  };
  sourceType: 'lab_report' | 'manual_entry';
  reportImageUrl?: string;
  verifiedByFarmer: boolean;
  createdAt: string;
}

export interface SoilAIInterpretation {
  phSummary: string;
  npkStatus: {
    nitrogen: { level: 'low' | 'medium' | 'high'; note: string };
    phosphorus: { level: 'low' | 'medium' | 'high'; note: string };
    potassium: { level: 'low' | 'medium' | 'high'; note: string };
    organicCarbon: { level: 'low' | 'medium' | 'high'; note: string };
  };
  soilHealthScore: number;
  recommendedCrops: string[];
  soilImprovementTips: string[];
  questionsForKVKExpert: string[];
  disclaimer: string;
}

export interface CropInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'rabi' | 'kharif' | 'zaid';
  suitableSeason: string;
  tempRange: string;
  soilRequirements: string;
  waterRequirements: string;
  sowingPeriod: string;
  durationDays: string;
  irrigationStages: { stage: string; daysAfterSowing: string; note: string }[];
  pestsAndDiseases: { name: string; symptoms: string; prevention: string }[];
  harvestingInfo: string;
  generalGuidance: string;
  iconName: string;
  colorScheme: string;
  isActive: boolean;
}

export interface FarmingArticle {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'kharif' | 'rabi' | 'zaid' | 'soil' | 'fertilizer' | 'irrigation' | 'pests' | 'harvesting' | 'schemes';
  summary: string;
  content: string;
  crop?: string;
  season?: string;
  source: string;
  lastReviewed: string;
  tags: string[];
  isVerified: boolean;
}

export interface FarmExpenseRecord {
  id: string;
  cropName: string;
  areaAcre: number;
  date: string;
  seedCost: number;
  fertilizerCost: number;
  labourCost: number;
  irrigationCost: number;
  transportCost: number;
  otherCost: number;
  harvestQuantityQtl: number;
  sellingPricePerQtl: number;
  totalCost: number;
  totalRevenue: number;
  netProfit: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  landSizeBigha: number;
  primaryCrops: string[];
  preferredMandi: string;
  role: 'farmer' | 'admin' | 'owner';
  createdAt: string;
  isDemoUser: boolean;
}

export interface AdminSettings {
  appName: string;
  appDescription: string;
  primaryColor: string;
  defaultLanguage: Language;
  defaultState: string;
  defaultDistrict: string;
  weatherProvider: 'open_meteo' | 'imd' | 'demo';
  mandiDataSource: 'agmarknet' | 'enam' | 'demo';
  demoModeDefault: boolean;
  isMarketplaceEnabled: boolean;
  isSubscriptionEnabled: boolean;
  aiDailyLimit: number;
  contactPhone: string;
  contactEmail: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  confidence?: string;
  sources?: string[];
}

export type NotificationType = 'weather' | 'mandi' | 'advisory' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  dateFormatted: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  actionTarget?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  weatherAlerts: boolean;
  mandiPriceAlerts: boolean;
  cropAdvisoryAlerts: boolean;
  browserPushEnabled: boolean;
}
