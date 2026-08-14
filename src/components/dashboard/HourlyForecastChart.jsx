import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Clock, Droplets, Thermometer } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTime, formatTemperature } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const HourlyForecastChart = () => {
  const { weatherData } = useWeather();
  const { tempUnit, windUnit } = useSettings();
  const [activeMetric, setActiveMetric] = useState('temp'); // 'temp', 'rain', 'wind'

  if (!weatherData || !weatherData.hourly) return null;

  const hourlyList = weatherData.hourly.slice(0, 24);

  const labels = hourlyList.map(item => formatTime(item.time));
  
  const temps = hourlyList.map(item => {
    return tempUnit === 'F' ? Math.round((item.temp * 9) / 5 + 32) : Math.round(item.temp);
  });

  const precipChance = hourlyList.map(item => item.precipitationProbability || 0);
  const windSpeeds = hourlyList.map(item => {
    if (windUnit === 'mph') return Math.round(item.windSpeed * 0.621371);
    if (windUnit === 'ms') return Math.round(item.windSpeed / 3.6);
    if (windUnit === 'knots') return Math.round(item.windSpeed * 0.539957);
    return Math.round(item.windSpeed);
  });

  const getChartData = () => {
    if (activeMetric === 'rain') {
      return {
        labels,
        datasets: [
          {
            fill: true,
            label: 'Precipitation Chance (%)',
            data: precipChance,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            tension: 0.4,
            pointBackgroundColor: '#60A5FA',
            pointRadius: 3
          }
        ]
      };
    }
    if (activeMetric === 'wind') {
      return {
        labels,
        datasets: [
          {
            fill: true,
            label: `Wind Speed (${windUnit})`,
            data: windSpeeds,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            tension: 0.4,
            pointBackgroundColor: '#22D3EE',
            pointRadius: 3
          }
        ]
      };
    }
    // Default 'temp'
    return {
      labels,
      datasets: [
        {
          fill: true,
          label: `Temperature (°${tempUnit})`,
          data: temps,
          borderColor: '#06B6D4',
          backgroundColor: (context) => {
            const ctx = context.chart?.ctx;
            if (!ctx) return 'rgba(6, 182, 212, 0.2)';
            const gradient = ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
            gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
            return gradient;
          },
          tension: 0.4,
          pointBackgroundColor: '#22D3EE',
          pointBorderColor: '#0B0F19',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const options = {
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
        boxPadding: 6,
        displayColors: false,
        callbacks: {
          label: (context) => {
            if (activeMetric === 'temp') return `Temperature: ${context.parsed.y}°${tempUnit}`;
            if (activeMetric === 'rain') return `Precipitation Chance: ${context.parsed.y}%`;
            return `Wind Speed: ${context.parsed.y} ${windUnit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>24-Hour Forecast Trend</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeMetric === 'temp' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeMetric === 'rain' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeMetric === 'wind' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wind Speed
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <Line data={getChartData()} options={options} />
      </div>
    </div>
  );
};
