import React, { useEffect, useRef } from 'react';
import { useLocation as useLocCtx } from '../../context/LocationContext';
import { useSettings } from '../../context/SettingsContext';

// Windy overlay mapping
const WINDY_OVERLAY_MAP = {
  wind: 'wind',
  temp: 'temp',
  rain: 'rain',
  radar: 'radar',
  satellite: 'satellite',
  clouds: 'clouds',
  pressure: 'pressure',
  waves: 'waves',
  humidity: 'rh',
  uv: 'uv-index',
};

export const FullscreenMap = ({ activeLayer }) => {
  const { currentLocation, hasSearched } = useLocCtx();
  const { tempUnit, windUnit } = useSettings();
  const iframeRef = useRef(null);
  const prevLocationRef = useRef(null);

  // Default India geographic center if initial view, otherwise selected city coords
  const isIndia = (currentLocation?.countryCode === 'IN' || currentLocation?.country === 'India' || currentLocation?.name === 'India' || currentLocation?.name === 'New Delhi');
  const lat = hasSearched 
    ? (currentLocation?.latitude ?? 28.6139)
    : (isIndia ? 22.50 : (currentLocation?.latitude ?? 22.50));
  const lon = hasSearched
    ? (currentLocation?.longitude ?? 77.2090)
    : (isIndia ? 79.50 : (currentLocation?.longitude ?? 79.50));
    
  // Dynamic zoom: wide overview for default India view (zoom 5), closer zoom for searched city (zoom 7)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const zoom = hasSearched ? (isMobile ? 6 : 7) : (isMobile ? 4 : 5);

  const windyOverlay = WINDY_OVERLAY_MAP[activeLayer] || 'wind';
  const metricTemp = tempUnit === 'F' ? '°F' : '°C';
  const metricWind = windUnit === 'mph' ? 'mph' : windUnit === 'ms' ? 'm/s' : windUnit === 'knots' ? 'kt' : 'km/h';

  // Build Windy embed URL
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&width=650&height=450&zoom=${zoom}&level=surface&overlay=${windyOverlay}&product=ecmwf&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&metricWind=${encodeURIComponent(metricWind)}&metricTemp=${encodeURIComponent(metricTemp)}&radarRange=-1`;

  // Track location changes - reload iframe src to recenter
  useEffect(() => {
    if (
      iframeRef.current &&
      prevLocationRef.current &&
      (prevLocationRef.current.latitude !== lat || prevLocationRef.current.longitude !== lon || prevLocationRef.current.hasSearched !== hasSearched)
    ) {
      iframeRef.current.src = windyUrl;
    }
    prevLocationRef.current = { latitude: lat, longitude: lon, hasSearched };
  }, [lat, lon, hasSearched, windyUrl]);

  return (
    <div className="windy-map-wrapper relative">
      <iframe
        ref={iframeRef}
        key={`${lat}-${lon}-${windyOverlay}`}
        src={windyUrl}
        title="Windy Live Weather Map"
        frameBorder="0"
        allow="geolocation"
        className="windy-iframe"
      />

      {/* ── Visual City Highlight Pulse Beacon (Only when city searched) ── */}
      {hasSearched && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center animate-fadeIn">
          {/* Pulsing Radar Wave Rings */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-cyan-400/60 bg-cyan-500/5 shadow-[0_0_40px_rgba(6,182,212,0.35)] flex flex-col items-center justify-center">
            {/* Outer expanding ripple */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-pulse-ring" />
            <div className="absolute inset-4 rounded-full border border-cyan-400/20 border-dashed animate-spin-slow" />

            {/* Target Pin Marker */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-rose-500/30 border-2 border-rose-400 animate-ping absolute" />
                <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_12px_rgba(244,63,94,0.8)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* City Label Badge */}
              <div className="mt-2 flex flex-col items-center">
                <span className="font-display font-extrabold text-xs sm:text-sm text-white drop-shadow-md bg-[#0e1628]/95 px-3 py-1 rounded-full border border-cyan-500/30 shadow-xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {currentLocation.name}
                </span>
                <span className="text-[9px] text-cyan-300 font-mono font-bold bg-[#09101d]/90 px-2 py-0.5 rounded-full border border-white/10 mt-1 shadow">
                  {lat.toFixed(2)}°, {lon.toFixed(2)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
