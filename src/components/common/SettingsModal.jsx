import React, { useState } from 'react';
import { X, Settings, Shield, Key, Eye, EyeOff, Save, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const SettingsModal = ({ onClose }) => {
  const {
    tempUnit,
    windUnit,
    pressureUnit,
    apiKey,
    weatherProvider,
    windyKey,
    windyModel,
    saveSettings
  } = useSettings();

  // Local state for settings form
  const [provider, setProvider] = useState(weatherProvider);
  const [openWeatherKeyInput, setOpenWeatherKeyInput] = useState(apiKey);
  const [windyKeyInput, setWindyKeyInput] = useState(windyKey);
  const [model, setModel] = useState(windyModel);
  const [tempUnitState, setTempUnitState] = useState(tempUnit);
  const [windUnitState, setWindUnitState] = useState(windUnit);
  const [pressureUnitState, setPressureUnitState] = useState(pressureUnit);

  // Key Visibility states
  const [showOWKey, setShowOWKey] = useState(false);
  const [showWindyKey, setShowWindyKey] = useState(false);

  // Success state on Save
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings({
      tempUnit: tempUnitState,
      windUnit: windUnitState,
      pressureUnit: pressureUnitState,
      apiKey: openWeatherKeyInput,
      weatherProvider: provider,
      windyKey: windyKeyInput,
      windyModel: model
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-slate-100 font-bold text-lg">
            <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            WeatherSphere Settings
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Data Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Weather Data Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Open-Meteo */}
              <button
                type="button"
                onClick={() => setProvider('open-meteo')}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition ${
                  provider === 'open-meteo'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-glow-cyan'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950/70'
                }`}
              >
                <span className="font-bold text-xs">Open-Meteo</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Free, no API key required. High accuracy global forecast.
                </span>
              </button>

              {/* OpenWeather */}
              <button
                type="button"
                onClick={() => setProvider('openweather')}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition ${
                  provider === 'openweather'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-glow-cyan'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950/70'
                }`}
              >
                <span className="font-bold text-xs">OpenWeather</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Requires key. Supports One Call 3.0 & Free 2.5 APIs.
                </span>
              </button>

              {/* Windy */}
              <button
                type="button"
                onClick={() => setProvider('windy')}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition ${
                  provider === 'windy'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-glow-cyan'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950/70'
                }`}
              >
                <span className="font-bold text-xs">Windy Point API</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Requires Windy API key. Premium grid point values.
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Key Fields */}
          {provider === 'openweather' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 animate-slideDown">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400" />
                OpenWeather Integration Config
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-medium">OpenWeather API Key</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type={showOWKey ? 'text' : 'password'}
                    value={openWeatherKeyInput}
                    onChange={(e) => setOpenWeatherKeyInput(e.target.value)}
                    placeholder="Enter your OpenWeather API Key"
                    className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOWKey(!showOWKey)}
                    className="text-slate-400 hover:text-slate-200 transition"
                  >
                    {showOWKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Don't have a key? Sign up at{' '}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  openweathermap.org
                </a>
                . Both One Call 3.0 keys and standard Free 2.5 API keys are supported automatically.
              </p>
            </div>
          )}

          {provider === 'windy' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-4 animate-slideDown">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400" />
                Windy API Integration Config
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-medium">Windy Point API Key</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type={showWindyKey ? 'text' : 'password'}
                    value={windyKeyInput}
                    onChange={(e) => setWindyKeyInput(e.target.value)}
                    placeholder="Enter your Windy API Key"
                    className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWindyKey(!showWindyKey)}
                    className="text-slate-400 hover:text-slate-200 transition"
                  >
                    {showWindyKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-medium">Weather Forecast Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="gfs">GFS (Global Forecast System) - Standard</option>
                  <option value="ecmwf">ECMWF (European Centre) - Highly Accurate</option>
                  <option value="icon">ICON (German Meteorological Service)</option>
                  <option value="arome">AROME (Météo-France) - High Res Europe</option>
                </select>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                Requires a Point Forecast key. Get one at{' '}
                <a
                  href="https://api.windy.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  api.windy.com
                </a>
                .
              </p>
            </div>
          )}

          {/* Unit Preferences */}
          <div className="space-y-4 border-t border-slate-850 pt-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Unit Settings
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Temp Unit */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Temperature</span>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTempUnitState('C')}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                      tempUnitState === 'C' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnitState('F')}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                      tempUnitState === 'F' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Wind Speed</span>
                <select
                  value={windUnitState}
                  onChange={(e) => setWindUnitState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="kmh">km/h</option>
                  <option value="mph">mph</option>
                  <option value="ms">m/s</option>
                  <option value="knots">knots</option>
                </select>
              </div>

              {/* Pressure Unit */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Atmospheric Pressure</span>
                <select
                  value={pressureUnitState}
                  onChange={(e) => setPressureUnitState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="hpa">hPa</option>
                  <option value="inhg">inHg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-850 pt-5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveSuccess}
              className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                saveSuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
