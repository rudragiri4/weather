import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { WeatherAlertsWidget } from '../components/dashboard/WeatherAlertsWidget';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { ShieldAlert, AlertTriangle, ShieldCheck, PhoneCall, Radio, HeartPulse } from 'lucide-react';

export const AlertsPage = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();

  const alerts = weatherData?.alerts || [];

  return (
    <>
      <SEOHead
        title={`Official Severe Weather Alerts & Advisories - ${currentLocation.name} | WeatherSphere`}
        description={`Real-time active meteorological alerts, storm warnings, gale advisories, and flash flood safety bulletins for ${currentLocation.name}.`}
        canonicalPath="/alerts"
      />

      <div className="space-y-6 py-6 sm:py-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Severe Weather Warnings & Advisories
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time official meteorological alert feed and emergency safety guidance for {currentLocation.name}
          </p>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {/* Loading / Error States */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshWeather} />
        ) : (
          <>
            {/* Real Weather Alerts Widget */}
            <WeatherAlertsWidget />

            {/* Emergency Preparedness Guidelines */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h2>Emergency Meteorological Safety Protocol</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2.5">
                  <div className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    High Wind & Gale Precautions
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Secure outdoor furniture, temporary roofs, and bins. Avoid parking under tall trees or unanchored utility poles during sustained gale force winds.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2.5">
                  <div className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Flash Flood & Heavy Rain
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Never attempt to walk, swim, or drive through flooded roads. Six inches of rapid current can knock an adult off balance, and 12 inches can sweep vehicles away.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2.5">
                  <div className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4" />
                    Extreme Heat & Thermal Stress
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Stay indoors in air-conditioned environments during peak sun hours (12 PM - 4 PM). Maintain frequent electrolyte hydration and monitor vulnerable individuals.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
