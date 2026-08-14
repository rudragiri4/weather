import React from 'react';
import { SEOHead } from '../components/common/SEOHead';

export const PrivacyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy - WeatherSphere"
        description="Privacy policy and data protection transparency for WeatherSphere users."
        canonicalPath="/privacy"
      />

      <div className="max-w-3xl mx-auto space-y-6 py-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h1 className="font-display text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-slate-400">Effective Date: August 1, 2026</p>

        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-base font-bold text-white">1. Information We Process</h2>
          <p>
            WeatherSphere respects your personal privacy. We do not require account creation, password storage, or email registration for standard weather lookups.
          </p>
          <p>
            <strong>Geolocation:</strong> When you utilize our "Locate Me" feature, your browser requests permission to access your current latitude and longitude coordinates. This location data is processed locally in your browser memory to request relevant weather telemetry from Open-Meteo and is never permanently stored on external servers.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-base font-bold text-white">2. Local Storage & Cookies</h2>
          <p>
            We use your browser's standard <code>localStorage</code> to remember your preferred temperature unit (°C or °F), dark/light theme setting, and favorite cities list across visits.
          </p>
        </section>
      </div>
    </>
  );
};
