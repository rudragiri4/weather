import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { HourlyForecastChart } from '../components/dashboard/HourlyForecastChart';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { useSettings } from '../context/SettingsContext';
import { 
  formatTime, 
  formatTemperature, 
  getWeatherCondition, 
  formatWindSpeed, 
  getWindDirection 
} from '../utils/formatters';
import { 
  Clock, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const HourlyPage = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();
  const { tempUnit, windUnit } = useSettings();

  const hourly = weatherData?.hourly || [];
  const next24Hours = hourly.slice(0, 24);

  // Compute 24-hour summary stats
  const temps = next24Hours.map(h => h.temp);
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxRainChance = next24Hours.length > 0 ? Math.max(...next24Hours.map(h => h.precipitationProbability || 0)) : 0;
  const maxWindSpeed = next24Hours.length > 0 ? Math.max(...next24Hours.map(h => h.windSpeed || 0)) : 0;

  return (
    <>
      <SEOHead
        title={`24-Hour Hourly Weather Forecast - ${currentLocation.name} | WeatherSphere`}
        description={`Real-time hour-by-hour temperature, rain probability, wind speed, UV index, and humidity projections for ${currentLocation.name}.`}
        canonicalPath="/hourly"
      />

      <div className="space-y-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                24-Hour Forecast Breakdown
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              High-resolution hourly meteorological telemetry and trends for {currentLocation.name}
            </p>
          </div>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {/* Loading / Error States */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshWeather} />
        ) : next24Hours.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-sm">
            No hourly forecast data available for {currentLocation.name}. Please search another city.
          </div>
        ) : (
          <>
            {/* 24-Hour Summary Highlight Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>24h Peak Temp</span>
                  <ArrowUp className="w-4 h-4 text-rose-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">
                  {formatTemperature(maxTemp, tempUnit)}
                </div>
                <div className="text-[11px] text-slate-400">Warmest point today</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>24h Low Temp</span>
                  <ArrowDown className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">
                  {formatTemperature(minTemp, tempUnit)}
                </div>
                <div className="text-[11px] text-slate-400">Coolest overnight point</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Peak Rain Chance</span>
                  <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <div className="font-display text-2xl font-black text-blue-400">
                  {maxRainChance}%
                </div>
                <div className="text-[11px] text-slate-400">Highest precipitation risk</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Max Gust / Wind</span>
                  <Wind className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-display text-2xl font-black text-cyan-300">
                  {formatWindSpeed(maxWindSpeed, windUnit)}
                </div>
                <div className="text-[11px] text-slate-400">Maximum velocity</div>
              </div>
            </div>

            {/* Dynamic Interactive Chart */}
            <HourlyForecastChart />

            {/* Complete Hourly Detailed Data Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Detailed 24-Hour Telemetry Table
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Scroll horizontally if table overflows
                </span>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                      <th className="py-3 px-3.5 rounded-l-xl">Time</th>
                      <th className="py-3 px-3.5">Condition</th>
                      <th className="py-3 px-3.5">Temp</th>
                      <th className="py-3 px-3.5">Feels Like</th>
                      <th className="py-3 px-3.5">Rain Chance</th>
                      <th className="py-3 px-3.5">Precipitation</th>
                      <th className="py-3 px-3.5">Wind</th>
                      <th className="py-3 px-3.5">Humidity</th>
                      <th className="py-3 px-3.5 rounded-r-xl">UV Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {next24Hours.map((item, idx) => {
                      const cond = getWeatherCondition(item.weatherCode);
                      const windDir = getWindDirection(item.windDirection);
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-3.5 font-bold text-slate-200">
                            {formatTime(item.time)}
                          </td>
                          <td className="py-3.5 px-3.5">
                            <span className={`${cond.color || 'text-cyan-400'} font-medium`}>
                              {cond.description}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 font-black text-white">
                            {formatTemperature(item.temp, tempUnit)}
                          </td>
                          <td className="py-3.5 px-3.5 text-slate-400">
                            {formatTemperature(item.feelsLike, tempUnit)}
                          </td>
                          <td className="py-3.5 px-3.5">
                            <div className="flex items-center gap-1 font-semibold text-blue-400">
                              <Droplets className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.precipitationProbability ?? 0}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3.5 text-slate-300">
                            {item.precipitation != null ? `${item.precipitation} mm` : '0 mm'}
                          </td>
                          <td className="py-3.5 px-3.5 text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span>{formatWindSpeed(item.windSpeed, windUnit)}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({windDir})
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3.5 text-slate-300 font-medium">
                            {item.humidity}%
                          </td>
                          <td className="py-3.5 px-3.5 font-bold text-amber-400">
                            {item.uvIndex ?? 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
