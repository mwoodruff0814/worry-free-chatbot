// FILE: src/components/Chat/ChatContainer.jsx
import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useChatContext } from '../../../context/ChatContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatNavigation from './ChatNavigation';
import ChatSidebar from './ChatSidebar';
import AcuityScheduler from '../AcuityScheduler';
import FlowController from '../../FlowController';
import { SARAH_PERSONALITY } from '../../../constants/messages';
import { saveQuote, getLastEmail } from '../../../utils/quoteStorage';

const ChatContainer = () => {
  const { chatState, openChat, closeChat, startConversation, addBotMessage } = useChatContext();
  const containerRef = useRef(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveEmail, setSaveEmail] = useState('');
  
  // Memoize mobile detection
  const isMobile = useMemo(
    () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    []
  );

  // Memoize the greeting selection
  const getRandomGreeting = useCallback(() => {
    return SARAH_PERSONALITY.greetings[
      Math.floor(Math.random() * SARAH_PERSONALITY.greetings.length)
    ];
  }, []);

  // Handle save quote
  const handleSaveQuote = useCallback(() => {
    const lastEmail = getLastEmail();
    setSaveEmail(lastEmail);
    setShowSaveModal(true);
  }, []);

  const handleConfirmSave = useCallback(() => {
    if (saveEmail && saveEmail.includes('@')) {
      const result = saveQuote(saveEmail, chatState.data);
      if (result.success) {
        alert(`✅ Quote saved! We'll send a copy to ${saveEmail}`);
        setShowSaveModal(false);
      } else {
        alert('❌ Error saving quote. Please try again.');
      }
    } else {
      alert('Please enter a valid email address');
    }
  }, [saveEmail, chatState.data]);

  // Listen for external open event
  useEffect(() => {
    let timeoutId1, timeoutId2;
    
    const handleOpenChat = () => {
      try {
        openChat();
        
        if (!chatState.conversationStarted) {
          timeoutId1 = setTimeout(() => {
            startConversation();
            const greeting = getRandomGreeting();
            addBotMessage(greeting);

            timeoutId2 = setTimeout(() => {
              const namePrompts = [
                "I can help you get an instant quote and book your move right away! First things first - what's your full name?",
                "Let me get you a quick estimate and help schedule your move! To start, can I get your full name? 😊",
                "I'll walk you through getting an estimate and booking your service! Just need your full name to begin."
              ];
              addBotMessage(namePrompts[Math.floor(Math.random() * namePrompts.length)]);
            }, 1200);
          }, 300);
        }
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    };

    window.addEventListener('open-wfm-chat', handleOpenChat);
    
    return () => {
      window.removeEventListener('open-wfm-chat', handleOpenChat);
      if (timeoutId1) clearTimeout(timeoutId1);
      if (timeoutId2) clearTimeout(timeoutId2);
    };
  }, [
    chatState.conversationStarted,
    openChat,
    startConversation,
    addBotMessage,
    getRandomGreeting
  ]);

  // Handle mobile body scroll lock
  useEffect(() => {
    if (chatState.isOpen && isMobile) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [chatState.isOpen, isMobile]);

  if (!chatState.isOpen) {
    return null;
  }

  return (
    <div id="wfm-chat-container" ref={containerRef} className="chat-container">
      <div id="wfm-chat-widget" className="chat-widget">
        <ChatHeader onClose={closeChat} onSaveQuote={handleSaveQuote} />
        <FlowController />
        <ChatSidebar onSaveQuote={handleSaveQuote} onStartOver={startConversation} customerData={chatState.data} />
        <ChatNavigation />
        <AcuityScheduler />
      </div>

      {/* Save Quote Modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#333' }}>💾 Save Your Quote</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>
              Enter your email to save this quote and access it later.
            </p>
            <input
              type="email"
              value={saveEmail}
              onChange={(e) => setSaveEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                marginBottom: '20px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#333'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConfirmSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #2c2c2c 0%, #404040 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Save Quote
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f0f4f8',
                  color: '#333',
                  border: '2px solid #333',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;