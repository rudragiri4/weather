import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FullscreenMap } from '../components/map/FullscreenMap';
import { MapTopBar } from '../components/map/MapTopBar';
import { LayerPanel } from '../components/map/LayerPanel';
import { WeatherPanel } from '../components/map/WeatherPanel';
import { CityForecastMatrix } from '../components/map/CityForecastMatrix';
import { useLocation } from '../context/LocationContext';

export const HomePage = () => {
  const { currentLocation } = useLocation();
  const [activeLayer, setActiveLayer] = useState('wind');
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <>
      <SEOHead
        title={`Live Radar & Weather - ${currentLocation.name} | WeatherSphere`}
        description={`Interactive Windy-style weather radar, wind streamlines, temperature & precipitation maps for ${currentLocation.name}. Real-time atmospheric data globally.`}
        canonicalPath="/"
      />

      {/* Full viewport map container */}
      <div className="home-map-root">
        {/* Windy iframe fills entire area */}
        <FullscreenMap activeLayer={activeLayer} />

        {/* Top search bar + controls */}
        <MapTopBar
          onTogglePanel={() => setPanelOpen(!panelOpen)}
          panelOpen={panelOpen}
        />

        {/* Left weather details panel */}
        {panelOpen && (
          <WeatherPanel onClose={() => setPanelOpen(false)} />
        )}

        {/* Right layer selector */}
        <LayerPanel activeLayer={activeLayer} setActiveLayer={setActiveLayer} />

        {/* Bottom City Detailed Weather Forecast Matrix */}
        <CityForecastMatrix />
      </div>
    </>
  );
};
