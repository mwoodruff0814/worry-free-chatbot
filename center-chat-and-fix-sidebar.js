const fs = require('fs');
const path = require('path');

console.log('Fixing chat positioning and sidebar layout...\n');

// 1. Center the chat widget on screen
const chatCssPath = path.join(__dirname, 'src', 'styles', 'chat.css');
let chatCss = fs.readFileSync(chatCssPath, 'utf8');

chatCss = chatCss.replace(
  `.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999998; /* Above chat button */
}`,
  `.chat-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999998; /* Above chat button */
}`
);

fs.writeFileSync(chatCssPath, chatCss, 'utf8');
console.log('✅ Chat widget now centered on screen');

// 2. Move sidebar to horizontal layout above navigation
const sidebarPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');
let sidebar = fs.readFileSync(sidebarPath, 'utf8');

// Change sidebar positioning to be inside chat, horizontal layout
sidebar = sidebar.replace(
  `  return (
    <div style={{
      position: 'fixed',
      left: '20px',
      top: '55%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 999998
    }}>`,
  `  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      padding: '10px 12px',
      background: '#f8f9fa',
      borderTop: '1px solid #e2e8f0',
      justifyContent: 'center',
      flexShrink: 0
    }}>`
);

// Reduce button sizes for horizontal layout
sidebar = sidebar.replace(/width: '56px',/g, "width: '48px',");
sidebar = sidebar.replace(/height: '56px',/g, "height: '48px',");
sidebar = sidebar.replace(/fontSize: '24px'/g, "fontSize: '20px'");

fs.writeFileSync(sidebarPath, sidebar, 'utf8');
console.log('✅ Sidebar now horizontal above navigation buttons');
console.log('   - Changed from vertical left sidebar to horizontal bar');
console.log('   - Reduced button sizes (48px)');
console.log('   - Will appear between chat content and navigation\n');

console.log('📋 Summary:');
console.log('  1. Chat widget: Centered on screen');
console.log('  2. Sidebar: Horizontal layout, above Back/Close buttons');
console.log('  3. Button sizes: Reduced for horizontal layout');
