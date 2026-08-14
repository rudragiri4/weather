import axios from 'axios';

const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Helper to convert OpenWeather Weather ID to WMO Weather Code
const openWeatherToWmoCode = (id) => {
  if (id >= 200 && id < 300) return 95; // Thunderstorm
  if (id >= 300 && id < 400) return 51; // Drizzle
  if (id >= 500 && id < 600) {
    if (id === 500 || id === 501) return 61; // Light rain
    if (id === 502 || id === 503 || id === 504) return 65; // Heavy rain
    if (id >= 520 && id <= 531) return 80; // Rain showers
    return 63; // Moderate rain
  }
  if (id >= 600 && id < 700) {
    if (id === 600 || id === 601) return 71; // Light snow
    if (id === 602) return 75; // Heavy snow
    if (id >= 620 && id <= 622) return 85; // Snow showers
    return 73; // Moderate snow
  }
  if (id >= 700 && id < 800) return 45; // Fog
  if (id === 800) return 0; // Clear
  if (id === 801) return 1; // Mainly clear
  if (id === 802) return 2; // Partly cloudy
  if (id === 803 || id === 804) return 3; // Overcast
  return 0;
};

// Helper to map 1-5 AQI index to US AQI scale
const mapOpenWeatherAqiToUsAqi = (aqi, comps) => {
  const pm25 = comps?.pm2_5;
  if (pm25 !== undefined) {
    if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25);
    if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  }
  const mappings = { 1: 35, 2: 75, 3: 125, 4: 175, 5: 250 };
  return mappings[aqi] || 42;
};

// Main Fetcher
export const fetchOpenWeatherData = async (lat, lon, apiKey) => {
  if (!apiKey) {
    throw new Error('OpenWeather API Key is required.');
  }

  // 1. Try One Call 3.0 API first
  try {
    const response = await axios.get(ONE_CALL_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        exclude: 'minutely',
        appid: apiKey
      }
    });

    const data = response.data;

    // Fetch Air pollution separately (required for One Call as well)
    let airQuality = { usAqi: 42, europeanAqi: 30, pm2_5: 8.5, pm10: 18.2, co: 210, no2: 14.3, so2: 3.1, o3: 45.6, dust: 0.2 };
    try {
      const airPollutionRes = await axios.get(AIR_POLLUTION_URL, {
        params: { lat, lon, appid: apiKey }
      });
      if (airPollutionRes.data?.list?.[0]) {
        const item = airPollutionRes.data.list[0];
        airQuality = {
          usAqi: mapOpenWeatherAqiToUsAqi(item.main.aqi, item.components),
          europeanAqi: item.main.aqi * 20,
          pm2_5: item.components.pm2_5,
          pm10: item.components.pm10,
          co: item.components.co,
          no2: item.components.no2,
          so2: item.components.so2,
          o3: item.components.o3,
          dust: 0.1
        };
      }
    } catch (err) {
      console.warn('Failed to fetch Air Pollution for OneCall 3.0:', err);
    }

    const current = {
      temperature: data.current.temp,
      feelsLike: data.current.feels_like,
      humidity: data.current.humidity,
      weatherCode: openWeatherToWmoCode(data.current.weather[0].id),
      windSpeed: data.current.wind_speed * 3.6, // m/s to km/h
      windDirection: data.current.wind_deg,
      windGusts: (data.current.wind_gust ?? data.current.wind_speed) * 3.6,
      pressure: data.current.pressure,
      cloudCover: data.current.clouds,
      isDay: data.current.dt > data.current.sunrise && data.current.dt < data.current.sunset ? 1 : 0,
      precipitation: data.current.rain?.['1h'] ?? data.current.snow?.['1h'] ?? 0,
      uvIndex: data.current.uvi,
      visibility: (data.current.visibility ?? 10000) / 1000,
      dewPoint: data.current.dew_point,
      time: new Date(data.current.dt * 1000).toISOString().slice(0, 16)
    };

    const hourly = (data.hourly || []).slice(0, 24).map(hour => ({
      time: new Date(hour.dt * 1000).toISOString().slice(0, 16),
      temp: hour.temp,
      feelsLike: hour.feels_like,
      humidity: hour.humidity,
      dewPoint: hour.dew_point,
      precipitationProbability: Math.round((hour.pop ?? 0) * 100),
      precipitation: hour.rain?.['1h'] ?? hour.snow?.['1h'] ?? 0,
      weatherCode: openWeatherToWmoCode(hour.weather[0].id),
      pressure: hour.pressure,
      cloudCover: hour.clouds,
      windSpeed: hour.wind_speed * 3.6,
      windDirection: hour.wind_deg,
      uvIndex: hour.uvi
    }));

    const daily = (data.daily || []).map(day => ({
      date: new Date(day.dt * 1000).toISOString().split('T')[0],
      weatherCode: openWeatherToWmoCode(day.weather[0].id),
      maxTemp: day.temp.max,
      minTemp: day.temp.min,
      apparentMaxTemp: day.feels_like.day,
      apparentMinTemp: day.feels_like.night,
      sunrise: new Date(day.sunrise * 1000).toISOString(),
      sunset: new Date(day.sunset * 1000).toISOString(),
      uvIndexMax: day.uvi,
      precipitationSum: day.rain ?? day.snow ?? 0,
      precipitationProbabilityMax: Math.round((day.pop ?? 0) * 100),
      maxWindSpeed: day.wind_speed * 3.6,
      dominantWindDirection: day.wind_deg
    }));

    const alerts = (data.alerts || []).map((alert, idx) => ({
      id: `ow-${idx}-${alert.start}`,
      severity: alert.severity || 'Moderate',
      event: alert.event,
      headline: alert.sender_name || 'OpenWeather Alert',
      description: alert.description,
      area: alert.tags?.join(', ') || 'Forecast Area'
    }));

    return {
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
      elevation: 0,
      current,
      hourly,
      daily,
      airQuality,
      alerts
    };

  } catch (error) {
    // If it's a 401/403 or other One Call subscription error, fall back to individual APIs
    const isAuthError = error.response && (error.response.status === 401 || error.response.status === 403);
    
    if (isAuthError) {
      console.warn('One Call 3.0 API auth failed. Falling back to OpenWeather 2.5 APIs...');
      return fetchOpenWeather25Fallback(lat, lon, apiKey);
    }
    
    console.error('Failed to fetch OpenWeather data:', error);
    throw error;
  }
};

// Fallback logic for OpenWeather 2.5 Free APIs (Current + 5-day / 3-hour forecast + Air pollution)
const fetchOpenWeather25Fallback = async (lat, lon, apiKey) => {
  try {
    const currentPromise = axios.get(CURRENT_WEATHER_URL, {
      params: { lat, lon, units: 'metric', appid: apiKey }
    });

    const forecastPromise = axios.get(FORECAST_URL, {
      params: { lat, lon, units: 'metric', appid: apiKey }
    });

    const airPollutionPromise = axios.get(AIR_POLLUTION_URL, {
      params: { lat, lon, appid: apiKey }
    });

    const [currentRes, forecastRes, airRes] = await Promise.all([
      currentPromise,
      forecastPromise,
      airPollutionPromise
    ]);

    const cur = currentRes.data;
    const fore = forecastRes.data;
    const air = airRes.data;

    // Estimate dewPoint and UV index for Current
    const curRh = cur.main.humidity;
    const curTemp = cur.main.temp;
    const curDewPoint = Math.round(curTemp - ((100 - curRh) / 5));
    const isDayTime = cur.dt > cur.sys.sunrise && cur.dt < cur.sys.sunset;
    const curUv = isDayTime ? Math.max(1, Math.round(8 * (1 - cur.clouds.all / 100))) : 0;

    const current = {
      temperature: curTemp,
      feelsLike: cur.main.feels_like,
      humidity: curRh,
      weatherCode: openWeatherToWmoCode(cur.weather[0].id),
      windSpeed: cur.wind.speed * 3.6,
      windDirection: cur.wind.deg,
      windGusts: (cur.wind.gust ?? cur.wind.speed) * 3.6,
      pressure: cur.main.pressure,
      cloudCover: cur.clouds.all,
      isDay: isDayTime ? 1 : 0,
      precipitation: cur.rain?.['1h'] ?? cur.snow?.['1h'] ?? 0,
      uvIndex: curUv,
      visibility: (cur.visibility ?? 10000) / 1000,
      dewPoint: curDewPoint,
      time: new Date(cur.dt * 1000).toISOString().slice(0, 16)
    };

    // Interpolate hourly values (next 24 hours) from 3-hourly intervals
    const hourly = [];
    const maxHours = 24;
    const list = fore.list || [];
    
    for (let h = 0; h < maxHours; h++) {
      const listIdx = Math.floor(h / 3);
      const remainder = h % 3;
      const currentItem = list[listIdx];
      const nextItem = list[listIdx + 1] || currentItem;
      
      if (!currentItem) break;
      
      const t = remainder / 3;
      const interpolate = (val1, val2) => val1 + (val2 - val1) * t;
      
      const timeMs = currentItem.dt * 1000 + remainder * 60 * 60 * 1000;
      const timeStr = new Date(timeMs).toISOString().slice(0, 16);
      
      const interpTemp = interpolate(currentItem.main.temp, nextItem.main.temp);
      const interpRh = interpolate(currentItem.main.humidity, nextItem.main.humidity);
      
      hourly.push({
        time: timeStr,
        temp: parseFloat(interpTemp.toFixed(1)),
        feelsLike: parseFloat(interpolate(currentItem.main.feels_like, nextItem.main.feels_like).toFixed(1)),
        humidity: Math.round(interpRh),
        dewPoint: Math.round(interpTemp - ((100 - interpRh) / 5)),
        precipitationProbability: Math.round(interpolate(currentItem.pop ?? 0, nextItem.pop ?? 0) * 100),
        precipitation: parseFloat(((currentItem.rain?.['3h'] ?? currentItem.snow?.['3h'] ?? 0) / 3).toFixed(1)),
        weatherCode: openWeatherToWmoCode(currentItem.weather[0].id),
        pressure: Math.round(interpolate(currentItem.main.pressure, nextItem.main.pressure)),
        cloudCover: Math.round(interpolate(currentItem.clouds.all, nextItem.clouds.all)),
        windSpeed: parseFloat((interpolate(currentItem.wind.speed, nextItem.wind.speed) * 3.6).toFixed(1)),
        windDirection: Math.round(interpolate(currentItem.wind.deg, nextItem.wind.deg)),
        uvIndex: h >= 8 && h <= 17 ? Math.max(1, Math.round(6 * (1 - currentItem.clouds.all / 100))) : 0
      });
    }

    // Group forecast list by day to create Daily cards
    const daysMap = {};
    list.forEach(item => {
      const dateStr = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!daysMap[dateStr]) {
        daysMap[dateStr] = [];
      }
      daysMap[dateStr].push(item);
    });

    const daily = Object.keys(daysMap).map(dateStr => {
      const items = daysMap[dateStr];
      const temps = items.map(i => i.main.temp);
      const feels = items.map(i => i.main.feels_like);
      const windSpeeds = items.map(i => i.wind.speed);
      const windDegs = items.map(i => i.wind.deg);
      const pops = items.map(i => i.pop ?? 0);
      
      const codeCounts = {};
      items.forEach(i => {
        const id = i.weather[0].id;
        codeCounts[id] = (codeCounts[id] || 0) + 1;
      });
      const dominantId = Number(Object.keys(codeCounts).reduce((a, b) => codeCounts[a] > codeCounts[b] ? a : b));

      const precipSum = items.reduce((sum, i) => {
        const rain = i.rain?.['3h'] ?? 0;
        const snow = i.snow?.['3h'] ?? 0;
        return sum + rain + snow;
      }, 0);

      const dateObj = new Date(dateStr);
      const currentDay = new Date(cur.dt * 1000);
      const dayDiff = Math.round((dateObj - currentDay) / (24 * 60 * 60 * 1000));
      const sunrise = new Date((cur.sys.sunrise + dayDiff * 86400) * 1000).toISOString();
      const sunset = new Date((cur.sys.sunset + dayDiff * 86400) * 1000).toISOString();

      return {
        date: dateStr,
        weatherCode: openWeatherToWmoCode(dominantId),
        maxTemp: parseFloat(Math.max(...temps).toFixed(1)),
        minTemp: parseFloat(Math.min(...temps).toFixed(1)),
        apparentMaxTemp: parseFloat(Math.max(...feels).toFixed(1)),
        apparentMinTemp: parseFloat(Math.min(...feels).toFixed(1)),
        sunrise,
        sunset,
        uvIndexMax: Math.max(1, Math.round(7 * (1 - items[0].clouds.all / 100))),
        precipitationSum: parseFloat(precipSum.toFixed(1)),
        precipitationProbabilityMax: Math.round(Math.max(...pops) * 100),
        maxWindSpeed: parseFloat((Math.max(...windSpeeds) * 3.6).toFixed(1)),
        dominantWindDirection: Math.round(windDegs.reduce((a, b) => a + b, 0) / windDegs.length)
      };
    });

    const airQuality = air?.list?.[0]
      ? {
          usAqi: mapOpenWeatherAqiToUsAqi(air.list[0].main.aqi, air.list[0].components),
          europeanAqi: air.list[0].main.aqi * 20,
          pm2_5: air.list[0].components.pm2_5,
          pm10: air.list[0].components.pm10,
          co: air.list[0].components.co,
          no2: air.list[0].components.no2,
          so2: air.list[0].components.so2,
          o3: air.list[0].components.o3,
          dust: 0.1
        }
      : { usAqi: 42, europeanAqi: 30, pm2_5: 8.5, pm10: 18.2, co: 210, no2: 14.3, so2: 3.1, o3: 45.6, dust: 0.1 };

    return {
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      elevation: 0,
      current,
      hourly,
      daily,
      airQuality,
      alerts: [] // Free APIs don't have alerts endpoint
    };
  } catch (err) {
    console.error('Failed to execute fallback OpenWeather 2.5 fetch:', err);
    throw err;
  }
};
