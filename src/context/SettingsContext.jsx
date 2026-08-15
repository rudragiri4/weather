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

  const [precipUnit, setPrecipUnit] = useState(() => {
    return localStorage.getItem('ws_unit_precip') || 'mm'; // 'mm', 'in'
  });

  const [weatherAlerts, setWeatherAlerts] = useState(() => {
    const saved = localStorage.getItem('ws_weather_alerts');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [severeAlerts, setSevereAlerts] = useState(() => {
    const saved = localStorage.getItem('ws_severe_alerts');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [defaultMapLayer, setDefaultMapLayer] = useState(() => {
    return localStorage.getItem('ws_default_layer') || 'wind';
  });

  const [mapAnimations, setMapAnimations] = useState(() => {
    const saved = localStorage.getItem('ws_map_animations');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Internal API state (preserved for background service stability)
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
    if (newSettings.theme) {
      setTheme(newSettings.theme);
      localStorage.setItem('ws_theme', newSettings.theme);
    }
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
    if (newSettings.precipUnit) {
      setPrecipUnit(newSettings.precipUnit);
      localStorage.setItem('ws_unit_precip', newSettings.precipUnit);
    }
    if (newSettings.weatherAlerts !== undefined) {
      setWeatherAlerts(newSettings.weatherAlerts);
      localStorage.setItem('ws_weather_alerts', JSON.stringify(newSettings.weatherAlerts));
    }
    if (newSettings.severeAlerts !== undefined) {
      setSevereAlerts(newSettings.severeAlerts);
      localStorage.setItem('ws_severe_alerts', JSON.stringify(newSettings.severeAlerts));
    }
    if (newSettings.defaultMapLayer) {
      setDefaultMapLayer(newSettings.defaultMapLayer);
      localStorage.setItem('ws_default_layer', newSettings.defaultMapLayer);
    }
    if (newSettings.mapAnimations !== undefined) {
      setMapAnimations(newSettings.mapAnimations);
      localStorage.setItem('ws_map_animations', JSON.stringify(newSettings.mapAnimations));
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
        setTheme,
        toggleTheme,
        tempUnit,
        setTempUnit,
        toggleTempUnit,
        windUnit,
        setWindUnit,
        pressureUnit,
        setPressureUnit,
        precipUnit,
        setPrecipUnit,
        weatherAlerts,
        setWeatherAlerts,
        severeAlerts,
        setSevereAlerts,
        defaultMapLayer,
        setDefaultMapLayer,
        mapAnimations,
        setMapAnimations,
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
