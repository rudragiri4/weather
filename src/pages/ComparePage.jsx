import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { WeatherCompareWidget } from '../components/dashboard/WeatherCompareWidget';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { BarChart3 } from 'lucide-react';

export const ComparePage = () => {
  return (
    <>
      <SEOHead
        title="Compare Indian States Weather - Gujarat, Maharashtra, Rajasthan, Karnataka | WeatherSphere"
        description="Side-by-side live meteorological comparison of major Indian states: Gujarat (Ahmedabad), Maharashtra (Mumbai), Rajasthan (Jaipur), and Karnataka (Bengaluru)."
        canonicalPath="/compare"
      />

      <div className="space-y-6 py-6 sm:py-8">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Indian States Meteorological Comparison
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time side-by-side comparative analysis of Gujarat, Maharashtra, Rajasthan, and Karnataka
          </p>
        </div>

        {/* Synchronized Location Selector */}
        <LocationSyncBanner />

        {/* Indian States Comparison Component */}
        <WeatherCompareWidget />
      </div>
    </>
  );
};
