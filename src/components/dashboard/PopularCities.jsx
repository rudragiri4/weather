import React from 'react';
import { Globe, MapPin, ChevronRight } from 'lucide-react';
import { POPULAR_CITIES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';

export const PopularCities = () => {
  const { setLocation, currentLocation } = useLocation();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>Global Weather Hubs</span>
        </div>
        <span className="text-xs text-slate-400">Click to switch station</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentLocation.name.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => setLocation(city)}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition group ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/50 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{city.flag}</span>
                <div>
                  <div className={`text-xs font-bold transition ${isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                    {city.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{city.country}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
