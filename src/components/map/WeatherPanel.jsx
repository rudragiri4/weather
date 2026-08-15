import React, { useState } from 'react';
import {
  X, Wind, Droplets, Gauge, Eye, Sun, Cloud, Thermometer,
  Sunrise, Sunset, Star, RefreshCw, ArrowUp, ArrowDown,
  Navigation, Activity, MapPin, Search, Compass, Sparkles,
  Clock, ShieldCheck
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLocation } from '../../context/LocationContext';
import { useSettings } from '../../context/SettingsContext';
import {
  formatTemperature, formatWindSpeed, formatPressure,
  getWeatherCondition, getWindDirectionName, getAQIDetails,
  getUVIndexCategory, formatTime
} from '../../utils/formatters';
import { searchLocations } from '../../services/geocodingService';

// Popular quick pick cities for instant search in empty state
const QUICK_CITIES = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 }
];

// Color map for weather conditions
const CONDITION_GRADIENTS = {
  clear: 'from-amber-500/20 via-orange-500/10 to-transparent',
  cloudy: 'from-slate-600/25 via-slate-700/15 to-transparent',
  rain: 'from-blue-600/25 via-cyan-700/15 to-transparent',
  snow: 'from-sky-400/25 via-blue-400/15 to-transparent',
  storm: 'from-purple-600/25 via-indigo-600/15 to-transparent',
  fog: 'from-slate-500/25 via-slate-600/15 to-transparent',
  default: 'from-cyan-600/20 via-blue-600/10 to-transparent',
};

const getConditionGradient = (code) => {
  if (code === 0 || code === 1) return CONDITION_GRADIENTS.clear;
  if (code === 2 || code === 3) return CONDITION_GRADIENTS.cloudy;
  if (code >= 51 && code <= 67) return CONDITION_GRADIENTS.rain;
  if (code >= 71 && code <= 86) return CONDITION_GRADIENTS.snow;
  if (code >= 95) return CONDITION_GRADIENTS.storm;
  if (code === 45 || code === 48) return CONDITION_GRADIENTS.fog;
  return CONDITION_GRADIENTS.default;
};

const PROVIDER_LABELS = {
  'open-meteo': { label: 'Open-Meteo', color: '#10b981' },
  'openweather': { label: 'OpenWeather', color: '#f59e0b' },
  'windy': { label: 'Windy API', color: '#06b6d4' },
};

export const WeatherPanel = ({ onClose }) => {
  const { weatherData, refreshWeather, toggleFavorite, isFavorite, loading } = useWeather();
  const { currentLocation, setLocation, detectLocation, isDetecting, hasSearched } = useLocation();
  const { tempUnit, windUnit, pressureUnit } = useSettings();
  const [activeTab, setActiveTab] = useState('now');

  const tabs = [
    { id: 'now', label: 'Now', icon: '🌡' },
    { id: 'hourly', label: '24H', icon: '⏱' },
    { id: 'week', label: '7 Days', icon: '📅' },
    { id: 'aqi', label: 'Air', icon: '💨' },
  ];

  // ── 1. LOADING STATE (When fetching weather data) ──
  if (!weatherData || loading) {
    return (
      <div className="absolute left-2.5 sm:left-3 top-14 sm:top-16 z-[1000] w-[calc(100vw-20px)] xs:w-[310px] sm:w-[335px] max-h-[calc(100vh-80px)] flex flex-col animate-slideInLeft weather-panel-container pointer-events-auto">
        <div className="bg-[#0e1628]/95 backdrop-blur-3xl border border-white/12 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.65)] p-5 space-y-3 text-center">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 animate-spin">
            <RefreshCw className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-200">Fetching live weather data for {currentLocation.name}...</p>
        </div>
      </div>
    );
  }

  // ── 2. COMPLETE WEATHER DETAILS STATE ──
  const { current, daily, hourly, airQuality } = weatherData;
  const condition = getWeatherCondition(current.weatherCode);
  const aqiInfo = getAQIDetails(airQuality?.usAqi);
  const uvCat = getUVIndexCategory(current.uvIndex);
  const favd = isFavorite(currentLocation.name);
  const condGrad = getConditionGradient(current.weatherCode);
  const provider = weatherData?.provider || 'open-meteo';
  const providerInfo = PROVIDER_LABELS[provider] || PROVIDER_LABELS['open-meteo'];

  const MetricCard = ({ icon, label, value, sub, color = 'text-white', badgeColor }) => (
    <div className="bg-[#142034]/90 hover:bg-[#18263e] border border-white/10 hover:border-cyan-500/30 rounded-2xl p-3 space-y-1 transition-all shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
          {icon}
          {label}
        </div>
        {badgeColor && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor}`}>
            {sub}
          </span>
        )}
      </div>
      <div className={`font-black text-base sm:text-lg tracking-tight ${color}`}>{value}</div>
      {!badgeColor && sub && <div className="text-cyan-300/80 text-[11px] font-medium">{sub}</div>}
    </div>
  );

  return (
    <div className="absolute left-3 top-14 sm:top-16 z-[1000] w-[310px] sm:w-[335px] max-h-[calc(100vh-80px)] flex flex-col animate-slideInLeft weather-panel-container pointer-events-auto">
      <div className="bg-[#0e1628]/95 backdrop-blur-3xl border border-white/12 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-full">

        {/* Location Header with condition gradient */}
        <div className={`px-4 pt-4 pb-3 bg-gradient-to-br ${condGrad} border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="font-display text-lg font-black text-white truncate drop-shadow-sm">
                  {currentLocation.name}
                </h2>
                <button
                  onClick={() => toggleFavorite(currentLocation)}
                  className={`shrink-0 transition-transform hover:scale-125 ${favd ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
                  title={favd ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Star className={`w-3.5 h-3.5 ${favd ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
              <p className="text-slate-300 text-[11px] font-medium truncate">
                {[currentLocation.admin1, currentLocation.country].filter(Boolean).join(', ') || 'Selected Area'} · {currentLocation.latitude?.toFixed(2)}°, {currentLocation.longitude?.toFixed(2)}°
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={refreshWeather}
                title="Refresh live weather data"
                className="p-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-300 hover:text-white hover:bg-white/15 transition"
                  title="Close weather panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-white/8 bg-[#09101d]/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[11px] font-extrabold transition-all ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 weather-panel-scroll bg-[#0b1322]/40">

          {/* ── NOW TAB ── */}
          {activeTab === 'now' && (
            <div className="p-4 space-y-3.5">
              {/* Big temperature display card */}
              <div className="bg-[#142034]/90 border border-white/10 rounded-2xl p-4 text-center shadow-sm backdrop-blur-md">
                <div className="text-6xl sm:text-7xl font-black text-white font-display tracking-tight leading-none drop-shadow-md">
                  {formatTemperature(current.temperature, tempUnit)}
                </div>
                <div className="text-cyan-400 font-extrabold text-sm sm:text-base mt-2 flex items-center justify-center gap-1.5">
                  <span>{condition.description}</span>
                </div>
                <div className="text-slate-300 text-xs font-medium mt-1">
                  Feels like <strong className="text-white">{formatTemperature(current.feelsLike, tempUnit)}</strong>
                </div>
                
                {/* High / Low Temp */}
                <div className="flex justify-center items-center gap-3 mt-3 pt-2.5 border-t border-white/8 text-xs">
                  <span className="flex items-center gap-1 text-rose-400 font-extrabold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                    <ArrowUp className="w-3 h-3" /> High: {formatTemperature(daily[0]?.maxTemp, tempUnit)}
                  </span>
                  <span className="flex items-center gap-1 text-sky-400 font-extrabold bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20">
                    <ArrowDown className="w-3 h-3" /> Low: {formatTemperature(daily[0]?.minTemp, tempUnit)}
                  </span>
                </div>
              </div>

              {/* Wind Card (Dedicated Card with Direction, Speed, Gusts, Compass) */}
              <div className="bg-[#142034]/90 border border-cyan-500/30 rounded-2xl p-3.5 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Conditions
                    </div>
                    <div className="text-2xl font-black text-white">
                      {formatWindSpeed(current.windSpeed, windUnit)}
                    </div>
                    <div className="text-cyan-300 text-xs font-semibold">
                      {getWindDirectionName(current.windDirection)} ({current.windDirection}°)
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Gusts up to <strong className="text-slate-200">{formatWindSpeed(current.windGusts, windUnit)}</strong>
                    </div>
                  </div>

                  {/* Compass Indicator */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.2)]" />
                    <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                    <Navigation
                      className="w-8 h-8 text-cyan-400 transition-transform duration-500"
                      style={{
                        transform: `rotate(${current.windDirection}deg)`,
                        filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))'
                      }}
                    />
                    <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-cyan-300">N</span>
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500">S</span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">W</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">E</span>
                  </div>
                </div>
              </div>

              {/* Metric Cards Grid (Humidity, Pressure, Visibility, UV Index) */}
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  icon={<Droplets className="w-3.5 h-3.5 text-blue-400" />}
                  label="Humidity"
                  value={`${current.humidity}%`}
                  sub={`Dew ${formatTemperature(current.dewPoint, tempUnit)}`}
                  color="text-blue-200"
                />
                <MetricCard
                  icon={<Gauge className="w-3.5 h-3.5 text-emerald-400" />}
                  label="Pressure"
                  value={formatPressure(current.pressure, pressureUnit)}
                  sub={current.pressure >= 1013 ? '↑ High Pressure' : '↓ Low Pressure'}
                  color="text-emerald-200"
                />
                <MetricCard
                  icon={<Eye className="w-3.5 h-3.5 text-purple-400" />}
                  label="Visibility"
                  value={`${current.visibility} km`}
                  sub={current.visibility > 8 ? 'Clear View' : 'Reduced'}
                  color="text-purple-200"
                />
                <MetricCard
                  icon={<Sun className="w-3.5 h-3.5 text-amber-400" />}
                  label="UV Index"
                  value={`${current.uvIndex}`}
                  sub={uvCat.label}
                  color={uvCat.color}
                  badgeColor={uvCat.label === 'Low' ? 'bg-emerald-500/20 text-emerald-300' : uvCat.label === 'Moderate' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}
                />
                <MetricCard
                  icon={<Cloud className="w-3.5 h-3.5 text-slate-300" />}
                  label="Cloud Cover"
                  value={`${current.cloudCover}%`}
                  sub={current.cloudCover > 70 ? 'Overcast' : current.cloudCover > 30 ? 'Partly Cloudy' : 'Clear Sky'}
                  color="text-slate-200"
                />
                <MetricCard
                  icon={<Activity className="w-3.5 h-3.5 text-rose-400" />}
                  label="Precipitation"
                  value={`${current.precipitation} mm`}
                  sub="Current hour"
                  color="text-rose-200"
                />
              </div>

              {/* Sunrise / Sunset */}
              {daily[0] && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2.5 bg-[#142034]/90 border border-amber-500/30 rounded-2xl p-2.5 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Sunrise className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">Sunrise</div>
                      <div className="text-xs font-extrabold text-amber-300">{formatTime(daily[0].sunrise)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#142034]/90 border border-indigo-500/30 rounded-2xl p-2.5 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Sunset className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">Sunset</div>
                      <div className="text-xs font-extrabold text-indigo-300">{formatTime(daily[0].sunset)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback notice */}
              {weatherData?.fallbackNotice && (
                <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-2.5 text-[10px] text-amber-200 font-medium">
                  ⚠️ {weatherData.fallbackNotice}
                </div>
              )}
            </div>
          )}

          {/* ── HOURLY TAB ── */}
          {activeTab === 'hourly' && (
            <div className="divide-y divide-white/8 p-1">
              {(hourly || []).slice(0, 24).map((item, i) => {
                const cond = getWeatherCondition(item.weatherCode);
                const timeStr = (() => {
                  try {
                    const d = new Date(item.time);
                    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                  } catch { return item.time; }
                })();
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition text-xs">
                    <span className="text-slate-400 w-16 font-mono text-[11px]">{timeStr}</span>
                    <span className={`flex-1 font-semibold ${cond.color} truncate px-2`}>{cond.description}</span>
                    {item.precipitationProbability > 0 && (
                      <span className="text-cyan-400 font-bold w-10 text-right">{item.precipitationProbability}%</span>
                    )}
                    <span className="font-black text-white w-12 text-right">
                      {formatTemperature(item.temp, tempUnit)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── WEEK TAB ── */}
          {activeTab === 'week' && (
            <div className="divide-y divide-white/8 p-1">
              {(daily || []).slice(0, 7).map((day, i) => {
                const cond = getWeatherCondition(day.weatherCode);
                const allMin = Math.min(...daily.slice(0, 7).map(d => d.minTemp));
                const allMax = Math.max(...daily.slice(0, 7).map(d => d.maxTemp));
                const range = Math.max(allMax - allMin, 1);
                const left = ((day.minTemp - allMin) / range) * 100;
                const width = Math.max(((day.maxTemp - day.minTemp) / range) * 100, 8);

                let dateLabel;
                try {
                  dateLabel = i === 0 ? 'Today' : new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                } catch { dateLabel = day.date; }

                return (
                  <div key={day.date} className="px-3 py-2.5 hover:bg-white/5 rounded-xl transition">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-200 w-24 truncate">{dateLabel}</span>
                      <span className={`flex-1 font-semibold ${cond.color} truncate px-1.5`}>{cond.description}</span>
                      {day.precipitationProbabilityMax > 0 && (
                        <span className="text-cyan-400 font-bold text-[11px]">{day.precipitationProbabilityMax}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-sky-400 font-bold w-10 text-right">{formatTemperature(day.minTemp, tempUnit)}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 rounded-full"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            background: 'linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #f59e0b, #ef4444)'
                          }}
                        />
                      </div>
                      <span className="font-black text-rose-400 w-10">{formatTemperature(day.maxTemp, tempUnit)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── AQI TAB ── */}
          {activeTab === 'aqi' && airQuality && (
            <div className="p-4 space-y-4">
              <div className="bg-[#142034]/90 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={aqiInfo.color || '#10b981'}
                      strokeWidth="10"
                      strokeDasharray={`${Math.min((airQuality.usAqi / 300) * 251, 251)} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-black text-white">{airQuality.usAqi}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">US AQI</div>
                  </div>
                </div>
                <div className={`text-sm font-black ${aqiInfo.text}`}>{aqiInfo.label}</div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{aqiInfo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'PM2.5', value: airQuality.pm2_5?.toFixed(1), unit: 'µg/m³', color: 'text-rose-400' },
                  { label: 'PM10', value: airQuality.pm10?.toFixed(1), unit: 'µg/m³', color: 'text-amber-400' },
                  { label: 'NO₂', value: airQuality.no2?.toFixed(1), unit: 'µg/m³', color: 'text-orange-400' },
                  { label: 'O₃', value: airQuality.o3?.toFixed(1), unit: 'µg/m³', color: 'text-cyan-400' },
                  { label: 'SO₂', value: airQuality.so2?.toFixed(1), unit: 'µg/m³', color: 'text-yellow-400' },
                  { label: 'CO', value: Math.round(airQuality.co), unit: 'µg/m³', color: 'text-purple-400' },
                ].map(p => (
                  <div key={p.label} className="bg-[#142034]/90 border border-white/10 rounded-2xl p-2.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{p.label}</div>
                    <div className={`text-sm font-black ${p.color} mt-0.5`}>{p.value}</div>
                    <div className="text-[9px] text-slate-400">{p.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Data source badge + Last updated time + Coords */}
        <div className="px-4 py-2.5 border-t border-white/8 bg-[#09101d]/80 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <div className="w-2 h-2 rounded-full" style={{ background: providerInfo.color }} />
            <span>Data: <strong style={{ color: providerInfo.color }}>{providerInfo.label}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[9px]">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>{current?.time ? formatTime(current.time) : 'Live'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

