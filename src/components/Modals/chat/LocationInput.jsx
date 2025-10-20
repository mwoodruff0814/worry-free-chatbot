// FILE: src/components/Modals/chat/LocationInput.jsx
// PURPOSE: Location input with Google Maps autocomplete

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { googleMapsService } from '../../../api/googleMapsService';

const LocationInput = ({ onSelect, placeholder = "Start typing an address..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Fetch suggestions from Google Maps
  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const predictions = await googleMapsService.getAutocompletePredictions(input);
      setSuggestions(predictions);
      setShowSuggestions(predictions.length > 0);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    console.log('🎯 Suggestion clicked:', suggestion.description);
    setInputValue(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    googleMapsService.resetSessionToken();
    if (onSelect) {
      console.log('📤 Calling onSelect with:', suggestion.description);
      onSelect(suggestion.description);
    } else {
      console.warn('⚠️ onSelect is not defined!');
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      console.log('⌨️ Enter pressed. Input value:', inputValue.trim());
      console.log('📋 Suggestions available:', suggestions.length);

      // If there are suggestions, use the first one, otherwise use the input value
      if (suggestions.length > 0) {
        console.log('Using first suggestion:', suggestions[0].description);
        handleSuggestionClick(suggestions[0]);
      } else if (onSelect) {
        console.log('📤 No suggestions, calling onSelect with raw input:', inputValue.trim());
        onSelect(inputValue.trim());
      } else {
        console.warn('⚠️ onSelect is not defined!');
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          width: '100%',
          padding: '14px 16px',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          outline: 'none',
          fontSize: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#333';
          e.target.style.boxShadow = '0 0 0 4px rgba(50,50,50,0.1)';
          e.target.style.transform = 'scale(1.01)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
          e.target.style.transform = 'scale(1)';
        }}
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '12px',
          color: '#666'
        }}>
          Loading...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.12)',
            maxHeight: '240px',
            overflowY: 'auto',
            zIndex: 10000
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.placeId || index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                fontSize: '15px',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f4f8' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8fafb'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              📍 {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
