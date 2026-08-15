import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, History, X, Sparkles, Navigation } from 'lucide-react';
import { searchLocations } from '../../services/geocodingService';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { POPULAR_CITIES } from '../../utils/constants';

export const SearchModal = ({ isOpen, onClose }) => {
  const { setLocation, detectLocation, isDetecting } = useLocation();
  const { recentSearches } = useWeather();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced Search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchLocations(query);
        setResults(res || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (loc) => {
    setLocation(loc, true);
    setQuery('');
    setResults([]);
    onClose();
  };

  const handleDetect = () => {
    detectLocation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-20 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Search City"
        className="relative z-10 w-full max-w-lg bg-[#0e1628]/98 border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[82vh] animate-slideUp"
      >
        {/* Search Bar Input Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center gap-2.5 bg-gradient-to-r from-cyan-500/10 via-[#142034] to-blue-500/10">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, district, or coordinates..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition shrink-0 ml-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button: Locate Me */}
        <div className="px-3.5 sm:px-4 py-2.5 border-b border-white/8 bg-[#09101d]/60 flex items-center justify-between">
          <button
            onClick={handleDetect}
            disabled={isDetecting}
            className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition w-full justify-center group"
          >
            {isDetecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            )}
            <span>{isDetecting ? 'Detecting current location...' : 'Use My Current Location'}</span>
          </button>
        </div>

        {/* Results & Quick Pick Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-white/6 scrollbar-thin p-1">
          {/* Loading State */}
          {isSearching && (
            <div className="p-6 flex items-center justify-center text-slate-300 gap-2.5 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              Searching global meteorological stations...
            </div>
          )}

          {/* Search Results List */}
          {!isSearching && results.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Cities ({results.length})
              </div>
              {results.map((loc) => (
                <button
                  key={`${loc.latitude}-${loc.longitude}-${loc.name}`}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-3.5 py-3 hover:bg-cyan-500/15 flex items-center justify-between transition group rounded-xl my-0.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 transition shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm group-hover:text-cyan-300 transition truncate">
                        {loc.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono shrink-0 ml-2">
                    {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!isSearching && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <div className="text-2xl">🔍</div>
              <div className="text-sm font-semibold text-slate-200">No city found for "{query}"</div>
              <div className="text-xs text-slate-400">Try searching for state, district, or alternative spelling.</div>
            </div>
          )}

          {/* Quick Selection: Popular Indian & Global Cities (When input is empty) */}
          {!query && (
            <div className="p-3 space-y-3">
              {/* Recent Searches */}
              {recentSearches && recentSearches.length > 0 && (
                <div>
                  <div className="px-1 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <History className="w-3 h-3 text-cyan-400" /> Recent Locations
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {recentSearches.slice(0, 6).map((loc, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(loc)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#142034]/80 hover:bg-cyan-500/15 border border-white/8 hover:border-cyan-500/30 text-left transition group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                          {loc.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cities */}
              <div>
                <div className="px-1 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Popular Cities
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleSelect(city)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#142034]/80 hover:bg-cyan-500/20 border border-white/8 hover:border-cyan-500/40 text-left transition group min-h-[44px]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">{city.flag || '📍'}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                            {city.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {city.country}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
