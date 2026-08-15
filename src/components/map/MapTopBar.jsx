import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun, Menu, X, BookOpen, BarChart3, ShieldAlert,
  Share2, Info, Settings, Wind, Search
} from 'lucide-react';
import { SearchModal } from '../common/SearchModal';
import { ShareModal } from '../common/ShareModal';
import { SettingsModal } from '../common/SettingsModal';
import { useWeather } from '../../context/WeatherContext';
import { useLocation } from '../../context/LocationContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getWeatherCondition } from '../../utils/formatters';

const PROVIDER_COLORS = {
  'open-meteo': '#10b981',
  'openweather': '#f59e0b',
  'windy': '#06b6d4',
};

export const MapTopBar = ({ onTogglePanel, panelOpen }) => {
  const { weatherData, loading } = useWeather();
  const { currentLocation, hasSearched } = useLocation();
  const { tempUnit } = useSettings();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const current = weatherData?.current;
  const condition = current ? getWeatherCondition(current.weatherCode) : null;
  const provider = weatherData?.provider || 'open-meteo';
  const providerColor = PROVIDER_COLORS[provider] || '#10b981';

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 bg-gradient-to-b from-[#0a0d16]/95 via-[#0a0d16]/70 to-transparent pointer-events-none">

        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            to="/"
            className="pointer-events-auto flex items-center gap-2 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition shadow-cyan-500/30 shrink-0">
              <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="hidden xs:block sm:block">
              <span className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight block">
                Weather<span className="text-cyan-400">Sphere</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-medium uppercase tracking-widest -mt-0.5 block">
                Live Radar
              </span>
            </div>
          </Link>

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            title="Search city (Click or tap)"
            className="pointer-events-auto flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0a0d16]/85 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md text-xs font-medium group"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline text-slate-300">Search city...</span>
            <span className="sm:hidden text-xs font-semibold text-cyan-300">Search</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5">

          {/* Current temp / condition - only show once searched */}
          {hasSearched && current && (
            <button
              onClick={onTogglePanel}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                panelOpen
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'bg-[#0a0d16]/80 backdrop-blur-md border-white/10 text-slate-200 hover:bg-white/5'
              }`}
            >
              {loading && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
              <span className="text-base font-extrabold text-white">
                {formatTemperature(current.temperature, tempUnit)}
              </span>
              <span className={`${condition?.color || 'text-cyan-400'} font-semibold`}>{condition?.description}</span>
              <div
                className="w-1.5 h-1.5 rounded-full ml-1"
                style={{ background: providerColor }}
                title={`Data: ${provider}`}
              />
            </button>
          )}

          {/* Alerts pill */}
          {weatherData?.alerts?.length > 0 && (
            <Link
              to="/alerts"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{weatherData.alerts.length} Alert{weatherData.alerts.length > 1 ? 's' : ''}</span>
            </Link>
          )}

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            className="p-2 rounded-xl bg-[#0a0d16]/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            onClick={() => setShareOpen(true)}
            className="p-2 rounded-xl bg-[#0a0d16]/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="p-2 rounded-xl bg-[#0a0d16]/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition"
            >
              {moreOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#0a0d16]/97 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/5 z-50 animate-fadeIn">
                <div className="p-1">
                  {[
                    { path: '/hourly', label: 'Hourly Forecast', icon: '⏱️' },
                    { path: '/weekly', label: '7-Day Forecast', icon: '📅' },
                    { path: '/air-quality', label: 'Air Quality', icon: '💨' },
                    { path: '/alerts', label: 'Weather Alerts', icon: '⚠️' },
                    { path: '/blog', label: 'Weather Insights', icon: '📰' },
                    { path: '/compare', label: 'Compare States', icon: '📊' },
                  ].map(({ path, label, icon }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
                    >
                      <span>{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile panel toggle */}
          <button
            onClick={onTogglePanel}
            className="sm:hidden p-2 rounded-xl bg-[#0a0d16]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition"
          >
            {panelOpen ? <X className="w-4 h-4" /> : <CloudSun className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {searchModalOpen && <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
};
