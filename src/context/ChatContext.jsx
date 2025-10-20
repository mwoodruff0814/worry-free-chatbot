// FILE: src/context/ChatContext.jsx
// PURPOSE: Global state management for chat - FIXED VERSION

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { STAGES } from '../constants/stages';
import { CONFIG } from '../constants/config';
import { SARAH_PERSONALITY } from '../constants/messages';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    stage: STAGES.GREETING,
    serviceType: null,
    data: {
      pestDisclaimerAgreed: false,
      pestDisclaimerTimestamp: null,
      shopEquipment: [],
      oversizedFurniture: [],
      tvHandling: [],
      homeSize: null,
      accessObstacles: [],
      heavyItemFees: 0,
      accessMultiplier: 1.0,
      photos: [],
      hasPhotos: false,
      photoCategory: null,
      appliances: [],
      thirdLocationAppliances: []
    },
    messages: [],
    messageCount: 0,
    isOpen: false,
    hasBeenOpened: false,
    conversationStarted: false,
    quoteSubmitted: false,
    isAutoSubmit: false,
    navigationHistory: [],
    currentHistoryIndex: -1
  });

  // Track if conversation has been initialized
  const conversationInitialized = useRef(false);

  // Show typing indicator
  const showTypingIndicator = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { 
        content: '<div class="typing-indicator"><span></span><span></span><span></span></div>', 
        type: 'typing', 
        timestamp: Date.now(),
        id: `typing-${Date.now()}`
      }]
    }));
  }, []);

  // Hide typing indicator
  const hideTypingIndicator = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.type !== 'typing')
    }));
  }, []);

  // Add a bot message with typing indicator
  const addBotMessage = useCallback((content, delay = 0) => {
    if (delay > 0) {
      showTypingIndicator();
    }

    setTimeout(() => {
      hideTypingIndicator();
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages.filter(msg => msg.type !== 'typing'), { 
          content, 
          type: 'bot', 
          timestamp: Date.now(),
          id: `bot-${Date.now()}`
        }],
        messageCount: prev.messageCount + 1
      }));
    }, delay);
  }, [showTypingIndicator, hideTypingIndicator]);

  // Add a user message
   const addUserMessage = useCallback((content) => {
    const messageId = `user-${Date.now()}-${Math.random()}`; // More unique ID
    console.log('Adding user message with ID:', messageId, 'Content:', content);
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { 
        content, 
        type: 'user', 
        timestamp: Date.now(),
        id: messageId
      }],
      messageCount: prev.messageCount + 1
    }));
  }, []);

  // FILE: src/context/ChatContext.jsx (Update only the sendMessage function)

// Send message (handles user input)
const sendMessage = useCallback((message) => {
  if (!message || !message.trim()) return;

  // Add user message
  addUserMessage(message);

  // Dispatch event for FlowController to process
  window.dispatchEvent(new CustomEvent('process-user-input', {
    detail: { 
      message: message,
      stage: chatState.stage 
    }
  }));
  
  console.log('ChatContext: Message sent:', message, 'Current stage:', chatState.stage);
}, [addUserMessage, chatState.stage]);

  // Update chat data
  const updateChatData = useCallback((updates) => {
    setChatState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates }
    }));
  }, []);

  // Update stage
  const updateStage = useCallback((newStage) => {
    console.log('🔄 Stage updated:', newStage);
    setChatState(prev => {
      // Save current state to navigation history before changing stage
      const state = {
        stage: prev.stage,
        serviceType: prev.serviceType,
        data: JSON.parse(JSON.stringify(prev.data)),
        messageCount: prev.messageCount
      };

      let newHistory = [...prev.navigationHistory];
      if (prev.currentHistoryIndex < newHistory.length - 1) {
        newHistory = newHistory.slice(0, prev.currentHistoryIndex + 1);
      }
      newHistory.push(state);

      return {
        ...prev,
        stage: newStage,
        navigationHistory: newHistory,
        currentHistoryIndex: newHistory.length - 1
      };
    });
  }, []);

  // Save navigation state
  const saveNavigationState = useCallback(() => {
    setChatState(prev => {
      const state = {
        stage: prev.stage,
        serviceType: prev.serviceType,
        data: JSON.parse(JSON.stringify(prev.data)),
        messageCount: prev.messageCount
      };

      let newHistory = [...prev.navigationHistory];
      if (prev.currentHistoryIndex < newHistory.length - 1) {
        newHistory = newHistory.slice(0, prev.currentHistoryIndex + 1);
      }
      newHistory.push(state);

      return {
        ...prev,
        navigationHistory: newHistory,
        currentHistoryIndex: newHistory.length - 1
      };
    });
  }, []);

  // Go back in navigation
  const goBack = useCallback(() => {
    setChatState(prev => {
      if (prev.currentHistoryIndex <= 0) return prev;

      const previousState = prev.navigationHistory[prev.currentHistoryIndex - 1];
      const messagesToRemove = prev.messageCount - previousState.messageCount;
      const newMessages = prev.messages.slice(0, -messagesToRemove);

      return {
        ...prev,
        stage: previousState.stage,
        serviceType: previousState.serviceType,
        data: JSON.parse(JSON.stringify(previousState.data)),
        messages: newMessages,
        messageCount: previousState.messageCount,
        currentHistoryIndex: prev.currentHistoryIndex - 1
      };
    });
  }, []);

  // Can go back?
  const canGoBack = useCallback(() => {
    const restrictedStages = [STAGES.SHOW_BOOKING_OPTIONS, STAGES.GET_EMAIL, STAGES.GET_PHONE];
    return chatState.currentHistoryIndex > 0 && !restrictedStages.includes(chatState.stage);
  }, [chatState.currentHistoryIndex, chatState.stage]);

  // Open chat
  const openChat = useCallback(() => {
    console.log('📂 Opening chat...');
    setChatState(prev => ({
      ...prev,
      isOpen: true,
      hasBeenOpened: true
    }));
  }, []);

  // Close chat
  const closeChat = useCallback(() => {
    console.log('📕 Closing chat...');
    setChatState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Start conversation (reset everything)
  const startConversation = useCallback(() => {
    console.log('🆕 Starting new conversation...');
    conversationInitialized.current = false;

    setChatState({
      stage: STAGES.GREETING,
      serviceType: null,
      data: {
        pestDisclaimerAgreed: false,
        pestDisclaimerTimestamp: null,
        shopEquipment: [],
        oversizedFurniture: [],
        tvHandling: [],
        homeSize: null,
        accessObstacles: [],
        heavyItemFees: 0,
        accessMultiplier: 1.0,
        photos: [],
        hasPhotos: false,
        photoCategory: null,
        appliances: [],
        thirdLocationAppliances: []
      },
      messages: [],
      messageCount: 0,
      isOpen: true,
      hasBeenOpened: true,
      conversationStarted: false,  // Changed from true to false to trigger initialization
      quoteSubmitted: false,
      isAutoSubmit: false,
      navigationHistory: [],
      currentHistoryIndex: -1
    });
  }, []);

  // Initialize conversation when chat opens
  const initializeConversation = useCallback(() => {
    if (conversationInitialized.current) return;
    
    console.log('🎬 Initializing conversation...');
    conversationInitialized.current = true;

    // Get random greeting
    const greeting = SARAH_PERSONALITY.greetings[
      Math.floor(Math.random() * SARAH_PERSONALITY.greetings.length)
    ];

    // Add greeting message
    addBotMessage(greeting, 300);

    // Add follow-up message and change stage
    setTimeout(() => {
      addBotMessage(
        "I can help you get an instant estimate and schedule your move today! Before we start, what's your full name? 😊",
        800
      );

      // Change stage to show input
      setTimeout(() => {
        console.log('✅ Setting stage to GET_NAME_INITIAL');
        updateStage(STAGES.GET_NAME_INITIAL);
      }, 1000);
    }, 500);
  }, [addBotMessage, updateStage]);

  // Listen for chat open event
  useEffect(() => {
    const handleOpenChat = () => {
      console.log('🎯 Chat open event received');
      openChat();

      // Initialize conversation if it's the first time
      if (!chatState.conversationStarted) {
        setTimeout(() => {
          initializeConversation();
        }, 100);
      }
    };

    window.addEventListener('open-wfm-chat', handleOpenChat);
    return () => window.removeEventListener('open-wfm-chat', handleOpenChat);
  }, [openChat, chatState.conversationStarted, initializeConversation]);

  // Initialize conversation when chat opens for the first time
  useEffect(() => {
    if (chatState.isOpen && !chatState.conversationStarted && !conversationInitialized.current) {
      console.log('🚀 First time opening, initializing...');
      setChatState(prev => ({ ...prev, conversationStarted: true }));
      initializeConversation();
    }
  }, [chatState.isOpen, chatState.conversationStarted, initializeConversation]);

  // Save session to localStorage
  useEffect(() => {
    try {
      const sessionData = {
        ...chatState,
        timestamp: Date.now()
      };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }, [chatState]);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const sessionData = JSON.parse(saved);
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (Date.now() - sessionData.timestamp < dayInMs) {
          console.log('📦 Restoring saved session');
          setChatState(prev => ({
            ...prev,
            ...sessionData,
            isOpen: false, // Always start closed
            conversationStarted: sessionData.conversationStarted || false
          }));
          
          if (sessionData.conversationStarted) {
            conversationInitialized.current = true;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
  }, []);

  // Debug: Log stage changes
  useEffect(() => {
    console.log('📍 Current stage:', chatState.stage);
    console.log('💬 Conversation started:', chatState.conversationStarted);
    console.log('📨 Message count:', chatState.messageCount);
  }, [chatState.stage, chatState.conversationStarted, chatState.messageCount]);

  const value = {
    chatState,
    setChatState,
    addBotMessage,
    addUserMessage,
    sendMessage, // ⭐ Added
    updateChatData,
    updateStage,
    saveNavigationState,
    goBack,
    canGoBack,
    openChat,
    closeChat,
    startConversation,
    showTypingIndicator, // ⭐ Added
    hideTypingIndicator  // ⭐ Added
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};