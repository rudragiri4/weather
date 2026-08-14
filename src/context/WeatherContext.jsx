import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from './LocationContext';
import { useSettings } from './SettingsContext';
import { fetchWeatherData } from '../services/openMeteoService';
import { fetchOpenWeatherData } from '../services/openWeatherService';
import { fetchWindyData } from '../services/windyService';
import { POPULAR_CITIES } from '../utils/constants';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { currentLocation } = useLocation();
  const { weatherProvider, apiKey, windyKey, windyModel } = useSettings();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('ws_favorites');
    return saved ? JSON.parse(saved) : [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('ws_recents');
    return saved ? JSON.parse(saved) : [POPULAR_CITIES[0], POPULAR_CITIES[3]];
  });

  const loadWeather = useCallback(async () => {
    if (!currentLocation || !currentLocation.latitude) return;
    setLoading(true);
    setError(null);
    try {
      let data;
      if (weatherProvider === 'openweather' && apiKey) {
        data = await fetchOpenWeatherData(currentLocation.latitude, currentLocation.longitude, apiKey);
      } else if (weatherProvider === 'windy' && windyKey) {
        data = await fetchWindyData(currentLocation.latitude, currentLocation.longitude, windyKey, windyModel);
      } else {
        data = await fetchWeatherData(currentLocation.latitude, currentLocation.longitude);
      }
      
      data.provider = weatherProvider || 'open-meteo';
      setWeatherData(data);
    } catch (err) {
      console.error('Weather load error:', err);
      
      if (weatherProvider !== 'open-meteo') {
        console.warn('Attempting fallback to Open-Meteo due to provider fetch error...');
        try {
          const data = await fetchWeatherData(currentLocation.latitude, currentLocation.longitude);
          data.provider = 'open-meteo';
          data.fallbackNotice = `Failed to fetch from ${weatherProvider === 'openweather' ? 'OpenWeather' : 'Windy'}. Displaying free Open-Meteo forecast.`;
          setWeatherData(data);
          return;
        } catch (fallbackErr) {
          console.error('Fallback fetch failed:', fallbackErr);
        }
      }
      
      setError('Unable to fetch live weather data. Please check your network connection or API keys.');
    } finally {
      setLoading(false);
    }
  }, [currentLocation, weatherProvider, apiKey, windyKey, windyModel]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // Sync recent search
  useEffect(() => {
    if (currentLocation && currentLocation.name) {
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.name.toLowerCase() !== currentLocation.name.toLowerCase());
        const updated = [currentLocation, ...filtered].slice(0, 6);
        localStorage.setItem('ws_recents', JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentLocation]);

  const toggleFavorite = (locationObj) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.name.toLowerCase() === locationObj.name.toLowerCase());
      let updated;
      if (exists) {
        updated = prev.filter(item => item.name.toLowerCase() !== locationObj.name.toLowerCase());
      } else {
        updated = [...prev, locationObj];
      }
      localStorage.setItem('ws_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (cityName) => {
    if (!cityName) return false;
    return favorites.some(item => item.name.toLowerCase() === cityName.toLowerCase());
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        refreshWeather: loadWeather,
        favorites,
        toggleFavorite,
        isFavorite,
        recentSearches
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
