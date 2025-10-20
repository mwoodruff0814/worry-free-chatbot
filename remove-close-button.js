const fs = require('fs');
const path = require('path');

console.log('Removing close button from ChatHeader...\\n');

const filePath = path.join(__dirname, 'src/components/Modals/chat/ChatHeader.jsx');

const newContent = `// FILE: src/components/Chat/ChatHeader.jsx
// PURPOSE: Chat header

import React from 'react';

const ChatHeader = ({ onClose, onSaveQuote }) => {
  return (
    <div id="wfm-chat-header" className="chat-header">
      <img
        src="https://res.cloudinary.com/dhiukpg4d/image/upload/w_50/v1743554600/WorryFreeMoving_coverart2_e0ed3i.jpg"
        alt="WFM"
      />
      <span>Sarah - Get Your Moving Estimate & Book</span>
    </div>
  );
};

export default ChatHeader;
`;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ Removed close button!');
console.log('   - Users can close by closing browser window/tab');
console.log('\\n📁 Updated: src/components/Modals/chat/ChatHeader.jsx');
