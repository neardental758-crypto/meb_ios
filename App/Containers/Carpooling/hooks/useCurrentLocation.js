import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

export const useCurrentLocation = (initialRegion) => {
  const [region, setRegion] = useState(initialRegion);
  const [error, setError] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          ...initialRegion,
          latitude,
          longitude,
        });
      },
      (err) => {
        setError(err.message);
        console.log('Geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 3600000
      }
    );
  }, []);

  return { region, error };
};
