import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Wind, Thermometer, Droplets, Gauge } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { LayerSidebar } from './LayerSidebar';
import { MapLegend } from './MapLegend';
import { formatTemperature, getWeatherCondition, formatWindSpeed } from '../../utils/formatters';
import { reverseGeocode } from '../../services/geocodingService';

// Fix custom icon issue in leaflet
const customPinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle pan to center when location changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 9, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// Map Click inspector component
function MapEventsInspector({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const loc = await reverseGeocode(lat, lng);
      onLocationSelect(loc);
    }
  });
  return null;
}

export const WeatherMap = ({ height = "h-[650px]", fullScreen = false }) => {
  const { currentLocation, setLocation } = useLocation();
  const { weatherData } = useWeather();
  const { tempUnit, windUnit } = useSettings();
  const [activeLayer, setActiveLayer] = useState('wind');

  const center = [currentLocation.latitude, currentLocation.longitude];

  // Tile layer URL map according to selected overlay
  const getOverlayTileUrl = () => {
    switch (activeLayer) {
      case 'rain':
        return 'https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png';
      case 'temp':
        return 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=93d0f0c05dfed6fa16b0800b462c16eb';
      case 'wind':
        return 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=93d0f0c05dfed6fa16b0800b462c16eb';
      case 'clouds':
        return 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=93d0f0c05dfed6fa16b0800b462c16eb';
      case 'pressure':
        return 'https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=93d0f0c05dfed6fa16b0800b462c16eb';
      default:
        return 'https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png';
    }
  };

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden border border-slate-800 shadow-2xl z-10 group`}>
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full bg-[#0B0F19]"
        attributionControl={false}
      >
        <MapRecenter center={center} />
        <MapEventsInspector onLocationSelect={setLocation} />

        {/* Dark theme base tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Dynamic Weather Overlay Tile Layer */}
        <TileLayer
          key={activeLayer}
          url={getOverlayTileUrl()}
          opacity={0.65}
          maxZoom={18}
        />

        {/* Active Station Pin */}
        <Marker position={center} icon={customPinIcon}>
          {weatherData && weatherData.current && (
            <Popup className="custom-leaflet-popup">
              <div className="p-2 text-slate-900 space-y-1">
                <div className="font-bold text-sm">{currentLocation.name}</div>
                <div className="text-xl font-extrabold text-cyan-600">
                  {formatTemperature(weatherData.current.temperature, tempUnit)}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {getWeatherCondition(weatherData.current.weatherCode).description}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Wind: {formatWindSpeed(weatherData.current.windSpeed, windUnit)} | AQI: {weatherData.airQuality?.usAqi ?? 'N/A'}
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>

      {/* Layer Sidebar Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000]">
        <LayerSidebar activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[1000] hidden sm:block">
        <MapLegend activeLayer={activeLayer} />
      </div>

      {/* Click-to-inspect instruction badge */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-medium hidden md:flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
        Click anywhere on map to inspect weather
      </div>
    </div>
  );
};
