const fs = require('fs');
const path = require('path');

console.log('Fixing ChatButton to hide when opened in popup...\n');

const filePath = path.join(__dirname, 'src', 'components', 'ChatButton.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add popup detection logic
const oldCode = `  // Don't show button if chat is already open
  if (chatState.isOpen) {
    return null;
  }

  return (`;

const newCode = `  // Don't show button if chat is already open
  if (chatState.isOpen) {
    return null;
  }

  // Don't show button if opened in a popup window (from Squarespace)
  // Detect popup by checking if window.opener exists or if window is small
  const isPopup = window.opener !== null || window.innerWidth < 500;
  if (isPopup) {
    return null;
  }

  return (`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated ChatButton.jsx');
console.log('   - Added popup detection (window.opener or small width)');
console.log('   - Button will hide when opened from Squarespace\n');
console.log('📋 The chatbot button will no longer appear in popup windows!');
