import React from 'react';
import { 
  Thermometer, 
  CloudRain, 
  Wind, 
  Radio, 
  Satellite, 
  Cloud, 
  Gauge, 
  Waves, 
  Droplets, 
  Sun 
} from 'lucide-react';

const LAYERS = [
  { id: 'temp', label: 'Temperature', color: '#f59e0b', icon: Thermometer },
  { id: 'rain', label: 'Precipitation', color: '#3b82f6', icon: CloudRain },
  { id: 'wind', label: 'Wind', color: '#06b6d4', icon: Wind },
  { id: 'radar', label: 'Radar', color: '#10b981', icon: Radio },
  { id: 'satellite', label: 'Satellite', color: '#a855f7', icon: Satellite },
  { id: 'clouds', label: 'Clouds', color: '#94a3b8', icon: Cloud },
  { id: 'pressure', label: 'Pressure', color: '#10b981', icon: Gauge },
  { id: 'waves', label: 'Waves', color: '#8b5cf6', icon: Waves },
  { id: 'humidity', label: 'Humidity', color: '#22d3ee', icon: Droplets },
  { id: 'uv', label: 'UV Index', color: '#fbbf24', icon: Sun },
];

export const LayerPanel = ({ activeLayer, setActiveLayer }) => {
  return (
    <div 
      aria-label="Map Layer Selector"
      className="absolute right-2 sm:right-3.5 top-14 sm:top-1/2 sm:-translate-y-1/2 z-[1000] w-[120px] xs:w-[130px] sm:w-[145px] bg-[#0a0d16]/80 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg pointer-events-auto flex flex-col gap-0.5 max-h-[calc(100vh-110px)] overflow-y-auto scrollbar-none animate-fadeIn select-none"
    >
      {LAYERS.map((layer) => {
        const isActive = activeLayer === layer.id;
        const Icon = layer.icon;
        return (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            title={layer.label}
            className={`w-full flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:py-1.5 rounded-lg text-left transition text-[11px] sm:text-xs leading-tight ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/35 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium'
            }`}
          >
            <Icon 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition" 
              style={{ color: isActive ? layer.color : '#94a3b8' }} 
            />
            <span className="truncate">{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
};
