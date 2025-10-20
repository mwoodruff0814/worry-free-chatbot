// FILE: src/hooks/useGoogleMaps.js
// PURPOSE: Google Maps integration hook

import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../constants/config';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState({
    directionsService: null,
    geocoder: null,
    autocompleteService: null,
    sessionToken: null
  });

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps?.places) {
      initializeServices();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      initializeServices();
    };

    script.onerror = () => {
      setError(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeServices = () => {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const geocoder = new window.google.maps.Geocoder();
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      const sessionToken = new window.google.maps.places.AutocompleteSessionToken();

      setServices({
        directionsService,
        geocoder,
        autocompleteService,
        sessionToken
      });

      setIsLoaded(true);
    } catch (err) {
      setError(err);
    }
  };

  // Calculate distance between two addresses
  const calculateDistance = useCallback((origin, destination) => {
    return new Promise((resolve, reject) => {
      if (!services.directionsService) {
        reject(new Error('Directions service not initialized'));
        return;
      }

      services.directionsService.route({
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false
      }, (response, status) => {
        if (status === 'OK' && response.routes?.[0]) {
          const route = response.routes[0];
          let distance = 0;
          let duration = 0;
          let hasTolls = false;

          route.legs.forEach(leg => {
            distance += leg.distance.value;
            duration += leg.duration.value;

            leg.steps?.forEach(step => {
              if (step.instructions?.toLowerCase().includes('toll')) {
                hasTolls = true;
              }
            });
          });

          resolve({
            distance: (distance / 1609.34).toFixed(1),
            duration: (duration / 3600).toFixed(2),
            hasTolls
          });
        } else {
          reject(new Error(`Unable to calculate distance: ${status}`));
        }
      });
    });
  }, [services.directionsService]);

  // Get address suggestions
  const getAddressSuggestions = useCallback((input) => {
    return new Promise((resolve, reject) => {
      if (!services.autocompleteService) {
        reject(new Error('Autocomplete service not initialized'));
        return;
      }

      services.autocompleteService.getPlacePredictions({
        input,
        sessionToken: services.sessionToken,
        componentRestrictions: { country: 'us' },
        types: ['address']
      }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions);
        } else {
          reject(new Error(`Autocomplete failed: ${status}`));
        }
      });
    });
  }, [services.autocompleteService, services.sessionToken]);

  // Refresh session token
  const refreshSessionToken = useCallback(() => {
    if (window.google?.maps?.places) {
      const newToken = new window.google.maps.places.AutocompleteSessionToken();
      setServices(prev => ({ ...prev, sessionToken: newToken }));
    }
  }, []);

  return {
    isLoaded,
    error,
    calculateDistance,
    getAddressSuggestions,
    refreshSessionToken
  };
};