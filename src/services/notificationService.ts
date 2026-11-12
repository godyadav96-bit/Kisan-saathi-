import { NotificationItem, NotificationPreferences, NotificationType } from '../types';
import { cacheService } from './cacheService';

const NOTIFICATIONS_CACHE_KEY = 'kisan_notifications_list';
const NOTIFICATION_PREFS_KEY = 'kisan_notification_preferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  weatherAlerts: true,
  mandiPriceAlerts: true,
  cropAdvisoryAlerts: true,
  browserPushEnabled: false,
};

export const notificationService = {
  // Check browser permission status
  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  // Request browser push notification permission
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Web Notifications are not supported in this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      const prefs = this.getPreferences();
      prefs.browserPushEnabled = granted;
      this.savePreferences(prefs);

      if (granted) {
        // Show welcome notification
        this.triggerNativeNotification({
          title: '🌾 किसान साथी अलर्ट सक्रिय!',
          message: 'अब आपको महत्वपूर्ण मौसम चेतावनी और मंडी भाव के ताजा अपडेट मिलते रहेंगे।',
          tag: 'welcome-notification',
        });
      }

      return granted;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  },

  // Trigger system/browser push notification
  async triggerNativeNotification(item: { title: string; message: string; tag?: string }): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      return false;
    }

    try {
      // Check if service worker is active for reliable background push
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(item.title, {
            body: item.message,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: item.tag || `kisan-alert-${Date.now()}`,
            data: { url: window.location.origin },
          });
          return true;
        }
      }

      // Fallback to standard Window Notification constructor
      new Notification(item.title, {
        body: item.message,
        icon: '/icon.svg',
        tag: item.tag || `kisan-alert-${Date.now()}`,
      });
      return true;
    } catch (err) {
      console.warn('Could not display native notification:', err);
      return false;
    }
  },

  // Get user notification preferences
  getPreferences(): NotificationPreferences {
    return cacheService.getRaw<NotificationPreferences>(NOTIFICATION_PREFS_KEY, DEFAULT_PREFERENCES);
  },

  savePreferences(prefs: NotificationPreferences): void {
    cacheService.setRaw(NOTIFICATION_PREFS_KEY, prefs);
  },

  // Get all notifications from cache or generate initial contextual alerts
  getNotifications(): NotificationItem[] {
    const list = cacheService.getRaw<NotificationItem[]>(NOTIFICATIONS_CACHE_KEY, []);
    if (list.length === 0) {
      return this.generateInitialAlerts('Jaipur', 'Mustard');
    }
    return list;
  },

  // Add a new notification and trigger native push if enabled
  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'dateFormatted' | 'isRead'>): NotificationItem {
    const list = this.getNotifications();
    const prefs = this.getPreferences();

    // Check preference filters
    if (item.type === 'weather' && !prefs.weatherAlerts) return item as NotificationItem;
    if (item.type === 'mandi' && !prefs.mandiPriceAlerts) return item as NotificationItem;
    if (item.type === 'advisory' && !prefs.cropAdvisoryAlerts) return item as NotificationItem;

    // Check duplicate recent message
    const isDuplicate = list.some(
      (n) => n.title === item.title && Date.now() - new Date(n.timestamp).getTime() < 30 * 60 * 1000
    );
    if (isDuplicate) return list[0];

    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    const updated = [newItem, ...list.slice(0, 49)]; // keep max 50
    cacheService.setRaw(NOTIFICATIONS_CACHE_KEY, updated);

    // Also trigger native push notification if enabled
    if (prefs.browserPushEnabled) {
      this.triggerNativeNotification({
        title: newItem.title,
        message: newItem.message,
        tag: newItem.id,
      });
    }

    return newItem;
  },

  markAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    cacheService.setRaw(NOTIFICATIONS_CACHE_KEY, updated);
  },

  markAllAsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    cacheService.setRaw(NOTIFICATIONS_CACHE_KEY, updated);
  },

  clearAll(): void {
    cacheService.setRaw(NOTIFICATIONS_CACHE_KEY, []);
  },

  getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.isRead).length;
  },

  // Generate initial contextual alerts for Rajasthan farmers
  generateInitialAlerts(district: string = 'Jaipur', crop: string = 'सरसों'): NotificationItem[] {
    const initialList: NotificationItem[] = [
      {
        id: 'notif_init_1',
        type: 'weather',
        title: '⛈️ मौसम चेतावनी: आंशिक बादल व वर्षा संभावना',
        message: `${district} जिले में आगामी 48 घंटों में 35% तक बारिश के आसार हैं। पकी हुई फसलों की कटाई से पहले मौसम पूर्वानुमान की जांच करें और खुले में अनाज न रखें।`,
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        dateFormatted: '25 मिनट पहले',
        isRead: false,
        priority: 'high',
        actionTarget: 'mausam',
        actionLabel: 'मौसम विस्तार से देखें',
      },
      {
        id: 'notif_init_2',
        type: 'mandi',
        title: '📈 मंडी भाव अलर्ट: सरसों में ₹60/क्विंटल की तेजी',
        message: `मुहाना टर्मिनल मंडी में सरसों का मॉडल भाव ₹5,650/क्विंटल दर्ज किया गया। आवक सामान्य रहने से तेल मिलों की मजबूत लिवाली देखी जा रही है।`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        dateFormatted: '2 घंटे पहले',
        isRead: false,
        priority: 'normal',
        actionTarget: 'mandi',
        actionLabel: 'मंडी भाव व निर्णय देखें',
      },
      {
        id: 'notif_init_3',
        type: 'advisory',
        title: '🌾 कृषि सलाह: गेहूं में ताज मूल (CRI) सिंचाई न चूकें',
        message: `बुवाई के 20-25 दिन बाद पहली सिंचाई अति आवश्यक है। देरी करने से कल्ले कम फूटेंगे और उत्पादन में 20% तक गिरावट आ सकती है।`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        dateFormatted: '5 घंटे पहले',
        isRead: true,
        priority: 'high',
        actionTarget: 'library',
        actionLabel: 'पूरी गाइड पढ़ें',
      },
      {
        id: 'notif_init_4',
        type: 'advisory',
        title: '🛡️ PM फसल बीमा योजना: क्लेम समय सीमा सूचना',
        message: `बेमौसम बारिश या ओलावृष्टि से नुकसान होने पर 72 घंटे के भीतर टोल फ्री नंबर 14447 या फसल बीमा ऐप पर दावा अवश्य दर्ज कराएं।`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        dateFormatted: 'कल',
        isRead: true,
        priority: 'normal',
        actionTarget: 'library',
        actionLabel: 'बीमा दावा प्रक्रिया समझें',
      },
    ];

    cacheService.setRaw(NOTIFICATIONS_CACHE_KEY, initialList);
    return initialList;
  },

  // Check live weather conditions and trigger notification if threshold breached
  evaluateWeatherAlerts(weatherCurrent: any, district: string) {
    if (!weatherCurrent) return;
    const rainProb = weatherCurrent.rainProbability || 0;
    const windSpeed = weatherCurrent.windSpeed || 0;
    const tempMax = weatherCurrent.tempMax || 30;

    if (rainProb >= 45) {
      this.addNotification({
        type: 'weather',
        title: '🌧️ वर्षा अलर्ट: सिंचाई व छिड़काव स्थगित रखें',
        message: `${district} में आगामी 24 घंटे में ${rainProb}% वर्षा की संभावना है। खेत में यूरिया का भुरकाव या कीटनाशक स्प्रे टालें।`,
        priority: 'high',
        actionTarget: 'mausam',
        actionLabel: 'मौसम देखें',
      });
    }

    if (windSpeed >= 25) {
      this.addNotification({
        type: 'weather',
        title: '💨 तेज हवाओं की चेतावनी: छिड़काव न करें',
        message: `हवा की गति ${windSpeed} km/h दर्ज की गई है। तेज हवा में स्प्रे करने से दवा उड़ जाती है और पौधों को नुकसान हो सकता है।`,
        priority: 'normal',
        actionTarget: 'mausam',
        actionLabel: 'हवा की स्थिति देखें',
      });
    }
  },

  // Check mandi prices for saved crops and trigger price alert
  evaluateMandiPriceAlerts(records: any[], preferredCrop: string) {
    if (!records || records.length === 0) return;
    const matched = records.find(
      (r) =>
        r.commodity.toLowerCase() === preferredCrop.toLowerCase() ||
        r.commodityHi === preferredCrop
    );

    if (matched && matched.changeAmount && Math.abs(matched.changeAmount) >= 20) {
      const isUp = matched.changeAmount > 0;
      this.addNotification({
        type: 'mandi',
        title: isUp
          ? `📈 ${matched.commodityHi} भाव में ₹${matched.changeAmount} की तेजी`
          : `📉 ${matched.commodityHi} भाव में गिरावट`,
        message: `${matched.mandiName} में ताजा मॉडल भाव ₹${matched.modalPrice}/क्विंटल है। निर्णय सहायता के लिए 'आज बेचें या रुकें?' देखें।`,
        priority: 'normal',
        actionTarget: 'mandi',
        actionLabel: 'मंडी भाव देखें',
      });
    }
  },
};
