import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Wheat,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FarmingArticle } from '../types';

export const KnowledgeLibrary: React.FC = () => {
  const { t, articlesList, selectedArticle, setSelectedArticle, setActiveScreen } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: 'सभी विषय' },
    { id: 'irrigation', label: 'सिंचाई (Irrigation)' },
    { id: 'pests', label: 'कीट व रोग (Pests)' },
    { id: 'soil', label: 'मिट्टी प्रबंधन (Soil)' },
    { id: 'fertilizer', label: 'खाद व पोषण (Nutrition)' },
    { id: 'schemes', label: 'सरकारी योजनाएं (Schemes)' },
    { id: 'rabi', label: 'रबी फसलें' },
    { id: 'kharif', label: 'खरीफ फसलें' },
  ];

  const filtered = articlesList.filter((art) => {
    const matchesCat = categoryFilter === 'all' || art.category === categoryFilter;
    const matchesSearch =
      art.titleHi.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      (art.crop && art.crop.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Detail View (Screen 24) */}
      {selectedArticle ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>पुस्तकालय में वापस जाएं</span>
          </button>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {selectedArticle.category}
              </span>
              {selectedArticle.crop && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedArticle.crop}
                </span>
              )}
              {selectedArticle.isVerified && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold ml-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>सत्यापित कृषि लेख</span>
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 font-serif leading-snug">
              {selectedArticle.titleHi}
            </h1>

            <p className="text-xs text-gray-600 font-medium bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 leading-relaxed">
              {selectedArticle.summary}
            </p>

            {/* Article Full Content */}
            <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line space-y-2 pt-2 border-t border-gray-100">
              {selectedArticle.content}
            </div>

            {/* Source & Metadata */}
            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500 space-y-1 bg-gray-50 p-3 rounded-2xl">
              <p>
                <strong>प्रामाणिक स्रोत:</strong> {selectedArticle.source}
              </p>
              <p>
                <strong>समीक्षा दिनांक:</strong> {selectedArticle.lastReviewed}
              </p>
              {selectedArticle.tags && (
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {selectedArticle.tags.map((t, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View (Screen 23) */
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 font-serif">
                  {t.khetiLibrary}
                </h2>
                <p className="text-xs text-gray-500">
                  वैज्ञानिक व सरकारी अनुसंधान पर आधारित प्रामाणिक कृषि ज्ञान
                </p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    categoryFilter === c.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="लेख खोजें (उदा. सिंचाई, नैनो यूरिया, फसल बीमा)..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Articles Feed */}
          <div className="space-y-3">
            {filtered.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm hover:border-emerald-300 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {art.category}
                    </span>
                    {art.crop && (
                      <span className="text-[10px] text-gray-500 font-medium">
                        • {art.crop}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <h3 className="text-sm font-extrabold text-gray-900 font-serif group-hover:text-emerald-800 transition">
                  {art.titleHi}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {art.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>स्रोत: {art.source}</span>
                  <span className="text-emerald-700 font-bold group-hover:underline">
                    विस्तार से पढ़ें →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
