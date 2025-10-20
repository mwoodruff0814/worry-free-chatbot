const fs = require('fs');
const path = require('path');

console.log('Fixing chat sizing for popup windows...\n');

const filePath = path.join(__dirname, 'src', 'styles', 'chat.css');
let content = fs.readFileSync(filePath, 'utf8');

// Add fullscreen mode for small windows (popups)
const searchStr = `.chat-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999998; /* Above chat button */
}`;

const replaceStr = `.chat-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999998; /* Above chat button */
}

/* Fullscreen mode for popup windows */
@media (max-width: 550px) {
  .chat-container {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: none;
    width: 100%;
    height: 100%;
  }

  .chat-widget {
    width: 100%;
    height: 100%;
    border-radius: 0;
    max-width: 100%;
    max-height: 100%;
  }
}`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated chat.css');
  console.log('   - Added fullscreen mode for windows < 550px wide');
  console.log('   - Chat will fill the entire popup window\n');
  console.log('📋 The chatbot will now properly fill popup windows!');
} else {
  console.log('⚠️  Could not find the target CSS block');
  console.log('   The file may have already been updated');
}
