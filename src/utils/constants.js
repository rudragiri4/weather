export const DEFAULT_LOCATION = {
  name: 'New Delhi',
  country: 'India',
  countryCode: 'IN',
  latitude: 28.6139,
  longitude: 77.2090,
  admin1: 'Delhi'
};

export const POPULAR_CITIES = [
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, flag: '🇮🇳' },
  { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, flag: '🇮🇳' },
  { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, flag: '🇮🇳' },
  { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, flag: '🇮🇳' },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, flag: '🇮🇳' },
  { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, flag: '🇮🇳' },
  { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867, flag: '🇮🇳' },
  { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, flag: '🇮🇳' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, flag: '🇬🇧' },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, flag: '🇺🇸' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, flag: '🇯🇵' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, flag: '🇦🇪' }
];

export const WMO_WEATHER_CODES = {
  0: { description: 'Clear Sky', icon: 'Sun', color: 'text-amber-400', category: 'Clear' },
  1: { description: 'Mainly Clear', icon: 'SunDim', color: 'text-amber-300', category: 'Clear' },
  2: { description: 'Partly Cloudy', icon: 'CloudSun', color: 'text-sky-300', category: 'Cloudy' },
  3: { description: 'Overcast', icon: 'Cloud', color: 'text-slate-400', category: 'Cloudy' },
  45: { description: 'Foggy', icon: 'CloudFog', color: 'text-teal-300', category: 'Fog' },
  48: { description: 'Depositing Rime Fog', icon: 'CloudFog', color: 'text-teal-300', category: 'Fog' },
  51: { description: 'Light Drizzle', icon: 'CloudDrizzle', color: 'text-blue-300', category: 'Rain' },
  53: { description: 'Moderate Drizzle', icon: 'CloudDrizzle', color: 'text-blue-400', category: 'Rain' },
  55: { description: 'Dense Drizzle', icon: 'CloudRain', color: 'text-blue-500', category: 'Rain' },
  56: { description: 'Light Freezing Drizzle', icon: 'CloudHail', color: 'text-cyan-300', category: 'Rain' },
  57: { description: 'Dense Freezing Drizzle', icon: 'CloudHail', color: 'text-cyan-400', category: 'Rain' },
  61: { description: 'Slight Rain', icon: 'CloudRain', color: 'text-blue-400', category: 'Rain' },
  63: { description: 'Moderate Rain', icon: 'CloudRain', color: 'text-blue-500', category: 'Rain' },
  65: { description: 'Heavy Rain', icon: 'CloudRainWind', color: 'text-blue-600', category: 'Rain' },
  66: { description: 'Light Freezing Rain', icon: 'CloudHail', color: 'text-cyan-400', category: 'Rain' },
  67: { description: 'Heavy Freezing Rain', icon: 'CloudHail', color: 'text-cyan-500', category: 'Rain' },
  71: { description: 'Slight Snow Fall', icon: 'CloudSnow', color: 'text-indigo-200', category: 'Snow' },
  73: { description: 'Moderate Snow Fall', icon: 'CloudSnow', color: 'text-indigo-300', category: 'Snow' },
  75: { description: 'Heavy Snow Fall', icon: 'Snowflake', color: 'text-indigo-400', category: 'Snow' },
  77: { description: 'Snow Grains', icon: 'Snowflake', color: 'text-indigo-200', category: 'Snow' },
  80: { description: 'Slight Rain Showers', icon: 'CloudRain', color: 'text-sky-400', category: 'Rain' },
  81: { description: 'Moderate Rain Showers', icon: 'CloudRain', color: 'text-sky-500', category: 'Rain' },
  82: { description: 'Violent Rain Showers', icon: 'CloudRainWind', color: 'text-blue-700', category: 'Rain' },
  85: { description: 'Slight Snow Showers', icon: 'CloudSnow', color: 'text-sky-200', category: 'Snow' },
  86: { description: 'Heavy Snow Showers', icon: 'Snowflake', color: 'text-sky-300', category: 'Snow' },
  95: { description: 'Thunderstorm', icon: 'CloudLightning', color: 'text-purple-400', category: 'Thunderstorm' },
  96: { description: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', color: 'text-purple-500', category: 'Thunderstorm' },
  99: { description: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning', color: 'text-purple-600', category: 'Thunderstorm' }
};

export const MAP_LAYERS = [
  { id: 'wind', name: 'Wind Speed', unit: 'km/h', icon: 'Wind', color: 'from-cyan-500 to-blue-600' },
  { id: 'temp', name: 'Temperature', unit: '°C', icon: 'Thermometer', color: 'from-amber-500 to-red-600' },
  { id: 'rain', name: 'Precipitation Radar', unit: 'mm/h', icon: 'CloudRain', color: 'from-blue-400 to-indigo-600' },
  { id: 'clouds', name: 'Cloud Cover', unit: '%', icon: 'Cloud', color: 'from-slate-400 to-slate-600' },
  { id: 'pressure', name: 'Sea Pressure', unit: 'hPa', icon: 'Gauge', color: 'from-emerald-500 to-teal-700' },
  { id: 'aqi', name: 'Air Quality', unit: 'AQI', icon: 'ShieldAlert', color: 'from-emerald-400 via-amber-400 to-purple-600' }
];

export const AQI_LEVELS = [
  { min: 0, max: 50, label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-400', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { min: 51, max: 100, label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-400', description: 'Air quality is acceptable; sensitive groups may experience minor health concerns.' },
  { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-400', description: 'Members of sensitive groups may experience health effects.' },
  { min: 151, max: 200, label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-400', description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.' },
  { min: 201, max: 300, label: 'Very Unhealthy', color: 'bg-purple-600', text: 'text-purple-400', description: 'Health alert: The risk of health effects is increased for everyone.' },
  { min: 301, max: 500, label: 'Hazardous', color: 'bg-rose-900', text: 'text-rose-400', description: 'Health warning of emergency conditions: Everyone is more likely to be affected.' }
];
