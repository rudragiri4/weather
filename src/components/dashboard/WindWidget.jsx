import React from 'react';
import { Wind, Compass, Navigation } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatWindSpeed, getWindDirectionName } from '../../utils/formatters';

export const WindWidget = () => {
  const { weatherData } = useWeather();
  const { windUnit } = useSettings();

  if (!weatherData || !weatherData.current) return null;

  const { current } = weatherData;
  const directionName = getWindDirectionName(current.windDirection);

  // Beaufort scale helper
  const getBeaufort = (kmh) => {
    if (kmh < 2) return { scale: 0, desc: 'Calm' };
    if (kmh < 6) return { scale: 1, desc: 'Light Air' };
    if (kmh < 12) return { scale: 2, desc: 'Light Breeze' };
    if (kmh < 20) return { scale: 3, desc: 'Gentle Breeze' };
    if (kmh < 29) return { scale: 4, desc: 'Moderate Breeze' };
    if (kmh < 39) return { scale: 5, desc: 'Fresh Breeze' };
    if (kmh < 50) return { scale: 6, desc: 'Strong Breeze' };
    if (kmh < 62) return { scale: 7, desc: 'High Wind' };
    return { scale: 8, desc: 'Gale Force' };
  };

  const beaufort = getBeaufort(current.windSpeed);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Wind className="w-5 h-5 text-cyan-400" />
          <span>Wind & Gusts</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Beaufort {beaufort.scale} - {beaufort.desc}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        
        {/* Animated Compass Dial */}
        <div className="relative w-28 h-28 flex items-center justify-center border-4 border-slate-800 rounded-full shadow-inner bg-slate-900">
          <span className="absolute top-1 text-[10px] font-bold text-slate-500">N</span>
          <span className="absolute bottom-1 text-[10px] font-bold text-slate-500">S</span>
          <span className="absolute left-1 text-[10px] font-bold text-slate-500">W</span>
          <span className="absolute right-1 text-[10px] font-bold text-slate-500">E</span>

          <div
            className="w-12 h-12 flex items-center justify-center transition-transform duration-700"
            style={{ transform: `rotate(${current.windDirection}deg)` }}
          >
            <Navigation className="w-8 h-8 text-cyan-400 fill-cyan-400/30" />
          </div>
        </div>

        {/* Wind details */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Wind Speed</div>
            <div className="font-display text-3xl font-black text-white">
              {formatWindSpeed(current.windSpeed, windUnit)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400">Wind Direction</span>
              <div className="font-bold text-slate-200">{directionName} ({current.windDirection}°)</div>
            </div>
            <div>
              <span className="text-slate-400">Peak Gusts</span>
              <div className="font-bold text-amber-400">{formatWindSpeed(current.windGusts, windUnit)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
