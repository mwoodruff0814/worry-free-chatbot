// FILE: src/components/Chat/ChatMessages.jsx
// PURPOSE: Message display area with auto-scroll

import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../../../context/ChatContext';
import MessageBubble from '../../UI/MessageBubble';
import TypingIndicator from '../../UI/TypingIndicator';

const ChatMessages = () => {
  const { chatState } = useChatContext();
  const messagesEndRef = useRef(null);
  const [showTyping, setShowTyping] = React.useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, showTyping]);

  // Show typing indicator briefly before new bot messages
  useEffect(() => {
    const lastMessage = chatState.messages[chatState.messages.length - 1];
    if (lastMessage?.type === 'bot') {
      setShowTyping(true);
      setTimeout(() => setShowTyping(false), 800);
    }
  }, [chatState.messages]);

  return (
    <div id="wfm-chat-messages" className="chat-messages">
      {chatState.messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message.content}
          type={message.type}
        />
      ))}
      {showTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;