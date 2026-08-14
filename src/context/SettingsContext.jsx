import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ws_theme') || 'dark';
  });

  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('ws_unit_temp') || 'C'; // 'C' or 'F'
  });

  const [windUnit, setWindUnit] = useState(() => {
    return localStorage.getItem('ws_unit_wind') || 'kmh'; // 'kmh', 'mph', 'ms', 'knots'
  });

  const [pressureUnit, setPressureUnit] = useState(() => {
    return localStorage.getItem('ws_unit_pressure') || 'hpa'; // 'hpa', 'inhg'
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ws_openweather_key') || '';
  });

  const [weatherProvider, setWeatherProvider] = useState(() => {
    return localStorage.getItem('ws_provider') || 'open-meteo';
  });

  const [windyKey, setWindyKey] = useState(() => {
    return localStorage.getItem('ws_windy_key') || '';
  });

  const [windyModel, setWindyModel] = useState(() => {
    return localStorage.getItem('ws_windy_model') || 'gfs';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ws_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleTempUnit = () => {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    localStorage.setItem('ws_unit_temp', next);
  };

  const saveSettings = (newSettings) => {
    if (newSettings.tempUnit) {
      setTempUnit(newSettings.tempUnit);
      localStorage.setItem('ws_unit_temp', newSettings.tempUnit);
    }
    if (newSettings.windUnit) {
      setWindUnit(newSettings.windUnit);
      localStorage.setItem('ws_unit_wind', newSettings.windUnit);
    }
    if (newSettings.pressureUnit) {
      setPressureUnit(newSettings.pressureUnit);
      localStorage.setItem('ws_unit_pressure', newSettings.pressureUnit);
    }
    if (newSettings.apiKey !== undefined) {
      setApiKey(newSettings.apiKey);
      localStorage.setItem('ws_openweather_key', newSettings.apiKey);
    }
    if (newSettings.weatherProvider !== undefined) {
      setWeatherProvider(newSettings.weatherProvider);
      localStorage.setItem('ws_provider', newSettings.weatherProvider);
    }
    if (newSettings.windyKey !== undefined) {
      setWindyKey(newSettings.windyKey);
      localStorage.setItem('ws_windy_key', newSettings.windyKey);
    }
    if (newSettings.windyModel !== undefined) {
      setWindyModel(newSettings.windyModel);
      localStorage.setItem('ws_windy_model', newSettings.windyModel);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        tempUnit,
        toggleTempUnit,
        windUnit,
        setWindUnit,
        pressureUnit,
        setPressureUnit,
        apiKey,
        weatherProvider,
        windyKey,
        windyModel,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
