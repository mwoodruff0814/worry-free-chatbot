// FILE: src/components/Chat/ChatHeader.jsx
// PURPOSE: Chat header with close button

import React from 'react';

const ChatHeader = ({ onClose, onSaveQuote }) => {
  const handleClose = () => {
    console.log('Close button clicked');

    // Check if we're in a popup window
    const isPopup = window.opener !== null;

    if (isPopup) {
      console.log('Closing popup window');
      // Try to close the window
      window.close();

      // Fallback if window.close() doesn't work
      setTimeout(() => {
        if (!window.closed) {
          console.log('window.close() failed, trying alternative');
          window.open('', '_self').close();
        }
      }, 100);
    } else {
      console.log('Closing widget via onClose');
      // For widget mode, call the onClose callback
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div id="wfm-chat-header" className="chat-header">
      <img
        src="https://res.cloudinary.com/dhiukpg4d/image/upload/w_50/v1743554600/WorryFreeMoving_coverart2_e0ed3i.jpg"
        alt="WFM"
      />
      <span>Sarah - Get Your Moving Estimate & Book</span>
      <button
        onClick={handleClose}
        className="chat-close-btn"
        aria-label="Close chat"
      >
        ✕
      </button>
    </div>
  );
};

export default ChatHeader;
