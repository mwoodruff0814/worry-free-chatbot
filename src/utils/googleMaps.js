// FILE: src/utils/googleMaps.js
// PURPOSE: Google Maps utility functions - UPDATED to use googleMapsService

import { googleMapsService } from '../api/googleMapsService';

// Load Google Maps (wrapper for service)
export const loadGoogleMaps = async () => {
  return googleMapsService.loadGoogleMaps();
};

// Initialize Google Services (wrapper for service)
export const initializeGoogleServices = () => {
  // Service is already initialized by loadGoogleMaps
  return googleMapsService;
};

// Calculate distance between two addresses
export const calculateDistance = async (origin, destination) => {
  try {
    const result = await googleMapsService.calculateDistance(origin, destination);
    console.log('✅ Distance calculated:', result);
    return result;
  } catch (error) {
    console.error('❌ Distance calculation failed:', error);
    throw error;
  }
};

// Get autocomplete predictions
export const getAutocompletePredictions = async (input) => {
  try {
    const predictions = await googleMapsService.getAutocompletePredictions(input);
    return predictions;
  } catch (error) {
    console.error('❌ Autocomplete failed:', error);
    return [];
  }
};

// Geocode an address
export const geocodeAddress = async (address) => {
  try {
    const result = await googleMapsService.geocodeAddress(address);
    return result;
  } catch (error) {
    console.error('❌ Geocoding failed:', error);
    throw error;
  }
};
