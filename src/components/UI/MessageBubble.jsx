// FILE: src/components/UI/MessageBubble.jsx
// PURPOSE: Individual message bubble component

import React from 'react';

const MessageBubble = ({ message, type }) => {
  return (
    <div className={`chat-message ${type}-message`} dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default MessageBubble;