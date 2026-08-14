import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_LOCATION } from '../utils/constants';
import { reverseGeocode } from '../services/geocodingService';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('ws_current_location');
    return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    localStorage.setItem('ws_current_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  const setLocation = (locationObj, isSearch = true) => {
    if (!locationObj || !locationObj.latitude || !locationObj.longitude) return;
    setCurrentLocation({
      name: locationObj.name || 'Selected Location',
      country: locationObj.country || '',
      countryCode: locationObj.countryCode || '',
      latitude: Number(locationObj.latitude),
      longitude: Number(locationObj.longitude),
      admin1: locationObj.admin1 || ''
    });
    setGeoError(null);
    if (isSearch) {
      setHasSearched(true);
    }
  };

  const clearSearch = () => setHasSearched(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          setLocation(loc);
        } catch (err) {
          setLocation({
            name: 'Current Location',
            country: '',
            latitude,
            longitude
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsDetecting(false);
        let errorMsg = 'Could not access device location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user.';
        }
        setGeoError(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        detectLocation,
        isDetecting,
        geoError,
        hasSearched,
        clearSearch
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
