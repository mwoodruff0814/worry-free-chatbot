const fs = require('fs');
const path = require('path');

// Update LiveChatModal
const liveChatPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'LiveChatModal.jsx');
console.log('Adding Portal to LiveChatModal...');

let liveChatContent = fs.readFileSync(liveChatPath, 'utf8');

// Add Portal import
if (!liveChatContent.includes("import Portal from './Portal'")) {
  liveChatContent = liveChatContent.replace(
    "import ringCentralService from '../../../services/ringCentralService';",
    "import ringCentralService from '../../../services/ringCentralService';\nimport Portal from './Portal';"
  );
}

// Wrap the return statement with Portal
liveChatContent = liveChatContent.replace(
  '  return (\n    <div style={{',
  '  return (\n    <Portal>\n    <div style={{'
);

// Add closing Portal tag
liveChatContent = liveChatContent.replace(
  '    </div>\n  );\n};',
  '    </div>\n    </Portal>\n  );\n};'
);

fs.writeFileSync(liveChatPath, liveChatContent, 'utf8');
console.log('✅ LiveChatModal updated with Portal');

// Update ChatSidebar FAQ modal
const sidebarPath = path.join(__dirname, 'src', 'components', 'Modals', 'chat', 'ChatSidebar.jsx');
console.log('Adding Portal to ChatSidebar FAQ modal...');

let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Add Portal import
if (!sidebarContent.includes("import Portal from './Portal'")) {
  sidebarContent = sidebarContent.replace(
    "import LiveChatModal from './LiveChatModal';",
    "import LiveChatModal from './LiveChatModal';\nimport Portal from './Portal';"
  );
}

// Wrap FAQ modal with Portal
sidebarContent = sidebarContent.replace(
  '{showFAQ && (\n        <div style={{',
  '{showFAQ && (\n        <Portal>\n        <div style={{'
);

// Add closing Portal tag for FAQ
sidebarContent = sidebarContent.replace(
  '        </div>\n      )}',
  '        </div>\n        </Portal>\n      )}'
);

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('✅ ChatSidebar FAQ modal updated with Portal');

console.log('\n✅ Both modals now use React Portals!');
console.log('   - Modals render at document.body level');
console.log('   - Position: fixed will work correctly');
console.log('   - True full-screen on all devices');
