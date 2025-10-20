// FILE: src/components/chat/ChatOptions.jsx
import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../../context/ChatContext';
import { getOptionsForStage } from '../../../utils/stageOptions';

const ChatOptions = () => {
  const { chatState, addUserMessage } = useChatContext();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    console.log('Stage changed to:', chatState.stage);
    const stageOptions = getOptionsForStage(chatState.stage);
    console.log('Options for stage:', stageOptions);
    setOptions(stageOptions || []);
  }, [chatState.stage]);

  const handleOptionClick = (option) => {
    console.log('Option clicked:', option);
    
    // Add the option text as a user message
    addUserMessage(option.text);
    
    // Fire event for FlowController to process the VALUE
    window.dispatchEvent(new CustomEvent('option-selected', {
      detail: { 
        value: option.value,
        text: option.text,
        stage: chatState.stage
      }
    }));
  };

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div id="wfm-chat-options" className="chat-options">
      {options.map((option, index) => (
        <button
          key={`${chatState.stage}-${index}`}
          className={`chat-option ${option.primary ? 'primary' : ''}`}
          onClick={() => handleOptionClick(option)}
          disabled={option.disabled}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;