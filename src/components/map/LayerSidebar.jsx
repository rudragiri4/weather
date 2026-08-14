import React from 'react';
import { Wind, Thermometer, CloudRain, Cloud, Gauge, ShieldAlert } from 'lucide-react';
import { MAP_LAYERS } from '../../utils/constants';

const iconMap = {
  Wind,
  Thermometer,
  CloudRain,
  Cloud,
  Gauge,
  ShieldAlert
};

export const LayerSidebar = ({ activeLayer, setActiveLayer }) => {
  return (
    <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2 shadow-2xl space-y-1 w-48 sm:w-56">
      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 mb-1">
        Weather Layers
      </div>
      {MAP_LAYERS.map((layer) => {
        const Icon = iconMap[layer.icon] || Wind;
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{layer.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{layer.unit}</span>
          </button>
        );
      })}
    </div>
  );
};
