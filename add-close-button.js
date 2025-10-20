const fs = require('fs');
const path = require('path');

console.log('Adding close button to ChatHeader...\\n');

const filePath = path.join(__dirname, 'src/components/Modals/chat/ChatHeader.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// Replace the component
const oldComponent = `const ChatHeader = ({ onClose, onSaveQuote }) => {
  return (
    <div id="wfm-chat-header" className="chat-header">
      <img
        src="https://res.cloudinary.com/dhiukpg4d/image/upload/w_50/v1743554600/WorryFreeMoving_coverart2_e0ed3i.jpg"
        alt="WFM"
      />
      <span>Sarah - Get Your Moving Estimate & Book</span>
    </div>
  );
};`;

const newComponent = `const ChatHeader = ({ onClose, onSaveQuote }) => {
  const handleClose = () => {
    // If opened in a popup window from Squarespace, close the window
    const isPopup = window.opener !== null;
    if (isPopup) {
      window.close();
    } else {
      // Otherwise just close the chat widget
      onClose();
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
        className="chat-close-button"
        aria-label="Close chat"
        title="Close chat"
      >
        ✕
      </button>
    </div>
  );
};`;

content = content.replace(oldComponent, newComponent);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Added close button to ChatHeader!');
console.log('   - Desktop: Closes chat widget');
console.log('   - Popup: Closes the window');
console.log('\\n📁 Updated: src/components/Modals/chat/ChatHeader.jsx');
