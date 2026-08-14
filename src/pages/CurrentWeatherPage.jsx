import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { WeatherHero } from '../components/dashboard/WeatherHero';
import { CurrentWeatherCard } from '../components/dashboard/CurrentWeatherCard';
import { SunMoonWidget } from '../components/dashboard/SunMoonWidget';
import { WindWidget } from '../components/dashboard/WindWidget';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { CloudSun } from 'lucide-react';

export const CurrentWeatherPage = () => {
  const { loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();

  return (
    <>
      <SEOHead
        title={`Current Weather in ${currentLocation.name} | WeatherSphere`}
        description={`Real-time current temperature, humidity, pressure, visibility, and atmospheric conditions in ${currentLocation.name}.`}
        canonicalPath="/current"
      />

      <div className="space-y-6 py-6 sm:py-8">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Current Weather Station Overview
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Detailed real-time telemetry and atmospheric conditions for {currentLocation.name}
          </p>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshWeather} />
        ) : (
          <>
            <WeatherHero />
            <CurrentWeatherCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WindWidget />
              <SunMoonWidget />
            </div>
          </>
        )}
      </div>
    </>
  );
};
