// FILE: src/components/UI/AutocompleteInput.jsx
// PURPOSE: Input with Google Maps autocomplete

import React, { useState, useCallback, useEffect, useRef } from 'react';

const AutocompleteInput = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder, 
  getSuggestions 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced suggestion fetch
  useEffect(() => {
    if (value.length > 3) {
      const timer = setTimeout(async () => {
        try {
          const results = await getSuggestions(value);
          setSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Autocomplete error:', error);
          setSuggestions([]);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, getSuggestions]);

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

  const handleSuggestionClick = useCallback((suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setTimeout(() => onSelect(), 100);
  }, [onChange, onSelect]);

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;