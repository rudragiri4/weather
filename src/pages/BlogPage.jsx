import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { BlogCard } from '../components/blog/BlogCard';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../services/blogData';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { useSettings } from '../context/SettingsContext';
import { 
  formatTemperature, 
  getWeatherCondition, 
  formatWindSpeed,
  getAQIDetails
} from '../utils/formatters';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Droplets, 
  Wind, 
  Gauge, 
  ShieldAlert, 
  Sun,
  Activity,
  Layers
} from 'lucide-react';

export const BlogPage = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();
  const { tempUnit, windUnit } = useSettings();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const current = weatherData?.current;
  const hourly = weatherData?.hourly || [];
  const daily = weatherData?.daily || [];
  const aq = weatherData?.airQuality;

  // Filtered Educational Posts
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCat === 'All' || post.category === selectedCat;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate dynamic meteorological intelligence
  const next24Temps = hourly.slice(0, 24).map(h => h.temp);
  const max24Temp = next24Temps.length > 0 ? Math.max(...next24Temps) : current?.temperature;
  const min24Temp = next24Temps.length > 0 ? Math.min(...next24Temps) : current?.temperature;
  const tempRangeDelta = (max24Temp - min24Temp).toFixed(1);

  const maxRain24 = hourly.slice(0, 24).reduce((max, h) => Math.max(max, h.precipitationProbability || 0), 0);
  const total7DayRain = daily.slice(0, 7).reduce((sum, d) => sum + (d.precipitationSum || 0), 0).toFixed(1);

  const pressureHpa = current?.pressure ?? 1013;
  const pressureCondition = pressureHpa >= 1018 
    ? 'High Pressure Ridge (Stable, clear atmospheric conditions)'
    : pressureHpa <= 1008 
    ? 'Low Pressure Depression (Elevated cloud formation & storm potential)'
    : 'Standard Barometric Equilibrium (Neutral atmospheric gradient)';

  const aqiInfo = aq?.usAqi != null ? getAQIDetails(aq.usAqi) : null;

  return (
    <>
      <SEOHead
        title={`Weather Insights, Live Analysis & Meteorology Science - ${currentLocation.name} | WeatherSphere`}
        description={`Real-time atmospheric insights for ${currentLocation.name}, plus in-depth guides on Doppler radar, wind streamlines, and air quality science.`}
        canonicalPath="/blog"
      />

      <div className="space-y-8 py-6 sm:py-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Weather Insights & Atmospheric Science
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time meteorological intelligence for {currentLocation.name} alongside educational meteorology tutorials
          </p>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {/* ── Section 1: Real-Time Dynamic Location Intelligence ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Live Meteorological Intelligence for {currentLocation.name}
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live API Data
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage message={error} onRetry={refreshWeather} />
          ) : !current ? (
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-sm">
              Telemetry currently unavailable for this station.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Thermal & Temperature Dynamic Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Thermal Trend & Variance
                  </span>
                  <span className="text-xs font-black text-amber-400">
                    {formatTemperature(current.temperature, tempUnit)}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  Diurnal Temperature Range: {tempRangeDelta}°{tempUnit}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Temperatures across the next 24 hours swing from a low of {formatTemperature(min24Temp, tempUnit)} to a high of {formatTemperature(max24Temp, tempUnit)}. Apparent thermal comfort currently feels like {formatTemperature(current.feelsLike, tempUnit)}.
                </p>
              </div>

              {/* Moisture & Precipitation Dynamic Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Precipitation & Moisture
                  </span>
                  <span className="text-xs font-black text-blue-400">
                    {maxRain24}% Max Risk
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  7-Day Projected Total: {total7DayRain} mm
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Relative atmospheric humidity stands at {current.humidity}%. {maxRain24 > 40 ? 'Significant rain probability detected over the next 24 hours. Keep umbrellas handy.' : 'Moisture levels indicate stable skies with low immediate precipitation probability.'}
                </p>
              </div>

              {/* Barometric Pressure & Stability Dynamic Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    Barometric Dynamics
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {Math.round(pressureHpa)} hPa
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {pressureHpa >= 1015 ? 'High Pressure System' : pressureHpa <= 1008 ? 'Low Pressure System' : 'Normal Pressure'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pressureCondition}. Surface wind flow is sustained at {formatWindSpeed(current.windSpeed, windUnit)} with gusts up to {formatWindSpeed(current.windGusts, windUnit)}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 2: Informational & Educational Articles ── */}
        <div className="space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Educational Meteorology & Science Library
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated articles explaining radar reflectivity, wind streamlines, and air quality standards
              </p>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCat === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
