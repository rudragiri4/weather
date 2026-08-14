import React from 'react';
import { Wind, ShieldAlert, AlertCircle, CheckCircle, Info, Activity } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getAQIDetails } from '../../utils/formatters';

export const AirQualityWidget = () => {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.airQuality) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 text-sm">
        Air quality data is currently not available for this location.
      </div>
    );
  }

  const aq = weatherData.airQuality;
  const usAqi = aq.usAqi != null ? Math.round(aq.usAqi) : null;
  const aqiInfo = usAqi != null ? getAQIDetails(usAqi) : {
    label: 'Not Available',
    color: 'bg-slate-700',
    text: 'text-slate-400',
    description: 'Air quality telemetry is not reported for this station.'
  };

  const formatPollutant = (val, unit = 'µg/m³') => {
    if (val == null || isNaN(val)) return 'Not available';
    return `${typeof val === 'number' ? val.toFixed(1) : val} ${unit}`;
  };

  const pollutants = [
    { label: 'PM2.5', value: formatPollutant(aq.pm2_5), desc: 'Fine inhalable particles (≤ 2.5µm)' },
    { label: 'PM10', value: formatPollutant(aq.pm10), desc: 'Coarse dust and pollen (≤ 10µm)' },
    { label: 'NO₂', value: formatPollutant(aq.no2), desc: 'Nitrogen dioxide from emissions' },
    { label: 'O₃', value: formatPollutant(aq.o3), desc: 'Ground-level ozone' },
    { label: 'SO₂', value: formatPollutant(aq.so2), desc: 'Sulfur dioxide' },
    { label: 'CO', value: formatPollutant(aq.co), desc: 'Carbon monoxide' },
    { label: 'Dust', value: formatPollutant(aq.dust), desc: 'Atmospheric mineral dust' },
    { label: 'European AQI', value: aq.europeanAqi != null ? `${Math.round(aq.europeanAqi)} / 100` : 'Not available', desc: 'European Standard scale' }
  ];

  const percentage = usAqi != null ? Math.min(Math.max((usAqi / 300) * 100, 5), 100) : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base sm:text-lg">
          <Wind className="w-5 h-5 text-cyan-400" />
          <span>Real-Time Air Quality Index</span>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${aqiInfo.color} text-slate-950 w-fit`}>
          {aqiInfo.label}
        </span>
      </div>

      {/* Main AQI Meter */}
      <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-black text-white">
              {usAqi != null ? usAqi : 'N/A'}
            </span>
            <span className="text-xs text-slate-400 font-medium">US AQI Standard</span>
          </div>
          <span className={`font-bold text-sm sm:text-base ${aqiInfo.text}`}>
            {aqiInfo.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 via-rose-500 to-purple-600 transition-all duration-700 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
          {aqiInfo.description}
        </p>
      </div>

      {/* Pollutant Breakdown Grid */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Measured Chemical Pollutants & Particulates
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pollutants.map((p) => (
            <div key={p.label} className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1 hover:border-slate-700 transition">
              <div className="text-xs font-bold text-slate-300">{p.label}</div>
              <div className={`text-base font-extrabold ${p.value === 'Not available' ? 'text-slate-500 text-xs' : 'text-cyan-300'}`}>
                {p.value}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
