const fs = require('fs');
const path = require('path');

console.log('Fixing close button CSS...\\n');

const filePath = path.join(__dirname, 'src/styles/chat.css');

let content = fs.readFileSync(filePath, 'utf8');

// Add pointer-events, z-index, and position properties to ensure clickability
const oldCSS = `.chat-close-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
}`;

const newCSS = `.chat-close-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
  pointer-events: auto;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}`;

content = content.replace(oldCSS, newCSS);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed close button CSS!');
console.log('   - Added pointer-events: auto');
console.log('   - Added z-index: 10');
console.log('   - Added flex-shrink: 0');
console.log('   - Added display: flex for better centering');
console.log('\\n📁 Updated: src/styles/chat.css');
