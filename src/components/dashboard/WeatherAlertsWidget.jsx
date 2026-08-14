import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, MapPin, Info, BellRing } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const WeatherAlertsWidget = () => {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const alerts = weatherData.alerts || [];

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white">No active weather alerts</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            There are currently no active weather alerts for this location. Atmospheric conditions are calm and within normal parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, idx) => {
        const isExtreme = alert.severity?.toLowerCase() === 'extreme' || alert.severity?.toLowerCase() === 'severe';
        return (
          <div
            key={alert.id || idx}
            className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-4 transition ${
              isExtreme
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl shrink-0 ${isExtreme ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-white">
                    {alert.event || 'Severe Weather Warning'}
                  </h3>
                  {alert.headline && (
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {alert.headline}
                    </p>
                  )}
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold uppercase text-xs w-fit ${
                isExtreme ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-amber-500 text-slate-950'
              }`}>
                {alert.severity || 'Advisory'}
              </span>
            </div>

            {/* Description */}
            {alert.description && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                {alert.description}
              </p>
            )}

            {/* Alert Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              {alert.area && (
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Area: {alert.area}</span>
                </div>
              )}
              {alert.start && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Effective: {new Date(alert.start * 1000).toLocaleString()}</span>
                </div>
              )}
              {alert.end && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires: {new Date(alert.end * 1000).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
