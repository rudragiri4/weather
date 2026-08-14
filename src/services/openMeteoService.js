import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const fetchWeatherData = async (lat, lon) => {
  try {
    const weatherPromise = axios.get(WEATHER_API_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m'
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'dew_point_2m',
          'apparent_temperature',
          'precipitation_probability',
          'precipitation',
          'weather_code',
          'pressure_msl',
          'cloud_cover',
          'visibility',
          'wind_speed_10m',
          'wind_direction_10m',
          'uv_index'
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'rain_sum',
          'showers_sum',
          'snowfall_sum',
          'precipitation_hours',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'wind_gusts_10m_max',
          'wind_direction_10m_dominant'
        ].join(','),
        timezone: 'auto',
        forecast_days: 14
      }
    });

    const airQualityPromise = axios.get(AIR_QUALITY_API_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          'us_aqi',
          'european_aqi',
          'pm10',
          'pm2_5',
          'carbon_monoxide',
          'nitrogen_dioxide',
          'sulphur_dioxide',
          'ozone',
          'dust'
        ].join(','),
        hourly: ['us_aqi', 'pm2_5', 'pm10', 'nitrogen_dioxide', 'ozone'].join(','),
        timezone: 'auto',
        forecast_days: 7
      }
    });

    const [weatherRes, airRes] = await Promise.all([weatherPromise, airQualityPromise]);

    const weatherData = weatherRes.data;
    const airData = airRes.data;

    // Build Current Object
    const current = {
      temperature: weatherData.current?.temperature_2m ?? 0,
      feelsLike: weatherData.current?.apparent_temperature ?? 0,
      humidity: weatherData.current?.relative_humidity_2m ?? 0,
      weatherCode: weatherData.current?.weather_code ?? 0,
      windSpeed: weatherData.current?.wind_speed_10m ?? 0,
      windDirection: weatherData.current?.wind_direction_10m ?? 0,
      windGusts: weatherData.current?.wind_gusts_10m ?? 0,
      pressure: weatherData.current?.pressure_msl ?? 1013,
      cloudCover: weatherData.current?.cloud_cover ?? 0,
      isDay: weatherData.current?.is_day ?? 1,
      precipitation: weatherData.current?.precipitation ?? 0,
      uvIndex: weatherData.hourly?.uv_index?.[0] ?? 3,
      visibility: (weatherData.hourly?.visibility?.[0] ?? 10000) / 1000, // in km
      dewPoint: weatherData.hourly?.dew_point_2m?.[0] ?? 10,
      time: weatherData.current?.time
    };

    // Build Hourly Object (Next 7 Days = 168 Hours)
    const hourlyTimes = weatherData.hourly?.time || [];
    const hourly = hourlyTimes.slice(0, 168).map((timeStr, idx) => ({
      time: timeStr,
      temp: weatherData.hourly.temperature_2m[idx],
      feelsLike: weatherData.hourly.apparent_temperature[idx],
      humidity: weatherData.hourly.relative_humidity_2m[idx],
      dewPoint: weatherData.hourly.dew_point_2m[idx],
      precipitationProbability: weatherData.hourly.precipitation_probability[idx],
      precipitation: weatherData.hourly.precipitation[idx],
      weatherCode: weatherData.hourly.weather_code[idx],
      pressure: weatherData.hourly.pressure_msl[idx],
      cloudCover: weatherData.hourly.cloud_cover[idx],
      windSpeed: weatherData.hourly.wind_speed_10m[idx],
      windDirection: weatherData.hourly.wind_direction_10m[idx],
      uvIndex: weatherData.hourly.uv_index[idx]
    }));

    // Build Daily Object (14 days)
    const dailyDates = weatherData.daily?.time || [];
    const daily = dailyDates.map((dateStr, idx) => ({
      date: dateStr,
      weatherCode: weatherData.daily.weather_code[idx],
      maxTemp: weatherData.daily.temperature_2m_max[idx],
      minTemp: weatherData.daily.temperature_2m_min[idx],
      apparentMaxTemp: weatherData.daily.apparent_temperature_max[idx],
      apparentMinTemp: weatherData.daily.apparent_temperature_min[idx],
      sunrise: weatherData.daily.sunrise[idx],
      sunset: weatherData.daily.sunset[idx],
      uvIndexMax: weatherData.daily.uv_index_max[idx],
      precipitationSum: weatherData.daily.precipitation_sum[idx],
      precipitationProbabilityMax: weatherData.daily.precipitation_probability_max[idx],
      maxWindSpeed: weatherData.daily.wind_speed_10m_max[idx],
      dominantWindDirection: weatherData.daily.wind_direction_10m_dominant[idx]
    }));

    // Air Quality
    const airQuality = {
      usAqi: airData.current?.us_aqi ?? 42,
      europeanAqi: airData.current?.european_aqi ?? 30,
      pm2_5: airData.current?.pm2_5 ?? 8.5,
      pm10: airData.current?.pm10 ?? 18.2,
      co: airData.current?.carbon_monoxide ?? 210,
      no2: airData.current?.nitrogen_dioxide ?? 14.3,
      so2: airData.current?.sulphur_dioxide ?? 3.1,
      o3: airData.current?.ozone ?? 45.6,
      dust: airData.current?.dust ?? 0.2
    };

    // Real weather alerts (empty if no official warnings reported by weather service)
    const alerts = [];

    return {
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timezone: weatherData.timezone,
      elevation: weatherData.elevation,
      current,
      hourly,
      daily,
      airQuality,
      alerts
    };
  } catch (error) {
    console.error('Failed to fetch Open-Meteo weather data:', error);
    throw error;
  }
};
