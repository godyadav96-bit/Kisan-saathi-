export type SupportedLanguage = 'hi' | 'en' | 'raj' | 'pa';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  home: string;
  mausam: string;
  mandiBhav: string;
  soilSense: string;
  profile: string;
  askAI: string;
  weatherTitle: string;
  todayWeather: string;
  viewMausam: string;
  viewMandi: string;
  soilReport: string;
  whichCropToGrow: string;
  khetiExpense: string;
  askAIQuestions: string;
  khetiLibrary: string;
  myPlots: string;
  calculator: string;
  adminPanel: string;
  settings: string;
  location: string;
  changeLocation: string;
  useGPS: string;
  demoMode: string;
  realMode: string;
  demoNotice: string;
  offlineNotice: string;
  cachedDataNotice: string;
  refreshData: string;
  lastUpdated: string;
  source: string;
  temperature: string;
  rainChance: string;
  wind: string;
  humidity: string;
  hourlyForecast: string;
  sevenDayForecast: string;
  mausamSalahTitle: string;
  sowingAdvice: string;
  irrigationAdvice: string;
  pestAdvice: string;
  harvestAdvice: string;
  sellOrHold: string;
  sellVerdict: string;
  holdVerdict: string;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  arrivalQty: string;
  quintal: string;
  selectDistrict: string;
  selectCommodity: string;
  allDistricts: string;
  allCommodities: string;
  searchPlaceholder: string;
  compareMandis: string;
  soilPh: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicCarbon: string;
  soilMoistureQuestion: string;
  uploadReportPhoto: string;
  manualEntry: string;
  analyzeReport: string;
  soilHealthScore: string;
  recommendedCrops: string[];
  disclaimerText: string;
  calculateProfit: string;
  totalCost: string;
  grossRevenue: string;
  estimatedProfit: string;
  seedCost: string;
  fertilizerCost: string;
  labourCost: string;
  irrigationCost: string;
  transportCost: string;
  harvestQty: string;
  salePricePerQtl: string;
  saveRecord: string;
  history: string;
  farmerName: string;
  mobileNumber: string;
  landSize: string;
  bigha: string;
  acre: string;
  primaryCrop: string;
  login: string;
  register: string;
  enterPhone: string;
  demoLogin: string;
  logout: string;
  ownerLogin: string;
  ownerPin: string;
  enterPin: string;
  futureMarketplace: string;
  comingSoon: string;
  languageSelect: string;
  hindi: string;
  english: string;
  rajasthani: string;
  punjabi: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  hi: {
    appName: 'किसान साथी',
    tagline: 'मंडी, मिट्टी और मौसम',
    home: 'होम',
    mausam: 'मौसम',
    mandiBhav: 'मंडी भाव',
    soilSense: 'मेरी मिट्टी',
    profile: 'मेरी प्रोफाइल',
    askAI: 'AI से पूछें',
    weatherTitle: 'आज का मौसम',
    todayWeather: 'आज का मौसम',
    viewMausam: 'मौसम देखें',
    viewMandi: 'मंडी भाव देखें',
    soilReport: 'मिट्टी की रिपोर्ट',
    whichCropToGrow: 'कौन-सी फसल उगाएँ?',
    khetiExpense: 'खेती का खर्च व मुनाफा',
    askAIQuestions: 'AI से सवाल पूछें',
    khetiLibrary: 'खेती की पूरी जानकारी',
    myPlots: 'मेरे खेत',
    calculator: 'खेती कैलकुलेटर',
    adminPanel: 'मालिक डैशबोर्ड (Admin)',
    settings: 'सेटिंग्स',
    location: 'स्थान',
    changeLocation: 'स्थान बदलें',
    useGPS: 'वर्तमान स्थान (GPS)',
    demoMode: 'डेमो मोड',
    realMode: 'रियल डेटा मोड',
    demoNotice: 'DEMO DATA – यह केवल नमूना जानकारी है',
    offlineNotice: 'आप ऑफ़लाइन हैं — सहेजा गया डेटा दिखाया जा रहा है।',
    cachedDataNotice: 'यह जानकारी पहले से सहेजी गई है। लाइव डेटा के लिए इंटरनेट आवश्यक है।',
    refreshData: 'ताज़ा करें (Refresh)',
    lastUpdated: 'अंतिम अपडेट',
    source: 'स्रोत',
    temperature: 'तापमान',
    rainChance: 'बारिश की संभावना',
    wind: 'हवा की गति',
    humidity: 'आर्द्रता (नमी)',
    hourlyForecast: 'घंटेवार मौसम पूर्वानुमान',
    sevenDayForecast: '7 दिनों का मौसम पूर्वानुमान',
    mausamSalahTitle: 'किसान साथी मौसम सलाह',
    sowingAdvice: 'बुवाई सलाह',
    irrigationAdvice: 'सिंचाई सलाह',
    pestAdvice: 'कीट व रोग चेतावनी',
    harvestAdvice: 'कटाई सलाह',
    sellOrHold: 'आज बेचें या रुकें?',
    sellVerdict: 'अभी बेचना उचित',
    holdVerdict: 'कुछ दिन रुकना बेहतर',
    minPrice: 'न्यूनतम भाव',
    maxPrice: 'अधिकतम भाव',
    modalPrice: 'मॉडल भाव',
    arrivalQty: 'आवक मात्रा',
    quintal: 'रु/क्विंटल',
    selectDistrict: 'जिला चुनें',
    selectCommodity: 'फसल / जिंस चुनें',
    allDistricts: 'सभी जिले',
    allCommodities: 'सभी फसलें',
    searchPlaceholder: 'मंडी या फसल खोजें...',
    compareMandis: 'आसपास की मंडियों में भाव तुलना',
    soilPh: 'मिट्टी का pH',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटाश (K)',
    organicCarbon: 'जैविक कार्बन (OC)',
    soilMoistureQuestion: 'आपके खेत की मिट्टी में नमी कितनी है?',
    uploadReportPhoto: 'लैब रिपोर्ट फोटो / PDF अपलोड करें',
    manualEntry: 'हाथ से मान दर्ज करें',
    analyzeReport: 'रिपोर्ट का विश्लेषण करें',
    soilHealthScore: 'मृदा स्वास्थ्य स्कोर',
    recommendedCrops: ['गेहूं', 'सरसों', 'चना', 'बाजरा'],
    disclaimerText: 'यह जानकारी आपकी Soil Report को समझने में सहायता करती है। खाद की सही मात्रा और अंतिम निर्णय के लिए कृषि विशेषज्ञ या कृषि प्रयोगशाला की सलाह लें।',
    calculateProfit: 'खर्च और मुनाफा निकालें',
    totalCost: 'कुल लागत खर्च',
    grossRevenue: 'कुल बिक्री (आय)',
    estimatedProfit: 'अनुमानित शुद्ध मुनाफा',
    seedCost: 'बीज का खर्च',
    fertilizerCost: 'खाद व दवा का खर्च',
    labourCost: 'मजदूरी का खर्च',
    irrigationCost: 'सिंचाई व डीजल का खर्च',
    transportCost: 'मंडी भाड़ा व परिवहन',
    harvestQty: 'कुल उत्पादन (क्विंटल)',
    salePricePerQtl: 'बिक्री भाव (रु/क्विंटल)',
    saveRecord: 'हिसाब सुरक्षित रखें',
    history: 'पुराना हिसाब',
    farmerName: 'किसान का नाम',
    mobileNumber: 'मोबाइल नंबर',
    landSize: 'जमीन का क्षेत्रफल',
    bigha: 'बीघा',
    acre: 'एकड़',
    primaryCrop: 'मुख्य फसलें',
    login: 'लॉगिन करें',
    register: 'किसान पंजीकरण',
    enterPhone: '10 अंकों का मोबाइल नंबर डालें',
    demoLogin: 'सीधा प्रवेश (डेमो मोड)',
    logout: 'लॉगआउट',
    ownerLogin: 'मालिक / एडमिन लॉगिन',
    ownerPin: 'एडमिन गुप्त पिन',
    enterPin: 'पिन दर्ज करें (डिफ़ॉल्ट: 123456)',
    futureMarketplace: 'किसान बाजार (खरीदार व विक्रेता)',
    comingSoon: 'यह सुविधा जल्द उपलब्ध होगी।',
    languageSelect: 'भाषा चुनें / Select Language',
    hindi: 'हिंदी (Hindi)',
    english: 'English (अंग्रेजी)',
    rajasthani: 'राजस्थानी (शीघ्र उपलब्ध)',
    punjabi: 'ਪੰਜਾਬੀ (शीघ्र उपलब्ध)',
  },
  en: {
    appName: 'Kisan Saathi',
    tagline: 'Mandi, Mitti aur Mausam',
    home: 'Home',
    mausam: 'Weather',
    mandiBhav: 'Mandi Prices',
    soilSense: 'SoilSense',
    profile: 'My Profile',
    askAI: 'Ask AI',
    weatherTitle: "Today's Weather",
    todayWeather: "Today's Weather",
    viewMausam: 'Check Weather',
    viewMandi: 'Check Mandi Bhav',
    soilReport: 'Soil Health Report',
    whichCropToGrow: 'Which Crop to Grow?',
    khetiExpense: 'Farm Expense & Profit',
    askAIQuestions: 'Ask AI Assistant',
    khetiLibrary: 'Complete Farming Guide',
    myPlots: 'My Farm Plots',
    calculator: 'Farming Calculator',
    adminPanel: 'Owner Dashboard (Admin)',
    settings: 'Settings',
    location: 'Location',
    changeLocation: 'Change Location',
    useGPS: 'Use Current Location (GPS)',
    demoMode: 'Demo Mode',
    realMode: 'Real Data Mode',
    demoNotice: 'DEMO DATA – Sample information only',
    offlineNotice: 'You are offline — cached data is being displayed.',
    cachedDataNotice: 'This information is cached. Connect to the internet for live data.',
    refreshData: 'Refresh',
    lastUpdated: 'Last Updated',
    source: 'Source',
    temperature: 'Temperature',
    rainChance: 'Rain Probability',
    wind: 'Wind Speed',
    humidity: 'Humidity',
    hourlyForecast: 'Hourly Forecast',
    sevenDayForecast: '7-Day Weather Forecast',
    mausamSalahTitle: 'Kisan Saathi Weather Advisory',
    sowingAdvice: 'Sowing Guidance',
    irrigationAdvice: 'Irrigation Guidance',
    pestAdvice: 'Pest & Weather Alert',
    harvestAdvice: 'Harvesting Precaution',
    sellOrHold: 'Sell Today or Hold?',
    sellVerdict: 'Recommended to Sell',
    holdVerdict: 'Favorable to Hold a few days',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    modalPrice: 'Modal Price',
    arrivalQty: 'Arrivals',
    quintal: '₹/Quintal',
    selectDistrict: 'Select District',
    selectCommodity: 'Select Commodity',
    allDistricts: 'All Districts',
    allCommodities: 'All Crops',
    searchPlaceholder: 'Search mandi or crop...',
    compareMandis: 'Compare Nearby Mandi Prices',
    soilPh: 'Soil pH',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    organicCarbon: 'Organic Carbon (OC)',
    soilMoistureQuestion: 'What is the moisture condition of your soil?',
    uploadReportPhoto: 'Upload Lab Report Photo / PDF',
    manualEntry: 'Enter Lab Values Manually',
    analyzeReport: 'Analyze Soil Report',
    soilHealthScore: 'Soil Health Score',
    recommendedCrops: ['Wheat', 'Mustard', 'Gram', 'Bajra'],
    disclaimerText: 'This advisory helps you interpret your Soil Report. Consult agricultural experts or your local KVK for verified fertilizer dosages and final decisions.',
    calculateProfit: 'Calculate Expense & Profit',
    totalCost: 'Total Production Cost',
    grossRevenue: 'Gross Revenue',
    estimatedProfit: 'Estimated Net Profit',
    seedCost: 'Seed Cost',
    fertilizerCost: 'Fertilizer & Chemicals',
    labourCost: 'Labour Cost',
    irrigationCost: 'Irrigation & Fuel',
    transportCost: 'Mandi Transport & Freight',
    harvestQty: 'Total Yield (Quintals)',
    salePricePerQtl: 'Sale Price (₹/Quintal)',
    saveRecord: 'Save Record',
    history: 'Past Records',
    farmerName: "Farmer's Name",
    mobileNumber: 'Mobile Number',
    landSize: 'Farm Land Area',
    bigha: 'Bigha',
    acre: 'Acre',
    primaryCrop: 'Primary Crops',
    login: 'Login',
    register: 'Farmer Registration',
    enterPhone: 'Enter 10-digit mobile number',
    demoLogin: 'Quick Demo Access',
    logout: 'Logout',
    ownerLogin: 'Owner / Admin Login',
    ownerPin: 'Admin Secret PIN',
    enterPin: 'Enter PIN (Default: 123456)',
    futureMarketplace: 'Kisan Marketplace (Buyers & Sellers)',
    comingSoon: 'This feature will be available soon.',
    languageSelect: 'Select Language / भाषा चुनें',
    hindi: 'हिंदी (Hindi)',
    english: 'English',
    rajasthani: 'राजस्थानी (Coming Soon)',
    punjabi: 'ਪੰਜਾਬੀ (Coming Soon)',
  },
  // Future regional language fallback placeholders
  raj: null as any,
  pa: null as any,
};

// Fallback resolver for regional placeholders
translations.raj = {
  ...translations.hi,
  appName: 'किसान साथी',
  tagline: 'मंडी, माटी अर मौसम',
  todayWeather: 'आज रो मौसम',
  soilSense: 'म्हारी माटी',
  khetiLibrary: 'खेती री पूरी जाणकारी',
  viewMandi: 'मंडी भाव देख्यो',
};

translations.pa = {
  ...translations.hi,
  appName: 'ਕਿਸਾਨ ਸਾਥੀ',
  tagline: 'ਮੰਡੀ, ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ',
  todayWeather: 'ਅੱਜ ਦਾ ਮੌਸਮ',
  soilSense: 'ਮੇਰੀ ਮਿੱਟੀ',
  viewMandi: 'ਮੰਡੀ ਭਾਅ ਦੇਖੋ',
};
