import { CropInfo, MandiPriceRecord, FarmingArticle, LocationInfo, AdminSettings } from '../types';

export const INITIAL_LOCATION: LocationInfo = {
  state: 'Rajasthan',
  district: 'Jaipur',
  tehsil: 'Sanganer',
  village: 'Muhana',
  pincode: '302029',
  latitude: 26.8048,
  longitude: 75.7483,
  timezone: 'Asia/Kolkata',
  lastUpdated: new Date().toISOString(),
};

export const RAJASTHAN_LOCATIONS = [
  {
    state: 'Rajasthan',
    districts: [
      {
        name: 'Jaipur',
        nameHi: 'जयपुर',
        lat: 26.9124,
        lng: 75.7873,
        tehsils: ['Sanganer', 'Amber', 'Chomu', 'Bassi', 'Chaksu', 'Jamwa Ramgarh'],
        mandis: ['Muhana Mandi (मुहाना)', 'Surajpole Mandi (सूरजपोल)', 'Chomu Mandi (चौमूं)']
      },
      {
        name: 'Sikar',
        nameHi: 'सीकर',
        lat: 27.6094,
        lng: 75.1398,
        tehsils: ['Sikar', 'Fatehpur', 'Laxmangarh', 'Danta Ramgarh', 'Sri Madhopur', 'Neem Ka Thana'],
        mandis: ['Sikar Krishi Upaj Mandi (सीकर)', 'Fatehpur Mandi (फतेहपुर)', 'Sri Madhopur Mandi (श्रीमाधोपुर)']
      },
      {
        name: 'Kotputli-Behror',
        nameHi: 'कोटपूतली-बहरोड़',
        lat: 27.7027,
        lng: 76.2008,
        tehsils: ['Kotputli', 'Behror', 'Bansur', 'Paota', 'Viratnagar', 'Neemrana'],
        mandis: ['Kotputli Mandi (कोटपूतली)', 'Behror Mandi (बहरोड़)', 'Bansur Mandi (बानसूर)']
      },
      {
        name: 'Alwar',
        nameHi: 'अलवर',
        lat: 27.5530,
        lng: 76.6346,
        tehsils: ['Alwar', 'Kishangarh Bas', 'Tijara', 'Rajgarh', 'Ramgarh'],
        mandis: ['Alwar Krishi Mandi (अलवर)', 'Kherli Mandi (खेरली)']
      },
      {
        name: 'Tonk',
        nameHi: 'टोंक',
        lat: 26.1623,
        lng: 75.7885,
        tehsils: ['Tonk', 'Niwai', 'Malpura', 'Deoli', 'Uniara'],
        mandis: ['Tonk Mandi (टोंक)', 'Niwai Mandi (निवाई)']
      }
    ]
  }
];

export const INITIAL_CROPS: CropInfo[] = [
  {
    id: 'crop_wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    category: 'rabi',
    suitableSeason: 'रबी (सर्दियों का मौसम)',
    tempRange: '10°C - 25°C',
    soilRequirements: 'दोमट या बलुई दोमट मिट्टी, उचित जल निकास युक्त (pH 6.5 - 7.5)',
    waterRequirements: 'मध्यम (4-6 सिंचाई, 400-500 mm)',
    sowingPeriod: '15 अक्टूबर से 15 नवंबर (अगेती/समय पर), दिसंबर तक (पछेती)',
    durationDays: '120-140 दिन',
    irrigationStages: [
      { stage: 'ताज मूल अवस्था (CRI)', daysAfterSowing: '20-25 दिन', note: 'यह सबसे महत्वपूर्ण सिंचाई है, न चूकें।' },
      { stage: 'कल्ले फूटने की अवस्था', daysAfterSowing: '40-45 दिन', note: 'पौधे की बढ़वार के लिए आवश्यक।' },
      { stage: 'गाभा अवस्था (तने में गांठें)', daysAfterSowing: '60-65 दिन', note: 'बालियां निकलने से पहले।' },
      { stage: 'फूल आने व दाना बनने की अवस्था', daysAfterSowing: '80-85 दिन', note: 'दाने की मोटाई तय होती है।' },
      { stage: 'दुग्ध अवस्था (Milking)', daysAfterSowing: '100-105 दिन', note: 'हल्की सिंचाई करें, तेज हवा में न करें।' }
    ],
    pestsAndDiseases: [
      { name: 'पीला रतुआ (Yellow Rust)', symptoms: 'पत्तियों पर पीले रंग की धारियां व चूर्ण दिखना।', prevention: 'रोगरोधी किस्में लगाएं (जैसे HD-2967, DBW-187), कृषि वैज्ञानिक की सलाह से प्रोपिकोनाजोल स्प्रे।' },
      { name: 'दीमक (Termite)', symptoms: 'जड़ों को नुकसान, पौधे सूखना।', prevention: 'बीजोपचार करें (क्लोरपायरीफॉस या इमिडाक्लोप्रिड)।' },
      { name: 'माहू / चेपा (Aphids)', symptoms: 'बालियों से रस चूसना, पैदावार घटना।', prevention: 'नीम तेल 5ml/लीटर या कृषि विज्ञान केंद्र के परामर्श अनुसार।' }
    ],
    harvestingInfo: 'जब बालियां सुनहरी पीली हो जाएं और दाने में नमी 12-14% रह जाए, तब कंबाइन या रीपर से कटाई करें।',
    generalGuidance: 'बीज दर: 100 किग्रा/हेक्टेयर। बीज उपचार अवश्य करें। जिंक सल्फेट 25 किग्रा/हेक्टेयर बुवाई के समय डालें।',
    iconName: 'Wheat',
    colorScheme: 'amber',
    isActive: true
  },
  {
    id: 'crop_mustard',
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    category: 'rabi',
    suitableSeason: 'रबी',
    tempRange: '15°C - 25°C',
    soilRequirements: 'हल्की दोमट से भारी दोमट मिट्टी, अच्छी जलनिकासी वाली (pH 6.0 - 7.5)',
    waterRequirements: 'कम से मध्यम (2-3 सिंचाई)',
    sowingPeriod: '1 अक्टूबर से 25 अक्टूबर (राजस्थान के लिए सर्वोत्तम)',
    durationDays: '115-135 दिन',
    irrigationStages: [
      { stage: 'पहली सिंचाई', daysAfterSowing: '30-35 दिन', note: 'शाखाएं निकलते समय।' },
      { stage: 'दूसरी सिंचाई', daysAfterSowing: '60-70 दिन', note: 'फलियां बनते समय (दाना भरते वक्त)।' }
    ],
    pestsAndDiseases: [
      { name: 'चेपा / एफिड (Mustard Aphid)', symptoms: 'फूलों व फलियों पर चिपचिपे कीड़ों का झुंड।', prevention: 'येलो स्टिकी ट्रैप लगाएं। गंभीर प्रकोप में डाईमेथोएट या इमिडाक्लोप्रिड स्प्रे (KVK सलाह पर)।' },
      { name: 'सफेद रोली (White Rust)', symptoms: 'पत्तियों के नीचे सफेद फफोले।', prevention: 'मैनकोजेब 2 ग्राम प्रति लीटर पानी का छिड़काव।' }
    ],
    harvestingInfo: 'जब 75% फलियां पीली पड़ जाएं तब सुबह के समय कटाई करें ताकि फलियां चटकें नहीं।',
    generalGuidance: 'राजस्थान भारत का सबसे बड़ा सरसों उत्पादक राज्य है। उन्नत किस्में: पूसा मस्टर्ड-25, गिरिराज (DRMRIJ-31), RH-749।',
    iconName: 'Sparkles',
    colorScheme: 'yellow',
    isActive: true
  },
  {
    id: 'crop_bajra',
    nameEn: 'Bajra (Pearl Millet)',
    nameHi: 'बाजरा',
    category: 'kharif',
    suitableSeason: 'खरीफ (मानसून)',
    tempRange: '25°C - 35°C',
    soilRequirements: 'बलुई, रेतीली या हल्की दोमट मिट्टी, कम वर्षा में भी उपयुक्त',
    waterRequirements: 'कम (300-350 mm)',
    sowingPeriod: '15 जून से 15 जुलाई (मानसून की पहली बारिश के साथ)',
    durationDays: '75-90 दिन',
    irrigationStages: [
      { stage: 'सूखे की स्थिति में', daysAfterSowing: '30-35 दिन', note: 'गाभा अवस्था में यदि बारिश न हो तो पानी दें।' },
      { stage: 'सिट्टा निकलते समय', daysAfterSowing: '50-55 दिन', note: 'सिट्टे में दाना भरते समय नमी जरूरी है।' }
    ],
    pestsAndDiseases: [
      { name: 'अरगट (Ergot)', symptoms: 'सिट्टे से शहद जैसा चिपचिपा पदार्थ निकलना व बाद में काले पिंड बनना।', prevention: '20% नमक के घोल में बीज डालकर तैरते हल्के बीज अलग करें।' },
      { name: 'जोगिया / डाउनी मिल्ड्यू', symptoms: 'पत्तियों पर पीली धारियां व पौधे का झाड़ीनुमा होना।', prevention: 'मेटालेक्सिल से बीजोपचार करें (6 ग्राम/किग्रा बीज)।' }
    ],
    harvestingInfo: 'जब सिट्टे सूखकर भूरे हो जाएं और डंठल अभी थोड़ा हरा ही रहे, तब सिट्टे काटकर सुखाएं।',
    generalGuidance: 'राजस्थान की प्रमुख खाद्य फसल। उन्नत किस्में: MPMH-17, HHB-67 (Improved), RHB-177।',
    iconName: 'Sun',
    colorScheme: 'orange',
    isActive: true
  },
  {
    id: 'crop_gram',
    nameEn: 'Gram / Chickpea',
    nameHi: 'चना',
    category: 'rabi',
    suitableSeason: 'रबी',
    tempRange: '15°C - 25°C',
    soilRequirements: 'मध्यम से भारी दोमट मिट्टी, अच्छी जलनिकासी वाली (pH 6.5 - 7.5)',
    waterRequirements: 'कम (1-2 सिंचाई)',
    sowingPeriod: '10 अक्टूबर से 5 नवंबर',
    durationDays: '110-130 दिन',
    irrigationStages: [
      { stage: 'शाखाएं बनते समय', daysAfterSowing: '45-50 दिन', note: 'फूल आने से ठीक पहले, फूल आते समय सिंचाई न करें।' },
      { stage: 'घेंटियां बनते समय', daysAfterSowing: '75-80 दिन', note: 'घेंटी (Pod) में दाना बनने के समय।' }
    ],
    pestsAndDiseases: [
      { name: 'फली छेदक (Pod Borer / Helicoverpa)', symptoms: 'फलियों में छेद कर दाना खा जाना।', prevention: 'फेरोमोन ट्रैप लगाएं (5-6 प्रति बीघा), टी-आकार की खूंटियां लगाएं ताकि पक्षी कीड़ों को खा सकें।' },
      { name: 'उकठा रोग (Wilt)', symptoms: 'पौधे का अचानक सूखना, जड़ें काली पड़ना।', prevention: 'ट्राइकोडर्मा विरिडी 5-10 ग्राम/किग्रा बीज से उपचार, फसल चक्र अपनाएं।' }
    ],
    harvestingInfo: 'पत्तियां पीली होकर गिरने लगें और फलियां खड़खड़ाने लगें तब कटाई करें।',
    generalGuidance: 'दलहनी फसल होने के कारण यह जमीन में नाइट्रोजन स्थिर करती है। किस्में: जीएनजी-1581 (गंगा), जीएनजी-2144, सम्राट।',
    iconName: 'CircleDot',
    colorScheme: 'emerald',
    isActive: true
  },
  {
    id: 'crop_maize',
    nameEn: 'Maize / Corn',
    nameHi: 'मक्का',
    category: 'kharif',
    suitableSeason: 'खरीफ / जायद',
    tempRange: '20°C - 32°C',
    soilRequirements: 'गहरी, उपजाऊ दोमट मिट्टी जिसमें जीवांश प्रचुर हो (pH 6.0 - 7.5)',
    waterRequirements: 'मध्यम से अधिक (500-600 mm)',
    sowingPeriod: 'जून के अंत से 15 जुलाई',
    durationDays: '85-105 दिन',
    irrigationStages: [
      { stage: 'घुटने तक ऊंचाई (Knee High)', daysAfterSowing: '25-30 दिन', note: 'पौधे की तेजी से बढ़वार का समय।' },
      { stage: 'नर मंजरी (Tasseling) व सिल्क निकलना', daysAfterSowing: '45-55 दिन', note: 'पानी की कमी से भुट्टे में दाने नहीं बनेंगे।' },
      { stage: 'भुट्टे में दाना भराव (Grain Fill)', daysAfterSowing: '65-75 दिन', note: 'पर्याप्त नमी बनाए रखें।' }
    ],
    pestsAndDiseases: [
      { name: 'फॉल आर्मीवर्म (Fall Armyworm)', symptoms: 'पत्तियों में बड़े-बड़े छेद व पोंगे में कीड़े का मल।', prevention: 'प्रारंभिक अवस्था में नीम तेल का छिड़काव, पोंगे में सूखी रेत या राख डालना।' }
    ],
    harvestingInfo: 'भुट्टे के ऊपर के छिलके सूखकर भूरे हो जाएं और दानों पर नाखून गड़ाने पर दूध न निकले।',
    generalGuidance: 'किस्में: प्रताप मक्का-3, HQPM-1, बायो-9681। जलभराव सहन नहीं कर सकती, नाली बनाकर निकास रखें।',
    iconName: 'Flame',
    colorScheme: 'yellow',
    isActive: true
  },
  {
    id: 'crop_onion',
    nameEn: 'Onion',
    nameHi: 'प्याज',
    category: 'rabi',
    suitableSeason: 'रबी / खरीफ (नर्सरी व रोपाई)',
    tempRange: '13°C - 24°C (कंद विकास के समय)',
    soilRequirements: 'रेतीली दोमट या बलुई दोमट, जीवांश से भरपूर (pH 6.5 - 7.5)',
    waterRequirements: 'नियमित हल्की सिंचाई (10-15 दिन के अंतराल पर)',
    sowingPeriod: 'नर्सरी: अक्टूबर-नवंबर, रोपाई: दिसंबर-जनवरी',
    durationDays: '130-150 दिन (नर्सरी सहित)',
    irrigationStages: [
      { stage: 'रोपाई के तुरंत बाद', daysAfterSowing: '0-2 दिन', note: 'पौध जमाने के लिए हल्की सिंचाई।' },
      { stage: 'कंद बनने का समय (Bulbing)', daysAfterSowing: '60-80 दिन', note: 'पानी की नियमितता रखें।' },
      { stage: 'खुदाई से 15 दिन पहले', daysAfterSowing: '120 दिन', note: 'सिंचाई बंद कर दें ताकि प्याज सड़े नहीं।' }
    ],
    pestsAndDiseases: [
      { name: 'थ्रिप्स (Thrips)', symptoms: 'पत्तियों पर सफेद या चांदी जैसे धब्बे, पत्तियां मुड़ना।', prevention: 'नीले चिपचिपे कार्ड (Blue sticky traps) लगाएं।' },
      { name: 'बैंगनी धब्बा रोग (Purple Blotch)', symptoms: 'पत्तियों पर बैंगनी केंद्र वाले धब्बे।', prevention: 'मैनकोजेब 2.5 ग्राम/लीटर का स्प्रे।' }
    ],
    harvestingInfo: 'जब 50% पौधों की गर्दन गिर जाए (पत्तियां मुड़ जाएं), तब खुदाई करें और छायादार स्थान पर सुखाएं।',
    generalGuidance: 'किस्में: पूसा रेड, पूसा माधवी, भीमा सुपर, नासिक रेड। राजस्थान के सीकर जिले का प्याज प्रसिद्ध है।',
    iconName: 'Layers',
    colorScheme: 'rose',
    isActive: true
  },
  {
    id: 'crop_potato',
    nameEn: 'Potato',
    nameHi: 'आलू',
    category: 'rabi',
    suitableSeason: 'रबी',
    tempRange: '15°C - 20°C (कंद विकास के लिए ठंडी रातें जरूरी)',
    soilRequirements: 'भुरभुरी, रेतीली दोमट मिट्टी जिसमें कंद आसानी से फूल सकें',
    waterRequirements: 'मध्यम (5-7 हल्की सिंचाई)',
    sowingPeriod: '15 अक्टूबर से 10 नवंबर',
    durationDays: '90-110 दिन',
    irrigationStages: [
      { stage: 'अंकुरण के बाद', daysAfterSowing: '20-25 दिन', note: 'हल्का पानी दें।' },
      { stage: 'कंद बनने की शुरुआत (Tuberization)', daysAfterSowing: '45-50 दिन', note: 'मिट्टी चढ़ाना (Earthing-up) अत्यंत आवश्यक है।' },
      { stage: 'कंद वृद्धि', daysAfterSowing: '65-75 दिन', note: 'नमी बनाए रखें।' }
    ],
    pestsAndDiseases: [
      { name: 'अगेती/पछेती झुलसा (Blight)', symptoms: 'पत्तियों पर काले-भूरे धब्बे, पौधे का जलना।', prevention: 'मौसम में बादल व नमी बढ़ते ही कॉपर ऑक्सीक्लोराइड या मैंकोजेब का छिड़काव।' }
    ],
    harvestingInfo: 'पत्तियां सूखने के 10-12 दिन बाद खुदाई करें ताकि कंद का छिलका मजबूत हो जाए।',
    generalGuidance: 'किस्में: कुफरी बहार, कुफरी पुखराज, कुफरी ज्योति। कंद धूप में हरे न होने दें, मिट्टी चढ़ाएं।',
    iconName: 'Apple',
    colorScheme: 'amber',
    isActive: true
  },
  {
    id: 'crop_tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर',
    category: 'zaid',
    suitableSeason: 'सालभर (सर्दियों व गर्मियों की फसल)',
    tempRange: '18°C - 27°C',
    soilRequirements: 'अच्छी जलनिकास युक्त बलुई दोमट या दोमट मिट्टी',
    waterRequirements: 'नियमित मध्यम सिंचाई (ड्रिप सिंचाई सर्वोत्तम)',
    sowingPeriod: 'सर्दियों के लिए रोपाई: सितंबर-अक्टूबर, गर्मियों के लिए: जनवरी-फरवरी',
    durationDays: '110-130 दिन',
    irrigationStages: [
      { stage: 'रोपाई के समय', daysAfterSowing: '0 दिन', note: 'हल्की सिंचाई।' },
      { stage: 'फूल व फल आते समय', daysAfterSowing: '45-60 दिन', note: 'नमी में उतार-चढ़ाव से फल फटने लगते हैं, नियमित पानी दें।' }
    ],
    pestsAndDiseases: [
      { name: 'पर्ण कुंचन वायरस (Leaf Curl Virus)', symptoms: 'पत्तियां ऊपर की ओर मुड़ना, पौधा बौना होना।', prevention: 'रोग फैलाने वाली सफेद मक्खी (Whitefly) पर नियंत्रण रखें।' }
    ],
    harvestingInfo: 'बाजार की दूरी के अनुसार - दूर भेजना हो तो हल्का लाल (Breaker stage), स्थानीय बाजार के लिए पूरा लाल फल तोड़ें।',
    generalGuidance: 'हाइब्रिड किस्में: अभिलाष, हिमसोना, पूसा रूबी, अर्का रक्षक। बांस व तार पर सहारा (Staking) दें।',
    iconName: 'Activity',
    colorScheme: 'red',
    isActive: true
  },
  {
    id: 'crop_rice',
    nameEn: 'Rice / Paddy',
    nameHi: 'धान (चावल)',
    category: 'kharif',
    suitableSeason: 'खरीफ',
    tempRange: '22°C - 35°C',
    soilRequirements: 'चिकनी दोमट या मटियार मिट्टी जिसमें पानी रोकने की क्षमता अधिक हो',
    waterRequirements: 'बहुत अधिक (1000-1200 mm)',
    sowingPeriod: 'नर्सरी: मई-जून, रोपाई: जुलाई',
    durationDays: '120-145 दिन',
    irrigationStages: [
      { stage: 'रोपाई के बाद 2-3 सप्ताह', daysAfterSowing: '0-20 दिन', note: '2-3 सेमी पानी भरा रहना चाहिए।' },
      { stage: 'सिट्टा निकलते समय व दाना भरते समय', daysAfterSowing: '60-90 दिन', note: 'नमी अत्यंत आवश्यक।' }
    ],
    pestsAndDiseases: [
      { name: 'तना छेदक (Stem Borer)', symptoms: 'डेड हार्ट (सफेद सूखी बाली)।', prevention: 'ट्राइकोग्रामा कार्ड लगाएं, कार्टाप हाइड्रोक्लोराइड KVK सलाह पर।' }
    ],
    harvestingInfo: 'जब 80% बालियां सुनहरी हो जाएं और नमी 20% के आसपास हो, तब कटाई करें।',
    generalGuidance: 'राजस्थान के कोटा, बूंदी, हनुमानगढ़ व गंगानगर बेल्ट में मुख्य रूप से उगाया जाता है। बासमती-1121, पूसा-1509।',
    iconName: 'Sprout',
    colorScheme: 'green',
    isActive: true
  },
  {
    id: 'crop_barley',
    nameEn: 'Barley',
    nameHi: 'जौ',
    category: 'rabi',
    suitableSeason: 'रबी',
    tempRange: '12°C - 24°C',
    soilRequirements: 'हल्की से मध्यम दोमट, लवणीय या क्षारीय मिट्टी में भी गेहूं से बेहतर पनपता है',
    waterRequirements: 'कम (2-3 सिंचाई)',
    sowingPeriod: '15 अक्टूबर से 15 नवंबर',
    durationDays: '110-125 दिन',
    irrigationStages: [
      { stage: 'कल्ले फूटते समय', daysAfterSowing: '30-35 दिन', note: 'पहली सिंचाई।' },
      { stage: 'फूल आते समय', daysAfterSowing: '65-70 दिन', note: 'दूसरी सिंचाई।' }
    ],
    pestsAndDiseases: [
      { name: 'कंडवा रोग (Smut)', symptoms: 'बालियों में काले चूर्ण की गांठें।', prevention: 'वीटावैक्स या बाविस्टिन से बीज उपचार (2.5 ग्राम/किग्रा बीज)।' }
    ],
    harvestingInfo: 'जब दाने सख्त हो जाएं और बालियां पूरी तरह पक जाएं, सुबह कटाई करें।',
    generalGuidance: 'कम पानी और कमजोर जमीन के लिए उत्तम रबी फसल। किस्में: आरडी-2035, आरडी-2552, बीएच-902।',
    iconName: 'Wheat',
    colorScheme: 'yellow',
    isActive: true
  }
];

export const INITIAL_MANDI_PRICES: MandiPriceRecord[] = [
  {
    id: 'mp_1',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Muhana Mandi (मुहाना टर्मिनल)',
    commodity: 'Mustard',
    commodityHi: 'सरसों',
    variety: 'Yellow / Desi',
    arrivalQuantityQtl: 1420,
    minPrice: 5350,
    maxPrice: 5850,
    modalPrice: 5650,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 11:30 बजे',
    source: 'AGMARKNET / e-NAM Rajasthan Mandi Board',
    isLive: true,
    priceTrend: 'up',
    changeAmount: 60
  },
  {
    id: 'mp_2',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Surajpole Mandi (सूरजपोल अनाज मंडी)',
    commodity: 'Wheat',
    commodityHi: 'गेहूं',
    variety: 'Dara / Mill Quality',
    arrivalQuantityQtl: 2850,
    minPrice: 2420,
    maxPrice: 2680,
    modalPrice: 2550,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज दोपहर 12:15 बजे',
    source: 'AGMARKNET / e-NAM Rajasthan Mandi Board',
    isLive: true,
    priceTrend: 'up',
    changeAmount: 25
  },
  {
    id: 'mp_3',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Chomu Mandi (चौमूं)',
    commodity: 'Bajra',
    commodityHi: 'बाजरा',
    variety: 'Hybrid / Desi',
    arrivalQuantityQtl: 980,
    minPrice: 2150,
    maxPrice: 2380,
    modalPrice: 2280,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 10:45 बजे',
    source: 'AGMARKNET / e-NAM Rajasthan Mandi Board',
    isLive: true,
    priceTrend: 'stable',
    changeAmount: 0
  },
  {
    id: 'mp_4',
    state: 'Rajasthan',
    district: 'Sikar',
    mandiName: 'Sikar Krishi Upaj Mandi (सीकर)',
    commodity: 'Onion',
    commodityHi: 'प्याज',
    variety: 'Red Onion / Nasik Medium',
    arrivalQuantityQtl: 4200,
    minPrice: 1800,
    maxPrice: 2600,
    modalPrice: 2250,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 09:30 बजे',
    source: 'AGMARKNET / Sikar Mandi Samiti',
    isLive: true,
    priceTrend: 'down',
    changeAmount: -120
  },
  {
    id: 'mp_5',
    state: 'Rajasthan',
    district: 'Sikar',
    mandiName: 'Sikar Krishi Upaj Mandi (सीकर)',
    commodity: 'Gram',
    commodityHi: 'चना',
    variety: 'Chana Desi',
    arrivalQuantityQtl: 750,
    minPrice: 5600,
    maxPrice: 6150,
    modalPrice: 5900,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 11:00 बजे',
    source: 'AGMARKNET / Sikar Mandi Samiti',
    isLive: true,
    priceTrend: 'up',
    changeAmount: 75
  },
  {
    id: 'mp_6',
    state: 'Rajasthan',
    district: 'Kotputli-Behror',
    mandiName: 'Kotputli Mandi (कोटपूतली)',
    commodity: 'Mustard',
    commodityHi: 'सरसों',
    variety: 'Bold Grain 42% Oil',
    arrivalQuantityQtl: 1100,
    minPrice: 5400,
    maxPrice: 5920,
    modalPrice: 5720,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 10:30 बजे',
    source: 'AGMARKNET / Mandi Samiti Kotputli',
    isLive: true,
    priceTrend: 'up',
    changeAmount: 40
  },
  {
    id: 'mp_7',
    state: 'Rajasthan',
    district: 'Kotputli-Behror',
    mandiName: 'Behror Mandi (बहरोड़)',
    commodity: 'Wheat',
    commodityHi: 'गेहूं',
    variety: 'Sharbati / Desi',
    arrivalQuantityQtl: 1600,
    minPrice: 2480,
    maxPrice: 2750,
    modalPrice: 2610,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 11:15 बजे',
    source: 'AGMARKNET / Mandi Samiti Behror',
    isLive: true,
    priceTrend: 'stable',
    changeAmount: 10
  },
  {
    id: 'mp_8',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Muhana Mandi (मुहाना सब्जी मंडी)',
    commodity: 'Tomato',
    commodityHi: 'टमाटर',
    variety: 'Hybrid Round',
    arrivalQuantityQtl: 3100,
    minPrice: 1200,
    maxPrice: 1950,
    modalPrice: 1600,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 08:45 बजे',
    source: 'AGMARKNET / Muhana Market Committee',
    isLive: true,
    priceTrend: 'down',
    changeAmount: -150
  },
  {
    id: 'mp_9',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Muhana Mandi (मुहाना)',
    commodity: 'Potato',
    commodityHi: 'आलू',
    variety: 'Pukhraj / Jyoti',
    arrivalQuantityQtl: 2600,
    minPrice: 1400,
    maxPrice: 1850,
    modalPrice: 1620,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 09:15 बजे',
    source: 'AGMARKNET / Muhana Market Committee',
    isLive: true,
    priceTrend: 'stable',
    changeAmount: 0
  },
  {
    id: 'mp_10',
    state: 'Rajasthan',
    district: 'Jaipur',
    mandiName: 'Chomu Mandi (चौमूं)',
    commodity: 'Maize',
    commodityHi: 'मक्का',
    variety: 'Yellow Corn',
    arrivalQuantityQtl: 580,
    minPrice: 2100,
    maxPrice: 2420,
    modalPrice: 2310,
    priceDate: new Date().toISOString().split('T')[0],
    lastUpdated: 'आज सुबह 10:15 बजे',
    source: 'AGMARKNET / Chomu Mandi Samiti',
    isLive: true,
    priceTrend: 'up',
    changeAmount: 30
  }
];

export const INITIAL_ARTICLES: FarmingArticle[] = [
  {
    id: 'art_1',
    titleHi: 'गेहूं में ताज मूल (CRI) अवस्था पर पहली सिंचाई का महत्व',
    titleEn: 'Importance of First Crown Root Initiation (CRI) Irrigation in Wheat',
    category: 'irrigation',
    summary: 'बुवाई के 20-25 दिन बाद ताज मूल अवस्था पर सिंचाई क्यों जीवनरेखा मानी जाती है और देरी से 30% तक उपज क्यों घट सकती है।',
    content: `गेहूं की फसल में ताज मूल (Crown Root Initiation - CRI) अवस्था बुवाई के 20 से 25 दिन बाद आती है। यह अवस्था पौधे की प्राथमिक जड़ों के बाद स्थायी रेशेदार जड़ों (Crown Roots) के बनने का समय होता है।
    
1. यदि इस समय खेत में नमी की कमी हो जाए तो ताज जड़ें विकसित नहीं हो पातीं और कल्ले (Tillers) फूटने की संख्या बहुत कम हो जाती है।
2. कृषि वैज्ञानिकों के अनुसार, इस एक सिंचाई को चूकने पर 20% से 30% तक पैदावार कम हो सकती है।
3. सिंचाई के 3-4 दिन बाद जब पैर टिकने लायक नमी हो, तब पहली बार यूरिया (लगभग 30-35 किग्रा प्रति बीघा या 60 किग्रा प्रति हेक्टेयर) का टॉप ड्रेसिंग करें।
4. यदि खेत में जिंक की कमी के लक्षण हों तो जिंक सल्फेट या नैनो यूरिया का पर्णीय छिड़काव भी किया जा सकता है।`,
    crop: 'गेहूं (Wheat)',
    season: 'रबी',
    source: 'ICAR - भारतीय कृषि अनुसंधान संस्थान एवं KVK जयपुर',
    lastReviewed: '2026-10-15',
    tags: ['गेहूं', 'सिंचाई', 'CRI', 'उर्वरक'],
    isVerified: true
  },
  {
    id: 'art_2',
    titleHi: 'सरसों में चेपा (माहू) कीट की पहचान और सुरक्षित जैविक/रासायनिक प्रबंधन',
    titleEn: 'Mustard Aphid Identification and IPM Management',
    category: 'pests',
    summary: 'दिसंबर और जनवरी में बादल छाने व उमस बढ़ने पर सरसों पर चेपा का प्रकोप तेजी से फैलता है। जानिए समय रहते बचाव के उपाय।',
    content: `सरसों का चेपा (Mustard Aphid) छोटे हरे या काले रंग के रस चूसक कीड़े होते हैं जो फूलों, कोमल शाखाओं और फलियों पर चिपककर रस चूसते हैं। इससे फलियां पतली रह जाती हैं और दाना नहीं भरता।
    
एकीकृत कीट प्रबंधन (IPM) के चरण:
1. निगरानी: खेत में सुबह-शाम टहलें और पौधे की चोटी व फूलों के नीचे देखें।
2. येलो स्टिकी ट्रैप: खेत में 6 से 8 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं ताकि उड़ने वाले वयस्क चेपे उस पर चिपक जाएं।
3. मित्र कीट संरक्षण: लेडीबर्ड बीटल (लेडीबर्ड भृंग) चेपा का प्राकृतिक शिकारी होता है। यदि ये खेत में प्रचुर हों तो रासायनिक कीटनाशक छिड़कने से बचें।
4. जैविक उपाय: नीम तेल (Neem Oil 1500 ppm) 4-5 मिली प्रति लीटर पानी में मिलाकर शैम्पू के साथ घोल बनाकर स्प्रे करें।
5. रासायनिक उपाय (गंभीर प्रकोप होने पर): डाईमेथोएट 30 EC (1.5 मिली/लीटर) या इमिडाक्लोप्रिड 17.8 SL (0.5 मिली/लीटर) का छिड़काव केवल शाम के समय करें ताकि परागण करने वाली मधुमक्खियों को नुकसान न पहुंचे।`,
    crop: 'सरसों (Mustard)',
    season: 'रबी',
    source: 'सरसों अनुसंधान निदेशालय (DRMR), भरतपुर एवं KVK सीकर',
    lastReviewed: '2026-11-01',
    tags: ['सरसों', 'कीट नियंत्रण', 'चेपा', 'IPM'],
    isVerified: true
  },
  {
    id: 'art_3',
    titleHi: 'मृदा स्वास्थ्य कार्ड (Soil Health Card): 12 पैरामीटर और NPK अनुपात की आसान समझ',
    titleEn: 'Understanding Soil Health Card 12 Parameters and NPK Ratio',
    category: 'soil',
    summary: 'प्रयोगशाला की मिट्टी जांच रिपोर्ट में pH, OC, नाइट्रोजन, फास्फोरस व पोटाश का क्या अर्थ है और सही खाद की मात्रा कैसे चुनें।',
    content: `भारत सरकार के मृदा स्वास्थ्य कार्ड योजना के अंतर्गत 12 महत्वपूर्ण संकेतकों की जांच होती है:
1. प्राथमिक पोषक तत्व: नाइट्रोजन (N), फास्फोरस (P), पोटाश (K)
2. द्वितीयक पोषक तत्व: सल्फर (S)
3. सूक्ष्म पोषक तत्व: जिंक (Zn), आयरन (Fe), कॉपर (Cu), मैंगनीज (Mn), बोरॉन (B)
4. भौतिक एवं रासायनिक गुण: pH (अम्लीय/क्षारीयता), EC (विद्युत चालकता/लवणता), OC (जैविक कार्बन)

मानक पैमाना:
- मिट्टी का pH: 6.5 से 7.5 सबसे उत्तम माना जाता है। 8.0 से अधिक होने पर मिट्टी क्षारीय होती है, जिसमें जिप्सम डालना लाभदायक है।
- जैविक कार्बन (OC): 0.75% से अधिक अच्छा माना जाता है। राजस्थान की रेतीली मिट्टी में यह अक्सर 0.3% - 0.5% मिलता है, जिसे बढ़ाने के लिए गोबर की सड़ी खाद (FYM), वर्मीकम्पोस्ट या हरी खाद (ढैंचा) आवश्यक है।
- कभी भी बिना जांच रिपोर्ट के अंधी-दौड़ में डीएपी या यूरिया न डालें। आवश्यकता से अधिक डीएपी डालने से जमीन सख्त हो जाती है और सूक्ष्म पोषक तत्व पौधे को नहीं मिल पाते।`,
    crop: 'सभी फसलें',
    season: 'सालभर',
    source: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार (Soil Health Mission)',
    lastReviewed: '2026-09-20',
    tags: ['मिट्टी जांच', 'मृदा स्वास्थ्य', 'pH', 'उर्वरक'],
    isVerified: true
  },
  {
    id: 'art_4',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY): दावा प्रक्रिया और महत्वपूर्ण समय सीमा',
    titleEn: 'PM Fasal Bima Yojana: Claim Process and Important Deadlines',
    category: 'schemes',
    summary: 'प्राकृतिक आपदा, बेमौसम बारिश या ओलावृष्टि से नुकसान होने पर 72 घंटे के भीतर सूचना कैसे दें और मुआवजा कैसे प्राप्त करें।',
    content: `प्रधानमंत्री फसल बीमा योजना (PMFBY) किसानों को प्राकृतिक जोखिमों से वित्तीय सुरक्षा प्रदान करती है:
1. प्रीमियम दर: खरीफ फसलों के लिए केवल 2%, रबी फसलों के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5% किसान को देना होता है। शेष प्रीमियम सरकार वहन करती है।
2. स्थानीय आपदा (Localized Calamity): यदि ओलावृष्टि, जलभराव या आकाशीय बिजली/बादल फटने से नुकसान होता है, तो घटना के 72 घंटे के भीतर 'Crop Insurance App' पर या टोल फ्री नंबर 14447 पर सूचना दर्ज कराना अनिवार्य है।
3. कटाई उपरांत नुकसान (Post-Harvest Loss): फसल कटाई के बाद खेत में सूखने के लिए रखी फसल को यदि चक्रवात या बेमौसम बारिश से नुकसान होता है तो 14 दिनों तक सुरक्षा मिलती है।
4. आवश्यक दस्तावेज: आधार कार्ड, खसरा/जमाबंदी नकल, बैंक पासबुक और फसल बुवाई प्रमाण पत्र (पटवारी/ग्राम सेवक रिपोर्ट)।`,
    crop: 'सभी फसलें',
    season: 'खरीफ एवं रबी',
    source: 'PMFBY आधिकारिक पोर्टल व राजस्थान कृषि विभाग',
    lastReviewed: '2026-10-10',
    tags: ['सरकारी योजना', 'फसल बीमा', 'PMFBY', 'मुआवजा'],
    isVerified: true
  },
  {
    id: 'art_5',
    titleHi: 'नैनो यूरिया और नैनो डीएपी: पारंपरिक खादों की तुलना में इस्तेमाल की सही विधि',
    titleEn: 'Nano Urea and Nano DAP: Correct Spray Technique vs Traditional Fertilizers',
    category: 'fertilizer',
    summary: 'नैनो यूरिया की 500 मिली बोतल कैसे 45 किग्रा यूरिया की बोरी का विकल्प बनती है और छिड़काव का सही तरीका क्या है।',
    content: `IFFCO द्वारा विकसित नैनो यूरिया तरल नाइट्रोजन कणों का नैनो-प्रौद्योगिकी रूप है।
    
पारंपरिक यूरिया बनाम नैनो यूरिया:
1. उपयोग क्षमता: पारंपरिक दानेदार यूरिया का केवल 30-40% ही पौधा ले पाता है, बाकी हवा में उड़ जाता है या जमीन में बह जाता है। नैनो यूरिया की उपयोग क्षमता 80% से अधिक है।
2. छिड़काव की सही विधि: 2 से 4 मिली नैनो यूरिया प्रति लीटर पानी में घोलें। पहला छिड़काव कल्ले फूटते समय (बुवाई के 30-35 दिन बाद) और दूसरा छिड़काव फूल आने से पहले करें।
3. सावधानी: नैनो यूरिया का छिड़काव पत्तियों पर किया जाता है, जमीन में डालने के लिए नहीं है। सुबह ओस सूखने के बाद या शाम को 4 बजे के बाद छिड़काव करें। यदि छिड़काव के 12 घंटे में बारिश हो जाए तो दोबारा हल्का स्प्रे करना पड़ सकता है।`,
    crop: 'गेहूं, सरसों, मक्का, सब्जियां',
    season: 'सालभर',
    source: 'इफको (IFFCO) एवं कृषि विज्ञान केंद्र',
    lastReviewed: '2026-11-05',
    tags: ['उर्वरक', 'नैनो यूरिया', 'IFFCO', 'पोषण'],
    isVerified: true
  }
];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  appName: 'किसान साथी – Mandi, Mitti aur Mausam',
  appDescription: 'Complete Indian Agriculture Assistant for Farmers',
  primaryColor: '#15803d',
  defaultLanguage: 'hi',
  defaultState: 'Rajasthan',
  defaultDistrict: 'Jaipur',
  weatherProvider: 'open_meteo',
  mandiDataSource: 'agmarknet',
  demoModeDefault: false,
  isMarketplaceEnabled: false,
  isSubscriptionEnabled: false,
  aiDailyLimit: 25,
  contactPhone: '1800-180-1551 (Kisan Call Centre)',
  contactEmail: 'support@kisansaathi.in'
};
