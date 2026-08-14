import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, History, X } from 'lucide-react';
import { searchLocations } from '../../services/geocodingService';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';

export const SearchBar = ({ placeholder = "Search city, ZIP code, or coordinates...", compact = false }) => {
  const { setLocation, detectLocation, isDetecting } = useLocation();
  const { recentSearches } = useWeather();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(query);
      setResults(res);
      setIsSearching(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc) => {
    setLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className={`relative flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl transition-all focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 ${compact ? 'py-1.5 px-3' : 'py-2.5 px-4'}`}>
        <Search className={`text-slate-400 mr-3 shrink-0 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none text-sm md:text-base"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="p-1 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={detectLocation}
          disabled={isDetecting}
          title="Auto-detect my location"
          className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition shrink-0"
        >
          {isDetecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isDetecting ? 'Detecting...' : 'Locate Me'}</span>
        </button>
      </div>

      {/* Auto-complete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 flex items-center justify-center text-slate-400 gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              Searching global stations...
            </div>
          ) : results.length > 0 ? (
            results.map((loc) => (
              <button
                key={`${loc.latitude}-${loc.longitude}-${loc.name}`}
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-4 py-3 hover:bg-slate-800/80 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/10 transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-100 font-medium text-sm group-hover:text-cyan-300 transition">
                      {loc.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </span>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              No matching weather stations found for "{query}".
            </div>
          ) : recentSearches.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 bg-slate-800/40">
                <History className="w-3.5 h-3.5" /> Recent Searches
              </div>
              {recentSearches.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 flex items-center justify-between text-sm transition"
                >
                  <span className="text-slate-200 font-medium">{loc.name}</span>
                  <span className="text-xs text-slate-400">{loc.country}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
