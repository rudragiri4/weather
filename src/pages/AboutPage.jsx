import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { CloudSun, Globe, ShieldCheck, Zap } from 'lucide-react';

export const AboutPage = () => {
  return (
    <>
      <SEOHead
        title="About WeatherSphere - Modern Weather Intelligence"
        description="Learn about WeatherSphere mission to provide real-time global weather radar, Windy streamline maps, and open atmospheric data."
        canonicalPath="/about"
      />

      <div className="max-w-4xl mx-auto space-y-10 py-6">
        <div className="text-center space-y-3">
          <h1 className="font-display text-4xl font-black text-white">About WeatherSphere</h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Combining the interactive radar capabilities of Windy with the clarity and accessibility of AccuWeather.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            <h3 className="font-bold text-white text-lg">Global Station Mesh</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We connect directly with Open-Meteo, ECMWF, and NOAA atmospheric telemetry stations to provide precision hyper-local weather predictions.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Zap className="w-8 h-8 text-amber-400" />
            <h3 className="font-bold text-white text-lg">Ultra Fast & Accessible</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for Lighthouse 90+ performance. Instant location search, dark glassmorphism aesthetics, and lightweight web vector maps.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-white text-lg">Zero Tracking & Open Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your location searches remain local to your browser session. We prioritize user privacy and transparent meteorological reporting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
