import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FullscreenMap } from '../components/map/FullscreenMap';
import { MapTopBar } from '../components/map/MapTopBar';
import { LayerPanel } from '../components/map/LayerPanel';
import { WeatherPanel } from '../components/map/WeatherPanel';
import { CityForecastMatrix } from '../components/map/CityForecastMatrix';
import { useLocation } from '../context/LocationContext';

export const WeatherMapsPage = () => {
  const { currentLocation } = useLocation();
  const [activeLayer, setActiveLayer] = useState('rain');
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <>
      <SEOHead
        title={`Live Weather Radar & Wind Map - ${currentLocation.name}`}
        description={`Interactive live weather radar, wind vector streamlines, temperature heatmaps and cloud cover layers for ${currentLocation.name}.`}
        canonicalPath="/maps"
      />
      <div className="home-map-root">
        <FullscreenMap activeLayer={activeLayer} />
        <MapTopBar onTogglePanel={() => setPanelOpen(!panelOpen)} panelOpen={panelOpen} />
        {panelOpen && <WeatherPanel onClose={() => setPanelOpen(false)} />}
        <LayerPanel activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
        <CityForecastMatrix />
      </div>
    </>
  );
};
