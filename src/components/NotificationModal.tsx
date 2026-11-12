import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CloudRain, 
  TrendingUp, 
  Wheat, 
  ShieldAlert, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  BellRing, 
  Send 
} from 'lucide-react';
import { useApp, ActiveScreen } from '../context/AppContext';
import { NotificationItem, NotificationType } from '../types';
import { notificationService } from '../services/notificationService';

export const NotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notifications,
    setNotifications,
    unreadNotificationCount,
    setActiveScreen,
    location,
    selectedCrop,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'weather' | 'mandi' | 'advisory'>('all');
  const [testSentNotice, setTestSentNotice] = useState(false);

  if (!isNotificationModalOpen) return null;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    notificationService.clearAll();
    setNotifications([]);
  };

  const handleAction = (notif: NotificationItem) => {
    handleMarkAsRead(notif.id);
    setIsNotificationModalOpen(false);
    if (notif.actionTarget) {
      setActiveScreen(notif.actionTarget as ActiveScreen);
    }
  };

  // Simulate/Send Test Notification
  const handleSendTestPush = async () => {
    const testItem = notificationService.addNotification({
      type: 'mandi',
      title: '📈 टेस्ट मंडी अलर्ट: सरसों में ₹75 की तेजी',
      message: `${location.district} में सरसों का मॉडल भाव ₹5,720 पहुंच गया है। यह एक परीक्षण पुश नोटिफिकेशन है।`,
      priority: 'high',
      actionTarget: 'mandi',
      actionLabel: 'मंडी भाव देखें',
    });

    setNotifications(notificationService.getNotifications());
    setTestSentNotice(true);
    setTimeout(() => setTestSentNotice(false), 3000);
  };

  const handleEnablePush = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotifications(notificationService.getNotifications());
    }
  };

  const permissionStatus = notificationService.getPermissionStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-emerald-950 rounded-2xl shadow-xs">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  कृषि सूचना केंद्र (Notification Center)
                </h3>
                {unreadNotificationCount > 0 && (
                  <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {unreadNotificationCount} नए
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">
                मौसम चेतावनी, मंडी भाव और फसल सलाह के अलर्ट्स
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        {permissionStatus !== 'granted' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="text-amber-950">
              <span className="font-bold block">फोन / ब्राउज़र पुश नोटिफिकेशन चालू करें</span>
              <span className="text-[10px] text-amber-800">
                ऐप बंद होने पर भी महत्वपूर्ण अलर्ट तुरंत प्राप्त करें
              </span>
            </div>
            <button
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-xs shadow-xs transition active:scale-95 shrink-0"
            >
              अनुमति दें (Enable)
            </button>
          </div>
        )}

        {/* Category Tabs & Actions Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'सभी' },
              { id: 'weather', label: '⛈️ मौसम' },
              { id: 'mandi', label: '📈 मंडी भाव' },
              { id: 'advisory', label: '🌾 फसल सलाह' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadNotificationCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-emerald-700 hover:underline px-1.5 py-0.5 flex items-center gap-1"
                title="सभी को पढ़ा हुआ चिह्नित करें"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">सब पढ़ें</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-gray-400 hover:text-rose-600 px-1.5 py-0.5"
                title="सभी साफ़ करें"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-gray-50/50">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isWeather = item.type === 'weather';
              const isMandi = item.type === 'mandi';
              const isAdvisory = item.type === 'advisory';

              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition relative ${
                    item.isRead
                      ? 'bg-white border-gray-100 opacity-80'
                      : 'bg-white border-emerald-200 shadow-xs'
                  }`}
                >
                  {!item.isRead && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  )}

                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isWeather
                          ? 'bg-blue-100 text-blue-700'
                          : isMandi
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isWeather && <CloudRain className="w-4 h-4" />}
                      {isMandi && <TrendingUp className="w-4 h-4" />}
                      {isAdvisory && <Wheat className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 pr-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-gray-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-medium">
                          {item.dateFormatted}
                        </span>

                        {item.actionTarget && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(item);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 transition flex items-center gap-1 active:scale-95"
                          >
                            <span>{item.actionLabel || 'देखें'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-gray-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-gray-300" />
              <p className="font-bold text-gray-600">कोई नई सूचना नहीं है।</p>
              <p className="text-[11px]">महत्वपूर्ण अपडेट आने पर यहाँ तुरंत सूचित किया जाएगा।</p>
            </div>
          )}
        </div>

        {/* Footer with Test Alert Button */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="text-[10px] text-gray-500">
            {testSentNotice ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ✓ टेस्ट नोटिफिकेशन सफलतापूर्वक भेजा गया!
              </span>
            ) : (
              <span>अलर्ट सिस्टम सक्रिय</span>
            )}
          </div>

          <button
            onClick={handleSendTestPush}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>टेस्ट अलर्ट भेजें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
