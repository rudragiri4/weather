import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudRainWind, 
  CloudSnow, 
  Snowflake, 
  CloudLightning,
  MapPin, 
  Star, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Droplets,
  Wind
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getWeatherCondition, formatWindSpeed } from '../../utils/formatters';

const iconMap = {
  Sun,
  SunDim: Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail: CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning
};

export const WeatherHero = () => {
  const { currentLocation } = useLocation();
  const { weatherData, refreshWeather, toggleFavorite, isFavorite, loading } = useWeather();
  const { tempUnit, windUnit } = useSettings();

  if (!weatherData || !weatherData.current) return null;

  const { current, daily } = weatherData;
  const condition = getWeatherCondition(current.weatherCode);
  const IconComponent = iconMap[condition.icon] || CloudSun;
  const favorited = isFavorite(currentLocation.name);

  const todayDaily = daily[0] || {};

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E172A] to-[#0A101D] border border-slate-800 p-6 md:p-8 shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* Left Column: Location & Temperature */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 text-xs font-semibold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentLocation.name}</span>
              {currentLocation.country && <span className="text-slate-400">, {currentLocation.country}</span>}
            </div>

            <button
              onClick={() => toggleFavorite(currentLocation)}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-2 rounded-full border transition ${
                favorited
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-amber-400'
              }`}
            >
              <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={refreshWeather}
              title="Refresh Live Data"
              className="p-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-cyan-400 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-baseline gap-4">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              {formatTemperature(current.temperature, tempUnit)}
            </h1>
            <div className="space-y-1">
              <div className="text-lg md:text-xl font-bold text-cyan-300 flex items-center gap-2">
                <IconComponent className={`w-7 h-7 ${condition.color}`} />
                {condition.description}
              </div>
              <div className="text-xs font-medium text-slate-400">
                Feels like <span className="text-slate-200 font-semibold">{formatTemperature(current.feelsLike, tempUnit)}</span>
              </div>
            </div>
          </div>

          {/* High / Low & Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-2">
            <div className="flex items-center gap-1 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/40">
              <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
              <span>High: {formatTemperature(todayDaily.maxTemp, tempUnit)}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/40">
              <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
              <span>Low: {formatTemperature(todayDaily.minTemp, tempUnit)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/40">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatWindSpeed(current.windSpeed, windUnit)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/40">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>{current.humidity}% Humidity</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Atmospheric Visual Card */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 w-full lg:w-80 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Atmospheric Summary</span>
            <span className="text-cyan-400 font-mono text-[11px]">LIVE DATA</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">UV Index</span>
              <span className="font-bold text-amber-400">{current.uvIndex} (Max {todayDaily.uvIndexMax || 5})</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Visibility</span>
              <span className="font-bold text-slate-200">{current.visibility} km</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Cloud Cover</span>
              <span className="font-bold text-slate-200">{current.cloudCover}%</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Air Quality Index</span>
              <span className="font-bold text-emerald-400">
                {weatherData.airQuality?.usAqi ?? 42} US AQI
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
