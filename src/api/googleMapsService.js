// FILE: src/api/googleMapsService.js
// PURPOSE: Google Maps API integration service

import { CONFIG } from '../constants/config';

class GoogleMapsService {
  constructor() {
    this.directionsService = null;
    this.geocoder = null;
    this.autocompleteService = null;
    this.sessionToken = null;
    this.isLoaded = false;
  }

  // Wait for Google Maps to load (it's loaded from index.html now)
  loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      console.log('🗺️ GoogleMapsService: Checking for Google Maps...');

      // Check if already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('✅ Google Maps already available');
        this.initializeServices();
        resolve();
        return;
      }

      // Wait for it to load from index.html
      console.log('⏳ GoogleMapsService: Waiting for Google Maps to load from HTML...');
      let attempts = 0;
      const maxAttempts = 50; // 10 seconds max

      const checkInterval = setInterval(() => {
        attempts++;

        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('✅ Google Maps loaded successfully!');
          clearInterval(checkInterval);
          this.initializeServices();
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error('❌ Google Maps loading timeout');
          clearInterval(checkInterval);
          reject(new Error('Google Maps loading timeout'));
        }
      }, 200);
    });
  }

  // Initialize Google Maps services
  initializeServices() {
    try {
      console.log('🔧 Initializing Google Maps services...');
      this.directionsService = new window.google.maps.DirectionsService();
      this.geocoder = new window.google.maps.Geocoder();
      this.autocompleteService = new window.google.maps.places.AutocompleteService();
      this.sessionToken = new window.google.maps.places.AutocompleteSessionToken();
      this.isLoaded = true;
      console.log('✅ Google Maps services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google services:', error);
      throw error;
    }
  }

  // Get autocomplete predictions
  getAutocompletePredictions(input) {
    return new Promise((resolve, reject) => {
      console.log('🔍 getAutocompletePredictions:', input);

      if (!this.autocompleteService) {
        console.error('❌ Autocomplete service not initialized!');
        reject(new Error('Autocomplete service not initialized'));
        return;
      }

      if (!input || input.length < 3) {
        resolve([]);
        return;
      }

      const request = {
        input: input,
        sessionToken: this.sessionToken,
        componentRestrictions: { country: 'us' }
      };

      this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
        console.log('📥 Autocomplete - Status:', status, 'Count:', predictions?.length || 0);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const results = predictions.map(p => ({ description: p.description, placeId: p.place_id }));
          resolve(results);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.warn('⚠️ Autocomplete error:', status);
          resolve([]);
        }
      });
    });
  }

  // Calculate distance between two addresses
  calculateDistance(origin, destination) {
    return new Promise((resolve, reject) => {
      console.log('📍 Calculating distance:', origin, '→', destination);

      if (!this.directionsService) {
        reject(new Error('Directions service not initialized'));
        return;
      }

      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false
      };

      this.directionsService.route(request, (response, status) => {
        if (status === 'OK' && response.routes && response.routes[0]) {
          const route = response.routes[0];
          let distance = 0;
          let duration = 0;

          for (let i = 0; i < route.legs.length; i++) {
            distance += route.legs[i].distance.value;
            duration += route.legs[i].duration.value;
          }

          const miles = (distance / 1609.34).toFixed(1);
          const hours = (duration / 3600).toFixed(2);

          console.log('✅ Distance:', miles, 'miles,', hours, 'hours');
          resolve({ distance: parseFloat(miles), duration: parseFloat(hours) });
        } else {
          console.error('❌ Distance error:', status);
          reject(new Error('Unable to calculate distance: ' + status));
        }
      });
    });
  }

  // Geocode an address
  geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject(new Error('Geocoder service not initialized'));
        return;
      }

      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formattedAddress: results[0].formatted_address
          });
        } else {
          reject(new Error('Geocoding failed: ' + status));
        }
      });
    });
  }

  // Reset session token
  resetSessionToken() {
    if (window.google && window.google.maps && window.google.maps.places) {
      this.sessionToken = new window.google.maps.places.AutocompleteSessionToken();
      console.log('🔄 Session token reset');
    }
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();
