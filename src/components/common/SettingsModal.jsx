import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  Thermometer, 
  Wind, 
  Gauge, 
  CloudRain, 
  MapPin, 
  Bell, 
  Layers, 
  Info, 
  Check, 
  Save,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useLocation } from '../../context/LocationContext';

export const SettingsModal = ({ onClose }) => {
  const {
    theme,
    tempUnit,
    windUnit,
    pressureUnit,
    precipUnit,
    weatherAlerts,
    severeAlerts,
    defaultMapLayer,
    mapAnimations,
    saveSettings
  } = useSettings();

  const { currentLocation, detectLocation, isDetecting } = useLocation();

  // Local state for settings form
  const [themeState, setThemeState] = useState(theme);
  const [tempUnitState, setTempUnitState] = useState(tempUnit);
  const [windUnitState, setWindUnitState] = useState(windUnit);
  const [pressureUnitState, setPressureUnitState] = useState(pressureUnit);
  const [precipUnitState, setPrecipUnitState] = useState(precipUnit);
  const [weatherAlertsState, setWeatherAlertsState] = useState(weatherAlerts);
  const [severeAlertsState, setSevereAlertsState] = useState(severeAlerts);
  const [defaultLayerState, setDefaultLayerState] = useState(defaultMapLayer);
  const [mapAnimationsState, setMapAnimationsState] = useState(mapAnimations);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings({
      theme: themeState,
      tempUnit: tempUnitState,
      windUnit: windUnitState,
      pressureUnit: pressureUnitState,
      precipUnit: precipUnitState,
      weatherAlerts: weatherAlertsState,
      severeAlerts: severeAlertsState,
      defaultMapLayer: defaultLayerState,
      mapAnimations: mapAnimationsState
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        role="dialog"
        aria-modal="true"
        aria-label="WeatherSphere Settings"
        className="relative z-10 bg-[#0e1628] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto space-y-5 scrollbar-thin animate-slideUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-4 h-4" />
            </div>
            <span>WeatherSphere Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-slate-200">
          {/* 1. Appearance */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-cyan-400" /> Appearance
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setThemeState('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition min-h-[44px] ${
                  themeState === 'dark'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-[#142034]/60 border-white/8 text-slate-400 hover:text-slate-200 hover:bg-[#142034]'
                }`}
              >
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>Dark Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeState('light')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition min-h-[44px] ${
                  themeState === 'light'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-[#142034]/60 border-white/8 text-slate-400 hover:text-slate-200 hover:bg-[#142034]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* 2. Weather Units */}
          <div className="space-y-3 pt-3 border-t border-white/8">
            <label className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Weather Units
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Temperature Unit */}
              <div className="space-y-1 bg-[#142034]/60 border border-white/8 rounded-2xl p-3">
                <span className="text-[11px] text-slate-300 font-semibold block">Temperature</span>
                <div className="flex bg-[#0a0d16] p-1 rounded-xl border border-white/8 mt-1">
                  <button
                    type="button"
                    onClick={() => setTempUnitState('C')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      tempUnitState === 'C'
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnitState('F')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      tempUnitState === 'F'
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div className="space-y-1 bg-[#142034]/60 border border-white/8 rounded-2xl p-3">
                <span className="text-[11px] text-slate-300 font-semibold block">Wind Speed</span>
                <select
                  value={windUnitState}
                  onChange={(e) => setWindUnitState(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500 mt-1"
                >
                  <option value="kmh">km/h (Kilometers / hour)</option>
                  <option value="mph">mph (Miles / hour)</option>
                  <option value="ms">m/s (Meters / second)</option>
                  <option value="knots">knots (Nautical knots)</option>
                </select>
              </div>

              {/* Pressure Unit */}
              <div className="space-y-1 bg-[#142034]/60 border border-white/8 rounded-2xl p-3">
                <span className="text-[11px] text-slate-300 font-semibold block">Pressure</span>
                <select
                  value={pressureUnitState}
                  onChange={(e) => setPressureUnitState(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500 mt-1"
                >
                  <option value="hpa">hPa (Hectopascals / mbar)</option>
                  <option value="inhg">inHg (Inches of Mercury)</option>
                </select>
              </div>

              {/* Precipitation Unit */}
              <div className="space-y-1 bg-[#142034]/60 border border-white/8 rounded-2xl p-3">
                <span className="text-[11px] text-slate-300 font-semibold block">Precipitation</span>
                <select
                  value={precipUnitState}
                  onChange={(e) => setPrecipUnitState(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500 mt-1"
                >
                  <option value="mm">Millimeters (mm)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Location & Geolocation */}
          <div className="space-y-2.5 pt-3 border-t border-white/8">
            <label className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location Preferences
            </label>
            
            <div className="bg-[#142034]/60 border border-white/8 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Default Location Region</span>
                <span className="font-bold text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  India (Default)
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/6 text-xs">
                <div>
                  <div className="font-semibold text-slate-200">Current Active Location</div>
                  <div className="text-[11px] text-slate-400">{currentLocation?.name}, {currentLocation?.country || 'India'}</div>
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] border border-cyan-500/40 transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {isDetecting ? 'Detecting...' : 'Detect Now'}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Notifications & Alerts */}
          <div className="space-y-2.5 pt-3 border-t border-white/8">
            <label className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-cyan-400" /> Weather Alerts & Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#142034]/60 border border-white/8 hover:border-white/15 transition cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Severe Weather Alerts</span>
                  <span className="text-[10px] text-slate-400 block">Show meteorological warning badges for high winds, storms and rain</span>
                </div>
                <input
                  type="checkbox"
                  checked={severeAlertsState}
                  onChange={(e) => setSevereAlertsState(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#142034]/60 border border-white/8 hover:border-white/15 transition cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Air Quality Warnings</span>
                  <span className="text-[10px] text-slate-400 block">Alert when AQI exceeds unhealthy threshold levels</span>
                </div>
                <input
                  type="checkbox"
                  checked={weatherAlertsState}
                  onChange={(e) => setWeatherAlertsState(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-400"
                />
              </label>
            </div>
          </div>

          {/* 5. Map Preferences */}
          <div className="space-y-2.5 pt-3 border-t border-white/8">
            <label className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Map Preferences
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#142034]/60 border border-white/8 rounded-2xl p-3">
                <span className="text-[11px] text-slate-300 font-semibold block">Default Initial Layer</span>
                <select
                  value={defaultLayerState}
                  onChange={(e) => setDefaultLayerState(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500 mt-1"
                >
                  <option value="wind">Wind Streamlines</option>
                  <option value="temp">Temperature Heatmap</option>
                  <option value="rain">Precipitation / Radar</option>
                  <option value="clouds">Cloud Cover</option>
                  <option value="pressure">Atmospheric Pressure</option>
                  <option value="waves">Waves & Ocean</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#142034]/60 border border-white/8">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Streamline Animations</span>
                  <span className="text-[10px] text-slate-400 block">Smooth live wind particles</span>
                </div>
                <input
                  type="checkbox"
                  checked={mapAnimationsState}
                  onChange={(e) => setMapAnimationsState(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* 6. About & Data Attribution */}
          <div className="pt-3 border-t border-white/8 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> About WeatherSphere
            </div>
            <div className="bg-[#142034]/40 border border-white/6 rounded-2xl p-3 text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <div className="flex justify-between items-center text-slate-300 font-bold">
                <span>WeatherSphere v2.4.0</span>
                <span className="text-cyan-400 text-[10px] font-mono">Live Radar Edition</span>
              </div>
              <p>
                Weather telemetry provided by global meteorological networks & Open-Meteo ECMWF models. High-resolution radar and wind flow streamlines updated in real time.
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveSuccess}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                saveSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
