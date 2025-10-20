// FILE: src/components/Chat/ChatNavigation.jsx
// PURPOSE: Bottom navigation with back button

import React from 'react';
import { useChatContext } from '../../../context/ChatContext';

const ChatNavigation = () => {
  const { canGoBack, goBack } = useChatContext();
  const backEnabled = canGoBack();

  return (
    <div id="wfm-chat-navigation" className="chat-navigation" style={{
      display: 'flex',
      gap: '10px',
      padding: '8px',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      flexShrink: 0
    }}>
      <button
        id="wfm-chat-back"
        className="nav-button"
        onClick={backEnabled ? goBack : undefined}
        disabled={!backEnabled}
        style={{
          width: '100%',
          padding: '12px',
          background: backEnabled ? 'white' : '#f5f5f5',
          border: `2px solid ${backEnabled ? '#333' : '#ccc'}`,
          borderRadius: '25px',
          color: backEnabled ? '#333' : '#999',
          fontWeight: '600',
          fontSize: '14px',
          cursor: backEnabled ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
          opacity: backEnabled ? 1 : 0.6
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default ChatNavigation;
