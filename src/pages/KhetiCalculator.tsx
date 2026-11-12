import React, { useState } from 'react';
import { 
  Calculator, 
  Save, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Trash2, 
  AlertCircle, 
  Wheat, 
  CheckCircle2, 
  Receipt 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FarmExpenseRecord } from '../types';
import { cacheService } from '../services/cacheService';

export const KhetiCalculator: React.FC = () => {
  const { t, selectedCrop, currentUser } = useApp();

  // Inputs
  const [cropName, setCropName] = useState(selectedCrop || 'सरसों (Mustard)');
  const [areaAcre, setAreaAcre] = useState('2.5');
  const [seedCost, setSeedCost] = useState('1800');
  const [fertilizerCost, setFertilizerCost] = useState('4200');
  const [labourCost, setLabourCost] = useState('5000');
  const [irrigationCost, setIrrigationCost] = useState('3500');
  const [transportCost, setTransportCost] = useState('1500');
  const [otherCost, setOtherCost] = useState('1000');

  // Harvest & Selling
  const [harvestQty, setHarvestQty] = useState('22'); // quintals
  const [sellingPrice, setSellingPrice] = useState('5650'); // Rs / quintal

  // Past saved records
  const [savedRecords, setSavedRecords] = useState<FarmExpenseRecord[]>(() => {
    return cacheService.getRaw<FarmExpenseRecord[]>(cacheService.KEYS.EXPENSES, [
      {
        id: 'exp_1',
        cropName: 'सरसों (Mustard)',
        areaAcre: 3,
        date: '2026-03-20',
        seedCost: 2100,
        fertilizerCost: 4800,
        labourCost: 6000,
        irrigationCost: 3800,
        transportCost: 1800,
        otherCost: 1200,
        harvestQuantityQtl: 26,
        sellingPricePerQtl: 5500,
        totalCost: 19700,
        totalRevenue: 143000,
        netProfit: 123300,
      },
    ]);
  });

  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);

  // Calculations
  const sCost = parseFloat(seedCost) || 0;
  const fCost = parseFloat(fertilizerCost) || 0;
  const lCost = parseFloat(labourCost) || 0;
  const iCost = parseFloat(irrigationCost) || 0;
  const tCost = parseFloat(transportCost) || 0;
  const oCost = parseFloat(otherCost) || 0;

  const totalCost = sCost + fCost + lCost + iCost + tCost + oCost;
  const hQty = parseFloat(harvestQty) || 0;
  const sPrice = parseFloat(sellingPrice) || 0;
  const totalRevenue = hQty * sPrice;
  const netProfit = totalRevenue - totalCost;
  const isProfit = netProfit >= 0;

  const handleSaveRecord = () => {
    const newRecord: FarmExpenseRecord = {
      id: `exp_${Date.now()}`,
      cropName,
      areaAcre: parseFloat(areaAcre) || 1,
      date: new Date().toISOString().split('T')[0],
      seedCost: sCost,
      fertilizerCost: fCost,
      labourCost: lCost,
      irrigationCost: iCost,
      transportCost: tCost,
      otherCost: oCost,
      harvestQuantityQtl: hQty,
      sellingPricePerQtl: sPrice,
      totalCost,
      totalRevenue,
      netProfit,
    };

    const updated = [newRecord, ...savedRecords];
    setSavedRecords(updated);
    cacheService.setRaw(cacheService.KEYS.EXPENSES, updated);
    setSavedSuccessNotice(true);
    setTimeout(() => setSavedSuccessNotice(false), 3000);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = savedRecords.filter((r) => r.id !== id);
    setSavedRecords(updated);
    cacheService.setRaw(cacheService.KEYS.EXPENSES, updated);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 font-serif">
              {t.calculator} (Kheti Calculator)
            </h2>
            <p className="text-xs text-gray-500">
              लागत, पैदावार और अनुमानित शुद्ध लाभ की गणना
            </p>
          </div>
        </div>
      </div>

      {/* 2. Live Calculation Summary Hero Card */}
      <div
        className={`rounded-3xl p-5 text-white shadow-xl transition-all ${
          isProfit
            ? 'bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800'
            : 'bg-gradient-to-br from-rose-800 to-red-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              {isProfit ? 'अनुमानित शुद्ध मुनाफा' : 'अनुमानित घाटा / हानि'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black">
                ₹{Math.abs(netProfit).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              {cropName} ({areaAcre} एकड़ खेत)
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="bg-black/20 p-2 rounded-xl text-xs">
              <span className="text-[10px] text-gray-300 block">कुल आय (राजस्व)</span>
              <span className="font-extrabold text-amber-300">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-black/20 p-2 rounded-xl text-xs">
              <span className="text-[10px] text-gray-300 block">कुल लागत (खर्च)</span>
              <span className="font-extrabold text-white">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Ratio Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span>प्रति क्विंटल औसत लागत: <strong>₹{hQty > 0 ? Math.round(totalCost / hQty) : 0}</strong></span>
          <span>शुद्ध लाभ प्रति क्विंटल: <strong>₹{hQty > 0 ? Math.round(netProfit / hQty) : 0}</strong></span>
        </div>
      </div>

      {/* 3. Input Form */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 text-xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>लागत खर्च दर्ज करें (Expenses)</span>
        </h3>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">फसल का नाम</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">रकबा (एकड़ / बीघा)</label>
            <input
              type="number"
              step="0.5"
              value={areaAcre}
              onChange={(e) => setAreaAcre(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>
        </div>

        {/* Cost Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">{t.seedCost} (₹)</label>
            <input
              type="number"
              value={seedCost}
              onChange={(e) => setSeedCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">{t.fertilizerCost} (₹)</label>
            <input
              type="number"
              value={fertilizerCost}
              onChange={(e) => setFertilizerCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">{t.labourCost} (₹)</label>
            <input
              type="number"
              value={labourCost}
              onChange={(e) => setLabourCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">{t.irrigationCost} (₹)</label>
            <input
              type="number"
              value={irrigationCost}
              onChange={(e) => setIrrigationCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">{t.transportCost} (₹)</label>
            <input
              type="number"
              value={transportCost}
              onChange={(e) => setTransportCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">अन्य विविध खर्च (₹)</label>
            <input
              type="number"
              value={otherCost}
              onChange={(e) => setOtherCost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
            />
          </div>
        </div>

        {/* Harvest Output and Sale Price */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2.5">
          <div className="bg-amber-50/60 p-2.5 rounded-2xl border border-amber-200">
            <label className="block text-[11px] font-extrabold text-amber-950 mb-1">
              {t.harvestQty}
            </label>
            <input
              type="number"
              value={harvestQty}
              onChange={(e) => setHarvestQty(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-gray-900"
            />
          </div>

          <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-200">
            <label className="block text-[11px] font-extrabold text-emerald-950 mb-1">
              {t.salePricePerQtl}
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-black text-emerald-900"
            />
          </div>
        </div>

        {/* Action Button: Save Record */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSaveRecord}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveRecord}</span>
          </button>
        </div>

        {savedSuccessNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>हिसाब सफलतापूर्वक सहेज लिया गया है!</span>
          </div>
        )}

        <p className="text-[10px] text-gray-500 italic">
          * ध्यान दें: यह गणना आपके द्वारा दर्ज किए गए मूल्यों पर आधारित अनुमान है। वास्तविक मुनाफा मंडी के ग्रेडिंग, नमी कटौती व परिवहन पर निर्भर करता है।
        </p>
      </div>

      {/* 4. Past Saved Records (Screen 25 history) */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-600" />
          <span>{t.history} ({savedRecords.length} रिकॉर्ड)</span>
        </h3>

        <div className="space-y-2">
          {savedRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-extrabold text-gray-900">
                  {rec.cropName} ({rec.areaAcre} एकड़)
                </h4>
                <p className="text-[10px] text-gray-400">दिनांक: {rec.date}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  लागत: ₹{rec.totalCost.toLocaleString('en-IN')} | उत्पादन: {rec.harvestQuantityQtl} क्विंटल
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-800 block">
                    +₹{rec.netProfit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-gray-400">शुद्ध मुनाफा</span>
                </div>
                <button
                  onClick={() => handleDeleteRecord(rec.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
