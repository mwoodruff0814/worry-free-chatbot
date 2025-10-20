// FILE: src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/ChatWidget';

// Your Google Maps API key from CONFIG
const GOOGLE_MAPS_API_KEY = 'AIzaSyAWGIVnh7-2sgDJin_2qgNvwh4JD9UgJDo';

function App() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);
  const [loadingAttempts, setLoadingAttempts] = useState(0);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps already loaded');
      setMapsLoaded(true);
      return;
    }

    // Function to load Google Maps
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        // Check again if it loaded while we were waiting
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve();
          return;
        }

        // Remove any existing Google Maps script tags
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Create callback function name
        const callbackName = `initGoogleMaps_${Date.now()}`;
        
        // Set up the callback
        window[callbackName] = () => {
          console.log('Google Maps loaded successfully via callback');
          delete window[callbackName];
          
          // Verify all services are available
          if (window.google && window.google.maps && window.google.maps.places) {
            resolve();
          } else {
            reject(new Error('Google Maps loaded but services are incomplete'));
          }
        };

        // Create and append script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
          delete window[callbackName];
          reject(new Error('Failed to load Google Maps script'));
        };
        
        document.head.appendChild(script);

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!window.google || !window.google.maps) {
            delete window[callbackName];
            reject(new Error('Google Maps loading timeout'));
          }
        }, 10000);
      });
    };

    // Attempt to load Google Maps
    loadGoogleMaps()
      .then(() => {
        console.log('✅ Google Maps API ready');
        
        // Store services globally for easy access
        window.googleMapsServices = {
          directionsService: new window.google.maps.DirectionsService(),
          geocoder: new window.google.maps.Geocoder(),
          autocompleteService: new window.google.maps.places.AutocompleteService(),
          placesService: new window.google.maps.places.PlacesService(
            document.createElement('div')
          )
        };
        
        setMapsLoaded(true);
      })
      .catch((error) => {
        console.error('❌ Failed to load Google Maps:', error);
        setMapsError(error.message);
        
        // Retry up to 3 times
        if (loadingAttempts < 3) {
          console.log(`Retrying Google Maps load... (attempt ${loadingAttempts + 1}/3)`);
          setTimeout(() => {
            setLoadingAttempts(prev => prev + 1);
          }, 2000);
        }
      });
  }, [loadingAttempts]);

  // Show error state but still allow chat to work
  if (mapsError && loadingAttempts >= 3) {
    return (
      <div className="App">
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7',
          padding: '15px',
          margin: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>⚠️ Google Maps couldn't load</h3>
          <p>The chat will work but without address autocomplete and distance calculations.</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Error: {mapsError}</p>
        </div>
        
        <ChatProvider>
          <ChatWidget />
        </ChatProvider>
      </div>
    );
  }

  // Show loading state
  if (!mapsLoaded) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #004085',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Loading Google Maps Services...</p>
          {loadingAttempts > 0 && (
            <p style={{ fontSize: '12px', color: '#666' }}>
              Retry attempt {loadingAttempts}/3
            </p>
          )}
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Main app with chat widget
  return (
    <div className="App">
      <ChatProvider>
        <ChatWidget />
      </ChatProvider>
      
      {/* Hidden div for development info */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        left: '10px', 
        fontSize: '10px', 
        color: '#999',
        background: 'white',
        padding: '5px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Maps: ✅ | API: {GOOGLE_MAPS_API_KEY.substring(0, 10)}...
      </div>
    </div>
  );
}

export default App;