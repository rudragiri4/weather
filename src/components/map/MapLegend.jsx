import React from 'react';

export const MapLegend = ({ activeLayer }) => {
  const legendConfigs = {
    wind: {
      title: 'Wind Speed (km/h)',
      gradient: 'from-cyan-400 via-blue-500 via-yellow-500 to-rose-600',
      stops: ['0', '20', '40', '60', '80+']
    },
    temp: {
      title: 'Temperature (°C)',
      gradient: 'from-blue-600 via-cyan-400 via-emerald-400 via-yellow-400 to-red-600',
      stops: ['-20°', '0°', '15°', '30°', '45°+']
    },
    rain: {
      title: 'Precipitation Radar (mm/h)',
      gradient: 'from-cyan-300 via-blue-600 via-yellow-400 to-purple-600',
      stops: ['0.1', '2.5', '10', '25', '50+']
    },
    clouds: {
      title: 'Cloud Cover (%)',
      gradient: 'from-slate-700 via-slate-500 to-slate-200',
      stops: ['0%', '25%', '50%', '75%', '100%']
    },
    pressure: {
      title: 'Sea Pressure (hPa)',
      gradient: 'from-purple-600 via-blue-500 via-emerald-500 to-amber-500',
      stops: ['970', '990', '1013', '1030', '1050+']
    },
    aqi: {
      title: 'Air Quality Index (AQI)',
      gradient: 'from-emerald-500 via-amber-500 via-orange-500 via-red-500 to-purple-600',
      stops: ['0 (Good)', '50', '100', '150', '200+ (Hazardous)']
    }
  };

  const config = legendConfigs[activeLayer] || legendConfigs.wind;

  return (
    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 w-64">
      <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">
        {config.title}
      </div>
      <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${config.gradient}`} />
      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        {config.stops.map((stop, i) => (
          <span key={i}>{stop}</span>
        ))}
      </div>
    </div>
  );
};
