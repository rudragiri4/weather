import axios from 'axios';

const WINDY_URL = 'https://api.windy.com/api/point-forecast/v2';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Heat Index / Wind Chill approximation
const getFeelsLike = (temp, windSpd, rh) => {
  if (temp < 10 && windSpd > 1.3) {
    // Wind chill formula
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpd * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpd * 3.6, 0.16);
  }
  if (temp > 26) {
    // Heat Index formula
    return temp + 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (rh * 0.094));
  }
  return temp;
};

// Estimate WMO Code
const estimateWmoCode = (precip, clouds) => {
  if (precip > 0) {
    if (precip > 2.5) return 65; // Heavy rain
    if (precip > 0.5) return 63; // Moderate rain
    return 61; // Light rain
  }
  if (clouds > 80) return 3; // Overcast
  if (clouds > 50) return 2; // Partly cloudy
  if (clouds > 20) return 1; // Mainly clear
  return 0; // Clear
};

export const fetchWindyData = async (lat, lon, apiKey, model = 'gfs') => {
  if (!apiKey) {
    throw new Error('Windy API key is required.');
  }

  try {
    // 1. Fetch weather forecast from Windy
    const windyPromise = axios.post(
      WINDY_URL,
      {
        lat,
        lon,
        model,
        parameters: ['temp', 'wind', 'windGust', 'pressure', 'rh', 'dewpoint', 'precip', 'clouds', 'uv'],
        levels: ['surface'],
        key: apiKey
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // 2. Fetch air quality from Open-Meteo (Free fallback)
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
        timezone: 'auto'
      }
    });

    const [windyRes, airRes] = await Promise.all([windyPromise, airQualityPromise]);
    const data = windyRes.data;
    const airData = airRes.data;

    if (!data.ts || data.ts.length === 0) {
      throw new Error('No data received from Windy Point Forecast API.');
    }

    const ts = data.ts;
    const isK = data.units?.['temp-surface'] === 'K';
    const isPa = data.units?.['pressure-surface'] === 'Pa';

    // Helper to get raw value safely
    const getRaw = (param, idx) => {
      const val = data[`${param}-surface`]?.[idx];
      return val !== undefined && val !== null ? val : 0;
    };

    // Find the closest index to current time
    const now = Date.now();
    let currentIdx = 0;
    let minDiff = Math.abs(ts[0] - now);
    for (let i = 1; i < ts.length; i++) {
      const diff = Math.abs(ts[i] - now);
      if (diff < minDiff) {
        minDiff = diff;
        currentIdx = i;
      }
    }

    // Build Current Weather Object
    const curU = getRaw('wind_u', currentIdx);
    const curV = getRaw('wind_v', currentIdx);
    const curWindSpeed = Math.sqrt(curU * curU + curV * curV) * 3.6; // m/s to km/h
    const curWindDirection = (Math.atan2(curU, curV) * (180 / Math.PI) + 180) % 360;
    const curTemp = getRaw('temp', currentIdx) - (isK ? 273.15 : 0);
    const curRh = getRaw('rh', currentIdx);
    const curDew = getRaw('dewpoint', currentIdx) - (isK ? 273.15 : 0);
    const curPressure = getRaw('pressure', currentIdx) / (isPa ? 100 : 1);
    const curClouds = getRaw('clouds', currentIdx);
    const curPrecip = getRaw('precip', currentIdx);
    const curUv = getRaw('uv', currentIdx);

    const date = new Date(ts[currentIdx]);
    const hr = date.getHours();

    const current = {
      temperature: parseFloat(curTemp.toFixed(1)),
      feelsLike: parseFloat(getFeelsLike(curTemp, curWindSpeed / 3.6, curRh).toFixed(1)),
      humidity: Math.round(curRh),
      weatherCode: estimateWmoCode(curPrecip, curClouds),
      windSpeed: parseFloat(curWindSpeed.toFixed(1)),
      windDirection: Math.round(curWindDirection),
      windGusts: parseFloat((getRaw('windGust', currentIdx) * 3.6).toFixed(1)),
      pressure: Math.round(curPressure),
      cloudCover: Math.round(curClouds),
      isDay: hr >= 6 && hr <= 18 ? 1 : 0,
      precipitation: parseFloat(curPrecip.toFixed(2)),
      uvIndex: parseFloat(curUv.toFixed(1)),
      visibility: 10.0, // Default fallback
      dewPoint: Math.round(curDew),
      time: date.toISOString().slice(0, 16)
    };

    // Spacing check to interpolate to 1-hour increments if necessary
    const hourly = [];
    const spacingHours = (ts[1] - ts[0]) / (1000 * 60 * 60);

    if (spacingHours > 1.5) {
      for (let h = 0; h < 24; h++) {
        const timeTarget = ts[0] + h * 60 * 60 * 1000;
        let idx1 = 0;
        while (idx1 < ts.length - 1 && ts[idx1 + 1] <= timeTarget) {
          idx1++;
        }
        let idx2 = Math.min(ts.length - 1, idx1 + 1);

        const t = ts[idx1] === ts[idx2] ? 0 : (timeTarget - ts[idx1]) / (ts[idx2] - ts[idx1]);
        const interp = (param) => {
          const v1 = getRaw(param, idx1);
          const v2 = getRaw(param, idx2);
          return v1 + (v2 - v1) * t;
        };

        const u = getRaw('wind_u', idx1) + (getRaw('wind_u', idx2) - getRaw('wind_u', idx1)) * t;
        const v = getRaw('wind_v', idx1) + (getRaw('wind_v', idx2) - getRaw('wind_v', idx1)) * t;
        const windSpd = Math.sqrt(u * u + v * v) * 3.6;
        const windDir = (Math.atan2(u, v) * (180 / Math.PI) + 180) % 360;

        let temp = getRaw('temp', idx1) + (getRaw('temp', idx2) - getRaw('temp', idx1)) * t;
        if (isK) temp -= 273.15;

        const rh = interp('rh');
        const feels = getFeelsLike(temp, windSpd / 3.6, rh);
        const dew = interp('dewpoint') - (isK ? 273.15 : 0);
        const precip = interp('precip') / spacingHours;

        hourly.push({
          time: new Date(timeTarget).toISOString().slice(0, 16),
          temp: parseFloat(temp.toFixed(1)),
          feelsLike: parseFloat(feels.toFixed(1)),
          humidity: Math.round(rh),
          dewPoint: Math.round(dew),
          precipitationProbability: precip > 0.1 ? 60 : 10,
          precipitation: parseFloat(precip.toFixed(2)),
          weatherCode: estimateWmoCode(precip, interp('clouds')),
          pressure: Math.round(interp('pressure') / (isPa ? 100 : 1)),
          cloudCover: Math.round(interp('clouds')),
          windSpeed: parseFloat(windSpd.toFixed(1)),
          windDirection: Math.round(windDir),
          uvIndex: parseFloat((interp('uv') ?? 0).toFixed(1))
        });
      }
    } else {
      const count = Math.min(24, ts.length);
      for (let i = 0; i < count; i++) {
        const u = getRaw('wind_u', i);
        const v = getRaw('wind_v', i);
        const windSpd = Math.sqrt(u * u + v * v) * 3.6;
        const windDir = (Math.atan2(u, v) * (180 / Math.PI) + 180) % 360;
        const temp = getRaw('temp', i) - (isK ? 273.15 : 0);
        const rh = getRaw('rh', i);
        const dew = getRaw('dewpoint', i) - (isK ? 273.15 : 0);
        const precip = getRaw('precip', i);

        hourly.push({
          time: new Date(ts[i]).toISOString().slice(0, 16),
          temp: parseFloat(temp.toFixed(1)),
          feelsLike: parseFloat(getFeelsLike(temp, windSpd / 3.6, rh).toFixed(1)),
          humidity: Math.round(rh),
          dewPoint: Math.round(dew),
          precipitationProbability: precip > 0.1 ? 60 : 10,
          precipitation: parseFloat(precip.toFixed(2)),
          weatherCode: estimateWmoCode(precip, getRaw('clouds', i)),
          pressure: Math.round(getRaw('pressure', i) / (isPa ? 100 : 1)),
          cloudCover: Math.round(getRaw('clouds', i)),
          windSpeed: parseFloat(windSpd.toFixed(1)),
          windDirection: Math.round(windDir),
          uvIndex: parseFloat(getRaw('uv', i).toFixed(1))
        });
      }
    }

    // Group all intervals by Date to create Daily forecast
    const dailyMap = {};
    for (let i = 0; i < ts.length; i++) {
      const dateStr = new Date(ts[i]).toISOString().split('T')[0];
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = [];
      }
      dailyMap[dateStr].push(i);
    }

    const daily = Object.keys(dailyMap).map(dateStr => {
      const indices = dailyMap[dateStr];
      const temps = indices.map(idx => getRaw('temp', idx) - (isK ? 273.15 : 0));
      const rhVals = indices.map(idx => getRaw('rh', idx));
      
      const windSpeeds = indices.map(idx => {
        const u = getRaw('wind_u', idx);
        const v = getRaw('wind_v', idx);
        return Math.sqrt(u * u + v * v) * 3.6;
      });

      const windDegs = indices.map(idx => {
        const u = getRaw('wind_u', idx);
        const v = getRaw('wind_v', idx);
        return (Math.atan2(u, v) * (180 / Math.PI) + 180) % 360;
      });

      const feels = indices.map((idx, index) => 
        getFeelsLike(temps[index], windSpeeds[index] / 3.6, rhVals[index])
      );

      const precips = indices.map(idx => getRaw('precip', idx));
      const cloudsVals = indices.map(idx => getRaw('clouds', idx));
      const uvs = indices.map(idx => getRaw('uv', idx));

      const precipSum = precips.reduce((sum, v) => sum + v, 0);
      const avgClouds = cloudsVals.reduce((sum, v) => sum + v, 0) / indices.length;

      const dateObj = new Date(dateStr);
      // Sunrise/sunset placeholders at 6am/6pm local time
      const sunrise = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 6, 0, 0).toISOString();
      const sunset = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 18, 0, 0).toISOString();

      return {
        date: dateStr,
        weatherCode: estimateWmoCode(precipSum / indices.length, avgClouds),
        maxTemp: parseFloat(Math.max(...temps).toFixed(1)),
        minTemp: parseFloat(Math.min(...temps).toFixed(1)),
        apparentMaxTemp: parseFloat(Math.max(...feels).toFixed(1)),
        apparentMinTemp: parseFloat(Math.min(...feels).toFixed(1)),
        sunrise,
        sunset,
        uvIndexMax: parseFloat(Math.max(...uvs).toFixed(1)),
        precipitationSum: parseFloat(precipSum.toFixed(2)),
        precipitationProbabilityMax: precipSum > 0.5 ? 70 : 15,
        maxWindSpeed: parseFloat(Math.max(...windSpeeds).toFixed(1)),
        dominantWindDirection: Math.round(windDegs.reduce((a, b) => a + b, 0) / windDegs.length)
      };
    });

    // Build Air Quality
    const airQuality = airData?.current
      ? {
          usAqi: airData.current.us_aqi ?? 42,
          europeanAqi: airData.current.european_aqi ?? 30,
          pm2_5: airData.current.pm2_5 ?? 8.5,
          pm10: airData.current.pm10 ?? 18.2,
          co: airData.current.carbon_monoxide ?? 210,
          no2: airData.current.nitrogen_dioxide ?? 14.3,
          so2: airData.current.sulphur_dioxide ?? 3.1,
          o3: airData.current.ozone ?? 45.6,
          dust: airData.current.dust ?? 0.2
        }
      : { usAqi: 42, europeanAqi: 30, pm2_5: 8.5, pm10: 18.2, co: 210, no2: 14.3, so2: 3.1, o3: 45.6, dust: 0.2 };

    return {
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      elevation: 0,
      current,
      hourly,
      daily,
      airQuality,
      alerts: [] // Windy point forecast doesn't supply meteorological alerts in standard response
    };

  } catch (error) {
    console.error('Failed to fetch Windy data:', error);
    throw error;
  }
};
