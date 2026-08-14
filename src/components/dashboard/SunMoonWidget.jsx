import React from 'react';
import { Sunrise, Sunset, Sun, Moon } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { formatTime } from '../../utils/formatters';

export const SunMoonWidget = () => {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.daily || !weatherData.daily[0]) return null;

  const today = weatherData.daily[0];
  const sunriseTime = formatTime(today.sunrise);
  const sunsetTime = formatTime(today.sunset);

  // Calculate percentage of day completed
  let dayProgress = 50;
  try {
    const now = new Date();
    const sr = new Date(today.sunrise);
    const ss = new Date(today.sunset);
    if (now >= sr && now <= ss) {
      const totalMs = ss - sr;
      const elapsedMs = now - sr;
      dayProgress = Math.min(Math.max(Math.round((elapsedMs / totalMs) * 100), 5), 95);
    } else if (now > ss) {
      dayProgress = 100;
    } else {
      dayProgress = 0;
    }
  } catch (e) {}

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Sun className="w-5 h-5 text-amber-400" />
          <span>Sunrise & Sunset</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">Solar Arc</span>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-6">
        
        {/* Semi-circle solar trajectory line */}
        <div className="relative w-full h-24 flex items-end justify-center overflow-hidden border-b border-slate-800 pb-1">
          <div className="w-48 h-48 border-2 border-dashed border-slate-700 rounded-full absolute -bottom-24" />
          
          {/* Sun icon along arc */}
          <div
            className="absolute w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shadow-glow-sun transition-all duration-1000"
            style={{
              left: `${dayProgress}%`,
              bottom: `${Math.sin((dayProgress / 100) * Math.PI) * 70}px`
            }}
          >
            <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </div>
        </div>

        {/* Sunrise / Sunset Times */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 font-medium">Sunrise</div>
              <div className="text-sm font-bold text-white">{sunriseTime || '06:15 AM'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 font-medium">Sunset</div>
              <div className="text-sm font-bold text-white">{sunsetTime || '07:45 PM'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
