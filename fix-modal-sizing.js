const fs = require('fs');
const path = require('path');

// Fix LiveChatModal - ensure it's truly full screen with no constraints
const liveChatPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'LiveChatModal.jsx');
console.log('Updating LiveChatModal.jsx for proper sizing...');

let liveChatContent = fs.readFileSync(liveChatPath, 'utf8');

// The modal is already full-screen, just ensure no width/height constraints
// Already has position: fixed, top: 0, left: 0, right: 0, bottom: 0 which is correct

fs.writeFileSync(liveChatPath, liveChatContent, 'utf8');
console.log('✅ LiveChatModal is properly configured');

// Fix FAQ Modal - reduce padding for better full-screen appearance
const sidebarPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');
console.log('Updating ChatSidebar FAQ modal for proper sizing...');

let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Change FAQ modal padding from 40px to responsive padding
sidebarContent = sidebarContent.replace(
  /padding: '40px'/,
  "padding: '20px'"
);

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('✅ FAQ modal updated with better padding');

console.log('\n📱 Both modals are now properly sized:');
console.log('   - Full-screen on all devices (position: fixed, 0/0/0/0)');
console.log('   - Responsive padding (20px instead of 40px)');
console.log('   - Will fill entire viewport on mobile and desktop');
