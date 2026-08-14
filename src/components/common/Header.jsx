import React, { useState } from 'react';
import { Link, useLocation as useRouteLocation } from 'react-router-dom';
import { 
  CloudSun, 
  MapPin, 
  Map as MapIcon, 
  Wind, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  BarChart3, 
  Menu, 
  X,
  Share2,
  Settings
} from 'lucide-react';
import { UnitToggle } from './UnitToggle';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { useLocation } from '../../context/LocationContext';
import { ShareModal } from './ShareModal';
import { SettingsModal } from './SettingsModal';

export const Header = () => {
  const routeLocation = useRouteLocation();
  const { currentLocation } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Overview', icon: CloudSun },
    { path: '/maps', label: 'Weather Maps', icon: MapIcon },
    { path: '/hourly', label: 'Hourly', icon: Clock },
    { path: '/weekly', label: '7-Day Forecast', icon: Calendar },
    { path: '/air-quality', label: 'Air Quality', icon: Wind },
    { path: '/alerts', label: 'Alerts', icon: ShieldAlert },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/blog', label: 'Insights', icon: BookOpen }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <CloudSun className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  WeatherSphere
                </span>
                <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80 -mt-1">
                  Windy & Radar Edition
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = routeLocation.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Unit toggle, Share, Mobile menu */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShareOpen(true)}
                title="Share Weather Report"
                className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-slate-500 transition shadow-inner hidden sm:flex items-center gap-1.5 text-xs font-medium"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden xl:inline">Share Report</span>
              </button>

              <UnitToggle />
              <button
                onClick={() => setSettingsOpen(true)}
                title="Settings"
                className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-350 hover:text-cyan-400 hover:border-slate-500 transition shadow-inner flex items-center"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <div className="mb-3">
              <SearchBar compact />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = routeLocation.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'text-slate-300 bg-slate-900/60 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
};
