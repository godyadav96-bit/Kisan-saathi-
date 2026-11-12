import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Sparkles, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AIChatMessage } from '../types';

export const KisanAIAssistantModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen, location, selectedCrop, t } = useApp();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `राम-राम किसान भाई! मैं हूँ आपका "किसान साथी AI"। आप मुझसे मौसम, मंडी भाव, मिट्टी की जांच (Soil Report), फसल सलाह या सरकारी योजनाओं के बारे में हिंदी या अंग्रेजी में पूछ सकते हैं।`,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      confidence: 'उच्च',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'अगले 3 दिन मौसम कैसा रहेगा?',
    'सरसों के लिए मौसम अनुकूल है क्या?',
    'मेरी मिट्टी का pH 8 है, इसका क्या मतलब है?',
    'गेहूं में पहली सिंचाई कब करें?',
    'आज सरसों का मंडी भाव क्या चल रहा है?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(
        query,
        location,
        selectedCrop,
        messages.slice(-4)
      );

      const aiMsg: AIChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        confidence: response.confidence || 'उच्च',
        sources: response.sources || ['Kisan Saathi Agricultural Engine'],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: AIChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'क्षमा करें, नेटवर्क में देरी के कारण उत्तर नहीं मिल पाया। कृपया पुनः पूछें।',
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया टाइप करके पूछें।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-white">किसान साथी AI</h3>
                <span className="bg-amber-300 text-amber-950 text-[10px] font-black px-1.5 py-0.2 rounded-sm">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                {location.village ? `${location.village}, ` : ''}{location.district} • {selectedCrop}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-emerald-900 shrink-0">सुझाव:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full px-2.5 py-1 text-[11px] font-medium shrink-0 shadow-xs transition active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/60">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-emerald-200' : 'text-gray-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.confidence && !isUser && (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-1 rounded">
                        विश्वसनीयता: {m.confidence}
                      </span>
                    )}
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-emerald-800 bg-white p-3 rounded-2xl w-fit border border-emerald-100 shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>कृषि वैज्ञानिक विश्लेषण कर रहे हैं...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-amber-50/90 border-t border-amber-200 px-3 py-1 text-[10px] text-amber-900 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            AI सलाह निर्णय सहायता के लिए है। रासायनिक खुराक के लिए स्थानीय KVK कृषि विशेषज्ञ से पुष्टि करें।
          </span>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-full transition ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            }`}
            title="बोलकर सवाल पूछें (Voice Input)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'सुन रहा हूँ, बोलिए...' : 'अपना कृषि सवाल यहाँ लिखें...'}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-full shadow-md transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
