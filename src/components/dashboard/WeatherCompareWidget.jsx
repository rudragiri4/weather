import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  Loader2, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldAlert, 
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Thermometer
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchWeatherData } from '../../services/openMeteoService';
import { useSettings } from '../../context/SettingsContext';
import { useLocation } from '../../context/LocationContext';
import { 
  formatTemperature, 
  getWeatherCondition, 
  formatWindSpeed,
  getAQIDetails
} from '../../utils/formatters';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

// Exactly the four major Indian states and representative cities
export const INDIAN_STATES_DATA = [
  {
    state: 'Gujarat',
    city: 'Ahmedabad',
    region: 'Western India',
    latitude: 23.0225,
    longitude: 72.5714,
    color: 'from-amber-500/20 to-orange-500/10',
    accentColor: '#f59e0b',
    icon: '🏛️'
  },
  {
    state: 'Maharashtra',
    city: 'Mumbai',
    region: 'Western Coastal',
    latitude: 19.0760,
    longitude: 72.8777,
    color: 'from-blue-500/20 to-cyan-500/10',
    accentColor: '#06b6d4',
    icon: '🌊'
  },
  {
    state: 'Rajasthan',
    city: 'Jaipur',
    region: 'Northern Desert',
    latitude: 26.9124,
    longitude: 75.7873,
    color: 'from-rose-500/20 to-pink-500/10',
    accentColor: '#f43f5e',
    icon: '🏰'
  },
  {
    state: 'Karnataka',
    city: 'Bengaluru',
    region: 'Southern Plateau',
    latitude: 12.9716,
    longitude: 77.5946,
    color: 'from-emerald-500/20 to-teal-500/10',
    accentColor: '#10b981',
    icon: '🌲'
  }
];

export const WeatherCompareWidget = () => {
  const { tempUnit, windUnit } = useSettings();
  const { setLocation } = useLocation();
  const [stateResults, setStateResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChartMetric, setActiveChartMetric] = useState('temp'); // 'temp', 'aqi', 'wind', 'humidity'

  const loadIndianStatesWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = INDIAN_STATES_DATA.map(async (item) => {
        const data = await fetchWeatherData(item.latitude, item.longitude);
        return {
          ...item,
          weather: data
        };
      });

      const results = await Promise.all(promises);
      setStateResults(results);
    } catch (err) {
      console.error('Failed to fetch Indian states comparison data:', err);
      setError('Unable to fetch live comparison data for Indian states. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndianStatesWeather();
  }, []);

  const handleSelectCityAsActive = (item) => {
    setLocation({
      name: `${item.city}, ${item.state}`,
      country: 'India',
      countryCode: 'IN',
      latitude: item.latitude,
      longitude: item.longitude,
      admin1: item.state
    });
  };

  // Chart Data Preparation
  const chartLabels = INDIAN_STATES_DATA.map(s => `${s.state}\n(${s.city})`);
  
  const getChartDataset = () => {
    if (!stateResults.length) return null;

    if (activeChartMetric === 'aqi') {
      return {
        labels: chartLabels,
        datasets: [
          {
            label: 'US AQI (Air Quality)',
            data: stateResults.map(r => r.weather?.airQuality?.usAqi ?? 0),
            backgroundColor: ['#f59e0b', '#06b6d4', '#f43f5e', '#10b981'],
            borderRadius: 12
          }
        ]
      };
    }
    if (activeChartMetric === 'wind') {
      return {
        labels: chartLabels,
        datasets: [
          {
            label: `Wind Speed (${windUnit})`,
            data: stateResults.map(r => {
              const speed = r.weather?.current?.windSpeed ?? 0;
              if (windUnit === 'mph') return Math.round(speed * 0.621371);
              if (windUnit === 'ms') return Math.round(speed / 3.6);
              if (windUnit === 'knots') return Math.round(speed * 0.539957);
              return Math.round(speed);
            }),
            backgroundColor: ['#f59e0b', '#06b6d4', '#f43f5e', '#10b981'],
            borderRadius: 12
          }
        ]
      };
    }
    if (activeChartMetric === 'humidity') {
      return {
        labels: chartLabels,
        datasets: [
          {
            label: 'Humidity (%)',
            data: stateResults.map(r => r.weather?.current?.humidity ?? 0),
            backgroundColor: ['#f59e0b', '#06b6d4', '#f43f5e', '#10b981'],
            borderRadius: 12
          }
        ]
      };
    }
    // Default 'temp'
    return {
      labels: chartLabels,
      datasets: [
        {
          label: `Current Temperature (°${tempUnit})`,
          data: stateResults.map(r => {
            const t = r.weather?.current?.temperature ?? 0;
            return tempUnit === 'F' ? Math.round((t * 9) / 5 + 32) : Math.round(t);
          }),
          backgroundColor: ['#f59e0b', '#06b6d4', '#f43f5e', '#10b981'],
          borderRadius: 12
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 11, weight: 'bold' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              Major Indian States Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Live meteorological analytics across 4 key Indian states
            </p>
          </div>
        </div>

        <button
          onClick={loadIndianStatesWeather}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh All States</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-900/60 rounded-3xl border border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-sm font-medium">Fetching live meteorological data for Gujarat, Maharashtra, Rajasthan & Karnataka...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-300 bg-rose-950/20 border border-rose-500/30 rounded-3xl space-y-3">
          <p>{error}</p>
          <button
            onClick={loadIndianStatesWeather}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <>
          {/* 4 State Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stateResults.map((item) => {
              const current = item.weather?.current;
              const airQuality = item.weather?.airQuality;
              const condition = current ? getWeatherCondition(current.weatherCode) : null;
              const aqiDetails = airQuality?.usAqi != null ? getAQIDetails(airQuality.usAqi) : null;
              const rainChance = item.weather?.hourly?.[0]?.precipitationProbability ?? 0;

              return (
                <div
                  key={item.state}
                  className={`bg-gradient-to-b ${item.color} to-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 shadow-xl transition backdrop-blur-xl flex flex-col justify-between group`}
                >
                  {/* Top State Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-display text-lg font-black text-white">
                            {item.state}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {item.city} ({item.region})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectCityAsActive(item)}
                        title="Set as global active city & view full forecast"
                        className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-800 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Temperature & Condition */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <div className="font-display text-3xl sm:text-4xl font-black text-white">
                        {current ? formatTemperature(current.temperature, tempUnit) : '--'}
                      </div>
                      {current && (
                        <span className="text-xs text-slate-400 font-medium">
                          Feels {formatTemperature(current.feelsLike, tempUnit)}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${condition?.color || 'text-cyan-400'} block`}>
                      {condition?.description || 'Atmospheric telemetry'}
                    </span>
                  </div>

                  {/* Parameter Grid */}
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        Wind Speed
                      </span>
                      <span className="font-bold text-slate-100">
                        {current ? formatWindSpeed(current.windSpeed, windUnit) : '--'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        Humidity / Rain
                      </span>
                      <span className="font-bold text-blue-400">
                        {current?.humidity ?? '--'}% ({rainChance}%)
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        UV Index
                      </span>
                      <span className="font-bold text-amber-400">
                        {current?.uvIndex ?? 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                        Air Quality
                      </span>
                      {airQuality?.usAqi != null ? (
                        <span className={`font-bold ${aqiDetails?.text || 'text-emerald-400'}`}>
                          {Math.round(airQuality.usAqi)} AQI ({aqiDetails?.label || 'Moderate'})
                        </span>
                      ) : (
                        <span className="text-slate-500">Not available</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectCityAsActive(item)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Select {item.city}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Comparison Visual Bar Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Inter-State Comparative Bar Chart</span>
              </div>

              {/* Metric switcher tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold flex-wrap">
                <button
                  onClick={() => setActiveChartMetric('temp')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeChartMetric === 'temp' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Temperature
                </button>
                <button
                  onClick={() => setActiveChartMetric('aqi')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeChartMetric === 'aqi' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Air Quality
                </button>
                <button
                  onClick={() => setActiveChartMetric('wind')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeChartMetric === 'wind' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Wind Speed
                </button>
                <button
                  onClick={() => setActiveChartMetric('humidity')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeChartMetric === 'humidity' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Humidity
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <Bar data={getChartDataset()} options={chartOptions} />
            </div>
          </div>

          {/* Comparative Summary Matrix Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              Side-by-Side Meteorological Matrix
            </h3>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                    <th className="py-3 px-4 rounded-l-xl">State & City</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Temperature</th>
                    <th className="py-3 px-4">Wind Speed</th>
                    <th className="py-3 px-4">Humidity</th>
                    <th className="py-3 px-4">Rain Risk</th>
                    <th className="py-3 px-4 rounded-r-xl">US AQI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stateResults.map((item) => {
                    const current = item.weather?.current;
                    const condition = current ? getWeatherCondition(current.weatherCode) : null;
                    const aqi = item.weather?.airQuality?.usAqi;
                    const aqiDetails = aqi != null ? getAQIDetails(aqi) : null;
                    const rainChance = item.weather?.hourly?.[0]?.precipitationProbability ?? 0;

                    return (
                      <tr key={item.state} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <span>{item.icon}</span>
                          <div>
                            <div>{item.state}</div>
                            <span className="text-[11px] text-slate-400 font-normal">{item.city}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${condition?.color || 'text-cyan-400'} font-medium`}>
                            {condition?.description || '--'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-white">
                          {current ? formatTemperature(current.temperature, tempUnit) : '--'}
                        </td>
                        <td className="py-3 px-4 text-slate-200">
                          {current ? formatWindSpeed(current.windSpeed, windUnit) : '--'}
                        </td>
                        <td className="py-3 px-4 text-slate-200">
                          {current?.humidity ?? '--'}%
                        </td>
                        <td className="py-3 px-4 text-blue-400 font-semibold">
                          {rainChance}%
                        </td>
                        <td className="py-3 px-4 font-bold">
                          {aqi != null ? (
                            <span className={aqiDetails?.text || 'text-emerald-400'}>
                              {Math.round(aqi)} ({aqiDetails?.label})
                            </span>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
