const fs = require('fs');
const path = require('path');

console.log('Fixing close button className...\\n');

const filePath = path.join(__dirname, 'src/components/Modals/chat/ChatHeader.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// Fix the className
content = content.replace('className="chat-close-button"', 'className="chat-close-btn"');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed close button className!');
console.log('   - Changed: chat-close-button → chat-close-btn');
console.log('\\n📁 Updated: src/components/Modals/chat/ChatHeader.jsx');
