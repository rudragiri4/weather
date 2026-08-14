import axios from 'axios';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const searchLocations = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        name: query,
        count: 8,
        language: 'en',
        format: 'json'
      }
    });

    if (!response.data || !response.data.results) {
      return [];
    }

    return response.data.results.map(item => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      displayLabel: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`
    }));
  } catch (error) {
    console.error('Geocoding search error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
      params: {
        latitude: lat,
        longitude: lon,
        localityLanguage: 'en'
      }
    });

    const data = response.data;
    if (data && (data.city || data.locality)) {
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Detected Location',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        latitude: lat,
        longitude: lon
      };
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  return {
    name: 'Your Location',
    country: '',
    latitude: lat,
    longitude: lon
  };
};
