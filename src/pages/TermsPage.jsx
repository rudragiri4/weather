import React from 'react';
import { SEOHead } from '../components/common/SEOHead';

export const TermsPage = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service - WeatherSphere"
        description="Terms of service and usage conditions for WeatherSphere."
        canonicalPath="/terms"
      />

      <div className="max-w-3xl mx-auto space-y-6 py-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h1 className="font-display text-3xl font-black text-white">Terms of Service</h1>
        <p className="text-slate-400">Effective Date: August 1, 2026</p>

        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing WeatherSphere, you agree to comply with these Terms of Service. Weather forecasts and atmospheric alerts are provided for informational and planning purposes.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-base font-bold text-white">2. Disclaimer of Weather Warranties</h2>
          <p>
            Atmospheric conditions can change rapidly. Official life-safety weather warnings issued by national emergency weather services (such as NOAA or EUMETSAT) should be prioritized during extreme weather events.
          </p>
        </section>
      </div>
    </>
  );
};
