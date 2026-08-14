import React from 'react';

const LAYERS = [
  { 
    id: 'wind', label: 'Wind', 
    color: '#06b6d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
      </svg>
    )
  },
  { 
    id: 'temp', label: 'Temperature', 
    color: '#f59e0b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>
    )
  },
  { 
    id: 'rain', label: 'Rain & Thunder', 
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
        <line x1="12" y1="15" x2="12" y2="23"/>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
      </svg>
    )
  },
  { 
    id: 'clouds', label: 'Clouds', 
    color: '#94a3b8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    )
  },
  { 
    id: 'pressure', label: 'Pressure', 
    color: '#10b981',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    )
  },
  { 
    id: 'waves', label: 'Waves', 
    color: '#8b5cf6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
      </svg>
    )
  },
  { 
    id: 'humidity', label: 'Humidity', 
    color: '#22d3ee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    )
  },
  { 
    id: 'uv', label: 'UV Index', 
    color: '#fbbf24',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    )
  },
];

export const LayerPanel = ({ activeLayer, setActiveLayer }) => {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none layer-panel-container">
      {LAYERS.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            title={layer.label}
            className={`group relative flex items-center`}
          >
            {/* Tooltip on hover */}
            <span
              className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 shadow-xl"
              style={{
                background: 'rgba(10, 13, 22, 0.97)',
                border: `1px solid ${layer.color}40`,
                color: layer.color
              }}
            >
              {layer.label}
            </span>

            {/* Icon button */}
            <div
              className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                isActive
                  ? `layer-btn-active-${layer.id} scale-110`
                  : 'bg-[#0a0d16]/85 border-white/8 backdrop-blur-md hover:scale-105 hover:border-white/15'
              }`}
              style={isActive ? { color: layer.color } : { color: '#64748b' }}
            >
              {layer.icon}

              {/* Active dot */}
              {isActive && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a0d16]"
                  style={{ background: layer.color }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
