import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { LocationSyncBanner } from '../components/common/LocationSyncBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AirQualityWidget } from '../components/dashboard/AirQualityWidget';
import { useWeather } from '../context/WeatherContext';
import { useLocation } from '../context/LocationContext';
import { getAQIDetails } from '../utils/formatters';
import { 
  Wind, 
  ShieldCheck, 
  HeartPulse, 
  AlertTriangle, 
  Home, 
  Activity, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const AirQualityPage = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { currentLocation } = useLocation();

  const aq = weatherData?.airQuality;
  const usAqi = aq?.usAqi != null ? Math.round(aq.usAqi) : 42;
  const aqiInfo = getAQIDetails(usAqi);

  // Dynamic guidance based on real AQI level
  const getDynamicGuidance = (val) => {
    if (val <= 50) {
      return {
        exercise: {
          title: 'Outdoor Activities: Excellent',
          text: 'Air quality is pristine. Perfect conditions for jogging, cycling, sports, and outdoor leisure without restriction.',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        },
        sensitive: {
          title: 'Sensitive Groups: Fully Safe',
          text: 'No respiratory risk detected for children, elderly individuals, or people with asthma.',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        },
        indoor: {
          title: 'Natural Ventilation: Recommended',
          text: 'Open windows freely to circulate fresh, clean ambient outdoor air through living spaces.',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        }
      };
    }
    if (val <= 100) {
      return {
        exercise: {
          title: 'Outdoor Activities: Acceptable',
          text: 'General public can enjoy normal outdoor workouts. Keep hydrated during midday hours.',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        },
        sensitive: {
          title: 'Sensitive Groups: Moderate Caution',
          text: 'Unusually sensitive individuals or severe asthmatics may experience mild coughing during prolonged heavy exertion.',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        },
        indoor: {
          title: 'Indoor Environment: Standard',
          text: 'Normal indoor ventilation is fine. Keep routine air filters in clean condition.',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        }
      };
    }
    if (val <= 150) {
      return {
        exercise: {
          title: 'Outdoor Activities: Reduce Heavy Exertion',
          text: 'Cut back on intense outdoor cardio workouts. Consider taking indoor gym sessions instead.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        },
        sensitive: {
          title: 'Sensitive Groups: Precaution Required',
          text: 'Asthmatics, children, and elderly should carry rescue inhalers and avoid prolonged exposure to urban traffic zones.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        },
        indoor: {
          title: 'Indoor Air: Filter Active',
          text: 'Close windows during high-traffic hours. Run HEPA air purifiers in bedrooms.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        }
      };
    }
    // High / Very Unhealthy / Hazardous (151+)
    return {
      exercise: {
        title: 'Outdoor Activities: Avoid Strenuous Exercise',
        text: 'Severe particulate matter levels. Move all workouts indoors and minimize time spent outdoors.',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
      },
      sensitive: {
        title: 'Sensitive Groups: High Health Alert',
        text: 'Wear N95/KN95 respirators if going outside is unavoidable. Keep medication and inhalers on hand.',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
      },
      indoor: {
        title: 'Indoor Environment: Sealed Clean Air',
        text: 'Keep windows tightly closed. Run continuous HEPA filtration to trap micro PM2.5 particulates.',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
      }
    };
  };

  const guidance = getDynamicGuidance(usAqi);

  return (
    <>
      <SEOHead
        title={`Air Quality Index (AQI) & Pollution Report - ${currentLocation.name} | WeatherSphere`}
        description={`Live Air Quality Index (AQI), PM2.5 and PM10 concentrations, respiratory health advisory and pollutant levels in ${currentLocation.name}.`}
        canonicalPath="/air-quality"
      />

      <div className="space-y-6 py-6 sm:py-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Air Quality & Environmental Health
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time pollutant telemetry and dynamic respiratory health recommendations for {currentLocation.name}
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
            {/* Live AQI Widget */}
            <AirQualityWidget />

            {/* Dynamic Health & Activity Guidance */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-cyan-400" />
                Live Tailored Health Recommendations ({aqiInfo.label})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className={`p-3 rounded-2xl ${guidance.exercise.bg} ${guidance.exercise.color} w-fit`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {guidance.exercise.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {guidance.exercise.text}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className={`p-3 rounded-2xl ${guidance.sensitive.bg} ${guidance.sensitive.color} w-fit`}>
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {guidance.sensitive.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {guidance.sensitive.text}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className={`p-3 rounded-2xl ${guidance.indoor.bg} ${guidance.indoor.color} w-fit`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {guidance.indoor.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {guidance.indoor.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Standard AQI Scale Reference */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Air Quality Index (AQI) Reference Scale
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-1">
                  <span className="font-bold text-emerald-400 block">0 - 50</span>
                  <span className="font-semibold text-white block">Good</span>
                  <p className="text-[10px] text-slate-400">Minimal to no pollution risk.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-1">
                  <span className="font-bold text-amber-400 block">51 - 100</span>
                  <span className="font-semibold text-white block">Moderate</span>
                  <p className="text-[10px] text-slate-400">Acceptable air quality.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-orange-500/30 space-y-1">
                  <span className="font-bold text-orange-400 block">101 - 150</span>
                  <span className="font-semibold text-white block">Sensitive Warning</span>
                  <p className="text-[10px] text-slate-400">May affect sensitive groups.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 space-y-1">
                  <span className="font-bold text-rose-400 block">151 - 200</span>
                  <span className="font-semibold text-white block">Unhealthy</span>
                  <p className="text-[10px] text-slate-400">Adverse effects for general public.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="font-bold text-purple-400 block">201 - 300</span>
                  <span className="font-semibold text-white block">Very Unhealthy</span>
                  <p className="text-[10px] text-slate-400">Health alert for entire population.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-red-800/40 space-y-1">
                  <span className="font-bold text-red-500 block">301 - 500</span>
                  <span className="font-semibold text-white block">Hazardous</span>
                  <p className="text-[10px] text-slate-400">Emergency condition warning.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
