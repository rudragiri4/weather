import React from 'react';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sun, 
  Cloud, 
  Thermometer, 
  Compass 
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatPressure, 
  getWindDirectionName,
  getUVIndexCategory 
} from '../../utils/formatters';

export const CurrentWeatherCard = () => {
  const { weatherData } = useWeather();
  const { tempUnit, windUnit, pressureUnit } = useSettings();

  if (!weatherData || !weatherData.current) return null;

  const { current } = weatherData;
  const uvCategory = getUVIndexCategory(current.uvIndex);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      subtext: `Dew point ${formatTemperature(current.dewPoint, tempUnit)}`,
      icon: Droplets,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed, windUnit),
      subtext: `${getWindDirectionName(current.windDirection)} (${current.windDirection}°)`,
      icon: Wind,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'pressure',
      label: 'Barometric Pressure',
      value: formatPressure(current.pressure, pressureUnit),
      subtext: current.pressure > 1013 ? 'High pressure system' : 'Low pressure system',
      icon: Gauge,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: `${current.uvIndex} / 12`,
      subtext: `${uvCategory.label} protection level`,
      icon: Sun,
      color: uvCategory.color,
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${current.visibility} km`,
      subtext: current.visibility > 8 ? 'Clear sight distance' : 'Reduced visibility',
      icon: Eye,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'cloud',
      label: 'Cloud Coverage',
      value: `${current.cloudCover}%`,
      subtext: current.cloudCover > 70 ? 'Overcast skies' : current.cloudCover > 30 ? 'Partly cloudy' : 'Clear sky',
      icon: Cloud,
      color: 'text-slate-300',
      bg: 'bg-slate-700/20 border-slate-700/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border ${item.bg} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {item.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
