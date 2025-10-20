const fs = require('fs');
const path = require('path');

console.log('Increasing chat window size for better visibility...\n');

const filePath = path.join(__dirname, 'src/styles/chat.css');
let content = fs.readFileSync(filePath, 'utf8');

// Increase chat widget height from 612px to 700px for better visibility
content = content.replace(
  'height: 612px; /* 10% shorter */',
  'height: 700px; /* Increased for better visibility */'
);

// Also ensure the messages container can scroll properly
const oldMessagesStyle = `.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background: #f0f4f8;
  min-height: 0; /* Ensure flexbox works correctly */
}`;

const newMessagesStyle = `.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background: #f0f4f8;
  min-height: 0; /* Ensure flexbox works correctly */
  max-height: calc(100% - 160px); /* Leave room for header and navigation */
}`;

content = content.replace(oldMessagesStyle, newMessagesStyle);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Chat window enlarged!');
console.log('   - Height: 612px → 700px (14% larger)');
console.log('   - Added max-height to messages area for proper scrolling');
console.log('   - All options should be visible now');
console.log('\n📁 Updated: src/styles/chat.css');
