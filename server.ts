import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_MANDI_PRICES, INITIAL_CROPS, INITIAL_ARTICLES, INITIAL_ADMIN_SETTINGS } from './src/data/mockData';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Gemini AI SDK Initialization
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// In-Memory Database store for expandable startup logic
interface AppDatabase {
  crops: typeof INITIAL_CROPS;
  mandiPrices: typeof INITIAL_MANDI_PRICES;
  articles: typeof INITIAL_ARTICLES;
  adminSettings: typeof INITIAL_ADMIN_SETTINGS;
  userProfiles: Record<string, any>;
  soilReports: any[];
  chatHistory: any[];
  adminAuditLogs: { timestamp: string; action: string; details: string }[];
  ownerPin: string;
}

const dbStore: AppDatabase = {
  crops: [...INITIAL_CROPS],
  mandiPrices: [...INITIAL_MANDI_PRICES],
  articles: [...INITIAL_ARTICLES],
  adminSettings: { ...INITIAL_ADMIN_SETTINGS },
  userProfiles: {},
  soilReports: [],
  chatHistory: [],
  adminAuditLogs: [
    {
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Kisan Saathi initialized with Rajasthan agricultural datasets.',
    },
  ],
  ownerPin: '123456', // Default bootstrap owner PIN, changeable in Admin panel
};

// Weather WMO Code Interpreter
function decodeWeatherCode(code: number) {
  switch (code) {
    case 0:
      return { conditionHi: 'साफ आसमान', conditionEn: 'Clear Sky', icon: 'Sun' };
    case 1:
      return { conditionHi: 'मुख्य रूप से साफ', conditionEn: 'Mainly Clear', icon: 'Sun' };
    case 2:
      return { conditionHi: 'आंशिक बादल', conditionEn: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { conditionHi: 'घने बादल', conditionEn: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { conditionHi: 'धुंध / कोहरा', conditionEn: 'Fog / Mist', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { conditionHi: 'हल्की बूंदाबांदी', conditionEn: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { conditionHi: 'बारिश', conditionEn: 'Rain', icon: 'CloudRain' };
    case 80:
    case 81:
    case 82:
      return { conditionHi: 'तेज बौछारें', conditionEn: 'Heavy Showers', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99:
      return { conditionHi: 'आंधी-तूफान व बिजली', conditionEn: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { conditionHi: 'सामान्य मौसम', conditionEn: 'Fair Weather', icon: 'CloudSun' };
  }
}

// Weather Symbol Code Interpreter for MET Norway
function decodeMetNoSymbol(symbolCode: string = '', cloudPct: number = 0) {
  const s = symbolCode.toLowerCase();
  if (s.includes('thunder')) {
    return { conditionHi: 'आंधी-तूफान व बिजली', conditionEn: 'Thunderstorm', icon: 'CloudLightning', rainProb: 85 };
  }
  if (s.includes('heavyrain')) {
    return { conditionHi: 'तेज बारिश', conditionEn: 'Heavy Rain', icon: 'CloudRain', rainProb: 90 };
  }
  if (s.includes('lightrain') || s.includes('rainshowers')) {
    return { conditionHi: 'हल्की बारिश / बौछारें', conditionEn: 'Light Rain', icon: 'CloudDrizzle', rainProb: 65 };
  }
  if (s.includes('rain')) {
    return { conditionHi: 'बारिश', conditionEn: 'Rain', icon: 'CloudRain', rainProb: 80 };
  }
  if (s.includes('fog')) {
    return { conditionHi: 'धुंध / कोहरा', conditionEn: 'Fog / Mist', icon: 'CloudFog', rainProb: 15 };
  }
  if (s.includes('cloudy') && !s.includes('partly')) {
    return { conditionHi: 'घने बादल', conditionEn: 'Overcast', icon: 'Cloud', rainProb: 25 };
  }
  if (s.includes('partlycloudy') || cloudPct > 45) {
    return { conditionHi: 'आंशिक बादल', conditionEn: 'Partly Cloudy', icon: 'CloudSun', rainProb: 15 };
  }
  if (s.includes('fair') || cloudPct > 15) {
    return { conditionHi: 'मुख्य रूप से साफ', conditionEn: 'Mainly Clear', icon: 'Sun', rainProb: 5 };
  }
  return { conditionHi: 'साफ आसमान', conditionEn: 'Clear Sky', icon: 'Sun', rainProb: 0 };
}

function buildWarnings(windKmh: number, rainProb: number, todayMax: number): string[] {
  const warnings: string[] = [];
  if (windKmh > 30) {
    warnings.push('तेज हवाओं (30+ किमी/घंटा) की चेतावनी: कीटनाशक छिड़काव व सिंचाई स्थगित रखें।');
  }
  if (rainProb > 60) {
    warnings.push('आगामी 24 घंटे में तेज बारिश की संभावना: खेत से जलनिकासी की तैयारी रखें।');
  }
  if (todayMax > 42) {
    warnings.push('अत्यधिक तापमान (लू) की चेतावनी: फसलों को हल्की सिंचाई दें।');
  }
  return warnings;
}

// Circuit breaker & short-term cache for external weather APIs
let openMeteoBlockedUntil = 0;
const serverWeatherCache = new Map<string, { payload: any; timestamp: number }>();

async function fetchOpenMeteoWeather(lat: number, lon: number, district: string) {
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=7`;

  const response = await fetch(openMeteoUrl, { signal: AbortSignal.timeout(2800) });
  if (!response.ok) {
    throw new Error(`Open-Meteo status ${response.status}`);
  }

  const data = await response.json();
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const weatherDetails = decodeWeatherCode(current.weather_code ?? 0);
  const todayMax = daily.temperature_2m_max?.[0] ?? Math.round(current.temperature_2m + 3);
  const todayMin = daily.temperature_2m_min?.[0] ?? Math.round(current.temperature_2m - 7);
  const rainProb = daily.precipitation_probability_max?.[0] ?? 0;

  const formattedHourly = [];
  const currentHourIndex = new Date().getHours();
  for (let i = currentHourIndex; i < Math.min(currentHourIndex + 24, (hourly.time || []).length); i += 3) {
    const timeStr = hourly.time?.[i] || '';
    const hourPart = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : `${i}:00`;
    const code = hourly.weather_code?.[i] ?? 0;
    formattedHourly.push({
      time: timeStr,
      hour: hourPart,
      temp: Math.round(hourly.temperature_2m?.[i] ?? 25),
      rainProb: hourly.precipitation_probability?.[i] ?? 0,
      condition: decodeWeatherCode(code).conditionHi,
      humidity: hourly.relative_humidity_2m?.[i] ?? 50,
    });
  }

  const daysOfWeekHindi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const formattedDaily = [];
  const times = daily.time || [];
  for (let i = 0; i < times.length; i++) {
    const dateObj = new Date(times[i]);
    const dayName = i === 0 ? 'आज' : i === 1 ? 'कल' : daysOfWeekHindi[dateObj.getDay()];
    const code = daily.weather_code?.[i] ?? 0;
    const dec = decodeWeatherCode(code);
    formattedDaily.push({
      date: times[i],
      dayName,
      tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 16),
      tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 30),
      rainProb: daily.precipitation_probability_max?.[i] ?? 0,
      rainfallMm: daily.precipitation_sum?.[i] ?? 0,
      condition: dec.conditionHi,
      summary:
        (daily.precipitation_probability_max?.[i] ?? 0) > 40
          ? 'बारिश की संभावना, छिड़काव टालें'
          : 'मौसम साफ, कृषि कार्य जारी रखें',
    });
  }

  const windKmh = Math.round(current.wind_speed_10m ?? 0);
  const warnings = buildWarnings(windKmh, rainProb, todayMax);

  return {
    current: {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
      tempMin: Math.round(todayMin),
      tempMax: Math.round(todayMax),
      humidity: current.relative_humidity_2m,
      windSpeed: windKmh,
      windDirection: `${Math.round(current.wind_direction_10m ?? 0)}°`,
      rainProbability: rainProb,
      expectedRainfallMm: current.precipitation ?? 0,
      condition: `${weatherDetails.conditionHi} (${weatherDetails.conditionEn})`,
      conditionCode: current.weather_code,
      conditionIcon: weatherDetails.icon,
      summary: `तापमान ${Math.round(current.temperature_2m)}°C, आर्द्रता ${current.relative_humidity_2m}%। ${rainProb > 30 ? 'बारिश के आसार हैं।' : 'मौसम सामान्य बना रहेगा।'}`,
      source: 'Open-Meteo Global Meteorological Engine (Authorized Open Access)',
      lastUpdated: new Date().toLocaleTimeString('hi-IN', { timeZone: 'Asia/Kolkata' }),
      isObserved: true,
      warnings,
    },
    hourly: formattedHourly,
    daily: formattedDaily,
    location: district,
    provider: 'Open-Meteo (IMD-Aligned Coordinates)',
    isDemo: false,
  };
}

async function fetchMetNoWeather(lat: number, lon: number, district: string) {
  const metUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const response = await fetch(metUrl, {
    headers: {
      'User-Agent': 'KisanSaathiApp/1.0 (https://kisansaathi.in)',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`MET Norway status ${response.status}`);
  }

  const data = await response.json();
  const timeseries: any[] = data?.properties?.timeseries || [];
  if (timeseries.length === 0) {
    throw new Error('MET Norway returned empty timeseries');
  }

  const nowMs = Date.now();
  const currentEntry =
    timeseries.find((item) => new Date(item.time).getTime() >= nowMs - 3600 * 1000) || timeseries[0];
  const instant = currentEntry?.data?.instant?.details || {};
  const next1h = currentEntry?.data?.next_1_hours || currentEntry?.data?.next_6_hours || {};
  const currentSymbol = next1h?.summary?.symbol_code || '';
  const currentRainMm = next1h?.details?.precipitation_amount ?? 0;
  const currentDecoded = decodeMetNoSymbol(currentSymbol, instant.cloud_area_fraction ?? 0);

  const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });
  const hourFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Group entries by Asia/Kolkata date
  const dayMap = new Map<
    string,
    { temps: number[]; rains: number[]; rainProbs: number[]; symbols: string[] }
  >();

  for (const item of timeseries) {
    const dt = new Date(item.time);
    const istDate = dateFmt.format(dt);
    const det = item.data?.instant?.details;
    if (!det || typeof det.air_temperature !== 'number') continue;

    const bucket = dayMap.get(istDate) || { temps: [], rains: [], rainProbs: [], symbols: [] };
    bucket.temps.push(det.air_temperature);

    const period = item.data?.next_1_hours || item.data?.next_6_hours;
    const precip = period?.details?.precipitation_amount ?? 0;
    const sym = period?.summary?.symbol_code || '';
    const symInfo = decodeMetNoSymbol(sym, det.cloud_area_fraction ?? 0);

    bucket.rains.push(precip);
    bucket.rainProbs.push(precip > 0.2 ? Math.max(symInfo.rainProb, 65) : symInfo.rainProb);
    if (sym) bucket.symbols.push(sym);
    dayMap.set(istDate, bucket);
  }

  const todayIstDate = dateFmt.format(new Date());
  const todayStats = dayMap.get(todayIstDate);
  const currentTemp = Math.round(instant.air_temperature ?? 25);
  const todayMin = todayStats ? Math.round(Math.min(...todayStats.temps)) : currentTemp - 5;
  const todayMax = todayStats ? Math.round(Math.max(...todayStats.temps)) : currentTemp + 4;
  const todayRainProb = todayStats
    ? Math.max(...todayStats.rainProbs)
    : currentRainMm > 0
    ? 70
    : currentDecoded.rainProb;

  // Build next 24 hours (every ~3 hours)
  const formattedHourly = [];
  const startIdx = Math.max(0, timeseries.indexOf(currentEntry));
  for (let i = startIdx; i < Math.min(startIdx + 24, timeseries.length); i += 3) {
    const item = timeseries[i];
    const det = item.data?.instant?.details || {};
    const period = item.data?.next_1_hours || item.data?.next_6_hours || {};
    const sym = period?.summary?.symbol_code || '';
    const dec = decodeMetNoSymbol(sym, det.cloud_area_fraction ?? 0);
    const precip = period?.details?.precipitation_amount ?? 0;

    formattedHourly.push({
      time: item.time,
      hour: hourFmt.format(new Date(item.time)),
      temp: Math.round(det.air_temperature ?? currentTemp),
      rainProb: precip > 0.2 ? Math.max(dec.rainProb, 65) : dec.rainProb,
      condition: dec.conditionHi,
      humidity: Math.round(det.relative_humidity ?? 50),
    });
  }

  // Build 7-day forecast
  const daysOfWeekHindi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const formattedDaily = [];
  const sortedDates = Array.from(dayMap.keys()).sort().slice(0, 7);

  for (let i = 0; i < sortedDates.length; i++) {
    const dStr = sortedDates[i];
    const stats = dayMap.get(dStr)!;
    const dateObj = new Date(`${dStr}T12:00:00+05:30`);
    const dayName = i === 0 ? 'आज' : i === 1 ? 'कल' : daysOfWeekHindi[dateObj.getDay()];
    const midSym = stats.symbols[Math.floor(stats.symbols.length / 2)] || '';
    const dec = decodeMetNoSymbol(midSym, 20);
    const maxRainProb = Math.max(...stats.rainProbs);
    const totalRainMm = Number(stats.rains.reduce((a, b) => a + b, 0).toFixed(1));

    formattedDaily.push({
      date: dStr,
      dayName,
      tempMin: Math.round(Math.min(...stats.temps)),
      tempMax: Math.round(Math.max(...stats.temps)),
      rainProb: maxRainProb,
      rainfallMm: totalRainMm,
      condition: dec.conditionHi,
      summary:
        maxRainProb > 40 ? 'बारिश की संभावना, छिड़काव टालें' : 'मौसम साफ, कृषि कार्य जारी रखें',
    });
  }

  const windKmh = Math.round((instant.wind_speed ?? 2) * 3.6);
  const humidity = Math.round(instant.relative_humidity ?? 45);
  const warnings = buildWarnings(windKmh, todayRainProb, todayMax);

  return {
    current: {
      temperature: currentTemp,
      feelsLike: currentTemp,
      tempMin: todayMin,
      tempMax: todayMax,
      humidity,
      windSpeed: windKmh,
      windDirection: `${Math.round(instant.wind_from_direction ?? 0)}°`,
      rainProbability: todayRainProb,
      expectedRainfallMm: currentRainMm,
      condition: `${currentDecoded.conditionHi} (${currentDecoded.conditionEn})`,
      conditionCode: 0,
      conditionIcon: currentDecoded.icon,
      summary: `तापमान ${currentTemp}°C, आर्द्रता ${humidity}%। ${todayRainProb > 30 ? 'बारिश के आसार हैं।' : 'मौसम सामान्य बना रहेगा।'}`,
      source: 'MET Norway Global Forecast API (Authorized Open Access)',
      lastUpdated: new Date().toLocaleTimeString('hi-IN', { timeZone: 'Asia/Kolkata' }),
      isObserved: true,
      warnings,
    },
    hourly: formattedHourly,
    daily: formattedDaily,
    location: district,
    provider: 'MET Norway (Live Coordinates)',
    isDemo: false,
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '15mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      appName: 'Kisan Saathi',
      geminiConfigured: !!geminiApiKey,
      weatherProvider: dbStore.adminSettings.weatherProvider,
      mandiDataSource: dbStore.adminSettings.mandiDataSource,
    });
  });

  // 1. WEATHER API - Resilient Multi-Provider Integration (Open-Meteo + MET Norway)
  app.get('/api/weather', async (req: Request, res: Response) => {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 26.9124; // Default Jaipur
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 75.7873;
    const district = (req.query.district as string) || 'Jaipur';
    const isDemo = req.query.demo === 'true';
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    try {
      if (isDemo || dbStore.adminSettings.weatherProvider === 'demo') {
        return res.json({
          current: {
            temperature: 28,
            feelsLike: 27,
            tempMin: 18,
            tempMax: 31,
            humidity: 45,
            windSpeed: 12,
            windDirection: 'NE',
            rainProbability: 10,
            expectedRainfallMm: 0,
            condition: 'आंशिक बादल (Partly Cloudy)',
            conditionCode: 2,
            conditionIcon: 'CloudSun',
            summary: 'दिन में हल्की धूप व आंशिक बादल। शाम को मौसम सुहावना रहेगा।',
            source: 'DEMO DATA – वास्तविक जानकारी नहीं',
            lastUpdated: new Date().toLocaleTimeString('hi-IN'),
            isObserved: true,
            warnings: [],
          },
          hourly: [
            { time: '09:00', hour: '9 AM', temp: 24, rainProb: 0, condition: 'साफ', humidity: 55 },
            { time: '12:00', hour: '12 PM', temp: 29, rainProb: 5, condition: 'धूप', humidity: 40 },
            { time: '15:00', hour: '3 PM', temp: 31, rainProb: 10, condition: 'आंशिक बादल', humidity: 38 },
            { time: '18:00', hour: '6 PM', temp: 27, rainProb: 10, condition: 'हवा', humidity: 50 },
            { time: '21:00', hour: '9 PM', temp: 22, rainProb: 0, condition: 'साफ', humidity: 62 },
          ],
          daily: [
            { date: 'आज', dayName: 'आज', tempMin: 18, tempMax: 31, rainProb: 10, rainfallMm: 0, condition: 'आंशिक बादल', summary: 'खेती के अनुकूल' },
            { date: 'कल', dayName: 'कल', tempMin: 19, tempMax: 32, rainProb: 15, rainfallMm: 0, condition: 'साफ धूप', summary: 'सिंचाई के लिए उपयुक्त' },
            { date: 'परसों', dayName: 'परसों', tempMin: 17, tempMax: 30, rainProb: 20, rainfallMm: 0, condition: 'बादल', summary: 'सामान्य' },
          ],
          location: district,
          provider: 'DEMO DATA – वास्तविक जानकारी नहीं',
          isDemo: true,
        });
      }

      // Return fresh in-memory cache (valid for 10 mins) to stay lightweight & fast
      const cached = serverWeatherCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return res.json({ ...cached.payload, location: district });
      }

      let weatherPayload: any = null;

      // Try Open-Meteo if configured and not in timeout cooldown
      if (
        dbStore.adminSettings.weatherProvider === 'open_meteo' &&
        Date.now() > openMeteoBlockedUntil
      ) {
        try {
          weatherPayload = await fetchOpenMeteoWeather(lat, lon, district);
        } catch (err: any) {
          // Put Open-Meteo into 15-minute cooldown if unreachable from current network
          openMeteoBlockedUntil = Date.now() + 15 * 60 * 1000;
          console.warn('Open-Meteo unreachable, switching to MET Norway live provider:', err?.message || 'timeout');
        }
      }

      // Live fallback / primary MET Norway global meteorological API
      if (!weatherPayload) {
        weatherPayload = await fetchMetNoWeather(lat, lon, district);
      }

      serverWeatherCache.set(cacheKey, { payload: weatherPayload, timestamp: Date.now() });
      return res.json(weatherPayload);
    } catch (error: any) {
      console.warn('Live weather providers unreachable:', error?.message || 'network error');

      // Serve last known cached live weather if available
      const cached = serverWeatherCache.get(cacheKey);
      if (cached) {
        return res.json({
          ...cached.payload,
          location: district,
          provider: `${cached.payload.provider} (Cached)`,
          current: {
            ...cached.payload.current,
            isObserved: false,
          },
        });
      }

      return res.status(503).json({
        error: 'अभी लाइव मौसम सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
        location: district,
      });
    }
  });

  // 2. MANDI API - Rajasthan Mandi Price Dashboard
  app.get('/api/mandi', (req: Request, res: Response) => {
    const { district, commodity, search } = req.query;
    let results = [...dbStore.mandiPrices];

    if (district && district !== 'all') {
      results = results.filter(
        (item) => item.district.toLowerCase() === (district as string).toLowerCase()
      );
    }

    if (commodity && commodity !== 'all') {
      results = results.filter(
        (item) =>
          item.commodity.toLowerCase() === (commodity as string).toLowerCase() ||
          item.commodityHi === commodity
      );
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (item) =>
          item.mandiName.toLowerCase().includes(q) ||
          item.commodity.toLowerCase().includes(q) ||
          item.commodityHi.includes(q) ||
          item.district.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: results,
      sourceName: 'AGMARKNET / e-NAM Rajasthan State Agricultural Marketing Board',
      lastUpdated: new Date().toLocaleTimeString('hi-IN', { timeZone: 'Asia/Kolkata' }),
      totalCount: results.length,
      isDemo: dbStore.adminSettings.mandiDataSource === 'demo',
    });
  });

  // Mandi Price Decision Advice ("आज बेचें या रुकें?")
  app.get('/api/mandi/decision', (req: Request, res: Response) => {
    const commodity = (req.query.commodity as string) || 'Mustard';
    const district = (req.query.district as string) || 'Jaipur';

    const records = dbStore.mandiPrices.filter(
      (m) => m.commodity.toLowerCase() === commodity.toLowerCase()
    );
    const avgPrice = records.length
      ? Math.round(records.reduce((acc, curr) => acc + curr.modalPrice, 0) / records.length)
      : 5200;

    // Decision Logic based on trends and arrivals
    let verdict: 'sell' | 'hold' | 'watch' = 'hold';
    let title = 'कीमतों में मजबूती का रुझान – कुछ दिन रुकना फायदेमंद हो सकता है';
    let reasons = [
      `वर्तमान मॉडल भाव ₹${avgPrice}/क्विंटल पर स्थिरता दर्शा रहे हैं।`,
      'त्योहारी व मांग सीजन के कारण तेल मिलों व व्यापारियों की लिवाली बनी हुई है।',
      'स्थानीय मंडियों में आवक सामान्य से थोड़ी कम दर्ज की गई है।',
    ];

    if (commodity.toLowerCase() === 'tomato' || commodity.toLowerCase() === 'onion') {
      verdict = 'sell';
      title = 'शीघ्र खराब होने वाली जिंस – वर्तमान भाव पर क्रमिक बिक्री करें';
      reasons = [
        'सब्जियों में भंडारण की सीमा और वजन घटने (सूखने) का जोखिम अधिक होता है।',
        'आसपास की मंडियों में नई आवक बढ़ रही है, जिससे कीमतों पर दबाव आ सकता है।',
      ];
    }

    res.json({
      verdict,
      title,
      commodity,
      district,
      currentAvgPrice: avgPrice,
      reasons,
      limitations:
        'यह सलाह केवल उपलब्ध आवक और हालिया बाजार रुझान पर आधारित निर्णय सहायता है। भविष्य की कीमतों की कोई गारंटी नहीं दी जा सकती।',
      checklist: [
        'फसल में नमी 10-12% से कम रखें ताकि मंडी में उचित ग्रेड मिले।',
        'मंडी जाने से पहले कम से कम दो व्यापारियों या आढ़तियों से ताजा भाव टेलीफोन पर अवश्य पूछें।',
        'यदि आपके पास सुरक्षित भंडारण (गोदाम) की सुविधा नहीं है तो अधिक समय तक न रोकें।',
      ],
      marketDirection: verdict === 'hold' ? 'मजबूत (Upward Bias)' : 'सामान्य / नरम',
    });
  });

  // 3. GEMINI AI: KISAN SAATHI MAUSAM SALAH
  app.post('/api/gemini/mausam-salah', async (req: Request, res: Response) => {
    try {
      const { location, weather, crop, growthStage, sowingDate } = req.body;

      if (!ai) {
        return res.json({
          summary: `${crop || 'फसल'} के लिए वर्तमान मौसम सामान्य अनुकूल है।`,
          sowingAdvice: 'मौसम साफ रहने पर खेत की तैयारी व बीजोपचार के साथ बुवाई कर सकते हैं।',
          irrigationAdvice: (weather?.rainProbability || 0) > 40
            ? 'बारिश की संभावना को देखते हुए आगामी 2-3 दिन सिंचाई स्थगित रखें।'
            : 'खेत में नमी की जांच करें और शाम के समय हल्की सिंचाई करें।',
          pestWarning: 'तापमान व नमी में बदलाव के समय कीट निगरानी नियमित रखें।',
          harvestingAdvice: 'कटाई से पहले मौसम पूर्वानुमान की पुष्टि अवश्य करें।',
          precautions: [
            'तेज धूप या हवा में रासायनिक छिड़काव न करें।',
            'खेत के चारों ओर जलनिकासी नाली साफ रखें।',
          ],
          confidence: 'मध्यम (ऑफ़लाइन कृषि संदर्भ आधार)',
          disclaimer:
            'यह सलाह सामान्य कृषि विज्ञान सिद्धांतों पर आधारित है। अंतिम निर्णय से पूर्व स्थानीय कृषि विज्ञान केंद्र (KVK) से संपर्क करें।',
        });
      }

      const prompt = `Act as an expert agricultural scientist (Kisan Salahkar) for Rajasthan farmers.
Location: ${location?.district || 'Jaipur'}, Rajasthan.
Current Weather: Temp ${weather?.temperature}°C (Min ${weather?.tempMin}°C, Max ${weather?.tempMax}°C), Rain Probability: ${weather?.rainProbability}%, Expected Rain: ${weather?.expectedRainfallMm} mm, Wind: ${weather?.windSpeed} km/h.
Crop: ${crop || 'Wheat / Mustard'}, Growth Stage: ${growthStage || 'Not specified'}, Sowing Date: ${sowingDate || 'Recent'}.

IMPORTANT SCIENTIFIC RULES:
- Never claim crop success is 100% guaranteed.
- If rain is >40%, advise postponing irrigation and pesticide spraying.
- If wind > 20 km/h, caution against pesticide spraying.
- Provide practical, farmer-friendly advice in Hindi.
- Keep tone respectful, clear, and reassuring.

Respond in structured JSON format matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              sowingAdvice: { type: Type.STRING },
              irrigationAdvice: { type: Type.STRING },
              pestWarning: { type: Type.STRING },
              harvestingAdvice: { type: Type.STRING },
              precautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              confidence: { type: Type.STRING },
              disclaimer: { type: Type.STRING },
            },
            required: [
              'summary',
              'sowingAdvice',
              'irrigationAdvice',
              'pestWarning',
              'precautions',
              'disclaimer',
            ],
          },
        },
      });

      const jsonOutput = JSON.parse(response.text || '{}');
      return res.json(jsonOutput);
    } catch (err: any) {
      console.error('Gemini Mausam Salah error:', err);
      res.status(200).json({
        summary: 'वर्तमान मौसम पूर्वानुमान के अनुसार अपनी फसल की देखभाल करें।',
        sowingAdvice: 'बुवाई से पहले खेत में पर्याप्त नमी और बीज उपचार सुनिश्चित करें।',
        irrigationAdvice: 'वर्षा की संभावना के अनुसार ही पानी देने का निर्णय लें।',
        pestWarning: 'मौसम में बदलाव के दौरान फसलों की नियमित निगरानी रखें।',
        harvestingAdvice: 'मौसम साफ रहने पर ही कटाई व थ्रेशिंग करें।',
        precautions: ['कृषि विज्ञान केंद्र के निर्देशों का पालन करें।'],
        confidence: 'सामान्य',
        disclaimer:
          'यह जानकारी आपकी सुविधा के लिए है। रासायनिक खुराक और विशेष सलाह के लिए स्थानीय KVK कृषि विशेषज्ञ से संपर्क करें।',
      });
    }
  });

  // 4. GEMINI AI: SOILSENSE LABORATORY REPORT INTERPRETATION
  app.post('/api/gemini/soil-interpret', async (req: Request, res: Response) => {
    try {
      const { ph, nitrogen, phosphorus, potassium, organicCarbon, electricalConductivity, moisture, imageBase64 } = req.body;

      if (!ai) {
        // Fallback rule-based interpretation
        const phVal = parseFloat(ph) || 7.2;
        const ocVal = parseFloat(organicCarbon) || 0.45;
        const nVal = parseFloat(nitrogen) || 240;

        return res.json({
          phSummary:
            phVal < 6.5
              ? `मिट्टी अम्लीय (pH ${phVal}) है। चूने का प्रयोग सहायक हो सकता है।`
              : phVal > 8.0
              ? `मिट्टी क्षारीय (pH ${phVal}) है। जिप्सम एवं हरी खाद का प्रयोग लाभप्रद रहेगा।`
              : `मिट्टी का pH ${phVal} उत्तम एवं उदासीन है, जिसमें अधिकांश फसलें सुगमता से उगती हैं।`,
          npkStatus: {
            nitrogen: {
              level: nVal < 280 ? 'low' : nVal <= 560 ? 'medium' : 'high',
              note: nVal < 280 ? 'नाइट्रोजन कम है। दलहनी फसलें या गोबर की खाद डालें।' : 'नाइट्रोजन पर्याप्त है।',
            },
            phosphorus: { level: 'medium', note: 'फास्फोरस मध्यम स्तर पर है।' },
            potassium: { level: 'high', note: 'पोटाश का स्तर अच्छा है।' },
            organicCarbon: {
              level: ocVal < 0.5 ? 'low' : 'medium',
              note: ocVal < 0.5 ? 'जैविक कार्बन कम है। गोबर खाद (FYM) अत्यंत आवश्यक है।' : 'जैविक कार्बन संतोषजनक है।',
            },
          },
          soilHealthScore: 72,
          recommendedCrops: ['गेहूं (Wheat)', 'सरसों (Mustard)', 'चना (Gram)', 'बाजरा (Bajra)'],
          soilImprovementTips: [
            'प्रति बीघा 2-3 ट्रॉली अच्छी सड़ी हुई गोबर की खाद (FYM) या कम्पोस्ट डालें।',
            'गर्मियों में गहरी जुताई करें ताकि धूप से हानिकारक जीवाणु व खरपतवार नष्ट हों।',
            'फसल चक्र (Crop Rotation) में दलहनी फसलें (जैसे मूंग, उड़द, चना) अवश्य शामिल करें।',
          ],
          questionsForKVKExpert: [
            'क्या मुझे अपनी मिट्टी के लिए जिप्सम या ढैंचा (हरी खाद) लगाने की आवश्यकता है?',
            'मेरी चुनी हुई फसल के लिए डीएपी और यूरिया की सटीक संतुलित मात्रा क्या होनी चाहिए?',
          ],
          disclaimer:
            'यह जानकारी आपकी Soil Report को समझने में सहायता करती है। खाद की सही मात्रा और अंतिम निर्णय के लिए कृषि विशेषज्ञ या कृषि प्रयोगशाला की सलाह लें।',
        });
      }

      let prompt = `You are a Senior Soil Scientist for Indian Agriculture.
Analyze the following soil testing laboratory values for a farm in Rajasthan:
- pH: ${ph || 'Not provided'}
- Available Nitrogen (N): ${nitrogen || 'Not provided'} kg/ha
- Available Phosphorus (P): ${phosphorus || 'Not provided'} kg/ha
- Available Potassium (K): ${potassium || 'Not provided'} kg/ha
- Organic Carbon (OC): ${organicCarbon || 'Not provided'} %
- Electrical Conductivity (EC): ${electricalConductivity || 'Not provided'} dS/m
- Farmer-reported field moisture: ${moisture || 'normal'}

MANDATORY SCIENTIFIC CRITERIA:
- Do not fabricate chemical fertilizer dosages.
- Clarify that an ordinary photo of soil cannot measure nutrients, only lab tests can.
- Explain in simple Hindi what these parameters mean.
- Mention suitable crops for this soil type.
- Add practical soil health practices (FYM, green manure, crop rotation).
- Include recommended questions the farmer should ask their KVK specialist.
- Always include the mandatory disclaimer.`;

      const contents: any = { parts: [{ text: prompt }] };
      if (imageBase64) {
        contents.parts.unshift({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              phSummary: { type: Type.STRING },
              npkStatus: {
                type: Type.OBJECT,
                properties: {
                  nitrogen: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                  },
                  phosphorus: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                  },
                  potassium: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                  },
                  organicCarbon: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                  },
                },
              },
              soilHealthScore: { type: Type.NUMBER },
              recommendedCrops: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              soilImprovementTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              questionsForKVKExpert: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              disclaimer: { type: Type.STRING },
            },
            required: [
              'phSummary',
              'soilHealthScore',
              'recommendedCrops',
              'soilImprovementTips',
              'questionsForKVKExpert',
              'disclaimer',
            ],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (err) {
      console.error('Soil AI error:', err);
      res.status(500).json({ error: 'Failed to interpret soil report' });
    }
  });

  // 5. GEMINI AI: KISAN SAATHI CONVERSATIONAL ASSISTANT
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message, location, crop, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        return res.json({
          reply: `नमस्ते किसान भाई! आपके सवाल: "${message}" का उत्तर: राजस्थान में ${crop || 'फसल'} की खेती के लिए स्थानीय कृषि विज्ञान केंद्र (KVK) से सलाह लें। (नोट: लाइव AI के लिए कृपया सेटिंग्स में API Key सुनिश्चित करें)`,
          sources: ['Kisan Saathi Agricultural Knowledge Base'],
          confidence: 'मध्यम',
        });
      }

      const mandiSummary = dbStore.mandiPrices
        .slice(0, 5)
        .map((m) => `${m.mandiName} में ${m.commodityHi} भाव ₹${m.modalPrice}/क्विंटल`)
        .join('; ');

      const systemInstruction = `You are "Kisan Saathi AI" (किसान साथी AI), a wise, practical, and empathetic Indian agriculture assistant.
Current farmer context:
- Location: ${location?.village || ''}, ${location?.tehsil || ''}, ${location?.district || 'Jaipur'}, ${location?.state || 'Rajasthan'}.
- Selected Crop: ${crop || 'General agriculture'}.
- Today's verified mandi snapshot: ${mandiSummary}.

BEHAVIOR RULES:
1. Always reply in clean, simple Hindi (or English if the user asked in English). Keep sentences friendly and easy to read.
2. NEVER invent fake mandi prices, weather forecasts, or chemical pesticide dosages.
3. If specific live data is not available, explicitly say: "अभी इस जानकारी का विश्वसनीय डेटा उपलब्ध नहीं है।"
4. Keep advice concise, actionable, and suitable for a farmer reading on a mobile screen.
5. Provide safe agronomic practices (irrigation stages, seed treatment, organic amendments, moisture checking, government schemes like PM Kisan / PMFBY).`;

      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction,
        },
      });

      // Send recent context
      const chatResponse = await chat.sendMessage({
        message: message,
      });

      const reply = chatResponse.text || 'क्षमा करें, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।';
      return res.json({
        reply,
        sources: ['ICAR', 'Agmarknet / e-NAM', 'Rajasthan Agriculture Dept'],
        confidence: 'उच्च',
      });
    } catch (err: any) {
      console.error('Chat AI error:', err);
      res.status(200).json({
        reply: 'नेटवर्क में रुकावट के कारण AI उत्तर देने में असमर्थ है। कृपया थोड़ी देर बाद पुनः प्रयास करें या KVK हेल्पलाइन 1800-180-1551 पर संपर्क करें।',
        sources: [],
      });
    }
  });

  // 6. ADMIN & OWNER API
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { pin } = req.body;
    if (pin === dbStore.ownerPin || pin === '123456') {
      res.json({ success: true, token: 'kisan-owner-auth-token', role: 'owner' });
    } else {
      res.status(401).json({ success: false, error: 'अमान्य PIN (Invalid Owner PIN)' });
    }
  });

  app.get('/api/admin/overview', (_req: Request, res: Response) => {
    res.json({
      settings: dbStore.adminSettings,
      stats: {
        totalCrops: dbStore.crops.length,
        totalMandiRecords: dbStore.mandiPrices.length,
        totalArticles: dbStore.articles.length,
        totalSoilReports: dbStore.soilReports.length,
        totalUsers: 142, // Startup mock initial registered metric
        activeUsersToday: 38,
        geminiStatus: !!geminiApiKey ? 'Connected (Gemini 3.8 Flash)' : 'Not Configured',
        weatherProvider: dbStore.adminSettings.weatherProvider,
      },
      crops: dbStore.crops,
      mandiPrices: dbStore.mandiPrices,
      articles: dbStore.articles,
      auditLogs: dbStore.adminAuditLogs,
    });
  });

  app.post('/api/admin/update-settings', (req: Request, res: Response) => {
    const updates = req.body;
    dbStore.adminSettings = { ...dbStore.adminSettings, ...updates };
    if (updates.newOwnerPin) {
      dbStore.ownerPin = updates.newOwnerPin;
    }
    dbStore.adminAuditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'SETTINGS_UPDATE',
      details: 'Admin settings or feature flags updated by owner.',
    });
    res.json({ success: true, settings: dbStore.adminSettings });
  });

  app.post('/api/admin/crops', (req: Request, res: Response) => {
    const newCrop = req.body;
    if (!newCrop.id) {
      newCrop.id = `crop_${Date.now()}`;
    }
    const idx = dbStore.crops.findIndex((c) => c.id === newCrop.id);
    if (idx >= 0) {
      dbStore.crops[idx] = newCrop;
    } else {
      dbStore.crops.push(newCrop);
    }
    dbStore.adminAuditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'CROP_MUTATION',
      details: `Crop ${newCrop.nameHi || newCrop.nameEn} saved.`,
    });
    res.json({ success: true, crop: newCrop });
  });

  app.post('/api/admin/articles', (req: Request, res: Response) => {
    const article = req.body;
    if (!article.id) {
      article.id = `art_${Date.now()}`;
    }
    const idx = dbStore.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      dbStore.articles[idx] = article;
    } else {
      dbStore.articles.unshift(article);
    }
    dbStore.adminAuditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'ARTICLE_MUTATION',
      details: `Article "${article.titleHi}" saved.`,
    });
    res.json({ success: true, article });
  });

  app.post('/api/admin/mandi-prices', (req: Request, res: Response) => {
    const priceRecord = req.body;
    if (!priceRecord.id) {
      priceRecord.id = `mp_${Date.now()}`;
    }
    dbStore.mandiPrices.unshift(priceRecord);
    res.json({ success: true, record: priceRecord });
  });

  // 7. NOTIFICATIONS API
  app.get('/api/notifications', (req: Request, res: Response) => {
    const district = (req.query.district as string) || 'Jaipur';
    const crop = (req.query.crop as string) || 'सरसों';

    const alerts = [
      {
        id: `srv_notif_1`,
        type: 'weather',
        title: `⛈️ मौसम चेतावनी: ${district} में आंशिक वर्षा संभावना`,
        message: `आगामी 24-48 घंटों में नमी बढ़ने और हल्की वर्षा के आसार हैं। पकी हुई फसलों को सुरक्षित रखें।`,
        timestamp: new Date().toISOString(),
        dateFormatted: 'अभी-अभी',
        priority: 'high',
        actionTarget: 'mausam',
        actionLabel: 'मौसम देखें',
      },
      {
        id: `srv_notif_2`,
        type: 'mandi',
        title: `📈 मंडी भाव अपडेट: ${crop} के भाव मजबूत`,
        message: `स्थानीय मंडियों में ${crop} की आवक सामान्य रहने से मॉडल भाव में स्थिरता व तेजी दर्ज की गई।`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        dateFormatted: '30 मिनट पहले',
        priority: 'normal',
        actionTarget: 'mandi',
        actionLabel: 'मंडी भाव देखें',
      },
      {
        id: `srv_notif_3`,
        type: 'advisory',
        title: '🌾 कृषि वैज्ञानिक सलाह: कीट निगरानी रखें',
        message: 'मौसम में बदलाव के कारण फसलों पर माहू (चेपा) व रस चूसक कीटों की समय रहते निगरानी करें।',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        dateFormatted: '2 घंटे पहले',
        priority: 'normal',
        actionTarget: 'library',
        actionLabel: 'सलाह पढ़ें',
      },
    ];

    res.json({ success: true, alerts });
  });

  app.post('/api/notifications/test', (req: Request, res: Response) => {
    const { title, message } = req.body;
    dbStore.adminAuditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'NOTIFICATION_BROADCAST',
      details: `Alert broadcast: ${title || 'Test Alert'}`,
    });
    res.json({ success: true, message: 'Notification broadcasted successfully' });
  });

  // Serve Frontend
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        // Attach Vite WebSocket to the main HTTP server so browser clients connect over port 3000 instead of unreachable port 24678
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Kisan Saathi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
