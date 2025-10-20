// FILE: src/components/App.jsx
// PURPOSE: Main application component - MODERNIZED VERSION

import React, { useEffect, useState } from 'react';
import { ChatProvider, useChatContext } from '../context/ChatContext';
import ChatContainer from './Modals/chat/ChatContainer';
import ChatButton from './ChatButton';
import { googleMapsService } from '../api/googleMapsService';
import '../styles/global.css';
import '../styles/chat.css';
import '../styles/mobile.css';

// Inner component to access chat context
const AppContent = ({ mapsError }) => {
  const { chatState, startConversation } = useChatContext();

  const handleSaveQuote = () => {
    // Get current estimate data from chatState
    const quoteData = {
      name: chatState.data.name || 'Customer',
      email: chatState.data.email,
      phone: chatState.data.phone,
      serviceType: chatState.data.serviceType,
      from: chatState.data.from,
      to: chatState.data.to,
      movingDate: chatState.data.movingDate,
      crewSize: chatState.data.crewSize,
      hours: chatState.data.hours,
      timestamp: new Date().toISOString()
    };

    // For now, just download as JSON (can integrate with backend API later)
    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WFM-Quote-${quoteData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Quote saved! Check your downloads folder.');
  };

  return (
    <div className="App">
      {mapsError && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', background: '#f5f5f5', border: '1px solid #ccc', padding: '10px 15px', borderRadius: '8px', fontSize: '12px', zIndex: 9999, maxWidth: '300px' }}>
          ⚠️ Maps unavailable - address autocomplete disabled
        </div>
      )}
      <ChatButton />
      <ChatContainer />    </div>
  );
};

function App() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  useEffect(() => {
    // Load Google Maps using the new service
    googleMapsService.loadGoogleMaps()
      .then(() => {
        console.log('✅ Google Maps API ready');
        // Make it globally available for backward compatibility
        window.googleMapsService = googleMapsService;
        setMapsLoaded(true);
      })
      .catch((error) => {
        console.error('❌ Failed to load Google Maps:', error);
        setMapsError(error.message);
        setMapsLoaded(true);
      });
  }, []);

  useEffect(() => {
    window.openWFMChat = () => {
      const event = new CustomEvent('open-wfm-chat');
      window.dispatchEvent(event);
    };
    return () => {
      delete window.openWFMChat;
    };
  }, []);

  if (!mapsLoaded) {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <p>Loading Worry Free Moving Chat...</p>
        </div>
        <style>{'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  return (
    <ChatProvider>
      <AppContent mapsError={mapsError} />
    </ChatProvider>
  );
}

export default App;
