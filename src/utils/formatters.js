import { AQI_LEVELS, WMO_WEATHER_CODES } from './constants';

export const formatTemperature = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined) return '--';
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};

export const formatWindSpeed = (kmh, unit = 'kmh') => {
  if (kmh === null || kmh === undefined) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  if (unit === 'knots') {
    return `${Math.round(kmh * 0.539957)} kn`;
  }
  return `${Math.round(kmh)} km/h`;
};

export const formatPressure = (hpa, unit = 'hpa') => {
  if (hpa === null || hpa === undefined) return '--';
  if (unit === 'inhg') {
    return `${(hpa * 0.02953).toFixed(2)} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
};

export const getWindDirectionName = (degrees) => {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getWindDirection = getWindDirectionName;

export const getAQIDetails = (usAqi) => {
  if (usAqi === undefined || usAqi === null) {
    return AQI_LEVELS[0];
  }
  const level = AQI_LEVELS.find(item => usAqi >= item.min && usAqi <= item.max);
  return level || AQI_LEVELS[AQI_LEVELS.length - 1];
};

export const getWeatherCondition = (code) => {
  return WMO_WEATHER_CODES[code] || {
    description: 'Unknown',
    icon: 'Cloud',
    color: 'text-slate-400',
    category: 'Cloudy'
  };
};

export const formatTime = (isoString, timeZone) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return isoString;
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {
    return isoString;
  }
};

export const getUVIndexCategory = (uv) => {
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-400', bar: 'bg-emerald-500' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-amber-400', bar: 'bg-amber-500' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-400', bar: 'bg-orange-500' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-400', bar: 'bg-red-500' };
  return { label: 'Extreme', color: 'text-purple-400', bar: 'bg-purple-600' };
};
