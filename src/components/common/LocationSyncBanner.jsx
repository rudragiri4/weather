import React, { useState } from 'react';
import { MapPin, Search, Navigation, CloudSun, RefreshCw } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { SearchModal } from './SearchModal';
import { formatTemperature, getWeatherCondition } from '../../utils/formatters';

export const LocationSyncBanner = () => {
  const { currentLocation } = useLocation();
  const { weatherData, loading, refreshWeather } = useWeather();
  const { tempUnit } = useSettings();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const current = weatherData?.current;
  const condition = current ? getWeatherCondition(current.weatherCode) : null;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900/90 via-[#0e1628]/90 to-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Current Selected Location Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentLocation.name}
                </h2>
                {currentLocation.country && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {[currentLocation.admin1, currentLocation.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Lat: {currentLocation.latitude?.toFixed(2)}° • Lon: {currentLocation.longitude?.toFixed(2)}°
              </p>
            </div>
          </div>

          {/* Live Weather Quick Tag & Search toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {current && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-sm font-extrabold text-white">
                  {formatTemperature(current.temperature, tempUnit)}
                </span>
                <span className={`${condition?.color || 'text-cyan-400'} font-medium`}>
                  {condition?.description}
                </span>
              </div>
            )}

            <button
              onClick={() => refreshWeather()}
              disabled={loading}
              title="Refresh Live Data"
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Change City</span>
            </button>
          </div>
        </div>
      </div>

      {searchModalOpen && (
        <SearchModal 
          isOpen={searchModalOpen} 
          onClose={() => setSearchModalOpen(false)} 
        />
      )}
    </>
  );
};
