import React, { useState } from 'react';
import { X, MapPin, Navigation, Check, AlertCircle, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RAJASTHAN_LOCATIONS } from '../data/mockData';
import { LocationInfo } from '../types';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation, t } = useApp();

  const [stateName, setStateName] = useState(location.state || 'Rajasthan');
  const [district, setDistrict] = useState(location.district || 'Jaipur');
  const [tehsil, setTehsil] = useState(location.tehsil || 'Sanganer');
  const [village, setVillage] = useState(location.village || 'Muhana');
  const [pincode, setPincode] = useState(location.pincode || '302029');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const currentDistricts = RAJASTHAN_LOCATIONS[0].districts;
  const selectedDistrictData = currentDistricts.find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );
  const availableTehsils = selectedDistrictData ? selectedDistrictData.tehsils : [];

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const dData = currentDistricts.find((d) => d.name === newDistrict);
    if (dData && dData.tehsils.length > 0) {
      setTehsil(dData.tehsils[0]);
    }
  };

  const handleSave = () => {
    const dData = currentDistricts.find((d) => d.name === district);
    const newLocation: LocationInfo = {
      state: stateName,
      district,
      tehsil: tehsil || 'Central',
      village: village || 'Village',
      pincode: pincode.trim(),
      latitude: dData ? dData.lat : location.latitude,
      longitude: dData ? dData.lng : location.longitude,
      timezone: 'Asia/Kolkata',
      lastUpdated: new Date().toISOString(),
    };
    setLocation(newLocation);
    setIsLocationModalOpen(false);
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('आपके ब्राउज़र में GPS सुविधा उपलब्ध नहीं है।');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding via Open-Meteo or OSM Nominatim
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'hi,en' } }
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const addr = geoData.address || {};
            const detectedDistrict = addr.state_district || addr.county || addr.city || district;
            const detectedVillage = addr.village || addr.suburb || addr.town || village;
            const detectedState = addr.state || 'Rajasthan';
            const detectedPincode = addr.postcode || pincode;

            const updatedLocation: LocationInfo = {
              state: detectedState,
              district: detectedDistrict,
              tehsil: addr.subdistrict || tehsil,
              village: detectedVillage,
              pincode: detectedPincode,
              latitude,
              longitude,
              timezone: 'Asia/Kolkata',
              lastUpdated: new Date().toISOString(),
            };
            setLocation(updatedLocation);
            setIsGpsLoading(false);
            setIsLocationModalOpen(false);
            return;
          }
        } catch (e) {
          console.warn('Reverse geocoding fallback to coords', e);
        }

        // Direct coords fallback
        const updatedLocation: LocationInfo = {
          state: stateName,
          district,
          tehsil,
          village: village || 'वर्तमान स्थान (GPS)',
          pincode,
          latitude,
          longitude,
          timezone: 'Asia/Kolkata',
          lastUpdated: new Date().toISOString(),
        };
        setLocation(updatedLocation);
        setIsGpsLoading(false);
        setIsLocationModalOpen(false);
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === 1) {
          setGpsError('GPS अनुमति अस्वीकृत हुई। आप नीचे हाथ से जिला व गाँव चुन सकते हैं।');
        } else {
          setGpsError('स्थान प्राप्त नहीं हो सका। कृपया हाथ से अपना जिला चुनें।');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/50 rounded-xl">
              <MapPin className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.changeLocation}</h3>
              <p className="text-xs text-emerald-200">
                मौसम और मंडी भाव के लिए अपना गाँव/तहसील चुनें
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* GPS Quick Button */}
          <button
            onClick={handleGPSLocation}
            disabled={isGpsLoading}
            className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-2xl py-3 px-4 font-bold text-xs shadow-xs transition active:scale-98"
          >
            <Compass className={`w-4 h-4 text-amber-700 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'स्थान खोजा जा रहा है...' : t.useGPS}</span>
          </button>

          {gpsError && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 font-medium absolute">
              या हाथ से दर्ज करें
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                राज्य (State)
              </label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Rajasthan">राजस्थान (Rajasthan)</option>
                <option value="Haryana" disabled>हरियाणा (Haryana - जल्द उपलब्ध)</option>
                <option value="Madhya Pradesh" disabled>मध्य प्रदेश (MP - जल्द उपलब्ध)</option>
                <option value="Uttar Pradesh" disabled>उत्तर प्रदेश (UP - जल्द उपलब्ध)</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                जिला (District) *
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {currentDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.nameHi} ({d.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Tehsil */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                तहसील (Tehsil)
              </label>
              <select
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableTehsils.map((tName) => (
                  <option key={tName} value={tName}>
                    {tName}
                  </option>
                ))}
                <option value="अन्य">अन्य (Other)</option>
              </select>
            </div>

            {/* Village Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                गाँव / कस्बा (Village / Town) *
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा. मुहाना, चौमूं, श्रीमाधोपुर"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                पिनकोड (Pincode - वैकल्पिक)
              </label>
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="उदा. 302029"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
          >
            रद्द करें
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>स्थान सहेजें (Save)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
