// FILE: src/components/ChatButton.jsx
// PURPOSE: Floating chat button to open the chat widget

import React, { useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';

const ChatButton = () => {
  const { chatState, openChat } = useChatContext();

  // Auto-open chat if in a popup window (from Squarespace)
  useEffect(() => {
    const isPopup = window.opener !== null || window.innerWidth < 500;
    const hasAutoOpened = sessionStorage.getItem('wfm-chat-auto-opened');

    if (isPopup && !chatState.isOpen && !hasAutoOpened) {
      console.log('🪟 Popup detected - auto-opening chat');
      sessionStorage.setItem('wfm-chat-auto-opened', 'true');
      setTimeout(() => {
        openChat();
      }, 100);
    }
  }, [chatState.isOpen, openChat]);

  // Don't show button if chat is already open
  if (chatState.isOpen) {
    return null;
  }

  // Don't show button if opened in a popup window (from Squarespace)
  const isPopup = window.opener !== null || window.innerWidth < 500;
  if (isPopup) {
    return null;
  }

  return (
    <button
      className="wfm-chat-button"
      onClick={openChat}
      aria-label="Get your free moving estimate"
      title="Get instant moving estimate with Sarah - No obligations!"
    >
      <div className="chat-button-content">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
            fill="white"
          />
          <circle cx="8" cy="11" r="1.5" fill="#333" />
          <circle cx="12" cy="11" r="1.5" fill="#333" />
          <circle cx="16" cy="11" r="1.5" fill="#333" />
        </svg>
        <span className="chat-button-text">Get Free Estimate</span>
      </div>
      <div className="chat-button-pulse"></div>
    </button>
  );
};

export default ChatButton;
