import React, { useState } from 'react';
import {
  X, Wind, Droplets, Thermometer, Sunrise, Sunset, Navigation,
  ChevronRight, Calendar, Compass, Info, Layers
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLocation } from '../../context/LocationContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getWeatherCondition, formatTime } from '../../utils/formatters';

// Format Degrees to DMS (Degrees, Minutes, Seconds) format e.g. N22°18'17", E70°48'10"
const formatDMS = (deg, isLat) => {
  if (deg === undefined || deg === null) return '';
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${dir}${degrees}°${minutes}'${seconds}"`;
};

// Color for wind speed cell background (Windy style matrix)
const getWindBgColor = (speed) => {
  if (speed < 10) return 'bg-cyan-500/20 text-cyan-200';
  if (speed < 20) return 'bg-emerald-500/25 text-emerald-200';
  if (speed < 30) return 'bg-teal-500/30 text-teal-200';
  if (speed < 40) return 'bg-amber-500/35 text-amber-200';
  return 'bg-rose-500/40 text-rose-200 font-bold';
};

// Color for temp text
const getTempColor = (temp) => {
  if (temp <= 15) return 'text-sky-300';
  if (temp <= 25) return 'text-emerald-300';
  if (temp <= 32) return 'text-amber-300';
  return 'text-rose-400 font-extrabold';
};

export const CityForecastMatrix = () => {
  const { weatherData } = useWeather();
  const { currentLocation, hasSearched, clearSearch } = useLocation();
  const { tempUnit, windUnit } = useSettings();
  const [activeCategory, setActiveCategory] = useState('basic');

  // Point 2: Only show this information if user has searched for a city! Otherwise show clean map like Windy.
  if (!hasSearched || !weatherData) return null;

  const { hourly, daily } = weatherData;

  // Filter 3-hour interval forecast items (matching Windy 3-hour grid)
  const matrixItems = (hourly || []).filter((_, idx) => idx % 3 === 0).slice(0, 24);

  // Group matrix items by day
  const dayGroups = [];
  matrixItems.forEach((item) => {
    if (!item?.time) return;
    const d = new Date(item.time);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    const existing = dayGroups.find(g => g.label === dayLabel);
    if (existing) {
      existing.items.push(item);
    } else {
      const dateStr = item.time.split('T')[0];
      const dailyEntry = daily?.find(d => d.date === dateStr);
      dayGroups.push({
        label: dayLabel,
        precipProb: dailyEntry?.precipitationProbabilityMax ?? 0,
        items: [item]
      });
    }
  });

  const dmsLat = formatDMS(currentLocation.latitude, true);
  const dmsLon = formatDMS(currentLocation.longitude, false);
  const timezoneStr = weatherData.timezone || 'UTC';
  const elevationM = weatherData.elevation ?? 120;
  const elevationFt = Math.round(elevationM * 3.28084);
  const todayDaily = daily?.[0];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1020] bg-[#0a0d16]/96 backdrop-blur-2xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col max-h-[175px] sm:max-h-[185px] overflow-hidden">
      
      {/* ── Point 3: Compact Top Category Tabs & Controls Bar (Low profile like Windy) ── */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-950 border-b border-white/8 shrink-0 text-[10px] h-6">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* Red X Button to close and return to clean map */}
          <button
            onClick={clearSearch}
            title="Close forecast detail (return to clean map view)"
            className="w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-black shrink-0 transition shadow hover:scale-110"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="h-3 w-px bg-white/10 mx-0.5 shrink-0" />

          {[
            { id: '1h', label: '1h forecast' },
            { id: 'basic', label: 'Basic' },
            { id: 'wind', label: 'Wind' },
            { id: 'meteogram', label: 'Meteogram' },
            { id: 'air', label: 'Pollen & Air Quality' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded font-bold text-[10px] whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-white/15 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1 text-[9px] text-slate-400 shrink-0">
          <span>Source: <strong className="text-emerald-400">Open-Meteo ECMWF</strong></span>
        </div>
      </div>

      {/* ── Main Compact Content Grid ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left/Center Compact Matrix Table */}
        <div className="flex-1 overflow-x-auto scrollbar-thin p-1 bg-[#080b12]/70">
          <table className="w-full text-center border-collapse min-w-[650px] text-[9px] sm:text-[10px]">
            
            {/* Days Header */}
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02] text-[9px]">
                <th className="py-0.5 px-1 text-left text-slate-500 font-bold w-14 shrink-0 sticky left-0 bg-[#080b12] z-10">
                  Days
                </th>
                {dayGroups.map((group, gi) => (
                  <th
                    key={gi}
                    colSpan={group.items.length}
                    className="py-0.5 border-l border-white/8 font-extrabold text-cyan-300"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{group.label}</span>
                      {group.precipProb > 0 && (
                        <span className="px-1 rounded bg-emerald-500/20 text-emerald-300 text-[8px]">
                          {group.precipProb}%
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Hours Row */}
              <tr className="border-b border-white/6 text-slate-400 font-mono text-[8px] sm:text-[9px]">
                <th className="py-0.5 px-1 text-left text-slate-500 font-semibold sticky left-0 bg-[#080b12] z-10">
                  Hours
                </th>
                {matrixItems.map((item, i) => {
                  const hourLabel = new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                  return (
                    <th key={i} className="py-0.5 font-semibold border-l border-white/5 whitespace-nowrap min-w-[38px]">
                      {hourLabel}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Weather Condition Icon Row */}
              <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-400 font-medium sticky left-0 bg-[#080b12] z-10">
                  Weather
                </td>
                {matrixItems.map((item, i) => {
                  const cond = getWeatherCondition(item.weatherCode);
                  return (
                    <td key={i} className="py-0.5 border-l border-white/5 text-center" title={cond.description}>
                      <span className="text-xs leading-none block">{cond.icon}</span>
                    </td>
                  );
                })}
              </tr>

              {/* Temperature Row */}
              <tr className="border-b border-white/5 font-extrabold hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-400 font-medium sticky left-0 bg-[#080b12] z-10">
                  Temp (°{tempUnit})
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className={`py-0.5 border-l border-white/5 ${getTempColor(item.temp)}`}>
                    {formatTemperature(item.temp, tempUnit)}
                  </td>
                ))}
              </tr>

              {/* Feels Like Row */}
              <tr className="border-b border-white/5 text-slate-400 hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-500 font-medium sticky left-0 bg-[#080b12] z-10">
                  Feels like
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className="py-0.5 border-l border-white/5 text-slate-300 text-[8px] sm:text-[9px]">
                    {formatTemperature(item.feelsLike, tempUnit)}
                  </td>
                ))}
              </tr>

              {/* Precipitation (mm) Row */}
              <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-400 font-medium sticky left-0 bg-[#080b12] z-10">
                  Rain mm
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className="py-0.5 border-l border-white/5 text-blue-300 font-bold text-[8px] sm:text-[9px]">
                    {item.precipitation > 0 ? item.precipitation.toFixed(1) : '-'}
                  </td>
                ))}
              </tr>

              {/* Wind Speed Row */}
              <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-400 font-medium sticky left-0 bg-[#080b12] z-10">
                  Wind {windUnit}
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className={`py-0.5 border-l border-white/5 ${getWindBgColor(item.windSpeed)}`}>
                    {Math.round(item.windSpeed)}
                  </td>
                ))}
              </tr>

              {/* Wind Gusts Row */}
              <tr className="border-b border-white/5 text-slate-400 hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-500 font-medium sticky left-0 bg-[#080b12] z-10">
                  Gusts
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className="py-0.5 border-l border-white/5 text-slate-300 text-[8px] sm:text-[9px]">
                    {Math.round(item.windSpeed * 1.3)}
                  </td>
                ))}
              </tr>

              {/* Wind Direction Arrow Row */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-0.5 px-1 text-left text-slate-400 font-medium sticky left-0 bg-[#080b12] z-10">
                  Wind dir
                </td>
                {matrixItems.map((item, i) => (
                  <td key={i} className="py-0.5 border-l border-white/5 text-center">
                    <div className="flex items-center justify-center">
                      <Navigation
                        className="w-3 h-3 text-cyan-400"
                        style={{ transform: `rotate(${item.windDirection}deg)` }}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Compact Sidebar: About Location Box */}
        <div className="hidden lg:flex flex-col w-48 bg-[#0a0d16] border-l border-white/8 p-1.5 shrink-0 text-[9px] overflow-y-auto">
          <div className="flex items-center justify-between pb-1 border-b border-white/8 mb-1">
            <span className="font-extrabold text-cyan-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" /> About location
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div>
              <div className="font-bold text-white text-xs truncate">{currentLocation.name}</div>
              <div className="text-slate-400 text-[9px] truncate">{currentLocation.country}</div>
            </div>

            <div className="p-1 rounded bg-white/4 border border-white/6 space-y-0.5 font-mono text-[8px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Coords:</span>
                <span className="text-cyan-300 font-bold">{dmsLat}, {dmsLon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timezone:</span>
                <span className="text-slate-200 truncate max-w-[90px]">{timezoneStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elevation:</span>
                <span className="text-slate-200">{elevationM}m ({elevationFt}ft)</span>
              </div>
            </div>

            {todayDaily && (
              <div className="p-1 rounded bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-amber-500/20 space-y-0.5 text-[8px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                    <Sunrise className="w-2.5 h-2.5" /> Sunrise:
                  </span>
                  <span className="font-mono text-amber-200">{formatTime(todayDaily.sunrise)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5 text-indigo-300 font-bold">
                    <Sunset className="w-2.5 h-2.5" /> Sunset:
                  </span>
                  <span className="font-mono text-indigo-200">{formatTime(todayDaily.sunset)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
