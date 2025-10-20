// FILE: src/components/Chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../../context/ChatContext';

const ChatInput = () => {
  const { chatState, sendMessage } = useChatContext();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Only show input for stages that need text input
  const needsInput = [
    'get_name_initial',
    'location_from',
    'location_to',
    'location_third',
    'hours',
    'describe_item',
    'get_email',
    'get_phone',
    'fvp_value',
    'collect_full_name',
    'collect_email_required',
    'collect_phone_required',
    'equipment_weight_input',
    'furniture_weight_input',
    'damage_description',
    'item_value_input',
    'item_value_assessment',
    'invoice_number_input',
    'damage_cause',
    'custom_item_weight'
  ].includes(chatState.stage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-focus input when it becomes visible
  useEffect(() => {
    if (needsInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [needsInput]);

  if (!needsInput) {
    return null;
  }

  const getPlaceholder = () => {
    const placeholders = {
      'get_name_initial': "Enter your full name (first and last)...",
      'collect_full_name': "Enter your first and last name...",
      'location_from': "Start typing your address...",
      'location_to': "Start typing destination address...",
      'location_third': "Start typing third location address...",
      'hours': "Enter number of hours...",
      'describe_item': "e.g., Large wardrobe, Gun safe...",
      'get_email': "Enter your email...",
      'collect_email_required': "Enter your email...",
      'get_phone': "Enter your phone number...",
      'collect_phone_required': "Enter your phone number...",
      'fvp_value': "Enter total value...",
      'equipment_weight_input': "Enter weight in pounds...",
      'furniture_weight_input': "Enter weight in pounds...",
      'damage_description': "Describe the damage in detail...",
      'item_value_assessment': "Enter item value in dollars...",
      'item_value_input': "Enter item value in dollars...",
      'invoice_number_input': "Enter invoice number...",
      'damage_cause': "Describe what happened...",
      'custom_item_weight': "Enter approximate weight..."
    };
    return placeholders[chatState.stage] || "Type your answer...";
  };

  return (
    <div id="wfm-chat-input-area" style={{
      padding: '8px 10px',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      gap: '10px'
    }}>
      <input
        ref={inputRef}
        type="text"
        id="wfm-chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={getPlaceholder()}
        style={{
          flexGrow: 1,
          padding: '12px 15px',
          border: '2px solid #e2e8f0',
          borderRadius: '25px',
          outline: 'none',
          fontSize: '16px',
          transition: 'all 0.3s'
        }}
        autoComplete="off"
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #004085 0%, #0056b3 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s',
          boxShadow: '0 2px 8px rgba(0,64,133,0.3)'
        }}
        disabled={!inputValue.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;