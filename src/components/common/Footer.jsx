import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, Github, Twitter, Heart, Shield, Globe } from 'lucide-react';
import { POPULAR_CITIES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';

export const Footer = () => {
  const { setLocation } = useLocation();

  return (
    <footer className="bg-[#070A12] border-t border-slate-800/80 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                WeatherSphere
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation live weather radar, wind streamline maps, 7-day micro-forecasts, and environmental air quality intelligence for global citizens.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Open-Meteo Verified Data</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-400" /> Global Coverage</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Weather Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/maps" className="hover:text-cyan-400 transition">Interactive Radar Maps</Link></li>
              <li><Link to="/hourly" className="hover:text-cyan-400 transition">24-Hour Breakdown</Link></li>
              <li><Link to="/weekly" className="hover:text-cyan-400 transition">7-Day Outlook</Link></li>
              <li><Link to="/air-quality" className="hover:text-cyan-400 transition">Air Quality Monitor</Link></li>
              <li><Link to="/alerts" className="hover:text-cyan-400 transition">Weather Alerts & Storms</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-400 transition">City Weather Comparison</Link></li>
            </ul>
          </div>

          {/* Quick Cities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Top Hubs</h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_CITIES.slice(0, 6).map((city) => (
                <li key={city.name}>
                  <button
                    onClick={() => setLocation(city)}
                    className="hover:text-cyan-400 transition flex items-center gap-1.5"
                  >
                    <span>{city.flag}</span>
                    <span>{city.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/blog" className="hover:text-cyan-400 transition">Weather Insights Blog</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">About WeatherSphere</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact & API</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} WeatherSphere Inc. All rights reserved. Powered by Open-Meteo & Leaflet.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms</Link>
            <Link to="/sitemap.xml" target="_blank" className="hover:text-slate-400 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
