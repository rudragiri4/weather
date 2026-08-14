import React, { useState } from 'react';
import { X, Copy, Check, Share2, Twitter, Facebook } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getWeatherCondition } from '../../utils/formatters';

export const ShareModal = ({ onClose }) => {
  const { currentLocation } = useLocation();
  const { weatherData } = useWeather();
  const { tempUnit } = useSettings();
  const [copied, setCopied] = useState(false);

  const current = weatherData?.current;
  const condition = current ? getWeatherCondition(current.weatherCode) : null;
  const pageUrl = window.location.href;

  const shareText = current
    ? `Currently ${formatTemperature(current.temperature, tempUnit)}, ${condition.description} in ${currentLocation.name}. Check live radar & forecast on WeatherSphere!`
    : `Check real-time weather and radar for ${currentLocation.name} on WeatherSphere!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${pageUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Share Weather Report
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Weather Preview Banner */}
        {current && (
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div>
              <div className="text-sm font-semibold text-slate-200">{currentLocation.name}</div>
              <div className="text-2xl font-extrabold text-white">
                {formatTemperature(current.temperature, tempUnit)}
              </div>
              <div className="text-xs text-cyan-400">{condition.description}</div>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-1">
              <div>Humidity: {current.humidity}%</div>
              <div>Wind: {Math.round(current.windSpeed)} km/h</div>
              <div>AQI: {weatherData?.airQuality?.usAqi ?? 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Link box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Report Link
          </label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
            <input
              type="text"
              readOnly
              value={pageUrl}
              className="w-full bg-transparent text-slate-300 text-xs focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 text-xs font-semibold transition"
          >
            <Twitter className="w-4 h-4" /> Share on X
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2] border border-[#4267B2]/30 text-xs font-semibold transition"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </a>
        </div>

      </div>
    </div>
  );
};
