// FILE: src/index.js
// PURPOSE: React app entry point

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ⭐ Expose chat opener function globally
window.openWFMChat = function() {
  console.log('🚀 Opening Worry Free Moving Chat...');
  const event = new CustomEvent('open-wfm-chat');
  window.dispatchEvent(event);
};

console.log('✅ Worry Free Moving Chat Ready! Call window.openWFMChat() to open.');