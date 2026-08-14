import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { WeeklyForecastCard } from '../components/dashboard/WeeklyForecastCard';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { useSettings } from '../context/SettingsContext';
import { 
  formatDate, 
  formatTemperature, 
  getWeatherCondition, 
  formatWindSpeed,
  getWindDirection
} from '../utils/formatters';
import { 
  Calendar, 
  Droplets, 
  Wind, 
  Sun, 
  ArrowUp, 
  ArrowDown, 
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sparkles
} from 'lucide-react';

const iconMap = {
  Sun,
  SunDim: Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
};

export const WeeklyPage = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();
  const { tempUnit, windUnit } = useSettings();

  const daily = weatherData?.daily || [];
  const next7Days = daily.slice(0, 7);

  // Compute Weekly Summary Stats
  const maxTemps = next7Days.map(d => d.maxTemp);
  const minTemps = next7Days.map(d => d.minTemp);
  const avgHigh = maxTemps.length > 0 ? (maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length).toFixed(1) : 0;
  const totalRain = next7Days.reduce((sum, d) => sum + (d.precipitationSum || 0), 0).toFixed(1);
  const peakWindDay = next7Days.length > 0 ? next7Days.reduce((prev, curr) => (curr.maxWindSpeed > prev.maxWindSpeed ? curr : prev), next7Days[0]) : null;
  const maxUv = next7Days.length > 0 ? Math.max(...next7Days.map(d => d.uvIndexMax || 0)) : 0;

  return (
    <>
      <SEOHead
        title={`7-Day & 14-Day Weather Forecast - ${currentLocation.name} | WeatherSphere`}
        description={`Extended 7-day weather forecast, daily temperature highs and lows, rain probability, wind speeds, and UV indices for ${currentLocation.name}.`}
        canonicalPath="/weekly"
      />

      <div className="space-y-6 py-6 sm:py-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              7-Day & Extended Outlook
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Extended multi-day atmospheric models and precipitation projections for {currentLocation.name}
          </p>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {/* Loading / Error States */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshWeather} />
        ) : next7Days.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-sm">
            No 7-day forecast data available for {currentLocation.name}. Please try another city.
          </div>
        ) : (
          <>
            {/* 7-Day Summary Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-slate-400 text-xs">7-Day Avg High</div>
                <div className="font-display text-2xl font-black text-white">
                  {formatTemperature(avgHigh, tempUnit)}
                </div>
                <div className="text-[11px] text-slate-400">Mean daytime temperature</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-slate-400 text-xs">Total Rainfall Projected</div>
                <div className="font-display text-2xl font-black text-blue-400">
                  {totalRain} mm
                </div>
                <div className="text-[11px] text-slate-400">Cumulative 7-day accumulation</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-slate-400 text-xs">Windiest Day</div>
                <div className="font-display text-2xl font-black text-cyan-300">
                  {peakWindDay ? formatDate(peakWindDay.date).split(',')[0] : 'N/A'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Up to {peakWindDay ? formatWindSpeed(peakWindDay.maxWindSpeed, windUnit) : '0'}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="text-slate-400 text-xs">Peak UV Index</div>
                <div className="font-display text-2xl font-black text-amber-400">
                  {maxUv}
                </div>
                <div className="text-[11px] text-slate-400">
                  {maxUv >= 8 ? 'Very High (Sun protection needed)' : maxUv >= 6 ? 'High exposure' : 'Moderate exposure'}
                </div>
              </div>
            </div>

            {/* Visual Bar Card */}
            <WeeklyForecastCard />

            {/* Detailed Daily Grid Cards */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Daily Breakdown (Up to 14 Days)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {daily.slice(0, 14).map((day, idx) => {
                  const cond = getWeatherCondition(day.weatherCode);
                  const IconComp = iconMap[cond.icon] || CloudSun;
                  const windDir = getWindDirection(day.dominantWindDirection);

                  return (
                    <div
                      key={day.date}
                      className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3.5 shadow-xl transition group"
                    >
                      {/* Date & Condition Badge */}
                      <div className="flex justify-between items-start border-b border-slate-800/80 pb-3">
                        <div>
                          <span className="font-extrabold text-slate-100 text-sm block">
                            {idx === 0 ? 'Today' : formatDate(day.date)}
                          </span>
                          <span className="text-xs text-cyan-400 font-medium">
                            {cond.description}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                          <IconComp className={`w-5 h-5 ${cond.color}`} />
                        </div>
                      </div>

                      {/* High & Low Temp */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-white">
                            {formatTemperature(day.maxTemp, tempUnit)}
                          </span>
                          <span className="text-xs text-slate-400 block -mt-1 font-medium">High</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-bold text-slate-400">
                            {formatTemperature(day.minTemp, tempUnit)}
                          </span>
                          <span className="text-xs text-slate-500 block -mt-1 font-medium">Low</span>
                        </div>
                      </div>

                      {/* Detailed Metric Pills */}
                      <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/60">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            Rain Chance / Sum
                          </span>
                          <span className="font-semibold text-blue-400">
                            {day.precipitationProbabilityMax ?? 0}% ({day.precipitationSum ?? 0} mm)
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Wind className="w-3.5 h-3.5 text-cyan-400" />
                            Max Wind
                          </span>
                          <span className="font-medium text-slate-200">
                            {formatWindSpeed(day.maxWindSpeed, windUnit)} <span className="text-[10px] text-slate-500">({windDir})</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            Max UV Index
                          </span>
                          <span className="font-bold text-amber-400">
                            {day.uvIndexMax ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
