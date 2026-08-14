import React from 'react';
import { Calendar, Droplets, ArrowUp, ArrowDown, Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatDate, formatTemperature, getWeatherCondition } from '../../utils/formatters';

const iconMap = {
  Sun,
  SunDim: Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
};

export const WeeklyForecastCard = () => {
  const { weatherData } = useWeather();
  const { tempUnit } = useSettings();

  if (!weatherData || !weatherData.daily) return null;

  const dailyList = weatherData.daily.slice(0, 7);

  // Determine global min and max temp range for the 7 days to draw proportional temp bars
  const allMin = Math.min(...dailyList.map(d => d.minTemp));
  const allMax = Math.max(...dailyList.map(d => d.maxTemp));
  const totalRange = Math.max(allMax - allMin, 1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <span>7-Day Outlook</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">Daily Min / Max</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {dailyList.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode);
          const IconComponent = iconMap[condition.icon] || CloudSun;

          const leftPercent = Math.max(((day.minTemp - allMin) / totalRange) * 100, 0);
          const barWidth = Math.max(((day.maxTemp - day.minTemp) / totalRange) * 100, 8);

          return (
            <div
              key={day.date}
              className="py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-slate-800/30 px-2 rounded-xl transition"
            >
              {/* Day label */}
              <div className="w-24 sm:w-32 shrink-0">
                <div className="font-bold text-slate-200">
                  {idx === 0 ? 'Today' : formatDate(day.date)}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {condition.description}
                </div>
              </div>

              {/* Rain Chance Pill */}
              <div className="w-16 flex items-center gap-1 text-blue-400 text-xs font-semibold shrink-0">
                <Droplets className="w-3.5 h-3.5" />
                <span>{day.precipitationProbabilityMax || 0}%</span>
              </div>

              {/* Icon */}
              <div className="w-10 flex justify-center shrink-0">
                <IconComponent className={`w-5 h-5 ${condition.color}`} />
              </div>

              {/* Visual Temperature Bar */}
              <div className="flex-1 flex items-center gap-3 max-w-xs">
                <span className="w-10 text-right font-medium text-slate-400 text-xs">
                  {formatTemperature(day.minTemp, tempUnit)}
                </span>
                
                <div className="flex-1 h-2 bg-slate-950 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 shadow"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`
                    }}
                  />
                </div>

                <span className="w-10 font-bold text-slate-100 text-xs">
                  {formatTemperature(day.maxTemp, tempUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
