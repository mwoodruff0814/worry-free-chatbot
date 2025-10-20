const fs = require('fs');
const path = require('path');

console.log('Adding auto-open functionality for popup windows...\n');

const filePath = path.join(__dirname, 'src', 'components', 'ChatButton.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useEffect import
content = content.replace(
  "import React from 'react';",
  "import React, { useEffect } from 'react';"
);

// Add auto-open logic
const oldCode = `const ChatButton = () => {
  const { chatState, openChat } = useChatContext();

  // Don't show button if chat is already open
  if (chatState.isOpen) {
    return null;
  }

  // Don't show button if opened in a popup window (from Squarespace)
  // Detect popup by checking if window.opener exists or if window is small
  const isPopup = window.opener !== null || window.innerWidth < 500;
  if (isPopup) {
    return null;
  }`;

const newCode = `const ChatButton = () => {
  const { chatState, openChat } = useChatContext();

  // Auto-open chat if in a popup window (from Squarespace)
  useEffect(() => {
    const isPopup = window.opener !== null || window.innerWidth < 500;
    if (isPopup && !chatState.isOpen) {
      console.log('🪟 Popup detected - auto-opening chat');
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
  }`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated ChatButton.jsx');
console.log('   - Added useEffect import');
console.log('   - Added auto-open logic for popup windows');
console.log('   - Chat will automatically start when opened from Squarespace\n');
console.log('📋 The chatbot will now auto-open in popup windows!');
