import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getWeatherCondition } from '../../utils/formatters';

const LAYER_LEGENDS = {
  wind: {
    label: 'Wind Speed',
    unit: 'kt',
    gradient: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6, #f59e0b, #ef4444)',
    ticks: ['0', '5', '15', '30', '50+']
  },
  temp: {
    label: 'Temperature',
    unit: '°',
    gradient: 'linear-gradient(to right, #1e40af, #2563eb, #06b6d4, #10b981, #f59e0b, #ef4444)',
    ticks: ['-20', '-10', '0', '10', '20', '30', '40+']
  },
  rain: {
    label: 'Precipitation',
    unit: 'mm/h',
    gradient: 'linear-gradient(to right, #67e8f9, #3b82f6, #6d28d9, #991b1b)',
    ticks: ['0', '1', '5', '10', '25+']
  },
  clouds: {
    label: 'Cloud Cover',
    unit: '%',
    gradient: 'linear-gradient(to right, #1e293b, #64748b, #cbd5e1)',
    ticks: ['0', '25', '50', '75', '100']
  },
  pressure: {
    label: 'Pressure',
    unit: 'hPa',
    gradient: 'linear-gradient(to right, #7c3aed, #2563eb, #06b6d4, #10b981, #f59e0b)',
    ticks: ['980', '1000', '1013', '1030', '1050']
  },
  waves: {
    label: 'Wave Height',
    unit: 'm',
    gradient: 'linear-gradient(to right, #06b6d4, #3b82f6, #7c3aed)',
    ticks: ['0', '1', '2', '4', '6+']
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    gradient: 'linear-gradient(to right, #f59e0b, #06b6d4, #2563eb)',
    ticks: ['0', '25', '50', '75', '100']
  },
  uv: {
    label: 'UV Index',
    unit: '',
    gradient: 'linear-gradient(to right, #10b981, #f59e0b, #ef4444, #7c3aed)',
    ticks: ['0', '3', '6', '9', '11+']
  },
};

export const TimelineBar = ({ activeLayer }) => {
  const { weatherData } = useWeather();
  const { tempUnit } = useSettings();
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  const hourly = weatherData?.hourly?.slice(0, 24) || [];
  const legend = LAYER_LEGENDS[activeLayer] || LAYER_LEGENDS.wind;

  // Group hourly by day for day tabs
  const dayGroups = [];
  hourly.forEach((item, idx) => {
    if (!item?.time) return;
    const d = new Date(item.time);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    const existing = dayGroups.find(g => g.label === dayLabel);
    if (existing) {
      existing.count++;
    } else {
      dayGroups.push({ label: dayLabel, startIdx: idx, count: 1 });
    }
  });

  // Auto-play
  useEffect(() => {
    if (playing && hourly.length > 0) {
      intervalRef.current = setInterval(() => {
        setActiveIdx(prev => {
          if (prev >= hourly.length - 1) {
            setPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 600);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, hourly.length]);

  // Scroll active slot into view
  useEffect(() => {
    if (sliderRef.current) {
      const activeEl = sliderRef.current.querySelector(`[data-idx="${activeIdx}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIdx]);

  const getHourLabel = (timeStr) => {
    if (!timeStr) return '';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    } catch { return ''; }
  };

  const getPrecipIcon = (prob) => {
    if (!prob) return null;
    return (
      <span className="text-[9px] font-bold text-blue-400 leading-none">{prob}%</span>
    );
  };

  return (
    <div className="timeline-bar shadow-2xl">
      {/* Controls + hourly slots */}
      <div className="flex items-center h-13 sm:h-14 gap-0">
        {/* Play/Pause */}
        <button
          onClick={() => setPlaying(!playing)}
          className={`flex items-center justify-center w-14 h-full shrink-0 transition-all ${
            playing
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
          title={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Prev */}
        <button
          onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          className="flex items-center justify-center w-8 h-full text-slate-400 hover:text-white transition disabled:opacity-30 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Hour slot strip */}
        <div ref={sliderRef} className="flex-1 flex items-center overflow-x-auto scrollbar-none">
          {hourly.length > 0 ? (
            hourly.map((item, i) => {
              const isActive = i === activeIdx;
              const cond = item ? getWeatherCondition(item.weatherCode) : null;
              return (
                <button
                  key={i}
                  data-idx={i}
                  onClick={() => setActiveIdx(i)}
                  className={`flex flex-col items-center justify-center px-3.5 h-14 transition-all shrink-0 min-w-[58px] border-r border-white/5 group ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span className={`text-[10px] font-bold leading-none mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {getHourLabel(item?.time)}
                  </span>
                  <span className={`text-sm font-extrabold leading-tight ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {formatTemperature(item?.temp, tempUnit)}
                  </span>
                  {getPrecipIcon(item?.precipitationProbability)}
                </button>
              );
            })
          ) : (
            Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-3.5 h-14 min-w-[58px] border-r border-white/5 animate-pulse">
                <div className="h-2 w-8 bg-slate-800 rounded mb-1" />
                <div className="h-3 w-10 bg-slate-700 rounded" />
              </div>
            ))
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => setActiveIdx(Math.min(hourly.length - 1, activeIdx + 1))}
          disabled={activeIdx >= hourly.length - 1}
          className="flex items-center justify-center w-8 h-full text-slate-400 hover:text-white transition disabled:opacity-30 shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Color legend */}
        <div className="hidden lg:flex flex-col justify-center gap-1 px-4 border-l border-white/5 shrink-0 min-w-[180px]">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            <span>{legend.label}</span>
            <span>{legend.unit}</span>
          </div>
          <div className="h-2 rounded-full w-full" style={{ background: legend.gradient }} />
          <div className="flex justify-between text-[9px] font-mono text-slate-600">
            {legend.ticks.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};
